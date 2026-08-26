import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  type IInsightAuthConfigOverrides,
  resolveInsightAuthConfig,
} from './auth-config';
import { AuthService } from './auth.service';
import { InsightAuthContext, type IInsightAuthContext } from './insight-auth-context';
import { CsrfService } from '../csrf/csrf.service';
import { createApiClient } from '../api/api.client';
import { SessionService } from '../session/session.service';
import { SessionExpiredService } from '../session-expired/session-expired.service';
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
 * Usage (zero-config — local dev):
 * ```tsx
 * <InsightAuthProvider>
 *   <App />
 * </InsightAuthProvider>
 * ```
 *
 * Usage (override for staging/production):
 * ```tsx
 * <InsightAuthProvider
 *   config={{ api: { identity: 'https://account.paramountenterprise.co.id/api' }, signinUrl: 'https://account.paramountenterprise.co.id/signin' }}
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
      onSessionExpired: () => {
        // Session-expired overlay state is handled by SessionService during
        // tryRestoreSession; here we just ensure the api client surfaces the error.
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
