import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveIAuthConfig } from '../auth/auth-config';
import { buildExternalSigninUrl } from '../auth/build-signin-redirect-url';
import {
  IAuthContext,
  type IAuthContext as AuthContextValue,
} from '../auth/insight-auth-context';
import { ISessionExpiredService } from '../session-expired/session-expired';
import { IRequireAuth } from './require-auth';

vi.mock('../auth/build-signin-redirect-url', () => ({
  buildExternalSigninUrl: vi.fn(() => '#signin'),
}));
const initialUrl = window.location.href;
afterEach(() => {
  history.replaceState(null, '', initialUrl);
  vi.clearAllMocks();
});

function setup({
  active = false,
  initializing = false,
  overlayVisible = false,
  hash = '#details',
  loading,
}: {
  active?: boolean;
  initializing?: boolean;
  overlayVisible?: boolean;
  hash?: string;
  loading?: ReactNode;
} = {}) {
  const expired = new ISessionExpiredService();
  if (overlayVisible)
    expired.show('/app/reports/42?tab=roles#details', 'SESSION_REVOKED');
  const session = {
    subscribe: () => () => undefined,
    getVersion: () => 0,
    initializing,
    isAuth: () => active,
  };
  const config = resolveIAuthConfig({
    api: { identity: 'https://identity.test/api' },
    signinUrl: '/signin',
  });
  history.replaceState(null, '', '/app/reports/42?tab=roles' + hash);
  const mount = vi.fn();
  function Page() {
    mount();
    return <div>protected-content</div>;
  }
  render(
    <IAuthContext.Provider
      value={
        {
          config,
          session,
          sessionExpired: expired,
        } as unknown as AuthContextValue
      }>
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/reports/42?tab=roles' + hash]}>
        <IRequireAuth loading={loading}>
          <Page />
        </IRequireAuth>
      </MemoryRouter>
    </IAuthContext.Provider>
  );
  return { mount, config };
}

describe('IRequireAuth return URL and recovery', () => {
  it('preserves the browser basename, query and fragment for a first visit without a session', () => {
    const { config, mount } = setup();
    expect(buildExternalSigninUrl).toHaveBeenCalledExactlyOnceWith(
      config,
      '/app/reports/42?tab=roles#details'
    );
    expect(mount).not.toHaveBeenCalled();
  });

  it('removes token handoff fields from the sign-in return URL', () => {
    const { config } = setup({ hash: '#intro&at=handoff-token' });
    expect(buildExternalSigninUrl).toHaveBeenCalledWith(
      config,
      '/app/reports/42?tab=roles#intro'
    );
  });

  it('keeps an expired session at its complete URL without mounting protected content', () => {
    const { mount } = setup({ overlayVisible: true });
    expect(buildExternalSigninUrl).not.toHaveBeenCalled();
    expect(mount).not.toHaveBeenCalled();
    expect(
      window.location.pathname + window.location.search + window.location.hash
    ).toBe('/app/reports/42?tab=roles#details');
  });

  it('waits for restoration without redirecting', () => {
    setup({ initializing: true });
    expect(screen.getByText('Loading session...')).toBeTruthy();
    expect(screen.getByRole('status')).toHaveAttribute('mode', 'container');
    expect(buildExternalSigninUrl).not.toHaveBeenCalled();
  });

  it('preserves the custom restoration fallback', () => {
    setup({ initializing: true, loading: <p>Custom session progress</p> });
    expect(screen.getByText('Custom session progress')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('renders an authenticated destination without redirecting', () => {
    setup({ active: true });
    expect(screen.getByText('protected-content')).toBeTruthy();
    expect(buildExternalSigninUrl).not.toHaveBeenCalled();
  });
});
