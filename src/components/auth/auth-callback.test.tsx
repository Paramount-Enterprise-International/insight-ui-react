import { render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ISessionExpiredService } from '../session-expired/session-expired';
import { IAuthCallback } from './auth-callback';
import { resolveIAuthConfig } from './auth-config';
import {
  IAuthContext,
  type IAuthContext as AuthContextValue,
} from './insight-auth-context';

const initialUrl = window.location.href;
afterEach(() => history.replaceState(null, '', initialUrl));

function setup(
  returnUrl: string,
  { token = 'handoff-token', active = false } = {}
) {
  const config = resolveIAuthConfig({
    api: { identity: 'https://identity.test/api' },
    signinUrl: '/signin',
    callbackPath: '/app/auth/callback',
  });
  const session = { setAccessToken: vi.fn(), isAuth: () => active };
  const sessionExpired = new ISessionExpiredService();
  const callbackUrl = `/app/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`;
  history.replaceState(null, '', callbackUrl + (token ? `#at=${token}` : ''));
  function Destination() {
    const location = useLocation();
    return (
      <output data-testid="destination">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
    );
  }
  render(
    <StrictMode>
      <IAuthContext.Provider
        value={
          { config, session, sessionExpired } as unknown as AuthContextValue
        }>
        <BrowserRouter basename="/app">
          <Routes>
            <Route path="auth/callback" element={<IAuthCallback />} />
            <Route path="*" element={<Destination />} />
          </Routes>
        </BrowserRouter>
      </IAuthContext.Provider>
    </StrictMode>
  );
  return { session, sessionExpired, callbackUrl };
}

describe('IAuthCallback', () => {
  it.each([
    '/app/reports/42?tab=roles#details',
    '/reports/42?tab=roles#details',
  ])(
    'restores %s with one basename and consumes the handoff once',
    async (target) => {
      const { session } = setup(target);
      expect(await screen.findByTestId('destination')).toHaveTextContent(
        '/reports/42?tab=roles#details'
      );
      expect(
        window.location.pathname + window.location.search + window.location.hash
      ).toBe('/app/reports/42?tab=roles#details');
      expect(session.setAccessToken).toHaveBeenCalledExactlyOnceWith(
        'handoff-token'
      );
    }
  );

  it('normalizes trusted same-origin absolute destinations into router navigation', async () => {
    setup(`${window.location.origin}/app/reports/42?tab=roles#details`);
    expect(await screen.findByTestId('destination')).toHaveTextContent(
      '/reports/42?tab=roles#details'
    );
    expect(window.location.pathname).toBe('/app/reports/42');
  });

  it.each([
    '/app/auth/callback',
    '/auth/callback?returnUrl=loop',
    '/app/auth/callback#details',
  ])('does not return to callback %s', async (target) => {
    setup(target);
    expect(await screen.findByTestId('destination')).toHaveTextContent('/');
    expect(window.location.pathname).toBe('/app');
  });

  it('keeps a missing-session callback at its URL and preserves the intended destination for manual relogin', async () => {
    const { session, sessionExpired, callbackUrl } = setup(
      '/app/reports/42?tab=roles#details',
      { token: '' }
    );
    await waitFor(() => expect(sessionExpired.visible).toBe(true));
    expect(sessionExpired.returnUrl).toBe('/app/reports/42?tab=roles#details');
    expect(session.setAccessToken).not.toHaveBeenCalled();
    expect(window.location.pathname + window.location.search).toBe(callbackUrl);
    expect(screen.queryByTestId('destination')).toBeNull();
  });

  it('continues an already restored cookie session without requiring a token handoff', async () => {
    const { session, sessionExpired } = setup(
      '/app/reports/42?tab=roles#details',
      { token: '', active: true }
    );
    expect(await screen.findByTestId('destination')).toHaveTextContent(
      '/reports/42?tab=roles#details'
    );
    expect(session.setAccessToken).not.toHaveBeenCalled();
    expect(sessionExpired.visible).toBe(false);
  });

  it('rejects an untrusted absolute destination', async () => {
    setup('https://evil.test/app/reports');
    expect(await screen.findByTestId('destination')).toHaveTextContent('/');
    expect(window.location.pathname).toBe('/app');
  });
});
