// router.tsx
import React, {
  Suspense,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { RouteObject } from 'react-router-dom';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  UNSAFE_RouteContext,
  matchRoutes,
  useHref,
  useLocation,
} from 'react-router-dom';
import { IAuthContext } from '../auth/insight-auth-context';
import { IErrorPage } from '../error-page/error-page';
import { ILoading } from '../loading';
import { IRouteAccessContext } from '../permission/route-access-context';
import { useHostApiOptional } from './host-api.context';
import type { IMenu } from './host-api.types';
import { buildRouteMetadata } from './router-breadcrumbs';
import type { IRoute, IRouteComponent, IRoutes } from './router.types';

export type IRouterProps = {
  routes: IRoutes;
  loading?: React.ReactNode;
  notFound?: React.ReactNode;
  menus?: readonly IMenu[];
};

function normalizePath(path?: string) {
  // react-router treats "" specially; we use "" to mean "index-like" when redirecting
  if (path == null) return '';
  return path;
}

/**
 * Implicit index support:
 * If a route has children AND has element/loadComponent,
 * we inject an index child that renders the original content.
 *
 * IMPORTANT:
 * - We MUST NOT do this for root/layout routes like path "" (DevLayout), otherwise the layout disappears.
 * - We DO want it for non-root pages like "example-1" that have children.
 */
function expandImplicitIndexRoutes(routes: IRoutes): IRoutes {
  const walk = (list: IRoutes): IRoutes =>
    list.map((r) => {
      const hasChildren = !!r.children?.length;
      const hasOwnContent = !!r.element || !!r.loadComponent;

      if (!hasChildren) return r;

      const expandedChildren = walk(r.children ?? []);

      if (!hasOwnContent) {
        // grouping/layout node (already outlet-only)
        return { ...r, children: expandedChildren };
      }

      // Preserve index-like layout routes (path "" / undefined).
      // This is what keeps DevLayout rendering in AppDev.
      const p = r.path;
      const isIndexLikeLayout = p == null || p === '';
      if (isIndexLikeLayout) {
        return { ...r, children: expandedChildren };
      }

      const hasExplicitIndex = expandedChildren.some((c) => c.index === true);

      const implicitIndex: IRoute = {
        index: true,
        // Metadata stays on the parent for nested breadcrumbs.
        title: undefined,
        breadcrumb: undefined,
        redirectTo: undefined,
        element: r.element,
        loadComponent: r.loadComponent,
      };

      // The parent becomes an outlet wrapper and retains metadata.
      const parent: IRoute = {
        ...r,
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

function metadataRoutes(routes: IRoutes): RouteObject[] {
  return routes.map((route) =>
    route.index || (route.redirectTo && !route.path)
      ? { index: true, handle: route }
      : {
          path: route.path || undefined,
          handle: route,
          children: route.children ? metadataRoutes(route.children) : undefined,
        }
  );
}

const EMPTY_MENUS: readonly IMenu[] = [];
const NOOP_SUBSCRIBE = () => () => {};
const ZERO_VERSION = () => 0;

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

    // treat path "" redirect as index redirect
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
    loading = <ILoading mode="container" label="Loading…" />,
    notFound = <IErrorPage kind="not-found" />,
  } = props;

  const hostApi = useHostApiOptional();
  const location = useLocation();
  const baseHref = useHref('/');
  // Match the same parent base used by descendant React Router Routes.
  const routeBase =
    useContext(UNSAFE_RouteContext).matches.at(-1)?.pathnameBase ?? '/';
  const auth = useContext(IAuthContext);
  const store = auth?.userMenuStore;
  useSyncExternalStore(
    store?.subscribe ?? NOOP_SUBSCRIBE,
    store?.getVersion ?? ZERO_VERSION,
    store?.getVersion ?? ZERO_VERSION
  );
  const menus = props.menus ?? store?.menus ?? EMPTY_MENUS;
  const [deniedOwners, setDeniedOwners] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const reportAccess = useCallback((owner: string, denied: boolean) => {
    setDeniedOwners((current) => {
      if (current.has(owner) === denied) return current;
      const next = new Set(current);
      if (denied) next.add(owner);
      else next.delete(owner);
      return next;
    });
  }, []);
  const denied = deniedOwners.size > 0;

  const expandedRoutes = useMemo(
    () => expandImplicitIndexRoutes(routes),
    [routes]
  );
  const routeElements = useMemo(
    () => renderRouteTree(expandedRoutes),
    [expandedRoutes]
  );

  const matchingRoutes = useMemo(
    () => metadataRoutes(expandedRoutes),
    [expandedRoutes]
  );

  const lastTitleRef = useRef<string | null>(null);
  const lastCrumbsKeyRef = useRef<string>('');

  useEffect(() => {
    if (!hostApi) return;

    const chain = (
      matchRoutes(matchingRoutes, location.pathname, routeBase) ?? []
    ).map((match) => ({
      route: match.route.handle as IRoute,
      url: routeBase.replace(/\/+$/, '') + match.pathname || '/',
      mountUrl: routeBase.replace(/\/+$/, '') + match.pathnameBase || '/',
    }));
    const metadata = buildRouteMetadata(chain, menus, baseHref);
    if (hostApi.setRouteMetadata) {
      hostApi.setRouteMetadata({ ...metadata, denied });
      return;
    }

    // Older host bridges consume complete title and breadcrumb overrides.
    const crumbs = denied
      ? [{ label: 'Unauthorized Access', url: undefined }]
      : (metadata.breadcrumbs ?? []).map((crumb, index, all) =>
          index === all.length - 1 ? { ...crumb, url: undefined } : crumb
        );
    const crumbsKey = JSON.stringify(crumbs);
    const nextTitle = denied ? 'Unauthorized Access' : metadata.title;

    if (lastTitleRef.current !== nextTitle) {
      lastTitleRef.current = nextTitle;
      hostApi.setTitle(nextTitle);
    }

    if (lastCrumbsKeyRef.current !== crumbsKey) {
      lastCrumbsKeyRef.current = crumbsKey;
      hostApi.setBreadcrumbs(crumbs.length ? crumbs : null);
    }
  }, [
    hostApi,
    location.pathname,
    matchingRoutes,
    menus,
    baseHref,
    routeBase,
    denied,
  ]);

  return (
    <IRouteAccessContext.Provider value={reportAccess}>
      <Suspense fallback={loading}>
        <Routes>
          {routeElements}
          <Route path="*" element={notFound} />
        </Routes>
      </Suspense>
    </IRouteAccessContext.Provider>
  );
}
