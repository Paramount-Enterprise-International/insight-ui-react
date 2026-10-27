import type { IMenu } from '../host-api.types';
import { getMenuChildren, getMenuLabel } from '../menu';
import {
  getSidebarMenuKey,
  type MenuExpansionChange,
} from './sidebar-menu-state';

/** Temporary expansion choices for the currently applied search term. */
export class SidebarSearchState {
  term = '';
  private readonly expanded = new Map<string, boolean>();

  constructor(term = '') {
    this.setTerm(term);
  }

  setTerm(value: string): boolean {
    const term = value.trim();
    if (term === this.term) return false;
    this.term = term;
    this.expanded.clear();
    return true;
  }

  setExpanded({ menu, expanded }: MenuExpansionChange): boolean {
    const key = getSidebarMenuKey(menu);
    if (
      !this.term ||
      !key?.startsWith('main:') ||
      menu.visibility === 'no-child'
    )
      return false;
    this.expanded.set(key, expanded);
    return true;
  }

  filter(menus: IMenu[]): IMenu[] {
    return filterMenuTree(menus, this.term, this.expanded);
  }
}

export function filterMenuTree(
  menus: IMenu[],
  rawTerm: string,
  expanded: ReadonlyMap<string, boolean> = new Map()
): IMenu[] {
  const term = (rawTerm ?? '').trim().toLowerCase();
  if (!term) return menus;

  const filtered: IMenu[] = [];
  for (const menu of menus) {
    const result = filterMenuBranch(menu, term, expanded);
    if (result) filtered.push(result);
  }

  return filtered;
}

function filterMenuBranch(
  menu: IMenu,
  term: string,
  expanded: ReadonlyMap<string, boolean>,
  includeBranch = false
): IMenu | null {
  const name = getMenuLabel(menu).toLowerCase();
  const selfMatches = includeBranch || name.includes(term);

  const originalChildren = getMenuChildren(menu);

  const filteredChildren: IMenu[] = [];
  for (const child of originalChildren) {
    const childResult = filterMenuBranch(child, term, expanded, selfMatches);
    if (childResult) filteredChildren.push(childResult);
  }

  const childMatches = filteredChildren.length > 0;
  if (!selfMatches && !childMatches) return null;

  const cloned: IMenu = {
    ...menu,
    child: filteredChildren,
    children: undefined,
  };

  if (originalChildren.length && menu.visibility !== 'no-child') {
    const key = getSidebarMenuKey(menu);
    cloned.visibility =
      key && expanded.get(key) === false ? 'collapsed' : 'expanded';
  }

  return cloned;
}

export function flattenNavigableMenus(
  menus: IMenu[],
  collapsible = false
): IMenu[] {
  const result: IMenu[] = [];

  const visit = (menu: IMenu): void => {
    const children = getMenuChildren(menu);
    const hasChildren = children.length > 0;

    const isLeaf =
      menu.type !== 'group' &&
      Number(menu.menuTypeId) === 3 &&
      (!hasChildren || menu.visibility === 'no-child');

    if (isLeaf) result.push(menu);

    if (collapsible && menu.visibility === 'collapsed') return;

    for (const c of children) visit(c);
  };

  for (const m of menus) visit(m);

  return result;
}
