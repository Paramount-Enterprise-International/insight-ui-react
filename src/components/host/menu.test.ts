import { describe, expect, it } from 'vitest';

import {
  getMenuChildren,
  getMenuKey,
  getMenuLabel,
  isGroupNode,
  isLeafItem,
  isModuleMenu,
  normalizeMenuTree,
} from './menu';
import type { IMenu } from './host-api.types';

const MODERN: IMenu = {
  id: 'm1',
  name: 'Sales Report',
  type: 'item',
  menuCode: 'sales:report',
  route: '/sales/report',
  icon: 'fa fa-chart',
  children: [],
};

describe('host/menu helpers', () => {
  it('prefers modern id/menuId for the menu key', () => {
    expect(getMenuKey({ id: 'uuid', menuId: 5 })).toBe('uuid');
    expect(getMenuKey({ menuId: 5 })).toBe(5);
  });

  it('prefers modern name over legacy menuName', () => {
    expect(getMenuLabel({ name: 'Modern', menuName: 'Legacy' })).toBe('Modern');
    expect(getMenuLabel({ menuName: 'Legacy' })).toBe('Legacy');
  });

  it('prefers modern children over legacy child', () => {
    const child: IMenu = { menuId: 2, menuName: 'child' };
    expect(getMenuChildren({ children: [child], child: [] })).toEqual([child]);
  });

  it('classifies modern node types', () => {
    expect(isLeafItem(MODERN)).toBe(true);
    expect(isGroupNode({ id: 'g', name: 'g', type: 'group', children: [] })).toBe(true);
    expect(isModuleMenu({ menuId: 2, menuTypeId: 2 })).toBe(true);
  });

  it('normalizes modern menus into the legacy shape IHMenu renders', () => {
    const tree = [
      {
        id: 'g',
        name: 'Group',
        type: 'group' as const,
        children: [MODERN],
      },
    ];
    const normalized = normalizeMenuTree(tree);
    const group = normalized[0];
    expect(group.menuTypeId).toBe(3);
    expect(group.menuName).toBe('Group');
    expect(group.type).toBeUndefined();
    expect(group.children).toBeUndefined();
    expect(group.child?.[0]?.menuName).toBe('Sales Report');
    expect(group.child?.[0]?.id).toBe('m1'); // modern extras preserved
    expect(group.child?.[0]?.level).toBe(1);
  });
});
