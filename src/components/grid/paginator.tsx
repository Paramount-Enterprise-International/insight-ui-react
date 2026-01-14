/* paginator.tsx */
/**
 * IPaginator (React)
 * Matches Angular behavior:
 * - page size buttons
 * - numeric pages with ellipsis
 * - emits pageChange with { pageIndex, pageSize }
 */

import { useMemo } from 'react';
import { IButton } from '../button/button';

export type IPaginatorState = {
  pageIndex: number;
  pageSize: number;
};

type IPaginatorItem =
  | { type: 'page'; pageIndex: number; label: string; active: boolean }
  | { type: 'ellipsis'; key: string };

export type IPaginatorProps = {
  length: number;
  pageIndex: number; // 0-based
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (state: IPaginatorState) => void;
};

export function IPaginator(props: IPaginatorProps) {
  const { length, pageIndex, pageSize, pageSizeOptions, onPageChange } = props;

  const maxVisiblePages = 6;

  const pageCount = Math.max(1, Math.ceil(length / pageSize));

  const pageItems: IPaginatorItem[] = useMemo(() => {
    const total = pageCount;
    const current = pageIndex + 1; // 1-based
    const last = total;

    const range = (from: number, to: number) => {
      const out: number[] = [];
      for (let i = from; i <= to; i++) out.push(i);
      return out;
    };

    const pageItem = (pageNumber1Based: number): IPaginatorItem => {
      const idx = pageNumber1Based - 1;
      return {
        type: 'page',
        pageIndex: idx,
        label: String(pageNumber1Based),
        active: pageNumber1Based === current,
      };
    };

    if (total <= maxVisiblePages) {
      return range(1, last).map(pageItem);
    }

    if (current <= 4) {
      return [
        ...range(1, 5).map(pageItem),
        { type: 'ellipsis', key: 'e-end' },
        pageItem(last),
      ];
    }

    if (current >= last - 3) {
      const start = last - 4;
      return [
        pageItem(1),
        { type: 'ellipsis', key: 'e-start' },
        ...range(start, last).map(pageItem),
      ];
    }

    const midStart = current - 2;
    const midEnd = current + 1;

    return [
      pageItem(1),
      { type: 'ellipsis', key: 'e-start' },
      ...range(midStart, midEnd).map(pageItem),
      { type: 'ellipsis', key: 'e-end' },
      pageItem(last),
    ];
  }, [pageCount, pageIndex]);

  const emit = (nextIndex: number, nextSize: number) => {
    const maxIndex = pageCount - 1;
    const clampedIndex = Math.max(0, Math.min(maxIndex, nextIndex));
    onPageChange({ pageIndex: clampedIndex, pageSize: nextSize });
  };

  const goToPage = (idx: number) => {
    if (idx === pageIndex) return;
    emit(idx, pageSize);
  };

  const changePageSize = (size: number) => {
    const newSize = Number(size);
    if (!Number.isFinite(newSize) || newSize <= 0) return;

    const oldSize = pageSize;
    const firstItemIndex = pageIndex * oldSize;

    const nextIndex = Math.floor(firstItemIndex / newSize);
    emit(nextIndex, newSize);
  };

  return (
    <i-paginator className="i-paginator">
      <div className="i-paginator flex align-center gap-md flex-fill">
        {/* Page size */}
        {pageSizeOptions.map((size) => (
          <IButton
            key={size}
            size="sm"
            disabled={pageSize === size}
            onClick={() => changePageSize(size)}>
            {size}
          </IButton>
        ))}

        <span className="flex-fill" />

        <p>
          Page {pageIndex + 1} of {pageCount} ({length} row
          {length > 1 ? 's' : ''})
        </p>

        {pageCount > 1 ? (
          <div className="i-paginator-pages flex align-center gap-xs">
            {pageItems.map((item) => {
              if (item.type === 'ellipsis') {
                return (
                  <span
                    key={item.key}
                    aria-hidden="true"
                    className="i-paginator-ellipsis">
                    ...
                  </span>
                );
              }

              return (
                <IButton
                  key={`p-${item.pageIndex}`}
                  size="sm"
                  disabled={item.active}
                  onClick={() => goToPage(item.pageIndex)}>
                  {item.label}
                </IButton>
              );
            })}
          </div>
        ) : null}
      </div>
    </i-paginator>
  );
}
