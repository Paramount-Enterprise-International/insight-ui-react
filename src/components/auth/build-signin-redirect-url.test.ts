import { describe, expect, it } from 'vitest';

import { buildExternalSigninUrl } from './build-signin-redirect-url';
import type { IInsightAuthConfig } from './auth-config';

const CONFIG: IInsightAuthConfig = {
  api: { identity: 'https://identity/api' },
  signinUrl: 'https://account-dev.paramountenterprise.co.id/signin',
  callbackPath: '/auth/callback',
  allowedReturnOrigins: ['https://app.paramountenterprise.co.id'],
  cookieDomain: '.paramountenterprise.co.id',
  tokenLifespan: { accessTokenSeconds: 3600, refreshTokenSeconds: 7200, ssoSessionMaxSeconds: 54000 },
  csrfTokenMaxAgeSeconds: 7170,
};

describe('buildExternalSigninUrl', () => {
  it('routes the handoff through the app callback route (never the target page)', () => {
    const url = buildExternalSigninUrl(CONFIG, '/-/atlas-react/some-page');

    expect(url.startsWith(`${CONFIG.signinUrl}?returnUrl=`)).toBe(true);

    const returnUrl = decodeURIComponent(url.split('returnUrl=')[1]);
    expect(returnUrl).toBe(
      `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent('/-/atlas-react/some-page')}`,
    );
  });

  it('uses the default callback path when not configured', () => {
    const url = buildExternalSigninUrl({ ...CONFIG, callbackPath: undefined }, '/x');
    const returnUrl = decodeURIComponent(url.split('returnUrl=')[1]);
    expect(returnUrl).toBe(`${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent('/x')}`);
  });
});
