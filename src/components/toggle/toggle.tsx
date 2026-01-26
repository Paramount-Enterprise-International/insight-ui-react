import React, { useCallback, useId, useMemo, useRef, useState } from 'react';

/* =========================================
 * Types
 * ========================================= */

export type IToggleProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange' | 'children'
> & {
  /** Controlled value */
  checked?: boolean;

  /** Uncontrolled initial value */
  defaultChecked?: boolean;

  disabled?: boolean;

  /** Label content: <IToggle>Label</IToggle> */
  children?: React.ReactNode;

  /** Put label left or right */
  labelPosition?: 'left' | 'right';

  /** Matches your convention */
  onChange?: (checked: boolean) => void;

  /** Optional: touched semantics */
  onTouched?: () => void;

  /** Optional: pass through input name/value for forms */
  name?: string;
  value?: string;
};

const INTERACTIVE_SELECTOR_PARTS = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '[role="link"]',
  '[role="switch"]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
] as const;

const INTERACTIVE_SELECTOR = INTERACTIVE_SELECTOR_PARTS.join(',');

function isInteractive(el: HTMLElement | null): boolean {
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (
    tag === 'a' ||
    tag === 'button' ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    tag === 'label'
  )
    return true;

  const role = el.getAttribute('role');
  if (role === 'button' || role === 'link' || role === 'switch') return true;

  if ((el as any).isContentEditable) return true;

  const tabindex = el.getAttribute('tabindex');
  if (tabindex != null && tabindex !== '-1') return true;

  return false;
}

/* =========================================
 * Component
 * ========================================= */

export function IToggle(props: IToggleProps) {
  const {
    checked,
    defaultChecked = false,
    disabled = false,
    labelPosition = 'right',
    onChange,
    onTouched,
    children,
    className,
    name,
    value,
    ...rest
  } = props;

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = checked != null;
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState<boolean>(defaultChecked);

  const currentChecked = isControlled ? !!checked : uncontrolledChecked;

  const hostClassName = useMemo(() => {
    return [
      'i-toggle',
      currentChecked ? 'i-toggle__active' : null,
      disabled ? 'i-toggle__disabled' : null,
      labelPosition === 'left' ? 'i-toggle__label-left' : null,
      className ?? null,
    ]
      .filter(Boolean)
      .join(' ');
  }, [currentChecked, disabled, labelPosition, className]);

  const emitChange = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledChecked(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleNativeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      emitChange(!!e.target.checked);
    },
    [disabled, emitChange]
  );

  const handleBlur = useCallback(() => {
    onTouched?.();
  }, [onTouched]);

  const handleHostClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      const target = e.target as HTMLElement | null;

      // let native input handle itself
      if (target?.tagName.toLowerCase() === 'input') return;

      // if clicking something interactive inside projected label, don't toggle
      if (
        target &&
        (isInteractive(target) || target.closest(INTERACTIVE_SELECTOR))
      ) {
        return;
      }

      inputRef.current?.click();
    },
    [disabled]
  );

  return (
    <i-toggle
      {...rest}
      className={hostClassName}
      onClick={handleHostClick}
      role="switch"
      aria-checked={currentChecked}
      aria-disabled={disabled || undefined}>
      <input
        ref={inputRef}
        id={inputId}
        className="i-toggle__input"
        type="checkbox"
        checked={currentChecked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={handleNativeChange}
        onBlur={handleBlur}
      />

      <span className="i-toggle__thumb" />

      <span className="i-toggle__label">{children}</span>
    </i-toggle>
  );
}
