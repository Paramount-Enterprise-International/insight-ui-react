import type { IInsightAuthConfig } from './auth-config';

/**
 * Build the full external URL to iam-web's signin page for a cross-domain SSO
 * redirect, routing the eventual handoff through THIS APP'S OWN callback
 * route (`config.callbackPath`, default `/auth/callback`) — never through the
 * page the user originally tried to visit.
 *
 * This is deliberate and fixes a real redirect loop: if the guard used
 * `window.location.href` (the current page) as the returnUrl directly,
 * iam-web's handoff would append `#at=<token>` to THAT SAME page. Since that
 * page still doesn't have a stored session yet at the moment it re-renders,
 * the guard would fire again, capture `window.location.href` again — which
 * NOW ALREADY CONTAINS the previous `#at=` fragment — and redirect back to
 * iam-web with an ever-growing `returnUrl`, eventually overflowing header
 * size limits (HTTP 431).
 *
 * Routing through a dedicated callback route breaks the loop: the callback
 * page (`AuthCallback`) consumes and strips the token BEFORE navigating (via
 * the in-app router, not a full reload) to `targetPath` — so the guard only
 * ever sees a clean, token-free URL on its next check.
 */
export function buildExternalSigninUrl(config: IInsightAuthConfig, targetPath: string): string {
  const callbackPath = config.callbackPath ?? '/auth/callback';
  const callbackUrl = `${window.location.origin}${callbackPath}?returnUrl=${encodeURIComponent(targetPath)}`;
  return `${config.signinUrl}?returnUrl=${encodeURIComponent(callbackUrl)}`;
}
