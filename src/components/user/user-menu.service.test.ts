import { describe, expect, it, vi } from 'vitest';

import type { IApiClient } from '../api/api.client';
import type { IAuthConfig } from '../auth/auth-config';
import { IUserMenuService } from './user-menu.service';

const BASE_CONFIG: IAuthConfig = {
  api: {
    identity: 'http://localhost:3001/api',
    user: 'http://localhost:3002/api/users',
  },
  signinUrl: 'http://localhost:4200/signin',
  allowedReturnOrigins: ['http://localhost:4200'],
  tokenLifespan: {
    accessTokenSeconds: 3600,
    refreshTokenSeconds: 7200,
    ssoSessionMaxSeconds: 54000,
  },
  csrfTokenMaxAgeSeconds: 7170,
};

const envelope = (data: unknown) => ({ meta: { timestamp: '2026-09-10T00:00:00Z' }, data });

function createService(config: IAuthConfig = BASE_CONFIG) {
  const api = { get: vi.fn(async () => envelope([])) } as unknown as IApiClient;
  return { service: new IUserMenuService(config, api), api };
}

const getCalls = (api: IApiClient) =>
  (api as unknown as { get: ReturnType<typeof vi.fn> }).get.mock.calls as [
    string,
    { apiUrl?: string; params?: Record<string, unknown> },
  ][];

describe('IUserMenuService — getAuthorizations', () => {
  it('calls GET {api.user}/me/authorizations and unwraps .data', async () => {
    const { service, api } = createService();
    const data = [{ menuCode: 'report.export', menuId: 'm2', type: 'function', companies: [] }];
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(envelope(data));

    const result = await service.getAuthorizations('app-1');

    const [path, options] = getCalls(api)[0];
    expect(path).toBe('/me/authorizations');
    expect(options.apiUrl).toBe('http://localhost:3002/api/users');
    expect(result).toEqual(data);
  });

  it('passes the given applicationId as a query param', async () => {
    const { service, api } = createService();

    await service.getAuthorizations('app-1');

    expect(getCalls(api)[0][1].params).toEqual({ applicationId: 'app-1' });
  });

  it('falls back to config.appId when no applicationId is given', async () => {
    const { service, api } = createService({ ...BASE_CONFIG, appId: 'cfg-app' });

    await service.getAuthorizations();

    expect(getCalls(api)[0][1].params).toEqual({ applicationId: 'cfg-app' });
  });

  it('errors without issuing a request when neither applicationId nor config.appId is set', async () => {
    const { service, api } = createService();

    await expect(service.getAuthorizations()).rejects.toThrow(/applicationId is required/);
    expect(getCalls(api).length).toBe(0);
  });

  it('yields an empty list for an empty response', async () => {
    const { service } = createService();

    await expect(service.getAuthorizations('app-1')).resolves.toEqual([]);
  });
});
