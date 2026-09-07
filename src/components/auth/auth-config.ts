import { environment as defaultEnvironment } from '../environments/environment';
import type { ApiErrorCatalogResolver } from '../api/api-error';

/**
 * Token lifespan configuration (seconds). Mirrors the platform-wide AC used by
 * iam-web: Access Token 1h, Refresh Token 2h, Max SSO Session 15h. Consumer
 * apps should reuse the exact same values as iam-web for consistency, not
 * invent their own policy.
 */
export type IInsightTokenLifespan = {
  accessTokenSeconds: number;
  refreshTokenSeconds: number;
  ssoSessionMaxSeconds: number;
};

/**
 * Relative endpoint paths served by the configured identity host (`api.identity`).
 *
 * The library never assumes a specific identity provider's route layout. These
 * default to the platform contract (`/auth/csrf`, `/auth/login`, ...) shared by
 * iam-identity-api and the reference BFF (atlas-api); a consumer app can point
 * them at whatever routes its own backend exposes. Paths are relative to
 * `api.identity` - the host (including any mount prefix) comes from there.
 *
 * Only the auth-facade endpoints are configurable. MFA/password routes are used
 * by identity-owner apps only (e.g. iam-web) and stay fixed.
 */
export type IInsightAuthEndpoints = {
  /** CSRF bootstrap: `GET {identity}{csrf}` returns `{ csrfToken }` and sets the CSRF cookie. */
  csrf?: string;
  /** Mode-2 username/password login: `POST {identity}{login}` (identity-owner apps only). */
  login?: string;
  /** Silent session refresh via the HttpOnly session cookie: `POST {identity}{refresh}`. */
  refresh?: string;
  /** Server-side session clear (CSRF-protected): `POST {identity}{logout}`. */
  logout?: string;
  /** Cross-app handoff: `POST {identity}{exchange}` carrying the `at=` token in `Authorization`. */
  exchange?: string;
};

/** Default relative endpoint paths for the configured identity host. */
export function getDefaultInsightAuthEndpoints(): IInsightAuthEndpoints {
  return {
    csrf: '/auth/csrf',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    exchange: '/auth/exchange',
  };
}

/**
 * Configuration required by @insight/ui's shared SSO stack
 * (`InsightAuthProvider`, session/api/csrf services, `RequireAuth`,
 * `AuthCallback`). Mirrors the Angular `IInsightAuthConfig`.
 */
export type IInsightAuthConfig = {
  /**
   * API base URLs grouped by backend service. `identity` is REQUIRED and must
   * point at this app's OWN auth backend (typically a same-origin BFF that
   * proxies iam-identity and owns the session cookie, e.g. an atlas-api
   * instance) - never at the shared identity provider. All session calls
   * (csrf, refresh, logout) go through it. No default is baked in.
   */
  api: {
    identity: string;
    [key: string]: string;
  };
  /**
   * REQUIRED. Full URL of this app's sign-in page - the app redirects here
   * when unauthenticated. For BFF-mode apps this is the app's own login route
   * (e.g. `{identity}/auth/login`); for identity-owner apps (iam-web) it is
   * their signin page. No default is baked in.
   */
  signinUrl: string;
  /**
   * This app's own SSO callback route, e.g. `/auth/callback` (default).
   * `RequireAuth`/the api client always redirect through this route (never
   * through the page the user was originally trying to visit) so the
   * `#at=<token>` handoff has a dedicated place to be consumed and stripped
   * before the user is sent on to their original destination.
   */
  callbackPath?: string;
  /**
   * Trusted origins for post-callback/return redirects. Absolute URLs matching
   * any origin here are allowed; all others fall back to '/'. Wildcards are
   * supported (e.g. `https://*.paramountenterprise.co.id`). Relative paths
   * (starting with `/`) are always allowed regardless of this list.
   */
  allowedReturnOrigins: string[];
  tokenLifespan: IInsightTokenLifespan;
  /** CSRF token max age in seconds (backend cookie maxAge minus a safety buffer). */
  csrfTokenMaxAgeSeconds: number;
  /**
   * Optional relative endpoint paths served by the configured identity host
   * (`api.identity`). Defaults match the platform / reference-BFF contract -
   * override when this app's backend exposes different routes.
   */
  endpoints?: IInsightAuthEndpoints;
  /**
   * This app's registered application API key (iam-user-api `application.api_key`).
   * Attached as an `Api-Key` header on every request. Empty/undefined disables it.
   */
  apiKey?: string;
  /**
   * This app's application id (iam-user-api `application.id`). Used as the
   * default `applicationId` when loading the effective menus, so each app only
   * sees its own application's navigation. Empty/undefined keeps the legacy
   * all-applications behaviour.
   */
  appId?: string;
  /**
   * How the api client handles a failed session refresh:
   * - `'dialog'`: show the library session-expired dialog (default).
   * - `'redirect'`: legacy behaviour — full-page redirect to the signin page.
   * When `onUnauthorized` is provided it takes precedence and disables both.
   */
  unauthorizedHandling?: 'dialog' | 'redirect';
  /**
   * Optional consumer-owned handler invoked when a session refresh fails.
   * Overrides `unauthorizedHandling` — neither the dialog nor the redirect
   * runs when this is provided.
   */
  onUnauthorized?: (error: unknown) => void;
  /** Optional synchronous catalog lookup used only when the backend message is absent. */
  errorCatalogResolver?: ApiErrorCatalogResolver;
};

