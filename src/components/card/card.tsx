import React, { useEffect } from 'react';

export type ICardProps = React.HTMLAttributes<HTMLElement> & {
  // External / normal anchor
  href?: string | null;

  // Anchor-related
  target?: '_self' | '_blank' | '_parent' | '_top' | string;
  rel?: string | null;

  disabled?: boolean;

  // Click-only usage
  onCardClick?: (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

function isDev(): boolean {
  try {
    return (import.meta as any).env?.DEV === true;
  } catch {
    return process.env.NODE_ENV !== 'production';
  }
}

function normalizeHref(href: string | null | undefined): string | undefined {
  const s = (href ?? '').trim();
  return s ? s : undefined;
}

function mergeRel(
  base: string | undefined,
  extra: string | undefined
): string | undefined {
  const tokens = new Set<string>();
  for (const src of [base, extra]) {
    for (const t of (src ?? '').split(/\s+/g).filter(Boolean)) {
      tokens.add(t);
    }
  }
  const out = Array.from(tokens).join(' ');
  return out ? out : undefined;
}

export function ICard(props: ICardProps) {
  const {
    href,
    target,
    rel,
    disabled = false,
    onCardClick,
    children,
    onClick, // allow normal onClick too
    ...hostProps
  } = props;

  const normalizedHref = normalizeHref(href);
  const hasHref = !!normalizedHref;
  const hasClick = typeof onCardClick === 'function';

  useEffect(() => {
    if (!isDev()) return;

    if (hasClick && hasHref) {
      console.warn(
        '[i-card] `onCardClick` should not be combined with `href`.',
        {
          href: normalizedHref,
        }
      );
    }

    if (!hasHref && !hasClick) {
      console.warn('[i-card] No action provided. Add `href` or `onCardClick`.');
    }
  }, [hasHref, hasClick, normalizedHref]);

  // if target="_blank", ensure safe rel tokens exist (merge, don’t overwrite)
  const targetIsBlank = (target ?? '').toLowerCase() === '_blank';
  const relAttr = targetIsBlank
    ? mergeRel(rel ?? undefined, 'noopener noreferrer')
    : (rel ?? undefined);

  const hrefAttr = disabled ? undefined : normalizedHref;

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Disabled: behave like disabled link
    if (disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    // Click handler mode: prevent navigation, run callback
    if (hasClick) {
      ev.preventDefault();
      onCardClick?.(ev);
      return;
    }

    // Prevent empty anchor navigation
    if (!hrefAttr) {
      ev.preventDefault();
    }

    // also run any native onClick passed to the component
    onClick?.(ev as any);
  };

  return (
    <i-card {...hostProps}>
      <a
        className="i-card"
        role="link"
        aria-disabled={disabled ? 'true' : undefined}
        href={hrefAttr}
        rel={relAttr}
        tabIndex={disabled ? -1 : undefined}
        target={target ?? undefined}
        onClick={handleClick}>
        {children}
      </a>
    </i-card>
  );
}

// -----------------------------
// Sub components (same tags)
// -----------------------------

export type ICardImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
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
