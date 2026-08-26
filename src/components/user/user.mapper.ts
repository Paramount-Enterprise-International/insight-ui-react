import { getMenuChildren, getMenuKey, getMenuLabel, getMenuRoute, isLeafItem, type IMenu, type IUser } from '../host';

import type { IInsightCurrentUser, IInsightFavoriteMenuItem, IInsightMenuNode } from './user.types';

/**
 * Maps the backend current-user DTO to `@insight/ui`'s sidebar `IUser` shape
 * (`employeeCode` / `fullName` / `userImagePath`), falling back to `username`.
 * `userImagePath` is `''` when no photo exists — the sidebar renders it with
 * `IAvatar`, which falls back to a user icon when the image is empty/errors.
 */
export function mapToSidebarUser(user: IInsightCurrentUser): IUser {
  return {
    employeeCode: user.employeeCode ?? user.username ?? '',
    fullName: user.fullName ?? user.username ?? '',
    userImagePath: user.photoUrl ?? '',
  };
}

/** Maps a backend effective-menu node onto the UI-facing `IMenu` (modern shape). */
export function toIMenu(node: IInsightMenuNode): IMenu {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    menuCode: node.menuCode,
    route: node.route,
    icon: node.icon,
    openIn: node.openIn,
    application: node.application ? { ...node.application } : null,
    companies: node.companies?.map((company) => ({ ...company })) ?? [],
    isFavorite: node.isFavorite,
    children: node.children?.map(toIMenu) ?? [],
  };
}

/** Maps an array of backend effective-menu nodes onto `IMenu[]`. */
export function toIMenus(nodes: IInsightMenuNode[]): IMenu[] {
  return (nodes ?? []).map(toIMenu);
}

/** Maps a backend favorite item onto the UI-facing `IMenu` (modern shape). */
export function toIMenuFavorite(item: IInsightFavoriteMenuItem): IMenu {
  return {
    id: item.id,
    name: item.name,
    menuCode: item.menuCode,
    route: item.route,
    icon: item.icon,
    openIn: item.openIn,
    application: item.application ? { ...item.application } : null,
    companies: item.companies?.map((company) => ({ ...company })) ?? [],
    isFavorite: true,
  };
}

/** Recursively collects every non-null `menuCode` across a menu tree (deduplicated, order preserved). */
export function collectMenuCodes(menus: IMenu[]): string[] {
  const codes = new Set<string>();
  const walk = (nodes: IMenu[]): void => {
    for (const node of nodes) {
      if (node.menuCode) {
        codes.add(node.menuCode);
      }
      walk(getMenuChildren(node));
    }
  };
  walk(menus);
  return [...codes];
}

/**
 * Menu-mode permission check: returns true if the user's loaded menus contain
 * ANY of the given menu codes. An empty set of menus (not yet loaded) always
 * returns `false` — gated UI renders only once the store has data.
 */
export function hasAnyMenuCode(menus: IMenu[], code: string | string[]): boolean {
  const codes = new Set(collectMenuCodes(menus));
  if (Array.isArray(code)) {
    return code.some((item) => codes.has(item));
  }
  return codes.has(code);
}

/** First navigable leaf route in a menu tree — a sensible post-login default landing. */
export function findFirstLeafRoute(menus: IMenu[]): string | null {
  for (const menu of menus) {
    if (isLeafItem(menu)) {
      const route = getMenuRoute(menu);
      if (route) {
        return route;
      }
    }
    const childRoute = findFirstLeafRoute(getMenuChildren(menu));
    if (childRoute) {
      return childRoute;
    }
  }
  return null;
}

/** Finds a menu node's display name by id (recursive), or null. */
export function findMenuNameById(menus: IMenu[], menuId: string | number): string | null {
  for (const menu of menus) {
    if (getMenuKey(menu) === menuId) {
      const label = getMenuLabel(menu);
      return label || null;
    }
    const child = findMenuNameById(getMenuChildren(menu), menuId);
    if (child) {
      return child;
    }
  }
  return null;
}
