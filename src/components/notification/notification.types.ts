/** Presentation models shared by the bell, drawer, and snackbar. */
export type INotificationEntry = {
  notificationId: string;
  moduleId: string;
  moduleName: string;
  title: string;
  description: string;
  link: string | null;
  isDismissable: boolean;
  groupCount: number;
  latestDate: string;
  icon?: string;
  color?: string;
};

export type INotificationSnackbarMessage = {
  key: number;
  title: string;
  moduleName?: string;
  item?: INotificationEntry;
};

/** Controlled presentation state. All side effects belong to the consumer. */
export type INotificationState = {
  unreadCount: number;
  open?: boolean;
  items?: readonly INotificationEntry[];
  loading?: boolean;
  hasLoaded?: boolean;
  loadingMore?: boolean;
  readingId?: string | null;
  hasMore?: boolean;
  error?: string | null;
  loadMoreError?: string | null;
  actionError?: string | null;
  snackbar?: INotificationSnackbarMessage | null;
};

export type INotificationAction =
  | { type: 'toggle' }
  | { type: 'close' }
  | { type: 'open-all' }
  | { type: 'open-item'; item: INotificationEntry }
  | { type: 'load-more' }
  | { type: 'retry' }
  | { type: 'retry-read' }
  | { type: 'dismiss-snackbar' };
