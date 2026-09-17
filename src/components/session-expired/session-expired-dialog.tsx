import type { CSSProperties } from 'react';
import { IButton } from '../button/button';
import { IIcon } from '../icon/icon';

import { resolveApiErrorDisplayMessage } from '../api/api-error';
import { buildExternalSigninUrl } from '../auth/build-signin-redirect-url';
import {
  useIAuthContext,
  useISessionExpired,
} from '../auth/insight-auth-context';
import type { ISessionExpiredReason } from './session-expired';

const TITLES: Record<ISessionExpiredReason | 'default', string> = {
  SESSION_REPLACED: 'Signed Out Remotely',
  SESSION_REVOKED: 'Session Ended',
  TOKEN_EXPIRED: 'Session Expired',
  default: 'Session Expired',
};

const MESSAGES: Record<ISessionExpiredReason | 'default', string> = {
  TOKEN_EXPIRED: 'Your session has expired. Please log in again to continue.',
  SESSION_REVOKED: 'Your session has been ended. Please log in again.',
  SESSION_REPLACED:
    'Your session was ended because you signed in from another device or your concurrent session access was revoked. Please log in again.',
  default: 'Your session is no longer valid. Please log in again.',
};

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
};

const cardStyle: CSSProperties = {
  maxWidth: 380,
  width: 'calc(100% - 32px)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
};

/**
 * Library-provided session-expired overlay for React consumer apps. Render it
 * once near the app root (inside `<IAuthProvider>`, mirroring
 * `<IDialogOutlet />`):
 *
 * ```tsx
 * <ISessionExpiredDialog />
 * ```
 *
 * It reads its state from the shared `ISessionExpiredService` (shown by the api
 * client's `onSessionExpired` when a refresh fails and `unauthorizedHandling`
 * is `'dialog'`) and, on "Log in again", performs a full-page redirect to
 * the configured signinUrl via `buildExternalSigninUrl`, then hides itself. It cannot
 * be dismissed by clicking the backdrop.
 */
export function ISessionExpiredDialog() {
  const sessionExpired = useISessionExpired();
  const { config } = useIAuthContext();

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
    config.errorCatalogResolver
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
    <div className="flex align-center justify-center" style={overlayStyle}>
      <div className="bg-white radius-md p-3xl text-center" style={cardStyle}>
        <div className="text-warning mb-lg">
          <IIcon icon={iconClass} size="4xl" />
        </div>
        <h1 className="m-0 mb-xs text-2xl font-semibold text-gray-800">
          {TITLES[reason ?? 'default']}
        </h1>
        <p className="m-0 mb-2xl text-md leading-normal text-subtle">
          {message}
        </p>
        <IButton type="button" onClick={onConfirm}>
          Log in again
        </IButton>
      </div>
    </div>
  );
}
