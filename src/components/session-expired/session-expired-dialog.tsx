import type { CSSProperties } from 'react';

import { useInsightAuth, useSessionExpired } from '../auth/insight-auth-context';
import { buildExternalSigninUrl } from '../auth/build-signin-redirect-url';
import { resolveApiErrorDisplayMessage } from '../api/api-error';
import type { SessionExpiredReason } from './session-expired.service';

const TITLES: Record<SessionExpiredReason | 'default', string> = {
  SESSION_REPLACED: 'Signed Out Remotely',
  SESSION_REVOKED: 'Session Ended',
  TOKEN_EXPIRED: 'Session Expired',
  default: 'Session Expired',
};

const MESSAGES: Record<SessionExpiredReason | 'default', string> = {
  TOKEN_EXPIRED: 'Your session has expired. Please log in again to continue.',
  SESSION_REVOKED: 'Your session has been ended. Please log in again.',
  SESSION_REPLACED:
    'Your session was ended because you signed in from another device or your concurrent session access was revoked. Please log in again.',
  default: 'Your session is no longer valid. Please log in again.',
};

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
};

const cardStyle: CSSProperties = {
  background: '#ffffff',
  borderRadius: 8,
  padding: 32,
  maxWidth: 380,
  width: 'calc(100% - 32px)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

const iconStyle: CSSProperties = {
  fontSize: 48,
  color: '#f59e0b',
  marginBottom: 16,
};

const titleStyle: CSSProperties = {
  margin: '0 0 8px',
  fontSize: 22,
  fontWeight: 600,
  color: '#1f2937',
};

const messageStyle: CSSProperties = {
  margin: '0 0 24px',
  fontSize: 14,
  lineHeight: 1.5,
  color: '#6b7280',
};

const actionStyle: CSSProperties = {
  border: 'none',
  borderRadius: 6,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  background: '#2563eb',
  color: '#ffffff',
};

/**
 * Library-provided session-expired overlay for React consumer apps. Render it
 * once near the app root (inside `<InsightAuthProvider>`, mirroring
 * `<IDialogOutlet />`):
 *
 * ```tsx
 * <SessionExpiredDialog />
 * ```
 *
 * It reads its state from the shared `SessionExpiredService` (shown by the api
 * client's `onSessionExpired` when a refresh fails and `unauthorizedHandling`
 * is `'dialog'`) and, on "Log in again", performs a full-page redirect to
 * iam-web's signin via `buildExternalSigninUrl`, then hides itself. It cannot
 * be dismissed by clicking the backdrop.
 */
export function SessionExpiredDialog() {
  const sessionExpired = useSessionExpired();
  const { config } = useInsightAuth();

  if (!sessionExpired.visible) {
    return null;
  }

  const reason = sessionExpired.reason;
  const message = resolveApiErrorDisplayMessage(
    sessionExpired.apiError ?? {
      errorCode: sessionExpired.errorCode ?? undefined,
      message: sessionExpired.message ?? undefined,
      detail: sessionExpired.detail ?? undefined,
    },
    MESSAGES[reason ?? 'default'],
    config.errorCatalogResolver,
  );
  const iconClass =
    reason === 'SESSION_REPLACED'
      ? 'fa-solid fa-right-from-bracket'
      : 'fa-solid fa-clock';

  const onConfirm = () => {
    const returnUrl = sessionExpired.returnUrl;
    sessionExpired.hide();
    window.location.href = buildExternalSigninUrl(config, returnUrl);
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>
          <i className={iconClass}></i>
        </div>
        <h1 style={titleStyle}>{TITLES[reason ?? 'default']}</h1>
        <p style={messageStyle}>{message}</p>
        <button type="button" style={actionStyle} onClick={onConfirm}>
          Log in again
        </button>
      </div>
    </div>
  );
}
