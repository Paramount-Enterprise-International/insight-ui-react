import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  IAuthContext,
  type IAuthContext as IAuthContextValue,
} from '../auth/insight-auth-context';
import type { ISessionExpiredService } from '../session-expired/session-expired';
import type { ISessionService } from '../session/session';
import type { IUserMenuStore } from '../store/user-menu';
import { IRequireAccess, UNAUTHORIZED_ACCESS_PATH } from './require-access';

const noopObservable = {
  subscribe: () => () => undefined,
  getVersion: () => 0,
};

function makeSession(
  opts: { initializing?: boolean; isAuth?: boolean; hasRole?: boolean } = {}
) {
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
    initialized?: boolean;
    menusLoaded?: boolean;
    menusError?: unknown;
    hasMenuCode?: boolean | (() => boolean);
    load?: () => Promise<void>;
  } = {}
) {
  const resolveMenu = (): boolean =>
    typeof opts.hasMenuCode === 'function'
      ? opts.hasMenuCode()
      : (opts.hasMenuCode ?? false);
  return {
    ...noopObservable,
    initializing: opts.initializing ?? false,
    initialized:
      opts.initialized ?? opts.menusLoaded ?? opts.menusError !== undefined,
    menus: opts.menusLoaded ? [{ id: 1, name: 'Admin' }] : [],
    loadErrors: { menus: opts.menusError ?? null },
    hasMenuCode: resolveMenu,
    load: opts.load ?? (async () => undefined),
  } as unknown as IUserMenuStore;
}

function makeSessionExpired() {
  return {
    ...noopObservable,
    visible: false,
  } as unknown as ISessionExpiredService;
}

function renderGuard(
  element: ReactNode,
  {
    session,
    store,
    overlayVisible = false,
  }: {
    session: ISessionService;
    store: IUserMenuStore;
    overlayVisible?: boolean;
  }
) {
  const ctx = {
    config: {},
    session,
    auth: {},
    csrf: {},
    api: {},
    sessionExpired: { ...makeSessionExpired(), visible: overlayVisible },
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
  return render(
    <IAuthContext.Provider value={ctx}>
      <MemoryRouter initialEntries={['/protected/42?tab=roles#details']}>
        <LocationProbe />
        <Routes>
          <Route path="/protected/:id" element={element} />
          <Route
            path={UNAUTHORIZED_ACCESS_PATH}
            element={<div>unauthorized-access-page</div>}
          />
        </Routes>
      </MemoryRouter>
    </IAuthContext.Provider>
  );
}

describe('IRequireAccess', () => {
  it('renders children when the menu code is granted', async () => {
    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>protected-content</div>
      </IRequireAccess>,
      {
        session: makeSession(),
        store: makeStore({ menusLoaded: true, hasMenuCode: true }),
      }
    );
    expect(await screen.findByText('protected-content')).toBeTruthy();
  });

  it('renders denial at the complete requested URL when the menu code is missing', async () => {
    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>protected-content</div>
      </IRequireAccess>,
      {
        session: makeSession(),
        store: makeStore({ menusLoaded: true, hasMenuCode: false }),
      }
    );
    expect(await screen.findByText('Unauthorized Access')).toBeTruthy();
    expect(screen.queryByText('unauthorized-access-page')).toBeNull();
    expect(screen.queryByText('protected-content')).toBeNull();
    expect(screen.getByTestId('url')).toHaveTextContent(
      '/protected/42?tab=roles#details'
    );
  });

  it('renders children when a required role is held', async () => {
    renderGuard(
      <IRequireAccess source="role" value="backend.sys">
        <div>role-content</div>
      </IRequireAccess>,
      { session: makeSession({ hasRole: true }), store: makeStore() }
    );
    expect(await screen.findByText('role-content')).toBeTruthy();
  });

  it('keeps role denial in place even when a legacy unauthorizedPath is supplied', async () => {
    renderGuard(
      <IRequireAccess
        source="role"
        value="backend.sys"
        unauthorizedPath="/custom-denial">
        <div>role-content</div>
      </IRequireAccess>,
      { session: makeSession(), store: makeStore() }
    );
    expect(await screen.findByText('Unauthorized Access')).toBeTruthy();
    expect(screen.getByTestId('url')).toHaveTextContent(
      '/protected/42?tab=roles#details'
    );
  });

  it('shows a loading placeholder while the session is restoring', () => {
    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>protected-content</div>
      </IRequireAccess>,
      {
        session: makeSession({ initializing: true, isAuth: false }),
        store: makeStore(),
      }
    );
    expect(screen.getByText('Loading session...')).toBeTruthy();
    expect(screen.getByText('Loading session...')).toHaveAttribute(
      'mode',
      'container'
    );
    expect(screen.getByText('Loading session...')).toHaveAttribute(
      'role',
      'status'
    );
  });

  it('preserves the custom access fallback while authorizations are pending', () => {
    const { container } = renderGuard(
      <IRequireAccess value="admin-iam" loading={<p>Custom access progress</p>}>
        <div>protected-content</div>
      </IRequireAccess>,
      { session: makeSession(), store: makeStore({ initializing: true }) }
    );
    expect(screen.getByText('Custom access progress')).toBeTruthy();
    expect(container.querySelector('i-loading')).toBeNull();
    expect(screen.queryByText('protected-content')).toBeNull();
  });

  it('triggers the menu load when menus have not been fetched yet, then renders on success', async () => {
    let granted = false;
    const store = makeStore({
      menusLoaded: false,
      hasMenuCode: () => granted,
      load: async () => {
        granted = true;
        Object.assign(store, { initialized: true });
      },
    });

    renderGuard(
      <IRequireAccess value="admin-iam">
        <div>loaded-content</div>
      </IRequireAccess>,
      { session: makeSession(), store }
    );
    expect(await screen.findByText('loaded-content')).toBeTruthy();
  });

  it('does not mount denied content or start access loading beneath the session overlay', () => {
    const mounted = vi.fn();
    function Page() {
      mounted();
      return <div>hidden</div>;
    }
    const load = vi.fn(async () => undefined);
    renderGuard(
      <IRequireAccess value="read">
        <Page />
      </IRequireAccess>,
      {
        session: makeSession(),
        store: makeStore({ load }),
        overlayVisible: true,
      }
    );
    expect(mounted).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    expect(screen.getByTestId('url')).toHaveTextContent(
      '/protected/42?tab=roles#details'
    );
  });
});
