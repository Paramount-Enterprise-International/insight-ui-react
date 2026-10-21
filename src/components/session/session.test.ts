import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IAuthService } from '../auth/auth';
import type { IAuthConfig } from '../auth/auth-config';
import type { ICsrfService } from '../csrf/csrf';
import { ISessionExpiredService } from '../session-expired/session-expired';
import type { IUserMenuStore } from '../store/user-menu';
import { decodeJwtPayload, decodeUser, ISessionService } from './session';

// Minimal valid JWT: header.payload.signature (payload = {"sub":"u1","email":"a@b.c","name":"A","realm_access":{"roles":["role-a"]},"user_type":"external","exp":9999999999})
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.' +
  'eyJzdWIiOiJ1MSIsImVtYWlsIjoiYUBiLmMiLCJuYW1lIjoiQSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJyb2xlLWEiXX0sInVzZXJfdHlwZSI6ImV4dGVybmFsIiwiZXhwIjo5OTk5OTk5OTk5fQ.' +
  'sig';

describe('decodeJwtPayload', () => {
  it('decodes a valid JWT payload', () => {
    const payload = decodeJwtPayload(TOKEN);
    expect(payload).not.toBeNull();
    expect(payload?.['sub']).toBe('u1');
    expect(payload?.['email']).toBe('a@b.c');
  });

  it('returns null for a token without a payload', () => {
    expect(decodeJwtPayload('abc')).toBeNull();
  });

  it('returns null for an invalid payload (non-JSON)', () => {
    const bad = 'a.' + btoa('not json{') + '.c';
    expect(decodeJwtPayload(bad)).toBeNull();
  });
});

describe('decodeUser', () => {
  it('maps roles from realm_access', () => {
    const user = decodeUser(TOKEN);
    expect(user.sub).toBe('u1');
    expect(user.roles).toEqual(['role-a']);
    expect(user.userType).toBe('external');
  });
});

describe('ISessionService.logout', () => {
  it('resets the attached user menu store', async () => {
    const csrf = {
      ensureToken: async (): Promise<void> => undefined,
    } as unknown as ICsrfService;
    const auth = {
      logout: async (): Promise<void> => undefined,
    } as unknown as IAuthService;
    const session = new ISessionService(
      {} as IAuthConfig,
      auth,
      csrf,
      {} as never
    );

    const store = { reset: vi.fn() } as unknown as IUserMenuStore;
    session.setUserMenuStore(store);

    await session.logout();
    expect(store.reset).toHaveBeenCalledTimes(1);
  });
});

