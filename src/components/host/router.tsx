// router.tsx  (IRouter)
import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import type { UIMatch } from 'react-router-dom';
import { Navigate, Outlet, Route, Routes, useMatches } from 'react-router-dom';
import { useHostApiOptional } from './host-api.context';
import type { IBreadcrumbItem } from './host-api.types';
import type { IRoute, IRoutes } from './router.types';

export type IRouterProps = {
  routes: IRoutes;
  loading?: React.ReactNode;
  notFound?: React.ReactNode;
  redirectIndexTo?: string;
};

type IRouterHandle = {
  title?: string;
  breadcrumb?: string;
};

function normalizePath(path?: string) {
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

function buildBreadcrumbs(
  matches: UIMatch<unknown, unknown>[]
): IBreadcrumbItem[] {
  const items: IBreadcrumbItem[] = [];

  for (const m of matches) {
    const { title, breadcrumb } = readHandle(m.handle);
    const label = breadcrumb ?? title;
    if (!label) continue;

    items.push({ label, url: m.pathname });
  }

  // current page = non-clickable
  if (items.length) {
    items[items.length - 1] = { ...items[items.length - 1], url: undefined };
  }

  return items;
}

function makeElement(r: IRoute) {
  if (r.element) return r.element;

  if (r.loadComponent) {
    const C = lazy(r.loadComponent);
    return <C />;
  }

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

function IRouterMetaSync() {
  const hostApi = useHostApiOptional();
  const matches = useMatches();

  useEffect(() => {
    if (!hostApi) return;

    const last = matches[matches.length - 1];
    const { title } = readHandle(last?.handle);

    hostApi.setTitle(title ?? null);

    const crumbs = buildBreadcrumbs(matches);
    hostApi.setBreadcrumbs(crumbs.length ? crumbs : null);
  }, [matches, hostApi]);

  return null;
}

export function IRouter(props: IRouterProps) {
  const {
    routes,
    loading = <div style={{ padding: 16 }}>Loading…</div>,
    notFound = <div style={{ padding: 16 }}>Not Found</div>,
    redirectIndexTo,
  } = props;

  const routeElements = useMemo(() => renderRouteTree(routes), [routes]);

  return (
    <Suspense fallback={loading}>
      <IRouterMetaSync />

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
