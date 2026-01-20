// page.tsx
import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useHostApi } from './host-api.context';
import type { IBreadcrumbItem } from './host-api.types';

export type IRPageCtx = {
  pathname: string;
  params: Record<string, string | undefined>;
};

export type IRTitle = string | null | ((ctx: IRPageCtx) => string | null);

export type IRBreadcrumb =
  | IBreadcrumbItem
  | ((ctx: IRPageCtx) => IBreadcrumbItem | null | undefined);

export type IRPageProps = {
  title: IRTitle;
  breadcrumbs: IRBreadcrumb[] | ((ctx: IRPageCtx) => IRBreadcrumb[]);
  clearOnUnmount?: boolean;
  children: React.ReactNode;
};

function resolveTitle(title: IRTitle, ctx: IRPageCtx): string | null {
  return typeof title === 'function' ? title(ctx) : title;
}

function resolveBreadcrumbs(
  crumbs: IRPageProps['breadcrumbs'],
  ctx: IRPageCtx
): IBreadcrumbItem[] {
  const list = typeof crumbs === 'function' ? crumbs(ctx) : crumbs;

  const out: IBreadcrumbItem[] = [];
  for (const c of list) {
    const resolved = typeof c === 'function' ? c(ctx) : c;
    if (!resolved) continue;
    if (resolved.label) out.push({ label: resolved.label, url: resolved.url });
  }
  return out;
}

export function IRPage(props: IRPageProps) {
  const hostApi = useHostApi();
  const loc = useLocation();
  const params = useParams();

  const ctx = useMemo<IRPageCtx>(
    () => ({
      pathname: loc.pathname,
      params: params as Record<string, string | undefined>,
    }),
    [loc.pathname, params]
  );

  useEffect(() => {
    const title = resolveTitle(props.title, ctx);
    const crumbs = resolveBreadcrumbs(props.breadcrumbs, ctx);

    hostApi.setTitle(title);
    hostApi.setBreadcrumbs(crumbs.length ? crumbs : null);
    // IMPORTANT: include ctx.pathname so it updates on route change
  }, [hostApi, ctx.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!props.clearOnUnmount) return;
    return () => {
      hostApi.setTitle(null);
      hostApi.setBreadcrumbs(null);
    };
  }, [hostApi, props.clearOnUnmount]);

  return <>{props.children}</>;
}
