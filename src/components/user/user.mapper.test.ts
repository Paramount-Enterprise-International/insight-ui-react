import { describe, expect, it } from 'vitest';

import {
  collectAuthorizationScope,
  collectMenuCodes,
  findFirstLeafRoute,
  findMenuNameById,
  hasAnyMenuCode,
  mapToSidebarUser,
  toIMenu,
  toIMenus,
  toIMenuFavorite,
} from './user.mapper';
import type { ICurrentUserDto, IEffectiveAuthorizationDto, IFavoriteMenuItemDto, IMenuNodeDto } from './user.types';

const NODE: IMenuNodeDto = {
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
    const favorite: IFavoriteMenuItemDto = {
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
    const raw: ICurrentUserDto = {
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


describe('collectAuthorizationScope', () => {
  it('sorts detached companies by name, code and id while preserving authorization mappings', () => {
    const companies = [
      { id: 'z', code: 'Z', name: 'beta' },
      { id: 'b', code: 'A', name: 'ALPHA' },
      { id: 'a', code: 'A', name: 'alpha' },
      { id: 'c', code: 'B', name: 'Alpha' },
    ];
    const items: IEffectiveAuthorizationDto[] = [
      { menuId: 'm1', menuCode: 'sales', type: 'item', companies },
      { menuId: 'm2', menuCode: 'sales', type: 'function', companies: [companies[0]] },
      { menuId: 'm3', menuCode: 'empty', type: 'item', companies: [] },
    ];
    const before = JSON.stringify(items);
    const scope = collectAuthorizationScope(items);
    expect(scope.companies.map((company) => company.id)).toEqual(['a', 'b', 'c', 'z']);
    expect(scope.companyCodes).toEqual(['Z', 'A', 'B']);
    expect(scope.menuCompanies).toEqual({ sales: ['Z', 'A', 'B'], empty: [] });
    expect(JSON.stringify(items)).toBe(before);
    scope.companies[0].name = 'Changed';
    expect(JSON.stringify(items)).toBe(before);
    expect(collectAuthorizationScope([]).companies).toEqual([]);
  });
});
