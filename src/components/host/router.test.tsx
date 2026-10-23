import { act, render, screen, waitFor } from '@testing-library/react';
import { Component, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { IHostApiProvider } from './host-api.context';
import { IRouter } from './router';
import type { IRouteComponent, IRoutes } from './router.types';

class RouteFailureBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="alert">Page unavailable</p>
    ) : (
      this.props.children
    );
  }
}

function fixture(routes: IRoutes, path: string) {
  const hostApi = {
    navigate: vi.fn(),
    setTitle: vi.fn(),
    setBreadcrumbs: vi.fn(),
  };
  render(
    <IHostApiProvider hostApi={hostApi}>
      <MemoryRouter initialEntries={[path]}>
        <IRouter routes={routes} />
      </MemoryRouter>
    </IHostApiProvider>
  );
  return hostApi;
}

describe('React breadcrumb suppression', () => {
  it('hides a landing breadcrumb but retains its title and visible parent', async () => {
    const hostApi = fixture(
      [
        {
          path: 'customers',
          title: 'Customers',
          children: [
            {
              index: true,
              title: 'Customer Directory',
              breadcrumb: false,
              element: <div>Directory</div>,
            },
          ],
        },
      ],
      '/customers'
    );
    expect(screen.getByText('Directory')).toBeTruthy();
    await waitFor(() => {
      expect(hostApi.setTitle).toHaveBeenLastCalledWith('Customer Directory');
      expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith([
        { label: 'Customers', url: undefined },
      ]);
    });
  });

  it('keeps descendant labels and resolved URLs beneath a hidden parent', async () => {
    const hostApi = fixture(
      [
        {
          path: 'records',
          title: 'Internal wrapper',
          breadcrumb: false,
          children: [
            {
              path: ':id',
              title: 'Record heading',
              breadcrumb: 'Record',
              children: [
                {
                  path: 'edit',
                  title: 'Edit heading',
                  breadcrumb: 'Edit',
                  element: <div>Editor</div>,
                },
              ],
            },
          ],
        },
      ],
      '/records/123/edit'
    );
    await waitFor(() => {
      expect(hostApi.setTitle).toHaveBeenLastCalledWith('Edit heading');
      expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith([
        { label: 'Record', url: '/records/123' },
        { label: 'Edit', url: undefined },
      ]);
    });
  });

  it('sends no remote trail when every level is hidden, without hiding the title', async () => {
    const hostApi = fixture(
      [
        {
          path: 'reports',
          title: 'Reports',
          breadcrumb: false,
          element: <div>Reports page</div>,
        },
      ],
      '/reports'
    );
    await waitFor(() => {
      expect(hostApi.setTitle).toHaveBeenLastCalledWith('Reports');
      expect(hostApi.setBreadcrumbs).toHaveBeenLastCalledWith(null);
    });
  });
});

describe('route loading', () => {
  it('hands a rejected lazy import to the consumer error boundary', async () => {
    let reject!: (reason: Error) => void;
    const pending = new Promise<IRouteComponent>((_, fail) => {
      reject = fail;
    });
    const logged = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      render(
        <MemoryRouter>
          <RouteFailureBoundary>
            <IRouter routes={[{ index: true, loadComponent: () => pending }]} />
          </RouteFailureBoundary>
        </MemoryRouter>
      );
      expect(screen.getByRole('status')).toBeTruthy();
      await act(async () => {
        reject(new Error('Import failed'));
      });
      expect(screen.getByRole('alert')).toHaveTextContent('Page unavailable');
      expect(screen.queryByRole('status')).toBeNull();
    } finally {
      logged.mockRestore();
    }
  });

  it('replaces the centered spinner with the resolved lazy page', async () => {
    let resolve!: (page: IRouteComponent) => void;
    const pending = new Promise<IRouteComponent>((done) => {
      resolve = done;
    });
    render(
      <MemoryRouter>
        <IRouter routes={[{ index: true, loadComponent: () => pending }]} />
      </MemoryRouter>
    );
    expect(screen.getByRole('status')).toHaveAttribute('mode', 'container');
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    await act(async () => {
      resolve(() => <p>Resolved page</p>);
    });
    expect(screen.getByText('Resolved page')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('preserves a custom router fallback', () => {
    render(
      <MemoryRouter>
        <IRouter
          loading={<p>Custom page progress</p>}
          routes={[{ index: true, loadComponent: () => new Promise(() => {}) }]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Custom page progress')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });
});
