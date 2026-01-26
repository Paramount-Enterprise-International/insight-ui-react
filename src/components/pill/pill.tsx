import React, { useCallback } from 'react';

export type IPillSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';
export type IPillVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';

export type IPillProps = Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> & {
  size?: IPillSize;
  variant?: IPillVariant;

  disabled?: boolean;

  /** show close button */
  closable?: boolean;

  /** fires when user clicks the pill body (not the close button) */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;

  /** fires when user clicks close button */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function IPill({
  size = 'md',
  variant = 'default',
  disabled = false,
  closable = false,
  className,
  children,
  onClick,
  onClose,
  ...rest
}: IPillProps) {
  const handleHostClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ignore clicks originating from the close button
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.i-pill__close')) return;

      onClick?.(e);
    },
    [disabled, onClick]
  );

  const handleClose = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onClose?.(e);
    },
    [disabled, onClose]
  );

  return (
    <i-pill
      // base class for "i-pill, .i-pill" selector group
      class={['i-pill', className].filter(Boolean).join(' ')}
      size={size}
      variant={variant}
      aria-disabled={disabled ? 'true' : undefined}
      onClick={handleHostClick}
      {...(rest as any)}>
      <span className="i-pill__content">{children}</span>

      {closable ? (
        <button
          aria-label="Close"
          className="i-pill__close"
          type="button"
          disabled={disabled}
          onClick={handleClose}>
          ×
        </button>
      ) : null}
    </i-pill>
  );
}
