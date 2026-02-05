// routes.tsx

import type { IRoutes } from '@insight/ui';

export const heraclesRoutes: IRoutes = [
  {
    path: 'heracles',
    title: 'Heracles',
    breadcrumb: 'Heracles',
    loadComponent: () => import('./Dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'create',
        title: 'Heracles',
        breadcrumb: 'Heracles',
        loadComponent: () => import('./create/Create').then((m) => m.Create),
      },
      {
        path: 'edit/:id',
        title: 'Heracles',
        breadcrumb: 'Heracles',
        loadComponent: () => import('./edit/Edit').then((m) => m.Edit),
      },
    ],
  },
];
