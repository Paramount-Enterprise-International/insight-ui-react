export type SessionExpiredReason = 'TOKEN_EXPIRED' | 'SESSION_REVOKED' | 'SESSION_REPLACED';

/** Minimal structural shape for error-code extraction (normalized or raw errors). */
type SessionErrorShape = {
  errorCode?: string;
  code?: string;
  error?: { errorCode?: string; code?: string };
};

const valueAt = (value: unknown, key: 'errorCode' | 'code'): string | undefined => {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === 'string' && candidate.length > 0 ? candidate : undefined;
};

/** Supports normalized Problem Details errors and raw legacy HTTP error bodies. */
export const extractProblemDetailsErrorCode = (error: unknown): string | undefined => {
  if (error === null || error === undefined) {
    return undefined;
  }
  const problem = error as Partial<SessionErrorShape>;
  return (
    problem.errorCode ??
    problem.code ??
    valueAt((error as { error?: unknown })?.error, 'errorCode') ??
    valueAt((error as { error?: unknown })?.error, 'code')
  );
};

/** Maps current backend and legacy error codes to the session-expired UI states. */
export const toSessionExpiredReason = (
  errorCode: string | undefined,
): SessionExpiredReason | undefined => {
  switch (errorCode) {
    case 'AUTH_TOKEN_EXPIRED':
    case 'TOKEN_EXPIRED':
    case 'AUTH_NO_SESSION':
      return 'TOKEN_EXPIRED';
    case 'AUTH_SESSION_REVOKED':
    case 'SESSION_REVOKED':
      return 'SESSION_REVOKED';
    case 'AUTH_SESSION_REPLACED':
    case 'SESSION_REPLACED':
      return 'SESSION_REPLACED';
    default:
      return undefined;
  }
};

/**
 * True when an error is semantically a session-expiry event (HTTP 401/498 or a
 * recognized session-related error code). Other statuses are business/transport
 * errors and must be handled by the caller instead of forcing a logout.
 */
export const isSessionExpiredError = (error: unknown): boolean => {
  const status = (error as { status?: number } | null)?.status;
  if (status === 401 || status === 498) {
    return true;
  }
  return toSessionExpiredReason(extractProblemDetailsErrorCode(error)) !== undefined;
};

/**
 * In-memory overlay state for the session-expired UI.
 *
 * Besides the derived `reason`, the service also exposes the RAW backend error
 * code and Problem Details `detail` so consumer apps (e.g. iam-web) can resolve
 * a localized display message from their own error-catalog service without the
 * library ever calling the configuration API.
 *
 * This is a tiny observable store — subscribe + getVersion so `useSyncExternalStore`
 * re-renders consumers when the overlay state changes.
 */
export class SessionExpiredService {
  private visibleValue = false;
  private returnUrlValue = '/';
  private reasonValue: SessionExpiredReason | undefined = undefined;
  private errorCodeValue: string | null = null;
  private detailValue: string | null = null;

  private version = 0;
  private listeners = new Set<() => void>();

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

  get visible(): boolean {
    return this.visibleValue;
  }

  get returnUrl(): string {
    return this.returnUrlValue;
  }

  get reason(): SessionExpiredReason | undefined {
    return this.reasonValue;
  }

  get errorCode(): string | null {
    return this.errorCodeValue;
  }

  get detail(): string | null {
    return this.detailValue;
  }

  show(
    returnUrl: string,
    reason?: SessionExpiredReason,
    errorCode?: string | null,
    detail?: string | null,
  ): void {
    this.returnUrlValue = returnUrl || '/';
    this.reasonValue = reason;
    this.errorCodeValue = errorCode ?? null;
    this.detailValue = detail ?? null;
    this.visibleValue = true;
    this.notify();
  }

  hide(): void {
    this.visibleValue = false;
    this.notify();
  }
}

export const sessionExpiredService = new SessionExpiredService();
