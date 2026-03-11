// button.tsx
import type React from 'react';
import { IIcon, type IIconInput } from '../icon/icon';
import { ILoading } from '../loading/loading';
import type { IUISize, IUIVariant } from '../shared/form.types';

export type IButtonType = 'button' | 'submit' | 'reset';

export type IButtonSize = Extract<
  IUISize,
  '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg'
>;

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

  type?: IButtonType;

  loadingText?: string;
  variant?: IButtonVariant;
  size?: IButtonSize;

  icon?: IIconInput;

  onClick?: (event: MouseEvent) => void;

  /** Router support */
  routerLink?: string;
  queryParams?: Record<string, unknown>;
  fragment?: string;
  state?: unknown;

  /** Anchor support */
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;

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

function buildUrl(
  base?: string,
  queryParams?: Record<string, unknown>,
  fragment?: string
) {
  if (!base) return undefined;

  let url = base;

  if (queryParams) {
    const params = new URLSearchParams();

    for (const key in queryParams) {
      const value = queryParams[key];
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    const query = params.toString();
    if (query) url += `?${query}`;
  }

  if (fragment) url += `#${fragment}`;

  return url;
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

    routerLink,
    queryParams,
    fragment,
    state,

    href,
    target,
    rel,

    children,
    ...rest
  } = props;

  void state;

  const isDisabled = disabled || loading;

  const computedRel =
    target === '_blank' ? (rel ?? 'noopener noreferrer') : (rel ?? undefined);

  let mode: 'router' | 'anchor' | 'button' = 'button';
  if (routerLink) mode = 'router';
  else if (href) mode = 'anchor';

  const url = buildUrl(routerLink ?? href, queryParams, fragment);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      (event.nativeEvent as { stopImmediatePropagation?: () => void })?.stopImmediatePropagation?.();
      return;
    }

    onClick?.(event.nativeEvent);

    if (mode === 'button' && (type === 'submit' || type === 'reset')) {
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

  const content = loading ? (
    <ILoading label={loadingText} light={variant !== 'outline'} />
  ) : (
    <>
      {icon ? <IIcon icon={icon} size={size} /> : null}
      {children}
    </>
  );

  return (
    <i-button
      {...rest}
      variant={variant}
      size={size}
      icon={icon ? String(icon) : undefined}
      data-mode={mode}
      aria-disabled={isDisabled ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}>
      {mode === 'router' || mode === 'anchor' ? (
        <a
          className="i-button-inner"
          aria-disabled={isDisabled ? 'true' : undefined}
          href={isDisabled ? undefined : url}
          target={target}
          rel={computedRel}
          onClick={handleClick}>
          {content}
        </a>
      ) : (
        <button
          className="i-button-inner"
          disabled={isDisabled}
          type={type}
          onClick={handleClick}>
          {content}
        </button>
      )}
    </i-button>
  );
}
