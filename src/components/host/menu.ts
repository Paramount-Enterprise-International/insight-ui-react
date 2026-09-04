/* =========================================================
 * menu.ts — pure menu helpers (ported from insight-ui-angular host.ts)
 * ========================================================= */

import type { IMenu } from './host-api.types';

export function getMenuRoute(menu: IMenu | null | undefined): string | null {
  return menu?.route?.trim() || null;
}

/**
 * Very intentionally simple:
 * If route starts with "http", never use SPA navigation.
 */
export function isHttpRoute(route: string | null | undefined): boolean {
  return !!route?.trim().toLowerCase().startsWith('http');
}

/**
 * Node key used for tracking and selection — prefers the modern UUID `id`,
 * falls back to the legacy numeric `menuId`.
 */
export function getMenuKey(menu: IMenu | null | undefined): string | number | null {
  return menu?.id ?? menu?.menuId ?? null;
}

/** Display label — prefers the modern `name`, falls back to legacy `menuName`. */
export function getMenuLabel(menu: IMenu | null | undefined): string {
  return menu?.name?.trim() || menu?.menuName || '';
}

/** Children — prefers the modern `children`, falls back to legacy `child`. */
export function getMenuChildren(menu: IMenu | null | undefined): IMenu[] {
  return menu?.children ?? menu?.child ?? [];
}

export function hasMenuChildren(menu: IMenu | null | undefined): boolean {
  return getMenuChildren(menu).length > 0;
}

/**
 * Walks a menu tree (roots -> children) looking for the node whose key matches
 * `targetKey`, returning the chain from the matching root down to that node.
 * Used to resolve a favorite leaf's ancestor path from the sidebar menu tree.
 */
export function collectMenuChain(
  menus: IMenu[] | null | undefined,
  targetKey: string
): IMenu[] | null {
  for (const menu of menus ?? []) {
    if (String(getMenuKey(menu)) === targetKey) {
      return [menu];
    }

    const childChain = collectMenuChain(getMenuChildren(menu), targetKey);

    if (childChain) {
      return [menu, ...childChain];
    }
  }

  return null;
}

/**
 * Builds a per-menu-key ancestor path label map for the sidebar Favorites
 * section. The label is the chain of ancestor NAMES (excluding the leaf itself)
 * joined by "> ", resolved from the full menu tree - never from the item's
 * route, since route and tree position can differ. A favorite that is not
 * found in the tree maps to `undefined` (callers fall back to the app label);
 * a root-level favorite (no ancestors) maps to an empty string.
 */
export function buildFavoritePathMap(
  menus: IMenu[] | null | undefined,
  favorites: IMenu[] | null | undefined
): Record<string, string | undefined> {
  const pathByKey: Record<string, string | undefined> = {};

  for (const favorite of favorites ?? []) {
    const key = getMenuKey(favorite);

    if (key === null) continue;

    const keyString = String(key);
    const chain = collectMenuChain(menus, keyString);

    if (!chain) {
      pathByKey[keyString] = undefined;
      continue;
    }

    const ancestorLabels = chain
      .slice(0, -1)
      .map((node) => getMenuLabel(node))
      .filter((label) => label.length > 0);

    pathByKey[keyString] = ancestorLabels.join(' > ');
  }

  return pathByKey;
}

/** True for a legacy top-level module header (menuTypeId === 2). */
export function isModuleMenu(menu: IMenu | null | undefined): boolean {
  if (!menu) return false;
  if (menu.type) return false;
  return Number(menu.menuTypeId) === 2;
}

/** True for a structural group/module node (non-navigable container). */
export function isGroupNode(menu: IMenu | null | undefined): boolean {
  if (!menu) return false;
  if (menu.type) return menu.type === 'group';
  const typeId = Number(menu.menuTypeId);
  return typeId === 2 || (typeId === 3 && hasMenuChildren(menu));
}

/** True for a navigable leaf node (item / function / legacy leaf menu). */
export function isLeafItem(menu: IMenu | null | undefined): boolean {
  if (!menu) return false;
  if (menu.type) return menu.type === 'item' || menu.type === 'function';
  return Number(menu.menuTypeId) === 3 && !hasMenuChildren(menu);
}

export function isNewTabMenu(menu: IMenu | null | undefined): boolean {
  const route = getMenuRoute(menu);

  if (!route) return false;
  if (menu?.openIn) return menu.openIn === 'NEW_TAB' || menu.openIn === 'NEW_WINDOW';

  return !!menu?.openInNewTab;
}

export function isReloadMenu(menu: IMenu | null | undefined): boolean {
  const route = getMenuRoute(menu);

  if (!route) return false;
  if (menu?.openIn) {
    return menu.openIn === 'CURRENT_TAB' && isHttpRoute(route);
  }
  if (menu?.openInNewTab) return false;

  return !!menu?.reload || isHttpRoute(route);
}

export function isSpaMenu(menu: IMenu | null | undefined): boolean {
  const route = getMenuRoute(menu);

  if (!route) return false;
  if (menu?.openIn) return menu.openIn === 'CURRENT_TAB' && !isHttpRoute(route);
  if (menu?.openInNewTab) return false;
  if (menu?.reload) return false;
  if (isHttpRoute(route)) return false;

  return true;
}

const isModernMenu = (menu: IMenu): boolean => !!menu.type;

function normalizeMenu(menu: IMenu, level: number): IMenu {
  if (!isModernMenu(menu)) return menu;

  const children = getMenuChildren(menu);

  const normalized: IMenu = {
    ...menu,
    menuName: getMenuLabel(menu),
    menuTypeId: 3,
    parentId: 0,
    sequence: Number(menu.sequence) || 0,
    level,
    child: children.map((child) => normalizeMenu(child, level + 1)),
    children: undefined,
    name: undefined,
    type: undefined,
  };

  return normalized;
}

/**
 * Converts modern (contract-aligned) menu nodes into the legacy `IMenu` shape
 * that `IHMenu` renders. Modern extras (`id`, `isFavorite`, `application`,
 * `companies`, `openIn`, `route`, `icon`) are preserved for pin / favorites /
 * application-grouping rendering. Legacy nodes pass through untouched.
 */
export function normalizeMenuTree(menus: IMenu[] | null | undefined): IMenu[] {
  return (menus ?? []).map((menu) => normalizeMenu(menu, 0));
}
