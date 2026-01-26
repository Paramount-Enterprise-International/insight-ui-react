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
import type { IBreadcrumbItem, IHostApi, IMenu, IUser } from './host-api.types';
import { IHostUiProvider, useHostUi } from './host-ui.context';

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
  const Tag: React.ElementType = as; // ✅ avoid `any`
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
});

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
      if (props.onNavigate) return props.onNavigate(url);
      nav(url);
    },
    [nav, props.onNavigate]
  );

  const onCrumbClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
      if (!isPlainLeftClick(e)) return;
      e.preventDefault();

      if (url.startsWith('/')) go(url);
      else window.location.href = url;
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

            // ✅ first crumb is never clickable (Dashboard)
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

  if (+cloned.menuTypeId === 3 && (selfMatches || childMatches)) {
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
      +menu.menuTypeId === 3 &&
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
  selectedMenuId: number | null;
  onToggleGroup: (menuId: number) => void;
};

export const IHMenu = memo(function IHMenu(props: IHMenuProps) {
  const { menu, filter, selectedMenuId, onToggleGroup } = props;
  const navigate = useNavigate();

  const menuItemRef = useRef<HTMLElement | null>(null);
  const hasChild = !!menu?.child?.length;

  const isSelected = useMemo(() => {
    if (!menu) return false;

    const matchesId = menu.menuId === selectedMenuId;
    if (!matchesId) return false;

    const children = menu.child ?? [];
    const hasChildren = children.length > 0;

    const isLeaf =
      +menu.menuTypeId === 3 &&
      (!hasChildren || menu.visibility === 'no-child');

    return isLeaf;
  }, [menu, selectedMenuId]);

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
    if (menu.visibility !== 'no-child') onToggleGroup(menu.menuId);
  }, [menu, onToggleGroup]);

  const renderIndent = (level: number) => {
    if (!level || level <= 0) return null;
    return Array.from({ length: level }).map((_, i) => <span key={i} />);
  };

  const onLeafNavigate = useCallback(
    (m: IMenu) => {
      if (m.applicationCode === 'INS5' && m.route) {
        navigate(m.route);
      } else if (m.applicationUrl) {
        window.location.href = m.applicationUrl;
      }
    },
    [navigate]
  );

  if (!menu) return null;

  return (
    <ih-menu>
      <li
        className={[
          +menu.menuTypeId === 2 ? 'is-module' : '',
          +menu.menuTypeId === 2 ? (menu.visibility ?? '') : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {+menu.menuTypeId === 2 ? (
          <small>
            <Highlighted text={menu.menuName} term={filter} />
          </small>
        ) : +menu.menuTypeId === 3 ? (
          hasChild ? (
            <div onClick={clickGroup}>
              {menu.level > 0 ? renderIndent(menu.level) : null}
              <i className={menu.icon ?? ''}></i>
              <h6>
                <Highlighted text={menu.menuName} term={filter} />
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
              href={
                menu.applicationCode === 'INS5'
                  ? (menu.route ?? '#')
                  : (menu.applicationUrl ?? '#')
              }
              onClick={(e) => {
                // keep open in new tab, etc
                if (!isPlainLeftClick(e)) return;

                // SPA nav for INS5
                if (menu.applicationCode === 'INS5') {
                  e.preventDefault();
                  onLeafNavigate(menu);
                  return;
                }

                // external link: allow normal navigation if url exists
                if (menu.applicationCode !== 'INS5' && !menu.applicationUrl) {
                  e.preventDefault();
                  onLeafNavigate(menu);
                }
              }}>
              {menu.level > 0 ? renderIndent(menu.level) : null}
              <i className={menu.icon ?? ''}></i>
              <h6>
                <Highlighted text={menu.menuName} term={filter} />
              </h6>
            </a>
          )
        ) : null}

        {hasChild ? (
          <ul className={+menu.menuTypeId === 3 ? (menu.visibility ?? '') : ''}>
            {(menu.child ?? []).map((m) => (
              <IHMenu
                key={m.menuId}
                menu={m}
                filter={filter}
                selectedMenuId={selectedMenuId}
                onToggleGroup={onToggleGroup}
              />
            ))}
          </ul>
        ) : null}
      </li>
    </ih-menu>
  );
});

/* =========================================================
 * IHSidebar
 * ========================================================= */

export type IHSidebarProps = {
  user?: IUser | null;
  menus: IMenu[];
  visible?: boolean;
  footerText?: string;
};

export function IHSidebar(props: IHSidebarProps) {
  const { user, menus, visible = true, footerText = 'Insight Local' } = props;

  const location = useLocation();
  const navigate = useNavigate();

  // init query params (same behavior)
  const initialFilter = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get('menu-filter') ?? '';
  }, [location.search]);

  const [menuFilter, setMenuFilter] = useState(initialFilter);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);

  const [menuTree, setMenuTree] = useState<IMenu[]>(menus);

  useEffect(() => {
    setMenuTree(menus);
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
      setSelectedMenuId(navigableMenus[idx].menuId);
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

  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!navigableMenus.length) return;
      if (!menuFilter.trim()) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          setSelectedIndex(0);
          setSelectedMenuId(navigableMenus[0].menuId);
          return;
        }

        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current + 1 > max ? 0 : current + 1;
          setSelectedMenuId(navigableMenus[next].menuId);
          return next;
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          const last = navigableMenus.length - 1;
          setSelectedIndex(last);
          setSelectedMenuId(navigableMenus[last].menuId);
          return;
        }

        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current - 1 < 0 ? max : current - 1;
          setSelectedMenuId(navigableMenus[next].menuId);
          return next;
        });
      } else if (event.key === 'Enter') {
        if (!keyboardNavActive) return;
        event.preventDefault();

        const idx = selectedIndex;
        if (idx == null || idx < 0 || idx >= navigableMenus.length) return;

        const m = navigableMenus[idx];
        if (m.applicationCode === 'INS5' && m.route) {
          navigate(m.route);
        } else if (m.applicationUrl) {
          window.location.href = m.applicationUrl;
        }
      }
    },
    [navigableMenus, menuFilter, keyboardNavActive, selectedIndex, navigate]
  );

  const onToggleGroup = useCallback((menuId: number) => {
    const update = (list: IMenu[]): IMenu[] =>
      list.map((m) => {
        if (m.menuId === menuId) {
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
    <ih-sidebar className={!visible ? 'hidden' : undefined}>
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
        <ul>
          {filteredMenus.map((m) => (
            <IHMenu
              key={m.menuId}
              menu={m}
              filter={menuFilter}
              selectedMenuId={selectedMenuId}
              onToggleGroup={onToggleGroup}
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
  const { setTitle, setBreadcrumbs } = useHostUi(); // ✅ only grab stable setters

  const hostApi = useMemo<IHostApi>(
    () => ({
      navigate: (url) => navigate(url),
      setTitle,
      setBreadcrumbs,
    }),
    [navigate, setTitle, setBreadcrumbs] // ✅ stable deps
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
