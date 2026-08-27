import type { IEnvironment } from './environment.interface';

/**
 * Default environment for `@insight/ui`'s shared data layer.
 *
 * These are the library-wide defaults for the SSO / sidebar / user data
 * layer. Consumer apps override any field at bootstrap via
 * `InsightAuthProvider` / `resolveInsightAuthConfig`.
 */
export const environment: IEnvironment = {
  production: false,
  releaseStage: 'development',
  appName: 'Insight UI',
  version: '1.0.2',
  api: {
    identity: 'https://account-dev.paramountenterprise.co.id/api',
    user: 'https://account-dev.paramountenterprise.co.id/api/v1/users',
    configuration: 'https://account-dev.paramountenterprise.co.id/api/v1',
    application: 'https://account-dev.paramountenterprise.co.id/api/v1/applications',
  },
  signinUrl: 'https://account-dev.paramountenterprise.co.id/signin',
  authCallbackUrl: 'https://account-dev.paramountenterprise.co.id/auth',
  cookieDomain: '.paramountenterprise.co.id',
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
