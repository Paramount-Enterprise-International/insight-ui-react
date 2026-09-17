import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import {
  useISession,
  useISessionExpired,
  useIUserMenuStore,
} from '../auth/insight-auth-context';
import type { IUserMenuStore } from '../store/user-menu.store';
import { UNAUTHORIZED_ACCESS_PATH } from './require-access';

/** Resolves the menu code that protects the current path. */
export type IRouteMenuCodeResolver = (path: string, store: IUserMenuStore) => string | null | undefined;

export type IRequireRouteAccessProps = {
  /** Static menu code protecting the wrapped route. */
  menuCode?: string;
  /** Resolves a menu code when it depends on the current path. */
  resolveMenuCode?: IRouteMenuCodeResolver;
  /** Temporary behavior for routes that do not have a menu-code mapping. */
  missingMenuCode?: 'allow' | 'deny';
  /** Where to redirect users without access to the current route. */
  unauthorizedPath?: string;
  /** Custom loading placeholder while the session/authorizations are still loading. */
  loading?: ReactNode;
  children: ReactNode;
};

/**
 * Route-membership guard — the React analog of the Angular `requireRouteAccess`.
 * Wraps a route element and denies navigation to pages the user has no granted
 * menu for by rendering `<Navigate>` to `unauthorizedPath`:
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
  unauthorizedPath = UNAUTHORIZED_ACCESS_PATH,
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

  // Start in the loading state when mounting on a cold start — authorizations not yet
  // fetched and no store load in flight. The effect below triggers that load,
  // but the first render happens BEFORE the effect runs, so without this the
  // guard would flash a redirect to the unauthorized page before the authorizations
  // arrive (a cold-start deep link must never be denied early).
  const [accessLoading, setAccessLoading] = useState(
    () => !store.initializing && !accessSettled,
  );

  // Route membership needs authorizations loaded. When they have not been fetched yet
  // (cold-start deep link before the shell's boot load), trigger the load once.
  useEffect(() => {
    if (!isAuth || isInitializing) {
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
  }, [isAuth, isInitializing, store, accessSettled]);

  // The session-expired overlay owns the UX while visible — render the content
  // behind it (mirrors IRequireAuth).
  if (sessionExpired.visible) {
    return <>{children}</>;
  }

  if (isInitializing) {
    return (loading as ReactNode) ?? <div className="ih-route-loading">Loading session...</div>;
  }

  if (!isAuth) {
    // Defer to the outer IRequireAuth, which owns the sign-in redirect.
    return null;
  }

  // While the authorizations have not settled (loaded or failed) we must not judge:
  // keep showing the loading placeholder whether the store load is in flight
  // (`store.initializing`) or our own cold-start load is running/queued.
  if (!accessSettled && (store.initializing || accessLoading)) {
    return (loading as ReactNode) ?? <div className="ih-route-loading">Loading access...</div>;
  }

  const path = location.pathname.replace(/\/+$/, '') || '/';
  const resolvedMenuCode = (menuCode ?? resolveMenuCode?.(path, store))?.trim();
  if (!resolvedMenuCode) {
    console.warn(`[@insight/ui] No menu code mapping found for route "${path}".`);
    return missingMenuCode === 'allow' ? <>{children}</> : <Navigate to={unauthorizedPath} replace />;
  }

  if (!store.hasMenuCode(resolvedMenuCode)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return <>{children}</>;
}
