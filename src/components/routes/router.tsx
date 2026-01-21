// IRouter.tsx
import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useMatches,
  useNavigate,
  type UIMatch,
} from 'react-router-dom';
import type { IRoute, IRoutes } from './router.types';

export type IRouterBreadcrumbItem = {
  label: string;
  url: string;
};

export type IRouterHostApi = {
  setPageTitle?: (title: string) => void;
  setBreadcrumbs?: (items: IRouterBreadcrumbItem[]) => void;

  /** Optional: expose navigate to host/remotes */
  setNavigate?: (navigate: (to: string) => void) => void;
};

export type IRouterProps = {
  routes: IRoutes;

  loading?: React.ReactNode;
  notFound?: React.ReactNode;

  /** Optional: integrate with shell/host API */
  hostApi?: IRouterHostApi;

  /** Optional: redirect from index route */
  redirectIndexTo?: string;
};

type IRouterHandle = {
  title?: string;
  breadcrumb?: string;
};

function normalizePath(path?: string) {
  // Allow Angular-ish '' while still supporting standard strings.
  if (path === '' || path == null) return undefined;
  return path;
}

function readHandle(handle: unknown): IRouterHandle {
  if (handle && typeof handle === 'object') {
    const h = handle as Partial<IRouterHandle>;
    return { title: h.title, breadcrumb: h.breadcrumb };
  }
  return {};
}

/**
 * Build breadcrumbs using ONLY fields that exist on UIMatch across versions:
 * - pathname
 * - handle
 */
function buildBreadcrumbs(
  matches: UIMatch<unknown, unknown>[]
): IRouterBreadcrumbItem[] {
  const crumbs: IRouterBreadcrumbItem[] = [];

  for (const m of matches) {
    const { title, breadcrumb } = readHandle(m.handle);
    const label = breadcrumb ?? title;
    if (!label) continue;

    const url = m.pathname ?? '/';
    crumbs.push({ label, url });
  }

  return crumbs;
}

function makeElement(r: IRoute) {
  if (r.element) return r.element;

  if (r.loadComponent) {
    const C = lazy(r.loadComponent);
    return <C />;
  }

  // If a route has children but no element, provide an Outlet wrapper.
  if (r.children?.length) return <Outlet />;

  return null;
}

function renderRouteTree(routes: IRoutes): React.ReactNode {
  return routes.map((r, idx) => {
    const path = normalizePath(r.path);
    const element = makeElement(r);

    if (r.index) {
      return (
        <Route
          key={`idx-${idx}`}
          index
          element={element}
          handle={
            { title: r.title, breadcrumb: r.breadcrumb } satisfies IRouterHandle
          }
        />
      );
    }

    return (
      <Route
        key={`${path ?? 'root'}-${idx}`}
        path={path}
        element={element}
        handle={
          { title: r.title, breadcrumb: r.breadcrumb } satisfies IRouterHandle
        }>
        {r.children?.length ? renderRouteTree(r.children) : null}
      </Route>
    );
  });
}

function IRouterMetaSync({ hostApi }: { hostApi?: IRouterHostApi }) {
  const matches = useMatches();

  useEffect(() => {
    if (!hostApi) return;

    // Title: last match wins
    const last = matches[matches.length - 1];
    const { title: lastTitle } = readHandle(last?.handle);
    if (lastTitle && hostApi.setPageTitle) hostApi.setPageTitle(lastTitle);

    // Breadcrumbs
    if (hostApi.setBreadcrumbs) {
      hostApi.setBreadcrumbs(buildBreadcrumbs(matches));
    }
  }, [matches, hostApi]);

  return null;
}

function IRouterExposeNavigate({ hostApi }: { hostApi?: IRouterHostApi }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (hostApi?.setNavigate) {
      hostApi.setNavigate((to) => navigate(to));
    }
  }, [hostApi, navigate]);

  return null;
}

export function IRouter(props: IRouterProps) {
  const {
    routes,
    loading = <div style={{ padding: 16 }}>Loading…</div>,
    notFound = <div style={{ padding: 16 }}>Not Found</div>,
    hostApi,
    redirectIndexTo,
  } = props;

  const routeElements = useMemo(() => renderRouteTree(routes), [routes]);

  return (
    <Suspense fallback={loading}>
      <IRouterMetaSync hostApi={hostApi} />
      <IRouterExposeNavigate hostApi={hostApi} />

      <Routes>
        {redirectIndexTo ? (
          <Route index element={<Navigate to={redirectIndexTo} replace />} />
        ) : null}

        {routeElements}

        <Route path="*" element={notFound} />
      </Routes>
    </Suspense>
  );
}
