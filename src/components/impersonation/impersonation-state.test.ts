import { describe, expect, it, vi } from 'vitest';
import type { IApiClient } from '../api/api.client';
import { resolveIAuthConfig } from '../auth/auth-config';
import type { ISessionService } from '../session/session';
import { IImpersonationStateService } from './impersonation-state';

describe('IImpersonationStateService', () => {
  it('deduplicates requests, normalizes BFF status, and cancels on disposal', async () => {
    const token =
      'e30.' + btoa(JSON.stringify({ sub: 'b', act: { sub: 'a' } })) + '.sig';
    let complete!: (value: unknown) => void;
    const get = vi.fn(
      (requestPath: string, requestOptions?: Record<string, unknown>) => {
        expect(requestPath).toBe('/auth/me');
        expect(requestOptions?.['apiUrl']).toBe('https://bff.test/api');
        return new Promise<unknown>((resolve) => {
          complete = resolve;
        });
      }
    );
    const session = {
      getAccessToken: () => token,
      isImpersonating: () => true,
      subscribe: () => () => undefined,
    } as unknown as ISessionService;
    const state = new IImpersonationStateService(
      resolveIAuthConfig({
        api: { identity: 'https://bff.test/api' },
        signinUrl: '/signin',
        impersonation: { source: 'bff' },
      }),
      session,
      { get } as unknown as IApiClient
    );
    const first = state.loadStatus();
    expect(state.loadStatus()).toBe(first);
    complete({
      actor: { sub: 'a', name: 'A' },
      user: { name: 'B' },
      impersonation: { grantId: 'g' },
    });
    await first;
    expect(state.status?.subjectName).toBe('B');
    expect(get).toHaveBeenCalledTimes(1);
    const signal = get.mock.calls[0]?.[1];
    expect(signal).toBeDefined();
    state.dispose();
    expect(state.status).toBeNull();
  });
});
