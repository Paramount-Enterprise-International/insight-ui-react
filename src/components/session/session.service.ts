import type { IInsightAuthConfig } from '../auth/auth-config';
import { AuthService, type IAuthUser } from '../auth/auth.service';
import type { CsrfService } from '../csrf/csrf.service';
import {
  extractProblemDetailsErrorCode,
  isSessionExpiredError,
  type SessionExpiredReason,
  SessionExpiredService,
  toSessionExpiredReason,
} from '../session-expired/session-expired.service';
import { normalizeApiError } from '../api/api-error';

/** User derived from Keycloak JWT claims. */
export type ISessionUser = {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  userType: 'internal' | 'external';
};

/**
 * Minimal inline JWT payload decode — deliberately NOT using a JWT library to
 * avoid forcing a new dependency onto every @insight/ui consumer. Returns
 * `null` on any decode failure.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Decodes an `IAuthUser` from the token's Keycloak claims. */
export function decodeUser(accessToken: string): IAuthUser {
  const decoded = decodeJwtPayload(accessToken);
  const realmAccess = decoded?.['realm_access'] as { roles?: unknown } | undefined;
  const roles = Array.isArray(realmAccess?.roles) ? (realmAccess.roles as string[]) : [];
  return {
    sub: typeof decoded?.['sub'] === 'string' ? (decoded['sub'] as string) : '',
    email: typeof decoded?.['email'] === 'string' ? (decoded['email'] as string) : '',
    name: typeof decoded?.['name'] === 'string' ? (decoded['name'] as string) : '',
    roles,
    userType: decoded?.['user_type'] === 'external' ? 'external' : 'internal',
  };
}

/**
 * Session management for @insight/ui consumer apps (React analog of the
 * Angular `ISessionService`).
 *
 * Access token: stored IN MEMORY only (never Web Storage). Refresh token:
 * HttpOnly cookie managed exclusively by iam-identity-api; this service never
 * reads or stores it directly (an in-memory `refreshToken` is kept only for
 * server-side logout).
 *
 * This is a tiny observable store — `subscribe` + `getVersion` so
 * `useSyncExternalStore` re-renders consumers when the session state changes.
 */
/**
 * Session management for @insight/ui consumer apps (React analog of the
 * Angular `ISessionService`).
 *
 * Access token: stored IN MEMORY only (never Web Storage). Refresh token:
 * HttpOnly cookie managed exclusively by iam-identity-api; this service never
 * reads or stores it directly (an in-memory `refreshToken` is kept only for
 * server-side logout).
 *
 * This is a tiny observable store — `subscribe` + `getVersion` so
 * `useSyncExternalStore` re-renders consumers when the session state changes.
 */
export class SessionService {
  private readonly config: IInsightAuthConfig;
  private readonly authService: AuthService;
  private readonly csrf: CsrfService;
  private readonly sessionExpiredService: SessionExpiredService;

  // In-memory token storage — intentionally NOT persisted to Web Storage.
  private accessToken: string | null = null;
  private _refreshToken: string | null = null;
  private expiresAt: number | null = null;
  private sessionStartedAt: number | null = null;
  private currentUser: ISessionUser | null = null;
  private passwordExpired = false;
  private changePasswordTokenValue: string | null = null;
  private lastVerifiedAt = 0;

  private initializingValue = true;

  private refreshInFlight: Promise<string> | null = null;
  private restoreInFlight: Promise<{ reason?: SessionExpiredReason }> | null = null;

  private version = 0;
  private listeners = new Set<() => void>();

