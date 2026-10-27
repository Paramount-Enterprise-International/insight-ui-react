import type { IMenu } from '../host-api.types';
import { normalizeMenuTree } from '../menu';
import { getSidebarMenuKey, SidebarMenuState } from './sidebar-menu-state';
import { flattenNavigableMenus, SidebarSearchState } from './sidebar.utils';

const menus: IMenu[] = [
  {
    id: 'root',
    name: 'Root',
    type: 'group',
    children: [
      {
        id: 'nested',
        name: 'Nested',
        type: 'group',
        children: [{ id: 'page', name: 'Page', type: 'item', route: '/page' }],
      },
    ],
  },
  {
    menuId: 10,
    menuName: 'Legacy module',
    menuTypeId: 2,
    child: [
      { menuId: 11, menuName: 'Legacy page', menuTypeId: 3, route: '/legacy' },
    ],
  },
];

function projected(nodes = menus): IMenu[] {
  return new SidebarMenuState(null).project(normalizeMenuTree(nodes));
}

describe('Sidebar search expansion', () => {
  it('keeps root, nested and legacy toggles separate from normal expansion', () => {
    const nodes = projected();
    const before = structuredClone(menus);
    const search = new SidebarSearchState('Root');
    let result = search.filter(nodes);
    expect(result[0].visibility).toBe('expanded');
    expect(result[0].child![0].visibility).toBe('expanded');
    search.setExpanded({ menu: result[0].child![0], expanded: false });
    result = search.filter(nodes);
    expect(result[0].child![0].visibility).toBe('collapsed');
    expect(flattenNavigableMenus(result, true)).toEqual([]);
    expect(flattenNavigableMenus(result, false).length).toBe(1);
    search.setExpanded({ menu: result[0], expanded: false });
    expect(search.filter(nodes)[0].visibility).toBe('collapsed');
    search.setExpanded({ menu: result[0], expanded: true });
    expect(search.filter(nodes)[0].visibility).toBe('expanded');

    search.setTerm('Legacy module');
    result = search.filter(nodes);
    search.setExpanded({ menu: result[0], expanded: false });
    expect(search.filter(nodes)[0].visibility).toBe('collapsed');
    search.setExpanded({ menu: result[0], expanded: true });
    expect(search.filter(nodes)[0].visibility).toBe('expanded');
    search.setTerm('');
    expect(search.filter(nodes)).toBe(nodes);
    expect(menus).toEqual(before);
  });

  it('preserves keyed choices through replacement and empty menu arrays until the term changes', () => {
    const search = new SidebarSearchState('Page');
    const root = search.filter(projected())[0];
    const key = getSidebarMenuKey(root);
    search.setExpanded({ menu: root, expanded: false });
    expect(search.setTerm(' Page ')).toBe(false);
    expect(search.filter([])).toEqual([]);
    const replacement = search.filter(projected(structuredClone(menus)));
    expect(getSidebarMenuKey(replacement[0])).toBe(key);
    expect(replacement[0].visibility).toBe('collapsed');
    search.setTerm('Root');
    expect(search.filter(projected())[0].visibility).toBe('expanded');
  });

  it('opens the whole matching branch and removes unrelated leaves', () => {
    const search = new SidebarSearchState('Root');
    expect(
      flattenNavigableMenus(search.filter(projected()), true).map((m) => m.id)
    ).toEqual(['page']);
    search.setTerm('Legacy page');
    expect(search.filter(projected()).length).toBe(1);
    search.setTerm('missing');
    expect(search.filter(projected())).toEqual([]);
  });

  it('does not intercept Favorites or no-child menu expansion', () => {
    const search = new SidebarSearchState('Page');
    const group = new SidebarMenuState(null).project(
      [{ id: 'favorites', name: 'Favorites', type: 'group' }],
      'favorites'
    )[0];
    expect(search.setExpanded({ menu: group, expanded: false })).toBe(false);
    const leaf = projected()[0];
    leaf.visibility = 'no-child';
    expect(search.setExpanded({ menu: leaf, expanded: false })).toBe(false);
    search.setTerm('');
    expect(search.setExpanded({ menu: projected()[0], expanded: false })).toBe(
      false
    );
  });
});
