import { describe, expect, it, vi } from 'vitest';

import { decodeJwtPayload, decodeUser, ISessionService } from './session.service';
import type { IAuthConfig } from '../auth/auth-config';
import type { IAuthService } from '../auth/auth.service';
import type { ICsrfService } from '../csrf/csrf.service';
import type { IUserMenuStore } from '../store/user-menu.store';

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
