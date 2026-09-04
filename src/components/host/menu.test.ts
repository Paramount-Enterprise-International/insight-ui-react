import { describe, expect, it } from 'vitest';

import {
  buildFavoritePathMap,
  collectMenuChain,
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

const DEEP_TREE: IMenu[] = [
  {
    id: 'group-atlas',
    name: 'Atlas React',
    type: 'group',
    children: [
      {
        id: 'group-guide',
        name: 'React Guide',
        type: 'group',
        children: [
          {
            id: 'leaf-button',
            name: 'Button',
            type: 'item',
            route: '/docs/react',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'group-docs',
    name: 'docs',
    type: 'group',
    children: [
      {
        id: 'group-sso',
        name: 'sso',
        type: 'group',
        children: [
          {
            id: 'leaf-index',
            name: 'index',
            type: 'item',
            route: '/docs/sso/index',
            children: [],
          },
        ],
      },
    ],
  },
  { id: 'root-leaf', name: 'Root Favorite', type: 'item', route: '/root', children: [] },
];

describe('collectMenuChain', () => {
  it('returns the root-to-leaf chain for a nested node', () => {
    const tree = normalizeMenuTree(DEEP_TREE);

    const chain = collectMenuChain(tree, 'leaf-index');

    expect(chain?.map((node) => node.name ?? node.menuName)).toEqual(['docs', 'sso', 'index']);
  });

  it('returns null when the node is not in the tree', () => {
    const tree = normalizeMenuTree(DEEP_TREE);

    expect(collectMenuChain(tree, 'missing')).toBeNull();
  });
});

describe('buildFavoritePathMap', () => {
  it('joins ancestor group names (excluding the leaf) with "> "', () => {
    const tree = normalizeMenuTree(DEEP_TREE);

    const map = buildFavoritePathMap(tree, [
      { id: 'leaf-index', name: 'index', type: 'item' } as IMenu,
    ]);

    expect(map['leaf-index']).toBe('docs > sso');
  });

  it('resolves the chain from the tree, not from the item route', () => {
    const tree = normalizeMenuTree(DEEP_TREE);

    const map = buildFavoritePathMap(tree, [
      {
        id: 'leaf-button',
        name: 'Button',
        type: 'item',
        route: '/docs/react',
        application: { id: 'app', code: 'ATLAS', name: 'Atlas' },
      } as IMenu,
    ]);

    expect(map['leaf-button']).toBe('Atlas React > React Guide');
  });

  it('maps a missing favorite to undefined', () => {
    const tree = normalizeMenuTree(DEEP_TREE);

    const map = buildFavoritePathMap(tree, [{ id: 'missing', name: 'Ghost', type: 'item' } as IMenu]);

    expect(map['missing']).toBeUndefined();
  });

  it('maps a root-level favorite to an empty string', () => {
    const tree = normalizeMenuTree(DEEP_TREE);

    const map = buildFavoritePathMap(tree, [{ id: 'root-leaf', name: 'Root Favorite', type: 'item' } as IMenu]);

    expect(map['root-leaf']).toBe('');
  });
});
