import { ISnackbar } from '../snackbar';
import type {
  INotificationSnackbarMessage,
  INotificationState,
} from './notification.types';

export type INotificationSnackbarProps = {
  message: INotificationSnackbarMessage;
  options?: INotificationState['snackbarOptions'];
  onDismissRequested?: () => void;
  onOpenRequested?: () => void;
};

export function INotificationSnackbar({
  message,
  options,
  onDismissRequested,
  onOpenRequested,
}: INotificationSnackbarProps) {
  return (
    <i-notification-snackbar>
      <ISnackbar
        {...options}
        id={options?.id ?? 'notification-summary'}
        variant="info"
        resetKey={message.key}
        prefixIcon={
          options?.prefixIcon ?? message.item?.icon ?? 'fa-solid fa-bell'
        }
        closeLabel={options?.closeLabel ?? 'Dismiss notification'}
        onAfterDismissed={onDismissRequested}>
        <button
          type="button"
          className="i-snackbar__content-action snackbar-content"
          onClick={onOpenRequested}>
          {message.moduleName && (
            <span className="block font-semibold">{message.moduleName}</span>
          )}
          <span>{message.title}</span>
          {(message.newCount ?? 0) > 1 && (
            <span className="block">
              and {message.newCount! - 1} other new{' '}
              {message.newCount === 2 ? 'notification' : 'notifications'}
            </span>
          )}
        </button>
      </ISnackbar>
    </i-notification-snackbar>
  );
}
