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
  SidebarResizeController,
  type SidebarResizeState,
} from './sidebar-resize';
import { filterMenuTree, flattenNavigableMenus } from './sidebar.utils';
import { createFavoritesMenu, getSidebarMenuKey, SidebarMenuState, type MenuExpansionChange } from './sidebar-menu-state';

const EMPTY_FAVORITES: IMenu[] = [];

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
  /** Expansion preferences are shared per origin; null disables persistence. */
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
    resizable, visible, minWidth, maxWidth, widthStorageKey,
  });
  const [resizeState, setResizeState] = useState<SidebarResizeState>({
    width: 260,
    minWidth: 220,
    maxWidth: 480,
  });

  useLayoutEffect(() => {
    const controller = new SidebarResizeController(
      sidebarRef.current!,
      resizeHandleRef.current!,
      initialResizeOptions.current,
      setResizeState,
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
      resizable, visible, minWidth, maxWidth, widthStorageKey,
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

  const [menuFilter, setMenuFilter] = useState(initialFilter);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | number | null>(
    null
  );

  const [menuState] = useState(() => new SidebarMenuState(menuStateStorageKey));
  const [menuRevision, refreshMenus] = useReducer((value: number) => value + 1, 0);
  const sourceMenus = useMemo(() => normalizeMenuTree(menus), [menus]);
  const sourceFavorites = useMemo(
    () => createFavoritesMenu(normalizeMenuTree(favorites)), [favorites]
  );
  const menuSnapshot = useMemo(
    () => ({
      revision: menuRevision,
      menus: menuState.project(sourceMenus),
      favoriteGroup: menuState.project(sourceFavorites, 'favorites')[0],
    }),
    [menuState, sourceMenus, sourceFavorites, menuRevision]
  );
  const { menus: menuTree, favoriteGroup } = menuSnapshot;

  useLayoutEffect(() => {
    if (menuState.configureStorage(menuStateStorageKey)) refreshMenus();
  }, [menuState, menuStateStorageKey]);

  useLayoutEffect(() => {
    if (menuState.hasLocation) menuState.observeLocation(location.pathname, baseHref);
  }, [menuState, location.pathname, baseHref]);

  // Allow initial router redirects to settle before choosing the restoration route.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      menuState.observeLocation(location.pathname, baseHref);
      if (menuState.restore(sourceMenus, favoriteMode ? sourceFavorites : [])) refreshMenus();
    });
    return () => cancelAnimationFrame(frame);
  }, [menuState, sourceMenus, sourceFavorites, favoriteMode, location.pathname, baseHref]);

  const filteredMenus = useMemo(
    () => filterMenuTree(menuTree, menuFilter),
    [menuTree, menuFilter]
  );

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (sidebarRef.current) menuState.scrollToActive(sidebarRef.current, visible);
    });
    return () => cancelAnimationFrame(frame);
  }, [menuState, filteredMenus, favoriteGroup, visible, menuRevision, location.pathname]);

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

  const onExpansionChange = useCallback((event: MenuExpansionChange) => {
    menuState.setExpanded(event);
    refreshMenus();
  }, [menuState]);

  return (
    <ih-sidebar ref={sidebarRef} class={!visible ? 'hidden' : undefined}>
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
          value={menuFilter}
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
              onToggleGroup={() => undefined}
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
        aria-valuemin={resizeState.minWidth}
        aria-valuemax={resizeState.maxWidth}
        aria-valuenow={resizeState.width}
        tabIndex={resizable && visible ? 0 : -1}
        hidden={!resizable || !visible}
      />
    </ih-sidebar>
  );
}
