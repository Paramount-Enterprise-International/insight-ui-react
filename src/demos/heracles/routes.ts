// routes.tsx

import type { IRoutes } from '@insight/ui';

export const heraclesRoutes: IRoutes = [
  {
    path: 'heracles',
    title: 'Hearacles',
    breadcrumb: 'Hearacles',
    loadComponent: () => import('./Dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'create',
        title: 'Create',
        breadcrumb: 'Create',
        loadComponent: () => import('./create/Create').then((m) => m.Create),
      },
      {
        path: 'edit/:id',
        title: 'Edit',
        breadcrumb: 'Edit',
        loadComponent: () => import('./edit/Edit').then((m) => m.Edit),
      },
    ],
  },
];
