import { describe, expect, it } from 'vitest';

import {
  getAuthEndpointPath,
  getDefaultIAuthConfig,
  resolveIAuthConfig,
  validateIAuthConfig,
} from './auth-config';

describe('insight auth config', () => {
  it('leaves identity host and signinUrl empty by default (no shared identity provider)', () => {
    const config = getDefaultIAuthConfig();
    expect(config.api.identity).toBe('');
    expect(config.signinUrl).toBe('');
  });

  it('rejects a config without an identity host or signinUrl', () => {
    const defaults = getDefaultIAuthConfig();
    expect(() => validateIAuthConfig(defaults)).toThrowError(/api.identity/);

    const withHost = {
      ...defaults,
      api: { ...defaults.api, identity: 'https://app.example.com/api' },
    };
    expect(() => validateIAuthConfig(withHost)).toThrowError(/signinUrl/);
  });

  it('deep-merges api/tokenLifespan/endpoints overrides over defaults', () => {
    const config = resolveIAuthConfig({
      api: { identity: 'https://app.example.com/api', product: 'https://product.example.com/api' },
      signinUrl: 'https://app.example.com/api/auth/login',
      endpoints: { refresh: '/v1/session/refresh' },
    });
    expect(config.api.identity).toBe('https://app.example.com/api');
    expect(config.api.product).toBe('https://product.example.com/api');
    expect(config.api.user).toBeTruthy();
    expect(config.endpoints?.refresh).toBe('/v1/session/refresh');
    expect(config.endpoints?.csrf).toBe('/auth/csrf');
  });

  it('resolves an endpoint path with the default when not overridden', () => {
    const config = resolveIAuthConfig({
      api: { identity: 'https://app.example.com/api' },
      signinUrl: 'https://app.example.com/api/auth/login',
    });
    expect(getAuthEndpointPath(config, 'csrf')).toBe('/auth/csrf');
    expect(getAuthEndpointPath(config, 'refresh')).toBe('/auth/refresh');
  });
});
