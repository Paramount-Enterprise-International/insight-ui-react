export type ISanitizedReturnUrl = {
  returnUrl: string;
  isExternal: boolean;
};

/**
 * Validate and sanitize a `returnUrl` for post-login / post-callback redirect.
 * Ported from iam-web's `signin.ts::sanitizeReturnUrl()` — behavior is kept
 * identical so consumer apps and iam-web enforce the exact same open-redirect
 * protection:
 *
 * - Relative paths (starting with `/`) are always allowed.
 * - Protocol-relative URLs (`//`) are rejected — always fall back to `/`.
 * - Absolute URLs are checked against `allowedReturnOrigins` (wildcard
 *   supported, e.g. `https://*.paramountenterprise.co.id`).
 * - Anything else (invalid URL, untrusted origin, unknown scheme) falls back to `/`.
 *
 * `isExternal: true` means the caller must do a full `window.location.href`
 * navigation, not an in-app router navigation.
 */
export function sanitizeReturnUrl(
  url: string | null | undefined,
  allowedReturnOrigins: string[],
): ISanitizedReturnUrl {
  if (!url) {
    return { returnUrl: '/', isExternal: false };
  }

  // Block protocol-relative URLs (//evil.com)
  if (url.startsWith('//')) {
    return { returnUrl: '/', isExternal: false };
  }

  // Relative path — always safe
  if (url.startsWith('/')) {
    return { returnUrl: url, isExternal: false };
  }

  // Absolute URL — validate against trusted origins
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (isAllowedOrigin(parsed.origin, allowedReturnOrigins)) {
        return { returnUrl: url, isExternal: true };
      }
    } catch {
      // Invalid URL — reject
    }
  }

  // Unknown scheme or untrusted origin — fall back to home
  return { returnUrl: '/', isExternal: false };
}

/** Check whether an origin matches the `allowedReturnOrigins` whitelist (wildcard supported). */
function isAllowedOrigin(origin: string, allowedReturnOrigins: string[]): boolean {
  const allowed = allowedReturnOrigins ?? [];
  return allowed.some((pattern) => {
    // Convert wildcard pattern to regex: https://*.example.com → ^https:\/\/[^.]+\.example\.com$
    // Escape each literal segment separately so `*` itself is never escaped away.
    const regexStr = pattern
      .split('*')
      .map((segment) => segment.replace(/[.+^${}()|[\]\\]/g, '\\$&'))
      .join('[^.]+'); // * matches a single subdomain label
    try {
      return new RegExp(`^${regexStr}$`, 'i').test(origin);
    } catch {
      return origin === pattern; // fallback: exact match
    }
  });
}
