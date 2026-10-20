import { IButton } from '../button';
import { IIcon } from '../icon';
import { ILoading } from '../loading';
import { NotificationError } from './notification-error';
import { INotificationItem } from './notification-item';
import type {
  INotificationEntry,
  INotificationState,
} from './notification.types';

export type INotificationDrawerProps = Omit<
  INotificationState,
  'open' | 'snackbar' | 'unreadCount'
> & {
  unreadCount?: number;
  onCloseRequested?: () => void;
  onOpenAllRequested?: () => void;
  onItemOpened?: (item: INotificationEntry) => void;
  onMoreRequested?: () => void;
  onRetryRequested?: () => void;
  onReadRetryRequested?: () => void;
};

export function INotificationDrawer({
  items = [],
  unreadCount = 0,
  loading = false,
  hasLoaded = false,
  loadingMore = false,
  readingId = null,
  hasMore = false,
  error = null,
  loadMoreError = null,
  actionError = null,
  onCloseRequested,
  onOpenAllRequested,
  onItemOpened,
  onMoreRequested,
  onRetryRequested,
  onReadRetryRequested,
}: INotificationDrawerProps) {
  const refreshLabel = hasLoaded
    ? 'Refreshing notifications...'
    : 'Loading notifications...';
  return (
    <i-notification-drawer>
      <header className="border-b">
        <div className="notification-header-main flex align-center justify-between gap-sm px-lg">
          <h2 className="text-xl leading-snug font-semibold m-0 truncate">
            Notifications
          </h2>
          <div className="flex align-center gap-xs shrink-0">
            <button
              type="button"
              className="i-clickable notification-icon-action border-none text-gray-600"
              aria-label="Open all notifications in a new tab"
              title="Open All Notifications"
              onClick={onOpenAllRequested}>
              <IIcon
                icon="fa-solid fa-arrow-up-right-from-square"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="i-clickable notification-icon-action border-none text-gray-600"
              aria-label="Close notifications"
              title="Close notifications"
              onClick={onCloseRequested}>
              <IIcon icon="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="notification-header-summary flex align-center gap-sm px-lg text-sm">
          <p className="m-0 truncate" aria-live="polite">
            You have {unreadCount} unread notifications
          </p>
          <div
            className="notification-refresh-status flex align-center justify-center shrink-0"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            title={loading ? refreshLabel : undefined}>
            {loading && (
              <>
                <ILoading label="" aria-hidden="true" />
                <span className="notification-refresh-label">
                  {refreshLabel}
                </span>
              </>
            )}
          </div>
        </div>
      </header>
      <div
        className="notification-scroll"
        aria-busy={loading}
        onScroll={(event) => {
          const target = event.currentTarget;
          if (
            !loading &&
            !loadingMore &&
            readingId === null &&
            !loadMoreError &&
            !error &&
            hasMore &&
            target.scrollTop + target.clientHeight >= target.scrollHeight * 0.8
          )
            onMoreRequested?.();
        }}>
        {loading && !hasLoaded && items.length === 0 ? (
          <div className="notification-initial-space" aria-hidden="true" />
        ) : error && items.length === 0 ? (
          <NotificationError message={error} onRetry={onRetryRequested} />
        ) : items.length === 0 ? (
          <p className="p-2xl text-center text-subtle" role="status">
            No new notifications
          </p>
        ) : (
          <ul
            className="list-none m-0 p-0"
            aria-label="Unread notification groups">
            {items.map((item) => (
              <li key={item.notificationId} className="border-b border-subtle">
                <INotificationItem
                  item={item}
                  busy={readingId !== null}
                  onOpenRequested={onItemOpened}
                />
              </li>
            ))}
          </ul>
        )}
        {error && items.length > 0 && (
          <NotificationError
            message={error}
            retryLoading={loading}
            onRetry={onRetryRequested}
          />
        )}
        {actionError && (
          <NotificationError
            message={actionError}
            title="Failed to mark notification as read."
            retryLoading={readingId !== null}
            onRetry={onReadRetryRequested}
          />
        )}
        {loadingMore ? (
          <div className="flex justify-center p-lg" role="status">
            <ILoading label="Loading more notifications..." />
          </div>
        ) : loadMoreError ? (
          <NotificationError
            message={loadMoreError}
            onRetry={onMoreRequested}
          />
        ) : hasMore ? (
          <div className="flex justify-center p-md">
            <IButton
              type="button"
              size="sm"
              disabled={loading || readingId !== null}
              onClick={onMoreRequested}>
              Load more
            </IButton>
          </div>
        ) : null}
      </div>
    </i-notification-drawer>
  );
}
