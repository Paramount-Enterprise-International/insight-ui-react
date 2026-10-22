import type { IMenu } from '../host-api.types';
import {
  createFavoritesMenu,
  getSidebarMenuKey,
  isSidebarMenuActive,
  resolveSidebarActiveMenu,
  SidebarMenuState,
} from './sidebar-menu-state';

const key = 'sidebar-test-state';
const tree: IMenu[] = [
  {
    id: 'root',
    name: 'Root',
    type: 'group',
    children: [
      {
        id: 'nested',
        name: 'Nested',
        type: 'group',
        children: [
          { id: 'active', name: 'Active', type: 'item', route: '/people' },
          {
            id: 'detail',
            name: 'Detail',
            type: 'item',
            route: '/people/details',
          },
        ],
      },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    type: 'group',
    children: [
      { id: 'other-leaf', name: 'Other leaf', type: 'item', route: '/other' },
    ],
  },
];

function child(menu: IMenu): IMenu[] {
  return menu.children ?? menu.child ?? [];
}

describe('Sidebar menu state parity', () => {
  let stored: Map<string, string>;
  let storage: Storage;

  function state(storageKey: string | null = key): SidebarMenuState {
    return new SidebarMenuState(storageKey, () => storage);
  }

  function choose(
    instance: SidebarMenuState,
    id: string,
    expanded: boolean
  ): void {
    const find = (menus: IMenu[]): IMenu | undefined => {
      for (const menu of menus) {
        if (menu.id === id) return menu;
        const found = find(child(menu));
        if (found) return found;
      }
      return undefined;
    };
    instance.setExpanded({ menu: find(instance.project(tree))!, expanded });
  }

  beforeEach(() => {
    stored = new Map();
    storage = {
      getItem: (name: string): string | null => stored.get(name) ?? null,
      setItem: (name: string, value: string): void => {
        stored.set(name, value);
      },
    } as Storage;
  });

  it('restores manual group choices after remount without mutating consumer data', () => {
    const instance = state();
    choose(instance, 'root', false);
    choose(instance, 'nested', true);
    const restored = state().project(tree);
    expect(restored[0].visibility).toBe('collapsed');
    expect(child(restored[0])[0].visibility).toBe('collapsed');
    expect(tree[0].visibility).toBeUndefined();
    expect(tree[0].children![0].visibility).toBeUndefined();
    expect(restored[0] === tree[0]).toBe(false);
    expect(child(restored[0])[0] === tree[0].children![0]).toBe(false);
  });

  it('preserves choices through empty emissions, new references and reordered data', () => {
    const instance = state();
    choose(instance, 'root', false);
    expect(instance.project([])).toEqual([]);
    const replacement = JSON.parse(
      JSON.stringify([...tree].reverse())
    ) as IMenu[];
    expect(instance.project(replacement)[1].visibility).toBe('collapsed');
    expect(state().project(replacement)[1].visibility).toBe('collapsed');
  });

  it('uses legacy IDs and leaves no-child nodes unchanged', () => {
    const legacy: IMenu[] = [
      {
        menuId: 7,
        menuTypeId: 2,
        child: [
          {
            menuId: 8,
            menuTypeId: 3,
            visibility: 'no-child',
            route: '/people',
          },
        ],
      },
    ];
    const instance = state();
    const projected = instance.project(legacy);
    instance.setExpanded({ menu: projected[0], expanded: false });
    instance.setExpanded({ menu: projected[0].child![0], expanded: false });
    expect(state().project(legacy)[0].visibility).toBe('collapsed');
    expect(state().project(legacy)[0].child![0].visibility).toBe('no-child');
  });

  it('keeps ID-less groups functional in memory without persisting positional IDs', () => {
    const nodes: IMenu[] = [{ type: 'group', name: 'No ID', children: [] }];
    const instance = state();
    instance.setExpanded({ menu: instance.project(nodes)[0], expanded: false });
    expect(instance.project(nodes)[0].visibility).toBe('collapsed');
    expect(state().project(nodes)[0].visibility).toBeUndefined();
    expect(stored.get(key)).toBe('{"version":1,"expanded":{}}');
  });

  it('isolates custom keys and allows persistence to be disabled', () => {
    choose(state('custom'), 'root', false);
    expect(state('custom').project(tree)[0].visibility).toBe('collapsed');
    expect(state().project(tree)[0].visibility).toBeUndefined();
    const memory = state(null);
    choose(memory, 'root', false);
    expect(memory.project(tree)[0].visibility).toBe('collapsed');
    expect(state(null).project(tree)[0].visibility).toBeUndefined();
    expect(stored.has(key)).toBe(false);
  });

  for (const raw of [
    'bad',
    'null',
    '[]',
    '{"version":2,"expanded":{}}',
    '{"version":1,"expanded":[]}',
  ]) {
    it(`ignores invalid storage: ${raw}`, () => {
      stored.set(key, raw);
      expect(state().project(tree)[0].visibility).toBeUndefined();
    });
  }

  it('ignores malformed entries and IDs absent from the current tree', () => {
    stored.set(
      key,
      JSON.stringify({
        version: 1,
        expanded: {
          'main:id:root': false,
          'main:id:nested': 'collapsed',
          'main:id:missing': false,
          __proto__: true,
        },
      })
    );
    const projected = state().project(tree);
    expect(projected[0].visibility).toBe('collapsed');
    expect(child(projected[0])[0].visibility).toBe('collapsed');
  });

  it('defaults nested containers to collapsed using tree depth instead of payload levels', () => {
    const nodes: IMenu[] = [
      {
        id: 'module',
        menuTypeId: 2,
        level: 9,
        child: [
          {
            menuId: 8,
            menuTypeId: 3,
            level: 0,
            visibility: 'expanded',
            child: [{ menuId: 9, menuTypeId: 3, route: '/legacy' }],
          },
        ],
      },
    ];
    const projected = state().project(nodes);
    expect(projected[0].visibility).toBeUndefined();
    expect(child(projected[0])[0].visibility).toBe('collapsed');
    expect(child(child(projected[0])[0])[0].visibility).toBeUndefined();
    expect(child(nodes[0])[0].visibility).toBe('expanded');
    expect(state().project(tree)[0].visibility).toBeUndefined();
    expect(child(state().project(tree)[0])[0].visibility).toBe('collapsed');
  });

  it('ignores old nested preferences and writes only known roots from both scopes', () => {
    const raw = JSON.stringify({
      version: 1,
      expanded: {
        'main:id:root': false,
        'main:id:nested': true,
        'main:id:missing': true,
        'favorites:group': false,
      },
    });
    stored.set(key, raw);
    const instance = state();
    const favorites = createFavoritesMenu([tree[0].children![0].children![0]]);
    instance.project(favorites, 'favorites');
    expect(child(instance.project(tree)[0])[0].visibility).toBe('collapsed');
    expect(stored.get(key)).toBe(raw);
    instance.project([]);
    choose(instance, 'nested', true);
    expect(child(instance.project(tree)[0])[0].visibility).toBe('expanded');
    expect(JSON.parse(stored.get(key)!).expanded).toEqual({
      'main:id:root': false,
      'favorites:group': false,
    });
    choose(instance, 'other', false);
    expect(JSON.parse(stored.get(key)!).expanded).toEqual({
      'main:id:root': false,
      'main:id:other': false,
      'favorites:group': false,
    });
    expect(child(state().project(tree)[0])[0].visibility).toBe('collapsed');
  });

  it('keeps nested choices in memory through empty emissions and replacement arrays', () => {
    const instance = state();
    choose(instance, 'nested', true);
    instance.project([]);
    const replacement = structuredClone([...tree].reverse());
    expect(child(instance.project(replacement)[1])[0].visibility).toBe(
      'expanded'
    );
    expect(child(state().project(replacement)[1])[0].visibility).toBe(
      'collapsed'
    );
    expect(JSON.parse(stored.get(key)!).expanded).toEqual({});
  });

  it('persists only root legacy IDs while keeping nested legacy choices in memory', () => {
    const nodes: IMenu[] = [
      {
        menuId: 1,
        menuTypeId: 2,
        child: [
          {
            menuId: 2,
            menuTypeId: 3,
            child: [{ menuId: 3, menuTypeId: 3, route: '/legacy' }],
          },
        ],
      },
    ];
    const instance = state();
    const projected = instance.project(nodes);
    instance.setExpanded({ menu: projected[0], expanded: false });
    instance.setExpanded({ menu: child(projected[0])[0], expanded: true });
    expect(JSON.parse(stored.get(key)!).expanded).toEqual({
      'main:menuId:1': false,
    });
    expect(child(instance.project(nodes)[0])[0].visibility).toBe('expanded');
    expect(state().project(nodes)[0].visibility).toBe('collapsed');
    expect(child(state().project(nodes)[0])[0].visibility).toBe('collapsed');
  });

  it('continues in memory when reads or writes are blocked', () => {
    const instance = new SidebarMenuState(key, () => {
      throw new Error('Blocked');
    });
    choose(instance, 'root', false);
    expect(instance.project(tree)[0].visibility).toBe('collapsed');
  });

  it('separates Favorites from main menu IDs and restores its collapsed state', () => {
    const instance = state();
    const main = [{ id: 'favorites', type: 'group' as const, children: [] }];
    const favorites = createFavoritesMenu([tree[0].children![0].children![0]]);
    instance.setExpanded({
      menu: instance.project(favorites, 'favorites')[0],
      expanded: false,
    });
    expect(state().project(favorites, 'favorites')[0].visibility).toBe(
      'collapsed'
    );
    expect(state().project(main)[0].visibility).toBeUndefined();
  });

  it('opens only active ancestors without replacing saved manual choices', () => {
    const instance = state();
    choose(instance, 'root', false);
    choose(instance, 'nested', false);
    choose(instance, 'other', false);
    const before = stored.get(key);
    instance.observeLocation('/-/people/123?view=all#name', '/-/');
    expect(instance.restore(tree)).toBe(true);
    const projected = instance.project(tree);
    expect(projected[0].visibility).toBe('expanded');
    expect(child(projected[0])[0].visibility).toBe('expanded');
    expect(projected[1].visibility).toBe('collapsed');
    expect(stored.get(key)).toBe(before);
    choose(instance, 'root', false);
    expect(instance.restore(tree)).toBe(false);
    expect(instance.project(tree)[0].visibility).toBe('collapsed');
  });

  it('waits for menu hydration but cancels restoration on subsequent navigation', () => {
    const instance = state();
    instance.observeLocation('/people/123');
    expect(instance.restore([])).toBe(false);
    expect(instance.restore(tree)).toBe(true);
    const pending = state();
    pending.observeLocation('/people');
    pending.restore([]);
    pending.observeLocation('/other');
    expect(pending.restore(tree)).toBe(false);
    pending.observeLocation('/people');
    expect(pending.restore(tree)).toBe(false);
  });

  it('does not treat query or hash changes as another page', () => {
    const instance = state();
    instance.observeLocation('/people?menu-filter=Other');
    instance.observeLocation('/people#details');
    expect(instance.restore(tree)).toBe(true);
  });

  it('matches a root menu only at the root and excludes external and partial-segment matches', () => {
    const nodes: IMenu[] = [
      { id: 'home', route: '/' },
      { id: 'people', route: '/people' },
      { id: 'external', route: 'https://example.com/people-extra' },
      { id: 'protocol-relative', route: '//example.com/people-extra' },
    ];
    const instance = state();
    instance.observeLocation('/people-extra');
    expect(instance.restore(nodes)).toBe(false);
    const home = state();
    home.observeLocation('/');
    expect(home.restore(nodes)).toBe(true);
  });

  describe('active route highlighting', () => {
    const routes: IMenu[] = [
      { id: 'home', route: '/' },
      { id: 'people', route: '/people' },
      { id: 'details', route: '/-/people/details/?view=all#name' },
      { id: 'duplicate', route: '/people/details' },
      { id: 'group', type: 'group', route: '/group', children: [] },
      { id: 'module', menuTypeId: 2, route: '/module' },
      { id: 'external', route: 'https://example.com/external' },
      { id: 'protocol-relative', route: '//example.com/external' },
      { id: 'query', route: '?view=all' },
      { id: 'fragment', route: '#name' },
    ];

    for (const [path, expected] of [
      ['/people', 'people'],
      ['/people/123', 'people'],
      ['/people/', 'people'],
      ['/people?view=all#name', 'people'],
      ['/-/people/123', 'people'],
      ['/-/people/details/123?tab=edit#name', 'details'],
      ['/people-other', undefined],
      ['/', 'home'],
      ['/-/', 'home'],
      ['/unknown', undefined],
      ['/group', undefined],
      ['/module', undefined],
      ['/external', undefined],
    ] as const) {
      it(`matches ${path} to ${expected ?? 'no active menu'}`, () => {
        expect(resolveSidebarActiveMenu(routes, [], path, '/-/')?.id).toBe(
          expected
        );
      });
    }

    it('prefers the main match and marks its favorite copy by identity', () => {
      const favorite = { ...routes[1] };
      const favorites = createFavoritesMenu([
        favorite,
        { id: 'favorite-detail', route: '/people/details/123' },
      ]);
      const active = resolveSidebarActiveMenu(
        routes,
        favorites,
        '/people/details/123',
        '/-/'
      );
      expect(active?.id).toBe('details');
      const instance = state();
      const main = instance.project(routes, 'main', active);
      const pinned = child(instance.project(favorites, 'favorites', active)[0]);
      expect(main.filter(isSidebarMenuActive).map((menu) => menu.id)).toEqual([
        'details',
      ]);
      expect(pinned.filter(isSidebarMenuActive)).toEqual([]);
      const people = resolveSidebarActiveMenu(routes, favorites, '/people');
      expect(
        isSidebarMenuActive(instance.project(routes, 'main', people)[1])
      ).toBe(true);
      expect(
        isSidebarMenuActive(
          child(instance.project(favorites, 'favorites', people)[0])[0]
        )
      ).toBe(true);
      expect(isSidebarMenuActive(favorite)).toBe(false);
      expect(isSidebarMenuActive(routes[1])).toBe(false);
      expect(stored.get(key)).toBeUndefined();
    });

    it('resolves favorites first during hydration and replaces them with the main match', () => {
      const favorites = createFavoritesMenu([
        { id: 'favorite-detail', route: '/people/details' },
      ]);
      expect(
        resolveSidebarActiveMenu([], favorites, '/people/details')?.id
      ).toBe('favorite-detail');
      expect(
        resolveSidebarActiveMenu(routes, favorites, '/people/details', '/-/')
          ?.id
      ).toBe('details');
      expect(
        resolveSidebarActiveMenu([], [], '/people/details')
      ).toBeUndefined();
    });

    it('marks legacy copies, ID-less leaves and no-child nodes without marking groups', () => {
      const leaf: IMenu = {
        menuId: 7,
        menuTypeId: 3,
        route: '/legacy',
        visibility: 'no-child',
      };
      const nodes: IMenu[] = [
        { menuId: 7, type: 'group', children: [leaf] },
        { route: '/anonymous' },
      ];
      const instance = state();
      const active = resolveSidebarActiveMenu(nodes, [], '/legacy/123');
      const projected = instance.project(nodes, 'main', active);
      expect(isSidebarMenuActive(projected[0])).toBe(false);
      expect(isSidebarMenuActive(child(projected[0])[0])).toBe(true);
      const favorites = createFavoritesMenu([{ ...leaf }]);
      expect(
        isSidebarMenuActive(
          child(instance.project(favorites, 'favorites', active)[0])[0]
        )
      ).toBe(true);
      const anonymous = resolveSidebarActiveMenu(nodes, [], '/anonymous');
      expect(
        isSidebarMenuActive(instance.project(nodes, 'main', anonymous)[1])
      ).toBe(true);
    });

    it('updates after restoration is canceled and clears old projection metadata', () => {
      const instance = state();
      instance.observeLocation('/people');
      instance.restore(tree);
      choose(instance, 'root', false);
      instance.observeLocation('/other');
      expect(instance.restore(tree)).toBe(false);
      const before = stored.get(key);
      const active = resolveSidebarActiveMenu(tree, [], '/other');
      const projected = instance.project(tree, 'main', active);
      expect(isSidebarMenuActive(child(projected[1])[0])).toBe(true);
      expect(projected[0].visibility).toBe('collapsed');
      expect(stored.get(key)).toBe(before);
      const cleared = instance.project(projected);
      expect(isSidebarMenuActive(child(cleared[1])[0])).toBe(false);
    });
  });

  function viewport(
    instance: SidebarMenuState,
    target: IMenu
  ): { host: HTMLElement; body: HTMLElement; row: HTMLElement } {
    const host = document.createElement('div');
    const body = document.createElement('div');
    body.className = 'ih-sidebar-body';
    Object.defineProperty(body, 'scrollTop', { value: 0, writable: true });
    const row = document.createElement('a');
    row.setAttribute('data-sidebar-menu-key', getSidebarMenuKey(target)!);
    body.appendChild(row);
    host.appendChild(body);
    body.getBoundingClientRect = (): DOMRect =>
      ({ top: 100, bottom: 200, height: 100 }) as DOMRect;
    row.getBoundingClientRect = (): DOMRect =>
      ({ top: 320, bottom: 350, height: 30 }) as DOMRect;
    instance.scrollToActive(host, false);
    return { host, body, row };
  }

  it('chooses the longest internal route and scrolls only the sidebar once without focus', () => {
    const instance = state();
    instance.observeLocation('/people/details/123');
    instance.restore(tree);
    const target = child(child(instance.project(tree)[0])[0])[1];
    const { host, body } = viewport(instance, target);
    const focused = document.activeElement;
    expect(body.scrollTop).toBe(0);
    instance.scrollToActive(host, true);
    expect(body.scrollTop).toBe(204);
    expect(document.activeElement).toBe(focused);
    instance.scrollToActive(host, true);
    expect(body.scrollTop).toBe(204);
  });

  for (const top of [80, 150, 320]) {
    it(`aligns the active row at ${top}px 16px below the viewport top from an existing scroll position`, () => {
      const instance = state();
      instance.observeLocation('/people');
      instance.restore(tree);
      const target = child(child(instance.project(tree)[0])[0])[0];
      const { host, body, row } = viewport(instance, target);
      body.scrollTop = 100;
      row.getBoundingClientRect = (): DOMRect =>
        ({ top, bottom: top + 30, height: 30 }) as DOMRect;

      instance.scrollToActive(host, true);

      expect(body.scrollTop).toBe(top - 16);
      body.scrollTop = 25;
      instance.scrollToActive(host, true);
      expect(body.scrollTop).toBe(25);
    });
  }

  it('prefers the main row over a duplicate favorite and restores a favorites-only menu', () => {
    const favorites = createFavoritesMenu([tree[0].children![0].children![0]]);
    const instance = state();
    instance.observeLocation('/people');
    instance.restore(tree, favorites);
    const favorite = child(instance.project(favorites, 'favorites')[0])[0];
    const { host, body } = viewport(instance, favorite);
    instance.scrollToActive(host, true);
    expect(body.scrollTop).toBe(0);
    const onlyFavorites = state();
    onlyFavorites.observeLocation('/people');
    onlyFavorites.restore([], favorites);
    expect(onlyFavorites.project(favorites, 'favorites')[0].visibility).toBe(
      'expanded'
    );
    const fallback = viewport(onlyFavorites, favorite);
    onlyFavorites.scrollToActive(fallback.host, true);
    expect(fallback.body.scrollTop).toBe(204);
  });

  it('waits for filtered/hidden rows to appear without clearing search or focusing them', () => {
    const instance = state();
    instance.observeLocation('/people');
    instance.restore(tree);
    const target = child(child(instance.project(tree)[0])[0])[0];
    const { host, body, row } = viewport(instance, target);
    row.remove();
    instance.scrollToActive(host, true);
    expect(body.scrollTop).toBe(0);
    body.appendChild(row);
    instance.scrollToActive(host, false);
    expect(body.scrollTop).toBe(0);
    instance.scrollToActive(host, true);
    expect(body.scrollTop).toBe(204);
  });

  it('prefers a main menu that hydrates after Favorites without overwriting preferences', () => {
    stored.set(
      key,
      JSON.stringify({
        version: 1,
        expanded: {
          'main:id:root': false,
          'favorites:group': false,
        },
      })
    );
    const instance = state();
    const favorites = createFavoritesMenu([tree[0].children![0].children![0]]);
    instance.observeLocation('/people');
    expect(instance.restore([], favorites)).toBe(true);
    expect(instance.project(favorites, 'favorites')[0].visibility).toBe(
      'expanded'
    );
    expect(instance.restore(tree, favorites)).toBe(true);
    expect(instance.project(tree)[0].visibility).toBe('expanded');
    expect(instance.project(favorites, 'favorites')[0].visibility).toBe(
      'collapsed'
    );
    expect(instance.restore(tree, favorites)).toBe(false);
  });

  it('keeps user interaction authoritative while the main menu is hydrating', () => {
    const instance = state();
    const favorites = createFavoritesMenu([tree[0].children![0].children![0]]);
    instance.observeLocation('/people');
    instance.restore([], favorites);
    instance.setExpanded({
      menu: instance.project(favorites, 'favorites')[0],
      expanded: false,
    });
    expect(instance.restore(tree, favorites)).toBe(false);
    expect(instance.project(favorites, 'favorites')[0].visibility).toBe(
      'collapsed'
    );
  });
});
