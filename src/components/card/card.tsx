// card.tsx
import React, { useEffect, useMemo } from 'react';

export type RouterLinkInput = string | any[] | undefined;

export type ICardProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onClick'
> & {
  // External / normal anchor
  href?: string | null;

  // Angular Router (API parity)
  routerLink?: RouterLinkInput;
  queryParams?: Record<string, any> | null;
  fragment?: string;
  replaceUrl?: boolean;
  skipLocationChange?: boolean;
  state?: Record<string, any>;

  // Anchor-related
  target?: '_self' | '_blank' | '_parent' | '_top' | string;
  rel?: string | null;

  disabled?: boolean;

  /** Standardized event name (Angular + React) */
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;

  children?: React.ReactNode;
};

function normalizeHref(input?: string | null): string | undefined {
  if (input === null || input === undefined) return undefined;
  const s = String(input).trim();
  if (!s) return undefined;
  return s;
}

function routerLinkToHref(routerLink?: RouterLinkInput): string | undefined {
  if (routerLink === undefined || routerLink === null) return undefined;

  if (Array.isArray(routerLink)) {
    const parts = routerLink
      .flat()
      .map((x) => String(x ?? '').trim())
      .filter(Boolean);

    if (parts.length === 0) return undefined;
    return '/' + parts.join('/').replace(/\/+/g, '/');
  }

  const s = String(routerLink).trim();
  if (!s) return undefined;
  return s.startsWith('/') ? s : `/${s}`;
}

export function ICard(props: ICardProps) {
  const {
    href,
    routerLink,
    queryParams, // parity-only (unused)
    fragment, // parity-only (unused)
    replaceUrl = false, // parity-only (unused)
    skipLocationChange = false, // parity-only (unused)
    state, // parity-only (unused)
    target,
    rel,
    disabled = false,
    onClick,
    children,
    className,
    ...rest
  } = props;

  const normalizedHref = useMemo(() => normalizeHref(href), [href]);
  const routerHref = useMemo(() => routerLinkToHref(routerLink), [routerLink]);

  // Angular behavior:
  // - routerLink takes precedence (when enabled)
  // - otherwise href
  const effectiveHref = disabled ? undefined : (routerHref ?? normalizedHref);

  const hasHref = !!effectiveHref;
  const hasClick = typeof onClick === 'function';

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const hasRouter =
        routerLink !== undefined && routerLink !== null && routerLink !== '';
      const hasRawHref = !!normalizeHref(href);

      if (hasRawHref && hasRouter) {
        // eslint-disable-next-line no-console
        console.warn(
          '[i-card] Do not use `href` and `routerLink` together. Choose one.'
        );
      }

      if (hasClick && (hasRawHref || hasRouter)) {
        // eslint-disable-next-line no-console
        console.warn(
          '[i-card] `onClick` should not be combined with `href` or `routerLink`.'
        );
      }

      if (!hasRawHref && !hasRouter && !hasClick) {
        // eslint-disable-next-line no-console
        console.warn(
          '[i-card] No action provided. Add `href`, `routerLink`, or `onClick`.'
        );
      }
    }
  }, [hasClick, href, routerLink]);

  // Angular relAttr:
  // - if rel provided, use it
  // - else if target=_blank, use "noopener noreferrer"
  // - else undefined
  const relAttr =
    rel ??
    ((target ?? '').toLowerCase() === '_blank'
      ? 'noopener noreferrer'
      : undefined);

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      (ev.nativeEvent as any)?.stopImmediatePropagation?.();
      return;
    }

    // Button-like behavior (Angular: if output observed, prevent navigation and emit)
    if (hasClick) {
      ev.preventDefault();
      onClick?.(ev);
      return;
    }

    // Prevent empty anchor navigation (Angular)
    if (!hasHref) {
      ev.preventDefault();
    }
  };

  return (
    <i-card className={className} {...rest}>
      <a
        className="i-card"
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : undefined}
        href={effectiveHref}
        target={target ?? undefined}
        rel={relAttr ?? undefined}
        onClick={handleClick}>
        {children}
      </a>
    </i-card>
  );
}

/* =========================
 * Sub components
 * ========================= */

export type ICardImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'children'
> & {
  src?: string;
  alt?: string | null;
};

export function ICardImage(props: ICardImageProps) {
  const { src, alt, ...rest } = props;

  return (
    <i-card-image>
      <img alt={alt ?? 'card-image'} src={src} {...rest} />
    </i-card-image>
  );
}

export function ICardBody(props: React.HTMLAttributes<HTMLElement>) {
  return <i-card-body {...props} />;
}

export function ICardFooter(props: React.HTMLAttributes<HTMLElement>) {
  return <i-card-footer {...props} />;
}
