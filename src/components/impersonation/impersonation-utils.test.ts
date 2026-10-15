import { describe, expect, it } from 'vitest';
import {
  actorDisplayNameFromToken,
  formatCountdown,
  grantEndLabel,
  normalizeImpersonationStatus,
  readImpersonationActor,
  resolveGrantEnd,
  resolveImpersonationRedirect,
} from './impersonation-utils';
const token = (claims: Record<string, unknown>): string =>
  'e30.' + btoa(JSON.stringify(claims)) + '.sig';
describe('impersonation utilities', () => {
  it('requires a valid actor sub and preserves display fallback order', () => {
    expect(readImpersonationActor('bad')).toBeNull();
    expect(readImpersonationActor(token({ act: { name: 'A' } }))).toBeNull();
    expect(readImpersonationActor(token({ act: { sub: 'a' } }))).toEqual({
      sub: 'a',
    });
    expect(
      actorDisplayNameFromToken(
        token({ act: { sub: 'a', name: ' A ', preferred_username: 'user' } })
      )
    ).toBe('A');
    expect(
      actorDisplayNameFromToken(
        token({ act: { sub: 'a', preferred_username: 'user' } })
      )
    ).toBe('user');
    expect(actorDisplayNameFromToken(token({ act: { sub: 'a' } }))).toBe('a');
  });
  it('normalizes BFF and IAM status without changing subject ownership', () => {
    expect(
      normalizeImpersonationStatus(
        {
          user: { name: 'B' },
          actor: { sub: 'a', name: 'A' },
          impersonation: { grantId: 'g', endAt: '2026-10-16T16:59:59.999Z' },
        },
        'bff'
      )
    ).toEqual({
      mode: 'IMPERSONATING',
      actorName: 'A',
      subjectName: 'B',
      grantId: 'g',
      endAt: '2026-10-16T16:59:59.999Z',
    });
    expect(
      normalizeImpersonationStatus({ user: { name: 'B' } }, 'bff').mode
    ).toBe('NONE');
    expect(
      normalizeImpersonationStatus({ mode: 'HAS_ACTIVE_GRANT' }, 'iam-user')
        .mode
    ).toBe('HAS_ACTIVE_GRANT');
  });
  it('uses WIB calendar dates and inclusive fallback instants', () => {
    expect(
      grantEndLabel({ mode: 'IMPERSONATING', endAt: '2026-10-15T17:00:00Z' })
    ).toBe('16 Oct 2026');
    expect(resolveGrantEnd(null, '2026-10-16')).toBe(
      Date.parse('2026-10-16T16:59:59.999Z')
    );
    expect(resolveGrantEnd('invalid')).toBeNull();
    expect(formatCountdown(-1)).toBe('00:00:00');
    expect(formatCountdown(3_661_000)).toBe('01:01:01');
  });
  it('resolves BFF redirects against the auth host and rejects other origins', () => {
    expect(
      resolveImpersonationRedirect(
        { redirectTo: '/api/auth/login' },
        'https://bff.test/api',
        '/signin'
      )
    ).toBe('https://bff.test/api/auth/login');
    expect(
      resolveImpersonationRedirect(
        { redirectTo: 'https://other.test/' },
        'https://bff.test/api',
        '/signin'
      )
    ).toBe('/signin');
    expect(
      resolveImpersonationRedirect({}, 'https://bff.test/api', '/signin')
    ).toBe('/signin');
  });
});
