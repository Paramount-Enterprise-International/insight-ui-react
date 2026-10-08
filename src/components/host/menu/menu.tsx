import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptionalIConfirm } from '../../dialog/dialog';
import type { IMenu, IMenuFavoriteToggleEvent } from '../host-api.types';
import { SIDEBAR_FAVORITES_GROUP_ID } from '../host.constants';
import {
  getMenuChildren,
  getMenuKey,
  getMenuLabel,
  getMenuRoute,
  hasMenuChildren,
  isGroupNode,
  isLeafItem,
  isModuleMenu,
  isNewTabMenu,
  isReloadMenu,
  isSpaMenu,
} from '../menu';
import { Highlighted } from './highlighted';
import {
  appendMenuFilterToUrl,
  isPlainLeftClick,
  resolveMenuIcon,
} from './menu.utils';

type IHMenuProps = {
  menu?: IMenu;
  filter: string;
  selectedMenuId: string | number | null;
  onToggleGroup: (menuId: string | number) => void;
  collapsible?: boolean;
  favoriteMode?: boolean;
  /** Render leaf rows draggable (used by the Favorites section for reorder). */
  dragEnabled?: boolean;
  /** Nesting depth from the sidebar root (0 = top level) - drives indentation + the top-level "no group icon" rule. */
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
    return stored !== undefined ? stored : (menu?.application?.name ?? null);
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
    // indent from there - matches Angular's `indentLevel = depth - 1`.
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
    'data-menu-id':
      dragEnabled && menuKey != null ? String(menuKey) : undefined,
  };

  const renderLeafInner = () => (
    <>
      {renderIndent()}

      <i className={iconClass}></i>

      <span
        title={menuLabel}
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
            menuIsFavorite
              ? 'fa-solid fa-star is-favorite'
              : 'fa-regular fa-star'
          }`}
          role="button"
          tabIndex={0}
          aria-label={
            menuIsFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
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
            data-menu-id={
              dragEnabled && menuKey != null ? String(menuKey) : undefined
            }
            onClick={collapsible ? clickGroup : undefined}>
            {renderIndent()}

            {depth > 0 || isFavoritesGroup ? (
              <i className={iconClass}></i>
            ) : null}

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
