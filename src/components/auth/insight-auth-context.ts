import { createContext, useContext, useSyncExternalStore } from 'react';
import type { IApiClient } from '../api/api.client';
import type { ICsrfService } from '../csrf/csrf';
import type { IImpersonationStateService } from '../impersonation/impersonation-state';
import type { ISessionExpiredService } from '../session-expired/session-expired';
import type { ISessionService } from '../session/session';
import type { IUserMenuStore } from '../store/user-menu';
import type { IAuthService } from './auth';
import type { IAuthConfig } from './auth-config';

/**
 * Everything the shared SSO stack exposes to consumer apps. Provided by
 * `IAuthProvider`.
 */
export type IAuthContext = {
  config: IAuthConfig;
  session: ISessionService;
  auth: IAuthService;
  csrf: ICsrfService;
  api: IApiClient;
  sessionExpired: ISessionExpiredService;
  userMenuStore: IUserMenuStore;
  impersonation?: IImpersonationStateService;
};

export const IAuthContext = createContext<IAuthContext | null>(null);

export function useIAuthContext(): IAuthContext {
  const ctx = useContext(IAuthContext);
  if (!ctx) {
    throw new Error(
      'useIAuthContext() must be used under <IAuthProvider> — wrap your app root with it (and provide an auth config).'
    );
  }
  return ctx;
}

/** Session service + re-render on session state change. */
export function useISession(): ISessionService {
  const ctx = useIAuthContext();
  useSyncExternalStore(ctx.session.subscribe, ctx.session.getVersion);
  return ctx.session;
}

/** Consumer HTTP client (Authorization + CSRF + refresh-retry). */
export function useIApi(): IApiClient {
  return useIAuthContext().api;
}

export function useIAuth(): IAuthService {
  return useIAuthContext().auth;
}

export function useICsrf(): ICsrfService {
  return useIAuthContext().csrf;
}

/** Session-expired overlay state + re-render on change. */
export function useISessionExpired(): ISessionExpiredService {
  const ctx = useIAuthContext();
  useSyncExternalStore(
    ctx.sessionExpired.subscribe,
    ctx.sessionExpired.getVersion
  );
  return ctx.sessionExpired;
}

/** User-menu store (user/menus/favorites) + re-render on change. */
export function useIUserMenuStore(): IUserMenuStore {
  const ctx = useIAuthContext();
  useSyncExternalStore(
    ctx.userMenuStore.subscribe,
    ctx.userMenuStore.getVersion
  );
  return ctx.userMenuStore;
}

export function useIImpersonation(): IImpersonationStateService {
  const { impersonation } = useIAuthContext();
  if (!impersonation)
    throw new Error(
      'Impersonation UI requires a runtime created by createIRuntime().'
    );
  useSyncExternalStore(impersonation.subscribe, impersonation.getVersion);
  return impersonation;
}
