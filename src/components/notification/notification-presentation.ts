export function truncateNotificationText(value: string): string {
  return value.length > 50 ? `${value.slice(0, 50)}...` : value;
}

export function notificationDate(value: string, now = new Date()): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const day = (input: Date): number =>
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate());
  const age = (day(now) - day(date)) / 86_400_000;
  if (age <= 0) return 'Today';
  if (age === 1) return 'Yesterday';
  if (age < 7) return `${age} days ago`;
  if (age === 7) return 'Last week';
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    date
  );
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}
