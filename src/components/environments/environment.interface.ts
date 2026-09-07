/**
 * Shape of `@insight/ui`'s default environment.
 *
 * The library's services read a subset of these fields. `api` is an open-ended
 * registry of backend base URLs so consumer apps can register additional
 * service endpoints. Mirrors `insight-ui-angular`'s `IEnvironment`.
 */
export type IEnvironment = {
  production: boolean;
  releaseStage: string;
  appName: string;
  version: string;
  /** API base URLs grouped by backend service. `identity` is intentionally empty in the default env - the consumer app supplies its own BFF/identity host. */
  api: {
    identity: string;
    user: string;
    configuration: string;
    application: string;
    [key: string]: string;
  };
  /** Full URL of this app's sign-in page. Left empty by default - set by the consumer app. */
  signinUrl: string;
  /** Full URL of this app's own auth callback (informational, unused by the library). */
  authCallbackUrl: string;
  securityMode: boolean;
  tokenLifespan: {
    accessTokenSeconds: number;
    refreshTokenSeconds: number;
    ssoSessionMaxSeconds: number;
  };
  cookieSecure: boolean;
  /** CSRF token max age in seconds (backend cookie maxAge minus a safety buffer). */
  csrfTokenMaxAgeSeconds: number;
  /** MFA challenge session timeout (seconds). */
  mfaChallengeSessionTimeoutSeconds?: number;
  /** Origins this app's sign-in page trusts for post-login redirects (informational). */
  allowedReturnOrigins: string[];
  /** This app's registered application API key (attached as `Api-Key` header). */
  apiKey?: string;
  /** This app's application id (used as the default filter when loading effective menus). */
  appId?: string;
};
