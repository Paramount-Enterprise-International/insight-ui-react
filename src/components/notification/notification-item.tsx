import {
  notificationDate,
  truncateNotificationText,
} from './notification-presentation';
import type { INotificationEntry } from './notification.types';

export type INotificationItemProps = {
  item: INotificationEntry;
  busy?: boolean;
  onOpenRequested?: (item: INotificationEntry) => void;
};

export function INotificationItem({
  item,
  busy = false,
  onOpenRequested,
}: INotificationItemProps) {
  return (
    <i-notification-item>
      <button
        type="button"
        className="notification-item flex align-center gap-md w-full p-lg border-none bg-transparent text-left"
        disabled={busy}
        aria-busy={busy}
        aria-label={`Read notification: ${item.title}, ${item.groupCount} notifications`}
        onClick={() => onOpenRequested?.(item)}>
        <span
          className="group-count flex align-center justify-center shrink-0 bg-primary text-white radius-full text-sm font-semibold"
          aria-hidden="true">
          {item.groupCount}
        </span>
        <span className="flex flex-fill align-start justify-between gap-md min-w-0">
          <span className="notification-copy flex flex-col gap-xs flex-fill min-w-0">
            <span
              className="text-md font-semibold text-gray-700"
              title={item.title}>
              {truncateNotificationText(item.title)}
            </span>
            <span className="text-sm text-gray-700" title={item.description}>
              {truncateNotificationText(item.description)}
            </span>
            <span className="text-sm text-subtle">{item.moduleName}</span>
          </span>
          <span className="flex flex-col align-end gap-xs shrink-0 text-right">
            <span className="text-sm text-subtle" title={item.latestDate}>
              {notificationDate(item.latestDate)}
            </span>
            {!item.isDismissable && (
              <span className="text-sm text-warning">Important</span>
            )}
          </span>
        </span>
      </button>
    </i-notification-item>
  );
}
