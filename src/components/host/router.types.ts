// router.types.ts
import type React from 'react';

export type IRouteComponent = React.ComponentType<unknown>;

export type ILoadComponent = () => Promise<IRouteComponent>;

export type IRoute = {
  path?: string;
  index?: boolean;

  redirectTo?: string;

  title?: string;
  breadcrumb?: string;

  element?: React.ReactNode;
  loadComponent?: ILoadComponent;

  children?: IRoutes;
};

export type IRoutes = IRoute[];
