// routes.types.ts
import type React from 'react';

export type IRoute = {
  /** '' or undefined allowed (useful for root-ish routes) */
  path?: string;

  /** index route (React Router v6) */
  index?: boolean;

  /** Angular-ish metadata */
  title?: string;
  breadcrumb?: string;

  /** Render strategy (pick one) */
  element?: React.ReactNode;

  /**
   * Lazy load (Angular-like loadComponent)
   * Use unknown to avoid eslint no-explicit-any.
   */
  loadComponent?: () => Promise<{ default: React.ComponentType<unknown> }>;

  /** Nested routes */
  children?: IRoutes;
};

export type IRoutes = IRoute[];
