// host.tsx
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IAvatar } from '../avatar';
import { useOptionalIConfirm } from '../dialog/dialog';
import { useSession, useUserMenuStore } from '../auth/insight-auth-context';
import { IHostApiProvider, useHostApiOptional } from './host-api.context';
import type {
  IBreadcrumbItem,
  IHostApi,
  IMenu,
  IMenuFavoriteReorderEvent,
  IMenuFavoriteToggleEvent,
  IUser,
} from './host-api.types';
import { IHostUiProvider, useHostUi } from './host-ui.context';
import {
  buildFavoritePathMap,
  getMenuChildren,
  getMenuKey,
  getMenuLabel,
  getMenuRoute,
  hasMenuChildren,
  isGroupNode,
  isHttpRoute,
  isLeafItem,
  isModuleMenu,
  isNewTabMenu,
  isReloadMenu,
  isSpaMenu,
  normalizeMenuTree,
} from './menu';

/* =========================================================
 * Highlight (Angular pipe replacement)
 * ========================================================= */

function escapeHtml(input: string): string {
  return (input ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function highlightSearchHtml(text: string, rawTerm: string): string {
  const term = (rawTerm ?? '').trim();
  if (!term) return escapeHtml(text ?? '');

  const safeText = text ?? '';
  const lower = safeText.toLowerCase();
  const lowerTerm = term.toLowerCase();

  let out = '';
  let i = 0;

  while (i < safeText.length) {
    const idx = lower.indexOf(lowerTerm, i);
    if (idx === -1) {
      out += escapeHtml(safeText.slice(i));
      break;
    }

    out += escapeHtml(safeText.slice(i, idx));
    out += `<span class="highlight-search">${escapeHtml(
      safeText.slice(idx, idx + term.length)
    )}</span>`;
    i = idx + term.length;
  }

  return out;
}

const Highlighted = memo(function Highlighted(props: {
  text: string;
  term: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const { text, term, as = 'span' } = props;
  const html = useMemo(() => highlightSearchHtml(text, term), [text, term]);
  const Tag: React.ElementType = as;

  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
});

/* =========================================
 * Menu icon fallback
 * ========================================= */

/** Fallback FontAwesome class used by sidebar rows when a menu icon is missing. */
const MENU_ICON_FALLBACK = 'fa-brands fa-microsoft';

/** Synthetic group id used by the sidebar's Favorites section — keeps its icon. */
const SIDEBAR_FAVORITES_GROUP_ID = 'favorites';

/** True when the class string contains a FontAwesome `fa-*` token (matches Angular). */
function hasFaToken(icon: string | null | undefined): boolean {
  return /(?:^|\s)fa-[a-z0-9-]+(?:\s|$)/i.test(icon ?? '');
}

/**
 * Resolve a menu icon to a concrete FontAwesome class (fallback when missing or
 * not a valid `fa-*` token), appending `fa-fw` for fixed-width alignment —
 * matches the Angular `menuIcon` getter.
 */
function resolveMenuIcon(icon: string | null | undefined): string {
  const value = (icon ?? '').trim();
  return `${hasFaToken(value) ? value : MENU_ICON_FALLBACK} fa-fw`;
}

function appendMenuFilterToUrl(raw: string, rawFilter: string): string {
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

/* =========================================
 * Breadcrumb helpers
 * ========================================= */

function normalizeCrumbs(
  items: IBreadcrumbItem[] | null | undefined
): IBreadcrumbItem[] {
  if (!items?.length) return [];

  return items.filter((x): x is IBreadcrumbItem => !!x?.label);
}

function isPlainLeftClick(e: React.MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

function isInternalAppUrl(url: string): boolean {
  return url.startsWith('/') && !isHttpRoute(url);
}

/* =========================================
 * IHContent (wrapper)
 * ========================================= */

export function IHContent(props: {
  title?: string | null;
  breadcrumbs?: IBreadcrumbItem[] | null;
  onSidebarToggled?: (visible: boolean) => void;
  defaultSidebarVisible?: boolean;
  onNavigate?: (url: string) => void;
  /** Current boot loading state — consumed by parent apps to render their own loader. */
  loading?: boolean;
  /** Invoked whenever the boot loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}) {
  const nav = useNavigate();

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
      nav(url);
    },
    [nav, onNavigate]
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
            <img alt="sidebar-right" src={`${assetBase}svgs/sidebar-right.svg`} />
          )}
        </a>

        <h1>{title || 'Insight'}</h1>
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
                  <a
                    className="ih-content-breadcrumb ih-content-breadcrumb__link"
                    href={b.url}
                    onClick={(e) => onCrumbClick(e, b.url!)}>
                    {b.label}
                  </a>
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
 *   otherwise IHContent falls back to react-router navigate()
 */
export function IHContentLayout(props: {
  onLoadingChange?: (loading: boolean) => void;
}) {
  const ui = useHostUi();
  const hostApi = useHostApiOptional();
  const session = useSession();
  const store = useUserMenuStore();

  return (
    <IHContent
      title={ui.title}
      breadcrumbs={ui.breadcrumbs}
      loading={session.initializing || store.initializing}
      onLoadingChange={props.onLoadingChange}
      onNavigate={hostApi ? (url) => void hostApi.navigate(url) : undefined}
    />
  );
}

/* =========================================================
 * Filtering (same rules as Angular)
 * ========================================================= */

function filterMenuTree(menus: IMenu[], rawTerm: string): IMenu[] {
  const term = (rawTerm ?? '').trim().toLowerCase();
  if (!term) return menus;

  const filtered: IMenu[] = [];
  for (const menu of menus) {
    const result = filterMenuBranch(menu, term);
    if (result) filtered.push(result);
  }

  return filtered;
}

function filterMenuBranch(menu: IMenu, term: string): IMenu | null {
  const name = (menu.menuName ?? '').toLowerCase();
  const selfMatches = name.includes(term);

  const originalChildren = menu.child ?? [];

  const filteredChildren: IMenu[] = [];
  for (const child of originalChildren) {
    const childResult = filterMenuBranch(child, term);
    if (childResult) filteredChildren.push(childResult);
  }

  const childMatches = filteredChildren.length > 0;
  if (!selfMatches && !childMatches) return null;

  const childrenToUse = selfMatches ? originalChildren : filteredChildren;
  const cloned: IMenu = { ...menu, child: childrenToUse };

  if (Number(cloned.menuTypeId) === 3 && (selfMatches || childMatches)) {
    cloned.visibility = 'expanded';
  }

  return cloned;
}

function flattenNavigableMenus(menus: IMenu[]): IMenu[] {
  const result: IMenu[] = [];

  const visit = (menu: IMenu) => {
    const children = menu.child ?? [];
    const hasChildren = children.length > 0;

    const isLeaf =
      Number(menu.menuTypeId) === 3 &&
      (!hasChildren || menu.visibility === 'no-child');

    if (isLeaf) result.push(menu);

    for (const c of children) visit(c);
  };

  for (const m of menus) visit(m);

  return result;
}

/* =========================================================
 * IHMenu (recursive)
 * ========================================================= */

type IHMenuProps = {
  menu?: IMenu;
  filter: string;
  selectedMenuId: string | number | null;
  onToggleGroup: (menuId: string | number) => void;
  collapsible?: boolean;
  favoriteMode?: boolean;
  /** Render leaf rows draggable (used by the Favorites section for reorder). */
  dragEnabled?: boolean;
  /** Nesting depth from the sidebar root (0 = top level) — drives indentation + the top-level "no group icon" rule. */
  depth?: number;
  /** Render the owning application name next to leaf labels (used by the Favorites section). */
  showApplication?: boolean;
  /** Per-menu-key ancestor path labels (sidebar Favorites section) - rendered instead of the application name when present. */
  pathByKey?: Record<string, string | undefined>;
  onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
};

export const IHMenu = memo(function IHMenu(props: IHMenuProps) {
  const {
    menu,
    filter,
    selectedMenuId,
    onToggleGroup,
    collapsible,
    favoriteMode,
    dragEnabled,
    depth = 0,
    showApplication = false,
    pathByKey,
    onFavoriteToggle,
  } = props;
  const navigate = useNavigate();

  const menuItemRef = useRef<HTMLElement | null>(null);

  const menuKey = useMemo(() => getMenuKey(menu), [menu]);
  const menuLabel = useMemo(() => getMenuLabel(menu), [menu]);
  const menuRoute = useMemo(() => getMenuRoute(menu), [menu]);
  const hasChild = useMemo(() => hasMenuChildren(menu), [menu]);
  const menuChildren = useMemo(() => getMenuChildren(menu), [menu]);
  const isModuleNode = useMemo(() => isModuleMenu(menu), [menu]);
  const isGroupNodeValue = useMemo(() => isGroupNode(menu), [menu]);
  const isLeaf = useMemo(() => isLeafItem(menu), [menu]);
  const isFavoritesGroup = menuKey === SIDEBAR_FAVORITES_GROUP_ID;
  const isNewTab = isNewTabMenu(menu);
  const isReload = isReloadMenu(menu);
  const isSpa = isSpaMenu(menu);
  const menuIsFavorite = !!menu?.isFavorite;
  const confirm = useOptionalIConfirm();

  // Favorite subtitle: the ancestor path from the sidebar menu tree when one is
  // known, otherwise the owning application name (fallback).
  const favoriteSubtitle = useMemo(() => {
    if (!showApplication) return null;
    const keyString = menuKey != null ? String(menuKey) : null;
    const stored = keyString && pathByKey ? pathByKey[keyString] : undefined;
    return stored !== undefined ? stored : menu?.application?.name ?? null;
  }, [showApplication, menuKey, pathByKey, menu]);

  const iconClass = useMemo(() => resolveMenuIcon(menu?.icon), [menu]);

  // Expanded unless collapsible + explicitly collapsed (flat menus never collapse).
  const isGroupExpanded = useMemo(() => {
    if (!collapsible) return true;
    return menu?.visibility !== 'collapsed';
  }, [collapsible, menu?.visibility]);

  const href = useMemo(() => {
    if (!menuRoute) return '#';

    return appendMenuFilterToUrl(menuRoute, filter);
  }, [menuRoute, filter]);

  const isSelected = useMemo(() => {
    if (!menu) return false;
    const matchesId = menuKey !== null && menuKey === selectedMenuId;
    if (!matchesId) return false;
    return isLeaf;
  }, [menu, menuKey, selectedMenuId, isLeaf]);

  useLayoutEffect(() => {
    if (isSelected && menuItemRef.current) {
      menuItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isSelected]);

  const clickGroup = useCallback(() => {
    if (!menu) return;
    if (menuKey === null) return;
    if (menu.visibility !== 'no-child') onToggleGroup(menuKey);
  }, [menu, menuKey, onToggleGroup]);

  const renderIndent = () => {
    // First-level children of a group render flush-left (0); deeper levels
    // indent from there — matches Angular's `indentLevel = depth - 1`.
    const indentLevel = Math.max(0, depth - 1);
    if (!indentLevel) return null;

    return Array.from({ length: indentLevel }).map((_, i) => (
      <span key={i} className={`indent-${depth}`}></span>
    ));
  };

  const onLeafClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!menu) return;
      if (!menuRoute) return;

      // keep browser behavior for right click, middle click, cmd/ctrl-click, etc
      if (!isPlainLeftClick(e)) return;

      // new tab, reload, and http routes use normal browser navigation
      if (isNewTab) return;
      if (isReload) return;

      // only SPA route should be handled by React Router
      if (isSpa) {
        e.preventDefault();
        navigate(href);
      }
    },
    [menu, menuRoute, isNewTab, isReload, isSpa, href, navigate]
  );

  const onToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (menuKey === null) return;

      const toFavorite = !menuIsFavorite;

      // Unfavorite is destructive - confirm before removing the pin.
      if (!toFavorite && confirm) {
        const menuName = getMenuLabel(menu) || 'this menu';
        const ok = await confirm.warning(
          'Remove from Favorites',
          `Remove <strong>${menuName}</strong> from your favorites?`
        );
        if (!ok) return;
      }

      onFavoriteToggle?.({ id: menuKey, isFavorite: toFavorite });
    },
    [menuKey, menuIsFavorite, onFavoriteToggle, confirm, menu]
  );

  if (!menu) return null;

  const menuDragProps = {
    'data-menu-id': dragEnabled && menuKey != null ? String(menuKey) : undefined,
  };

  const renderLeafInner = () => (
    <>
      {renderIndent()}

      <i className={iconClass}></i>

      <span
        className={[
          'ih-menu-label',
          showApplication ? 'ih-menu-label--compact' : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        <h6>
          <Highlighted text={menuLabel} term={filter} />
        </h6>
        {favoriteSubtitle ? (
          <small className="ih-menu-application">{favoriteSubtitle}</small>
        ) : null}
      </span>

      {favoriteMode && onFavoriteToggle ? (
        <i
          className={`ih-menu-favorite ${
            menuIsFavorite ? 'fa-solid fa-star is-favorite' : 'fa-regular fa-star'
          }`}
          role="button"
          tabIndex={0}
          aria-label={menuIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={onToggleFavorite}></i>
      ) : null}
    </>
  );

  return (
    <ih-menu data-ih-menu>
      <li
        className={[
          isModuleNode ? 'is-module' : '',
          isModuleNode ? (menu.visibility ?? '') : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {isModuleNode ? (
          <small
            className={[
              'ih-menu-module',
              collapsible && hasChild ? 'ih-menu-module--collapsible' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={collapsible && hasChild ? clickGroup : undefined}>
            <span>
              <Highlighted text={menuLabel} term={filter} />
            </span>

            {collapsible && hasChild ? (
              <i
                className={[
                  'ih-menu-chevron',
                  isGroupExpanded ? 'fas fa-angle-up' : 'fas fa-angle-down',
                ]
                  .filter(Boolean)
                  .join(' ')}></i>
            ) : null}
          </small>
        ) : isGroupNodeValue ? (
          <div
            className={[
              'ih-menu-group',
              collapsible ? 'ih-menu-group--collapsible' : '',
              depth === 0 ? 'ih-menu-group--top' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            data-menu-id={dragEnabled && menuKey != null ? String(menuKey) : undefined}
            onClick={collapsible ? clickGroup : undefined}>
            {renderIndent()}

            {depth > 0 || isFavoritesGroup ? <i className={iconClass}></i> : null}

            <h6>
              <Highlighted text={menuLabel} term={filter} />
            </h6>

            {collapsible ? (
              <i
                className={[
                  'ih-menu-chevron',
                  isGroupExpanded ? 'fas fa-angle-up' : 'fas fa-angle-down',
                ]
                  .filter(Boolean)
                  .join(' ')}></i>
            ) : null}
          </div>
        ) : (
          <>
            {isNewTab && menuRoute ? (
              <a
                className={isSelected ? 'is-new-tab is-selected' : 'is-new-tab'}
                rel="noopener noreferrer"
                target="_blank"
                href={href}
                {...menuDragProps}>
                {renderLeafInner()}
              </a>
            ) : isReload && menuRoute ? (
              <a
                className={isSelected ? 'is-reload is-selected' : 'is-reload'}
                target="_self"
                href={href}
                {...menuDragProps}>
                {renderLeafInner()}
              </a>
            ) : isSpa && menuRoute ? (
              <a
                ref={(el) => {
                  menuItemRef.current = el as unknown as HTMLElement | null;
                }}
                className={isSelected ? 'is-spa is-selected' : 'is-spa'}
                href={href}
                onClick={onLeafClick}
                {...menuDragProps}>
                {renderLeafInner()}
              </a>
            ) : null}
          </>
        )}

        {hasChild ? (
          <ul
            className={
              (isGroupNodeValue || isModuleNode) && collapsible
                ? isGroupExpanded
                  ? 'expanded'
                  : 'collapsed'
                : ''
            }>
            {menuChildren.map((m) => (
              <IHMenu
                key={String(getMenuKey(m))}
                menu={m}
                filter={filter}
                selectedMenuId={selectedMenuId}
                onToggleGroup={onToggleGroup}
                collapsible={collapsible}
                favoriteMode={favoriteMode}
                dragEnabled={dragEnabled}
                pathByKey={pathByKey}
                showApplication={showApplication}
                depth={depth + 1}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </ul>
        ) : null}
      </li>
    </ih-menu>
  );
});

/* =========================================================
 * FavoritesSection (pinned favorites + drag-drop reorder)
 * ========================================================= */

function FavoritesSection({
  favorites,
  menus,
  collapsible,
  onFavoriteToggle,
  onFavoriteReorder,
}: {
  favorites: IMenu[];
  /** Full (unfiltered) normalized menu tree - source for favorite ancestor paths. */
  menus: IMenu[];
  collapsible?: boolean;
  onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
  onFavoriteReorder?: (event: IMenuFavoriteReorderEvent) => void;
}) {
  // Local collapsed state for the synthetic Favorites group (it is not part of
  // the sidebar's menuTree, so IHSidebar's onToggleGroup cannot manage it).
  const [favoritesCollapsed, setFavoritesCollapsed] = useState(false);

  // Local order — live-updates during a pointer drag (mirrors Angular's
  // `favoriteItems` signal). The real order is owned by the host app.
  const [favoriteItems, setFavoriteItems] = useState<IMenu[]>(favorites);
  const [dragOver, setDragOver] = useState(false);

  const listRef = useRef<HTMLUListElement | null>(null);
  const itemsRef = useRef<IMenu[]>(favorites);
  const dragRef = useRef<{
    menuId: string;
    startY: number;
    moved: boolean;
    lastTargetIndex: number | null;
    ghost: HTMLElement | null;
  } | null>(null);
  const dragHandlersRef = useRef<{ move: (e: MouseEvent) => void; up: () => void } | null>(null);

  useEffect(() => {
    itemsRef.current = favorites;
    setFavoriteItems(favorites);
  }, [favorites]);

  // Ancestor path labels per favorite key, resolved from the full menu tree.
  const pathByKey = useMemo(
    () => buildFavoritePathMap(menus, favoriteItems),
    [menus, favoriteItems]
  );

  // Synthetic "Favorites" group rendered through the standard IHMenu so it gets
  // the exact same styling as the Angular sidebar (ih-menu classes + star).
  const group = useMemo<IMenu | null>(() => {
    if (!favoriteItems?.length) return null;
    const node: IMenu = {
      id: SIDEBAR_FAVORITES_GROUP_ID,
      name: 'Favorites',
      type: 'group',
      icon: 'fa-solid fa-star',
      visibility: favoritesCollapsed ? 'collapsed' : 'expanded',
      children: favoriteItems,
    };
    return normalizeMenuTree([node])[0] ?? null;
  }, [favoriteItems, favoritesCollapsed]);

  const computeDropIndex = useCallback((clientY: number): number => {
    const host = listRef.current;
    if (!host) return 0;
    // Only count LEAF rows — exclude the synthetic "Favorites" group header so
    // the returned index maps 1:1 onto the favorites array (otherwise every
    // index is offset by +1 and bottom-to-top drags land in the wrong slot).
    const leaves = Array.from(
      host.querySelectorAll<HTMLElement>('.ih-sidebar-favorites [data-menu-id]'),
    ).filter((el) => el.getAttribute('data-menu-id') !== SIDEBAR_FAVORITES_GROUP_ID);
    for (let i = 0; i < leaves.length; i++) {
      const rect = leaves[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return leaves.length;
  }, []);

  /** Live-reorders the favorites so the target position is previewed while dragging. */
  const reorderLive = useCallback((menuId: string, targetIndex: number) => {
    const items = itemsRef.current;
    const sourceIndex = items.findIndex((menu) => String(getMenuKey(menu)) === menuId);
    if (sourceIndex === -1) return;
    // Removing from before the target shifts the insertion point by one.
    const insertAt = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    if (insertAt === sourceIndex) return;
    const reordered = [...items];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(insertAt, 0, moved);
    itemsRef.current = reordered;
    setFavoriteItems(reordered);
  }, []);

  const cleanupDrag = useCallback(() => {
    const handlers = dragHandlersRef.current;
    const ghost = dragRef.current?.ghost ?? null;
    dragRef.current = null;
    dragHandlersRef.current = null;
    setDragOver(false);
    listRef.current
      ?.querySelectorAll('.is-dragging')
      .forEach((el) => el.classList.remove('is-dragging'));
    if (handlers) {
      document.removeEventListener('mousemove', handlers.move);
      document.removeEventListener('mouseup', handlers.up);
    }
    ghost?.remove();
  }, []);

  /** Begins a pointer-based favorites drag from a leaf inside the favorites list. */
  const startDrag = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      const leaf = target.closest<HTMLElement>('.ih-sidebar-favorites [data-menu-id]');
      if (!leaf) return;
      const menuId = leaf.dataset['menuId'];
      if (!menuId) return;

      // Prevent text selection and any native drag/OS behavior.
      event.preventDefault();

      // Translucent clone (drag ghost) that follows the pointer — hidden until
      // the drag actually starts (past the 5px threshold).
      const ghost = leaf.cloneNode(true) as HTMLElement;
      ghost.classList.add('ih-drag-ghost');
      ghost.classList.remove('is-dragging');
      ghost.style.display = 'none';
      document.body.appendChild(ghost);

      dragRef.current = {
        menuId,
        startY: event.clientY,
        moved: false,
        lastTargetIndex: null,
        ghost,
      };
      leaf.classList.add('is-dragging');

      const move = (e: MouseEvent) => {
        const state = dragRef.current;
        if (!state) return;
        // Ignore tiny jitters so a plain click isn't treated as a drag.
        if (!state.moved && Math.abs(e.clientY - state.startY) < 5) return;
        state.moved = true;
        if (state.ghost) {
          state.ghost.style.display = '';
          state.ghost.style.left = `${e.clientX}px`;
          state.ghost.style.top = `${e.clientY}px`;
        }
        const targetIndex = computeDropIndex(e.clientY);
        if (targetIndex !== state.lastTargetIndex) {
          reorderLive(state.menuId, targetIndex);
          state.lastTargetIndex = targetIndex;
        }
        setDragOver(true);
      };

      const up = () => {
        const state = dragRef.current;
        if (!state) return;
        if (state.moved) {
          const reordered = itemsRef.current;
          cleanupDrag();
          const menuIds = reordered
            .map((menu) => getMenuKey(menu))
            .filter((key): key is string | number => key !== null && key !== undefined);
          onFavoriteReorder?.({ menuIds });
        } else {
          cleanupDrag();
        }
      };

      dragHandlersRef.current = { move, up };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    [computeDropIndex, reorderLive, cleanupDrag, onFavoriteReorder],
  );

  if (!group) return null;

  return (
    <ul
      ref={listRef}
      className={['ih-sidebar-favorites', dragOver ? 'is-drag-over' : '']
        .filter(Boolean)
        .join(' ')}
      onMouseDown={startDrag}>
      <IHMenu
        menu={group}
        filter=""
        selectedMenuId={null}
        onToggleGroup={() => setFavoritesCollapsed((c) => !c)}
        collapsible={collapsible}
        favoriteMode
        pathByKey={pathByKey}
        onFavoriteToggle={onFavoriteToggle}
        dragEnabled
        showApplication
      />
    </ul>
  );
}

/* =========================================================
 * IHSidebar
 * ========================================================= */

export type IHSidebarProps = {
  user?: IUser | null;
  menus: IMenu[];
  visible?: boolean;
  footerText?: string;
  /** Enable collapsible module headers (chevron + click-to-collapse). */
  collapsible?: boolean;
  /** Enable the favorites section + per-row star toggles. */
  favoriteMode?: boolean;
  /** Favorite menus (modern shape) rendered in the pinned section at the top. */
  favorites?: IMenu[];
  onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
  onFavoriteReorder?: (event: IMenuFavoriteReorderEvent) => void;
};

export function IHSidebar(props: IHSidebarProps) {
  const {
    user,
    menus,
    visible = true,
    footerText = 'Insight Local',
    collapsible = false,
    favoriteMode = false,
    favorites = [],
    onFavoriteToggle,
    onFavoriteReorder,
  } = props;

  const location = useLocation();
  const navigate = useNavigate();

  const initialFilter = useMemo(() => {
    const sp = new URLSearchParams(location.search);

    return sp.get('menu-filter') ?? '';
  }, [location.search]);

  const [menuFilter, setMenuFilter] = useState(initialFilter);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | number | null>(null);

  // Normalize modern (contract-aligned) menu nodes into the legacy shape IHMenu renders.
  const [menuTree, setMenuTree] = useState<IMenu[]>(() => normalizeMenuTree(menus));

  useEffect(() => {
    setMenuTree(normalizeMenuTree(menus));
  }, [menus]);

  const filteredMenus = useMemo(
    () => filterMenuTree(menuTree, menuFilter),
    [menuTree, menuFilter]
  );

  const navigableMenus = useMemo(
    () => flattenNavigableMenus(filteredMenus),
    [filteredMenus]
  );

  const updateUrl = useCallback(
    (nextFilter: string) => {
      const sp = new URLSearchParams(location.search);
      const f = nextFilter.trim();

      if (f) sp.set('menu-filter', f);
      else sp.delete('menu-filter');

      navigate(
        { search: sp.toString() ? `?${sp.toString()}` : '' },
        { replace: true }
      );
    },
    [location.search, navigate]
  );

  useEffect(() => {
    const hasFilter = !!menuFilter.trim();

    if (!navigableMenus.length || !hasFilter) {
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
      return;
    }

    if (keyboardNavActive) {
      const maxIndex = navigableMenus.length - 1;
      let idx = selectedIndex;
      if (idx == null || idx < 0 || idx > maxIndex) idx = 0;

      setSelectedIndex(idx);
      setSelectedMenuId(getMenuKey(navigableMenus[idx]));
    } else {
      setSelectedIndex(null);
      setSelectedMenuId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigableMenus, menuFilter]);

  const onFilterChange = useCallback(
    (next: string) => {
      setMenuFilter(next);
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
      updateUrl(next);
    },
    [updateUrl]
  );

  const navigateToMenu = useCallback(
    (menu: IMenu) => {
      const route = getMenuRoute(menu);

      if (!route) return;

      const urlWithFilter = appendMenuFilterToUrl(route, menuFilter);

      if (isNewTabMenu(menu)) {
        window.open(urlWithFilter, '_blank', 'noopener,noreferrer');
        return;
      }

      if (isReloadMenu(menu)) {
        window.location.href = urlWithFilter;
        return;
      }

      if (isSpaMenu(menu)) {
        navigate(urlWithFilter);
      }
    },
    [menuFilter, navigate]
  );

  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!navigableMenus.length) return;
      if (!menuFilter.trim()) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          setSelectedIndex(0);
          setSelectedMenuId(getMenuKey(navigableMenus[0]));
          return;
        }

        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current + 1 > max ? 0 : current + 1;
          setSelectedMenuId(getMenuKey(navigableMenus[next]));
          return next;
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          const last = navigableMenus.length - 1;
          setSelectedIndex(last);
          setSelectedMenuId(getMenuKey(navigableMenus[last]));
          return;
        }

        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current - 1 < 0 ? max : current - 1;
          setSelectedMenuId(getMenuKey(navigableMenus[next]));
          return next;
        });
      } else if (event.key === 'Enter') {
        if (!keyboardNavActive) return;

        event.preventDefault();

        const idx = selectedIndex;
        if (idx == null || idx < 0 || idx >= navigableMenus.length) return;

        navigateToMenu(navigableMenus[idx]);
      }
    },
    [
      navigableMenus,
      menuFilter,
      keyboardNavActive,
      selectedIndex,
      navigateToMenu,
    ]
  );

  const onToggleGroup = useCallback((menuId: string | number) => {
    const update = (list: IMenu[]): IMenu[] =>
      list.map((m) => {
        if (getMenuKey(m) === menuId) {
          if (m.visibility !== 'no-child') {
            // Treat unset visibility as expanded so a default (flat) group
            // collapses on the first click (matches Angular).
            const isExpanded = m.visibility !== 'collapsed';
            const nextVis = isExpanded ? 'collapsed' : 'expanded';

            return { ...m, visibility: nextVis };
          }

          return m;
        }

        if (m.child?.length) return { ...m, child: update(m.child) };

        return m;
      });

    setMenuTree((prev) => update(prev));
  }, []);

  return (
    <ih-sidebar class={!visible ? 'hidden' : undefined}>
      <div className="ih-sidebar-header">
        {user ? (
          <>
            <div className="user-image">
              <IAvatar alt={user.fullName} size={28} src={user.userImagePath} />
            </div>

            <div className="user-info">
              <small className="text-subtle">{user.employeeCode}</small>
              <h6>{user.fullName}</h6>
            </div>
          </>
        ) : null}
      </div>

      <div className="ih-sidebar-search">
        <input
          placeholder="Search Menu.."
          className="form-control"
          value={menuFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
      </div>

      <div className="ih-sidebar-body scroll scroll-y">
        {favoriteMode ? (
          <FavoritesSection
            favorites={favorites}
            menus={menuTree}
            collapsible={collapsible}
            onFavoriteToggle={onFavoriteToggle}
            onFavoriteReorder={onFavoriteReorder}
          />
        ) : null}

        <ul>
          {filteredMenus.map((m) => (
            <IHMenu
              key={String(getMenuKey(m))}
              menu={m}
              filter={menuFilter}
              selectedMenuId={selectedMenuId}
              onToggleGroup={onToggleGroup}
              collapsible={collapsible}
              favoriteMode={favoriteMode}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </ul>
      </div>

      <div className="ih-sidebar-footer">
        <small>{footerText}</small>
      </div>
    </ih-sidebar>
  );
}

/* =========================================================
 * HostShell (bridge host api -> host ui)
 * ========================================================= */

function HostApiBridge(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setTitle, setBreadcrumbs } = useHostUi();

  const hostApi = useMemo<IHostApi>(
    () => ({
      navigate: (url) => navigate(url),
      setTitle,
      setBreadcrumbs,
    }),
    [navigate, setTitle, setBreadcrumbs]
  );

  return (
    <IHostApiProvider hostApi={hostApi}>{props.children}</IHostApiProvider>
  );
}

export function HostShell(props: { children: React.ReactNode }) {
  return (
    <IHostUiProvider>
      <HostApiBridge>{props.children}</HostApiBridge>
    </IHostUiProvider>
  );
}
