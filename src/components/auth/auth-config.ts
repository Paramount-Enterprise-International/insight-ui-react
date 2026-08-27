import { environment as defaultEnvironment } from '../environments/environment';

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
 * Configuration required by @insight/ui's shared SSO stack
 * (`InsightAuthProvider`, session/api/csrf services, `RequireAuth`,
 * `AuthCallback`). Mirrors the Angular `IInsightAuthConfig`.
 */
export type IInsightAuthConfig = {
  /** API base URLs grouped by backend service. `identity` (iam-identity-api) is required — all auth calls (csrf, refresh) go through it. */
  api: {
    identity: string;
    [key: string]: string;
  };
  /** Full URL of iam-web's signin page — consumer apps redirect here when unauthenticated. */
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
  /**
   * Cookie domain used by iam-identity-api for the HttpOnly refresh token
   * cookie. Informational only — the frontend never reads or sets this cookie.
   */
  cookieDomain: string;
  tokenLifespan: IInsightTokenLifespan;
  /** CSRF token max age in seconds (backend cookie maxAge minus a safety buffer). */
  csrfTokenMaxAgeSeconds: number;
};

/**
 * Overrides accepted by `resolveInsightAuthConfig()`. Every field is optional
 * and merged on top of `getDefaultInsightAuthConfig()` — including individual
 * `api.*` and `tokenLifespan.*` entries, so a consumer app can override just
 * `api.identity` (e.g. for staging/production) without restating the rest.
 */
export type IInsightAuthConfigOverrides = Partial<
  Omit<IInsightAuthConfig, 'api' | 'tokenLifespan'>
> & {
  api?: Partial<IInsightAuthConfig['api']>;
  tokenLifespan?: Partial<IInsightTokenLifespan>;
};

/**
 * Default `IInsightAuthConfig`, sourced from the library's default environment.
 * Consumer apps override any field via `resolveInsightAuthConfig({ ... })`.
 *
 * `allowedReturnOrigins` defaults to this app's own origin and `cookieDomain`
 * defaults to the current hostname — both computed at call time since they
 * depend on `window.location`.
 */
export function getDefaultInsightAuthConfig(): IInsightAuthConfig {
  return {
    api: {
      identity: defaultEnvironment.api.identity,
      user: defaultEnvironment.api.user,
      configuration: defaultEnvironment.api.configuration,
      application: defaultEnvironment.api.application,
    },
    signinUrl: defaultEnvironment.signinUrl,
    callbackPath: '/auth/callback',
    allowedReturnOrigins: [window.location.origin],
    cookieDomain: window.location.hostname,
    tokenLifespan: { ...defaultEnvironment.tokenLifespan },
    csrfTokenMaxAgeSeconds: defaultEnvironment.csrfTokenMaxAgeSeconds,
  };
}

/**
 * Merge overrides on top of defaults (deep for `api` + `tokenLifespan`) — the
 * React analog of Angular's `provideInsightAuth(config)` config resolution.
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
  };
}
