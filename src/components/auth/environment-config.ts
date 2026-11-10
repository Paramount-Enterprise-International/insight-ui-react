import type { IAuthConfigOverrides } from './auth-config';
import type { IEnvironment } from './environment';
/** Map public environment fields to auth overrides without replacing defaults with undefined. */
export function getIEnvironmentAuthConfig(
  environment: IEnvironment
): IAuthConfigOverrides {
  return {
    api: environment.platformApi,
    signinUrl: environment.signinUrl,
    apiKey: environment.apiKey,
    appId: environment.appId,
    ...(environment.allowedReturnOrigins === undefined
      ? {}
      : { allowedReturnOrigins: environment.allowedReturnOrigins }),
    ...(environment.tokenLifespan === undefined
      ? {}
      : {
          tokenLifespan: {
            ...(environment.tokenLifespan.accessTokenSeconds === undefined
              ? {}
              : {
                  accessTokenSeconds:
                    environment.tokenLifespan.accessTokenSeconds,
                }),
            ...(environment.tokenLifespan.refreshTokenSeconds === undefined
              ? {}
              : {
                  refreshTokenSeconds:
                    environment.tokenLifespan.refreshTokenSeconds,
                }),
            ...(environment.tokenLifespan.ssoSessionMaxSeconds === undefined
              ? {}
              : {
                  ssoSessionMaxSeconds:
                    environment.tokenLifespan.ssoSessionMaxSeconds,
                }),
          },
        }),
    ...(environment.csrfTokenMaxAgeSeconds === undefined
      ? {}
      : { csrfTokenMaxAgeSeconds: environment.csrfTokenMaxAgeSeconds }),
  };
}

/** Require an explicit named API endpoint; never fall back to a platform endpoint. */
export function requireIEnvironmentApi(
  environment: IEnvironment,
  service: string
): string {
  const value = environment.api?.[service];
  if (typeof value !== 'string' || !value.trim())
    throw new Error('Missing application environment endpoint: api.' + service);
  return value;
}

/** Require the primary API URL; never use a platform endpoint as a fallback. */
export function requireIEnvironmentApiUrl(environment: IEnvironment): string {
  const value = environment.apiUrl;
  if (typeof value !== 'string' || !value.trim())
    throw new Error('Missing application environment endpoint: apiUrl');
  return value;
}
