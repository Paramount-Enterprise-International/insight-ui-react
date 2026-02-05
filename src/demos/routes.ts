// routes.tsx

import type { IRoutes } from '@insight/ui';
import { heraclesRoutes } from './heracles/routes';

export const demosRoutes: IRoutes = [
  {
    path: 'demos',
    title: 'Demos',
    breadcrumb: 'Demos',
    loadComponent: () =>
      import('./heracles/Dashboard').then((m) => m.Dashboard),
    children: [...heraclesRoutes],
  },
];
