import type { IInsightAuthConfig } from '../auth/auth-config';
import type { CsrfService } from '../csrf/csrf.service';

/* =========================================================
 * Error normalization (RFC 9457 Problem Details)
 * ========================================================= */

export type IApiError = {
  status?: number;
  message?: string;
  detail?: string;
  retryAfter?: number;
  errorCode?: string;
  [key: string]: unknown;
};

/**
 * Normalize a failed fetch response into a consistent shape:
 * `{ status, detail, retryAfter, ...rest }`. `retryAfter` is read from the
 * body or the `Retry-After` header, so 429/423 responses surface it untouched
 * for rate-limit/lockout UX.
 */
export async function normalizeFetchError(
  res: Response,
  body: unknown,
): Promise<IApiError> {
  const retryAfterHeader = res.headers.get('Retry-After');
  const parsedHeader = retryAfterHeader ? Number(retryAfterHeader) : NaN;

  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const b = body as Record<string, unknown>;
    return {
      ...b,
      status: typeof b.status === 'number' ? b.status : res.status,
      message: typeof b.message === 'string' ? b.message : res.statusText,
      detail:
        (typeof b.detail === 'string' ? b.detail : undefined) ??
        (typeof b.title === 'string' ? b.title : undefined) ??
        res.statusText ??
        'An error occurred',
      retryAfter:
        (typeof b.retryAfter === 'number' ? b.retryAfter : undefined) ??
        (Number.isFinite(parsedHeader) ? parsedHeader : undefined),
    };
  }

  return {
    status: res.status,
    message: res.statusText,
    detail: res.statusText || 'An error occurred',
    retryAfter: Number.isFinite(parsedHeader) ? parsedHeader : undefined,
  };
}

export type IRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** Override the default API base URL. */
  apiUrl?: string;
  params?: Record<string, string | number | boolean | undefined> | URLSearchParams;
};

/**
 * Low-level fetch wrapper (mirrors `@insight/ui` Angular `IApiService`):
 * - `credentials: 'include'` on every request (CSRF cookie + HttpOnly refresh cookie flow)
 * - automatic `X-CSRF-Token` injection
 * - RFC 9457 Problem Details error enrichment (`status` / `detail` / `retryAfter`)
 *
 * Does NOT inject `Authorization` — that is the api client's (consumer) job so
 * auth endpoints (csrf/refresh) never receive a Bearer header.
 */
export async function rawRequest<T = unknown>(
  baseUrl: string,
  path: string,
  csrf: CsrfService | null,
  options: IRequestOptions = {},
): Promise<T> {
  const method = options.method ?? 'GET';
  const url = buildUrl(baseUrl, path, options.params);
  const hasBody = options.body !== undefined;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    // Only send Content-Type when there is a body — a JSON Content-Type with an
    // EMPTY body is rejected by the backend (e.g. DELETE /me/menus/{id}/favorite).
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers ?? {}),
  };

  const csrfToken = csrf?.getToken() ?? null;
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: 'include',
      headers,
      body: options.body !== undefined && method !== 'GET' ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    throw { status: 0, detail: 'Network error', ...(err as object) };
  }

  const text = await res.text().catch(() => '');
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    throw await normalizeFetchError(res, body);
  }

  // 204 No Content / empty body
  if (body === null || body === '') {
    return undefined as T;
  }

  return body as T;
}

/** Build a full URL from base + path + query params. */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined> | URLSearchParams,
): string {
  let url = `${baseUrl}${path}`;
  if (params) {
    const qs =
      params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
          ).toString();
    if (qs) {
      url += `${url.includes('?') ? '&' : '?'}${qs}`;
    }
  }
  return url;
}

/* =========================================================
 * Consumer api client (IApiService + authInterceptor analog)
 * ========================================================= */

export type IApiOptions = {
  /** Override the default API base URL (e.g. to call a different backend service). */
  apiUrl?: string;
  /** Additional headers to merge with the defaults. */
  headers?: Record<string, string>;
  /** Request body (only used by DELETE requests that send a payload). */
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined> | URLSearchParams;
  /**
   * Skip attaching the `Authorization: Bearer` header for this call. The flag
   * also disables the 401 refresh-retry for this request (a bearer-less call
   * cannot be fixed by refreshing the token).
   */
  skipBearer?: boolean;
};

