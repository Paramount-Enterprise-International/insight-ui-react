/* grid-data-source.ts */
/**
 * IGridDataSource (React)
 * Mirrors Angular behavior:
 * - filter (string | recursive)
 * - multi-sort
 * - optional paginator
 * - connect(listener) subscription API
 */

import { isRecord } from '../shared';

export type ISortDirection = 'asc' | 'desc' | '';

export type ISortState = {
  active: string;
  direction: ISortDirection;
};

export type ISortConfig = ISortState | ISortState[] | null;

export type IGridFilter =
  | string
  | {
      recursive: true;
      text: string;
      key?: string; // children key
    };

export type IGridPaginatorInput =
  | false
  | {
      pageIndex?: number;
      pageSize?: number;
      pageSizeOptions?: number[];
    };

/**
 * NOTE:
 * No generic here because it's unused (fixes "T is declared but never read")
 * If you later want column-specific typed filter/sort accessors,
 * you can add generic usages in this config.
 */
export type IGridDataSourceConfig = {
  sort?: ISortConfig;
  filter?: IGridFilter;

  /**
   * paginator:
   * - false → disabled
   * - undefined/missing → enabled with defaults
   * - { pageIndex?, pageSize?, pageSizeOptions? } → enabled + overridden
   */
  paginator?: IGridPaginatorInput;
};

type Listener<T> = (rows: T[]) => void;

/** ✅ Sorting accessor must be comparable */
export type IGridSortAccessor<T> = (
  data: T,
  columnId: string
) => string | number;

export class IGridDataSource<T = unknown> {
  private _rawData: T[] = [];

  // filter internal
  private _filter = '';
  private _recursive = false;
  private _childrenKey = 'children';

  // sort internal
  private _sort: ISortState[] | null = null;

  // paginator internal
  private _paginatorEnabled = true;
  private _pageIndex = 0;
  private _pageSize = 10;
  private _pageSizeOptions = [10, 50, 100];

  // listeners
  private _listeners = new Set<Listener<T>>();

  constructor(initialData: T[] = [], config: IGridDataSourceConfig = {}) {
    this._rawData = initialData || [];

    // filter (uses setter to normalize)
    if (config.filter !== null) {
      this.filter = config.filter;
    }

    // sort
    this._sort = this._normalizeSort(config.sort ?? null);

    // paginator
    this._applyPaginatorConfig(config.paginator);

    this._emit();
  }

  /* ---------------- paginator config ---------------- */

  private _applyPaginatorConfig(config: IGridPaginatorInput | undefined): void {
    if (config === false) {
      this._paginatorEnabled = false;
      return;
    }

    // default: enabled
    this._paginatorEnabled = true;

    if (config && typeof config === 'object') {
      this._pageIndex = config.pageIndex ?? 0;
      this._pageSizeOptions = config.pageSizeOptions ?? this._pageSizeOptions;
      this._pageSize = config.pageSize ?? this._pageSizeOptions[0];
      return;
    }

    // paginator missing => defaults
    this._pageIndex = 0;
    this._pageSizeOptions = [10, 50, 100];
    this._pageSize = 10;
  }

