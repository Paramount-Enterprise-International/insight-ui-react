import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { StrictMode, useContext, useLayoutEffect } from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { IAuthContext } from '../auth/insight-auth-context';
import { IRouteAccessContext } from '../permission/route-access-context';
import type { IUserMenuStore } from '../store/user-menu';
import { IHContent } from './content/content';
import { IHostApiProvider } from './host-api.context';
import type { IHostApi, IMenu } from './host-api.types';
import { IHostUiProvider, useHostUi } from './host-ui.context';
import { findBreadcrumbMenuChain } from './menu';
import { IRouter } from './router';
import { toRouterUrl } from './router-breadcrumbs';
import type { IRoutes } from './router.types';
import { HostShell } from './shell/host-shell';
import { useRemoteHostApi } from './shell/remote-host-api';

function Layout() {
  const ui = useHostUi();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="location">{location.pathname}</output>
      <button onClick={() => navigate('/home')}>Home route</button>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate(1)}>Forward</button>
      <button onClick={() => ui.setTitle('Override heading')}>
        Override title
      </button>
      <button onClick={() => ui.setBreadcrumbs([{ label: 'Override trail' }])}>
        Override trail
      </button>
      <button onClick={() => ui.setBreadcrumbs([])}>Empty trail</button>
      <button onClick={() => ui.clear()}>Clear overrides</button>
      <IHContent title={ui.title} breadcrumbs={ui.breadcrumbs} />
    </>
  );
}

function Denied() {
  const report = useContext(IRouteAccessContext);
  useLayoutEffect(() => {
    report?.('restricted', true);
    return () => report?.('restricted', false);
  }, [report]);
  return <div>Denied page</div>;
}

const remoteRoutes: IRoutes = [
  {
    path: ':id',
    title: 'Record heading',
    breadcrumb: 'Details',
    children: [
      { index: true, breadcrumb: false, element: <div>Record page</div> },
      {
        path: 'edit',
        title: 'Edit heading',
        breadcrumb: 'Edit',
        element: <div>Edit page</div>,
      },
      { path: 'restricted', title: 'Restricted heading', element: <Denied /> },
    ],
  },
];

function Remote() {
  const hostApi = useRemoteHostApi();
  return (
    <IHostApiProvider hostApi={hostApi}>
      <IRouter routes={remoteRoutes} />
    </IHostApiProvider>
  );
}

function hostRoutes(explicit = false): IRoutes {
  return [
    {
      path: '',
      element: <Layout />,
      children: [
        {
          path: 'home',
          title: 'Dashboard',
          element: <div>Dashboard page</div>,
        },
        {
          path: 'people/*',
          title: 'Customers',
          remoteMount: true,
          hostBreadcrumbs: explicit
            ? [
                { label: 'Sales' },
                { label: 'Configured customers', url: '/people' },
              ]
            : undefined,
          element: <Remote />,
        },
      ],
    },
  ];
}

