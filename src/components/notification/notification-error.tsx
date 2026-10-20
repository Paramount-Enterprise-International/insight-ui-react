import { IButton } from '../button';
import { IIcon } from '../icon';

export function NotificationError({
  message,
  title,
  retryLoading = false,
  retryDisabled = false,
  onRetry,
}: {
  message?: string | null;
  title?: string;
  retryLoading?: boolean;
  retryDisabled?: boolean;
  onRetry?: () => void;
}) {
  return message ? (
    <i-notification-error>
      <div
        className="flex flex-col align-center justify-center gap-xs px-md py-lg text-center text-subtle"
        role="alert">
        <IIcon
          icon="fa-solid fa-circle-exclamation"
          size="lg"
          aria-hidden="true"
        />
        {title && <p className="m-0">{title}</p>}
        <p className="m-0 text-sm text-danger">{message}</p>
        <IButton
          type="button"
          variant="primary"
          icon="sync"
          size="sm"
          disabled={retryDisabled}
          loading={retryLoading}
          onClick={() => !retryLoading && !retryDisabled && onRetry?.()}>
          Retry
        </IButton>
      </div>
    </i-notification-error>
  ) : null;
}
