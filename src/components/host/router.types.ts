// routes.types.ts  (make sure filename matches your imports everywhere)
import type React from 'react';

export type IRoute = {
  path?: string;
  index?: boolean;

  // meta
  title?: string;
  breadcrumb?: string;

  // render strategy
  element?: React.ReactNode;

  // eslint-safe lazy loader
  loadComponent?: () => Promise<{ default: React.ComponentType<unknown> }>;

  children?: IRoutes;
};

export type IRoutes = IRoute[];
