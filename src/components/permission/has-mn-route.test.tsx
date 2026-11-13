import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  IAuthContext,
  type IAuthContext as AuthContextValue,
} from '../auth/insight-auth-context';
import { IHostApiProvider } from '../host/host-api.context';
import { IRouter } from '../host/router';
import type { IRouteComponent, IRoutes } from '../host/router.types';
import type { IUserMenuLoadErrors, IUserMenuStore } from '../store/user-menu';
import { hasMn } from './has-mn-route';
import {
  IMenuPermissionMappingProvider,
  type IPermissionMap,
  type IPermissionMapConfig,
} from './permission-map';

function fixture(
  routes: IRoutes,
  path = '/reports',
  cold = false,
  sessionInitializing = false,
  mapping?: IPermissionMapConfig
) {
  let version = 0;
  const listeners = new Set<() => void>();
  const observable = { subscribe: () => () => undefined, getVersion: () => 0 };
  const store = {
    initialized: !cold,
    initializing: false,
    loadErrors: {
      user: null,
      favorites: null,
      menus: null,
      authorizations: null,
    } as IUserMenuLoadErrors,
    authorizationSource: {
      menuCodes: [] as string[],
      roles: [],
      companyCodes: [],
      companies: [],
      menuCompanies: {},
    },
    load: vi.fn(async () => undefined),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getVersion: () => version,
  };
  const session = {
    ...observable,
    initializing: sessionInitializing,
    isAuth: () => true,
  };
  const context = {
    session,
    userMenuStore: store as unknown as IUserMenuStore,
  } as unknown as AuthContextValue;
  const hostApi = {
    navigate: vi.fn(),
    setTitle: vi.fn(),
    setBreadcrumbs: vi.fn(),
  };
  function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
      <>
        <output>
          {location.pathname}
          {location.search}
        </output>
        <button onClick={() => navigate('/open')}>Open</button>
      </>
    );
  }
  const view = render(
    <IAuthContext.Provider value={context}>
      <IHostApiProvider hostApi={hostApi}>
        <MemoryRouter initialEntries={[path]}>
          <div>shell</div>
          <Navigation />
          {mapping ? (
            <IMenuPermissionMappingProvider mapping={mapping}>
              <IRouter routes={routes} />
            </IMenuPermissionMappingProvider>
          ) : (
            <IRouter routes={routes} />
          )}
        </MemoryRouter>
      </IHostApiProvider>
    </IAuthContext.Provider>
  );
  const grant = async (...codes: string[]) =>
    act(async () => {
      store.authorizationSource.menuCodes = codes;
      store.initialized = true;
      store.initializing = false;
      version++;
      listeners.forEach((listener) => listener());
    });
  const notify = async () =>
    act(async () => {
      version++;
      listeners.forEach((listener) => listener());
    });
  return { ...view, store, session, hostApi, grant, notify };
}

