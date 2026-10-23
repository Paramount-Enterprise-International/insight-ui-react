import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IHighlightSearch } from './highlight-search';
import { highlightSearchParts } from './highlight-search-parts';
describe('IHighlightSearch', () => {
  it('renders literal HTML and highlights regex characters case-insensitively', () => {
    const { container } = render(
      <IHighlightSearch value="<b>A.B a.b</b>" search="a.b" />
    );
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelectorAll('.highlight-search').length).toBe(2);
    expect(container.textContent).toBe('<b>A.B a.b</b>');
  });
  it('handles zero, null and empty search', () => {
    expect(highlightSearchParts(0, '0')).toEqual([
      { text: '0', matched: true },
    ]);
    expect(highlightSearchParts(null, 'x')).toEqual([
      { text: '', matched: false },
    ]);
    expect(highlightSearchParts('text', '')).toEqual([
      { text: 'text', matched: false },
    ]);
  });
});
