import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IHSidebar, IHContent } from './host';
import type { IMenu, IMenuFavoriteToggleEvent } from './host-api.types';

describe('IHContent', () => {
  it('renders host and title', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<IHContent title="Dashboard" breadcrumbs={[]} />}>
            <Route index element={<div>Body</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('ih-content')).toBeTruthy();
    expect(container.querySelector('ih-content h1')?.textContent).toContain(
      'Dashboard'
    );
  });
});

describe('IHSidebar account menu', () => {
  function renderSidebar() {
    return render(
      <MemoryRouter>
        <IHSidebar
          menus={[]}
          user={{ employeeCode: 'PL1378', fullName: 'Dylan', userImagePath: '' }}
        />
      </MemoryRouter>
    );
  }

  for (const key of ['ArrowDown', 'ArrowUp']) {
    it(`moves account menu focus and wraps with ${key}`, () => {
      const { container } = renderSidebar();
      const chip = container.querySelector<HTMLButtonElement>('.ih-user-chip')!;
      fireEvent.click(chip);
      chip.focus();
      const items = container.querySelectorAll<HTMLElement>('.ih-user-dropdown-item');
      const first = key === 'ArrowDown' ? 0 : 1;

      for (const index of [first, 1 - first, first]) {
        expect(fireEvent.keyDown(document.activeElement!, { key })).toBe(false);
        expect(document.activeElement).toBe(items[index]);
      }

      fireEvent.keyDown(items[first], { key: 'Escape' });
      expect(container.querySelector('.ih-user-dropdown')).toBeNull();
      expect(document.activeElement).toBe(chip);
      expect(chip.getAttribute('aria-expanded')).toBe('false');
    });
  }

  it('preserves Tab and ignores account navigation outside the header', () => {
    const { container } = renderSidebar();
    const chip = container.querySelector<HTMLButtonElement>('.ih-user-chip')!;
    fireEvent.click(chip);
    chip.focus();
    expect(fireEvent.keyDown(chip, { key: 'Tab' })).toBe(true);

    const search = container.querySelector<HTMLInputElement>('.ih-sidebar-search input')!;
    search.focus();
    expect(fireEvent.keyDown(search, { key: 'ArrowDown' })).toBe(true);
    expect(document.activeElement).toBe(search);

    fireEvent.pointerDown(document.body);
    expect(container.querySelector('.ih-user-dropdown')).toBeNull();
  });

  it('closes the account menu when Personal Profile is activated', () => {
    const { container } = renderSidebar();
    fireEvent.click(container.querySelector('.ih-user-chip')!);
    const profile = container.querySelector<HTMLAnchorElement>('.ih-user-dropdown a')!;
    expect(profile.target).toBe('_blank');
    profile.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(profile);
    expect(container.querySelector('.ih-user-dropdown')).toBeNull();
  });
});

describe('IHSidebar favorites', () => {
  const TREE: IMenu[] = [
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
            { id: 'leaf-index', name: 'index', type: 'item', route: '/docs/sso/index' },
          ],
        },
      ],
    },
  ];

  it('shows the favorite ancestor path (from the menu tree) as the leaf subtitle', () => {
    const { container } = render(
      <MemoryRouter>
        <IHSidebar
          menus={TREE}
          favorites={[{ id: 'leaf-index', name: 'index', type: 'item', route: '/docs/sso/index' }]}
          favoriteMode
        />
      </MemoryRouter>
    );

    const subtitle = container.querySelector('.ih-sidebar-favorites .ih-menu-application');

    expect(subtitle?.textContent).toBe('docs > sso');
  });

  it('emits unfavorite immediately when no dialog host is mounted (back-compat)', () => {
    const favoritesLeaf: IMenu = {
      id: 'leaf-fav',
      name: 'Users',
      type: 'item',
      route: '/admin/users',
      isFavorite: true,
    };
    const menus: IMenu[] = [
      { id: 'group-admin', name: 'Administration', type: 'group', children: [favoritesLeaf] },
    ];
    const toggles: IMenuFavoriteToggleEvent[] = [];

    const { container } = render(
      <MemoryRouter>
        <IHSidebar menus={menus} favoriteMode onFavoriteToggle={(e) => toggles.push(e)} />
      </MemoryRouter>
    );

    const star = container.querySelector('.ih-menu-favorite') as HTMLElement;
    star.click();

    expect(toggles).toEqual([{ id: 'leaf-fav', isFavorite: false }]);
  });
});
