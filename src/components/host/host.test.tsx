import { render } from '@testing-library/react';
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
