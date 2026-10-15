// router.types.ts
import type React from 'react';
import type { IBreadcrumbItem } from './host-api.types';

export type IRouteComponent = React.ComponentType<unknown>;

export type ILoadComponent = () => Promise<IRouteComponent>;

export type IRoute = {
  path?: string;
  index?: boolean;

  redirectTo?: string;

  title?: string;
  /** Override the label, or hide this level while retaining its title. */
  breadcrumb?: string | false;
  /** Marks the boundary between the host trail and remote route labels. */
  remoteMount?: boolean;
  /** Explicit host trail; otherwise resolved from menus or parent routes. */
  hostBreadcrumbs?: IBreadcrumbItem[];

  element?: React.ReactNode;
  loadComponent?: ILoadComponent;

  children?: IRoutes;
};

export type IRoutes = IRoute[];
