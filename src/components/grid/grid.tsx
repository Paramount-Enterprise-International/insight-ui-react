/* grid.tsx */
/**
 * IGrid (React)
 * - Renders tags similar to Angular version:
 *   i-grid, i-grid-viewport, i-grid-header-row, i-grid-header-cell, i-grid-cell, i-grid-row, etc.
 *
 * IMPORTANT:
 * - Uses your React IButton (not native button)
 * - Custom tags are just semantic/styling hooks (not Web Components)
 * - Column config components behave like Angular: sortable/resizable/freeze are OPTIONAL with defaults
 *
 * Version: 1.24.0-ish parity (group header + tree + selection + expandable rows + paginator)
 *
 * ✅ Updated (Angular-close frozen/z-index/sticky logic):
 * - HeaderCell/Cell behave like Angular IGridHeaderCell/IGridCell:
 *   - If `col` exists, frozen/stickyLeft/zIndex are derived internally via grid helpers.
 *   - Call-sites no longer manually compute frozen props for normal columns.
 * - Special “expand/selection/number” columns still pass explicit stickyLeft like Angular template does.
 *
 * ✅ FIXED (Angular-close column order with ColumnGroup):
 * - Column parsing now preserves the exact JSX order:
 *   <IGridColumn/> , <IGridColumnGroup/> , <IGridCustomColumn/> ... in-place
 * - No more “collect direct columns first, then groups later” (which caused your order flip).
 */

import React, {
  Children,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { IButton } from '../button/button';
import { IIcon } from '../icon/icon';
import type { ISortDirection, ISortState } from './grid-data-source';
import { IGridDataSource } from './grid-data-source';
import { IPaginator } from './paginator';

/* ----------------------------------------------------
 * SELECTION TYPES
 * ---------------------------------------------------- */

export type IGridSelectionMode = false | 'single' | 'multiple';

export type IGridSelectionChange<T = any> = {
  selected: T[];
  lastChanged: T | null;
};

/* ----------------------------------------------------
 * COLUMN WIDTH TYPES
 * ---------------------------------------------------- */

export type IGridColumnWidth = number | 'fill';

/* ----------------------------------------------------
 * COLUMN-LIKE (internal strict model)
 * ---------------------------------------------------- */

export type IGridColumnLike<T = any> = {
  fieldName?: string;
  title: string;

  sortable: boolean;
  resizable: boolean;
  freeze: boolean;

  width?: IGridColumnWidth;

  headerDef?: (col: IGridColumnLike<T>) => ReactNode;

  // allow both signatures:
  cellDef?:
    | ((row: T) => ReactNode)
    | ((
        row: T,
        ctx: { row: T; index: number; column: IGridColumnLike<T> }
      ) => ReactNode);

  isAuto?: boolean;
};

/* ----------------------------------------------------
 * GROUP HEADER MODEL
 * ---------------------------------------------------- */

export type IGridHeaderItem<T = any> =
  | { kind: 'col'; col: IGridColumnLike<T> }
  | { kind: 'group'; title: string; columns: IGridColumnLike<T>[] };

/* ----------------------------------------------------
 * CONFIG ELEMENTS (JSX-only, render nothing)
 * - Angular-ish props: sortable/resizable/freeze optional with defaults
 * - Angular naming: headerDef / cellDef
 * ---------------------------------------------------- */

export type IGridColumnProps<T> = {
  fieldName: string;
  title?: string;

  width?: IGridColumnWidth;
  freeze?: boolean;

  // Angular defaults: sortable/resizable true for data columns
  sortable?: boolean;
  resizable?: boolean;

  headerDef?: (col: IGridColumnLike<T>) => ReactNode;

  cellDef?:
    | ((row: T) => ReactNode)
    | ((
        row: T,
        ctx: { row: T; index: number; column: IGridColumnLike<T> }
      ) => ReactNode);
};

export function IGridColumn<T>(_props: IGridColumnProps<T>) {
  return null;
}
(IGridColumn as any).$$kind = 'IGridColumn';

export type IGridCustomColumnProps<T> = {
  title?: string;

  width?: IGridColumnWidth;
  freeze?: boolean;

  // Angular defaults for custom columns: sortable false, resizable true
  sortable?: boolean;
  resizable?: boolean;

  headerDef?: (col: IGridColumnLike<T>) => ReactNode;

  cellDef?:
    | ((row: T) => ReactNode)
    | ((
        row: T,
        ctx: { row: T; index: number; column: IGridColumnLike<T> }
      ) => ReactNode);
};

export function IGridCustomColumn<T>(_props: IGridCustomColumnProps<T>) {
  return null;
}
(IGridCustomColumn as any).$$kind = 'IGridCustomColumn';

export type IGridColumnGroupProps = { title: string; children: ReactNode };
export function IGridColumnGroup(_props: IGridColumnGroupProps) {
  return null;
}
(IGridColumnGroup as any).$$kind = 'IGridColumnGroup';

export type IGridExpandableRowRenderCtx<T> = { row: T; index: number };
export type IGridExpandableRowProps<T> = {
  expandSingle?: boolean;
  render: (row: T, ctx: IGridExpandableRowRenderCtx<T>) => ReactNode;
};
export function IGridExpandableRow<T>(_props: IGridExpandableRowProps<T>) {
  return null;
}
(IGridExpandableRow as any).$$kind = 'IGridExpandableRow';

/* ----------------------------------------------------
 * Helpers
 * ---------------------------------------------------- */

function IndeterminateCheckbox(props: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  stopRowClick?: boolean;
}) {
  const { checked, indeterminate, onChange, className, stopRowClick } = props;
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      className={className}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => {
        if (stopRowClick) e.stopPropagation();
      }}
    />
  );
}

function renderCellDef<T>(
  def: IGridColumnLike<T>['cellDef'],
  row: T,
  ctx: { row: T; index: number; column: IGridColumnLike<T> }
): ReactNode {
  if (!def) return null;
  // supports (row) and (row, ctx)
  return def.length >= 2 ? (def as any)(row, ctx) : (def as any)(row);
}

/* ----------------------------------------------------
 * GRID PROPS
 * ---------------------------------------------------- */

