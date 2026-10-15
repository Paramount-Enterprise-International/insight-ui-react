import type {
  IBreadcrumbItem,
  IHostRouteMetadata,
  IMenu,
} from './host-api.types';
import { findBreadcrumbMenuChain, getMenuLabel, getMenuRoute } from './menu';
import type { IRoute } from './router.types';

export type RouteBreadcrumbMatch = {
  route: IRoute;
  url: string;
  mountUrl: string;
};

/** Accepts both basename-prefixed and router-relative internal URLs. */
export function toRouterUrl(url: string, baseHref: string): string {
  const base = baseHref.replace(/\/+$/, '');
  if (!base || !url.startsWith('/') || url.startsWith('//')) return url;
  if (
    url === base ||
    url.startsWith(base + '?') ||
    url.startsWith(base + '#')
  ) {
    return '/' + url.slice(base.length);
  }
  return url.startsWith(base + '/') ? url.slice(base.length) : url;
}

export function buildRouteMetadata(
  chain: RouteBreadcrumbMatch[],
  menus: readonly IMenu[],
  baseHref: string
): IHostRouteMetadata {
  const host: IBreadcrumbItem[] = [];
  const remote: IBreadcrumbItem[] = [];
  let mount: RouteBreadcrumbMatch | undefined;
  let title: string | null = null;
  for (const match of chain) {
    const route = match.route;
    if (route.redirectTo) continue;
    if (route.title) title = route.title;
    const label =
      route.breadcrumb === false ? null : (route.breadcrumb ?? route.title);
    const items = mount ? remote : host;
    if (label && items.at(-1)?.label !== label) {
      items.push({
        label,
        url: route.remoteMount ? match.mountUrl : match.url,
      });
    }
    if (route.remoteMount) mount = match;
  }
  let hostTrail = host;
  if (mount) {
    const explicit = mount.route.hostBreadcrumbs;
    const menuChain = findBreadcrumbMenuChain(menus, mount.mountUrl, baseHref);
    if (explicit?.length) hostTrail = explicit;
    else if (menuChain.length) {
      hostTrail = menuChain
        .map((menu) => ({
          label: getMenuLabel(menu),
          url: getMenuRoute(menu) ?? undefined,
        }))
        .filter((item) => !!item.label);
    }
  }
  const breadcrumbs = [...hostTrail, ...remote];
  return { title, breadcrumbs: breadcrumbs.length ? breadcrumbs : null };
}
