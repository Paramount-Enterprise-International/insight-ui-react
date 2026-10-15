export type IImpersonationActor = { sub: string };
export type IEndImpersonationResult = { redirectTo?: string };
export type IImpersonationStatus = {
  mode: 'NONE' | 'HAS_ACTIVE_GRANT' | 'IMPERSONATING';
  grantId?: string | null;
  actorName?: string | null;
  subjectName?: string | null;
  occupation?: string | null;
  endDate?: string | null;
  endAt?: string | null;
};

export const IMPERSONATION_INFORMATION =
  'To end only this session (the grant stays active), log out normally from the application. ' +
  'The End Impersonate Session button ends the session and revokes the grant.';
export const IMPERSONATION_CONFIRMATION =
  'End this impersonation session and revoke your impersonation grant? You will be signed out and ' +
  'cannot start another session with this grant.';
export const COUNTDOWN_THRESHOLD_MS = 24 * 60 * 60 * 1000;
export const MAX_TIMER_DELAY_MS = 2_147_483_647;

/** Decodes display claims only; backend authorization remains authoritative. */
export function readImpersonationClaims(
  token: string | null | undefined
): Record<string, unknown> {
  try {
    const segment = token?.split('.')[1];
    if (!segment) return {};
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')),
      (c) => c.charCodeAt(0)
    );
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}
function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
export function readImpersonationActor(
  token: string | null | undefined
): IImpersonationActor | null {
  const sub = text(record(readImpersonationClaims(token)['act'])['sub']);
  return sub ? { sub } : null;
}
export function impersonationContextKey(
  token: string | null | undefined
): string {
  if (!token) return '';
  const claims = readImpersonationClaims(token);
  return JSON.stringify([
    claims['sub'] ?? '',
    record(claims['act'])['sub'] ?? '',
    claims['sid'] ?? '',
    claims['imp_grant_id'] ?? '',
  ]);
}
export function actorDisplayNameFromToken(
  token: string | null | undefined
): string {
  if (!readImpersonationActor(token)) return '-';
  const act = record(readImpersonationClaims(token)['act']);
  return (
    text(act['name']) ??
    text(act['preferred_username']) ??
    text(act['sub']) ??
    '-'
  );
}
export function normalizeImpersonationStatus(
  value: unknown,
  source: 'iam-user' | 'bff'
): IImpersonationStatus {
  const data = record(value);
  if (source === 'bff') {
    const actor = record(data['actor']);
    const grant = record(data['impersonation']);
    return {
      mode:
        text(actor['sub']) && text(grant['grantId']) ? 'IMPERSONATING' : 'NONE',
      actorName: text(actor['name']),
      subjectName: text(record(data['user'])['name']),
      grantId: text(grant['grantId']),
      endAt: text(grant['endAt']),
    };
  }
  return {
    mode:
      data['mode'] === 'IMPERSONATING'
        ? 'IMPERSONATING'
        : data['mode'] === 'HAS_ACTIVE_GRANT'
          ? 'HAS_ACTIVE_GRANT'
          : 'NONE',
    actorName: text(record(data['impersonatingUser'])['fullName']),
    subjectName: text(record(data['impersonatedUser'])['fullName']),
    occupation: text(record(data['impersonatedUser'])['jabatan']),
    grantId: text(data['grantId']),
    endDate: text(data['endDate']),
    endAt: text(data['endAt']),
  };
}
export function resolveGrantEnd(
  endAt?: string | null,
  endDate?: string | null
): number | null {
  for (const value of [
    endAt,
    endDate ? endDate.slice(0, 10) + 'T23:59:59.999+07:00' : null,
  ]) {
    if (!value) continue;
    const time = new Date(value).getTime();
    if (Number.isFinite(time)) return time;
  }
  return null;
}
export function grantEndLabel(status: IImpersonationStatus | null): string {
  let day = status?.endDate?.slice(0, 10);
  if (!day && status?.endAt) {
    const instant = new Date(status.endAt).getTime();
    if (Number.isFinite(instant))
      day = new Date(instant + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }
  if (!day) return '-';
  const date = new Date(day + 'T00:00:00');
  if (!Number.isFinite(date.getTime())) return '-';
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return (
    String(date.getDate()).padStart(2, '0') +
    ' ' +
    months[date.getMonth()] +
    ' ' +
    date.getFullYear()
  );
}
export function formatCountdown(remainingMs: number): string {
  const seconds = Math.max(0, Math.floor(remainingMs / 1000));
  return [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}
export function resolveImpersonationRedirect(
  result: IEndImpersonationResult | null | undefined,
  identity: string,
  signinUrl: string
): string {
  try {
    if (result?.redirectTo) {
      const host = new URL(identity, window.location.origin);
      const target = new URL(result.redirectTo, host.origin);
      if (
        ['http:', 'https:'].includes(target.protocol) &&
        target.origin === host.origin &&
        !target.username &&
        !target.password
      )
        return target.href;
    }
  } catch {
    /* Use the configured sign-in destination. */
  }
  return signinUrl;
}
export function isImpersonationCsrfError(error: unknown): boolean {
  const data = record(error);
  const body = record(data['error']);
  const code =
    text(data['errorCode']) ??
    text(data['code']) ??
    text(body['errorCode']) ??
    text(body['code']);
  const message =
    text(data['message']) ??
    text(body['message']) ??
    text(data['detail']) ??
    '';
  return (
    data['status'] === 403 &&
    ((code?.toUpperCase().includes('CSRF') ?? false) || /csrf/i.test(message))
  );
}
