import type { IMenu } from '../host-api.types';

const STATE_KEY = Symbol('sidebarMenuStateKey');
const ACTIVE_KEY = Symbol('sidebarMenuActive');
const ACTIVE_MENU_SCROLL_OFFSET = 16;
type StateMenu = IMenu & { [STATE_KEY]?: string; [ACTIVE_KEY]?: boolean };
type MenuScope = 'main' | 'favorites';

export type MenuExpansionChange = { menu: IMenu; expanded: boolean };

/** Identifies rendered menu rows independently of search selection and drag IDs. */
export function getSidebarMenuKey(menu: IMenu | undefined): string | undefined {
  return (menu as StateMenu | undefined)?.[STATE_KEY];
}

export function isSidebarMenuActive(menu: IMenu | undefined): boolean {
  return (menu as StateMenu | undefined)?.[ACTIVE_KEY] === true;
}

export function createFavoritesMenu(favorites: IMenu[]): IMenu[] {
  return favorites.length
    ? [
        {
          id: 'favorites',
          name: 'Favorites',
          type: 'group',
          icon: 'fa-solid fa-star',
          children: favorites,
        },
      ]
    : [];
}

function children(menu: IMenu): IMenu[] {
  return menu.children ?? menu.child ?? [];
}

function stateKey(menu: IMenu, scope: MenuScope, path: string): string {
  if (scope === 'favorites' && path === '0') return 'favorites:group';
  if (menu.id !== undefined && menu.id !== null)
    return `${scope}:id:${menu.id}`;
  if (menu.menuId !== undefined && menu.menuId !== null)
    return `${scope}:menuId:${menu.menuId}`;
  return `${scope}:path:${path}`;
}

function persistentKey(key: string): boolean {
  return (
    key === 'favorites:group' || /^(main|favorites):(id|menuId):.+$/.test(key)
  );
}

function normalizePath(value: string, baseHref: string): string {
  let path = '/' + value.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  path = path.replace(/\/{2,}/g, '/');
  const base = '/' + baseHref.replace(/^\/+|\/+$/g, '');
  if (base !== '/' && (path === base || path.startsWith(base + '/'))) {
    path = path.slice(base.length) || '/';
  }
  return path;
}

function isRouteLeaf(menu: IMenu): boolean {
  return (
    menu.type !== 'group' &&
    Number(menu.menuTypeId) !== 2 &&
    (!children(menu).length || menu.visibility === 'no-child')
  );
}

