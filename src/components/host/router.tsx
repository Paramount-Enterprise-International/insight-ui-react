// router.tsx
import React, { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useHostApiOptional } from './host-api.context';
import type { IBreadcrumbItem } from './host-api.types';
import type { IRoute, IRouteComponent, IRoutes } from './router.types';

export type IRouterProps = {
  routes: IRoutes;
  loading?: React.ReactNode;
  notFound?: React.ReactNode;
};

function stripSlashes(s: string): string {
  return (s ?? '').replace(/^\/+|\/+$/g, '');
}

function normalizePath(path?: string) {
  // react-router treats "" specially; we use "" to mean "index-like" when redirecting
  if (path == null) return '';
  return path;
}

function splitPathname(pathname: string): string[] {
  const clean = stripSlashes(pathname);
  return clean ? clean.split('/').filter(Boolean) : [];
}

function matchSegment(routeSegment: string, urlSegment: string) {
  if (routeSegment.startsWith(':')) return true;
  return routeSegment === urlSegment;
}

/**
 * Implicit index support:
 * If a route has children AND has element/loadComponent,
 * we inject an index child that renders the original content.
 * The parent becomes an <Outlet/> wrapper and should NOT contribute breadcrumbs.
 */
function expandImplicitIndexRoutes(routes: IRoutes): IRoutes {
  const walk = (list: IRoutes): IRoutes =>
    list.map((r) => {
      const hasChildren = !!r.children?.length;
      const hasOwnContent = !!r.element || !!r.loadComponent;

      if (!hasChildren) return r;

      const expandedChildren = walk(r.children ?? []);

      if (!hasOwnContent) {
        // grouping/layout node
        return { ...r, children: expandedChildren };
      }

      const hasExplicitIndex = expandedChildren.some((c) => c.index === true);

      const implicitIndex: IRoute = {
        index: true,
        // keep meta here (leaf), not on the parent
        title: r.title,
        breadcrumb: r.breadcrumb,
        element: r.element,
        loadComponent: r.loadComponent,
      };

      // parent becomes pure outlet wrapper and MUST NOT add crumb/meta
      const parent: IRoute = {
        ...r,
        title: undefined,
        breadcrumb: undefined,
        element: <Outlet />,
        loadComponent: undefined,
        children: hasExplicitIndex
          ? expandedChildren
          : [implicitIndex, ...expandedChildren],
      };

      return parent;
    });

  return walk(routes);
}

type MatchNode = { route: IRoute; url: string };

function findMatchChain(
  routes: IRoutes,
  urlSegments: string[],
  baseUrl: string
): MatchNode[] | null {
  // at end: match index route if present
  if (urlSegments.length === 0) {
    const indexRoute = routes.find((r) => r.index);
    if (indexRoute) return [{ route: indexRoute, url: baseUrl || '/' }];
    return null;
  }

  for (const r of routes) {
    if (r.index) continue;

    const routePath = stripSlashes(normalizePath(r.path));
    const routeSegments = routePath ? routePath.split('/').filter(Boolean) : [];

    // path '' wrapper: try children without consuming segments
    if (routeSegments.length === 0) {
      if (r.children?.length) {
        const next = findMatchChain(r.children, urlSegments, baseUrl);
        if (next) return [{ route: r, url: baseUrl || '/' }, ...next];
      }
      continue;
    }

    if (routeSegments.length > urlSegments.length) continue;

    let ok = true;
    const consumed: string[] = [];

    for (let i = 0; i < routeSegments.length; i++) {
      const a = routeSegments[i];
      const b = urlSegments[i];
      if (!matchSegment(a, b)) {
        ok = false;
        break;
      }
      consumed.push(b);
    }
    if (!ok) continue;

    const nextBase = (baseUrl + '/' + consumed.join('/')).replace(/\/+/g, '/');
    const remaining = urlSegments.slice(routeSegments.length);

    if (remaining.length === 0) {
      // exact match: if it has index child, prefer it
      if (r.children?.length) {
        const indexChild = r.children.find((c) => c.index);
        if (indexChild) {
          return [
            { route: r, url: nextBase || '/' },
            { route: indexChild, url: nextBase || '/' },
          ];
        }
      }
      return [{ route: r, url: nextBase || '/' }];
    }

    if (r.children?.length) {
      const child = findMatchChain(r.children, remaining, nextBase);
      if (child) return [{ route: r, url: nextBase || '/' }, ...child];
    }
  }

  return null;
}

