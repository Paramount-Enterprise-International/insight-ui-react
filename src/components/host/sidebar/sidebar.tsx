import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useHref, useLocation, useNavigate } from 'react-router-dom';
import { IAuthContext } from '../../auth/insight-auth-context';
import { IAvatar } from '../../avatar';
import type {
  IMenu,
  IMenuFavoriteReorderEvent,
  IMenuFavoriteToggleEvent,
  IUser,
} from '../host-api.types';
import { DEFAULT_PERSONAL_PROFILE_URL } from '../host.constants';
import {
  getMenuKey,
  getMenuRoute,
  isNewTabMenu,
  isReloadMenu,
  isSpaMenu,
  normalizeMenuTree,
} from '../menu';
import { IHMenu } from '../menu/menu';
import { appendMenuFilterToUrl } from '../menu/menu.utils';
import { FavoritesSection } from './favorites-section';
import {
  createFavoritesMenu,
  getSidebarMenuKey,
  resolveSidebarActiveMenu,
  SidebarMenuState,
  type MenuExpansionChange,
} from './sidebar-menu-state';
import { SidebarResizeController } from './sidebar-resize';
import { flattenNavigableMenus, SidebarSearchState } from './sidebar.utils';

const EMPTY_FAVORITES: IMenu[] = [];
const ignoreToggleGroup = () => undefined;

export type IHSidebarProps = {
  user?: IUser | null;
  menus: IMenu[];
  visible?: boolean;
  /** Enable pointer and keyboard resizing with a persistent width preference. */
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  /** Set to null to keep the width in memory only. */
  widthStorageKey?: string | null;
  /** Root expansion preferences are shared per origin; null disables persistence. */
  menuStateStorageKey?: string | null;
  /** Called after a completed pointer or keyboard width change, in pixels. */
  onWidthChange?: (width: number) => void;
  impersonating?: boolean;
  footerText?: string;
  /** Enable collapsible module headers (chevron + click-to-collapse). */
  collapsible?: boolean;
  /** Enable the favorites section + per-row star toggles. */
  favoriteMode?: boolean;
  /** Favorite menus (modern shape) rendered in the pinned section at the top. */
  favorites?: IMenu[];
  /** Personal Profile page URL opened in a new tab from the sidebar user dropdown. */
  personalProfileUrl?: string;
  onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
  onFavoriteReorder?: (event: IMenuFavoriteReorderEvent) => void;
};

