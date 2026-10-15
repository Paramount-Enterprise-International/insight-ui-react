import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { IHostApiProvider } from './host-api.context';
import { IRouter } from './router';
import type { IRoutes } from './router.types';

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
