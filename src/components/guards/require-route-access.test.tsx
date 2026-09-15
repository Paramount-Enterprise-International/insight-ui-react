import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  IAuthContext,
  type IAuthContext as IAuthContextValue,
} from '../auth/insight-auth-context';
import type { ISessionService } from '../session/session.service';
import type { ISessionExpiredService } from '../session-expired/session-expired.service';
import type { IUserMenuStore } from '../store/user-menu.store';
import { UNAUTHORIZED_ACCESS_PATH } from './require-access';
import { IRequireRouteAccess, type IRequireRouteAccessProps } from './require-route-access';

const observable = {
  subscribe: () => () => undefined,
  getVersion: () => 0,
};

function renderGuard(
  props: Omit<IRequireRouteAccessProps, 'children'>,
  hasMenu: boolean,
) {
  const store = {
    ...observable,
    initialized: true,
    initializing: false,
    menus: [],
    loadErrors: { menus: null },
    hasMenu: vi.fn(() => hasMenu),
  } as unknown as IUserMenuStore;
  const session = {
    ...observable,
    initializing: false,
    isAuth: () => true,
  } as unknown as ISessionService;
  const sessionExpired = {
    ...observable,
    visible: false,
  } as unknown as ISessionExpiredService;
  const context = {
    session,
    sessionExpired,
    userMenuStore: store,
  } as unknown as IAuthContextValue;

  render(
    <IAuthContext.Provider value={context}>
      <MemoryRouter initialEntries={['/overview']}>
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
    </IAuthContext.Provider>,
  );

  return store;
}

describe('IRequireRouteAccess', () => {
  it('allows a granted static menu code', async () => {
    const store = renderGuard({ menuCode: 'atlas.overview' }, true);

    expect(await screen.findByText('protected-content')).toBeTruthy();
    expect(store.hasMenu).toHaveBeenCalledWith('atlas.overview');
  });

  it('uses the host resolver and denies an ungranted menu code', async () => {
    const store = renderGuard(
      { resolveMenuCode: (path) => (path === '/overview' ? 'atlas.overview' : null) },
      false,
    );

    expect(await screen.findByText('unauthorized-access-page')).toBeTruthy();
    expect(store.hasMenu).toHaveBeenCalledWith('atlas.overview');
  });

  it('allows a missing mapping by default', async () => {
    const store = renderGuard({}, false);

    expect(await screen.findByText('protected-content')).toBeTruthy();
    expect(store.hasMenu).not.toHaveBeenCalled();
  });

  it('can deny a missing mapping explicitly', async () => {
    const store = renderGuard({ missingMenuCode: 'deny' }, false);

    expect(await screen.findByText('unauthorized-access-page')).toBeTruthy();
    expect(store.hasMenu).not.toHaveBeenCalled();
  });
});
