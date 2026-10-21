import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import {
  useISession,
  useISessionExpired,
  useIUserMenuStore,
} from '../auth/insight-auth-context';
import { IRouteAccessDenied } from '../permission/route-access-denied';
import type { IUserMenuStore } from '../store/user-menu';

/** Resolves the menu code that protects the current path. */
export type IRouteMenuCodeResolver = (
  path: string,
  store: IUserMenuStore
) => string | null | undefined;

/** Inputs used to authorize a route against an explicit or resolved menu code. */
export type IRequireRouteAccessProps = {
  /** Static menu code protecting the wrapped route. */
  menuCode?: string;
  /** Resolves a menu code when it depends on the current path. */
  resolveMenuCode?: IRouteMenuCodeResolver;
  /** Temporary behavior for routes that do not have a menu-code mapping. */
  missingMenuCode?: 'allow' | 'deny';
  /** @deprecated Access denial is rendered at the current URL; this value is ignored. */
  unauthorizedPath?: string;
  /** Custom loading placeholder while the session/authorizations are still loading. */
  loading?: ReactNode;
  children: ReactNode;
};

/**
 * Route-membership guard — the React analog of the Angular `requireRouteAccess`.
 * Renders access denial at the requested URL when its menu code is not granted:
 *
 * ```tsx
 * <Route
 *   path="nup"
 *   element={
 *     <IRequireAuth>
 *       <IRequireRouteAccess>
 *         <Nup />
 *       </IRequireRouteAccess>
 *     </IRequireAuth>
 *   }
 * />
 * ```
 *
 * Compose INSIDE `IRequireAuth` — this wrapper only handles the
 * authenticated-but-not-allowed branch. It is menu-data aware: it waits for (or
 * triggers) the user-menu store load before judging, so a cold-start deep link
 * is never denied just because the authorizations have not been fetched yet.
 */
export function IRequireRouteAccess({
  menuCode,
  resolveMenuCode,
  missingMenuCode = 'allow',
  loading,
  children,
}: IRequireRouteAccessProps) {
  const session = useISession();
  const store = useIUserMenuStore();
  const sessionExpired = useISessionExpired();
  const location = useLocation();

  const isInitializing = session.initializing;
  const isAuth = session.isAuth();
  const accessSettled = store.initialized;
  const overlayVisible = sessionExpired.visible;

  // Start in the loading state when mounting on a cold start — authorizations not yet
  // fetched and no store load in flight. The effect below triggers that load,
  // but the first render happens BEFORE the effect runs, so without this the
  // guard would flash access denial before the authorizations
  // arrive (a cold-start deep link must never be denied early).
  const [accessLoading, setAccessLoading] = useState(
    () => !store.initializing && !accessSettled
  );

  // Route membership needs authorizations loaded. When they have not been fetched yet
  // (cold-start deep link before the shell's boot load), trigger the load once.
  useEffect(() => {
    if (!isAuth || isInitializing || overlayVisible) {
      return;
    }
    if (store.initializing) {
      return; // a load is already in flight (e.g. the shell's boot load)
    }
    if (accessSettled) {
      return;
    }
    setAccessLoading(true);
    void store.load().finally(() => setAccessLoading(false));
  }, [isAuth, isInitializing, overlayVisible, store, accessSettled]);

  // The application-level session dialog owns recovery.
  if (overlayVisible) {
    return null;
  }

  if (isInitializing) {
    return (
      (loading as ReactNode) ?? (
        <div className="ih-route-loading">Loading session...</div>
      )
    );
  }

  if (!isAuth) {
    // Defer to the outer IRequireAuth, which owns the sign-in redirect.
    return null;
  }

  // While the authorizations have not settled (loaded or failed) we must not judge:
  // keep showing the loading placeholder whether the store load is in flight
  // (`store.initializing`) or our own cold-start load is running/queued.
  if (!accessSettled && (store.initializing || accessLoading)) {
    return (
      (loading as ReactNode) ?? (
        <div className="ih-route-loading">Loading access...</div>
      )
    );
  }

  const path = location.pathname.replace(/\/+$/, '') || '/';
  const resolvedMenuCode = (menuCode ?? resolveMenuCode?.(path, store))?.trim();
  if (!resolvedMenuCode) {
    console.warn(
      `[@insight/ui] No menu code mapping found for route "${path}".`
    );
    return missingMenuCode === 'allow' ? (
      <>{children}</>
    ) : (
      <IRouteAccessDenied />
    );
  }

  if (!store.hasMenuCode(resolvedMenuCode)) {
    return <IRouteAccessDenied />;
  }

  return <>{children}</>;
}
