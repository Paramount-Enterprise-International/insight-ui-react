import { normalizeApiError } from '../api/api-error';
import { createApiClient } from '../api/api.client';
import { ICsrfService } from '../csrf/csrf';
import {
  extractProblemDetailsErrorCode,
  ISessionExpiredService,
  toSessionExpiredReason,
} from '../session-expired/session-expired';
import { ISessionService } from '../session/session';
import { IUserMenuStore } from '../store/user-menu';
import { ICurrentUserService, IUserMenuService } from '../user';
import { IAuthService } from './auth';
import {
  resolveIAuthConfig,
  validateIAuthConfig,
  type IAuthConfigOverrides,
} from './auth-config';
import { buildExternalSigninUrl } from './build-signin-redirect-url';
import type { IAuthContext } from './insight-auth-context';

export type IRuntime = IAuthContext & {
  readonly status: 'idle' | 'initializing' | 'ready' | 'disposed';
  readonly ready: boolean;
  initialize(): Promise<void>;
  dispose(): void;
};

/** Construct one application's auth stack without starting network activity. */
export function createIRuntime(overrides: IAuthConfigOverrides): IRuntime {
  const config = resolveIAuthConfig(overrides);
  validateIAuthConfig(config);
  const controller = new AbortController();
  const csrf = new ICsrfService(config, controller.signal);
  const auth = new IAuthService(config, csrf, controller.signal);
  const sessionExpired = new ISessionExpiredService();
  const session = new ISessionService(config, auth, csrf, sessionExpired);
  let status: IRuntime['status'] = 'idle';
  let initialization: Promise<void> | null = null;
  let handledExpiry = false;
  const assertActive = () => {
    if (status === 'disposed') throw new Error('Runtime is disposed.');
  };
  const initialize = (): Promise<void> => {
    assertActive();
    if (!initialization) {
      status = 'initializing';
      initialization = session.tryRestoreSession().then(() => {
        if (status !== 'disposed') status = 'ready';
      });
    }
    return initialization;
  };
  const api = createApiClient({
    config,
    csrf,
    session,
    initialize,
    assertActive,
    signal: controller.signal,
    onSessionExpired(error) {
      if (status === 'disposed' || session.isLoggedOut() || handledExpiry)
        return;
      handledExpiry = true;
      session.clearSession();
      if (config.onUnauthorized) {
        config.onUnauthorized(error);
        return;
      }
      const apiError = normalizeApiError(error);
      const errorCode = extractProblemDetailsErrorCode(apiError);
      const reason = toSessionExpiredReason(errorCode);
      const targetPath = window.location.pathname + window.location.search;
      if ((config.unauthorizedHandling ?? 'dialog') === 'dialog') {
        sessionExpired.show(
          targetPath,
          reason,
          errorCode,
          apiError.detail,
          apiError.message,
          apiError
        );
      } else {
        window.location.href = buildExternalSigninUrl(config, targetPath);
      }
    },
  });
  const currentUserService = new ICurrentUserService(config, api);
  const userMenuService = new IUserMenuService(config, api);
  const userMenuStore = new IUserMenuStore(
    currentUserService,
    userMenuService,
    session,
    config
  );
  session.setUserMenuStore(userMenuStore);
  const unsubscribe = session.subscribe(() => {
    if (session.getAccessToken()) {
      handledExpiry = false;
      sessionExpired.hide();
    } else if (session.isLoggedOut()) sessionExpired.hide();
  });
  return {
    config,
    csrf,
    auth,
    session,
    sessionExpired,
    api,
    userMenuStore,
    get status() {
      return status;
    },
    get ready() {
      return status === 'ready';
    },
    initialize,
    dispose() {
      if (status === 'disposed') return;
      status = 'disposed';
      controller.abort();
      unsubscribe();
      session.dispose();
      csrf.dispose();
      userMenuStore.dispose();
      sessionExpired.dispose();
    },
  };
}
