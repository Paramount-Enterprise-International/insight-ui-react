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
  getMenuKey,
  getMenuLabel,
  getMenuRoute,
  isHttpRoute,
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

/** True when a FontAwesome class looks valid (`fa`/`fas`/`far`/`fab` + `fa-...`). */
function isValidFaClass(icon: string | null | undefined): boolean {
  return /(^|\s)(fa|fas|far|fal|fad|fab)(\s|$)/i.test(icon ?? '') && /fa-/.test(icon ?? '');
}

/** Resolve a menu icon to a concrete FontAwesome class (fallback when missing/invalid). */
function resolveMenuIcon(icon: string | null | undefined): string {
  const value = (icon ?? '').trim();
  return isValidFaClass(value) ? value : MENU_ICON_FALLBACK;
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
}) {
  const nav = useNavigate();

  const { onNavigate } = props;

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
            <img alt="sidebar-left" src="/svgs/sidebar-left.svg" />
          ) : (
            <img alt="sidebar-right" src="/svgs/sidebar-right.svg" />
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
export function IHContentLayout() {
  const ui = useHostUi();
  const hostApi = useHostApiOptional();

  return (
    <IHContent
      title={ui.title}
      breadcrumbs={ui.breadcrumbs}
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
    onFavoriteToggle,
  } = props;
  const navigate = useNavigate();

  const menuItemRef = useRef<HTMLElement | null>(null);
  const hasChild = !!menu?.child?.length;

  const menuKey = useMemo(() => getMenuKey(menu), [menu]);
  const menuLabel = useMemo(() => getMenuLabel(menu), [menu]);
  const isModuleNode = useMemo(() => isModuleMenu(menu), [menu]);
  const iconClass = useMemo(() => resolveMenuIcon(menu?.icon), [menu]);

  const menuRoute = useMemo(() => getMenuRoute(menu), [menu]);

  const href = useMemo(() => {
    if (!menuRoute) return '#';

    return appendMenuFilterToUrl(menuRoute, filter);
  }, [menuRoute, filter]);

  const isSelected = useMemo(() => {
    if (!menu) return false;

    const matchesId = menuKey !== null && menuKey === selectedMenuId;
    if (!matchesId) return false;

    const children = menu.child ?? [];
    const hasChildren = children.length > 0;

    const isLeaf =
      Number(menu.menuTypeId) === 3 &&
      (!hasChildren || menu.visibility === 'no-child');

    return isLeaf;
  }, [menu, menuKey, selectedMenuId]);

  const linkTarget = useMemo(() => {
    if (!menu) return '_self';

    if (isNewTabMenu(menu)) return '_blank';

    return '_self';
  }, [menu]);

  const linkRel = useMemo(() => {
    if (!menu) return undefined;

    return isNewTabMenu(menu) ? 'noopener noreferrer' : undefined;
  }, [menu]);

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

  const renderIndent = (level: number | undefined) => {
    if (!level || level <= 0) return null;

    return Array.from({ length: level }).map((_, i) => <span key={i} />);
  };

  const onLeafClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!menu) return;
      if (!menuRoute) return;

      // keep browser behavior for right click, middle click, cmd/ctrl-click, etc
      if (!isPlainLeftClick(e)) return;

      // new tab, reload, and http routes should use normal browser navigation
      if (isNewTabMenu(menu)) return;
      if (isReloadMenu(menu)) return;

      // only SPA route should be handled by React Router
      if (isSpaMenu(menu)) {
        e.preventDefault();
        navigate(href);
      }
    },
    [menu, menuRoute, href, navigate]
  );

  const onToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (menuKey === null) return;
      onFavoriteToggle?.({ id: menuKey, isFavorite: !menu?.isFavorite });
    },
    [menuKey, menu?.isFavorite, onFavoriteToggle]
  );

  if (!menu) return null;

  return (
    <ih-menu>
      <li
        className={[
          isModuleNode ? 'is-module' : '',
          isModuleNode ? (menu.visibility ?? '') : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {isModuleNode ? (
          <small
            className={collapsible && hasChild ? 'ih-menu-module--collapsible' : undefined}
            onClick={collapsible && hasChild ? clickGroup : undefined}>
            <Highlighted text={menuLabel} term={filter} />

            {collapsible && hasChild ? (
              <i
                className={
                  menu.visibility === 'expanded'
                    ? 'fas fa-angle-up'
                    : 'fas fa-angle-down'
                }></i>
            ) : null}
          </small>
        ) : Number(menu.menuTypeId) === 3 ? (
          hasChild ? (
            <div onClick={clickGroup}>
              {renderIndent(menu.level)}

              <i className={iconClass}></i>

              <h6>
                <Highlighted text={menuLabel} term={filter} />
              </h6>

              <i
                className={
                  menu.visibility === 'expanded'
                    ? 'fas fa-angle-up'
                    : 'fas fa-angle-down'
                }></i>
            </div>
          ) : (
            <a
              ref={(el) => {
                menuItemRef.current = el as unknown as HTMLElement | null;
              }}
              className={isSelected ? 'is-selected' : ''}
              href={href}
              target={linkTarget}
              rel={linkRel}
              onClick={onLeafClick}>
              {renderIndent(menu.level)}

              <i className={iconClass}></i>

              <h6>
                <Highlighted text={menuLabel} term={filter} />
              </h6>

              {favoriteMode && onFavoriteToggle ? (
                <span
                  className="ih-menu-favorite"
                  role="button"
                  tabIndex={-1}
                  aria-label={
                    menu.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                  }
                  onClick={onToggleFavorite}>
                  <i
                    className={
                      menu.isFavorite ? 'fas fa-star' : 'far fa-star'
                    }></i>
                </span>
              ) : null}
            </a>
          )
        ) : null}

        {hasChild ? (
          <ul className={Number(menu.menuTypeId) === 3 ? (menu.visibility ?? '') : ''}>
            {(menu.child ?? []).map((m) => (
              <IHMenu
                key={String(getMenuKey(m))}
                menu={m}
                filter={filter}
                selectedMenuId={selectedMenuId}
                onToggleGroup={onToggleGroup}
                collapsible={collapsible}
                favoriteMode={favoriteMode}
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
  onFavoriteToggle,
  onFavoriteReorder,
}: {
  favorites: IMenu[];
  onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
  onFavoriteReorder?: (event: IMenuFavoriteReorderEvent) => void;
}) {
  const navigate = useNavigate();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (dropIndex: number) => {
      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null);
        return;
      }
      const reordered = [...favorites];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dropIndex, 0, moved);
      setDragIndex(null);
      onFavoriteReorder?.({
        menuIds: reordered
          .map((f) => getMenuKey(f))
          .filter((k): k is string | number => k !== null && k !== ''),
      });
    },
    [dragIndex, favorites, onFavoriteReorder]
  );

  const onFavoriteItemClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, menu: IMenu) => {
      if (!isPlainLeftClick(e)) return;
      const route = getMenuRoute(menu);
      if (!route) return;
      if (isNewTabMenu(menu)) return;
      if (isReloadMenu(menu)) return;
      if (isSpaMenu(menu)) {
        e.preventDefault();
        navigate(route);
      }
    },
    [navigate]
  );

  if (!favorites?.length) {
    return null;
  }

  return (
    <div className="ih-sidebar-favorites">
      <div className="ih-sidebar-favorites__header">
        <small className="text-subtle">Favorites</small>
      </div>
      <ul>
        {favorites.map((favorite, index) => {
          const route = getMenuRoute(favorite);
          const key = getMenuKey(favorite);
          return (
            <li
              key={String(key)}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(index);
              }}>
              <a
                href={route ?? '#'}
                target={isNewTabMenu(favorite) ? '_blank' : '_self'}
                rel={isNewTabMenu(favorite) ? 'noopener noreferrer' : undefined}
                onClick={(e) => onFavoriteItemClick(e, favorite)}>
                <i className={resolveMenuIcon(favorite.icon)}></i>
                <span>{getMenuLabel(favorite)}</span>
              </a>

              {onFavoriteToggle ? (
                <span
                  className="ih-menu-favorite"
                  role="button"
                  tabIndex={-1}
                  aria-label="Remove from favorites"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (key === null) return;
                    onFavoriteToggle({ id: key, isFavorite: false });
                  }}>
                  <i className="fas fa-star"></i>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
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
            const nextVis =
              m.visibility === 'expanded' ? 'collapsed' : 'expanded';

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
              <img alt="User Image" src={user.userImagePath} />
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