describe('ISessionService refresh and restore', () => {
  const initialUrl = window.location.href;
  const config = {
    api: { identity: 'http://localhost:3001/api' },
    appId: 'iam-test',
    tokenLifespan: {
      accessTokenSeconds: 3600,
      refreshTokenSeconds: 7200,
      ssoSessionMaxSeconds: 54000,
    },
  } as IAuthConfig;

  afterEach(() => {
    history.replaceState(null, '', initialUrl);
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('shares one request between cold restore and another refresh caller', async () => {
    let resolveRefresh!: (value: {
      accessToken: string;
      expiresIn: number;
    }) => void;
    const refresh = vi.fn(
      () =>
        new Promise<{ accessToken: string; expiresIn: number }>((resolve) => {
          resolveRefresh = resolve;
        })
    );
    const session = new ISessionService(
      config,
      { refresh } as unknown as IAuthService,
      {} as ICsrfService,
      new ISessionExpiredService()
    );

    const restore = session.tryRestoreSession();
    const token = session.refreshToken();
    expect(refresh).toHaveBeenCalledTimes(1);

    resolveRefresh({ accessToken: TOKEN, expiresIn: 3600 });
    expect(await token).toBe(TOKEN);
    await restore;
    expect(session.getAccessToken()).toBe(TOKEN);
  });

  it('waits until the 30-second deadline and ignores a later response', async () => {
    vi.useFakeTimers();
    let resolveRefresh!: (value: {
      accessToken: string;
      expiresIn: number;
    }) => void;
    const refresh = vi.fn(
      () =>
        new Promise<{ accessToken: string; expiresIn: number }>((resolve) => {
          resolveRefresh = resolve;
        })
    );
    const session = new ISessionService(
      config,
      { refresh } as unknown as IAuthService,
      {} as ICsrfService,
      new ISessionExpiredService()
    );
    const restore = session.tryRestoreSession();

    await vi.advanceTimersByTimeAsync(10_000);
    expect(session.initializing).toBe(true);
    await vi.advanceTimersByTimeAsync(20_000);
    await restore;
    expect(session.initializing).toBe(false);
    expect(session.getAccessToken()).toBeNull();

    resolveRefresh({ accessToken: TOKEN, expiresIn: 3600 });
    await Promise.resolve();
    expect(session.getAccessToken()).toBeNull();
  });

  it('does not log out the server after a revoked restore', async () => {
    history.replaceState(null, '', '/app/reports/42?tab=roles#details');
    const logout = vi.fn(async () => undefined);
    const refresh = vi.fn(async () => {
      throw { status: 401, error: { errorCode: 'AUTH_SESSION_REVOKED' } };
    });
    const expired = new ISessionExpiredService();
    const session = new ISessionService(
      config,
      { refresh, logout } as unknown as IAuthService,
      {} as ICsrfService,
      expired
    );
    session.setSession(TOKEN, 3600, decodeUser(TOKEN));
    session.clearSession();

    const result = await session.tryRestoreSession();
    expect(result.reason).toBe('SESSION_REVOKED');
    expect(expired.visible).toBe(true);
    expect(expired.returnUrl).toBe('/app/reports/42?tab=roles#details');
    expect(
      window.location.pathname + window.location.search + window.location.hash
    ).toBe('/app/reports/42?tab=roles#details');
    expect(logout).not.toHaveBeenCalled();
  });

  it('resets sidebar data when a different user establishes a session', () => {
    const session = new ISessionService(
      config,
      {} as IAuthService,
      {} as ICsrfService,
      new ISessionExpiredService()
    );
    const store = { reset: vi.fn() } as unknown as IUserMenuStore;
    session.setUserMenuStore(store);
    const user = decodeUser(TOKEN);
    session.setSession(TOKEN, 3600, user);
    session.setSession(TOKEN, 3600, { ...user, sub: 'user-b' });

    expect(store.reset).toHaveBeenCalledTimes(1);
  });
});

describe('ISessionService.endImpersonation', () => {
  const initialUrl = window.location.href;
  afterEach(() => {
    history.replaceState(null, '', initialUrl);
    sessionStorage.clear();
  });
  function setup() {
    const auth = {
      endImpersonation: vi.fn(async (): Promise<unknown> => undefined),
    };
    const csrf = {
      getToken: () => 'csrf',
      ensureToken: vi.fn().mockResolvedValue(undefined),
    };
    const config = {
      api: { identity: 'https://bff.test/api' },
      tokenLifespan: { accessTokenSeconds: 3600 },
    } as IAuthConfig;
    const expired = new ISessionExpiredService();
    const session = new ISessionService(
      config,
      auth as unknown as IAuthService,
      csrf as unknown as ICsrfService,
      expired
    );
    session.setAccessToken(TOKEN);
    return { auth, csrf, session, expired };
  }
  it('clears state on success and preserves redirect data', async () => {
    const { session, auth } = setup();
    auth.endImpersonation.mockResolvedValue({ redirectTo: '/api/auth/login' });
    expect(await session.endImpersonation()).toEqual({
      redirectTo: '/api/auth/login',
    });
    expect(session.getAccessToken()).toBeNull();
  });
  it('retries CSRF only once and leaves failed sessions available for Retry', async () => {
    const { session, auth, csrf } = setup();
    auth.endImpersonation
      .mockRejectedValueOnce({ status: 403, message: 'CSRF validation failed' })
      .mockRejectedValueOnce({ status: 503 });
    await expect(session.endImpersonation()).rejects.toEqual({ status: 503 });
    expect(auth.endImpersonation).toHaveBeenCalledTimes(2);
    expect(csrf.ensureToken).toHaveBeenCalledTimes(1);
    expect(session.getAccessToken()).toBe(TOKEN);
  });
  it('deduplicates a pending POST and rejects stale success after session replacement', async () => {
    const { session, auth } = setup();
    let finish!: (value: unknown) => void;
    auth.endImpersonation.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const first = session.endImpersonation();
    expect(session.endImpersonation()).toBe(first);
    session.setAccessToken(
      'e30.' + btoa(JSON.stringify({ sub: 'new' })) + '.sig'
    );
    const nextToken = session.getAccessToken();
    finish(undefined);
    await expect(first).rejects.toBeDefined();
    expect(session.getAccessToken()).toBe(nextToken);
  });

  it('keeps a failed impersonation session at its URL with a complete, token-free return URL', async () => {
    history.replaceState(
      null,
      '',
      '/app/reports/42?tab=roles#details&at=handoff-token'
    );
    const { session, auth, expired } = setup();
    auth.endImpersonation.mockRejectedValue({
      status: 401,
      errorCode: 'IMPERSONATION_SESSION_INVALID',
    });
    await expect(session.endImpersonation()).rejects.toMatchObject({
      status: 401,
    });
    expect(expired.visible).toBe(true);
    expect(expired.returnUrl).toBe('/app/reports/42?tab=roles#details');
    expect(window.location.pathname).toBe('/app/reports/42');
  });
});