export type IApiClientDeps = {
  config: IInsightAuthConfig;
  csrf: CsrfService;
  session: {
    getAccessToken(): string | null;
    isTokenExpired(): boolean;
    refreshToken(): Promise<string>;
    clearSession(): void;
  };
  /** Called when a refresh fails and the session must be considered expired. */
  onSessionExpired?: (error: IApiError) => void;
};

// Endpoints that must never receive a Bearer header (would be circular / not
// yet authenticated) — CSRF + silent refresh are called before a token exists.
// Per-request opt-out is available via `IApiOptions.skipBearer`.
const AUTH_SKIP_URLS = ['/auth/csrf', '/auth/refresh'];

const isAuthSkipUrl = (url: string): boolean =>
  AUTH_SKIP_URLS.some((skip) => url.includes(skip));

export type IApiClient = {
  get<T = unknown>(path: string, options?: IApiOptions): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, options?: IApiOptions): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, options?: IApiOptions): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, options?: IApiOptions): Promise<T>;
  delete<T = unknown>(path: string, options?: IApiOptions): Promise<T>;
};

/**
 * Consumer-facing HTTP client for @insight/ui apps — the React analog of the
 * Angular `IApiService` + `authInterceptor` combo:
 * - CSRF header + `credentials: 'include'`
 * - `Authorization: Bearer <accessToken>` attached (except /auth/csrf + /auth/refresh)
 * - on 401: single silent refresh (single-flight) + one retry
 * - on refresh failure: `clearSession()` + `onSessionExpired()` + redirect to signin
 * - RFC 9457 Problem Details error enrichment
 */
export function createApiClient(deps: IApiClientDeps): IApiClient {
  const base = deps.config.api.identity;

  async function doRequest<T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: unknown,
    options: IApiOptions = {},
  ): Promise<T> {
    const baseUrl = options.apiUrl ?? base;
    const skipAuth = isAuthSkipUrl(path) || options.skipBearer === true;

    // Attach the application API key (when configured) + Authorization unless
    // explicitly skipped via `skipBearer` or an auth-skip URL.
    const headers = { ...(options.headers ?? {}) };
    if (deps.config.apiKey) {
      headers['Api-Key'] = deps.config.apiKey;
    }
    const token = deps.session.getAccessToken();
    if (!skipAuth && token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      return await rawRequest<T>(baseUrl, path, deps.csrf, {
        method,
        body: method === 'DELETE' && body !== undefined ? body : body,
        headers,
        params: options.params,
      });
    } catch (err) {
      const error = err as IApiError;
      if (skipAuth || error.status !== 401) {
        throw error;
      }

      // 401 → try a silent refresh once, then retry the original request.
      const newToken = await deps.session.refreshToken().catch((refreshErr: unknown) => {
        // Surface the error to the wired `onSessionExpired` handler instead of
        // hard-redirecting here — the consumer app decides the UX (e.g. show a
        // "session expired — login again" dialog before navigating to signin).
        deps.onSessionExpired?.(refreshErr as IApiError);
        throw refreshErr;
      });

      if (!headers['Authorization']) {
        headers['Authorization'] = `Bearer ${newToken}`;
      }
      return rawRequest<T>(baseUrl, path, deps.csrf, { method, body, headers, params: options.params });
    }
  }

  return {
    get: <T>(path: string, options?: IApiOptions) =>
      doRequest<T>(path, 'GET', undefined, options),
    post: <T>(path: string, body?: unknown, options?: IApiOptions) =>
      doRequest<T>(path, 'POST', body, options),
    put: <T>(path: string, body?: unknown, options?: IApiOptions) =>
      doRequest<T>(path, 'PUT', body, options),
    patch: <T>(path: string, body?: unknown, options?: IApiOptions) =>
      doRequest<T>(path, 'PATCH', body, options),
    delete: <T>(path: string, options?: IApiOptions) =>
      doRequest<T>(path, 'DELETE', options?.body, options),
  };
}
