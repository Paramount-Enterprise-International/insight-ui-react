// card.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

export type RouterLinkInput = string | any[] | undefined;

export type ICardProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onClick'
> & {
  // External / normal anchor
  href?: string | null;

  // React Router (API parity with Angular naming)
  routerLink?: RouterLinkInput;
  queryParams?: Record<string, any> | null;
  fragment?: string;
  replaceUrl?: boolean; // -> Link "replace"
  skipLocationChange?: boolean; // parity-only (unused)
  state?: Record<string, any>; // -> Link "state"

  // Anchor-related (also supported by Link)
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
  return s ? s : undefined;
}

function routerLinkToTo(routerLink?: RouterLinkInput): string | undefined {
  if (routerLink === undefined || routerLink === null) return undefined;

  if (Array.isArray(routerLink)) {
    const parts = routerLink
      .flat()
      .map((x) => String(x ?? '').trim())
      .filter(Boolean);

    if (parts.length === 0) return undefined;

    // Treat array form as a path join.
    // If the joined result starts with "/", it's absolute.
    // Otherwise it's relative (and Link can resolve it with relative="path").
    const joined = parts.join('/').replace(/\/+/g, '/');
    return joined;
  }

  const s = String(routerLink).trim();
  return s ? s : undefined; // keep relative as-is
}

function buildSearch(queryParams?: Record<string, any> | null): string {
  if (!queryParams) return '';
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(queryParams)) {
    if (v === undefined || v === null) continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}

function buildHash(fragment?: string): string {
  if (!fragment) return '';
  const f = String(fragment).trim();
  if (!f) return '';
  return f.startsWith('#') ? f : `#${f}`;
}

export function ICard(props: ICardProps) {
  const {
    href,
    routerLink,
    queryParams,
    fragment,
    replaceUrl = false,
    skipLocationChange = false, // parity-only (unused)
    state,
    target,
    rel,
    disabled = false,
    onClick,
    children,
    className,
    ...rest
  } = props;

  const normalizedHref = useMemo(() => normalizeHref(href), [href]);

  const toBase = useMemo(() => routerLinkToTo(routerLink), [routerLink]);
  const search = useMemo(() => buildSearch(queryParams), [queryParams]);
  const hash = useMemo(() => buildHash(fragment), [fragment]);

  const to = useMemo(() => {
    if (!toBase) return undefined;

    // If toBase already has ? or #, we don't try to merge (keep predictable).
    // Prefer the explicit queryParams/fragment when base is clean.
    const hasSearch = toBase.includes('?');
    const hasHash = toBase.includes('#');

    let out = toBase;
    if (search && !hasSearch) out += search;
    if (hash && !hasHash) out += hash;
    return out;
  }, [toBase, search, hash]);

  const hasRouterLink = !!to;
  const hasClick = typeof onClick === 'function';

  // Angular relAttr behavior for anchors:
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

    // Angular-like: if onClick provided, prevent navigation and emit
    if (hasClick) {
      ev.preventDefault();
      onClick?.(ev);
      return;
    }

    // If no href/to (shouldn’t happen often), prevent empty navigation
    if (!hasRouterLink && !normalizedHref) {
      ev.preventDefault();
    }
  };

  return (
    <i-card className={className} {...rest}>
      {hasRouterLink ? (
        <Link
          className="i-card"
          aria-disabled={disabled ? 'true' : undefined}
          tabIndex={disabled ? -1 : undefined}
          to={disabled ? '' : to!}
          // KEY: makes "button" resolve to "/docs/components/button"
          // when you're at "/docs/components"
          relative="path"
          replace={replaceUrl}
          state={state}
          target={target ?? undefined}
          rel={relAttr ?? undefined}
          onClick={handleClick}>
          {children}
        </Link>
      ) : (
        <a
          className="i-card"
          aria-disabled={disabled ? 'true' : undefined}
          tabIndex={disabled ? -1 : undefined}
          href={disabled ? undefined : normalizedHref}
          target={target ?? undefined}
          rel={relAttr ?? undefined}
          onClick={handleClick}>
          {children}
        </a>
      )}
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
