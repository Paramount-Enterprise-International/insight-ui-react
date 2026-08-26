import { describe, expect, it } from 'vitest';

import {
  collectMenuCodes,
  findFirstLeafRoute,
  findMenuNameById,
  hasAnyMenuCode,
  mapToSidebarUser,
  toIMenu,
  toIMenus,
  toIMenuFavorite,
} from './user.mapper';
import type { IInsightCurrentUser, IInsightFavoriteMenuItem, IInsightMenuNode } from './user.types';

const NODE: IInsightMenuNode = {
  id: 'm1',
  name: 'Sales Report',
  type: 'item',
  menuCode: 'sales:report',
  parentId: null,
  route: '/sales/report',
  icon: 'fa fa-chart',
  openIn: 'CURRENT_TAB',
  sequence: 1,
  application: { id: 'app1', code: 'SALES', name: 'Sales', url: null, version: null },
  companies: [{ id: 'c1', code: 'C1', name: 'Company 1' }],
  isFavorite: false,
  children: [],
};

describe('user.mapper', () => {
  it('maps a backend menu node to the modern IMenu shape', () => {
    const menu = toIMenu(NODE);
    expect(menu.id).toBe('m1');
    expect(menu.name).toBe('Sales Report');
    expect(menu.type).toBe('item');
    expect(menu.menuCode).toBe('sales:report');
    expect(menu.application?.code).toBe('SALES');
    expect(menu.isFavorite).toBe(false);
  });

  it('maps arrays via toIMenus', () => {
    expect(toIMenus([NODE])).toHaveLength(1);
  });

  it('maps favorites with isFavorite = true', () => {
    const favorite: IInsightFavoriteMenuItem = {
      id: 'f1',
      name: 'Report',
      displayOrder: 1,
      menuCode: null,
      route: '/x',
      icon: null,
      openIn: null,
      application: { id: 'a', code: 'A', name: 'A', url: null, version: null },
      companies: [],
    };
    expect(toIMenuFavorite(favorite).isFavorite).toBe(true);
  });

  it('collects all menu codes recursively (deduped, ordered)', () => {
    const tree = toIMenus([
      { ...NODE, id: 'a', menuCode: 'x' },
      { ...NODE, id: 'b', menuCode: 'y', children: [{ ...NODE, id: 'c', menuCode: 'x' }] },
    ]);
    expect(collectMenuCodes(tree)).toEqual(['x', 'y']);
  });

  it('checks menu-code membership (ANY match)', () => {
    const menus = toIMenus([NODE, { ...NODE, id: 'm2', menuCode: 'mdm:employee' }]);
    expect(hasAnyMenuCode(menus, 'sales:report')).toBe(true);
    expect(hasAnyMenuCode(menus, ['nope', 'mdm:employee'])).toBe(true);
    expect(hasAnyMenuCode(menus, 'nope')).toBe(false);
    expect(hasAnyMenuCode([], 'sales:report')).toBe(false);
  });

  it('finds the first navigable leaf route (favorites-first caller responsibility)', () => {
    const group = toIMenus([
      {
        ...NODE,
        id: 'g',
        type: 'group' as const,
        menuCode: null,
        children: [NODE, { ...NODE, id: 'm2', route: '/sales/report2' }],
      },
    ]);
    expect(findFirstLeafRoute(group)).toBe('/sales/report');
  });

  it('finds a menu name by id recursively', () => {
    const group = toIMenus([{ ...NODE, id: 'g', type: 'group' as const, children: [NODE] }]);
    expect(findMenuNameById(group, 'm1')).toBe('Sales Report');
    expect(findMenuNameById(group, 'missing')).toBeNull();
  });

  it('maps a current-user DTO to the sidebar IUser shape', () => {
    const raw: IInsightCurrentUser = {
      userId: 'u1',
      username: 'jdoe',
      fullName: 'Jane Doe',
      employeeCode: 'PL1',
      email: 'j@x.co',
      photoUrl: null,
      userType: 'internal',
      occupationName: null,
      departmentName: null,
      enabled: true,
    };
    const user = mapToSidebarUser(raw);
    expect(user.employeeCode).toBe('PL1');
    expect(user.fullName).toBe('Jane Doe');
    expect(user.userImagePath).toBe('');
  });
});
