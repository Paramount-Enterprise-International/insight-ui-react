import { describe, expect, it } from 'vitest';

import { decodeJwtPayload, decodeUser } from './session.service';

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
