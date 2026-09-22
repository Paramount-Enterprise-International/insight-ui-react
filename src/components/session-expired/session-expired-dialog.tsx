import { IDialog, IDialogContainer } from '../dialog/dialog';
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

/** Binds session-expiry state to a non-dismissible Insight dialog and SSO handoff. */
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
    config.errorCatalogResolver,
    config.errorDisplayFormatter
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
    <IDialogContainer
      config={{ width: '380px', disableClose: true, backdropClose: false }}
      aria-label={TITLES[reason ?? 'default']}
      style={{ zIndex: 9999 }}>
      <IDialog
        actions={[
          { type: 'custom', label: 'Log in again', className: 'w-full' },
        ]}
        onCustomAction={onConfirm}>
        <div className="flex flex-col align-center text-center gap-lg">
          <IIcon className="text-warning" icon={iconClass} size="2xl" />
          <h4 className="font-semibold">{TITLES[reason ?? 'default']}</h4>
          <p className="m-0 text-md leading-normal text-subtle">{message}</p>
        </div>
      </IDialog>
    </IDialogContainer>
  );
}
