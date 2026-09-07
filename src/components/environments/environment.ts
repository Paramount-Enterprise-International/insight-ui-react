import type { IEnvironment } from './environment.interface';

/**
 * Default environment for `@insight/ui`'s shared data layer.
 *
 * `api.identity`, `signinUrl` and `authCallbackUrl` are intentionally EMPTY -
 * the library does not default to any shared identity provider. Each consumer
 * app supplies its own values (its own BFF/identity host) via
 * `InsightAuthProvider` / `resolveInsightAuthConfig`. The
 * `user`/`configuration`/`application` keys keep defaulting to the platform
 * services and can still be overridden.
 */
export const environment: IEnvironment = {
  production: false,
  releaseStage: 'development',
  appName: 'Insight UI',
  version: '1.0.2',
  api: {
    identity: '',
    user: 'https://account-dev.paramountenterprise.co.id/api/v1/users',
    configuration: 'https://account-dev.paramountenterprise.co.id/api/v1',
    application: 'https://account-dev.paramountenterprise.co.id/api/v1/applications',
  },
  signinUrl: '',
  authCallbackUrl: '',
  securityMode: true,
  tokenLifespan: {
    accessTokenSeconds: 3600,
    refreshTokenSeconds: 7200,
    ssoSessionMaxSeconds: 54000,
  },
  cookieSecure: true,
  csrfTokenMaxAgeSeconds: 7170,
  mfaChallengeSessionTimeoutSeconds: 300,
  allowedReturnOrigins: [
    'https://account-dev.paramountenterprise.co.id',
    'https://*.paramountenterprise.co.id',
  ],
};
