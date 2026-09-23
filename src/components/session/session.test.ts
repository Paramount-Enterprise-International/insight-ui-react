import { afterEach, describe, expect, it, vi } from 'vitest';

import { decodeJwtPayload, decodeUser, ISessionService } from './session';
import type { IAuthConfig } from '../auth/auth-config';
import type { IAuthService } from '../auth/auth';
import type { ICsrfService } from '../csrf/csrf';
import { ISessionExpiredService } from '../session-expired/session-expired';
import type { IUserMenuStore } from '../store/user-menu';

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
    const csrf = { ensureToken: async (): Promise<void> => undefined } as unknown as ICsrfService;
    const auth = { logout: async (): Promise<void> => undefined } as unknown as IAuthService;
    const session = new ISessionService({} as IAuthConfig, auth, csrf, {} as never);

    const store = { reset: vi.fn() } as unknown as IUserMenuStore;
    session.setUserMenuStore(store);

    await session.logout();
    expect(store.reset).toHaveBeenCalledTimes(1);
  });
});

describe('ISessionService refresh and restore', () => {
  const config = {
    api: { identity: 'http://localhost:3001/api' },
    appId: 'iam-test',
    tokenLifespan: { accessTokenSeconds: 3600, refreshTokenSeconds: 7200, ssoSessionMaxSeconds: 54000 },
  } as IAuthConfig;

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('shares one request between cold restore and another refresh caller', async () => {
    let resolveRefresh!: (value: { accessToken: string; expiresIn: number }) => void;
    const refresh = vi.fn(() => new Promise<{ accessToken: string; expiresIn: number }>((resolve) => {
      resolveRefresh = resolve;
    }));
    const session = new ISessionService(config, { refresh } as unknown as IAuthService,
      {} as ICsrfService, new ISessionExpiredService());

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
    let resolveRefresh!: (value: { accessToken: string; expiresIn: number }) => void;
    const refresh = vi.fn(() => new Promise<{ accessToken: string; expiresIn: number }>((resolve) => {
      resolveRefresh = resolve;
    }));
    const session = new ISessionService(config, { refresh } as unknown as IAuthService,
      {} as ICsrfService, new ISessionExpiredService());
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
    const logout = vi.fn(async () => undefined);
    const refresh = vi.fn(async () => { throw { status: 401, error: { errorCode: 'AUTH_SESSION_REVOKED' } }; });
    const expired = new ISessionExpiredService();
    const session = new ISessionService(config, { refresh, logout } as unknown as IAuthService,
      {} as ICsrfService, expired);
    session.setSession(TOKEN, 3600, decodeUser(TOKEN));
    session.clearSession();

    const result = await session.tryRestoreSession();
    expect(result.reason).toBe('SESSION_REVOKED');
    expect(expired.visible).toBe(true);
    expect(logout).not.toHaveBeenCalled();
  });

  it('resets sidebar data when a different user establishes a session', () => {
    const session = new ISessionService(config, {} as IAuthService,
      {} as ICsrfService, new ISessionExpiredService());
    const store = { reset: vi.fn() } as unknown as IUserMenuStore;
    session.setUserMenuStore(store);
    const user = decodeUser(TOKEN);
    session.setSession(TOKEN, 3600, user);
    session.setSession(TOKEN, 3600, { ...user, sub: 'user-b' });

    expect(store.reset).toHaveBeenCalledTimes(1);
  });
});