export type IGridProps<T> = {
  dataSource: IGridDataSource<T> | T[];

  selectionMode?: IGridSelectionMode;

  tree?: string | boolean | null;
  treeIndent?: number;
  treeColumn?: string;
  treeInitialExpandLevel?: number | null;

  showNumberColumn?: boolean;

  onSelectionChange?: (e: IGridSelectionChange<T>) => void;
  onRowClick?: (row: T) => void;

  onRowExpandChange?: (e: { row: T; expanded: boolean }) => void;
  onExpandedRowsChange?: (rows: T[]) => void;

  children?: ReactNode;

  /**
   * If you want React-side highlighting (instead of Angular pipe),
   * pass a function; otherwise plain text will render.
   */
  highlightSearch?: (text: string, filter: string) => ReactNode;
  rowKey?: (row: T, index: number) => string | number;
};

/* ----------------------------------------------------
 * GRID
 * ---------------------------------------------------- */

export function IGrid<T>(props: IGridProps<T>) {
  const {
    dataSource,
    selectionMode = false,

    tree = null,
    treeIndent = 16,
    treeColumn,
    treeInitialExpandLevel = null,

    showNumberColumn = true,

    onSelectionChange,
    onRowClick,

    onRowExpandChange,
    onExpandedRowsChange,

    children,
    highlightSearch,
  } = props;

  const idRef = useRef<string>(Math.random().toString(36).slice(2));

  const selectionColumnWidth = 32;
  const numberColumnWidth = 60;
  const expandColumnWidth = 32;
  const defaultColumnWidth = 200;

  const [renderedData, setRenderedData] = useState<T[]>([]);
  const [currentFilterText, setCurrentFilterText] = useState<string>('');
  const [sortStates, setSortStates] = useState<ISortState[]>([]);

  const columnWidthsRef = useRef<Map<IGridColumnLike<T>, number>>(new Map());
  const [, setTick] = useState(0);

  const [selectionSet, setSelectionSet] = useState<Set<T>>(new Set());
  const [expandedSet, setExpandedSet] = useState<Set<T>>(new Set());

  // tree meta
  const treeMetaRef = useRef<
    Map<
      T,
      {
        level: number;
        parent: T | null;
        hasChildren: boolean;
        expanded: boolean;
      }
    >
  >(new Map());
  const treeRootsRef = useRef<T[]>([]);

  /* ---------------- parse JSX config ---------------- */
  /**
   * ✅ IMPORTANT FIX:
   * Preserve the exact JSX order (Angular-like content projection order):
   * - If user writes: Column, Group, Custom => headerItems should be [col, group, col]
   * - And effectiveColumns should be flattened in that same visual order.
   */
  const { headerItems, columns, expandableRowDef } = useMemo(() => {
    const all = Children.toArray(children).filter(Boolean) as ReactElement[];

    let expandable: IGridExpandableRowProps<T> | null = null;

    const parseColumnEl = (
      el: ReactElement<any>
    ): IGridColumnLike<T> | null => {
      const kind = (el.type as any)?.$$kind;
      if (kind !== 'IGridColumn' && kind !== 'IGridCustomColumn') return null;

      const p = el.props as any;
      const isDataCol = kind === 'IGridColumn';

      const col: IGridColumnLike<T> = {
        fieldName: isDataCol ? p.fieldName : undefined,
        title: p.title ?? '',

        // ✅ Angular-ish defaults:
        sortable: p.sortable ?? (isDataCol ? true : false),
        resizable: p.resizable ?? true,
        freeze: !!p.freeze,

        width: p.width,

        headerDef: p.headerDef,
        cellDef: p.cellDef,

        isAuto: false,
      };

      return col;
    };

    // ✅ Build header items IN PLACE (preserve order)
    const header: IGridHeaderItem<T>[] = [];

    for (const node of all) {
      const kind = (node.type as any)?.$$kind;

      if (kind === 'IGridExpandableRow') {
        expandable = node.props as IGridExpandableRowProps<T>;
        continue;
      }

      if (kind === 'IGridColumnGroup') {
        const gp = node.props as any;
        const kids = Children.toArray(gp.children).filter(
          Boolean
        ) as ReactElement[];

        const gCols: IGridColumnLike<T>[] = [];
        for (const kid of kids) {
          const c = parseColumnEl(kid as any);
          if (c) gCols.push(c);
        }

        header.push({
          kind: 'group',
          title: gp.title ?? '',
          columns: gCols,
        });
        continue;
      }

      const c = parseColumnEl(node as any);
      if (c) header.push({ kind: 'col', col: c });
    }

    const explicit = header.some(
      (h) =>
        h.kind === 'col' ||
        (h.kind === 'group' && h.columns && h.columns.length > 0)
    );

    if (!explicit) {
      return {
        headerItems: [] as IGridHeaderItem<T>[],
        columns: [] as IGridColumnLike<T>[],
        expandableRowDef: expandable,
      };
    }

    // ✅ Flatten columns in the same order as header items (group columns inline)
    const flat: IGridColumnLike<T>[] = [];
    for (const item of header) {
      if (item.kind === 'col') flat.push(item.col);
      else flat.push(...item.columns);
    }

    return { headerItems: header, columns: flat, expandableRowDef: expandable };
  }, [children]);

  const hasExpandableRow = !!expandableRowDef?.render;

  /* ---------------- tree config ---------------- */

  const treeEnabled = tree !== null && tree !== false;

  const treeChildrenKey = useMemo(() => {
    if (!treeEnabled) return 'children';
    if (tree === true) return 'children';
    if (typeof tree === 'string') {
      const t = tree.trim();
      if (!t || t === 'true') return 'children';
      return t;
    }
    return 'children';
  }, [tree, treeEnabled]);

  const showNumberColumnEffective = !treeEnabled ? showNumberColumn : false;

  /* ---------------- auto columns fallback ---------------- */

  const rawRows = useMemo(() => {
    if (dataSource instanceof IGridDataSource) return dataSource.data ?? [];
    if (Array.isArray(dataSource)) return dataSource;
    return [];
  }, [dataSource]);

  const autoColumns: IGridColumnLike<T>[] = useMemo(() => {
    if (!rawRows.length) return [];
    const first = rawRows[0] as unknown;
    if (first === null || typeof first !== 'object') return [];
    const keys = Object.keys(first as Record<string, unknown>);

    return keys.map((key) => ({
      fieldName: key,
      title: key,
      sortable: true,
      resizable: true,
      width: 'fill' as const,
      freeze: false,
      headerDef: undefined,
      cellDef: undefined,
      isAuto: true,
    }));
  }, [rawRows]);

  const effectiveHeaderItems: IGridHeaderItem<T>[] = useMemo(() => {
    if (headerItems.length) return headerItems;
    return autoColumns.map((c) => ({ kind: 'col', col: c }));
  }, [headerItems, autoColumns]);

  const effectiveColumns: IGridColumnLike<T>[] = useMemo(() => {
    if (columns.length) return columns;
    return autoColumns;
  }, [columns, autoColumns]);

  /* ---------------- widths ---------------- */

  const getColumnWidth = (col: IGridColumnLike<T>): number | null => {
    const override = columnWidthsRef.current.get(col);
    if (typeof override === 'number') return override;

    if (typeof col.width === 'number') return col.width;
    if (col.width === 'fill') return null;

    return defaultColumnWidth;
  };

  const getColumnFlex = (col: IGridColumnLike<T>): string => {
    const px = getColumnWidth(col);
    if (px !== null) return `0 0 ${px}px`;
    return '1 1 0';
  };

  const setColumnWidth = (col: IGridColumnLike<T>, width: number) => {
    columnWidthsRef.current.set(col, width);
    setTick((n) => n + 1);
  };

  useEffect(() => {
    const map = columnWidthsRef.current;
    for (const col of effectiveColumns) {
      if (!map.has(col)) {
        const px = getColumnWidth(col);
        if (px !== null) map.set(col, px);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveColumns]);

  /* ---------------- frozen columns ---------------- */

  const getFrozenEndIndex = (): number => {
    for (let i = effectiveColumns.length - 1; i >= 0; i--) {
      if (effectiveColumns[i].freeze) return i;
    }
    return -1;
  };

  const hasFrozenColumns = getFrozenEndIndex() >= 0;

  const isColumnFrozen = (col: IGridColumnLike<T>): boolean => {
    const end = getFrozenEndIndex();
    if (end < 0) return false;
    const idx = effectiveColumns.indexOf(col);
    if (idx === -1) return false;
    return idx <= end;
  };

  const getSpecialColumnsLeftOffset = (opts?: {
    includeNumber?: boolean;
    includeExpand?: boolean;
    includeSelection?: boolean;
  }): number => {
    const includeNumber = opts?.includeNumber ?? true;
    const includeExpand = opts?.includeExpand ?? true;
    const includeSelection = opts?.includeSelection ?? true;

    let left = 0;

    // tree mode has NO special expand/selection columns (matches Angular)
    if (!treeEnabled) {
      if (includeSelection && !!selectionMode) left += selectionColumnWidth;
      if (includeExpand && hasExpandableRow) left += expandColumnWidth;
    }

    if (includeNumber && showNumberColumnEffective) left += numberColumnWidth;

    return left;
  };

  const getStickyLeftForExpandColumn = () =>
    getSpecialColumnsLeftOffset({
      includeSelection: false,
      includeExpand: false,
      includeNumber: false,
    });

  const getStickyLeftForSelectionColumn = () =>
    getSpecialColumnsLeftOffset({
      includeSelection: false,
      includeExpand: true,
      includeNumber: false,
    });

  const getStickyLeftForNumberColumn = () =>
    getSpecialColumnsLeftOffset({
      includeSelection: true,
      includeExpand: true,
      includeNumber: false,
    });

  const getColumnStickyLeft = (col: IGridColumnLike<T>): number | null => {
    if (!isColumnFrozen(col)) return null;

    const end = getFrozenEndIndex();
    if (end < 0) return null;

    const idx = effectiveColumns.indexOf(col);
    if (idx === -1 || idx > end) return null;

    let left = 0;
    left += getSpecialColumnsLeftOffset();

    for (let i = 0; i < idx; i++) {
      const c = effectiveColumns[i];
      if (!isColumnFrozen(c)) continue;

      const w = getColumnWidth(c);
      if (w === null) return null;
      left += w;
    }

    return left;
  };

  const getFrozenColumnZ = (col: IGridColumnLike<T>): number => {
    // ✅ identical to Angular:
    // base + (endIndex - idx)
    const end = getFrozenEndIndex();
    if (end < 0) return 2;

    const idx = effectiveColumns.indexOf(col);
    if (idx === -1) return 2;

    const base = 20;
    return base + (end - idx);
  };

  /* ---------------- connect data ---------------- */

  useEffect(() => {
    const updateFilterText = () => {
      setCurrentFilterText(
        dataSource instanceof IGridDataSource ? dataSource.filter : ''
      );
    };

    const buildTreeMeta = (roots: T[]) => {
      treeMetaRef.current.clear();
      treeRootsRef.current = [];

      const getChildren = (row: T): T[] => {
        const r = row as unknown as Record<string, unknown>;
        const value = r?.[treeChildrenKey] as unknown;
        return Array.isArray(value) ? (value as T[]) : [];
      };

      const getInitialExpandLevelInternal = (): number | null => {
        if (!treeEnabled) return null;
        if (treeInitialExpandLevel === null) return null;
        const n = Number(treeInitialExpandLevel);
        if (!Number.isFinite(n) || n <= 0) return null;
        return n - 1;
      };

      const shouldRowStartExpanded = (
        level: number,
        hasChildrenFlag: boolean
      ) => {
        if (!hasChildrenFlag) return false;
        const max = getInitialExpandLevelInternal();
        if (max === null) return false;
        return level <= max;
      };

      const visit = (row: T, level: number, parent: T | null) => {
        const children = getChildren(row);
        const hasChildrenFlag = children.length > 0;
        const expanded = shouldRowStartExpanded(level, hasChildrenFlag);

        if (parent === null) treeRootsRef.current.push(row);
        treeMetaRef.current.set(row, {
          level,
          parent,
          hasChildren: hasChildrenFlag,
          expanded,
        });

        children.forEach((c) => visit(c, level + 1, row));
      };

      (roots || []).forEach((r) => visit(r, 0, null));
    };

    const rebuildTreeRenderedWith = (getChildren: (r: T) => T[]) => {
      const out: T[] = [];

      const appendVisible = (row: T) => {
        out.push(row);
        const meta = treeMetaRef.current.get(row);
        if (!meta?.expanded) return;

        const children = getChildren(row);
        for (const child of children) appendVisible(child);
      };

      for (const root of treeRootsRef.current) appendVisible(root);
      setRenderedData(out);
      updateFilterText();
    };

    const connectTree = (roots: T[]) => {
      const getChildren = (row: T): T[] => {
        const r = row as unknown as Record<string, unknown>;
        const value = r?.[treeChildrenKey] as unknown;
        return Array.isArray(value) ? (value as T[]) : [];
      };

      buildTreeMeta(roots);
      rebuildTreeRenderedWith(getChildren);
    };

    // TREE
    if (treeEnabled) {
      if (dataSource instanceof IGridDataSource) {
        setSortStates(
          dataSource.sort?.length ? dataSource.sort.map((s) => ({ ...s })) : []
        );
        const unsub = dataSource.connect((rows) => connectTree(rows || []));
        return () => unsub();
      }

      if (Array.isArray(dataSource)) {
        setSortStates([]);
        connectTree(dataSource);
        return;
      }

      setSortStates([]);
      setRenderedData([]);
      updateFilterText();
      return;
    }

    // FLAT
    if (dataSource instanceof IGridDataSource) {
      setSortStates(
        dataSource.sort?.length ? dataSource.sort.map((s) => ({ ...s })) : []
      );

      const unsub = dataSource.connect((rows) => {
        setRenderedData(rows || []);
        updateFilterText();
      });

      return () => unsub();
    }

    if (Array.isArray(dataSource)) {
      setSortStates([]);
      setRenderedData(dataSource);
      updateFilterText();
      return;
    }

    setSortStates([]);
    setRenderedData([]);
    updateFilterText();
  }, [dataSource, treeEnabled, treeChildrenKey, treeInitialExpandLevel]);

  /* ---------------- selection helpers ---------------- */

  const getTreeChildren = (row: T): T[] => {
    if (!treeEnabled || !row) return [];
    const r = row as unknown as Record<string, unknown>;
    const value = r?.[treeChildrenKey] as unknown;
    return Array.isArray(value) ? (value as T[]) : [];
  };

  const getTreeDescendants = (row: T): T[] => {
    const out: T[] = [];
    const visit = (r: T) => {
      const children = getTreeChildren(r);
      for (const child of children) {
        out.push(child);
        visit(child);
      }
    };
    visit(row);
    return out;
  };

  const hasChildren = (row: T): boolean => {
    if (!treeEnabled) return false;
    return treeMetaRef.current.get(row)?.hasChildren ?? false;
  };

  const getRowChecked = (row: T): boolean => {
    if (!treeEnabled) return selectionSet.has(row);

    const descendants = getTreeDescendants(row);
    if (!descendants.length) return selectionSet.has(row);

    const total = descendants.length;
    const selectedChildren = descendants.filter((c) =>
      selectionSet.has(c)
    ).length;

    const allChildrenSelected = total > 0 && selectedChildren === total;
    const anyChildrenSelected = selectedChildren > 0;

    if (allChildrenSelected && selectionSet.has(row)) return true;
    if (anyChildrenSelected && !allChildrenSelected) return false;

    return selectionSet.has(row);
  };

  const getRowIndeterminate = (row: T): boolean => {
    if (!treeEnabled) return false;

    const descendants = getTreeDescendants(row);
    if (!descendants.length) return false;

    const total = descendants.length;
    const selectedChildren = descendants.filter((c) =>
      selectionSet.has(c)
    ).length;

    const allChildrenSelected = total > 0 && selectedChildren === total;
    const anyChildrenSelected = selectedChildren > 0;

    return anyChildrenSelected && !allChildrenSelected;
  };

  const allVisibleSelected = (): boolean => {
    if (!selectionMode || !renderedData.length) return false;
    return renderedData.every((r) => getRowChecked(r));
  };

  const someVisibleSelected = (): boolean => {
    if (!selectionMode || !renderedData.length) return false;
    const anySelected = renderedData.some(
      (r) => getRowChecked(r) || getRowIndeterminate(r)
    );
    return anySelected && !allVisibleSelected();
  };

  const emitSelectionChange = (lastChanged: T | null, next: Set<T>) => {
    if (!selectionMode) return;
    onSelectionChange?.({ selected: Array.from(next), lastChanged });
  };

  const syncSelectionUpwardsFrom = (row: T, next: Set<T>) => {
    if (!treeEnabled) return;

    let current = treeMetaRef.current.get(row)?.parent ?? null;

    while (current) {
      const descendants = getTreeDescendants(current);
      if (!descendants.length) {
        current = treeMetaRef.current.get(current)?.parent ?? null;
        continue;
      }

      const total = descendants.length;
      const selectedChildren = descendants.filter((c) => next.has(c)).length;

      if (selectedChildren === 0) next.delete(current);
      else if (selectedChildren === total) next.add(current);
      else next.delete(current);

      current = treeMetaRef.current.get(current)?.parent ?? null;
    }
  };

  const setBranchSelection = (row: T, selected: boolean, next: Set<T>) => {
    if (!treeEnabled) {
      if (selected) next.add(row);
      else next.delete(row);
      return;
    }

    const all = [row, ...getTreeDescendants(row)];
    if (selected) all.forEach((r) => next.add(r));
    else all.forEach((r) => next.delete(r));
  };

  const onRowSelectionToggle = (row: T) => {
    if (!selectionMode) return;

    if (selectionMode === 'single') {
      const next = new Set<T>();
      next.add(row);
      setSelectionSet(next);
      emitSelectionChange(row, next);
      return;
    }

    // multiple
    if (treeEnabled) {
      const next = new Set(selectionSet);

      if (hasChildren(row)) {
        const currentlyChecked = getRowChecked(row);
        setBranchSelection(row, !currentlyChecked, next);
      } else {
        if (next.has(row)) next.delete(row);
        else next.add(row);
      }

      syncSelectionUpwardsFrom(row, next);
      setSelectionSet(next);
      emitSelectionChange(row, next);
      return;
    }

    const next = new Set(selectionSet);
    if (next.has(row)) next.delete(row);
    else next.add(row);
    setSelectionSet(next);
    emitSelectionChange(row, next);
  };

  const onToggleAllVisible = () => {
    if (selectionMode !== 'multiple') return;

    const shouldSelect = !allVisibleSelected();

    if (treeEnabled) {
      const next = new Set(selectionSet);
      const roots = [...treeRootsRef.current];

      roots.forEach((r) => {
        setBranchSelection(r, shouldSelect, next);
        syncSelectionUpwardsFrom(r, next);
      });

      setSelectionSet(next);
      emitSelectionChange(null, next);
      return;
    }

    const next = new Set(selectionSet);
    if (shouldSelect) renderedData.forEach((r) => next.add(r));
    else renderedData.forEach((r) => next.delete(r));

    setSelectionSet(next);
    emitSelectionChange(null, next);
  };

  /* ---------------- tree helpers ---------------- */

  const isTreeHostColumn = (col: IGridColumnLike<T>): boolean => {
    if (!treeEnabled) return false;

    const wanted = (treeColumn ?? '').trim();
    const host = wanted
      ? effectiveColumns.find((c) => !!c.fieldName && c.fieldName === wanted)
          ?.fieldName
      : effectiveColumns.find((c) => !!c.fieldName)?.fieldName;

    if (!host) return false;
    return !!col.fieldName && col.fieldName === host;
  };

  const isExpandedTree = (row: T): boolean => {
    if (!treeEnabled) return false;
    return treeMetaRef.current.get(row)?.expanded ?? false;
  };

  const anyTreeExpanded = (): boolean => {
    if (!treeEnabled || !treeRootsRef.current.length) return false;
    return treeRootsRef.current.some((r) => {
      const meta = treeMetaRef.current.get(r);
      return !!meta?.hasChildren && !!meta?.expanded;
    });
  };

  const allTreeExpanded = (): boolean => {
    if (!treeEnabled || !treeRootsRef.current.length) return false;
    for (const meta of treeMetaRef.current.values()) {
      if (meta.hasChildren && !meta.expanded) return false;
    }
    return true;
  };

  const rebuildTreeRendered = () => {
    const out: T[] = [];
    const appendVisible = (row: T) => {
      out.push(row);
      const meta = treeMetaRef.current.get(row);
      if (!meta?.expanded) return;

      const children = getTreeChildren(row);
      for (const child of children) appendVisible(child);
    };

    for (const root of treeRootsRef.current) appendVisible(root);
    setRenderedData(out);
  };

  const onToggleAllTree = () => {
    if (!treeEnabled) return;
    const shouldExpand = !allTreeExpanded();
    treeMetaRef.current.forEach((meta) => {
      if (meta.hasChildren) meta.expanded = shouldExpand;
    });
    rebuildTreeRendered();
  };

  // ✅ accept native MouseEvent (because IButton gives native event)
  const onTreeToggle = (row: T, event?: MouseEvent) => {
    event?.stopPropagation();
    if (!treeEnabled) return;
    const meta = treeMetaRef.current.get(row);
    if (!meta || !meta.hasChildren) return;
    meta.expanded = !meta.expanded;
    rebuildTreeRendered();
  };

  const getRowLevel = (row: T): number => {
    if (!treeEnabled) return 0;
    return treeMetaRef.current.get(row)?.level ?? 0;
  };

  const getTreeIndentPx = (row: T): number => getRowLevel(row) * treeIndent;

  /* ---------------- expandable row (flat mode) ---------------- */

  const isRowExpanded = (row: T) => expandedSet.has(row);

  const setExpanded = (row: T, expanded: boolean) => {
    if (!hasExpandableRow) return;

    setExpandedSet((prev) => {
      const expandSingle = !!expandableRowDef?.expandSingle;
      const was = prev.has(row);
      if (expanded === was) return prev;

      const next = new Set(prev);

      if (expanded) {
        if (expandSingle) {
          const toCollapse = Array.from(next).filter((r) => r !== row);
          toCollapse.forEach((r) =>
            onRowExpandChange?.({ row: r, expanded: false })
          );
          next.clear();
        }
        next.add(row);
        onRowExpandChange?.({ row, expanded: true });
      } else {
        next.delete(row);
        onRowExpandChange?.({ row, expanded: false });
      }

      onExpandedRowsChange?.(Array.from(next));
      return next;
    });
  };

  const allVisibleExpanded = (): boolean => {
    if (!hasExpandableRow || !renderedData.length) return false;
    return renderedData.every((r) => expandedSet.has(r));
  };

  const onToggleAllExpanded = () => {
    if (!hasExpandableRow) return;
    const shouldExpand = !allVisibleExpanded();

    if (shouldExpand) {
      const expandSingle = !!expandableRowDef?.expandSingle;
      if (expandSingle) {
        const first = renderedData[0];
        setExpandedSet((prev) => {
          const next = new Set<T>();
          Array.from(prev).forEach((r) =>
            onRowExpandChange?.({ row: r, expanded: false })
          );
          if (first) {
            next.add(first);
            onRowExpandChange?.({ row: first, expanded: true });
          }
          onExpandedRowsChange?.(Array.from(next));
          return next;
        });
        return;
      }

      setExpandedSet((prev) => {
        const before = new Set(prev);
        const next = new Set(prev);

        for (const row of renderedData) next.add(row);
        for (const row of renderedData)
          if (!before.has(row)) onRowExpandChange?.({ row, expanded: true });

        onExpandedRowsChange?.(Array.from(next));
        return next;
      });
      return;
    }

    setExpandedSet((prev) => {
      const prevArr = Array.from(prev);
      prevArr.forEach((r) => onRowExpandChange?.({ row: r, expanded: false }));
      onExpandedRowsChange?.([]);
      return new Set();
    });
  };

  /* ---------------- sorting ---------------- */

  const sortStatesRef = useRef<ISortState[]>([]);
  useEffect(() => {
    sortStatesRef.current = sortStates;
  }, [sortStates]);

  const computeNextSort = (
    prev: ISortState[],
    columnId: string
  ): ISortState[] => {
    const next = prev.map((s) => ({ ...s })); // clone
    const idx = next.findIndex((s) => s.active === columnId);

    if (idx === -1) {
      // first click -> asc
      next.push({ active: columnId, direction: 'asc' });
      return next;
    }

    const cur = next[idx];
    if (cur.direction === 'asc') {
      cur.direction = 'desc';
      return next;
    }

    if (cur.direction === 'desc') {
      // third click -> remove sort
      next.splice(idx, 1);
      return next;
    }

    // fallback
    cur.direction = 'asc';
    return next;
  };

  const sortByColumn = (col: IGridColumnLike<T>) => {
    if (!(dataSource instanceof IGridDataSource)) return;
    const columnId = col.fieldName;
    if (!columnId) return;
    if (col.sortable === false) return;

    const next = computeNextSort(sortStatesRef.current, columnId);

    // ✅ 1) update UI state
    setSortStates(next);

    // ✅ 2) side effect OUTSIDE setState updater
    dataSource.sort = next.length ? next : null;

    // (optional but matches Angular-ish UX)
    // reset to first page when sorting changes
    if (dataSource.paginatorEnabled) {
      dataSource.paginator = { pageIndex: 0, pageSize: dataSource.pageSize };
    }
  };

  const getColumnDirection = (columnId: string): ISortDirection => {
    const found = sortStates.find((s) => s.active === columnId);
    return found ? found.direction : '';
  };

  /* ---------------- pagination proxies ---------------- */

  const hasPagination =
    !treeEnabled &&
    dataSource instanceof IGridDataSource &&
    dataSource.paginatorEnabled;

  const totalLength =
    dataSource instanceof IGridDataSource
      ? dataSource.length
      : renderedData.length;
  const pageIndex =
    dataSource instanceof IGridDataSource ? dataSource.pageIndex : 0;
  const pageSize =
    dataSource instanceof IGridDataSource ? dataSource.pageSize : 0;
  const pageSizeOptions =
    dataSource instanceof IGridDataSource ? dataSource.pageSizeOptions : [];

  const onPageChange = (e: { pageIndex: number; pageSize: number }) => {
    if (!(dataSource instanceof IGridDataSource)) return;
    dataSource.paginator = { pageIndex: e.pageIndex, pageSize: e.pageSize };
  };

  const getRowNumber = (visibleRowIndex: number): number => {
    if (dataSource instanceof IGridDataSource && hasPagination) {
      return pageIndex * pageSize + visibleRowIndex + 1;
    }
    return visibleRowIndex + 1;
  };

  /* ----------------------------------------------------
   * ANGULAR-CLOSE HeaderCell / Cell
   * - If `col` exists => frozen/sticky/z computed internally (like HostBinding in Angular)
   * - Special columns can still force sticky with overrides (like Angular template does)
   * ---------------------------------------------------- */

  type StickyOverride = {
    /** force sticky/frozen even without `col` (for special columns) */
    frozen?: boolean;
    /** explicit sticky left (for special columns) */
    stickyLeft?: number | null;
    /** explicit zIndex (for special columns) */
    zIndex?: number | null;
  };

  const HeaderCell = (p: {
    col?: IGridColumnLike<T>;
    fixedWidth?: number;
    children: ReactNode;
    className?: string;

    /** Angular parity: header cell may render without column (group title, special columns) */
    resizable?: boolean;
    disableSortClick?: boolean;
    auto?: boolean;

    /** override sticky for special columns (expand/selection/number) */
    sticky?: StickyOverride;
  }) => {
    const {
      col,
      fixedWidth,
      children,
      className,
      resizable,
      disableSortClick,
      auto,
      sticky,
    } = p;

    const minWidth = 50;
    const isResizingRef = useRef(false);

    // ✅ Angular-like: if col exists, compute frozen behavior via grid helpers
    const computedFrozen = !!col && isColumnFrozen(col);
    const computedLeft =
      computedFrozen && col ? getColumnStickyLeft(col) : null;
    const computedZ = computedFrozen && col ? getFrozenColumnZ(col) : null;

    // ✅ allow special columns to override (expand/selection/number)
    const frozen = sticky?.frozen ?? computedFrozen;
    const stickyLeft = sticky?.stickyLeft ?? computedLeft;
    const zIndex = sticky?.zIndex ?? computedZ;

    const isSortable =
      !disableSortClick &&
      !!col?.fieldName &&
      col.sortable !== false &&
      dataSource instanceof IGridDataSource;

    const direction = col?.fieldName ? getColumnDirection(col.fieldName) : '';
    const showIcon = isSortable && direction !== '';

    const flex =
      typeof fixedWidth === 'number'
        ? `0 0 ${fixedWidth}px`
        : col
          ? getColumnFlex(col)
          : '1 1 0';

    const onResizeMouseDown = (event: React.MouseEvent) => {
      if (!col || !resizable) return;
      event.stopPropagation();
      event.preventDefault();

      const startX = event.clientX;

      // measure the header cell, not the handle
      const headerEl = (event.currentTarget as HTMLElement).closest(
        'i-grid-header-cell'
      ) as HTMLElement | null;

      const currentWidth =
        getColumnWidth(col) ?? headerEl?.clientWidth ?? defaultColumnWidth;
      const startWidth = currentWidth;

      const onMove = (e: MouseEvent) => {
        const delta = e.clientX - startX;
        let next = startWidth + delta;
        if (next < minWidth) next = minWidth;
        setColumnWidth(col, next);
      };

      isResizingRef.current = true;

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);

        // let click pass, then re-enable sorting
        setTimeout(() => {
          isResizingRef.current = false;
        }, 0);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    return (
      <i-grid-header-cell
        className={[
          'i-grid-header-cell',
          className,
          isSortable ? 'i-grid-header-cell--sortable' : null,
          direction !== '' ? 'i-grid-header-cell--sorted' : null,
          direction === 'asc' ? 'i-grid-header-cell--sorted-asc' : null,
          direction === 'desc' ? 'i-grid-header-cell--sorted-desc' : null,
          resizable ? 'i-grid-header-cell--resizable' : null,
          frozen ? 'i-grid-header-cell--frozen' : null,
          auto ? 'i-grid-header-cell--auto' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        role="columnheader"
        style={{
          flex,
          position: frozen ? 'sticky' : undefined,
          left: frozen ? (stickyLeft ?? undefined) : undefined,
          zIndex: frozen && typeof zIndex === 'number' ? zIndex : undefined, // ✅ only if explicitly passed
        }}
        onClick={() => {
          if (isResizingRef.current) return;
          if (!col) return;
          if (!isSortable) return;
          sortByColumn(col);
        }}>
        <span className="i-grid-header-cell__content">{children}</span>

        {showIcon ? (
          <span className="i-grid-header-cell__icon">
            <IIcon
              size="sm"
              icon={direction === 'asc' ? 'sort-asc' : 'sort-dsc'}
            />
          </span>
        ) : null}

        <span
          className="i-grid-header-cell__resize-handle"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onResizeMouseDown(e);
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </i-grid-header-cell>
    );
  };

  const Cell = (p: {
    col?: IGridColumnLike<T>;
    fixedWidth?: number;
    children: ReactNode;
    className?: string;

    /** stop propagation on cell click (used by special columns / tree host) */
    onClickStop?: boolean;

    auto?: boolean;

    /** override sticky for special columns */
    sticky?: StickyOverride;
  }) => {
    const { col, fixedWidth, children, className, onClickStop, auto, sticky } =
      p;

    const computedFrozen = !!col && isColumnFrozen(col);
    const computedLeft =
      computedFrozen && col ? getColumnStickyLeft(col) : null;
    const computedZ = computedFrozen && col ? getFrozenColumnZ(col) : null;

    const frozen = sticky?.frozen ?? computedFrozen;
    const stickyLeft = sticky?.stickyLeft ?? computedLeft;
    const zIndex = sticky?.zIndex ?? computedZ;

    const flex =
      typeof fixedWidth === 'number'
        ? `0 0 ${fixedWidth}px`
        : col
          ? getColumnFlex(col)
          : '1 1 0';

    return (
      <i-grid-cell
        className={[
          'i-grid-cell',
          className,
          frozen ? 'i-grid-cell--frozen' : null,
          auto ? 'i-grid-cell--auto' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        role="cell"
        style={{
          flex,
          position: frozen ? 'sticky' : undefined,
          left: frozen ? (stickyLeft ?? undefined) : undefined,
          zIndex: frozen && typeof zIndex === 'number' ? zIndex : undefined, // ✅ only if explicitly passed
        }}
        onClick={(e) => {
          if (onClickStop) e.stopPropagation();
        }}>
        {children}
      </i-grid-cell>
    );
  };

  /* ---------------- render ---------------- */

  return (
    <i-grid className="i-grid" role="table">
      <i-grid-viewport className="i-grid-viewport">
        {/* HEADER */}
        {effectiveHeaderItems.length ? (
          <i-grid-header-row className="i-grid-header-row" role="row">
            {/* FLAT: expand-all (only when expandable row exists AND not single) */}
            {!treeEnabled &&
            hasExpandableRow &&
            !expandableRowDef?.expandSingle ? (
              <HeaderCell
                className="i-grid-expand-cell i-grid-expand-cell--header i-grid-header-cell--frozen"
                fixedWidth={expandColumnWidth}
                disableSortClick
                sticky={{
                  frozen: true,
                  stickyLeft: getStickyLeftForExpandColumn(),
                }}>
                <span className="i-grid-header-cell__content">
                  <IButton
                    className="i-grid-expand-toggle"
                    size="2xs"
                    variant="outline"
                    icon={allVisibleExpanded() ? 'down' : 'next'}
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      onToggleAllExpanded();
                    }}
                  />
                </span>
              </HeaderCell>
            ) : null}

            {/* FLAT: selection header */}
            {!treeEnabled && selectionMode ? (
              <HeaderCell
                className="i-grid-selection-cell i-grid-selection-cell--header i-grid-header-cell--frozen"
                fixedWidth={selectionColumnWidth}
                disableSortClick
                sticky={{
                  frozen: true,
                  stickyLeft: getStickyLeftForSelectionColumn(),
                }}>
                <span className="i-grid-header-cell__content">
                  {selectionMode === 'multiple' ? (
                    <IndeterminateCheckbox
                      checked={allVisibleSelected()}
                      indeterminate={someVisibleSelected()}
                      onChange={() => onToggleAllVisible()}
                      stopRowClick
                    />
                  ) : null}
                </span>
              </HeaderCell>
            ) : null}

            {/* Number header */}
            {showNumberColumnEffective ? (
              <HeaderCell
                className="i-grid-number-cell i-grid-number-cell--header"
                fixedWidth={numberColumnWidth}
                disableSortClick
                sticky={
                  hasFrozenColumns
                    ? {
                        frozen: true,
                        stickyLeft: getStickyLeftForNumberColumn(),
                        // Angular template: number header z=3 when frozen
                        zIndex: 3,
                      }
                    : undefined
                }>
                No.
              </HeaderCell>
            ) : null}

            {/* Header items */}
            {effectiveHeaderItems.map((item, idx) => {
              if (item.kind === 'col') {
                const col = item.col;

                // TREE host column header content
                if (treeEnabled && isTreeHostColumn(col)) {
                  return (
                    <HeaderCell
                      key={`h-${idx}`}
                      col={col}
                      resizable={col.resizable}
                      auto={!!col.isAuto}>
                      <span className="i-grid-tree-head">
                        <IButton
                          className="i-grid-tree-expand-all"
                          size="2xs"
                          variant="outline"
                          icon={anyTreeExpanded() ? 'down' : 'next'}
                          onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            onToggleAllTree();
                          }}
                        />

                        {selectionMode === 'multiple' ? (
                          <IndeterminateCheckbox
                            className="i-grid-tree-header-checkbox"
                            checked={allVisibleSelected()}
                            indeterminate={someVisibleSelected()}
                            onChange={() => onToggleAllVisible()}
                            stopRowClick
                          />
                        ) : null}

                        <span className="i-grid-tree-head__title">
                          {col.title || col.fieldName}
                        </span>
                      </span>
                    </HeaderCell>
                  );
                }

                // custom headerDef
                if (col.headerDef) {
                  return (
                    <React.Fragment key={`h-${idx}`}>
                      {col.headerDef(col)}
                    </React.Fragment>
                  );
                }

                return (
                  <HeaderCell
                    key={`h-${idx}`}
                    col={col}
                    resizable={col.resizable}
                    auto={!!col.isAuto}>
                    {col.title || col.fieldName}
                  </HeaderCell>
                );
              }

              // GROUP HEADER
              return (
                <i-grid-header-cell-group
                  key={`g-${idx}`}
                  className="i-grid-header-cell-group"
                  role="presentation">
                  {/* Group title cell (NOT frozen in Angular) */}
                  <HeaderCell disableSortClick>{item.title}</HeaderCell>

                  <i-grid-header-cell-group-columns
                    className="i-grid-header-cell-group-columns"
                    role="presentation">
                    {item.columns.map((col, cIdx) => {
                      if (col.headerDef) {
                        return (
                          <React.Fragment key={`gc-${cIdx}`}>
                            {col.headerDef(col)}
                          </React.Fragment>
                        );
                      }

                      return (
                        <HeaderCell
                          key={`gc-${cIdx}`}
                          col={col}
                          resizable={col.resizable}
                          auto={!!col.isAuto}>
                          {col.title || col.fieldName}
                        </HeaderCell>
                      );
                    })}
                  </i-grid-header-cell-group-columns>
                </i-grid-header-cell-group>
              );
            })}
          </i-grid-header-row>
        ) : null}

        {/* ROWS */}
        {renderedData.map((row, rowIndex) => {
          const key = props.rowKey ? props.rowKey(row, rowIndex) : rowIndex;

          return (
            <React.Fragment key={`r-${key}`}>
              <i-grid-row
                className={[
                  'i-grid-row',
                  selectionMode ? 'i-grid-selection-row' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="row"
                onClick={() => onRowClick?.(row)}>
                {/* Expand control (flat mode) */}
                {!treeEnabled && hasExpandableRow ? (
                  <Cell
                    className="i-grid-expand-cell i-grid-expand-cell--body"
                    fixedWidth={expandColumnWidth}
                    onClickStop
                    sticky={{
                      frozen: true,
                      stickyLeft: getStickyLeftForExpandColumn(),
                    }}>
                    <span className="i-grid-expand-cell__content">
                      <IButton
                        className="i-grid-expand-toggle"
                        size="2xs"
                        variant="outline"
                        icon={isRowExpanded(row) ? 'down' : 'next'}
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          setExpanded(row, !isRowExpanded(row));
                        }}
                      />
                    </span>
                  </Cell>
                ) : null}

                {/* Selection (flat mode) */}
                {!treeEnabled && selectionMode ? (
                  <Cell
                    className="i-grid-selection-cell i-grid-selection-cell--body"
                    fixedWidth={selectionColumnWidth}
                    onClickStop
                    sticky={{
                      frozen: true,
                      stickyLeft: getStickyLeftForSelectionColumn(),
                    }}>
                    {selectionMode === 'multiple' ? (
                      <IndeterminateCheckbox
                        checked={getRowChecked(row)}
                        indeterminate={getRowIndeterminate(row)}
                        onChange={() => onRowSelectionToggle(row)}
                        stopRowClick
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={selectionSet.has(row)}
                        name={`i-grid-radio-${idRef.current}`}
                        onChange={() => onRowSelectionToggle(row)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </Cell>
                ) : null}

                {/* Number */}
                {showNumberColumnEffective ? (
                  <Cell
                    className="i-grid-number-cell i-grid-number-cell--body"
                    fixedWidth={numberColumnWidth}
                    onClickStop
                    sticky={
                      hasFrozenColumns
                        ? {
                            frozen: true,
                            stickyLeft: getStickyLeftForNumberColumn(),
                            zIndex: 2,
                          }
                        : undefined
                    }>
                    <span className="i-grid-cell__content">
                      {getRowNumber(rowIndex)}
                    </span>
                  </Cell>
                ) : null}

                {/* Cells */}
                {effectiveColumns.map((col, colIndex) => {
                  // TREE HOST
                  if (treeEnabled && isTreeHostColumn(col)) {
                    return (
                      <Cell
                        key={`c-${rowIndex}-${colIndex}`}
                        col={col}
                        onClickStop
                        auto={!!col.isAuto}>
                        <span className="i-grid-tree-inline">
                          <span
                            className="i-grid-tree-indent"
                            style={{ width: getTreeIndentPx(row) }}
                          />

                          {hasChildren(row) ? (
                            <IButton
                              className="i-grid-tree-toggle"
                              size="2xs"
                              variant="outline"
                              icon={isExpandedTree(row) ? 'down' : 'next'}
                              onClick={(e: MouseEvent) => {
                                e.stopPropagation();
                                onTreeToggle(row, e);
                              }}
                            />
                          ) : (
                            <span className="i-grid-tree-spacer" />
                          )}

                          {selectionMode === 'multiple' ? (
                            <IndeterminateCheckbox
                              className="i-grid-tree-checkbox"
                              checked={getRowChecked(row)}
                              indeterminate={getRowIndeterminate(row)}
                              onChange={() => onRowSelectionToggle(row)}
                              stopRowClick
                            />
                          ) : selectionMode === 'single' ? (
                            <input
                              className="i-grid-tree-radio"
                              type="radio"
                              checked={selectionSet.has(row)}
                              name={`i-grid-radio-${idRef.current}`}
                              onChange={() => onRowSelectionToggle(row)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : null}

                          {col.cellDef ? (
                            renderCellDef(col.cellDef, row, {
                              row,
                              index: rowIndex,
                              column: col,
                            })
                          ) : (
                            <span className="i-grid-tree-text">
                              {col.fieldName
                                ? highlightSearch
                                  ? highlightSearch(
                                      String(
                                        (
                                          row as unknown as Record<
                                            string,
                                            unknown
                                          >
                                        )?.[col.fieldName] ?? ''
                                      ),
                                      currentFilterText
                                    )
                                  : String(
                                      (
                                        row as unknown as Record<
                                          string,
                                          unknown
                                        >
                                      )?.[col.fieldName] ?? ''
                                    )
                                : ''}
                            </span>
                          )}
                        </span>
                      </Cell>
                    );
                  }

                  // NORMAL CELL
                  return (
                    <Cell
                      key={`c-${rowIndex}-${colIndex}`}
                      col={col}
                      auto={!!col.isAuto}>
                      {col.cellDef ? (
                        renderCellDef(col.cellDef, row, {
                          row,
                          index: rowIndex,
                          column: col,
                        })
                      ) : (
                        <span className="i-grid-cell__content">
                          {col.fieldName
                            ? highlightSearch
                              ? highlightSearch(
                                  String(
                                    (
                                      row as unknown as Record<string, unknown>
                                    )?.[col.fieldName] ?? ''
                                  ),
                                  currentFilterText
                                )
                              : String(
                                  (row as unknown as Record<string, unknown>)?.[
                                    col.fieldName
                                  ] ?? ''
                                )
                            : ''}
                        </span>
                      )}
                    </Cell>
                  );
                })}
              </i-grid-row>

              {/* DETAIL ROW */}
              {hasExpandableRow && isRowExpanded(row) ? (
                <i-grid-expandable-row
                  className="i-grid-expandable-row flex"
                  role="row">
                  {expandableRowDef!.render(row, { row, index: rowIndex })}
                </i-grid-expandable-row>
              ) : null}
            </React.Fragment>
          );
        })}
      </i-grid-viewport>

      {/* FOOTER */}
      {hasPagination ? (
        <div className="i-grid-footer">
          <IPaginator
            length={totalLength}
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </i-grid>
  );
}