  get paginatorEnabled(): boolean {
    return this._paginatorEnabled;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  set paginator(state: { pageIndex: number; pageSize: number } | null) {
    if (!this._paginatorEnabled || !state) return;
    this._pageIndex = state.pageIndex;
    this._pageSize = state.pageSize;
    this._emit();
  }

  get paginator(): { pageIndex: number; pageSize: number } | null {
    if (!this._paginatorEnabled) return null;
    return { pageIndex: this._pageIndex, pageSize: this._pageSize };
  }

  /* ---------------- data ---------------- */

  get data(): T[] {
    return this._rawData;
  }

  set data(value: T[]) {
    this._rawData = value || [];
    this._emit();
  }

  get length(): number {
    return this._rawData.length;
  }

  /* ---------------- filter / sort ---------------- */

  /**
   * Smart filter:
   * - string: normal flat filtering
   * - { recursive: true, text, key? }: recursive tree filtering
   */
  set filter(value: IGridFilter | null | undefined) {
    if (!value) {
      this._filter = '';
      this._recursive = false;
      this._childrenKey = 'children';
      this._emit();
      return;
    }

    if (typeof value === 'string') {
      this._filter = value.toLowerCase().trim();
      this._recursive = false;
      this._childrenKey = 'children';
      this._emit();
      return;
    }

    // object: recursive filter (tree mode)
    this._filter = (value.text ?? '').toLowerCase().trim();
    this._recursive = value.recursive === true;
    this._childrenKey = (value.key || 'children').trim() || 'children';

    this._emit();
  }

  /**
   * Returns the current normalized filter text.
   * (Always plain string, lowercased & trimmed.)
   */
  get filter(): string {
    return this._filter;
  }

  get sort(): ISortState[] | null {
    return this._sort;
  }

  set sort(value: ISortConfig) {
    this._sort = this._normalizeSort(value);
    this._emit();
  }

  // can be customized by consumer
  filterPredicate: (data: T, filter: string) => boolean = (data, filter) => {
    if (!filter) return true;

    // JSON.stringify on unknown is OK (same behavior as Angular version)
    const target = JSON.stringify(data).toLowerCase();
    return target.includes(filter);
  };

  /**
   * ✅ must always return comparable primitive (string|number)
   * Normalize:
   * - non-record → ''
   * - null/undefined → ''
   * - string/number → itself
   * - everything else → String(value)
   */
  sortAccessor: IGridSortAccessor<T> = (data, columnId) => {
    if (!isRecord(data)) return '';

    const v = data[columnId];

    if (typeof v === 'string' || typeof v === 'number') return v;
    if (v === null || v === undefined) return '';

    // (optional) handle Date nicely
    if (v instanceof Date) return v.getTime();

    return String(v);
  };

  /* ---------------- connect ---------------- */

  connect(listener: Listener<T>): () => void {
    this._listeners.add(listener);

    // immediate push (like BehaviorSubject)
    listener(this._computeRendered());

    return () => {
      this._listeners.delete(listener);
    };
  }

  disconnect(): void {
    this._listeners.clear();
  }

  /* ---------------- internals ---------------- */

  /** Basic row match using public filterPredicate */
  private _rowMatchesFilter(data: T, filter: string): boolean {
    if (!filter) return true;
    return this.filterPredicate(data, filter);
  }

  private _filterRecursiveArray(nodes: unknown[], filter: string): unknown[] {
    const result: unknown[] = [];

    for (const node of nodes) {
      const pruned = this._filterRecursiveNode(node, filter);
      if (pruned !== null) result.push(pruned);
    }

    return result;
  }

  private _filterRecursiveNode(node: unknown, filter: string): unknown | null {
    if (!isRecord(node)) {
      // if node isn't an object, treat it like a leaf
      const selfMatches = this._rowMatchesFilter(node as T, filter);
      return selfMatches ? node : null;
    }

    const rawChildren = node[this._childrenKey];
    const children = Array.isArray(rawChildren) ? rawChildren : [];

    const filteredChildren = this._filterRecursiveArray(children, filter);
    const selfMatches = this._rowMatchesFilter(node as T, filter);

    if (!selfMatches && filteredChildren.length === 0) {
      return null;
    }

    const clone: Record<string, unknown> = { ...node };

    if (filteredChildren.length) {
      clone[this._childrenKey] = filteredChildren;
    } else {
      if (Object.prototype.hasOwnProperty.call(clone, this._childrenKey)) {
        delete clone[this._childrenKey];
      }
    }

    return clone;
  }

  private _normalizeSort(sort: ISortConfig): ISortState[] | null {
    if (!sort) return null;

    const arr: ISortState[] = Array.isArray(sort) ? sort : [sort];

    const cleaned = arr.filter(
      (s): s is ISortState =>
        !!s &&
        typeof s.active === 'string' &&
        (s.direction === 'asc' || s.direction === 'desc')
    );

    return cleaned.length ? cleaned : null;
  }

  private _computeRendered(): T[] {
    let data: T[] = [...this._rawData];

    // FILTER
    if (this._filter) {
      const f = this._filter;

      if (this._recursive) {
        data = this._filterRecursiveArray(data as unknown[], f) as T[];
      } else {
        data = data.filter((row) => this.filterPredicate(row, f));
      }
    }

    // SORT (multi-column)
    if (this._sort && this._sort.length > 0) {
      const sorts = [...this._sort];

      data.sort((a: T, b: T) => {
        for (const sort of sorts) {
          const { active, direction } = sort;
          if (!active || !direction) continue;

          const dir = direction === 'asc' ? 1 : -1;

          const aValue = this.sortAccessor(a, active);
          const bValue = this.sortAccessor(b, active);

          if (aValue < bValue) return -1 * dir;
          if (aValue > bValue) return 1 * dir;
        }

        return 0;
      });
    }

    // PAGINATION
    if (this._paginatorEnabled) {
      const start = this._pageIndex * this._pageSize;
      data = data.slice(start, start + this._pageSize);
    }

    return data;
  }

  private _emit(): void {
    const rendered = this._computeRendered();
    this._listeners.forEach((l) => l(rendered));
  }
}
