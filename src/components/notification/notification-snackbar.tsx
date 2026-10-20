import { IButton } from '../button';
import { IIcon } from '../icon';
import type { INotificationSnackbarMessage } from './notification.types';

export type INotificationSnackbarProps = {
  message: INotificationSnackbarMessage;
  onDismissRequested?: () => void;
  onOpenRequested?: () => void;
};

export function INotificationSnackbar({
  message,
  onDismissRequested,
  onOpenRequested,
}: INotificationSnackbarProps) {
  return (
    <i-notification-snackbar>
      <div
        className="notification-snackbar flex align-center gap-md p-lg radius-md"
        role="status"
        aria-live="polite">
        <IIcon
          icon={message.item?.icon ?? 'fa-solid fa-bell'}
          aria-hidden="true"
        />
        {message.item ? (
          <button
            type="button"
            className="snackbar-content text-left border-none bg-transparent p-0 min-w-0 flex-fill"
            onClick={onOpenRequested}>
            <span className="block font-semibold">{message.moduleName}</span>
            <span>{message.title}</span>
          </button>
        ) : (
          <span className="flex-fill">{message.title}</span>
        )}
        <IButton
          type="button"
          size="xs"
          icon="fa-solid fa-xmark"
          aria-label="Dismiss notification"
          onClick={onDismissRequested}
        />
      </div>
    </i-notification-snackbar>
  );
}
