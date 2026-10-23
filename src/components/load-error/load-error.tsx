import type { HTMLAttributes } from 'react';
import { IButton } from '../button';
import { IIcon } from '../icon';
export type ILoadErrorDensity = 'default' | 'compact' | 'inline';
export interface ILoadErrorProps extends HTMLAttributes<HTMLElement> {
  message?: string | null;
  title?: string;
  density?: ILoadErrorDensity;
  retryDisabled?: boolean;
  retryLoading?: boolean;
  onRetry?: () => void;
}
export function ILoadError({
  message,
  title = '',
  density = 'default',
  retryDisabled = false,
  retryLoading = false,
  onRetry,
  className,
  ...rest
}: ILoadErrorProps) {
  if (!message?.trim()) return null;
  return (
    <i-load-error
      {...rest}
      class={['i-load-error', className].filter(Boolean).join(' ')}
      density={density}>
      <div className="i-load-error__content" role="alert">
        <IIcon
          icon="fa-solid fa-circle-exclamation"
          size={density === 'inline' ? 'sm' : 'lg'}
          aria-hidden="true"
        />
        {title ? <p>{title}</p> : null}
        <p className="i-load-error__message">{message}</p>
        <IButton
          type="button"
          variant="primary"
          icon="sync"
          size={
            density === 'inline' ? 'xs' : density === 'compact' ? 'sm' : 'md'
          }
          disabled={retryDisabled}
          loading={retryLoading}
          onClick={() => {
            if (!retryDisabled && !retryLoading) onRetry?.();
          }}>
          Retry
        </IButton>
      </div>
    </i-load-error>
  );
}
