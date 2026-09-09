import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import {
  useISession,
  useISessionExpired,
  useIUserMenuStore,
} from '../auth/insight-auth-context';
import type { IUserMenuStore } from '../store/user-menu.store';
import { UNAUTHORIZED_ACCESS_PATH } from './require-access';

/** Decides whether the current path may be opened for the given store state. */
export type IRouteCanOpen = (path: string, store: IUserMenuStore) => boolean;

export type IRequireRouteAccessProps = {
  /**
   * Override the open-decision. Default: the path is one of the user's granted
   * leaf menu routes (`store.hasRoute`). Apps whose menus carry host-formatted
   * routes (remotes mounted under a host prefix) supply a matcher that maps
   * the local path into the menu-route space.
   */
  canOpen?: IRouteCanOpen;
  /** Where to redirect users without access to the current route. */
  unauthorizedPath?: string;
  /** Custom loading placeholder while the session/menus are still loading. */
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
 * is never denied just because the menus have not been fetched yet.
 */
export function IRequireRouteAccess({
  canOpen,
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
  const menusSettled = store.menus.length > 0 || store.loadErrors.menus !== null;
  const canOpenPath: IRouteCanOpen = canOpen ?? ((path, currentStore) => currentStore.hasRoute(path));

  // Start in the loading state when mounting on a cold start — menus not yet
  // fetched and no store load in flight. The effect below triggers that load,
  // but the first render happens BEFORE the effect runs, so without this the
  // guard would flash a redirect to the unauthorized page before the menus
  // arrive (a cold-start deep link must never be denied early).
  const [menusLoading, setMenusLoading] = useState(
    () => !store.initializing && !menusSettled,
  );

  // Route membership needs menus loaded. When they have not been fetched yet
  // (cold-start deep link before the shell's boot load), trigger the load once.
  useEffect(() => {
    if (!isAuth || isInitializing) {
      return;
    }
    if (store.initializing) {
      return; // a load is already in flight (e.g. the shell's boot load)
    }
    if (menusSettled) {
      return;
    }
    setMenusLoading(true);
    void store.load().finally(() => setMenusLoading(false));
  }, [isAuth, isInitializing, store, menusSettled]);

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

  // While the menus have not settled (loaded or failed) we must not judge:
  // keep showing the loading placeholder whether the store load is in flight
  // (`store.initializing`) or our own cold-start load is running/queued.
  if (!menusSettled && (store.initializing || menusLoading)) {
    return (loading as ReactNode) ?? <div className="ih-route-loading">Loading access...</div>;
  }

  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (!canOpenPath(path, store)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return <>{children}</>;
}
