import { describe, expect, it } from 'vitest';

import {
  extractProblemDetailsErrorCode,
  isSessionExpiredError,
  toSessionExpiredReason,
} from './session-expired.service';

describe('extractProblemDetailsErrorCode', () => {
  it('extracts from top-level errorCode', () => {
    expect(extractProblemDetailsErrorCode({ errorCode: 'AUTH_TOKEN_EXPIRED' })).toBe('AUTH_TOKEN_EXPIRED');
  });

  it('extracts from legacy code', () => {
    expect(extractProblemDetailsErrorCode({ code: 'SESSION_REVOKED' })).toBe('SESSION_REVOKED');
  });

  it('extracts from nested error object', () => {
    expect(extractProblemDetailsErrorCode({ error: { errorCode: 'AUTH_NO_SESSION' } })).toBe('AUTH_NO_SESSION');
  });

  it('returns undefined for non-objects', () => {
    expect(extractProblemDetailsErrorCode(null)).toBeUndefined();
    expect(extractProblemDetailsErrorCode('boom')).toBeUndefined();
  });
});

describe('toSessionExpiredReason', () => {
  it('maps known backend codes', () => {
    expect(toSessionExpiredReason('AUTH_TOKEN_EXPIRED')).toBe('TOKEN_EXPIRED');
    expect(toSessionExpiredReason('AUTH_SESSION_REVOKED')).toBe('SESSION_REVOKED');
    expect(toSessionExpiredReason('AUTH_SESSION_REPLACED')).toBe('SESSION_REPLACED');
  });

  it('returns undefined for unknown codes', () => {
    expect(toSessionExpiredReason('SOMETHING_ELSE')).toBeUndefined();
  });
});

describe('isSessionExpiredError', () => {
  it('treats 401/498 as session-expired', () => {
    expect(isSessionExpiredError({ status: 401 })).toBe(true);
    expect(isSessionExpiredError({ status: 498 })).toBe(true);
  });

  it('treats recognized error codes as session-expired', () => {
    expect(isSessionExpiredError({ errorCode: 'AUTH_NO_SESSION' })).toBe(true);
  });

  it('does not treat business errors as session-expired', () => {
    expect(isSessionExpiredError({ status: 400 })).toBe(false);
    expect(isSessionExpiredError({ status: 403 })).toBe(false);
  });
});