  constructor(
    config: IInsightAuthConfig,
    authService: AuthService,
    csrf: CsrfService,
    sessionExpiredService: SessionExpiredService,
  ) {
    this.config = config;
    this.authService = authService;
    this.csrf = csrf;
    this.sessionExpiredService = sessionExpiredService;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = (): number => this.version;

  private notify(): void {
    this.version++;
    this.listeners.forEach((listener) => listener());
  }

  /**
   * True while the app is restoring/validating the session on load (starts
   * `true` on cold start so guards can allow navigation during the restore and
   * consumer apps can show a loading state). Cleared once the session is
   * established (`setAccessToken`/`setSession`) or `tryRestoreSession()` settles.
   */
  get initializing(): boolean {
    return this.initializingValue;
  }

  isAuth(): boolean {
    return !!this.accessToken && !this.isTokenExpired() && !this.isSsoSessionExpired();
  }

  isTokenExpired(): boolean {
    if (!this.accessToken || this.expiresAt === null) {
      return true;
    }
    return Date.now() >= this.expiresAt;
  }

  /**
   * Whether the max SSO session duration has been exceeded (default 15h,
   * configured via `tokenLifespan.ssoSessionMaxSeconds`). After this, the
   * user must re-authenticate regardless of token state.
   */
  isSsoSessionExpired(): boolean {
    if (this.sessionStartedAt === null) {
      return false;
    }
    const maxDurationMs = this.config.tokenLifespan.ssoSessionMaxSeconds * 1000;
    return Date.now() - this.sessionStartedAt >= maxDurationMs;
  }

  isPasswordExpired(): boolean {
    return this.passwordExpired;
  }

  clearPasswordExpired(): void {
    this.passwordExpired = false;
  }

  setPasswordExpired(): void {
    this.passwordExpired = true;
  }

  setChangePasswordToken(token: string): void {
    this.changePasswordTokenValue = token;
    sessionStorage.setItem('iam.changePasswordToken', token);
  }

  getChangePasswordToken(): string | null {
    if (this.changePasswordTokenValue) {
      return this.changePasswordTokenValue;
    }
    const stored = sessionStorage.getItem('iam.changePasswordToken');
    if (stored) {
      this.changePasswordTokenValue = stored;
      return stored;
    }
    return null;
  }

  clearChangePasswordToken(): void {
    this.changePasswordTokenValue = null;
    sessionStorage.removeItem('iam.changePasswordToken');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this._refreshToken;
  }

  getUser(): ISessionUser | null {
    return this.currentUser;
  }

  /** Role-membership check against the decoded token roles (ANY match). */
  hasMn(mn: string | string[]): boolean {
    const roles = this.getRoles();
    if (Array.isArray(mn)) {
      return mn.some((m) => roles.includes(m));
    }
    return roles.includes(mn);
  }

  /**
   * Roles claimed by the current access token (Keycloak `realm_access.roles`).
   * Returns an empty array while no token is set. Used by role-mode permission
   * checks.
   */
  getRoles(): string[] {
    if (!this.accessToken) {
      return [];
    }
    const decoded = decodeJwtPayload(this.accessToken) as
      | { realm_access?: { roles?: unknown } }
      | null;
    const roles = decoded?.realm_access?.roles;
    return Array.isArray(roles) ? roles.filter((role): role is string => typeof role === 'string') : [];
  }

  /** True if the current access token claims ANY of the given roles. */
  hasRole(code: string | string[]): boolean {
    const roles = this.getRoles();
    if (Array.isArray(code)) {
      return code.some((role) => roles.includes(role));
    }
    return roles.includes(code);
  }

  /**
   * Store the access token received from the SSO handoff (URL hash fragment)
   * or from a refresh response. `expiresIn` (seconds) defaults to the token's
   * own `exp` claim, then falls back to the configured `accessTokenSeconds`.
   */
  setAccessToken(accessToken: string, expiresIn?: number): void {
    this.accessToken = accessToken;
    const effectiveExpiresIn =
      expiresIn ?? this.readExpiresInFromToken(accessToken) ?? this.config.tokenLifespan.accessTokenSeconds;
    // 30-second buffer to avoid edge cases, matches iam-web's convention.
    this.expiresAt = Date.now() + (effectiveExpiresIn - 30) * 1000;
    if (this.sessionStartedAt === null) {
      this.sessionStartedAt = Date.now();
    }
    this.initializingValue = false;
    this.notify();
  }

  /**
   * Full session establishment (login / MFA / exchange / refresh). Sets the
   * user, decodes password-expiry claims, stamps the last-verified time, and
   * marks an active session so `tryRestoreSession()` can distinguish a cold
   * start from a refresh-after-revocation.
   */
  setSession(accessToken: string, expiresIn: number, user: IAuthUser, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (refreshToken) {
      this._refreshToken = refreshToken;
    }
    this.expiresAt = Date.now() + (expiresIn - 30) * 1000;
    this.currentUser = user;
    this.sessionStartedAt = Date.now();
    const decoded = decodeJwtPayload(accessToken);
    const neverExpired = decoded?.['never_expired'] === true;
    const pwdExpired = decoded?.['pwd_expired'] === true;
    this.passwordExpired = !neverExpired && pwdExpired;
    sessionStorage.setItem('iam.session.active', 'true');
    this.lastVerifiedAt = Date.now();
    this.initializingValue = false;
    this.notify();
  }

  clearSession(): void {
    this.accessToken = null;
    this._refreshToken = null;
    this.expiresAt = null;
    this.currentUser = null;
    this.passwordExpired = false;
    this.sessionStartedAt = null;
    this.changePasswordTokenValue = null;
    sessionStorage.removeItem('iam.changePasswordToken');
    // NOTE: `iam.session.active` is intentionally NOT cleared here — it must
    // survive mid-session revocation so `tryRestoreSession()` can detect
    // "refresh after revocation" on the next load; explicit logout clears it.
    this.notify();
  }

  /**
   * Clears the client-side session AND invalidates the server-side session by
   * revoking the refresh token. Resolves after the server logout call finishes
   * (or fails — failures are swallowed so the user is never stuck on a logout
   * page).
   */
  async logout(): Promise<void> {
    const refreshToken = this._refreshToken ?? undefined;
    this.clearSession();
    // Explicit logout also clears the "active session" flag so a later
    // tryRestoreSession() treats the next load as a cold start.
    sessionStorage.removeItem('iam.session.active');
    try {
      // Ensure a valid CSRF token first: the backend CsrfGuard requires
      // X-CSRF-Token on POST /auth/logout.
      await this.csrf.ensureToken();
    } catch {
      // best-effort: still attempt the logout
    }
    try {
      await this.authService.logout(refreshToken);
    } catch {
      // failures are swallowed so the user is never stuck on a logout page
    }
  }

  /**
   * Silently refresh the access token via the HttpOnly refresh cookie
   * (`POST {api.identity}/auth/refresh`, `credentials: 'include'`).
   * Single-flight: concurrent callers share the in-flight refresh.
   */
  refreshToken(): Promise<string> {
    if (this.refreshInFlight) {
      return this.refreshInFlight;
    }

    const inFlight = this.authService
      .refresh()
      .then((res) => {
        this.setSession(
          res.accessToken,
          res.expiresIn,
          this.currentUser ?? decodeUser(res.accessToken),
          res.refreshToken,
        );
        return res.accessToken;
      })
      .catch((err) => {
        console.warn('[@insight/ui][SESSION] silent refresh failed', {
          status: (err as { status?: number })?.status,
          errorCode: extractProblemDetailsErrorCode(err),
        });
        throw err;
      })
      .finally(() => {
        this.refreshInFlight = null;
      });

    this.refreshInFlight = inFlight;
    return inFlight;
  }

  /** True if the session was verified against the backend within `cooldownMs` (default 30s). */
  isRecentlyVerified(cooldownMs = 30_000): boolean {
    return !!this.accessToken && Date.now() - this.lastVerifiedAt < cooldownMs;
  }

  /**
   * Proactive session validation for guards. Refreshes the token to check
   * session validity WITHOUT resetting the SSO session timer. Skips the refresh
   * if the last check was within 30 seconds.
   */
  async proactiveValidate(): Promise<string> {
    if (this.isRecentlyVerified()) {
      return this.accessToken!;
    }
    const savedStartedAt = this.sessionStartedAt;
    const token = await this.refreshToken();
    this.sessionStartedAt = savedStartedAt;
    return token;
  }

  /**
   * Cold-start session restore from the HttpOnly cookie (called on app load).
   * Skips non-signin auth sub-pages (forgot/reset password, MFA, callback).
   * The signin page ALWAYS attempts the silent refresh. Shows the
   * session-expired overlay when refreshing after a previously-active session.
   * Returns the reason (if any) extracted from the error so the guard can
   * decide overlay vs. signin.
   */
  tryRestoreSession(): Promise<{ reason?: SessionExpiredReason }> {
    if (this.restoreInFlight) {
      return this.restoreInFlight;
    }

    const pathname = window.location.pathname ?? '';
    const isSigninPage = /^\/auth\/signin$|^\/signin$/i.test(pathname);
    const isOtherAuthPage =
      /^\/auth(\/|$)|^\/forgot-password|^\/reset-password/i.test(pathname) && !isSigninPage;

    if (isOtherAuthPage) {
      this.initializingValue = false;
      return Promise.resolve({});
    }

    const restorePromise = this.authService
      .refresh()
      .then((res) => {
        this.setSession(res.accessToken, res.expiresIn, decodeUser(res.accessToken), res.refreshToken);
        return {} as { reason?: SessionExpiredReason };
      })
      .catch((err): { reason?: SessionExpiredReason } => {
        console.debug('[@insight/ui][SESSION] tryRestoreSession: FAILED', {
          status: (err as { status?: number })?.status,
        });
        const rawErrorCode = extractProblemDetailsErrorCode(err);
        const code = toSessionExpiredReason(rawErrorCode);
        const wasActive = sessionStorage.getItem('iam.session.active') === 'true';
        const isAuthPage = /^\/auth(\/|$)|^\/signin$|^\/logout$/i.test(pathname);
        if (wasActive && !isAuthPage && isSessionExpiredError(err)) {
          const apiError = normalizeApiError(err);
          this.sessionExpiredService.show(
            pathname,
            code ?? 'TOKEN_EXPIRED',
            rawErrorCode,
            apiError.detail,
            apiError.message,
            apiError,
          );
        }
        if (isSessionExpiredError(err)) {
          this.authService.logout().catch(() => void 0);
        }
        return { reason: code };
      });

    const safetyTimer = new Promise<{ reason?: SessionExpiredReason }>((resolve) =>
      setTimeout(() => resolve({}), 10_000),
    );

    this.restoreInFlight = Promise.race([restorePromise, safetyTimer]).finally(() => {
      this.initializingValue = false;
      this.notify();
    });
    return this.restoreInFlight;
  }

  private readExpiresInFromToken(token: string): number | null {
    const decoded = decodeJwtPayload(token);
    if (!decoded || typeof decoded['exp'] !== 'number') {
      return null;
    }
    return Math.max(0, (decoded['exp'] as number) - Math.floor(Date.now() / 1000));
  }
}
