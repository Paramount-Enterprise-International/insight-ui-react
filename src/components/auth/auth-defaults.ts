/** Shared runtime defaults; consumer deployment configuration never comes from this module. */
export const I_AUTH_DEFAULTS = {
  api: {
    user: 'https://account-dev.paramountenterprise.co.id/api/v1/users',
    configuration: 'https://account-dev.paramountenterprise.co.id/api/v1',
    application:
      'https://account-dev.paramountenterprise.co.id/api/v1/applications',
  },
  tokenLifespan: {
    accessTokenSeconds: 3600,
    refreshTokenSeconds: 7200,
    ssoSessionMaxSeconds: 54000,
  },
  csrfTokenMaxAgeSeconds: 7170,
  apiKey: undefined as string | undefined,
  appId: undefined as string | undefined,
};
