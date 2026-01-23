// button.tsx
import type React from 'react';
import { IIcon, type IIconInput } from '../icon/icon';
import { ILoading } from '../loading/loading';
import type { IUISize, IUIVariant } from '../shared/form.types';

export type IButtonType = 'button' | 'submit' | 'reset';
export type IButtonSize = Extract<IUISize, '2xs' | 'xs' | 'sm' | 'md' | 'lg'>;
export type IButtonVariant = Extract<
  IUIVariant,
  'primary' | 'warning' | 'danger' | 'success' | 'outline'
>;

export type IButtonProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onClick'
> & {
  disabled?: boolean;
  loading?: boolean;

  /** Used for submit/reset behavior (host is NOT a native <button>) */
  type?: IButtonType;

  loadingText?: string;
  variant?: IButtonVariant;
  size?: IButtonSize;

  /** ✅ autocomplete for aliases + allow raw FA class strings */
  icon?: IIconInput;

  /** Angular naming */
  onClick?: (event: MouseEvent) => void;

  children?: React.ReactNode;
};

function findClosestForm(startEl: HTMLElement | null): HTMLFormElement | null {
  let el: HTMLElement | null = startEl;
  while (el) {
    if (el instanceof HTMLFormElement) return el;
    el = el.parentElement;
  }
  return null;
}

export function IButton(props: IButtonProps) {
  const {
    disabled = false,
    loading = false,
    type = 'button',
    loadingText = '',
    variant = 'primary',
    size = 'md',
    icon,
    onClick,
    children,
    className,
    ...rest
  } = props;

  const isBlocked = disabled || loading;

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    if (isBlocked) {
      event.preventDefault();
      event.stopPropagation();

      // Angular parity: stopImmediatePropagation when blocked
      (event.nativeEvent as any)?.stopImmediatePropagation?.();
      return;
    }

    // expose native event, like Angular
    onClick?.(event.nativeEvent);

    // manual submit/reset (because host is not <button>)
    if (type === 'submit' || type === 'reset') {
      const form = findClosestForm(event.target as HTMLElement | null);
      if (!form) return;

      if (type === 'submit') {
        const requestSubmit = (
          form as HTMLFormElement & { requestSubmit?: () => void }
        ).requestSubmit;

        if (typeof requestSubmit === 'function') requestSubmit.call(form);
        else form.submit();
      } else {
        form.reset();
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (isBlocked) {
      // Angular returns; React default is fine — no extra behavior needed
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // Simulate click (keeps submit/reset behavior consistent)
      const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      (event.target as HTMLElement | null)?.dispatchEvent(mouseEvent);
    }
  };

  return (
    <i-button
      {...rest}
      role="button"
      className={className}
      variant={variant}
      size={size}
      // Angular parity: do NOT reflect `type` as an attribute on the host
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}>
      {loading ? (
        <ILoading label={loadingText} light={variant !== 'outline'} />
      ) : (
        <>
          {icon ? <IIcon icon={icon} size={size} /> : null}
          {children}
        </>
      )}
    </i-button>
  );
}
