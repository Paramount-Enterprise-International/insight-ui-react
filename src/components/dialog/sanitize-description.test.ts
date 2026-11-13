import { sanitizeDialogDescription } from './sanitize-description';

describe('sanitizeDialogDescription', () => {
  for (const description of [
    '<STRONG style="color:red" title="x">Allowed</STRONG><!-- comment --><br/>',
    '<a href="javascript:alert(1)"><b onclick="alert(1)">Allowed</b></a>',
    '<svg><foreignObject><strong>Hidden</strong></foreignObject></svg><em>Allowed</em>',
    '<math><mtext><img src=x onerror=alert(1)></mtext></math><i>Allowed</i>',
    '<template><img src=x onerror=alert(1)></template><strong>Allowed</strong>',
    '<textarea><img src=x onerror=alert(1)></textarea><strong>Allowed</strong>',
    '<noscript><p title="</noscript><img src=x onerror=alert(1)>">Text</p>',
  ]) {
    it(`reconstructs only safe formatting for ${description}`, () => {
      const result = document.createElement('div');
      result.innerHTML = sanitizeDialogDescription(description);
      expect(
        result.querySelector(
          'script, style, img, svg, math, iframe, template, a, [onclick], [onerror]'
        )
      ).toBeNull();
      for (const element of Array.from(result.querySelectorAll('*'))) {
        expect(['strong', 'b', 'em', 'i', 'br']).toContain(element.localName);
        expect(element.attributes.length).toBe(0);
        expect(element.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
      }
    });
  }

  it('preserves literal escaped markup, ampersands and non-ASCII names', () => {
    const result = document.createElement('div');
    result.innerHTML = sanitizeDialogDescription(
      '&lt;img src=x onerror=alert(1)&gt; &amp; O&#39;Brien - José'
    );
    expect(result.textContent).toBe(
      "<img src=x onerror=alert(1)> & O'Brien - José"
    );
    expect(result.children.length).toBe(0);
  });

  it('drops active subtrees instead of exposing their contents', () => {
    expect(
      sanitizeDialogDescription(
        '<script>hidden</script><style>hidden</style><iframe>hidden</iframe>Visible'
      )
    ).toBe('Visible');
  });
});
