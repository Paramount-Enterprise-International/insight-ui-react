import { useLayoutEffect, useState } from 'react';
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

/** Controlled notification UI; consumers own data and navigation. */
export function INotification({ state, onAction }: INotificationProps) {
  const [retained, setRetained] = useState(state?.open ?? false);
  useLayoutEffect(() => {
    if (state?.open) setRetained(true);
    else if (!state) setRetained(false);
  }, [state]);
  if (!state) return null;
  return (
    <i-notification>
      <INotificationBell
        unreadCount={state.unreadCount}
        expanded={state.open}
        onToggleRequested={() => onAction?.({ type: 'toggle' })}
      />
      {(state.open || retained) && typeof document !== 'undefined' && (
        <NotificationOverlay
          open={state.open ?? false}
          onExited={() => setRetained(false)}
          onClose={() => onAction?.({ type: 'close' })}>
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
          options={state.snackbarOptions}
          onDismissRequested={() => onAction?.({ type: 'dismiss-snackbar' })}
          onOpenRequested={() => onAction?.({ type: 'open-drawer' })}
        />
      )}
    </i-notification>
  );
}
