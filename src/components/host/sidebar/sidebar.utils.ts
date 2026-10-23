import type { IMenu } from '../host-api.types';

export function filterMenuTree(menus: IMenu[], rawTerm: string): IMenu[] {
  const term = (rawTerm ?? '').trim().toLowerCase();
  if (!term) return menus;

  const filtered: IMenu[] = [];
  for (const menu of menus) {
    const result = filterMenuBranch(menu, term);
    if (result) filtered.push(result);
  }

  return filtered;
}

function filterMenuBranch(
  menu: IMenu,
  term: string,
  includeBranch = false
): IMenu | null {
  const name = (menu.menuName ?? '').toLowerCase();
  const selfMatches = includeBranch || name.includes(term);

  const originalChildren = menu.child ?? [];

  const filteredChildren: IMenu[] = [];
  for (const child of originalChildren) {
    const childResult = filterMenuBranch(child, term, selfMatches);
    if (childResult) filteredChildren.push(childResult);
  }

  const childMatches = filteredChildren.length > 0;
  if (!selfMatches && !childMatches) return null;

  const cloned: IMenu = { ...menu, child: filteredChildren };

  if (originalChildren.length && menu.visibility !== 'no-child') {
    cloned.visibility = 'expanded';
  }

  return cloned;
}

export function flattenNavigableMenus(menus: IMenu[]): IMenu[] {
  const result: IMenu[] = [];

  const visit = (menu: IMenu) => {
    const children = menu.child ?? [];
    const hasChildren = children.length > 0;

    const isLeaf =
      menu.type !== 'group' &&
      Number(menu.menuTypeId) === 3 &&
      (!hasChildren || menu.visibility === 'no-child');

    if (isLeaf) result.push(menu);

    for (const c of children) visit(c);
  };

  for (const m of menus) visit(m);

  return result;
}
