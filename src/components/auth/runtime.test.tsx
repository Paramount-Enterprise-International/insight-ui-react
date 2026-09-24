import { act, cleanup, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ISessionService } from '../session/session';
import type { IRefreshResponse } from './auth';
import { useIApi, useIAuthContext } from './insight-auth-context';
import { IAuthProvider } from './insight-auth-provider';
import { createIRuntime, type IRuntime } from './runtime';

const config = (name = 'a') => ({
  api: {
    identity: `https://${name}.test/api`,
    user: `https://${name}.test/users`,
  },
  signinUrl: `https://${name}.test/signin`,
  appId: name,
});
const runtimes: IRuntime[] = [];
const create = (name = 'a') => {
  const runtime = createIRuntime(config(name));
  runtimes.push(runtime);
  return runtime;
};
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
afterEach(async () => {
  cleanup();
  runtimes.forEach((runtime) => runtime.dispose());
  runtimes.length = 0;
  await Promise.resolve();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  sessionStorage.clear();
});

describe('application runtime lifecycle', () => {
  it('creates without network and initializes once from API calls before provider mount', async () => {
    const refresh = deferred<Response>();
    const fetchMock = vi.fn((url: string) =>
      url.endsWith('/refresh')
        ? refresh.promise
        : Promise.resolve(Response.json([1]))
    );
    vi.stubGlobal('fetch', fetchMock);
    const runtime = create();
    expect(runtime.status).toBe('idle');
    expect(fetchMock).not.toHaveBeenCalled();
    const a = runtime.api.get('/items');
    const b = runtime.api.get('/items');
    expect(runtime.status).toBe('initializing');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    refresh.resolve(
      Response.json({ accessToken: 'restored', expiresIn: 3600 })
    );
    expect(await a).toEqual([1]);
    expect(await b).toEqual([1]);
    await runtime.initialize();
    expect(runtime.ready).toBe(true);
    expect(
      fetchMock.mock.calls.filter(([url]) => url.endsWith('/refresh'))
    ).toHaveLength(1);
    expect(
      new Headers(
        (fetchMock.mock.calls[1] as unknown as [string, RequestInit])[1].headers
      ).get('Authorization')
    ).toBe('Bearer restored');
  });

  it('exposes exactly the same client and services through hooks and survives external remount', async () => {
    const runtime = create();
    runtime.session.setAccessToken('active');
    let context: ReturnType<typeof useIAuthContext> | undefined;
    let hookClient: ReturnType<typeof useIApi> | undefined;
    function Consumer() {
      context = useIAuthContext();
      hookClient = useIApi();
      return null;
    }
    const restore = vi.spyOn(runtime.session, 'tryRestoreSession');
    const mounted = render(
      <StrictMode>
        <IAuthProvider runtime={runtime}>
          <Consumer />
        </IAuthProvider>
      </StrictMode>
    );
    await act(async () => {
      await runtime.initialize();
    });
    expect(hookClient).toBe(runtime.api);
    expect(context?.session).toBe(runtime.session);
    expect(context?.csrf).toBe(runtime.csrf);
    mounted.unmount();
    await Promise.resolve();
    expect(runtime.status).toBe('ready');
    render(
      <IAuthProvider runtime={runtime}>
        <Consumer />
      </IAuthProvider>
    );
    expect(restore).toHaveBeenCalledOnce();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ ok: true }))
    );
    expect(await runtime.api.get('/items')).toEqual({ ok: true });
  });

  it('owns legacy config runtime and disposes only after final StrictMode unmount', async () => {
    const restore = vi
      .spyOn(ISessionService.prototype, 'tryRestoreSession')
      .mockResolvedValue({});
    let owned!: IRuntime;
    function Consumer() {
      owned = useIAuthContext() as IRuntime;
      return null;
    }
    const mounted = render(
      <StrictMode>
        <IAuthProvider config={config()}>
          <Consumer />
        </IAuthProvider>
      </StrictMode>
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(restore).toHaveBeenCalledOnce();
    expect(owned.status).toBe('ready');
    mounted.unmount();
    await Promise.resolve();
    expect(owned.status).toBe('disposed');
  });

  it('aborts restore after thirty seconds and cannot commit its late response', async () => {
    vi.useFakeTimers();
    const response = deferred<Response>();
    let signal!: AbortSignal;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init: RequestInit) => {
        signal = init.signal!;
        return response.promise;
      })
    );
    const runtime = create();
    const ready = runtime.initialize();
    await vi.advanceTimersByTimeAsync(30_000);
    await ready;
    expect(signal.aborted).toBe(true);
    expect(runtime.session.initializing).toBe(false);
    response.resolve(Response.json({ accessToken: 'late', expiresIn: 3600 }));
    await vi.advanceTimersByTimeAsync(0);
    expect(runtime.session.getAccessToken()).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not overwrite a newer callback session with an old restore', async () => {
    const runtime = create();
    const refresh = deferred<IRefreshResponse>();
    vi.spyOn(runtime.auth, 'refresh').mockReturnValue(refresh.promise);
    const ready = runtime.initialize();
    runtime.session.setAccessToken('callback');
    refresh.resolve({ accessToken: 'late', expiresIn: 3600 });
    await ready;
    expect(runtime.session.getAccessToken()).toBe('callback');
  });

  it('blocks session calls after logout but allows bearer-free and auth calls, then allows a new login', async () => {
    const runtime = create();
    const refresh = deferred<IRefreshResponse>();
    vi.spyOn(runtime.auth, 'refresh').mockReturnValue(refresh.promise);
    vi.spyOn(runtime.auth, 'logout').mockResolvedValue();
    vi.spyOn(runtime.csrf, 'ensureToken').mockResolvedValue();
    const ready = runtime.initialize();
    await runtime.session.logout();
    refresh.resolve({ accessToken: 'late', expiresIn: 3600 });
    await ready;
    expect(runtime.session.getAccessToken()).toBeNull();
    const fetchMock = vi.fn(async () => Response.json({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(runtime.api.get('/private')).rejects.toMatchObject({
      errorCode: 'AUTH_NO_SESSION',
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await runtime.api.get('/public', { skipBearer: true })).toEqual({
      ok: true,
    });
    expect(
      new Headers(
        (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].headers
      ).has('Authorization')
    ).toBe(false);
    expect(await runtime.api.post('/auth/login', {})).toEqual({ ok: true });
    runtime.session.setAccessToken('new-login');
    expect(await runtime.api.get('/private')).toEqual({ ok: true });
  });

  it('isolates tokens, CSRF, metadata, refresh and expiry handlers across runtimes', async () => {
    const a = create('a');
    const b = create('b');
    a.session.setAccessToken('token-a');
    b.session.setAccessToken('token-b');
    vi.spyOn(a.api, 'get').mockResolvedValueOnce({ data: [
      { menuCode: 'read-a', companies: [] },
    ] });
    vi.spyOn(b.api, 'get').mockResolvedValueOnce({ data: [
      { menuCode: 'read-b', companies: [] },
    ] });
    await a.userMenuStore.loadAuthorizations();
    await b.userMenuStore.loadAuthorizations();
    a.session.setChangePasswordToken('change-a');
    b.session.setChangePasswordToken('change-b');
    const fetchMock = vi.fn((url: string) => {
      if (url.endsWith('/csrf'))
        return Promise.resolve(
          Response.json({
            csrfToken: url.includes('a.test') ? 'csrf-a' : 'csrf-b',
          })
        );
      if (url.includes('a.test'))
        return Promise.resolve(new Response('{}', { status: 401 }));
      return Promise.resolve(Response.json({ ok: true }));
    });
    vi.stubGlobal('fetch', fetchMock);
    await Promise.all([a.csrf.ensureToken(), b.csrf.ensureToken()]);
    const expiryA = vi.fn();
    a.config.onUnauthorized = expiryA;
    const expiryB = vi.fn();
    b.config.onUnauthorized = expiryB;
    vi.spyOn(a.auth, 'refresh').mockRejectedValue({
      status: 401,
      errorCode: 'AUTH_SESSION_REVOKED',
    });
    const refreshB = vi.spyOn(b.auth, 'refresh');
    await expect(a.api.get('/items')).rejects.toMatchObject({ status: 401 });
    expect(expiryA).toHaveBeenCalledOnce();
    expect(expiryB).not.toHaveBeenCalled();
    expect(refreshB).not.toHaveBeenCalled();
    expect(b.session.getAccessToken()).toBe('token-b');
    expect(a.userMenuStore.menuCodes).toEqual([]);
    expect(b.userMenuStore.menuCodes).toEqual(['read-b']);
    expect(b.csrf.getToken()).toBe('csrf-b');
    expect(b.session.getChangePasswordToken()).toBe('change-b');
    a.dispose();
    expect(await b.api.get('/items')).toEqual({ ok: true });
    expect(b.status).toBe('ready');
  });

  it('shares refresh with restore and aborts/disposes without server logout', async () => {
    const runtime = create();
    const response = deferred<IRefreshResponse>();
    const refresh = vi
      .spyOn(runtime.auth, 'refresh')
      .mockReturnValue(response.promise);
    const logout = vi.spyOn(runtime.auth, 'logout').mockResolvedValue();
    const token = runtime.session.refreshToken();
    const rejected = expect(token).rejects.toMatchObject({
      name: 'AbortError',
    });
    const ready = runtime.initialize();
    runtime.dispose();
    runtime.dispose();
    await rejected;
    await ready;
    response.resolve({ accessToken: 'late', expiresIn: 3600 });
    await Promise.resolve();
    expect(refresh).toHaveBeenCalledOnce();
    expect(logout).not.toHaveBeenCalled();
    expect(runtime.session.getAccessToken()).toBeNull();
    await expect(
      runtime.api.get('/items', { skipBearer: true })
    ).rejects.toThrow('disposed');
    expect(() => runtime.initialize()).toThrow('disposed');
    refresh.mockRestore();
    await expect(runtime.auth.refresh()).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});
describe('runtime refresh concurrency', () => {
  it('shares refresh across consumers and lets another caller continue after one aborts', async () => {
    const runtime = create();
    runtime.session.setAccessToken('old');
    await runtime.initialize();
    const refreshed = deferred<IRefreshResponse>();
    const refresh = vi
      .spyOn(runtime.auth, 'refresh')
      .mockReturnValue(refreshed.promise);
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) =>
        Promise.resolve(
          new Headers(init.headers).get('Authorization') === 'Bearer new'
            ? Response.json({ ok: true })
            : new Response('{}', { status: 401 })
        )
      )
    );
    const controller = new AbortController();
    const cancelled = runtime.api.get('/a', { signal: controller.signal });
    const assertion = expect(cancelled).rejects.toMatchObject({
      name: 'AbortError',
    });
    const survivor = runtime.api.get('/b');
    await vi.waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    controller.abort();
    await assertion;
    refreshed.resolve({ accessToken: 'new', expiresIn: 3600 });
    expect(await survivor).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledOnce();
    expect(runtime.session.getAccessToken()).toBe('new');
    expect(runtime.sessionExpired.visible).toBe(false);
  });

  it('aborts an established session refresh on logout and ignores the late token', async () => {
    const runtime = create();
    runtime.session.setAccessToken('old');
    await runtime.initialize();
    const refreshed = deferred<IRefreshResponse>();
    vi.spyOn(runtime.auth, 'refresh').mockReturnValue(refreshed.promise);
    vi.spyOn(runtime.auth, 'logout').mockResolvedValue();
    vi.spyOn(runtime.csrf, 'ensureToken').mockResolvedValue();
    const pending = runtime.session.refreshToken();
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
    });
    await runtime.session.logout();
    await assertion;
    refreshed.resolve({ accessToken: 'late', expiresIn: 3600 });
    await Promise.resolve();
    expect(runtime.session.getAccessToken()).toBeNull();
    expect(runtime.session.isLoggedOut()).toBe(true);
  });
});
