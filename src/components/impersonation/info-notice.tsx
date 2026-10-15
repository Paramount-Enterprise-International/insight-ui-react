import { IIcon } from '../icon/icon';
export type IInfoNoticeProps = { message?: string | null; title?: string };
export function IInfoNotice({ message, title = '' }: IInfoNoticeProps) {
  if (!message?.trim()) return null;
  return (
    <div
      className="i-info-notice flex align-start gap-sm p-sm px-md radius-3xs text-md font-body"
      role="status">
      <IIcon
        icon="info"
        className="shrink-0"
        aria-hidden="true"
        size="lg"
      />
      <span className="min-w-0 leading-snug">
        {title && <strong>{title} </strong>}
        {message}
      </span>
    </div>
  );
}
