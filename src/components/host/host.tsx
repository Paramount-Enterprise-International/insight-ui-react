/* ih-shell.angular-dom.tsx */
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
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  type UIMatch,
} from 'react-router-dom';

/* =========================================
 * Types
 * ========================================= */

export type BreadcrumbItem = { label: string; url: string };

export type Menu = {
  menuId: number;
  menuName: string;
  route?: string | null;
  menuTypeId: number;
  parentId: number;
  sequence: number;
  icon?: string | null;
  child?: Menu[];
  level: number;
  visibility?: string;
  selected?: boolean;
  openInId?: number;
  versionCode?: string;
  applicationCode?: string;
  applicationUrl?: string;
};

export type User = {
  employeeCode: string;
  fullName: string;
  userImagePath: string;
};

/* =========================================
 * Highlight (pipe replacement)
 * ========================================= */

function escapeHtml(input: string): string {
  return input
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
    // match your Angular markup: <span class="highlight-search">...</span>
    out += `<span class="highlight-search">${escapeHtml(safeText.slice(idx, idx + term.length))}</span>`;
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
  const Tag = as as any;
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
});

/* =========================================
 * Breadcrumbs
 * - Use route handle: { title: string }
 * ========================================= */

type RouteHandleWithTitle = { title?: string };

function buildBreadcrumbsFromMatches(matches: UIMatch[]): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];

  for (const m of matches) {
    const handle = (m.handle ?? {}) as RouteHandleWithTitle;
    const label = handle.title;
    const url = m.pathname || '/';
    if (label) crumbs.push({ label, url });
  }

  return crumbs;
}

/* =========================================
 * Filtering (same rules as Angular)
 * ========================================= */

function filterMenuTree(menus: Menu[], rawTerm: string): Menu[] {
  const term = (rawTerm ?? '').trim().toLowerCase();
  if (!term) return menus;

  const filtered: Menu[] = [];
  for (const menu of menus) {
    const result = filterMenuBranch(menu, term);
    if (result) filtered.push(result);
  }
  return filtered;
}

/**
 * Rules:
 * - If THIS node matches → keep it and ALL of its original children.
 * - Else, if any CHILD matches → keep this node but ONLY the matching branches.
 * - Else → return null.
 */
function filterMenuBranch(menu: Menu, term: string): Menu | null {
  const name = (menu.menuName ?? '').toLowerCase();
  const selfMatches = name.includes(term);

  const originalChildren = menu.child ?? [];

  const filteredChildren: Menu[] = [];
  for (const child of originalChildren) {
    const childResult = filterMenuBranch(child, term);
    if (childResult) filteredChildren.push(childResult);
  }

  const childMatches = filteredChildren.length > 0;
  if (!selfMatches && !childMatches) return null;

  const childrenToUse = selfMatches ? originalChildren : filteredChildren;

  const cloned: Menu = { ...menu, child: childrenToUse };

  // expand groups that match / contain matches
  if (+cloned.menuTypeId === 3 && (selfMatches || childMatches)) {
    cloned.visibility = 'expanded';
  }

  return cloned;
}