export function IHSidebar(props: IHSidebarProps) {
  const {
    user,
    menus,
    visible = true,
    resizable = true,
    minWidth = 220,
    maxWidth = 480,
    widthStorageKey = 'insight.sidebar.width',
    menuStateStorageKey = 'insight.sidebar.menu-state',
    onWidthChange,
    impersonating = false,
    footerText = 'Insight Local',
    collapsible = false,
    favoriteMode = false,
    favorites = EMPTY_FAVORITES,
    personalProfileUrl,
    onFavoriteToggle,
    onFavoriteReorder,
  } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const baseHref = useHref('/');

  const auth = useContext(IAuthContext);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const resizeHandleRef = useRef<HTMLDivElement | null>(null);
  const resizeController = useRef<SidebarResizeController | null>(null);
  const onWidthChangeRef = useRef(onWidthChange);
  const initialResizeOptions = useRef({
    resizable,
    visible,
    minWidth,
    maxWidth,
    widthStorageKey,
  });

  useLayoutEffect(() => {
    const controller = new SidebarResizeController(
      sidebarRef.current!,
      resizeHandleRef.current!,
      initialResizeOptions.current,
      (width) => onWidthChangeRef.current?.(width)
    );
    resizeController.current = controller;
    return () => {
      controller.destroy();
      resizeController.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    onWidthChangeRef.current = onWidthChange;
    resizeController.current?.configure({
      resizable,
      visible,
      minWidth,
      maxWidth,
      widthStorageKey,
    });
  }, [resizable, visible, minWidth, maxWidth, widthStorageKey, onWidthChange]);

  const profileUrl =
    (personalProfileUrl ?? '').trim() || DEFAULT_PERSONAL_PROFILE_URL;

  // Handle account menu dismissal and keyboard focus while it is open.
  useEffect(() => {
    if (!accountMenuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && headerRef.current?.contains(target)) return;
      setAccountMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const header = headerRef.current;
      if (e.key === 'Escape') {
        setAccountMenuOpen(false);
        header?.querySelector<HTMLButtonElement>('.ih-user-chip')?.focus();
        return;
      }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      if (!header?.contains(e.target as Node | null)) return;

      const items = Array.from(
        header.querySelectorAll<HTMLElement>('.ih-user-dropdown-item')
      );
      if (!items.length) return;

      e.preventDefault();
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next =
        current < 0
          ? e.key === 'ArrowDown'
            ? 0
            : items.length - 1
          : (current + (e.key === 'ArrowDown' ? 1 : -1) + items.length) %
            items.length;
      items[next].focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountMenuOpen]);

  const onLogoutClick = useCallback(() => {
    setAccountMenuOpen(false);
    if (!auth) return;
    const signinUrl = auth.config?.signinUrl?.trim();
    const target = signinUrl && signinUrl.length > 0 ? signinUrl : '/';
    void auth.session.logout().then(() => {
      window.location.href = target;
    });
  }, [auth]);

  const initialFilter = useMemo(() => {
    const sp = new URLSearchParams(location.search);

    return sp.get('menu-filter') ?? '';
  }, [location.search]);

  const [filterInput, setFilterInput] = useState(initialFilter);
  const filterInputRef = useRef(initialFilter);
  const filterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchState] = useState(() => new SidebarSearchState(initialFilter));
  const [menuFilter, setMenuFilter] = useState(initialFilter.trim());
  const [searchRevision, refreshSearch] = useReducer(
    (value: number) => value + 1,
    0
  );
  const locationRef = useRef(location);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | number | null>(
    null
  );

  const [menuState] = useState(() => new SidebarMenuState(menuStateStorageKey));
  const [menuRevision, refreshMenus] = useReducer(
    (value: number) => value + 1,
    0
  );
  const sourceMenus = useMemo(() => normalizeMenuTree(menus), [menus]);
  const sourceFavorites = useMemo(
    () => createFavoritesMenu(normalizeMenuTree(favorites)),
    [favorites]
  );
  const activeMenu = useMemo(
    () =>
      resolveSidebarActiveMenu(
        sourceMenus,
        favoriteMode ? sourceFavorites : [],
        location.pathname,
        baseHref
      ),
    [sourceMenus, sourceFavorites, favoriteMode, location.pathname, baseHref]
  );
  const menuSnapshot = useMemo(
    () => ({
      revision: menuRevision,
      menus: menuState.project(sourceMenus, 'main', activeMenu),
      favoriteGroup: menuState.project(
        sourceFavorites,
        'favorites',
        activeMenu
      )[0],
    }),
    [menuState, sourceMenus, sourceFavorites, menuRevision, activeMenu]
  );
  const { menus: menuTree, favoriteGroup } = menuSnapshot;

  useLayoutEffect(() => {
    if (menuState.configureStorage(menuStateStorageKey)) refreshMenus();
  }, [menuState, menuStateStorageKey]);

  useLayoutEffect(() => {
    if (menuState.hasLocation)
      menuState.observeLocation(location.pathname, baseHref);
  }, [menuState, location.pathname, baseHref]);

  // Allow initial router redirects to settle before choosing the restoration route.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      menuState.observeLocation(location.pathname, baseHref);
      if (menuState.restore(sourceMenus, favoriteMode ? sourceFavorites : []))
        refreshMenus();
    });
    return () => cancelAnimationFrame(frame);
  }, [
    menuState,
    sourceMenus,
    sourceFavorites,
    favoriteMode,
    location.pathname,
    baseHref,
  ]);

  const searchSnapshot = useMemo(
    () => ({
      term: menuFilter,
      revision: searchRevision,
      menus: searchState.filter(menuTree),
    }),
    [searchState, menuTree, menuFilter, searchRevision]
  );
  const filteredMenus = searchSnapshot.menus;

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (sidebarRef.current)
        menuState.scrollToActive(sidebarRef.current, visible);
    });
    return () => cancelAnimationFrame(frame);
  }, [
    menuState,
    filteredMenus,
    favoriteGroup,
    visible,
    menuRevision,
    location.pathname,
  ]);

  const navigableMenus = useMemo(
    () => flattenNavigableMenus(filteredMenus, collapsible),
    [filteredMenus, collapsible]
  );

  const cancelFilter = useCallback(() => {
    if (filterTimer.current !== null) clearTimeout(filterTimer.current);
    filterTimer.current = null;
  }, []);

  useEffect(() => cancelFilter, [cancelFilter]);

  useLayoutEffect(() => {
    const previous = locationRef.current;
    locationRef.current = location;
    const term = new URLSearchParams(location.search).get('menu-filter') ?? '';
    if (
      previous.pathname === location.pathname &&
      term.trim() === searchState.term
    )
      return;
    cancelFilter();
    filterInputRef.current = term;
    setFilterInput(term);
    searchState.setTerm(term);
    setMenuFilter(term.trim());
    setKeyboardNavActive(false);
    setSelectedIndex(null);
    setSelectedMenuId(null);
  }, [location, cancelFilter, searchState]);

  const updateUrl = useCallback(
    (nextFilter: string) => {
      const current = locationRef.current;
      const sp = new URLSearchParams(current.search);
      const f = nextFilter.trim();

      if ((sp.get('menu-filter') ?? '') === f && (f || !sp.has('menu-filter')))
        return;

      if (f) sp.set('menu-filter', f);
      else sp.delete('menu-filter');

      navigate(
        {
          pathname: current.pathname,
          search: sp.toString() ? `?${sp.toString()}` : '',
          hash: current.hash,
        },
        { replace: true }
      );
    },
    [navigate]
  );

  useEffect(() => {
    if (
      !menuFilter ||
      !navigableMenus.some((menu) => getMenuKey(menu) === selectedMenuId)
    ) {
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
    } else {
      setSelectedIndex(
        navigableMenus.findIndex((menu) => getMenuKey(menu) === selectedMenuId)
      );
    }
  }, [navigableMenus, menuFilter, selectedMenuId]);

  const applyFilter = useCallback(
    (next: string) => {
      cancelFilter();
      if (searchState.setTerm(next)) setMenuFilter(searchState.term);
      updateUrl(searchState.term);
    },
    [cancelFilter, searchState, updateUrl]
  );

  const onFilterChange = useCallback(
    (next: string) => {
      filterInputRef.current = next;
      setFilterInput(next);
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
      cancelFilter();
      if (next.trim() !== searchState.term) {
        filterTimer.current = setTimeout(() => applyFilter(next), 200);
      }
    },
    [applyFilter, cancelFilter, searchState]
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
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
      const pending = filterInputRef.current.trim() !== searchState.term;
      if (pending) applyFilter(filterInputRef.current);
      const items = pending
        ? flattenNavigableMenus(searchState.filter(menuTree), collapsible)
        : navigableMenus;
      if (!items.length || !searchState.term) return;

      if (event.key === 'Enter') {
        if (pending || !keyboardNavActive || selectedIndex === null) return;
        event.preventDefault();
        if (items[selectedIndex]) navigateToMenu(items[selectedIndex]);
        return;
      }

      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next =
        pending || !keyboardNavActive || selectedIndex === null
          ? delta > 0
            ? 0
            : items.length - 1
          : (selectedIndex + delta + items.length) % items.length;
      setKeyboardNavActive(true);
      setSelectedIndex(next);
      setSelectedMenuId(getMenuKey(items[next]));
    },
    [
      applyFilter,
      searchState,
      menuTree,
      collapsible,
      navigableMenus,
      keyboardNavActive,
      selectedIndex,
      navigateToMenu,
    ]
  );

  const onExpansionChange = useCallback(
    (event: MenuExpansionChange) => {
      if (searchState.setExpanded(event)) {
        refreshSearch();
        return;
      }
      menuState.setExpanded(event);
      refreshMenus();
    },
    [menuState, searchState]
  );

  return (
    <ih-sidebar
      ref={sidebarRef}
      class={
        [!visible ? 'hidden' : '', resizable ? 'is-resizable' : '']
          .filter(Boolean)
          .join(' ') || undefined
      }>
      <div className="ih-sidebar-header" ref={headerRef}>
        {user ? (
          <>
            <button
              type="button"
              className="ih-user-chip"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              onClick={() => setAccountMenuOpen((open) => !open)}>
              <span className="user-image">
                <IAvatar
                  alt={user.fullName}
                  size={28}
                  src={user.userImagePath}
                />
              </span>

              <span className="user-info">
                <small className="text-subtle">{user.employeeCode}</small>
                <h6>
                  {impersonating ? 'Acting As: ' : ''}
                  {user.fullName}
                </h6>
              </span>

              <i
                className={`ih-user-caret ${
                  accountMenuOpen ? 'fas fa-angle-up' : 'fas fa-angle-down'
                }`}></i>
            </button>

            {accountMenuOpen ? (
              <div className="ih-user-dropdown i-options" role="menu">
                <a
                  className="ih-user-dropdown-item i-option"
                  role="menuitem"
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setAccountMenuOpen(false)}>
                  <i className="fa-solid fa-user fa-fw"></i>
                  <span className="i-option-label">Personal Profile</span>
                </a>
                <button
                  type="button"
                  className="ih-user-dropdown-item i-option"
                  role="menuitem"
                  onClick={onLogoutClick}>
                  <i className="fa-solid fa-right-from-bracket fa-fw"></i>
                  <span className="i-option-label">Logout</span>
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="ih-sidebar-search">
        <input
          placeholder="Search Menu.."
          className="form-control"
          value={filterInput}
          onChange={(e) => onFilterChange(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
      </div>

      <div className="ih-sidebar-body scroll scroll-y">
        {favoriteMode ? (
          <FavoritesSection
            favorites={favoriteGroup?.children ?? EMPTY_FAVORITES}
            stateGroup={favoriteGroup}
            onExpansionChange={onExpansionChange}
            menus={menuTree}
            collapsible={collapsible}
            onFavoriteToggle={onFavoriteToggle}
            onFavoriteReorder={onFavoriteReorder}
          />
        ) : null}

        <ul>
          {filteredMenus.map((m) => (
            <IHMenu
              key={getSidebarMenuKey(m) ?? String(getMenuKey(m))}
              menu={m}
              filter={menuFilter}
              selectedMenuId={selectedMenuId}
              onToggleGroup={ignoreToggleGroup}
              onExpansionChange={onExpansionChange}
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
      <div
        ref={resizeHandleRef}
        className="ih-sidebar-resize-handle"
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        tabIndex={resizable && visible ? 0 : -1}
        hidden={!resizable || !visible}
      />
    </ih-sidebar>
  );
}
