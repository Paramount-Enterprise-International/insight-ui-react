import { describe, expect, it } from 'vitest';

import type { IAuthorizationSource } from '../user/user.types';
import { evaluatePermission } from './use-permission';

const source: IAuthorizationSource = {
  menuCodes: ['sales:report', 'report.export'],
  roles: ['iam-admin'],
  companyCodes: ['ecomindo'],
  companies: [{ id: 'c1', code: 'ecomindo', name: 'Ecomindo' }],
  menuCompanies: { 'report.export': ['ecomindo'] },
};

describe('evaluatePermission', () => {
  it('checks a plain string against menu codes', () => {
    expect(evaluatePermission('sales:report', source)).toBe(true);
  });

  it('checks an array against menu codes using any-match semantics', () => {
    expect(evaluatePermission(['missing', 'sales:report'], source)).toBe(true);
  });

  it('supports compound predicates', () => {
    expect(
      evaluatePermission(
        (value) =>
          value.roles.includes('iam-admin') &&
          value.menuCodes.includes('report.export') &&
          value.companyCodes.includes('ecomindo'),
        source,
      ),
    ).toBe(true);
  });

  it('fails closed when a predicate throws', () => {
    expect(evaluatePermission(() => { throw new Error('boom'); }, source)).toBe(false);
  });
});
