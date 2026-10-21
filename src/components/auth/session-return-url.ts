/** Captures a browser destination without forwarding an access-token handoff to sign-in. */
export function getSessionReturnUrl(
  path = window.location.pathname +
    window.location.search +
    window.location.hash
): string {
  const hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    const fragment = path.slice(hashIndex + 1);
    if (new URLSearchParams(fragment).has('at')) {
      const remaining = fragment
        .split('&')
        .filter((part) => !new URLSearchParams(part).has('at'))
        .join('&');
      path = path.slice(0, hashIndex) + (remaining ? `#${remaining}` : '');
    }
  }
  return path.startsWith('/') ? path : `/${path}`;
}

/** Removes the router basename once from a browser path or same-origin absolute URL. */
export function toRouterReturnUrl(
  returnUrl: string,
  basename: string,
  origin = window.location.origin
): string {
  if (
    returnUrl.startsWith('//') ||
    (!returnUrl.startsWith('/') && !/^https?:\/\//i.test(returnUrl))
  )
    return '/';
  try {
    const target = new URL(returnUrl, origin);
    if (target.origin !== origin) return '/';
    const basePath = new URL(basename, origin).pathname.replace(/\/$/, '');
    const pathname =
      target.pathname === basePath
        ? '/'
        : basePath && target.pathname.startsWith(`${basePath}/`)
          ? target.pathname.slice(basePath.length)
          : target.pathname;
    return getSessionReturnUrl(pathname + target.search + target.hash);
  } catch {
    return '/';
  }
}
