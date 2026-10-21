import { afterEach, describe, expect, it } from 'vitest';

import { getSessionReturnUrl, toRouterReturnUrl } from './session-return-url';

const initialUrl = window.location.href;
afterEach(() => history.replaceState(null, '', initialUrl));

describe('session return URL', () => {
  it.each([
    ['/app/reports/42?tab=roles#details', '/app/reports/42?tab=roles#details'],
    ['/?view=home#summary', '/?view=home#summary'],
    ['/#summary', '/#summary'],
    ['/', '/'],
    ['/reports?tab=roles#at=handoff-token', '/reports?tab=roles'],
    [
      '/reports#intro&at=handoff-token&view=summary',
      '/reports#intro&view=summary',
    ],
    ['/reports#a%74=handoff-token&intro', '/reports#intro'],
  ])('captures %s as %s', (browserPath, expected) => {
    history.replaceState(null, '', browserPath);
    expect(getSessionReturnUrl()).toBe(expected);
    expect(
      window.location.pathname + window.location.search + window.location.hash
    ).toBe(browserPath);
  });
});

describe('callback router destinations', () => {
  it.each([
    ['/app/reports/42?tab=roles#details', '/reports/42?tab=roles#details'],
    ['/reports/42?tab=roles#details', '/reports/42?tab=roles#details'],
    ['/app/?view=home#summary', '/?view=home#summary'],
    ['/application/reports', '/application/reports'],
    [
      'https://app.test/app/reports?view=one#details',
      '/reports?view=one#details',
    ],
  ])('normalizes %s once', (browserPath, expected) => {
    expect(toRouterReturnUrl(browserPath, '/app/', 'https://app.test')).toBe(
      expected
    );
  });

  it.each([
    '//evil.test/path',
    'https://app.test.evil.test/path',
    'https://evil.test/path',
    'javascript:alert(1)',
    'invalid',
  ])('rejects %s', (target) => {
    expect(toRouterReturnUrl(target, '/app/', 'https://app.test')).toBe('/');
  });
});
