/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, type ReactNode } from 'react';
import { useHref, useLocation, useNavigate } from 'react-router-dom';

import { useIAuthContext } from './insight-auth-context';
import { sanitizeReturnUrl } from './sanitize-return-url';
import { getSessionReturnUrl, toRouterReturnUrl } from './session-return-url';

/**
 * Extract the access token appended by the sign-in host after a successful
 * external SSO redirect. Reads the URL HASH FRAGMENT (`#at=<token>`) —
 * deliberately NOT a query parameter — so the token is never sent to the
 * server and never appears in access/gateway logs (fragments are browser-only).
 */
export function extractAccessTokenFromHash(hash?: string): string | null {
  const current = hash ?? window.location.hash;
  if (!current || current.length < 2) {
    return null;
  }
  const params = new URLSearchParams(current.substring(1));
  return params.get('at');
}

/**
 * Reusable SSO callback route component for @insight/ui consumer apps — the
 * React analog of Angular's `IAuthCallback`. Register it at whatever route
 * path is used as the `returnUrl` when redirecting to the configured signinUrl:
 * ```tsx
 * { path: 'auth/callback', element: <IAuthCallback /> }
 * ```
 *
 * Flow:
 *  1. Extract the `at` token from the URL hash fragment.
 *  2. Store it via `session.setAccessToken` (in-memory only).
 *  3. Clear the fragment from the URL immediately (never leave the token
 *     sitting in browser history).
 *  4. Validate & redirect to the original in-app `returnUrl` (query param
 *     `returnUrl`, defaulting to `/`), using the same `sanitizeReturnUrl`
 *     rules as the sign-in page.
 */
export function IAuthCallback(): ReactNode {
  const { config, session, sessionExpired } = useIAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const handled = useRef(false);
  const basename = useHref('/');
  const rawReturnUrl =
    new URLSearchParams(location.search).get('returnUrl') || '/';
  const sanitized = sanitizeReturnUrl(
    rawReturnUrl,
    config.allowedReturnOrigins
  );
  const isExternal =
    sanitized.isExternal &&
    new URL(sanitized.returnUrl).origin !== window.location.origin;
  const returnUrl = isExternal
    ? sanitized.returnUrl
    : toRouterReturnUrl(sanitized.returnUrl, basename);
  const callbackPath = toRouterReturnUrl(
    config.callbackPath ?? '/auth/callback',
    basename
  )
    .split(/[?#]/)[0]
    .replace(/\/+$/, '');
  const destinationPath = returnUrl.split(/[?#]/)[0].replace(/\/+$/, '');
  const safeReturnUrl =
    !isExternal &&
    (destinationPath === callbackPath ||
      destinationPath.startsWith(`${callbackPath}/`))
      ? '/'
      : returnUrl;
  const destinationHref = useHref(isExternal ? '/' : safeReturnUrl);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = extractAccessTokenFromHash(location.hash);

    // Clear the fragment immediately regardless of outcome — the token must
    // never remain visible in the URL / browser history.
    if (window.location.hash) {
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }

    if (!accessToken && !session.isAuth()) {
      sessionExpired.show(
        isExternal ? safeReturnUrl : getSessionReturnUrl(destinationHref),
        'TOKEN_EXPIRED',
        'AUTH_NO_SESSION'
      );
      return;
    }

    if (accessToken) session.setAccessToken(accessToken);

    if (isExternal) {
      window.location.href = safeReturnUrl;
    } else {
      void navigate(safeReturnUrl, { replace: true });
    }
  }, [
    session,
    sessionExpired,
    navigate,
    location.hash,
    isExternal,
    safeReturnUrl,
    destinationHref,
  ]);

  return null;
}