function buildBreadcrumbsFromChain(chain: MatchNode[]): IBreadcrumbItem[] {
  const items: IBreadcrumbItem[] = [];

  for (const m of chain) {
    // ignore redirect-only nodes
    if (m.route.redirectTo) continue;

    const label = m.route.breadcrumb ?? m.route.title;
    if (!label) continue;

    // ✅ de-dupe consecutive labels (fixes "Reports > Reports")
    const last = items[items.length - 1];
    if (last && last.label === label) continue;

    items.push({ label, url: m.url });
  }

  if (items.length) {
    items[items.length - 1] = { ...items[items.length - 1], url: undefined };
  }

  return items;
}

function makeElement(r: IRoute) {
  // redirect node
  if (r.redirectTo) return <Navigate to={r.redirectTo} replace />;

  if (r.element) return r.element;

  if (r.loadComponent) {
    const C = lazy(async () => {
      const comp: IRouteComponent = await r.loadComponent!();
      return { default: comp };
    });
    return <C />;
  }

  if (r.children?.length) return <Outlet />;

  return null;
}

function renderRouteTree(routes: IRoutes): React.ReactNode {
  return routes.map((r, idx) => {
    const element = makeElement(r);

    // ✅ treat path "" redirect as index redirect
    const isIndexLike = r.index === true || r.path === '' || r.path == null;

    if (isIndexLike) {
      if (r.redirectTo) {
        return <Route key={`redir-${idx}`} index element={element} />;
      }
      if (r.index) {
        return <Route key={`idx-${idx}`} index element={element} />;
      }
      // path "" layout route
      return (
        <Route key={`layout-${idx}`} element={element}>
          {r.children?.length ? renderRouteTree(r.children) : null}
        </Route>
      );
    }

    const path = normalizePath(r.path) || undefined;

    return (
      <Route key={`${path ?? 'root'}-${idx}`} path={path} element={element}>
        {r.children?.length ? renderRouteTree(r.children) : null}
      </Route>
    );
  });
}

export function IRouter(props: IRouterProps) {
  const {
    routes,
    loading = <div style={{ padding: 16 }}>Loading…</div>,
    notFound = <div style={{ padding: 16 }}>Not Found</div>,
  } = props;

  const hostApi = useHostApiOptional();
  const location = useLocation();

  const expandedRoutes = useMemo(
    () => expandImplicitIndexRoutes(routes),
    [routes]
  );
  const routeElements = useMemo(
    () => renderRouteTree(expandedRoutes),
    [expandedRoutes]
  );

  const lastTitleRef = useRef<string | null>(null);
  const lastCrumbsKeyRef = useRef<string>('');

  useEffect(() => {
    if (!hostApi) return;

    const urlSegments = splitPathname(location.pathname);
    const chain = findMatchChain(expandedRoutes, urlSegments, '') ?? [];

    const crumbs = buildBreadcrumbsFromChain(chain);
    const crumbsKey = JSON.stringify(
      crumbs.map((c) => ({ l: c.label, u: c.url ?? '' }))
    );

    // title = last route in chain that has title
    const lastWithTitle = [...chain]
      .reverse()
      .find((x) => x.route.title)?.route;
    const nextTitle = lastWithTitle?.title ?? null;

    if (lastTitleRef.current !== nextTitle) {
      lastTitleRef.current = nextTitle;
      hostApi.setTitle(nextTitle);
    }

    if (lastCrumbsKeyRef.current !== crumbsKey) {
      lastCrumbsKeyRef.current = crumbsKey;
      hostApi.setBreadcrumbs(crumbs.length ? crumbs : null);
    }
  }, [hostApi, location.pathname, expandedRoutes]);

  return (
    <Suspense fallback={loading}>
      <Routes>
        {routeElements}
        <Route path="*" element={notFound} />
      </Routes>
    </Suspense>
  );
}
