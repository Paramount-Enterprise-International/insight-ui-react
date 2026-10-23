import { Children, useState, type HTMLAttributes, type ReactNode } from 'react';
import { IIcon } from '../icon';
export type IBannerVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
export interface IBannerProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'onClose'
> {
  message?: string | null;
  variant?: IBannerVariant;
  prefixIcon?: string;
  suffixIcon?: string;
  children?: ReactNode;
  closable?: boolean;
  closeLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: (event: MouseEvent) => void;
}
export function IBanner({
  message,
  variant = 'info',
  prefixIcon,
  suffixIcon,
  children,
  closable = false,
  closeLabel = 'Close',
  open,
  defaultOpen = true,
  onOpenChange,
  onClose,
  className,
  ...rest
}: IBannerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const hasChildren = Children.toArray(children).some((child) =>
    typeof child === 'string'
      ? Boolean(child.trim())
      : child !== null && typeof child !== 'boolean'
  );
  if (!(open ?? internalOpen) || (!message?.trim() && !hasChildren))
    return null;
  return (
    <i-banner
      {...rest}
      class={['i-banner', className].filter(Boolean).join(' ')}
      variant={variant}
      role={variant === 'danger' ? 'alert' : 'status'}>
      {prefixIcon ? (
        <IIcon
          icon={prefixIcon}
          className="i-banner__icon"
          aria-hidden="true"
        />
      ) : null}
      <div className="i-banner__body">
        {message?.trim() ? (
          <div className="i-banner__message">{message}</div>
        ) : null}
        <div className="i-banner__content">{children}</div>
      </div>
      {suffixIcon ? (
        <IIcon
          icon={suffixIcon}
          className="i-banner__icon"
          aria-hidden="true"
        />
      ) : null}
      {closable ? (
        <button
          type="button"
          className="i-banner__close"
          aria-label={closeLabel}
          onClick={(event) => {
            event.stopPropagation();
            if (open === undefined) setInternalOpen(false);
            onOpenChange?.(false);
            onClose?.(event.nativeEvent);
          }}>
          <IIcon icon="x" aria-hidden="true" />
        </button>
      ) : null}
    </i-banner>
  );
}
