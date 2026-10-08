import React from 'react';
import { MENU_ICON_FALLBACK } from '../host.constants';

/** True when the class string contains a FontAwesome `fa-*` token (matches Angular). */
function hasFaToken(icon: string | null | undefined): boolean {
  return /(?:^|\s)fa-[a-z0-9-]+(?:\s|$)/i.test(icon ?? '');
}

/**
 * Resolve a menu icon to a concrete FontAwesome class (fallback when missing or
 * not a valid `fa-*` token), appending `fa-fw` for fixed-width alignment -
 * matches the Angular `menuIcon` getter.
 */
export function resolveMenuIcon(icon: string | null | undefined): string {
  const value = (icon ?? '').trim();
  return `${hasFaToken(value) ? value : MENU_ICON_FALLBACK} fa-fw`;
}

export function appendMenuFilterToUrl(raw: string, rawFilter: string): string {
  const term = (rawFilter ?? '').trim();

  if (!term) return raw;

  try {
    const u = new URL(raw);
    u.searchParams.set('menu-filter', term);
    return u.toString();
  } catch {
    const origin = window.location.origin;
    const u = new URL(raw, origin);

    u.searchParams.set('menu-filter', term);

    return `${u.pathname}${u.search}${u.hash}`;
  }
}

export function isPlainLeftClick(e: React.MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
