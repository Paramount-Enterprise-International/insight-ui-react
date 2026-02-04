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

function getBasePathname(): string {
  if (typeof window === 'undefined') return '/';
  const p = window.location?.pathname ?? '/';
  // if you are at "/docs/components" we want base "/docs/components/"
  return p.endsWith('/') ? p : `${p}/`;
}

function routerLinkToHref(routerLink?: RouterLinkInput): string | undefined {
  if (routerLink === undefined || routerLink === null) return undefined;

  const basePathname = getBasePathname();

  const resolve = (raw: string): string | undefined => {
    const s = String(raw ?? '').trim();
    if (!s) return undefined;

    // absolute path stays absolute
    if (s.startsWith('/')) return s;

    // full URL / protocol links stay as-is (http:, https:, mailto:, tel:, etc)
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) return s;

    // relative resolves against current pathname (Angular-like)
    if (typeof window === 'undefined') return `/${s}`;

    const u = new URL(s, window.location.origin + basePathname);
    return u.pathname + u.search + u.hash;
  };

  if (Array.isArray(routerLink)) {
    const parts = routerLink
      .flat()
      .map((x) => String(x ?? '').trim())
      .filter(Boolean);

    if (parts.length === 0) return undefined;

    // Array form is treated as "relative unless it starts with /"
    const joined = parts.join('/').replace(/\/+/g, '/');
    return resolve(joined);
  }

  return resolve(String(routerLink));
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

function withQueryAndFragment(
  href?: string,
  queryParams?: Record<string, any> | null,
  fragment?: string
): string | undefined {
  if (!href) return href;

  const search = buildSearch(queryParams);
  const hash = buildHash(fragment);

  // Keep it predictable:
  // - preserve existing search/hash on href
  // - append only if not present
  const hasSearch = href.includes('?');
  const hasHash = href.includes('#');

  let out = href;

  if (search && !hasSearch) out += search;
  if (hash && !hasHash) out += hash;

  return out;
}

function warnOnceFactory() {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key)) return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
}

const warnOnce = warnOnceFactory();

export function ICard(props: ICardProps) {
  const {
    href,
    routerLink,
    queryParams,
    fragment,
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
  const rawEffectiveHref = disabled
    ? undefined
    : (routerHref ?? normalizedHref);

  // Apply queryParams + fragment (parity-friendly) to whatever we decided
  const effectiveHref = useMemo(
    () => withQueryAndFragment(rawEffectiveHref, queryParams, fragment),
    [rawEffectiveHref, queryParams, fragment]
  );

  const hasHref = !!effectiveHref;
  const hasClick = typeof onClick === 'function';

  useEffect(() => {
    const hasRouter =
      routerLink !== undefined && routerLink !== null && routerLink !== '';
    const hasRawHref = !!normalizeHref(href);

    if (hasRawHref && hasRouter) {
      warnOnce(
        'href+routerLink',
        '[i-card] Do not use `href` and `routerLink` together. Choose one.'
      );
    }

    if (hasClick && (hasRawHref || hasRouter)) {
      warnOnce(
        'click+nav',
        '[i-card] `onClick` should not be combined with `href` or `routerLink`.'
      );
    }

    if (!hasRawHref && !hasRouter && !hasClick) {
      warnOnce(
        'no-action',
        '[i-card] No action provided. Add `href`, `routerLink`, or `onClick`.'
      );
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
