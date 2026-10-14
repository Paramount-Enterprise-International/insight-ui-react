// router.types.ts
import type React from 'react';

export type IRouteComponent = React.ComponentType<unknown>;

export type ILoadComponent = () => Promise<IRouteComponent>;

export type IRoute = {
  path?: string;
  index?: boolean;

  redirectTo?: string;

  title?: string;
  /** Override the label, or hide this level while retaining its title. */
  breadcrumb?: string | false;

  element?: React.ReactNode;
  loadComponent?: ILoadComponent;

  children?: IRoutes;
};

export type IRoutes = IRoute[];
