import { IIcon } from '../icon';

export type INotificationBellProps = {
  unreadCount?: number;
  expanded?: boolean;
  onToggleRequested?: () => void;
};

export function INotificationBell({
  unreadCount = 0,
  expanded = false,
  onToggleRequested,
}: INotificationBellProps) {
  return (
    <i-notification-bell>
      <a
        className="i-clickable"
        role="button"
        tabIndex={0}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={expanded}
        aria-haspopup="dialog"
        title="Notifications"
        onClick={onToggleRequested}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggleRequested?.();
          }
        }}>
        <IIcon
          icon="fa-solid fa-bell"
          size="lg"
          className="text-gray-600"
          aria-hidden="true"
        />
      </a>
      {unreadCount > 0 && (
        <span
          className="notification-badge flex align-center justify-center bg-primary text-white radius-full text-xs"
          aria-hidden="true">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </i-notification-bell>
  );
}
