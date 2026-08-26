import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { buildExternalSigninUrl } from '../auth/build-signin-redirect-url';
import { useInsightAuth, useSession } from '../auth/insight-auth-context';

/**
 * Cross-domain auth guard for @insight/ui consumer apps — the React analog of
 * Angular's `authGuard`. Wrap protected routes:
 *
 * ```tsx
 * <Route path="settings" element={<RequireAuth><Settings /></RequireAuth>} />
 * ```
 *
 * Performs a FULL PAGE redirect to iam-web's signin page when unauthenticated,
 * since the consumer app and iam-web are separate applications/domains. The
 * redirect is routed through this app's OWN callback route (not the page the
 * user was trying to visit) — see `buildExternalSigninUrl()` for why that's
 * required to avoid a redirect loop.
 *
 * While the session is `initializing` (cold-start restore), a loading
 * placeholder is rendered instead of a redirect — this prevents a flash /
 * redirect loop during the restore.
 */
export function RequireAuth({
  children,
  loading,
}: {
  children: ReactNode;
  /** Custom loading placeholder while the session is restoring. */
  loading?: ReactNode;
}) {
  const session = useSession();
  const { config } = useInsightAuth();
  const location = useLocation();

  const isInitializing = session.initializing;
  const isAuth = session.isAuth();

  useEffect(() => {
    if (isInitializing) return;
    if (isAuth) return;

    const targetPath = location.pathname + location.search;
    window.location.href = buildExternalSigninUrl(config, targetPath);
  }, [isInitializing, isAuth, config, location.pathname, location.search]);

  if (isInitializing) {
    return (loading as ReactNode) ?? <div className="ih-route-loading">Loading session...</div>;
  }

  if (!isAuth) {
    // Redirect is in-flight (full page navigation) — render nothing.
    return null;
  }

  return <>{children}</>;
}
