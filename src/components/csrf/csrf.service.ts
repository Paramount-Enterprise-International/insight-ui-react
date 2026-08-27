import type { IInsightAuthConfig } from '../auth/auth-config';

/**
 * CSRF token management — cookie-to-header pattern for @insight/ui consumer apps.
 * Mirrors `@insight/ui`'s Angular `ICsrfService`:
 *
 *   1. FE calls GET {api.identity}/auth/csrf.
 *   2. Backend returns `{ csrfToken }` in the JSON body AND sets a `csrf_token` cookie.
 *   3. FE stores the token in memory (JS cannot read cross-origin cookies).
 *   4. FE sends the token back as `X-CSRF-Token` header on mutating requests.
 *   5. Backend validates: header value === cookie value.
 *
 * Token expiration mirrors the backend cookie maxAge (minus a safety buffer,
 * configured via `csrfTokenMaxAgeSeconds`) so the FE transparently re-fetches
 * before the server-side cookie actually expires.
 */
export class CsrfService {
  private readonly config: IInsightAuthConfig;

  /** In-memory CSRF token — retrieved from the backend response body, never from document.cookie directly. */
  private token: string | null = null;
  private tokenFetchedAt: number | null = null;

  constructor(config: IInsightAuthConfig) {
    this.config = config;
  }

  /**
   * Return the in-memory CSRF token, or `null` if never fetched or expired
   * (expiry triggers callers to re-invoke `ensureToken()`).
   */
  getToken(): string | null {
    if (this.token && this.isTokenExpired()) {
      return null;
    }
    return this.token;
  }

  /** Whether the in-memory token has exceeded its TTL (`csrfTokenMaxAgeSeconds`). */
  isTokenExpired(): boolean {
    if (this.tokenFetchedAt === null) {
      return false;
    }
    const maxAgeMs = (this.config.csrfTokenMaxAgeSeconds ?? 7170) * 1000;
    return Date.now() - this.tokenFetchedAt >= maxAgeMs;
  }

  /**
   * Fetch a fresh CSRF token from `iam-identity-api` and store it in memory.
   * On failure the error is propagated — a failed fetch must not be silently
   * swallowed.
   */
  async ensureToken(): Promise<void> {
    const res = await fetch(`${this.config.api.identity}/auth/csrf`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`CSRF fetch failed (${res.status})`);
    }
    const body = (await res.json().catch(() => null)) as { csrfToken?: string } | null;
    this.token = body?.csrfToken ?? null;
    this.tokenFetchedAt = Date.now();
  }
}
