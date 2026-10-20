import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useHref, useNavigate } from 'react-router-dom';
import {
  useISession,
  useIUserMenuStore,
} from '../../auth/insight-auth-context';
import {
  INotification,
  type INotificationAction,
  type INotificationState,
} from '../../notification';
import { useHostApiOptional } from '../host-api.context';
import type { IBreadcrumbItem } from '../host-api.types';
import { useHostUi } from '../host-ui.context';
import { isHttpRoute } from '../menu';
import { isPlainLeftClick } from '../menu/menu.utils';
import { toRouterUrl } from '../router-breadcrumbs';

function normalizeCrumbs(
  items: IBreadcrumbItem[] | null | undefined
): IBreadcrumbItem[] {
  if (!items?.length) return [];

  return items.filter((x): x is IBreadcrumbItem => !!x?.label);
}

function isInternalAppUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//') && !isHttpRoute(url);
}

function BreadcrumbLink(props: {
  item: IBreadcrumbItem;
  baseHref: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}) {
  const url = props.item.url!;
  const internal = isInternalAppUrl(url);
  const href = useHref(internal ? toRouterUrl(url, props.baseHref) : '/');
  return (
    <a
      className="ih-content-breadcrumb ih-content-breadcrumb__link"
      href={internal ? href : url}
      onClick={(event) => props.onClick(event, url)}>
      {props.item.label}
    </a>
  );
}

export function IHContent(props: {
  notification?: INotificationState | null;
  onNotificationAction?: (action: INotificationAction) => void;
  title?: string | null;
  breadcrumbs?: IBreadcrumbItem[] | null;
  onSidebarToggled?: (visible: boolean) => void;
  defaultSidebarVisible?: boolean;
  onNavigate?: (url: string) => void;
  /** Current boot loading state - consumed by parent apps to render their own loader. */
  loading?: boolean;
  /** Invoked whenever the boot loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}) {
  const nav = useNavigate();
  const baseHref = useHref('/');

  const { onNavigate, loading, onLoadingChange } = props;

  // Surface loading-state changes (transitions only; the initial value is
  // provided via the `loading` prop).
  useEffect(() => {
    onLoadingChange?.(loading ?? false);
  }, [loading, onLoadingChange]);

  // Asset base from the consumer app's Vite `base` (e.g. "/-/atlas-react/"),
  // so bundled assets like /svgs/* resolve under the app's base path instead
  // of the origin root. Falls back to "/" when not under Vite.
  const assetBase = import.meta.env.BASE_URL ?? '/';

  const crumbs = useMemo(
    () => normalizeCrumbs(props.breadcrumbs),
    [props.breadcrumbs]
  );

  const title =
    props.title ?? (crumbs.length ? crumbs[crumbs.length - 1].label : null);

  const [sidebarVisibility, setSidebarVisibility] = useState(
    props.defaultSidebarVisible ?? true
  );

  const toggleSidebar = useCallback(() => {
    setSidebarVisibility((prev) => {
      const next = !prev;
      props.onSidebarToggled?.(next);
      return next;
    });
  }, [props]);

  const go = useCallback(
    (url: string) => {
      if (onNavigate) return onNavigate(url);
      nav(toRouterUrl(url, baseHref));
    },
    [nav, onNavigate, baseHref]
  );

  const onCrumbClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
      if (!isPlainLeftClick(e)) return;

      if (isInternalAppUrl(url)) {
        e.preventDefault();
        go(url);
      }
    },
    [go]
  );

  return (
    <ih-content>
      <div className="ih-content-header">
        <a className="i-clickable" onClick={toggleSidebar}>
          {sidebarVisibility ? (
            <img alt="sidebar-left" src={`${assetBase}svgs/sidebar-left.svg`} />
          ) : (
            <img
              alt="sidebar-right"
              src={`${assetBase}svgs/sidebar-right.svg`}
            />
          )}
        </a>

        <h1>{title || 'Insight'}</h1>
        {props.notification && (
          <div className="ih-content-header-actions">
            <INotification
              state={props.notification}
              onAction={props.onNotificationAction}
            />
          </div>
        )}
      </div>

      <div className="ih-content-breadcrumbs">
        {crumbs.length ? (
          crumbs.map((b, idx) => {
            const first = idx === 0;
            const last = idx === crumbs.length - 1;

            // first crumb is never clickable
            const clickable = !first && !last && !!b.url;

            return (
              <React.Fragment key={`${b.label}-${idx}`}>
                {clickable ? (
                  <BreadcrumbLink
                    item={b}
                    baseHref={baseHref}
                    onClick={onCrumbClick}
                  />
                ) : (
                  <span
                    className={[
                      'ih-content-breadcrumb',
                      last
                        ? 'ih-content-breadcrumb__current'
                        : 'ih-content-breadcrumb__link',
                      first ? 'ih-content-breadcrumb__first' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}>
                    {b.label}
                  </span>
                )}

                {!last ? (
                  <span className="ih-content-breadcrumb ih-content-breadcrumb__separator">
                    {'>'}
                  </span>
                ) : null}
              </React.Fragment>
            );
          })
        ) : (
          <span className="ih-content-breadcrumb ih-content-breadcrumb__first">
            Home
          </span>
        )}
      </div>

      <div className="ih-content-body scroll scroll-y">
        <Outlet />
      </div>
    </ih-content>
  );
}

/**
 * IHContentLayout
 * - Reads title/breadcrumbs from Host UI context
 * - Uses hostApi.navigate when available (MF host mode),
 * otherwise IHContent falls back to react-router navigate()
 */
export function IHContentLayout(props: {
  notification?: INotificationState | null;
  onNotificationAction?: (action: INotificationAction) => void;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const ui = useHostUi();
  const hostApi = useHostApiOptional();
  const session = useISession();
  const store = useIUserMenuStore();

  return (
    <IHContent
      notification={props.notification}
      onNotificationAction={props.onNotificationAction}
      title={ui.title}
      breadcrumbs={ui.breadcrumbs}
      loading={session.initializing || store.initializing}
      onLoadingChange={props.onLoadingChange}
      onNavigate={hostApi ? (url) => void hostApi.navigate(url) : undefined}
    />
  );
}
