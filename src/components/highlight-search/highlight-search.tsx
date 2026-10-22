import { Fragment } from 'react';
import { highlightSearchParts } from './highlight-search-parts';
export interface IHighlightSearchProps {
  value?: string | number | null;
  search?: string;
}
export function IHighlightSearch({
  value,
  search = '',
}: IHighlightSearchProps) {
  return (
    <i-highlight-search class="i-highlight-search">
      {highlightSearchParts(value, search).map((part, index) =>
        part.matched ? (
          <span className="highlight-search" key={index}>
            {part.text}
          </span>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        )
      )}
    </i-highlight-search>
  );
}
