import { getMenuKey, type IMenu, type IUser } from '../host';
import type { SessionService } from '../session/session.service';
import {
  type IInsightCurrentUser,
  type IInsightFavoriteMenuItem,
  type IInsightMenuNode,
  type CurrentUserService,
  type UserMenuService,
} from '../user';
import {
  findFirstLeafRoute,
  findMenuNameById,
  hasAnyMenuCode,
  mapToSidebarUser,
  toIMenuFavorite,
  toIMenus,
} from '../user/user.mapper';

/**
 * In-memory store for the current user's sidebar data — user profile, effective
 * navigation menus, favorites — and permission checks (React analog of the
 * Angular `IUserMenuStore`).
 *
 * Everything lives in memory; NOTHING is persisted to Web Storage. On a cold
 * start (page load) consumers call `load()` to re-fetch user, menus and
 * favorites; the store then re-emits so gated UI (`usePermission` /
 * `<HasMn>`) re-renders reactively once data is available (async-aware).
 *
 * Observable store: `subscribe` + `getVersion` for `useSyncExternalStore`.
 */
export class UserMenuStore {
  private readonly currentUserService: CurrentUserService;
  private readonly menuService: UserMenuService;
  private readonly session: SessionService;

  private currentUserValue: IUser | null = null;
  private rawCurrentUserValue: IInsightCurrentUser | null = null;
  private menusValue: IMenu[] = [];
  private favoritesValue: IMenu[] = [];
  private rolesValue: string[] = [];
  private initializingValue = false;
  private loadErrorValue: string | null = null;

  private version = 0;
  private listeners = new Set<() => void>();