function flattenNavigableMenus(menus: Menu[]): Menu[] {
  const result: Menu[] = [];

  const visit = (menu: Menu) => {
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

/* =========================================
 * IHContent - renders <ih-content> host tag
 * ========================================= */

export function IHContent(props: {
  onSidebarToggled?: (visible: boolean) => void;
}) {
  const { onSidebarToggled } = props;

  const matches = useMatches();
  const breadcrumbs = useMemo(
    () => buildBreadcrumbsFromMatches(matches),
    [matches]
  );
  const pageTitle = breadcrumbs.length
    ? breadcrumbs[breadcrumbs.length - 1].label
    : 'Insight';

  const [sidebarVisibility, setSidebarVisibility] = useState(true);

  const toggleSidebar = useCallback(() => {
    setSidebarVisibility((prev) => {
      const next = !prev;
      onSidebarToggled?.(next);
      return next;
    });
  }, [onSidebarToggled]);

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
        <h1>{pageTitle || 'Insight'}</h1>
      </div>

      <div className="ih-content-breadcrumbs">
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((b, idx) => {
            const first = idx === 0;
            const last = idx === breadcrumbs.length - 1;

            if (!last) {
              return (
                <React.Fragment key={b.url}>
                  {!first ? (
                    // Angular output is <a> anyway; keep <a>
                    <a
                      className="ih-content-breadcrumb ih-content-breadcrumb__link"
                      href={b.url}>
                      {b.label}
                    </a>
                  ) : (
                    <span className="ih-content-breadcrumb ih-content-breadcrumb__first">
                      {b.label}
                    </span>
                  )}
                  <span className="ih-content-breadcrumb ih-content-breadcrumb__separator">
                    {'>'}
                  </span>
                </React.Fragment>
              );
            }

            return (
              <span
                key={b.url}
                className="ih-content-breadcrumb ih-content-breadcrumb__current">
                {b.label}
              </span>
            );
          })
        ) : (
          <span className="ih-content-breadcrumb ih-content-breadcrumb__first">
            {' '}
            Home{' '}
          </span>
        )}
      </div>

      <div className="ih-content-body scroll scroll-y">
        {/* React Router still needs Outlet, but DOM around it matches Angular */}
        <Outlet />
      </div>
    </ih-content>
  );
}

/* =========================================
 * IHMenu - renders <ih-menu> host tag for recursion
 * ========================================= */

type IHMenuProps = {
  menu?: Menu;
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

    // same leaf rule
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
    if (menu.visibility !== 'no-child') {
      onToggleGroup(menu.menuId);
    }
  }, [menu, onToggleGroup]);

  const renderIndent = (level: number) => {
    if (!level || level <= 0) return null;
    return Array.from({ length: level }).map((_, i) => <span key={i} />);
  };

  const onLeafNavigate = useCallback(
    (m: Menu) => {
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
      {(() => {
        const isModule = +menu.menuTypeId === 2;
        const isType3 = +menu.menuTypeId === 3;

        return (
          <li
            className={[
              isModule ? 'is-module' : '',
              isModule ? (menu.visibility ?? '') : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            {isModule ? (
              <small>
                <Highlighted text={menu.menuName} term={filter} />
              </small>
            ) : isType3 ? (
              hasChild ? (
                // group with children
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
                // leaf item
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
                    // Keep <a> in DOM, but do SPA nav for INS5
                    if (menu.applicationCode === 'INS5') {
                      e.preventDefault();
                      onLeafNavigate(menu);
                    }
                    // external link: allow default navigation if applicationUrl exists
                    if (
                      menu.applicationCode !== 'INS5' &&
                      !menu.applicationUrl
                    ) {
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
              <ul
                className={
                  +menu.menuTypeId === 3 ? (menu.visibility ?? '') : ''
                }>
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
        );
      })()}
    </ih-menu>
  );
});

/* =========================================
 * IHSidebar - renders <ih-sidebar> host tag
 * ========================================= */

export type IHSidebarProps = {
  user?: User | null;
  menus: Menu[];
  visible?: boolean;
  footerText?: string;
};

export function IHSidebar(props: IHSidebarProps) {
  const { user, menus, visible = true, footerText = 'Insight Local' } = props;

  const location = useLocation();
  const navigate = useNavigate();

  // init query params
  const initialFilter = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get('menu-filter') ?? '';
  }, [location.search]);

  const [menuFilter, setMenuFilter] = useState(initialFilter);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);

  // keep local copy so toggling visibility rerenders
  const [menuTree, setMenuTree] = useState<Menu[]>(menus);

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

  // keep selection logic same as Angular
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
    const update = (list: Menu[]): Menu[] =>
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
    <ih-sidebar>
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

      {/* match Angular behavior: host can be hidden by class if you want */}
      {!visible ? <style>{`ih-sidebar { display: none; }`}</style> : null}
    </ih-sidebar>
  );
}
