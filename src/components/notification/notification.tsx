import { INotificationBell } from './notification-bell';
import { INotificationDrawer } from './notification-drawer';
import { NotificationOverlay } from './notification-overlay';
import { INotificationSnackbar } from './notification-snackbar';
import type {
  INotificationAction,
  INotificationState,
} from './notification.types';

export type INotificationProps = {
  state?: INotificationState | null;
  onAction?: (action: INotificationAction) => void;
};

/** Controlled notification UI; consumers own data, navigation and timers. */
export function INotification({ state, onAction }: INotificationProps) {
  if (!state) return null;
  return (
    <i-notification>
      <INotificationBell
        unreadCount={state.unreadCount}
        expanded={state.open}
        onToggleRequested={() => onAction?.({ type: 'toggle' })}
      />
      {state.open && typeof document !== 'undefined' && (
        <NotificationOverlay onClose={() => onAction?.({ type: 'close' })}>
          <INotificationDrawer
            {...state}
            onCloseRequested={() => onAction?.({ type: 'close' })}
            onOpenAllRequested={() => onAction?.({ type: 'open-all' })}
            onItemOpened={(item) => onAction?.({ type: 'open-item', item })}
            onMoreRequested={() => onAction?.({ type: 'load-more' })}
            onRetryRequested={() => onAction?.({ type: 'retry' })}
            onReadRetryRequested={() => onAction?.({ type: 'retry-read' })}
          />
        </NotificationOverlay>
      )}
      {state.snackbar && (
        <INotificationSnackbar
          message={state.snackbar}
          onDismissRequested={() => onAction?.({ type: 'dismiss-snackbar' })}
          onOpenRequested={() =>
            state.snackbar?.item &&
            onAction?.({ type: 'open-item', item: state.snackbar.item })
          }
        />
      )}
    </i-notification>
  );
}
