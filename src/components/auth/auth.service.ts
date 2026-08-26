import type { IInsightAuthConfig } from './auth-config';
import { rawRequest, type IApiError } from '../api/api.client';
import type { CsrfService } from '../csrf/csrf.service';

/**
 * Login lockout constants (local, client-side supplement to Keycloak
 * brute-force protection). 5 failed attempts → 1-minute suspend; counter
 * resets after 12h idle or a successful login.
 */
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 1 * 60 * 1000;
const IDLE_RESET_MS = 12 * 60 * 60 * 1000;
const LOCK_STORAGE_KEY = 'iam.mock.login_lockout';

/**
 * Unified login response. When MFA is required, only `mfa*` fields are set and
 * `accessToken` is absent. Once MFA is verified, `accessToken`/`expiresIn`/
 * `user` are populated and `mfaRequired` is false/absent.
 */
export type ILoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: IAuthUser;

  mfaRequired?: boolean;
  mfaStep?: 'CHALLENGE' | 'ENROLL';
  mfaSessionId?: string;
  qrCodeUri?: string;
  secret?: string;

  passwordExpired?: boolean;
  changePasswordToken?: string;
  requiresV2Challenge?: boolean;
};

export type IMfaChallengeResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: IAuthUser;
};

export type IRefreshResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

/** User claims decoded from the access token / returned by the backend. */
export type IAuthUser = {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  userType: 'internal' | 'external';
};

export type IForgotPasswordResponse = {
  message: string;
  token?: string;
  link?: string;
};

export type IValidateResetTokenResponse = {
  valid: boolean;
  reason?: 'invalid' | 'expired' | 'used';
  email?: string;
};

export type IResetPasswordResponse = {
  success: boolean;
  message: string;
  reason?: 'invalid' | 'expired' | 'used' | 'history';
};

/**
 * iam-identity-api auth facade (Mode 2 proxy — Keycloak is never exposed to the
 * frontend). Base URL = `{api.identity}` from the resolved auth config.
 * React analog of the Angular `IAuthService`.
 */
export class AuthService {
  private readonly config: IInsightAuthConfig;
  private readonly csrf: CsrfService;

  constructor(config: IInsightAuthConfig, csrf: CsrfService) {
    this.config = config;
    this.csrf = csrf;
  }

  private get identityUrl(): string {
    return this.config.api.identity;
  }

  async login(
    username: string,
    password: string,
    recaptchaToken?: string,
    isChallengeResponse?: boolean,
  ): Promise<ILoginResponse> {
    const cleanUsername = username.trim().toLowerCase();

    const lockData = this.getLockoutData(cleanUsername);
    if (lockData.lockedUntil && lockData.lockedUntil > Date.now()) {
      const retryAfter = Math.ceil((lockData.lockedUntil - Date.now()) / 1000);
      throw {
        status: 423,
        message: 'Login access is temporarily restricted. Please try again in a few moments.',
        detail: 'Login access is temporarily restricted. Please try again in a few moments.',
        retryAfter,
      } as IApiError;
    }

    try {
      const res = await rawRequest<ILoginResponse>(this.identityUrl, '/auth/login', this.csrf, {
        method: 'POST',
        body: {
          username,
          password,
          recaptchaToken,
          isChallengeResponse: isChallengeResponse ?? false,
        },
      });
      if (res.accessToken || res.mfaRequired || res.passwordExpired) {
        this.resetLockout(cleanUsername);
      }
      return res;
    } catch (err) {
      const error = err as IApiError;
      if (error.status === 401 || error.status === 423) {
        this.recordFailedAttempt(cleanUsername);
      }
      throw error;
    }
  }

  /** Silently refresh the access token via the HttpOnly refresh-token cookie. */
  refresh(): Promise<IRefreshResponse> {
    return rawRequest<IRefreshResponse>(this.identityUrl, '/auth/refresh', this.csrf, {
      method: 'POST',
      body: {},
    });
  }

  /** Clear the server-side session and expire the HttpOnly refresh cookie. */
  async logout(refreshToken?: string): Promise<void> {
    await rawRequest<{ ok: boolean }>(this.identityUrl, '/auth/logout', this.csrf, {
      method: 'POST',
      body: { refreshToken },
    });
  }

  /** Exchange a short-lived `at=` auth token for a full session (cross-app handoff). */
  exchangeAuthToken(authToken: string): Promise<ILoginResponse> {
    return rawRequest<ILoginResponse>(this.identityUrl, '/auth/exchange', this.csrf, {
      method: 'POST',
      body: {},
      headers: { Authorization: authToken },
    });
  }

  /** Verify the MFA TOTP code during a login challenge. */
  verifyMfaChallenge(mfaSessionId: string, totpCode: string): Promise<IMfaChallengeResponse> {
    return rawRequest<IMfaChallengeResponse>(this.identityUrl, '/auth/mfa/verify', this.csrf, {
      method: 'POST',
      body: { mfaSessionId, totpCode },
    });
  }

