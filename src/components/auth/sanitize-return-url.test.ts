import { describe, expect, it } from 'vitest';

import { sanitizeReturnUrl } from './sanitize-return-url';

const ALLOWED = ['https://app.paramountenterprise.co.id', 'https://*.paramountenterprise.co.id'];

describe('sanitizeReturnUrl', () => {
  it('returns / for empty input', () => {
    expect(sanitizeReturnUrl('', ALLOWED)).toEqual({ returnUrl: '/', isExternal: false });
    expect(sanitizeReturnUrl(null, ALLOWED)).toEqual({ returnUrl: '/', isExternal: false });
    expect(sanitizeReturnUrl(undefined, ALLOWED)).toEqual({ returnUrl: '/', isExternal: false });
  });

  it('blocks protocol-relative URLs (open-redirect protection)', () => {
    expect(sanitizeReturnUrl('//evil.com', ALLOWED)).toEqual({ returnUrl: '/', isExternal: false });
  });

  it('allows relative paths', () => {
    expect(sanitizeReturnUrl('/dashboard', ALLOWED)).toEqual({
      returnUrl: '/dashboard',
      isExternal: false,
    });
  });

  it('allows absolute URLs on an allowed origin (external navigation)', () => {
    const result = sanitizeReturnUrl('https://app.paramountenterprise.co.id/foo', ALLOWED);
    expect(result).toEqual({
      returnUrl: 'https://app.paramountenterprise.co.id/foo',
      isExternal: true,
    });
  });

  it('supports wildcard subdomain origins', () => {
    const result = sanitizeReturnUrl('https://dev.paramountenterprise.co.id/bar', ALLOWED);
    expect(result.isExternal).toBe(true);
  });

  it('falls back to / for untrusted origins', () => {
    expect(sanitizeReturnUrl('https://evil.com/x', ALLOWED)).toEqual({
      returnUrl: '/',
      isExternal: false,
    });
  });

  it('falls back to / for unknown schemes', () => {
    expect(sanitizeReturnUrl('javascript:alert(1)', ALLOWED)).toEqual({
      returnUrl: '/',
      isExternal: false,
    });
  });
});
