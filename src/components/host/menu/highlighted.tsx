import React, { memo, useMemo, type JSX } from 'react';

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

export const Highlighted = memo(function Highlighted(props: {
  text: string;
  term: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const { text, term, as = 'span' } = props;
  const html = useMemo(() => highlightSearchHtml(text, term), [text, term]);
  const Tag: React.ElementType = as;

  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
});
