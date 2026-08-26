import { describe, expect, it } from 'vitest';

import { resolvePermission } from './use-permission';

describe('resolvePermission', () => {
  it('resolves a plain string to menu source', () => {
    expect(resolvePermission('sales:report')).toEqual({ source: 'menu', codes: 'sales:report' });
  });

  it('resolves an array to menu source', () => {
    expect(resolvePermission(['a', 'b'])).toEqual({ source: 'menu', codes: ['a', 'b'] });
  });

  it('resolves an object form with explicit source', () => {
    expect(resolvePermission({ source: 'role', value: 'iam-admin' })).toEqual({
      source: 'role',
      codes: 'iam-admin',
    });
  });

  it('returns null for nullish input', () => {
    expect(resolvePermission(null)).toBeNull();
  });
});
