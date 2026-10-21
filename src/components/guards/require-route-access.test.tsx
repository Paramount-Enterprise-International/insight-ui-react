import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  IAuthContext,
  type IAuthContext as IAuthContextValue,
} from '../auth/insight-auth-context';
import type { ISessionExpiredService } from '../session-expired/session-expired';
import type { ISessionService } from '../session/session';
import type { IUserMenuStore } from '../store/user-menu';
import { UNAUTHORIZED_ACCESS_PATH } from './require-access';
import {
  IRequireRouteAccess,
  type IRequireRouteAccessProps,
} from './require-route-access';

const observable = {
  subscribe: () => () => undefined,
  getVersion: () => 0,
};

function renderGuard(
  props: Omit<IRequireRouteAccessProps, 'children'>,
  hasMenuCode: boolean,
  overlayVisible = false
) {
  const store = {
    ...observable,
    initialized: true,
    initializing: false,
    menus: [],
    loadErrors: { menus: null },
    hasMenuCode: vi.fn(() => hasMenuCode),
  } as unknown as IUserMenuStore;
  const session = {
    ...observable,
    initializing: false,
    isAuth: () => true,
  } as unknown as ISessionService;
  const sessionExpired = {
    ...observable,
    visible: overlayVisible,
  } as unknown as ISessionExpiredService;
  const context = {
    session,
    sessionExpired,
    userMenuStore: store,
  } as unknown as IAuthContextValue;

  function LocationProbe() {
    const location = useLocation();
    return (
      <output data-testid="url">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
    );
  }
  render(
    <IAuthContext.Provider value={context}>
      <MemoryRouter initialEntries={['/overview?tab=roles#details']}>
        <LocationProbe />
        <Routes>
          <Route
            path="/overview"
            element={
              <IRequireRouteAccess {...props}>
                <div>protected-content</div>
              </IRequireRouteAccess>
            }
          />
          <Route
            path={UNAUTHORIZED_ACCESS_PATH}
            element={<div>unauthorized-access-page</div>}
          />
        </Routes>
      </MemoryRouter>
    </IAuthContext.Provider>
  );

  return store;
}

describe('IRequireRouteAccess', () => {
  it('allows a granted static menu code', async () => {
    const store = renderGuard({ menuCode: 'atlas.overview' }, true);

    expect(await screen.findByText('protected-content')).toBeTruthy();
    expect(store.hasMenuCode).toHaveBeenCalledWith('atlas.overview');
  });

  it('uses the host resolver and denies an ungranted menu code', async () => {
    const store = renderGuard(
      {
        resolveMenuCode: (path) =>
          path === '/overview' ? 'atlas.overview' : null,
      },
      false
    );

    expect(await screen.findByText('Unauthorized Access')).toBeTruthy();
    expect(screen.queryByText('unauthorized-access-page')).toBeNull();
    expect(screen.queryByText('protected-content')).toBeNull();
    expect(screen.getByTestId('url')).toHaveTextContent(
      '/overview?tab=roles#details'
    );
    expect(store.hasMenuCode).toHaveBeenCalledWith('atlas.overview');
  });

  it('allows a missing mapping by default', async () => {
    const store = renderGuard({}, false);

    expect(await screen.findByText('protected-content')).toBeTruthy();
    expect(store.hasMenuCode).not.toHaveBeenCalled();
  });

  it('can deny a missing mapping explicitly', async () => {
    const store = renderGuard({ missingMenuCode: 'deny' }, false);

    expect(await screen.findByText('Unauthorized Access')).toBeTruthy();
    expect(screen.getByTestId('url')).toHaveTextContent(
      '/overview?tab=roles#details'
    );
    expect(store.hasMenuCode).not.toHaveBeenCalled();
  });

  it('does not mount protected content while the session overlay is visible', () => {
    renderGuard({ menuCode: 'read' }, true, true);
    expect(screen.queryByText('protected-content')).toBeNull();
    expect(screen.getByTestId('url')).toHaveTextContent(
      '/overview?tab=roles#details'
    );
  });
});
