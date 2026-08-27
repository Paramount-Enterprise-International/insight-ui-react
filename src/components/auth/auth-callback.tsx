/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { sanitizeReturnUrl } from './sanitize-return-url';
import { useInsightAuth } from './insight-auth-context';

/**
 * Extract the access token appended by iam-web after a successful external SSO
 * redirect. Reads the URL HASH FRAGMENT (`#at=<token>`) — deliberately NOT a
 * query parameter — so the token is never sent to the server and never appears
 * in access/gateway logs (fragments are browser-only).
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
 * path is used as the `returnUrl` when redirecting to iam-web's signin page:
 * ```tsx
 * { path: 'auth/callback', element: <AuthCallback /> }
 * ```
 *
 * Flow:
 *  1. Extract the `at` token from the URL hash fragment.
 *  2. Store it via `session.setAccessToken` (in-memory only).
 *  3. Clear the fragment from the URL immediately (never leave the token
 *     sitting in browser history).
 *  4. Validate & redirect to the original in-app `returnUrl` (query param
 *     `returnUrl`, defaulting to `/`), using the same `sanitizeReturnUrl`
 *     rules as iam-web.
 */
export function AuthCallback(): ReactNode {
  const { config, session } = useInsightAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (handled) return;
    setHandled(true);

    const accessToken = extractAccessTokenFromHash(window.location.hash);

    // Clear the fragment immediately regardless of outcome — the token must
    // never remain visible in the URL / browser history.
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (!accessToken) {
      window.location.href = config.signinUrl;
      return;
    }

    session.setAccessToken(accessToken);

    const rawReturnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';
    const { returnUrl, isExternal } = sanitizeReturnUrl(
      rawReturnUrl,
      config.allowedReturnOrigins,
    );

    // Self-redirect loop guard — a relative returnUrl must never point back at
    // this app's own callback route.
    const callbackPath = config.callbackPath ?? '/auth/callback';
    const safeReturnUrl = !isExternal && returnUrl.startsWith(callbackPath) ? '/' : returnUrl;

    if (isExternal) {
      window.location.href = returnUrl;
    } else {
      void navigate(safeReturnUrl, { replace: true });
    }
  }, [handled, config, session, navigate, location]);

  return null;
}