describe('React host parity', () => {
  it('composes nested remote routes and reactive menu ancestry with independent headings', async () => {
    const routes = hostRoutes();
    const view = render(
      <MemoryRouter basename="/-/" initialEntries={['/-/people/123/edit']}>
        <HostShell>
          <IRouter routes={routes} />
        </HostShell>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Edit heading')
    );
    const menus = [
      { name: 'Sales', children: [{ name: 'Customers', route: '/-/people' }] },
    ];
    view.rerender(
      <MemoryRouter basename="/-/" initialEntries={['/-/people/123/edit']}>
        <HostShell>
          <IRouter routes={routes} menus={menus} />
        </HostShell>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Sales')).toBeInTheDocument());
    expect(screen.getByText('Details')).toHaveAttribute(
      'href',
      '/-/people/123'
    );
    expect(screen.getByText('Customers')).toHaveAttribute('href', '/-/people');
    fireEvent.click(screen.getByText('Details'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Record heading')
    );
    expect(screen.getByTestId('location')).toHaveTextContent('/people/123');
    fireEvent.click(screen.getByText('Back'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Edit heading')
    );
    fireEvent.click(screen.getByText('Forward'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Record heading')
    );
    fireEvent.click(screen.getByText('Home route'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Dashboard')
    );
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });

  it('prefers explicit host breadcrumbs and preserves full overrides across remote updates', async () => {
    render(
      <MemoryRouter initialEntries={['/people/123/edit']}>
        <HostShell>
          <IRouter
            routes={hostRoutes(true)}
            menus={[{ name: 'Backend label', route: '/people' }]}
          />
        </HostShell>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByText('Configured customers')).toBeInTheDocument()
    );
    expect(screen.queryByText('Backend label')).not.toBeInTheDocument();
    expect(screen.getByText('Sales').tagName).toBe('SPAN');
    fireEvent.click(screen.getByText('Override title'));
    fireEvent.click(screen.getByRole('button', { name: 'Override trail' }));
    expect(screen.getByRole('heading')).toHaveTextContent('Override heading');
    expect(
      screen.getByText('Override trail', { selector: 'span' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Home route'));
    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/home')
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Override heading');
    fireEvent.click(screen.getByText('Empty trail'));
    expect(document.querySelector('.ih-content-breadcrumbs')).toHaveTextContent(
      'Home'
    );
    expect(screen.queryByText('Configured customers')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear overrides'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Dashboard')
    );
  });

  it('replaces the whole trail on remote permission denial and restores it on navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/people/123/restricted']}>
        <HostShell>
          <IRouter routes={hostRoutes()} />
        </HostShell>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent(
        'Unauthorized Access'
      )
    );
    expect(document.querySelector('.ih-content-breadcrumbs')).toHaveTextContent(
      'Unauthorized Access'
    );
    expect(screen.queryByText('Customers')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Home route'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Dashboard')
    );
    expect(screen.queryByText('Unauthorized Access')).not.toBeInTheDocument();
  });

  it('reacts to menu store publication without requiring a menus prop', async () => {
    let version = 0;
    const listeners = new Set<() => void>();
    const store = {
      menus: [] as IMenu[],
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      getVersion: () => version,
    };
    render(
      <IAuthContext.Provider
        value={{ userMenuStore: store as IUserMenuStore } as IAuthContext}>
        <MemoryRouter initialEntries={['/people/123']}>
          <HostShell>
            <IRouter routes={hostRoutes()} />
          </HostShell>
        </MemoryRouter>
      </IAuthContext.Provider>
    );
    await waitFor(() =>
      expect(screen.getByText('Details')).toBeInTheDocument()
    );
    act(() => {
      store.menus = [
        {
          name: 'Operations',
          children: [{ name: 'Directory', route: '/people' }],
        },
      ];
      version++;
      listeners.forEach((listener) => listener());
    });
    await waitFor(() =>
      expect(screen.getByText('Operations')).toBeInTheDocument()
    );
    expect(screen.getByText('Directory')).toBeInTheDocument();
  });

  it('ignores late metadata from an unmounted remote and supports StrictMode replay', async () => {
    let remoteApi: IHostApi;
    function LateRemote() {
      remoteApi = useRemoteHostApi();
      return (
        <IHostApiProvider hostApi={remoteApi}>
          <IRouter routes={remoteRoutes} />
        </IHostApiProvider>
      );
    }
    const routes = hostRoutes();
    routes[0].children![1].element = <LateRemote />;
    render(
      <StrictMode>
        <MemoryRouter initialEntries={['/people/123']}>
          <HostShell>
            <IRouter routes={routes} />
          </HostShell>
        </MemoryRouter>
      </StrictMode>
    );
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Record heading')
    );
    fireEvent.click(screen.getByText('Home route'));
    await waitFor(() =>
      expect(screen.getByRole('heading')).toHaveTextContent('Dashboard')
    );
    act(() => {
      remoteApi.setTitle('Stale heading');
      remoteApi.setBreadcrumbs([{ label: 'Stale trail' }]);
      remoteApi.setRouteMetadata?.({
        title: 'Stale route',
        breadcrumbs: [{ label: 'Stale' }],
        denied: true,
      });
    });
    expect(screen.getByRole('heading')).toHaveTextContent('Dashboard');
    expect(screen.queryByText('Stale trail')).not.toBeInTheDocument();
  });

  it('clearRemote preserves host metadata and full overrides; clear restores route defaults', () => {
    let ui: ReturnType<typeof useHostUi>;
    function Probe() {
      ui = useHostUi();
      return null;
    }
    render(
      <IHostUiProvider>
        <Probe />
      </IHostUiProvider>
    );
    act(() =>
      ui.setRouteMetadata({ title: 'Host', breadcrumbs: [{ label: 'Host' }] })
    );
    act(() => {
      ui.setRemoteTitle('Remote');
      ui.setRemoteBreadcrumbs([{ label: 'Remote' }]);
    });
    expect(ui!.title).toBe('Remote');
    expect(ui!.breadcrumbs?.map((item) => item.label)).toEqual([
      'Host',
      'Remote',
    ]);
    act(() => {
      ui.setTitle('Pinned');
      ui.setBreadcrumbs([{ label: 'Pinned' }]);
      ui.clearRemote();
    });
    expect(ui!.title).toBe('Pinned');
    expect(ui!.breadcrumbs).toEqual([{ label: 'Pinned' }]);
    act(() => ui.clear());
    expect(ui!.title).toBe('Host');
    expect(ui!.breadcrumbs).toEqual([{ label: 'Host' }]);
  });
});

describe('breadcrumb URL and menu matching', () => {
  it('selects the longest segment-aligned route in modern and legacy menu trees', () => {
    const menus = [
      {
        menuName: 'Sales',
        child: [
          { menuName: 'People', route: '/-/people' },
          { menuName: 'Reports', route: '/people/reports?view=all' },
          { menuName: 'Wrong prefix', route: '/people/report' },
          { menuName: 'External', route: 'https://example.com/people/reports' },
        ],
      },
    ];
    expect(
      findBreadcrumbMenuChain(menus, '/people/reports/123').map(
        (item) => item.menuName
      )
    ).toEqual(['Sales', 'Reports']);
    expect(findBreadcrumbMenuChain(menus, '/peoples')).toEqual([]);
  });

  it('strips a basename once while preserving URL parameters, fragments and external URLs', () => {
    expect(toRouterUrl('/-/people/123?tab=edit#name', '/-/')).toBe(
      '/people/123?tab=edit#name'
    );
    expect(toRouterUrl('/people', '/-/')).toBe('/people');
    expect(toRouterUrl('/-/?tab=all', '/-/')).toBe('/?tab=all');
    expect(toRouterUrl('/atlas-other/people', '/atlas/')).toBe(
      '/atlas-other/people'
    );
    expect(toRouterUrl('https://example.com/people', '/-/')).toBe(
      'https://example.com/people'
    );
    expect(toRouterUrl('//example.com/people', '/-/')).toBe(
      '//example.com/people'
    );
  });
});
