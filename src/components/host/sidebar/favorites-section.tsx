import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  IMenu,
  IMenuFavoriteReorderEvent,
  IMenuFavoriteToggleEvent,
} from '../host-api.types';
import { SIDEBAR_FAVORITES_GROUP_ID } from '../host.constants';
import { buildFavoritePathMap, getMenuKey, normalizeMenuTree } from '../menu';
import { IHMenu } from '../menu/menu';

export function FavoritesSection({
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

  // Local order - live-updates during a pointer drag (mirrors Angular's
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
  const dragHandlersRef = useRef<{
    move: (e: MouseEvent) => void;
    up: () => void;
  } | null>(null);

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
    // Only count LEAF rows - exclude the synthetic "Favorites" group header so
    // the returned index maps 1:1 onto the favorites array (otherwise every
    // index is offset by +1 and bottom-to-top drags land in the wrong slot).
    const leaves = Array.from(
      host.querySelectorAll<HTMLElement>('.ih-sidebar-favorites [data-menu-id]')
    ).filter(
      (el) => el.getAttribute('data-menu-id') !== SIDEBAR_FAVORITES_GROUP_ID
    );
    for (let i = 0; i < leaves.length; i++) {
      const rect = leaves[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return leaves.length;
  }, []);

  /** Live-reorders the favorites so the target position is previewed while dragging. */
  const reorderLive = useCallback((menuId: string, targetIndex: number) => {
    const items = itemsRef.current;
    const sourceIndex = items.findIndex(
      (menu) => String(getMenuKey(menu)) === menuId
    );
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
      const leaf = target.closest<HTMLElement>(
        '.ih-sidebar-favorites [data-menu-id]'
      );
      if (!leaf) return;
      const menuId = leaf.dataset['menuId'];
      if (!menuId) return;

      // Prevent text selection and any native drag/OS behavior.
      event.preventDefault();

      // Translucent clone (drag ghost) that follows the pointer - hidden until
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
            .filter(
              (key): key is string | number => key !== null && key !== undefined
            );
          onFavoriteReorder?.({ menuIds });
        } else {
          cleanupDrag();
        }
      };

      dragHandlersRef.current = { move, up };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    [computeDropIndex, reorderLive, cleanupDrag, onFavoriteReorder]
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