/**
 * Overrides accepted by `resolveInsightAuthConfig()`. Every field is optional
 * and merged on top of `getDefaultInsightAuthConfig()` — including individual
 * `api.*`, `tokenLifespan.*` and `endpoints.*` entries, so a consumer app can
 * override just `api.identity` (e.g. for staging/production) without restating
 * the rest of the config.
 */
export type IInsightAuthConfigOverrides = Partial<
  Omit<IInsightAuthConfig, 'api' | 'tokenLifespan'>
> & {
  api?: Partial<IInsightAuthConfig['api']>;
  tokenLifespan?: Partial<IInsightTokenLifespan>;
};

/**
 * Default `IInsightAuthConfig`. `api.identity` and `signinUrl` are left EMPTY
 * (no shared identity host is baked in) - a consumer app MUST supply its own
 * values via `resolveInsightAuthConfig({ ... })` and is validated fail-fast
 * when it forgets. All other fields default sensibly: `allowedReturnOrigins`
 * to this app's own origin, `endpoints` to the platform/BFF path contract, and
 * lifespan / csrf / api-key values from the library's default environment.
 */
export function getDefaultInsightAuthConfig(): IInsightAuthConfig {
  return {
    api: {
      identity: '', // no default identity host - the consumer app supplies its own
      user: defaultEnvironment.api.user,
      configuration: defaultEnvironment.api.configuration,
      application: defaultEnvironment.api.application,
    },
    signinUrl: '', // no default sign-in page - the consumer app supplies its own
    callbackPath: '/auth/callback',
    allowedReturnOrigins: [window.location.origin],
    tokenLifespan: { ...defaultEnvironment.tokenLifespan },
    csrfTokenMaxAgeSeconds: defaultEnvironment.csrfTokenMaxAgeSeconds,
    endpoints: { ...getDefaultInsightAuthEndpoints() },
    apiKey: defaultEnvironment.apiKey,
    appId: defaultEnvironment.appId,
    unauthorizedHandling: 'dialog',
  };
}

/**
 * Merge overrides on top of defaults (deep for `api`, `tokenLifespan` and
 * `endpoints`) - the React analog of Angular's `provideInsightAuth(config)`
 * config resolution.
 */
export function resolveInsightAuthConfig(
  overrides?: IInsightAuthConfigOverrides,
): IInsightAuthConfig {
  const defaults = getDefaultInsightAuthConfig();
  return {
    ...defaults,
    ...overrides,
    api: { ...defaults.api, ...overrides?.api } as IInsightAuthConfig['api'],
    tokenLifespan: { ...defaults.tokenLifespan, ...overrides?.tokenLifespan },
    endpoints: { ...defaults.endpoints, ...overrides?.endpoints },
  };
}

/**
 * The configured identity host (`api.identity`) or a descriptive error. Used by
 * auth services before building a request URL so a missing per-app host fails
 * loudly instead of producing a relative/undefined URL.
 */
export function requireIdentityHost(config: IInsightAuthConfig): string {
  if (!config.api.identity) {
    throw new Error(
      '[@insight/ui-react] api.identity is not configured. Point it at this app\'s own auth host/BFF ' +
        '(e.g. <InsightAuthProvider config={{ api: { identity: "https://<your-app>/api" }, signinUrl: "..." }} />).',
    );
  }
  return config.api.identity;
}

/**
 * Relative path of an identity endpoint for the current config. Falls back to
 * `getDefaultInsightAuthEndpoints()` when the consumer did not override it.
 */
export function getAuthEndpointPath(
  config: IInsightAuthConfig,
  key: keyof IInsightAuthEndpoints,
): string {
  return config.endpoints?.[key] ?? getDefaultInsightAuthEndpoints()[key] ?? '';
}

/**
 * Absolute URL of an identity endpoint: `{api.identity}{path}`. Throws a
 * descriptive error when the identity host is not configured.
 */
export function getAuthEndpointUrl(
  config: IInsightAuthConfig,
  key: keyof IInsightAuthEndpoints,
): string {
  return `${requireIdentityHost(config)}${getAuthEndpointPath(config, key)}`;
}

/**
 * Validate a resolved auth config at bootstrap. Throws a descriptive error when
 * the mandatory per-app values (`api.identity`, `signinUrl`) are missing so a
 * misconfigured consumer fails fast instead of silently calling an undefined
 * host.
 */
export function validateInsightAuthConfig(config: IInsightAuthConfig): void {
  if (!config.api.identity) {
    throw new Error(
      '[@insight/ui-react] InsightAuthProvider requires api.identity - the base URL of this app\'s own ' +
        'auth host/BFF. The library no longer defaults to a shared identity provider.',
    );
  }
  if (!config.signinUrl) {
    throw new Error(
      '[@insight/ui-react] InsightAuthProvider requires signinUrl - the full URL of this app\'s ' +
        'sign-in page / BFF login route.',
    );
  }
}