function findRouteChain(
  nodes: IMenu[],
  target: string,
  baseHref: string
): IMenu[] {
  let best: IMenu[] = [];
  let length = -1;
  const visit = (items: IMenu[], ancestors: IMenu[]): void => {
    for (const menu of items) {
      const chain = [...ancestors, menu];
      const route = menu.route?.trim();
      if (
        isRouteLeaf(menu) &&
        route &&
        !/^(?:[a-z][a-z\d+.-]*:|\/\/|[?#])/i.test(route)
      ) {
        const candidate = normalizePath(route, baseHref);
        if (
          (target === candidate ||
            (candidate !== '/' && target.startsWith(candidate + '/'))) &&
          candidate.length > length
        ) {
          best = chain;
          length = candidate.length;
        }
      }
      visit(children(menu), chain);
    }
  };
  visit(nodes, []);
  return best;
}

/** Resolves the current menu independently of one-time expansion and scrolling. */
export function resolveSidebarActiveMenu(
  menus: IMenu[],
  favorites: IMenu[],
  path: string,
  baseHref = '/'
): IMenu | undefined {
  const target = normalizePath(path, baseHref);
  let chain = findRouteChain(menus, target, baseHref);
  if (!chain.length) chain = findRouteChain(favorites, target, baseHref);
  return chain[chain.length - 1];
}

/** Sidebar-owned expansion preferences and one-time active-route restoration. */
export class SidebarMenuState {
  private storageKey: string | null | undefined;
  private readonly storage: () => Storage;
  private choices = new Map<string, boolean>();
  private forcedExpanded = new Set<string>();
  private initialPath: string | undefined;
  private baseHref = '/';
  private canceled = false;
  private target:
    | { key: string; ancestors: string[]; scope: MenuScope }
    | undefined;
  private scrolled = false;
  private interacted = false;

  constructor(
    key: string | null,
    storage: () => Storage = () => window.localStorage
  ) {
    this.storage = storage;
    this.configureStorage(key);
  }

  configureStorage(key: string | null): boolean {
    if (key === this.storageKey) return false;
    this.storageKey = key;
    this.choices = new Map();
    if (key === null) return true;
    try {
      const raw: unknown = JSON.parse(this.storage().getItem(key) ?? 'null');
      if (
        !raw ||
        typeof raw !== 'object' ||
        !('version' in raw) ||
        raw.version !== 1 ||
        !('expanded' in raw) ||
        !raw.expanded ||
        typeof raw.expanded !== 'object' ||
        Array.isArray(raw.expanded)
      )
        return true;
      for (const [id, expanded] of Object.entries(raw.expanded)) {
        if (persistentKey(id) && typeof expanded === 'boolean')
          this.choices.set(id, expanded);
      }
    } catch {
      // Invalid or inaccessible storage leaves preferences in memory.
    }
    return true;
  }

  project(
    menus: IMenu[],
    scope: MenuScope = 'main',
    activeMenu?: IMenu
  ): IMenu[] {
    const activeId = activeMenu?.id ?? activeMenu?.menuId;
    const visit = (nodes: IMenu[], prefix: string): IMenu[] =>
      nodes.map((menu, index) => {
        const path = prefix ? `${prefix}.${index}` : String(index);
        const key = stateKey(menu, scope, path);
        const copy: StateMenu = {
          ...menu,
          [STATE_KEY]: key,
          [ACTIVE_KEY]:
            isRouteLeaf(menu) &&
            (menu === activeMenu ||
              (activeId !== undefined &&
                activeId !== null &&
                (menu.id ?? menu.menuId) === activeId)),
        };
        if (menu.children !== undefined)
          copy.children = visit(menu.children, path);
        if (menu.child !== undefined) copy.child = visit(menu.child, path);
        const group =
          menu.type === 'group' ||
          Number(menu.menuTypeId) === 2 ||
          children(menu).length > 0;
        if (group && menu.visibility !== 'no-child') {
          const expanded = this.forcedExpanded.has(key)
            ? true
            : this.choices.get(key);
          if (expanded !== undefined)
            copy.visibility = expanded ? 'expanded' : 'collapsed';
        }
        return copy;
      });
    return visit(menus, '');
  }

  setExpanded({ menu, expanded }: MenuExpansionChange): void {
    const key = getSidebarMenuKey(menu);
    if (!key || menu.visibility === 'no-child') return;
    this.interacted = true;
    this.choices.set(key, expanded);
    this.forcedExpanded.delete(key);
    if (!expanded && this.target?.ancestors.includes(key)) this.scrolled = true;
    if (this.storageKey === null || this.storageKey === undefined) return;
    try {
      const stored = Object.fromEntries(
        [...this.choices].filter(([id]) => persistentKey(id))
      );
      this.storage().setItem(
        this.storageKey,
        JSON.stringify({ version: 1, expanded: stored })
      );
    } catch {
      // Keep menu interactions available when storage is blocked or full.
    }
  }

  observeLocation(path: string, baseHref = '/'): void {
    const normalized = normalizePath(path, baseHref);
    if (this.initialPath !== undefined && this.initialPath !== normalized)
      this.canceled = true;
    this.initialPath ??= normalized;
    this.baseHref = baseHref;
  }

  get hasLocation(): boolean {
    return this.initialPath !== undefined;
  }

  restore(menus: IMenu[], favorites: IMenu[] = []): boolean {
    if (
      this.initialPath === undefined ||
      this.canceled ||
      (this.target && (this.target.scope === 'main' || this.interacted))
    )
      return false;
    let chain = findRouteChain(
      this.project(menus),
      this.initialPath,
      this.baseHref
    );
    let scope: MenuScope = 'main';
    if (!chain.length) {
      if (this.target) return false;
      chain = findRouteChain(
        this.project(favorites, 'favorites'),
        this.initialPath,
        this.baseHref
      );
      scope = 'favorites';
    }
    if (!chain.length) return false;
    const key = getSidebarMenuKey(chain[chain.length - 1])!;
    const ancestors = chain
      .slice(0, -1)
      .map((menu) => getSidebarMenuKey(menu)!);
    // Prefer a hydrated main-tree match over a provisional Favorites target.
    for (const ancestor of this.target?.ancestors ?? [])
      this.forcedExpanded.delete(ancestor);
    this.target = { key, ancestors, scope };
    this.scrolled = false;
    for (const ancestor of ancestors) this.forcedExpanded.add(ancestor);
    return true;
  }

  scrollToActive(host: HTMLElement, visible: boolean): void {
    if (!visible || this.canceled || !this.target || this.scrolled) return;
    const body = host.querySelector<HTMLElement>('.ih-sidebar-body');
    const row = [
      ...host.querySelectorAll<HTMLElement>('a[data-sidebar-menu-key]'),
    ].find(
      (element) =>
        element.getAttribute('data-sidebar-menu-key') === this.target!.key
    );
    if (!body || !row || row.closest('ul.collapsed')) return;
    const viewport = body.getBoundingClientRect();
    const bounds = row.getBoundingClientRect();
    if (!viewport.height || !bounds.height) return;
    body.scrollTop = Math.max(
      0,
      body.scrollTop + bounds.top - viewport.top - ACTIVE_MENU_SCROLL_OFFSET
    );
    this.scrolled = true;
  }
}