  /** Verify the TOTP code during first-time MFA enrollment (forced at login). */
  verifyMfaEnroll(mfaSessionId: string, totpCode: string): Promise<IMfaChallengeResponse> {
    return rawRequest<IMfaChallengeResponse>(this.identityUrl, '/auth/mfa/enroll/verify', this.csrf, {
      method: 'POST',
      body: { mfaSessionId, totpCode },
    });
  }

  /** Self-service MFA — check enrollment status (`GET /profile/mfa`). */
  selfServiceGetStatus(): Promise<{ enrolled: boolean; createdAt?: string; lastUsedAt?: string }> {
    return rawRequest<{ enrolled: boolean; createdAt?: string; lastUsedAt?: string }>(
      this.identityUrl,
      '/profile/mfa',
      this.csrf,
      { method: 'GET' },
    );
  }

  /** Self-service MFA — initiate enrollment to get the QR & session id (`POST /profile/mfa/enroll`). */
  selfServiceEnrollInitiate(): Promise<{
    qrCodeUri: string;
    secret: string;
    enrollmentSessionId: string;
  }> {
    return rawRequest<{ qrCodeUri: string; secret: string; enrollmentSessionId: string }>(
      this.identityUrl,
      '/profile/mfa/enroll',
      this.csrf,
      { method: 'POST', body: {} },
    );
  }

  /** Self-service MFA — verify OTP and complete enrollment (`POST /profile/mfa/enroll/verify`). */
  async selfServiceEnrollVerify(enrollmentSessionId: string, totpCode: string): Promise<void> {
    await rawRequest<{ ok: boolean }>(this.identityUrl, '/profile/mfa/enroll/verify', this.csrf, {
      method: 'POST',
      body: { enrollmentSessionId, totpCode },
    });
  }

  /** Self-service reset (un-enroll) MFA for the current user — requires password (`DELETE /profile/mfa`). */
  async selfServiceResetMfa(userSub: string, password: string): Promise<void> {
    await rawRequest<{ ok: boolean }>(this.identityUrl, '/profile/mfa', this.csrf, {
      method: 'DELETE',
      body: { password, userSub },
    });
  }

  /**
   * Change password when it has expired (forced change flow). Uses a short-lived
   * `changePasswordToken` (10 min, scope `change_password_only`) as the Bearer
   * header. Backend returns a full accessToken on success so the user continues
   * seamlessly without re-login.
   */
  changePassword(
    changePasswordToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; expiresIn?: number }> {
    return rawRequest<{ success: boolean; accessToken?: string; refreshToken?: string; expiresIn?: number }>(
      this.identityUrl,
      '/auth/change-password',
      this.csrf,
      {
        method: 'POST',
        body: { newPassword, confirmPassword },
        headers: { Authorization: `Bearer ${changePasswordToken}` },
      },
    );
  }

  /** Request a password-reset link via email or WhatsApp (`POST /auth/forgot-password`). */
  forgotPassword(identifier: string, mode: 'email' | 'whatsapp'): Promise<IForgotPasswordResponse> {
    return rawRequest<IForgotPasswordResponse>(this.identityUrl, '/auth/forgot-password', this.csrf, {
      method: 'POST',
      body: { identifier, method: mode },
    });
  }

  /** Validate a reset token before showing the reset form (`GET /auth/reset-password/validate`). */
  validateResetToken(token: string): Promise<IValidateResetTokenResponse> {
    return rawRequest<IValidateResetTokenResponse>(this.identityUrl, '/auth/reset-password/validate', this.csrf, {
      method: 'GET',
      params: { token },
    });
  }

  /** Submit a new password using the reset token (`POST /auth/reset-password`). */
  resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<IResetPasswordResponse> {
    return rawRequest<IResetPasswordResponse>(this.identityUrl, '/auth/reset-password', this.csrf, {
      method: 'POST',
      body: { token, newPassword, confirmPassword },
    });
  }

  // ─── Login lockout helpers (sessionStorage per-username) ─────────────────────

  private getLockoutData(username: string): {
    attempts: number;
    lockedUntil: number | null;
    lastAttemptAt: number | null;
  } {
    try {
      const raw = sessionStorage.getItem(`${LOCK_STORAGE_KEY}_${username}`);
      const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null, lastAttemptAt: null };
      if (data.lastAttemptAt && Date.now() - data.lastAttemptAt >= IDLE_RESET_MS) {
        return { attempts: 0, lockedUntil: null, lastAttemptAt: null };
      }
      return data;
    } catch {
      return { attempts: 0, lockedUntil: null, lastAttemptAt: null };
    }
  }

  private recordFailedAttempt(username: string): void {
    const data = this.getLockoutData(username);
    data.attempts += 1;
    data.lastAttemptAt = Date.now();
    if (data.attempts >= MAX_LOGIN_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      data.attempts = 0;
    }
    sessionStorage.setItem(`${LOCK_STORAGE_KEY}_${username}`, JSON.stringify(data));
  }

  private resetLockout(username: string): void {
    sessionStorage.removeItem(`${LOCK_STORAGE_KEY}_${username}`);
  }
}