describe('hasMn route helpers', () => {
  for (const source of ['menus', 'authorizations'] as const) {
    it(`retries a failed ${source} load without denying or mounting protected content`, async () => {
      const mount = vi.fn();
      function Page() {
        mount();
        return <p>Protected report</p>;
      }
      const { store, grant, hostApi, notify } = fixture([
        {
          path: 'reports',
          title: 'Reports',
          element: hasMn('reports', <Page />),
        },
      ]);
      store.loadErrors[source] = { status: 500 };
      await notify();
      expect(screen.getByText('Failed to load access.')).toBeTruthy();
      expect(screen.queryByText('Unauthorized Access')).toBeNull();
      expect(mount).not.toHaveBeenCalled();
      expect(hostApi.setTitle).toHaveBeenLastCalledWith('Reports');
      let finish!: () => void;
      store.load.mockImplementation(() => {
        store.initializing = true;
        store.initialized = false;
        return new Promise<void>((resolve) => {
          finish = resolve;
        });
      });
      const retry = screen.getByRole('button', { name: 'Retry' });
      fireEvent.click(retry);
      fireEvent.click(retry);
      await notify();
      expect(store.load).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Loading access...')).toBeTruthy();
      store.initializing = false;
      store.initialized = true;
      await act(async () => finish());
      await notify();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
      store.loadErrors[source] = null;
      await grant('reports');
      expect(screen.getByText('Protected report')).toBeTruthy();
      expect(screen.queryByText('Failed to load access.')).toBeNull();
      expect(hostApi.setTitle).toHaveBeenLastCalledWith('Reports');
    });
  }

  it('keeps missing mappings forbidden and ignores profile/favorite failures', async () => {
    const { store, grant, notify } = fixture([
      { path: 'reports', element: hasMn('reports', <p>Protected report</p>) },
    ]);
    store.loadErrors = {
      user: { status: 500 },
      favorites: { status: 500 },
      menus: { errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND' },
      authorizations: { errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND' },
    };
    await notify();
    expect(screen.getByText('Unauthorized Access')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    store.loadErrors.menus = null;
    store.loadErrors.authorizations = null;
    await grant('reports');
    expect(screen.getByText('Protected report')).toBeTruthy();
  });

  it('shows a centered lazy-page spinner after access is granted', async () => {
    let resolve!: (page: IRouteComponent) => void;
    const pending = new Promise<IRouteComponent>((done) => {
      resolve = done;
    });
    const { grant } = fixture([
      { path: 'reports', loadComponent: hasMn('reports', () => pending) },
    ]);
    await screen.findByText('Unauthorized Access');
    await grant('reports');
    expect(await screen.findByText('Loading page...')).toHaveAttribute(
      'mode',
      'container'
    );
    await act(async () => {
      resolve(() => <p>Resolved report</p>);
    });
    expect(screen.getByText('Resolved report')).toBeTruthy();
    expect(screen.queryByText('Loading page...')).toBeNull();
  });

  it('keeps the URL and shell, never mounts denied content, and restores metadata on grant/revoke', async () => {
    const mount = vi.fn();
    function Page() {
      mount();
      return <div>report-content</div>;
    }
    const { grant, hostApi } = fixture([
      {
        path: 'reports',
        title: 'Reports',
        breadcrumb: 'Reports',
        element: hasMn('reports', <Page />),
      },
    ]);
    expect(screen.getByText('Unauthorized Access')).toBeTruthy();
    expect(screen.getByRole('alert').querySelector('i-section')).not.toBeNull();
    expect(screen.getByText('403')).toBeTruthy();
    expect(screen.getByText('/reports')).toBeTruthy();
    expect(screen.getByText('shell')).toBeTruthy();
    expect(mount).not.toHaveBeenCalled();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Unauthorized Access');
    await grant('reports');
    expect(screen.getByText('report-content')).toBeTruthy();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Reports');
    expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith([
      { label: 'Reports', url: undefined },
    ]);
    await grant();
    expect(screen.queryByText('report-content')).toBeNull();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Unauthorized Access');
  });

  it('loads cold menus once and waits without flashing denial', async () => {
    const { store, grant } = fixture(
      [
        {
          path: 'reports',
          element: hasMn('reports', <div>loaded-report</div>),
        },
      ],
      '/reports',
      true
    );
    expect(screen.getByText('Loading access...')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
    expect(store.load).toHaveBeenCalledTimes(1);
    await grant('reports');
    expect(screen.getByText('loaded-report')).toBeTruthy();
  });

  it('does not load menus or mount pages before session restoration settles', () => {
    const { store } = fixture(
      [{ path: 'reports', element: hasMn('reports', <div>hidden</div>) }],
      '/reports',
      true,
      true
    );
    expect(store.load).not.toHaveBeenCalled();
    expect(screen.getByText('Loading access...')).toBeTruthy();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('denies settled empty menus and throwing predicates', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    fixture([
      {
        path: 'reports',
        element: hasMn(
          () => {
            throw new Error('failed');
          },
          <div>hidden</div>
        ),
      },
    ]);
    expect(screen.getByText('Unauthorized Access')).toBeTruthy();
    expect(screen.queryByText('hidden')).toBeNull();
    error.mockRestore();
  });

  it('supports ANY menu inputs', async () => {
    const { grant } = fixture([
      {
        path: 'reports',
        element: hasMn(['read', 'write'], <div>any-grant</div>),
      },
    ]);
    await grant('write');
    expect(screen.getByText('any-grant')).toBeTruthy();
  });

  it('does not import lazy pages until granted and preserves implicit index and parameter routes', async () => {
    function Detail() {
      const { id } = useParams();
      return <div>detail-{id}</div>;
    }
    const parentLoader = vi.fn(async () => () => <div>parent-page</div>);
    const detailLoader = vi.fn(async () => Detail);
    const { grant } = fixture(
      [
        {
          path: 'reports',
          title: 'Reports',
          loadComponent: hasMn('parent', parentLoader),
          children: [
            {
              path: ':id/edit',
              title: 'Edit',
              loadComponent: hasMn('detail', detailLoader),
            },
          ],
        },
      ],
      '/reports/42/edit?tab=info'
    );
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
    const { grant } = fixture([
      {
        path: 'reports',
        loadComponent: hasMn('index', loader),
        children: [{ path: 'open', element: <div>child</div> }],
      },
    ]);
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
    await waitFor(() =>
      expect(hostApi.setTitle).toHaveBeenLastCalledWith('Open page')
    );
  });

  it('restores index metadata through nested standalone and hosted layout routes', async () => {
    const { grant, hostApi } = fixture(
      [
        {
          path: '',
          children: [
            {
              path: '',
              children: [
                {
                  index: true,
                  title: 'Home',
                  breadcrumb: 'Home',
                  element: hasMn('home', <div>home-content</div>),
                },
              ],
            },
          ],
        },
      ],
      '/'
    );
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Unauthorized Access');
    await grant('home');
    expect(screen.getByText('home-content')).toBeTruthy();
    expect(hostApi.setTitle).toHaveBeenLastCalledWith('Home');
    expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith([
      { label: 'Home', url: undefined },
    ]);
  });

  it('renders unknown routes as 404', () => {
    fixture(
      [{ path: 'reports', element: hasMn('reports', <div>hidden</div>) }],
      '/unknown'
    );
    expect(
      screen.getByRole('heading', { name: 'Page Not Found' })
    ).toBeTruthy();
    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
  });
});

describe('route runtime mapping readiness', () => {
  it('waits for JSON before running a granted lazy page and does not flash forbidden metadata', async () => {
    let resolve!: (value: IPermissionMap) => void;
    const pending = new Promise<IPermissionMap>((done) => {
      resolve = done;
    });
    const page = vi.fn(async () => () => <div>mapped-report</div>);
    const { hostApi } = fixture(
      [{ path: 'reports', loadComponent: hasMn('alias', page) }],
      '/reports',
      false,
      false,
      () => pending
    );
    expect(await screen.findByText('Loading access...')).toBeTruthy();
    expect(screen.queryByText('Unauthorized Access')).toBeNull();
    expect(page).not.toHaveBeenCalled();
    await act(async () => resolve({ alias: true }));
    expect(await screen.findByText('mapped-report')).toBeTruthy();
    expect(page).toHaveBeenCalledTimes(1);
    expect(hostApi.setTitle).not.toHaveBeenCalledWith('Unauthorized Access');
  });

  it('renders forbidden on mapping failure without mounting the protected page', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      const page = vi.fn(async () => () => <div>never-mounted</div>);
      fixture(
        [{ path: 'reports', loadComponent: hasMn('alias', page) }],
        '/reports',
        false,
        false,
        async () => {
          throw new Error('HTTP 404');
        }
      );
      expect(await screen.findByText('Unauthorized Access')).toBeTruthy();
      expect(screen.queryByText('Loading access...')).toBeNull();
      expect(screen.queryByText('never-mounted')).toBeNull();
      expect(page).not.toHaveBeenCalled();
    } finally {
      error.mockRestore();
    }
  });
});