  constructor(
    currentUserService: CurrentUserService,
    menuService: UserMenuService,
    session: SessionService,
  ) {
    this.currentUserService = currentUserService;
    this.menuService = menuService;
    this.session = session;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = (): number => this.version;

  private notify(): void {
    this.version++;
    this.listeners.forEach((listener) => listener());
  }

  /** Sidebar-shaped current user (`IUser`) — `null` until loaded. */
  get currentUser(): IUser | null {
    return this.currentUserValue;
  }

  /** Raw current-user DTO as returned by the backend — `null` until loaded. */
  get rawCurrentUser(): IInsightCurrentUser | null {
    return this.rawCurrentUserValue;
  }

  /** Effective navigation tree (`IMenu` modern shape). */
  get menus(): IMenu[] {
    return this.menusValue;
  }

  /** Favorite menus (`IMenu` modern shape). */
  get favorites(): IMenu[] {
    return this.favoritesValue;
  }

  /** Roles decoded from the access token (for `source: 'role'` permission checks). */
  get roles(): string[] {
    return this.rolesValue;
  }

  /** True while the cold-start `load()` is in flight. */
  get initializing(): boolean {
    return this.initializingValue;
  }

  /** First error encountered during `load()`, if any (e.g. `menus: ...`). */
  get loadError(): string | null {
    return this.loadErrorValue;
  }

  /**
   * Post-login default landing (when no return URL is present).
   * Order: (1) first navigable favorite route, (2) first navigable menu route.
   */
  get defaultRoute(): string | null {
    return findFirstLeafRoute(this.favoritesValue) ?? findFirstLeafRoute(this.menusValue);
  }

  /** Finds a menu node's display name by id (recursive), or null. */
  findMenuName(menuId: string | number): string | null {
    return findMenuNameById(this.menusValue, menuId);
  }

  /**
   * Cold-start: fetch user + menus + favorites concurrently. A failure in one
   * branch does not block the others; `initializing` clears once all settle.
   * Resolves when the load settles, so callers can await it (e.g. to navigate
   * to `defaultRoute` after login).
   */
  async load(): Promise<void> {
    if (this.initializingValue) {
      // already in-flight — wait until it settles
      await this.waitUntilSettled();
      return;
    }
    this.initializingValue = true;
    this.loadErrorValue = null;
    this.rolesValue = this.session.getRoles();
    this.notify();

    await Promise.all([
      this.loadUserInternal().catch((err) => this.recordError('user', err)),
      this.loadMenusInternal().catch((err) => this.recordError('menus', err)),
      this.loadFavoritesInternal().catch((err) => this.recordError('favorites', err)),
    ]);

    this.initializingValue = false;
    this.notify();
  }

  private async waitUntilSettled(): Promise<void> {
    while (this.initializingValue) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  /** Refresh roles from the current access token (call after login / token change). */
  syncRoles(): void {
    this.rolesValue = this.session.getRoles();
    this.notify();
  }

  /** Menu-mode permission check against the in-memory menu codes (ANY match). */
  hasMenu(code: string | string[]): boolean {
    return hasAnyMenuCode(this.menusValue, code);
  }

  /** Role-mode permission check against the in-memory roles. ANY match. */
  hasRole(code: string | string[]): boolean {
    const roles = this.rolesValue;
    if (Array.isArray(code)) {
      return code.some((role) => roles.includes(role));
    }
    return roles.includes(code);
  }

  /**
   * Pin (`isFavorite: true`) or unpin a menu item. Flips the star icon in the
   * `menus` tree immediately (optimistic), calls the backend, then re-fetches
   * favorites so the server remains the source of truth. The menu-star change
   * is reverted on error.
   */
  async toggleFavorite(menuId: string | number, isFavorite: boolean): Promise<void> {
    const previousMenus = this.menusValue;
    this.menusValue = this.applyMenuFavorite(previousMenus, menuId, isFavorite);
    this.notify();
    const call = isFavorite
      ? this.menuService.addFavorite(menuId)
      : this.menuService.removeFavorite(menuId);
    try {
      await call;
      await this.reloadFavorites();
    } catch (err) {
      this.menusValue = previousMenus;
      this.notify();
      throw err;
    }
  }

  /**
   * Persists the new favorite order after a drag-drop. Reorders the in-memory
   * `favorites` locally (optimistic) and calls the backend — no GET refetch
   * after the write. The local change is reverted on error.
   */
  async reorderFavorites(menuIds: (string | number)[]): Promise<void> {
    const previous = this.favoritesValue;
    this.favoritesValue = this.applyFavoriteReorder(previous, menuIds);
    this.notify();
    try {
      await this.menuService.reorderFavorites(menuIds);
    } catch (err) {
      this.favoritesValue = previous;
      this.notify();
      throw err;
    }
  }

  /** Re-fetches the favorites from the backend (manual refresh). */
  async reloadFavorites(): Promise<void> {
    await this.loadFavoritesInternal();
  }

  /**
   * Loads the effective navigation tree into `menus` — for one application
   * (`applicationId`) or all active applications when omitted. Returns the
   * mapped `IMenu[]`.
   */
  async loadMenus(applicationId?: string): Promise<IMenu[]> {
    const nodes = await this.menuService.getEffectiveMenus<IInsightMenuNode[]>(applicationId);
    const mapped = toIMenus(nodes);
    this.menusValue = mapped;
    this.notify();
    return mapped;
  }

  /** Loads favorites into `favorites` — optionally for a single application. Returns the mapped `IMenu[]`. */
  async loadFavorites(applicationId?: string): Promise<IMenu[]> {
    const items = await this.menuService.getFavorites<IInsightFavoriteMenuItem[]>(applicationId);
    const mapped = items.map(toIMenuFavorite);
    this.favoritesValue = mapped;
    this.notify();
    return mapped;
  }

  /** Returns a new menu tree with the matching node's `isFavorite` flipped (star icon). */
  private applyMenuFavorite(
    menus: IMenu[],
    menuId: string | number,
    isFavorite: boolean,
  ): IMenu[] {
    return menus.map((menu) => {
      if (getMenuKey(menu) === menuId) {
        return { ...menu, isFavorite };
      }
      if (menu.children?.length) {
        return { ...menu, children: this.applyMenuFavorite(menu.children, menuId, isFavorite) };
      }
      if (menu.child?.length) {
        return { ...menu, child: this.applyMenuFavorite(menu.child, menuId, isFavorite) };
      }
      return menu;
    });
  }

  private applyFavoriteReorder(favorites: IMenu[], menuIds: (string | number)[]): IMenu[] {
    const byId = new Map(favorites.map((favorite) => [String(getMenuKey(favorite)), favorite]));
    const ordered: IMenu[] = [];
    const seen = new Set<string>();
    for (const id of menuIds) {
      const item = byId.get(String(id));
      if (item) {
        ordered.push(item);
        seen.add(String(id));
      }
    }
    for (const favorite of favorites) {
      if (!seen.has(String(getMenuKey(favorite)))) {
        ordered.push(favorite);
      }
    }
    return ordered;
  }

  private async loadUserInternal(): Promise<void> {
    const raw = await this.currentUserService.getCurrentUser<IInsightCurrentUser>();
    this.rawCurrentUserValue = raw;
    this.currentUserValue = mapToSidebarUser(raw);
    this.notify();
  }

  private async loadMenusInternal(): Promise<void> {
    await this.loadMenus();
  }

  private async loadFavoritesInternal(): Promise<void> {
    await this.loadFavorites();
  }

  private recordError(source: string, err: unknown): void {
    const detail = (err as { detail?: string })?.detail ?? 'Failed to load';
    this.loadErrorValue = `${source}: ${detail}`;
    console.error(`[@insight/ui][STORE] load "${source}" failed`, err);
    this.notify();
  }
}
