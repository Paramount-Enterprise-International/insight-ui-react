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
      <button
        type="button"
        className="notification-icon-action flex align-center justify-center p-2xs border-none bg-transparent text-gray-700 radius-sm"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={expanded}
        aria-haspopup="dialog"
        title="Notifications"
        onClick={onToggleRequested}>
        <IIcon icon="fa-solid fa-bell" size="lg" aria-hidden="true" />
      </button>
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
