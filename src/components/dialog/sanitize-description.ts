const FORMATTING_TAGS = new Set(['strong', 'b', 'em', 'i', 'br']);
const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'svg',
  'math',
  'template',
]);

/** Retains inline dialog formatting without attributes or active content. */
export function sanitizeDialogDescription(description: string): string {
  if (typeof document === 'undefined') {
    return description
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  const source = document.createElement('template');
  source.innerHTML = description;
  const result = document.createElement('div');
  const append = (node: Node, parent: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(document.createTextNode(node.textContent ?? ''));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const element = node as Element;
    const tag = element.localName;
    if (
      element.namespaceURI !== 'http://www.w3.org/1999/xhtml' ||
      BLOCKED_TAGS.has(tag)
    )
      return;
    const target = FORMATTING_TAGS.has(tag)
      ? document.createElement(tag)
      : parent;
    if (target !== parent) parent.appendChild(target);
    for (const child of Array.from(element.childNodes)) append(child, target);
  };
  for (const child of Array.from(source.content.childNodes))
    append(child, result);
  return result.innerHTML;
}
