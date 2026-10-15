import { useEffect, useRef, useState } from 'react';
import { resolveApiErrorDisplayMessage } from '../api/api-error';
import {
  useIAuthContext,
  useIImpersonation,
  useISession,
  useIUserMenuStore,
} from '../auth/insight-auth-context';
import { IButton } from '../button/button';
import { useIAlert, useIConfirm } from '../dialog/dialog';
import {
  actorDisplayNameFromToken,
  COUNTDOWN_THRESHOLD_MS,
  formatCountdown,
  grantEndLabel,
  IMPERSONATION_CONFIRMATION,
  IMPERSONATION_INFORMATION,
  impersonationContextKey,
  MAX_TIMER_DELAY_MS,
  resolveGrantEnd,
  resolveImpersonationRedirect,
} from './impersonation-utils';

export function IHImpersonationBanner() {
  const { config } = useIAuthContext();
  const session = useISession();
  const state = useIImpersonation();
  const store = useIUserMenuStore();
  const alerts = useIAlert();
  const confirm = useIConfirm();
  const context = impersonationContextKey(session.getAccessToken());
  const status = state.status;
  const visible =
    session.isImpersonating() && (!status || status.mode === 'IMPERSONATING');
  const [ending, setEnding] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<string | null>(null);
  const active = useRef(false);
  const pending = useRef(false);
  const infoPending = useRef(false);
  const currentContext = useRef(context);
  currentContext.current = context;
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    pending.current = false;
    setConfirming(false);
    setEnding(false);
    setError('');
    if (session.isImpersonating())
      void state.loadStatus().catch(() => {
        /* Keep token fallback. */
      });
  }, [context, session, state]);
  useEffect(() => {
    const end = resolveGrantEnd(status?.endAt, status?.endDate);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      if (end === null || !visible) {
        setCountdown(null);
        return;
      }
      const remaining = Math.max(0, end - Date.now());
      setCountdown(
        remaining < COUNTDOWN_THRESHOLD_MS ? formatCountdown(remaining) : null
      );
      if (remaining > 0)
        timer = setTimeout(
          tick,
          remaining >= COUNTDOWN_THRESHOLD_MS
            ? Math.min(
                remaining - COUNTDOWN_THRESHOLD_MS + 1,
                MAX_TIMER_DELAY_MS
              )
            : Math.min(1000, remaining)
        );
    };
    tick();
    return () => clearTimeout(timer);
  }, [status?.endAt, status?.endDate, visible]);
  if (!visible) return null;
  const occupation = status?.occupation || store.rawCurrentUser?.occupationName;
  const onInfo = async () => {
    if (infoPending.current) return;
    infoPending.current = true;
    try {
      await alerts.information(
        'About Impersonation Sessions',
        config.impersonation?.informationText ?? IMPERSONATION_INFORMATION
      );
    } finally {
      infoPending.current = false;
    }
  };
  const onEnd = async () => {
    if (pending.current) return;
    pending.current = true;
    setConfirming(true);
    const key = context;
    try {
      const confirmed = await confirm.danger(
        'End Impersonate Session',
        IMPERSONATION_CONFIRMATION
      );
      if (!active.current || key !== currentContext.current || !confirmed)
        return;
      setConfirming(false);
      setEnding(true);
      setError('');
      const result = await session.endImpersonation();
      if (active.current && !session.getAccessToken())
        window.location.assign(
          resolveImpersonationRedirect(
            result,
            config.api.identity,
            config.signinUrl
          )
        );
    } catch (error) {
      if (active.current && key === currentContext.current)
        setError(
          resolveApiErrorDisplayMessage(
            error,
            'Failed to end the impersonation session. Please try again.',
            config.errorCatalogResolver,
            config.errorDisplayFormatter
          )
        );
    } finally {
      if (key === currentContext.current) {
        pending.current = false;
        if (active.current) {
          setConfirming(false);
          setEnding(false);
        }
      }
    }
  };
  return (
    <div className="ih-impersonation-banner">
      <section
        className="i-banner i-banner-warning px-lg py-sm"
        aria-label="Impersonation session"
        data-testid="impersonation-banner">
        <div className="flex flex-wrap align-center gap-sm">
          <div className="i-banner-details flex flex-wrap align-center gap-sm flex-fill text-md">
            <span>
              <strong>Signed In As:&nbsp;</strong>
              <span data-testid="banner-actor">
                {status?.actorName ||
                  actorDisplayNameFromToken(session.getAccessToken())}
              </span>
            </span>
            <span>
              <strong>Acting As:&nbsp;</strong>
              <span data-testid="banner-subject">
                {status?.subjectName || session.getUser()?.name || '-'}
                {occupation ? ' (' + occupation + ')' : ''}
              </span>
            </span>
            <span>
              <strong>Grant ends:&nbsp;</strong>
              <span data-testid="banner-end-date">{grantEndLabel(status)}</span>
            </span>
            {countdown !== null && (
              <span role="timer" aria-live="off">
                <strong>Time remaining:&nbsp;</strong>
                <span data-testid="banner-countdown">{countdown}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap align-center gap-sm shrink-0">
            <IButton
              icon="fa-solid fa-info"
              size="sm"
              aria-label="About impersonation sessions"
              data-testid="impersonation-info"
              disabled={ending || confirming}
              onClick={() => {
                void onInfo();
              }}
            />
            <IButton
              variant="danger"
              icon="fa-solid fa-right-from-bracket"
              size="sm"
              data-testid="end-impersonation"
              disabled={ending || confirming}
              loading={ending}
              onClick={() => {
                void onEnd();
              }}>
              End Impersonate Session
            </IButton>
          </div>
        </div>
        {error && (
          <p className="mt-sm text-red-900 leading-snug" role="alert">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
