import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  type IInsightAuthConfigOverrides,
  resolveInsightAuthConfig,
  validateInsightAuthConfig,
} from './auth-config';
import { AuthService } from './auth.service';
import { buildExternalSigninUrl } from './build-signin-redirect-url';
import { InsightAuthContext, type IInsightAuthContext } from './insight-auth-context';
import { CsrfService } from '../csrf/csrf.service';
import { createApiClient } from '../api/api.client';
import { normalizeApiError } from '../api/api-error';
import { SessionService } from '../session/session.service';
import {
  extractProblemDetailsErrorCode,
  SessionExpiredService,
  toSessionExpiredReason,
} from '../session-expired/session-expired.service';
import { CurrentUserService, UserMenuService } from '../user';
import { UserMenuStore } from '../store/user-menu.store';

/**
 * Root provider for `@insight/ui`'s shared SSO stack — the React analog of
 * Angular's `provideInsightAuth()`.
 *
 * Creates and wires: auth config, CSRF service, session service (runs
 * `tryRestoreSession()` once on mount — the APP_INITIALIZER equivalent),
 * consumer api client, session-expired overlay, and the user-menu store
 * (user/menus/favorites + permission checks).
 *
 * `api.identity` and `signinUrl` are MANDATORY and app-specific: they must point
 * at THIS app's own auth backend. In the BFF-per-app model the app's session
 * cookie stays first-party on its own origin (SameSite-safe), so the library no
 * longer ships a default pointing at any shared identity provider. A config
 * that omits them throws at bootstrap (fail-fast).
 *
 * Usage - point at your own auth host/BFF:
 * ```tsx
 * <InsightAuthProvider
 *   config={{
 *     // this app's own backend: a same-origin BFF (e.g. atlas-api) or identity-api
 *     api: { identity: 'https://<your-app>.example.com/api' },
 *     // this app's own login entry (BFF login route or the app's signin page)
 *     signinUrl: 'https://<your-app>.example.com/api/auth/login',
 *   }}
 * >
 *   <App />
 * </InsightAuthProvider>
 * ```
 */
export function InsightAuthProvider({
  config,
  children,
}: {
  config?: IInsightAuthConfigOverrides;
  children: ReactNode;
}) {
  const resolved = useMemo(() => resolveInsightAuthConfig(config), [config]);
  // Fail fast at render when the mandatory per-app identity host/signinUrl are
  // missing - the library no longer defaults to a shared identity provider.
  validateInsightAuthConfig(resolved);

  // Services are created ONCE per provider mount. Config changes after mount
  // are intentionally ignored (mirrors Angular's root-scoped providers).
  const [services] = useState(() => {
    const csrf = new CsrfService(resolved);
    const auth = new AuthService(resolved, csrf);
    const sessionExpired = new SessionExpiredService();
    const session = new SessionService(resolved, auth, csrf, sessionExpired);
    const api = createApiClient({
      config: resolved,
      csrf,
      session,
      onSessionExpired: (err) => {
        if (resolved.onUnauthorized) {
          // Consumer-provided handler takes full control of the unauthorized flow.
          resolved.onUnauthorized(err);
          return;
        }
        const errorCode = extractProblemDetailsErrorCode(err);
        const reason = toSessionExpiredReason(errorCode);
        const apiError = normalizeApiError(err);
        const showDialog = (resolved.unauthorizedHandling ?? 'dialog') === 'dialog';
        if (reason && showDialog) {
          // Session revoked/replaced/expired → show the session-expired
          // overlay (the consumer renders it); the user's "Login again" action
          // then redirects to signin. Matches the shared SSO UX.
          sessionExpired.show(
            window.location.pathname,
            reason,
            errorCode,
            apiError.detail,
            apiError.message,
            apiError,
          );
        } else {
          // Not a session-expiry error (or unauthorizedHandling='redirect') —
          // clear and go to signin directly.
          session.clearSession();
          const targetPath = window.location.pathname + window.location.search;
          window.location.href = buildExternalSigninUrl(resolved, targetPath);
        }
      },
    });
    const currentUserService = new CurrentUserService(resolved, api);
    const userMenuService = new UserMenuService(resolved, api);
    const userMenuStore = new UserMenuStore(currentUserService, userMenuService, session);

    const value: IInsightAuthContext = {
      config: resolved,
      session,
      auth,
      csrf,
      api,
      sessionExpired,
      userMenuStore,
    };
    return { value, session };
  });

  // Cold-start session restore (single-flight, runs once per app load).
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    void services.session.tryRestoreSession();
  }, [services.session]);

  return (
    <InsightAuthContext.Provider value={services.value}>
      {children}
    </InsightAuthContext.Provider>
  );
}
