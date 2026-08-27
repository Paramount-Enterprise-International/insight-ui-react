import { createContext, useContext, useSyncExternalStore } from 'react';
import type { IInsightAuthConfig } from './auth-config';
import type { AuthService } from './auth.service';
import type { CsrfService } from '../csrf/csrf.service';
import type { IApiClient } from '../api/api.client';
import type { SessionService } from '../session/session.service';
import type { SessionExpiredService } from '../session-expired/session-expired.service';
import type { UserMenuStore } from '../store/user-menu.store';

/**
 * Everything the shared SSO stack exposes to consumer apps. Provided by
 * `InsightAuthProvider`.
 */
export type IInsightAuthContext = {
  config: IInsightAuthConfig;
  session: SessionService;
  auth: AuthService;
  csrf: CsrfService;
  api: IApiClient;
  sessionExpired: SessionExpiredService;
  userMenuStore: UserMenuStore;
};

export const InsightAuthContext = createContext<IInsightAuthContext | null>(null);

export function useInsightAuth(): IInsightAuthContext {
  const ctx = useContext(InsightAuthContext);
  if (!ctx) {
    throw new Error(
      'useInsightAuth() must be used under <InsightAuthProvider> — wrap your app root with it (and provide an auth config).',
    );
  }
  return ctx;
}

/** Session service + re-render on session state change. */
export function useSession(): SessionService {
  const ctx = useInsightAuth();
  useSyncExternalStore(ctx.session.subscribe, ctx.session.getVersion);
  return ctx.session;
}

/** Consumer HTTP client (Authorization + CSRF + refresh-retry). */
export function useApi(): IApiClient {
  return useInsightAuth().api;
}

export function useAuth(): AuthService {
  return useInsightAuth().auth;
}

export function useCsrf(): CsrfService {
  return useInsightAuth().csrf;
}

/** Session-expired overlay state + re-render on change. */
export function useSessionExpired(): SessionExpiredService {
  const ctx = useInsightAuth();
  useSyncExternalStore(ctx.sessionExpired.subscribe, ctx.sessionExpired.getVersion);
  return ctx.sessionExpired;
}

/** User-menu store (user/menus/favorites) + re-render on change. */
export function useUserMenuStore(): UserMenuStore {
  const ctx = useInsightAuth();
  useSyncExternalStore(ctx.userMenuStore.subscribe, ctx.userMenuStore.getVersion);
  return ctx.userMenuStore;
}
