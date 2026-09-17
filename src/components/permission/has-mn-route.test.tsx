import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate, useParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { IAuthContext, type IAuthContext as AuthContextValue } from '../auth/insight-auth-context';
import { IHostApiProvider } from '../host/host-api.context';
import { IRouter } from '../host/router';
import type { IRoutes } from '../host/router.types';
import type { IUserMenuStore } from '../store/user-menu.store';
import { hasMn } from './has-mn-route';

function fixture(routes: IRoutes, path = '/reports', cold = false, sessionInitializing = false) {
  let version = 0;
  const listeners = new Set<() => void>();
  const observable = { subscribe: () => () => undefined, getVersion: () => 0 };
  const store = {
    initialized: !cold,
    initializing: false,
    authorizationSource: { menu: [] as string[], permission: [], roles: [], companyCodes: [], companies: [], menuCompanies: {} },
    load: vi.fn(async () => undefined),
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getVersion: () => version,
  };
  const session = { ...observable, initializing: sessionInitializing, isAuth: () => true };
  const context = { session, userMenuStore: store as unknown as IUserMenuStore } as unknown as AuthContextValue;
  const hostApi = { navigate: vi.fn(), setTitle: vi.fn(), setBreadcrumbs: vi.fn() };
  function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    return <><output>{location.pathname}{location.search}</output><button onClick={() => navigate('/open')}>Open</button></>;
  }
  const view = render(
    <IAuthContext.Provider value={context}>
      <IHostApiProvider hostApi={hostApi}>
        <MemoryRouter initialEntries={[path]}>
          <div>shell</div><Navigation /><IRouter routes={routes} />
        </MemoryRouter>
      </IHostApiProvider>
    </IAuthContext.Provider>,
  );
  const grant = async (...codes: string[]) => act(async () => {
    store.authorizationSource.menu = codes;
    store.initialized = true;
    store.initializing = false;
    version++;
    listeners.forEach((listener) => listener());
  });
  return { ...view, store, session, hostApi, grant };
}

describe('hasMn route helpers', () => {
  it('keeps the URL and shell, never mounts denied content, and restores metadata on grant/revoke', async () => {
    const mount = vi.fn();
    function Page() { mount(); return <div>report-content</div>; }
    const { grant, hostApi } = fixture([{ path: 'reports', title: 'Reports', breadcrumb: 'Reports', element: hasMn('reports', <Page />) }]);
    expect(screen.getByText('Unauthorized Access')).toBeTruthy();
    expect(screen.getByText('/reports')).toBeTruthy();
    expect(screen.getByText('shell')).toBeTruthy();
    expect(mount).not.toHaveBeenCalled();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Unauthorized Access');
    await grant('reports');
    expect(screen.getByText('report-content')).toBeTruthy();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Reports');
    expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith([{ label: 'Reports', url: undefined }]);
    await grant();
    expect(screen.queryByText('report-content')).toBeNull();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Unauthorized Access');
  });

  it('loads cold menus once and waits without flashing denial', async () => {
    const { store, grant } = fixture([{ path: 'reports', element: hasMn('reports', <div>loaded-report</div>) }], '/reports', true);
    expect(screen.getByText('Loading access...')).toBeTruthy();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
    expect(store.load).toHaveBeenCalledTimes(1);
    await grant('reports');
    expect(screen.getByText('loaded-report')).toBeTruthy();
  });

  it('does not load menus or mount pages before session restoration settles', () => {
    const { store } = fixture([{ path: 'reports', element: hasMn('reports', <div>hidden</div>) }], '/reports', true, true);
    expect(store.load).not.toHaveBeenCalled();
    expect(screen.getByText('Loading access...')).toBeTruthy();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('denies settled empty menus and throwing predicates', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fixture([{ path: 'reports', element: hasMn(() => { throw new Error('failed'); }, <div>hidden</div>) }]);
    expect(screen.getByText('Unauthorized Access')).toBeTruthy();
    expect(screen.queryByText('hidden')).toBeNull();
    error.mockRestore();
  });

  it('supports ANY menu inputs', async () => {
    const { grant } = fixture([{ path: 'reports', element: hasMn(['read', 'write'], <div>any-grant</div>) }]);
    await grant('write');
    expect(screen.getByText('any-grant')).toBeTruthy();
  });

  it('does not import lazy pages until granted and preserves implicit index and parameter routes', async () => {
    function Detail() { const { id } = useParams(); return <div>detail-{id}</div>; }
    const parentLoader = vi.fn(async () => () => <div>parent-page</div>);
    const detailLoader = vi.fn(async () => Detail);
    const { grant } = fixture([{
      path: 'reports', title: 'Reports', loadComponent: hasMn('parent', parentLoader),
      children: [{ path: ':id/edit', title: 'Edit', loadComponent: hasMn('detail', detailLoader) }],
    }], '/reports/42/edit?tab=info');
    await screen.findByText('Unauthorized Access');
    expect(detailLoader).not.toHaveBeenCalled();
    expect(parentLoader).not.toHaveBeenCalled();
    await grant('detail');
    expect(await screen.findByText('detail-42')).toBeTruthy();
    expect(detailLoader).toHaveBeenCalledTimes(1);
    expect(parentLoader).not.toHaveBeenCalled();
    expect(screen.getByText('/reports/42/edit?tab=info')).toBeTruthy();
  });

  it('guards an implicit index without guarding its children', async () => {
    const loader = vi.fn(async () => () => <div>index-content</div>);
    const { grant } = fixture([{ path: 'reports', loadComponent: hasMn('index', loader), children: [{ path: 'open', element: <div>child</div> }] }]);
    await screen.findByText('Unauthorized Access');
    expect(loader).not.toHaveBeenCalled();
    await grant('index');
    expect(await screen.findByText('index-content')).toBeTruthy();
  });

  it('clears denial metadata when navigating to unguarded content', async () => {
    const { hostApi } = fixture([
      { path: 'reports', element: hasMn('reports', <div>hidden</div>) },
      { path: 'open', title: 'Open page', element: <div>open-content</div> },
    ]);
    fireEvent.click(screen.getByText('Open', { selector: 'button' }));
    expect(await screen.findByText('open-content')).toBeTruthy();
    await waitFor(() => expect(hostApi.setTitle).toHaveBeenLastCalledWith('Open page'));
  });

  it('restores index metadata through nested standalone and hosted layout routes', async () => {
    const { grant, hostApi } = fixture([{ path: '', children: [{ path: '', children: [{
      index: true, title: 'Home', breadcrumb: 'Home', element: hasMn('home', <div>home-content</div>),
    }] }] }], '/');
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Unauthorized Access');
    await grant('home');
    expect(screen.getByText('home-content')).toBeTruthy();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Home');
    expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith([{ label: 'Home', url: undefined }]);
  });

  it('renders unknown routes as 404', () => {
    fixture([{ path: 'reports', element: hasMn('reports', <div>hidden</div>) }], '/unknown');
    expect(screen.getByText('Not Found')).toBeTruthy();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
  });
});
