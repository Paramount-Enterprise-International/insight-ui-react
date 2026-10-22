export interface IHighlightSearchPart {
  text: string;
  matched: boolean;
}
export function highlightSearchParts(
  value: string | number | null | undefined,
  search: string
): IHighlightSearchPart[] {
  const text = String(value ?? '');
  if (!search || !text) return [{ text, matched: false }];
  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const result: IHighlightSearchPart[] = [];
  let offset = 0;
  for (const match of text.matchAll(regex)) {
    const index = match.index!;
    if (index > offset)
      result.push({ text: text.slice(offset, index), matched: false });
    result.push({ text: match[0], matched: true });
    offset = index + match[0].length;
  }
  if (offset < text.length)
    result.push({ text: text.slice(offset), matched: false });
  return result;
}
