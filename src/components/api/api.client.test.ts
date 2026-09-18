import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveIAuthConfig } from '../auth/auth-config';
import type { ICsrfService } from '../csrf/csrf';
import {
  createApiClient,
  rawRequest,
  type IApiClient,
  type IApiClientDeps,
} from './api.client';

function setup() {
  const config = resolveIAuthConfig({
    api: { identity: 'https://app.test/api' },
    signinUrl: 'https://app.test/signin',
  });
  const session = {
    getAccessToken: vi.fn(() => 'old'),
    isTokenExpired: () => false,
    refreshToken: vi.fn(async () => 'new'),
    clearSession: vi.fn(),
  };
  const csrf = { getToken: vi.fn(() => 'csrf-old') } as unknown as ICsrfService;
  const onSessionExpired = vi.fn();
  const deps: IApiClientDeps = { config, session, csrf, onSessionExpired };
  const api = createApiClient(deps);
  return { api, deps, session, csrf, onSessionExpired };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('application API transport', () => {
  it('preserves raw arrays, parameters, and pagination headers without consuming raw responses', async () => {
    const fetchMock = vi.fn<
      (url: string, init?: RequestInit) => Promise<Response>
    >(async () =>
      Response.json([{ id: 1 }], { headers: { 'X-Total-Count': '53' } })
    );
    vi.stubGlobal('fetch', fetchMock);
    const { api } = setup();
    expect(
      await api.get('/items', {
        params: { page: 0, enabled: false, missing: undefined },
      })
    ).toEqual([{ id: 1 }]);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://app.test/api/items?page=0&enabled=false'
    );
    const result: Response = await api.get('/items', {
      responseType: 'response',
    });
    expect(result.bodyUsed).toBe(false);
    expect(result.headers.get('X-Total-Count')).toBe('53');
    expect(await result.json()).toEqual([{ id: 1 }]);
  });

  it('supports raw downloads and decoded binary/text bodies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
        async () =>
          new Response(new Uint8Array([1, 2, 3]), {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': 'attachment; filename=data.bin',
            },
          })
      )
    );
    const { api } = setup();
    const raw: Response = await api.post(
      '/download',
      { id: 1 },
      { responseType: 'response' }
    );
    expect(raw.headers.get('Content-Disposition')).toContain('data.bin');
    expect(raw.headers.get('Content-Type')).toBe('application/octet-stream');
    expect([...new Uint8Array(await raw.arrayBuffer())]).toEqual([1, 2, 3]);
    const blob: Blob = await api.get('/download', { responseType: 'blob' });
    expect(blob.size).toBe(3);
    const bytes: ArrayBuffer = await api.patch(
      '/download',
      {},
      { responseType: 'arraybuffer' }
    );
    expect(bytes.byteLength).toBe(3);
    const text: string = await api.put(
      '/download',
      {},
      { responseType: 'text' }
    );
    expect(text.length).toBe(3);
  });

  it('passes FormData unchanged and removes explicit Content-Type regardless of casing', async () => {
    const fetchMock = vi.fn<
      (url: string, init?: RequestInit) => Promise<Response>
    >(async () => Response.json({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    const { api } = setup();
    const form = new FormData();
    form.append('name', 'hello');
    await api.post('/upload', form, {
      headers: { 'content-type': 'application/json' },
    });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.body).toBe(form);
    expect(new Headers(init.headers).has('Content-Type')).toBe(false);
    expect(init.credentials).toBe('include');
  });

  it.each([false, 0, null])('keeps DELETE body %s', async (body) => {
    const fetchMock = vi.fn<
      (url: string, init?: RequestInit) => Promise<Response>
    >(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await setup().api.delete('/item', { body })).toBeUndefined();
    expect((fetchMock.mock.calls[0][1] as RequestInit).body).toBe(
      JSON.stringify(body)
    );
  });

  it.each([200, 204])(
    'accepts an empty %s response and omits Content-Type without a body',
    async (status) => {
      const fetchMock = vi.fn<
        (url: string, init?: RequestInit) => Promise<Response>
      >(async () => new Response(null, { status }));
      vi.stubGlobal('fetch', fetchMock);
      expect(await setup().api.delete('/item')).toBeUndefined();
      expect(
        new Headers((fetchMock.mock.calls[0][1] as RequestInit).headers).has(
          'Content-Type'
        )
      ).toBe(false);
    }
  );

  it('replaces session Authorization and reads current CSRF before the single retry', async () => {
    const { api, session, csrf } = setup();
    session.refreshToken.mockImplementation(async () => {
      vi.mocked(csrf.getToken).mockReturnValue('csrf-new');
      return 'new';
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 401 }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    await api.get('/item');
    expect(
      new Headers(fetchMock.mock.calls[0][1].headers).get('Authorization')
    ).toBe('Bearer old');
    expect(
      new Headers(fetchMock.mock.calls[1][1].headers).get('Authorization')
    ).toBe('Bearer new');
    expect(
      new Headers(fetchMock.mock.calls[1][1].headers).get('X-CSRF-Token')
    ).toBe('csrf-new');
    expect(session.refreshToken).toHaveBeenCalledOnce();
  });

  it('preserves caller Authorization and propagates business errors after retry without expiry', async () => {
    const { api, onSessionExpired } = setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({ Message: 'Invalid data' }, { status: 400 })
      );
    vi.stubGlobal('fetch', fetchMock);
    await expect(
      api.get('/item', { headers: { authorization: 'Custom credentials' } })
    ).rejects.toMatchObject({ status: 400, message: 'Invalid data' });
    expect(
      new Headers(fetchMock.mock.calls[1][1].headers).get('Authorization')
    ).toBe('Custom credentials');
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('normalizes non-JSON and binary-mode errors safely', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
        async () =>
          new Response('<html>Unavailable</html>', {
            status: 503,
            statusText: 'Unavailable',
          })
      )
    );
    await expect(
      setup().api.get('/file', { responseType: 'blob' })
    ).rejects.toMatchObject({ status: 503, detail: 'Unavailable' });
  });

  it('aborts the underlying request at the default deadline', async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init: RequestInit) => {
        signal = init.signal!;
        return new Promise<Response>(() => {});
      })
    );
    const pending = rawRequest('https://app.test', '/slow', null);
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'TimeoutError',
      errorCode: 'REQUEST_TIMEOUT',
    });
    await vi.advanceTimersByTimeAsync(60_000);
    await assertion;
    expect(signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels one refresh waiter without cancelling another and keeps one total deadline', async () => {
    vi.useFakeTimers();
    const { api, session, onSessionExpired } = setup();
    let resolve!: (token: string) => void;
    session.refreshToken.mockReturnValue(
      new Promise<string>((done) => {
        resolve = done;
      })
    );
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init: RequestInit) =>
        Promise.resolve(
          new Headers(init.headers).get('Authorization') === 'Bearer new'
            ? Response.json({ ok: true })
            : new Response('{}', { status: 401 })
        )
      )
    );
    const controller = new AbortController();
    const cancelled = api.get('/a', { signal: controller.signal });
    const assertion = expect(cancelled).rejects.toMatchObject({
      name: 'AbortError',
    });
    const survivor = api.get('/b');
    await vi.advanceTimersByTimeAsync(0);
    controller.abort();
    await assertion;
    resolve('new');
    expect(await survivor).toEqual({ ok: true });
    expect(onSessionExpired).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not start transport for an already aborted signal', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();
    controller.abort();
    await expect(
      setup().api.get('/item', { signal: controller.signal })
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

// Compile-time checks for both access styles and response representations.
function typedCalls(api: IApiClient) {
  const options: import('./api.client').IApiOptions = {
    headers: { Accept: 'application/json' },
  };
  const legacy: Promise<{ id: string }> = api.get<{ id: string }>(
    '/item',
    options
  );
  const raw: Promise<{ id: string }> = rawRequest<{ id: string }>(
    'https://app.test',
    '/item',
    null,
    options
  );
  const json: Promise<{ id: string }> = api.get<{ id: string }>('/item');
  const response: Promise<Response> = api.delete('/item', {
    responseType: 'response',
    body: false,
  });
  return { json, response, legacy, raw };
}
void typedCalls;
