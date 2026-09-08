import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import {
  useISession,
  useISessionExpired,
  useIUserMenuStore,
} from '../auth/insight-auth-context';
import type { IPermissionSource } from '../permission/use-permission';

/** Route that renders the "account lacks the required access/role" (403) page. */
export const UNAUTHORIZED_ACCESS_PATH = '/unauthorized-access';

export type IRequireAccessProps = {
  /** Single code or list of codes (ANY match) the user must hold. */
  value: string | string[];
  /** Source of the access check. Defaults to `menu` (menu codes). */
  source?: IPermissionSource;
  /** Where to redirect users who lack access. */
  unauthorizedPath?: string;
  /** Custom loading placeholder while the session/menus are still loading. */
  loading?: ReactNode;
  children: ReactNode;
};

/**
 * React analog of the Angular `requireAccess` guard — wraps a route element and
 * denies navigation to users who lack a required menu/role/permission by
 * rendering `<Navigate>` to `unauthorizedPath`:
 *
 * ```tsx
 * <Route
 *   path="settings"
 *   element={
 *     <IRequireAuth>
 *       <IRequireAccess value="admin-iam">
 *         <Settings />
 *       </IRequireAccess>
 *     </IRequireAuth>
 *   }
 * />
 * ```
 *
 * Compose INSIDE `IRequireAuth` — this wrapper only handles the
 * authenticated-but-not-allowed branch. `source: 'menu'` is async-aware: it
 * waits for (or triggers) the user-menu store load before judging, so a
 * cold-start deep link is never denied just because the menus have not been
 * fetched yet.
 */
export function IRequireAccess({
  value,
  source = 'menu',
  unauthorizedPath = UNAUTHORIZED_ACCESS_PATH,
  loading,
  children,
}: IRequireAccessProps) {
  const session = useISession();
  const store = useIUserMenuStore();
  const sessionExpired = useISessionExpired();
  const [menusLoading, setMenusLoading] = useState(false);

  const isInitializing = session.initializing;
  const isAuth = session.isAuth();

  // Menu checks need menus loaded. When they have not been fetched yet
  // (cold-start deep link before the shell's boot load), trigger the load once.
  useEffect(() => {
    if (source !== 'menu' || !isAuth || isInitializing) {
      return;
    }
    if (store.initializing) {
      return; // a load is already in flight (e.g. the shell's boot load)
    }
    const menusSettled = store.menus.length > 0 || store.loadErrors.menus !== null;
    if (menusSettled) {
      return;
    }
    setMenusLoading(true);
    void store.load().finally(() => setMenusLoading(false));
  }, [source, isAuth, isInitializing, store]);

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

  if (source === 'menu' && (store.initializing || menusLoading)) {
    return (loading as ReactNode) ?? <div className="ih-route-loading">Loading access...</div>;
  }

  const allowed =
    source === 'role'
      ? session.hasRole(value)
      : source === 'permission'
        ? store.hasPermission(value)
        : store.hasMenu(value);

  if (!allowed) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return <>{children}</>;
}
