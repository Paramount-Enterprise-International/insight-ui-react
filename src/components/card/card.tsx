// card.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

export type RouterLinkInput = string | unknown[] | undefined;

export type ICardProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onClick'
> & {
  href?: string | null;

  routerLink?: RouterLinkInput;
  queryParams?: Record<string, unknown> | null;
  fragment?: string;
  replaceUrl?: boolean;
  skipLocationChange?: boolean;
  state?: Record<string, unknown>;

  target?: '_self' | '_blank' | '_parent' | '_top' | string;
  rel?: string | null;

  disabled?: boolean;

  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void;

  children?: React.ReactNode;
};

function normalizeHref(input?: string | null): string | undefined {
  if (input === null || input === undefined) return undefined;
  const s = String(input).trim();
  return s ? s : undefined;
}

function routerLinkToTo(routerLink?: RouterLinkInput): string | undefined {
  if (!routerLink) return undefined;

  if (Array.isArray(routerLink)) {
    const parts = routerLink
      .flat()
      .map((x) => String(x ?? '').trim())
      .filter(Boolean);

    if (!parts.length) return undefined;

    return parts.join('/').replace(/\/+/g, '/');
  }

  const s = String(routerLink).trim();
  return s || undefined;
}

function buildSearch(queryParams?: Record<string, unknown> | null): string {
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
    skipLocationChange = false,
    state,
    target,
    rel,
    disabled = false,
    onClick,
    children,
    className,
    ...rest
  } = props;

  void skipLocationChange;

  const normalizedHref = useMemo(() => normalizeHref(href), [href]);

  const toBase = useMemo(() => routerLinkToTo(routerLink), [routerLink]);

  const search = useMemo(() => buildSearch(queryParams), [queryParams]);
  const hash = useMemo(() => buildHash(fragment), [fragment]);

  const to = useMemo(() => {
    if (!toBase) return undefined;

    const hasSearch = toBase.includes('?');
    const hasHash = toBase.includes('#');

    let out = toBase;

    if (search && !hasSearch) out += search;
    if (hash && !hasHash) out += hash;

    return out;
  }, [toBase, search, hash]);

  const useRouterLink = !disabled && !!to;

  const relAttr =
    rel ??
    ((target ?? '').toLowerCase() === '_blank'
      ? 'noopener noreferrer'
      : undefined);

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      (ev.nativeEvent as { stopImmediatePropagation?: () => void })?.stopImmediatePropagation?.();
      return;
    }

    if (onClick) {
      ev.preventDefault();
      onClick(ev);
      return;
    }

    if (!to && !normalizedHref) {
      ev.preventDefault();
    }
  };

  return (
    <i-card className={className} {...rest}>
      {useRouterLink ? (
        <Link
          className="i-card"
          aria-disabled={disabled ? 'true' : undefined}
          tabIndex={disabled ? -1 : undefined}
          to={to!}
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

export function ICardImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
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
