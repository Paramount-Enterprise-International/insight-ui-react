import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';

import { IRequireAccess, UNAUTHORIZED_ACCESS_PATH } from './require-access';
import { IAuthContext, type IAuthContext as IAuthContextValue } from '../auth/insight-auth-context';
import type { ISessionService } from '../session/session.service';
import type { IUserMenuStore } from '../store/user-menu.store';
import type { ISessionExpiredService } from '../session-expired/session-expired.service';

const noopObservable = {
  subscribe: () => () => undefined,
  getVersion: () => 0,
};

function makeSession(opts: { initializing?: boolean; isAuth?: boolean; hasRole?: boolean } = {}) {
  return {
    ...noopObservable,
    initializing: opts.initializing ?? false,
    isAuth: () => opts.isAuth ?? true,
    hasRole: () => opts.hasRole ?? false,
  } as unknown as ISessionService;
}

function makeStore(
  opts: {
    initializing?: boolean;
    menusLoaded?: boolean;
    menusError?: unknown;
    hasMenu?: boolean | (() => boolean);
    hasPermission?: boolean;
    load?: () => Promise<void>;
  } = {},
) {
  const resolveMenu = (): boolean =>
    typeof opts.hasMenu === 'function' ? opts.hasMenu() : (opts.hasMenu ?? false);
  return {
    ...noopObservable,
    initializing: opts.initializing ?? false,
    menus: opts.menusLoaded ? [{ id: 1, name: 'Admin' }] : [],
    loadErrors: { menus: opts.menusError ?? null },
    hasMenu: resolveMenu,
    hasPermission: () => opts.hasPermission ?? false,
    load: opts.load ?? (async () => undefined),
  } as unknown as IUserMenuStore;
}

function makeSessionExpired() {
  return { ...noopObservable, visible: false } as unknown as ISessionExpiredService;
}

function renderGuard(
  element: ReactNode,
  { session, store }: { session: ISessionService; store: IUserMenuStore },
) {
  const ctx = {
    config: {},
    session,
    auth: {},
    csrf: {},
    api: {},
    sessionExpired: makeSessionExpired(),
    userMenuStore: store,
  } as unknown as IAuthContextValue;

  return render(
    <IAuthContext.Provider value={ctx}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={element} />
          <Route path={UNAUTHORIZED_ACCESS_PATH} element={<div>unauthorized-access-page</div>} />
        </Routes>
      </MemoryRouter>
    </IAuthContext.Provider>,
  );
}

describe('IRequireAccess', () => {
  it('renders children when the menu code is granted', async () => {
    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>protected-content</div>
      </IRequireAccess>,
      { session: makeSession(), store: makeStore({ menusLoaded: true, hasMenu: true }) },
    );
    expect(await screen.findByText('protected-content')).toBeTruthy();
  });

  it('redirects to the unauthorized-access page when the menu code is missing', async () => {
    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>protected-content</div>
      </IRequireAccess>,
      { session: makeSession(), store: makeStore({ menusLoaded: true, hasMenu: false }) },
    );
    expect(await screen.findByText('unauthorized-access-page')).toBeTruthy();
  });

  it('renders children when a required role is held', async () => {
    renderGuard(
      <IRequireAccess source="role" value="backend.sys">
        <div>role-content</div>
      </IRequireAccess>,
      { session: makeSession({ hasRole: true }), store: makeStore() },
    );
    expect(await screen.findByText('role-content')).toBeTruthy();
  });

  it('redirects when a required role is not held', async () => {
    renderGuard(
      <IRequireAccess source="role" value="backend.sys">
        <div>role-content</div>
      </IRequireAccess>,
      { session: makeSession(), store: makeStore() },
    );
    expect(await screen.findByText('unauthorized-access-page')).toBeTruthy();
  });

  it('shows a loading placeholder while the session is restoring', () => {
    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>protected-content</div>
      </IRequireAccess>,
      { session: makeSession({ initializing: true, isAuth: false }), store: makeStore() },
    );
    expect(screen.getByText('Loading session...')).toBeTruthy();
  });

  it('triggers the menu load when menus have not been fetched yet, then renders on success', async () => {
    let granted = false;
    const store = makeStore({
      menusLoaded: false,
      hasMenu: () => granted,
      load: async () => {
        granted = true;
      },
    });

    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>loaded-content</div>
      </IRequireAccess>,
      { session: makeSession(), store },
    );
    expect(await screen.findByText('loaded-content')).toBeTruthy();
  });
});
