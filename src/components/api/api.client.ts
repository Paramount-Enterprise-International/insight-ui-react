import {
  getAuthEndpointUrl,
  requireIdentityHost,
  type IAuthConfig,
} from '../auth/auth-config';
import type { ICsrfService } from '../csrf/csrf';
import { normalizeApiError, type INormalizedApiError } from './api-error';
import { createRequestScope, waitForRequest } from './request-scope';

export type IApiError = INormalizedApiError;
export type IResponseType =
  | 'json'
  | 'response'
  | 'blob'
  | 'arraybuffer'
  | 'text';
export type IQueryParams =
  | Record<string, string | number | boolean | undefined>
  | URLSearchParams;
export type IApiOptions<R extends IResponseType = 'json'> = {
  apiUrl?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: IQueryParams;
  skipBearer?: boolean;
  responseType?: R;
  signal?: AbortSignal;
  /** Total call deadline, including readiness and refresh. Defaults to 60000 ms. */
  timeoutMs?: number;
};
export type IRequestOptions<R extends IResponseType = 'json'> = IApiOptions<R> & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
};

export async function normalizeFetchError(
  res: Response,
  body: unknown
): Promise<IApiError> {
  const value = res.headers.get('Retry-After');
  const retryAfter = value?.trim() ? Number(value) : NaN;
  const fields =
    body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  return normalizeApiError({
    status: res.status,
    error: {
      ...fields,
      detail:
        fields.detail ??
        (Object.keys(fields).length
          ? undefined
          : res.statusText || 'Request failed'),
      retryAfter:
        typeof fields.retryAfter === 'number'
          ? fields.retryAfter
          : Number.isFinite(retryAfter)
            ? retryAfter
            : undefined,
    },
  });
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Send a credentialed request and decode only the selected response representation. */
async function sendRequest(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options: IRequestOptions<IResponseType>
): Promise<unknown> {
  const method = options.method ?? 'GET';
  const hasBody = options.body !== undefined && method !== 'GET';
  const form =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const binary =
    (typeof Blob !== 'undefined' && options.body instanceof Blob) ||
    options.body instanceof ArrayBuffer ||
    ArrayBuffer.isView(options.body);
  const headers = new Headers({
    Accept: 'application/json',
    ...options.headers,
  });
  if (form) headers.delete('Content-Type');
  else if (hasBody && !binary && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  const csrfToken = csrf?.getToken();
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  const res = await fetch(buildUrl(baseUrl, path, options.params), {
    method,
    credentials: 'include',
    headers,
    signal: options.signal,
    body: hasBody
      ? form || binary
        ? (options.body as BodyInit)
        : JSON.stringify(options.body)
      : undefined,
  });
  if (!res.ok) throw await normalizeFetchError(res, await readJson(res));
  switch (options.responseType) {
    case 'response':
      return res;
    case 'blob':
      return res.blob();
    case 'arraybuffer':
      return res.arrayBuffer();
    case 'text':
      return res.text();
    default:
      return readJson(res);
  }
}

export function rawRequest(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options: IRequestOptions<'response'> & { responseType: 'response' }
): Promise<Response>;
export function rawRequest(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options: IRequestOptions<'blob'> & { responseType: 'blob' }
): Promise<Blob>;
export function rawRequest(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options: IRequestOptions<'arraybuffer'> & { responseType: 'arraybuffer' }
): Promise<ArrayBuffer>;
export function rawRequest(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options: IRequestOptions<'text'> & { responseType: 'text' }
): Promise<string>;
export function rawRequest<T = unknown>(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options?: IRequestOptions & { responseType?: 'json' }
): Promise<T>;
export async function rawRequest(
  baseUrl: string,
  path: string,
  csrf: ICsrfService | null,
  options: IRequestOptions<IResponseType> = {}
): Promise<unknown> {
  const scope = createRequestScope(options.timeoutMs, [options.signal]);
  try {
    scope.signal.throwIfAborted();
    return await waitForRequest(
      sendRequest(baseUrl, path, csrf, { ...options, signal: scope.signal }),
      scope.signal
    );
  } catch (error) {
    if (scope.signal.aborted) throw scope.signal.reason;
    if (typeof (error as IApiError)?.status === 'number') throw error;
    throw normalizeApiError({
      status: 0,
      errorCode: 'NETWORK_ERROR',
      message: 'Network error',
    });
  } finally {
    scope.dispose();
  }
}

export function buildUrl(
  baseUrl: string,
  path: string,
  params?: IQueryParams
): string {
  let url = `${baseUrl}${path}`;
  if (params) {
    const query =
      params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(
            Object.entries(params)
              .filter(([, value]) => value !== undefined)
              .map(([key, value]) => [key, String(value)])
          ).toString();
    if (query) url += `${url.includes('?') ? '&' : '?'}${query}`;
  }
  return url;
}

export type IApiClientDeps = {
  config: IAuthConfig;
  csrf: ICsrfService;
  session: {
    getAccessToken(): string | null;
    isTokenExpired(): boolean;
    refreshToken(): Promise<string>;
    clearSession(): void;
    isLoggedOut?(): boolean;
    getRequestSignal?(): AbortSignal;
  };
  initialize?: () => Promise<unknown>;
  assertActive?: () => void;
  signal?: AbortSignal;
  onSessionExpired?: (error: IApiError) => void;
};

export interface IApiRead {
  (
    path: string,
    options: IApiOptions<'response'> & { responseType: 'response' }
  ): Promise<Response>;
  (
    path: string,
    options: IApiOptions<'blob'> & { responseType: 'blob' }
  ): Promise<Blob>;
  (
    path: string,
    options: IApiOptions<'arraybuffer'> & { responseType: 'arraybuffer' }
  ): Promise<ArrayBuffer>;
  (
    path: string,
    options: IApiOptions<'text'> & { responseType: 'text' }
  ): Promise<string>;
  <T = unknown>(
    path: string,
    options?: IApiOptions & { responseType?: 'json' }
  ): Promise<T>;
}
export interface IApiWrite {
  (
    path: string,
    body: unknown,
    options: IApiOptions<'response'> & { responseType: 'response' }
  ): Promise<Response>;
  (
    path: string,
    body: unknown,
    options: IApiOptions<'blob'> & { responseType: 'blob' }
  ): Promise<Blob>;
  (
    path: string,
    body: unknown,
    options: IApiOptions<'arraybuffer'> & { responseType: 'arraybuffer' }
  ): Promise<ArrayBuffer>;
  (
    path: string,
    body: unknown,
    options: IApiOptions<'text'> & { responseType: 'text' }
  ): Promise<string>;
  <T = unknown>(
    path: string,
    body?: unknown,
    options?: IApiOptions & { responseType?: 'json' }
  ): Promise<T>;
}
export type IApiClient = {
  get: IApiRead;
  post: IApiWrite;
  put: IApiWrite;
  patch: IApiWrite;
  delete: IApiRead;
};

/** One application client for hooks and ordinary functions, with one refresh retry. */
export function createApiClient(deps: IApiClientDeps): IApiClient {
  const base = requireIdentityHost(deps.config);
  const isAuthPath = (url: string) =>
    (['csrf', 'refresh', 'login', 'logout', 'exchange'] as const).some(
      (key) => url.split('?')[0] === getAuthEndpointUrl(deps.config, key)
    );
  const requireSession = () => {
    if (deps.session.isLoggedOut?.())
      throw normalizeApiError({
        status: 401,
        errorCode: 'AUTH_NO_SESSION',
        message: 'Authentication required.',
      });
  };
  async function doRequest(
    path: string,
    method: IRequestOptions['method'],
    body?: unknown,
    options: IApiOptions<IResponseType> = {}
  ) {
    deps.assertActive?.();
    const baseUrl = options.apiUrl ?? base;
    const skipAuth =
      options.skipBearer === true || isAuthPath(buildUrl(baseUrl, path));
    if (!skipAuth) requireSession();
    const scope = createRequestScope(options.timeoutMs, [
      options.signal,
      deps.signal,
      skipAuth ? undefined : deps.session.getRequestSignal?.(),
    ]);
    let expiryReported = false;
    try {
      scope.signal.throwIfAborted();
      if (!skipAuth && deps.initialize)
        await waitForRequest(deps.initialize(), scope.signal);
      deps.assertActive?.();
      if (!skipAuth) requireSession();
      const headers = new Headers(options.headers);
      const explicitAuthorization = headers.has('Authorization');
      if (deps.config.apiKey) headers.set('Api-Key', deps.config.apiKey);
      const token = deps.session.getAccessToken();
      if (!skipAuth && token && !explicitAuthorization)
        headers.set('Authorization', `Bearer ${token}`);
      const send = () =>
        waitForRequest(
          sendRequest(baseUrl, path, deps.csrf, {
            ...options,
            method,
            body,
            headers: Object.fromEntries(headers.entries()),
            signal: scope.signal,
          }),
          scope.signal
        );
      try {
        return await send();
      } catch (error) {
        if (
          skipAuth ||
          (error as IApiError)?.status !== 401 ||
          scope.signal.aborted
        )
          throw error;
      }
      let refreshed: string;
      try {
        refreshed = await waitForRequest(
          deps.session.refreshToken(),
          scope.signal
        );
      } catch (error) {
        if (
          !scope.signal.aborted &&
          (error as IApiError)?.name !== 'AbortError' &&
          (error as IApiError)?.name !== 'TimeoutError'
        ) {
          expiryReported = true;
          deps.onSessionExpired?.(error as IApiError);
        }
        throw error;
      }
      if (!explicitAuthorization)
        headers.set('Authorization', `Bearer ${refreshed}`);
      try {
        return await send();
      } catch (error) {
        if (!scope.signal.aborted && (error as IApiError)?.status === 401) {
          expiryReported = true;
          deps.onSessionExpired?.(error as IApiError);
        }
        throw error;
      }
    } catch (error) {
      if (scope.signal.aborted && !expiryReported) throw scope.signal.reason;
      if (typeof (error as IApiError)?.status === 'number') throw error;
      throw normalizeApiError({
        status: 0,
        errorCode: 'NETWORK_ERROR',
        message: 'Network error',
      });
    } finally {
      scope.dispose();
    }
  }
  return {
    get: ((path: string, options?: IApiOptions<IResponseType>) =>
      doRequest(path, 'GET', undefined, options)) as IApiRead,
    post: ((path: string, body?: unknown, options?: IApiOptions<IResponseType>) =>
      doRequest(path, 'POST', body, options)) as IApiWrite,
    put: ((path: string, body?: unknown, options?: IApiOptions<IResponseType>) =>
      doRequest(path, 'PUT', body, options)) as IApiWrite,
    patch: ((path: string, body?: unknown, options?: IApiOptions<IResponseType>) =>
      doRequest(path, 'PATCH', body, options)) as IApiWrite,
    delete: ((path: string, options?: IApiOptions<IResponseType>) =>
      doRequest(path, 'DELETE', options?.body, options)) as IApiRead,
  };
}
