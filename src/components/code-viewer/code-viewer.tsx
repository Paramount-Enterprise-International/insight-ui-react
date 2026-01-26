import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IButton } from '../button/button';

export type ICodeHighlighter = 'auto' | 'hljs' | 'none';

export type ICodeViewerFileLoaded = {
  file: string;
  language: string;
};

export type ICodeViewerProps = React.HTMLAttributes<HTMLElement> & {
  language?: string | null;
  file?: string | null;
  code?: string | null;

  wrap?: boolean;
  compact?: boolean;

  /** default false */
  lineNumbers?: boolean;

  /** overlay controls */
  overlay?: boolean;
  showFileType?: boolean;
  copy?: boolean;

  /** if true => scroll, and if height specified => scroll forced */
  scroll?: boolean;

  /** "wrap" | "auto" | 300 | "300" | "300px" */
  height?: any;

  highlighter?: ICodeHighlighter;

  onFileLoaded?: (e: ICodeViewerFileLoaded) => void;
};

// -----------------------------
// Helpers
// -----------------------------

function coerceBool(v: any): boolean {
  return v !== null && v !== undefined && `${v}` !== 'false';
}

function escapeHtml(s: string): string {
  return (s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getExtFromPath(path: string): string {
  const clean = (path || '').split('?')[0].split('#')[0];
  const file = clean.split('/').pop() ?? '';
  const idx = file.lastIndexOf('.');
  return idx >= 0 ? file.slice(idx + 1).toLowerCase() : '';
}

function languageFromExt(ext: string): string {
  switch ((ext || '').toLowerCase()) {
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'tsx';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'jsx':
      return 'jsx';
    case 'json':
      return 'json';
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'md':
      return 'markdown';
    case 'sql':
      return 'sql';
    case 'sh':
    case 'bash':
      return 'bash';
    case 'txt':
      return 'text';
    default:
      return 'text';
  }
}

function parseHeight(v: any): number | null {
  if (v === null || v === undefined) return null;

  const s = String(v).trim().toLowerCase();
  if (s === '' || s === 'wrap' || s === 'auto') return null;

  if (s.endsWith('px')) {
    const n = Number(s.slice(0, -2).trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function isAbsoluteUrl(path: string): boolean {
  return /^https?:\/\//i.test(path) || /^\/\//.test(path);
}

/** MF remote-safe: resolve relative file path against the remote bundle URL */
function resolveFileUrl(file: string): string {
  const f = (file ?? '').trim();
  if (!f) return f;

  if (isAbsoluteUrl(f) || f.startsWith('/')) return f;

  const base = (import.meta as any).url as string;
  return new URL(f.replace(/^\.\//, ''), base).toString();
}

function normalizeHljsLanguage(lang: string): string {
  if (lang === 'html') return 'xml';
  return lang;
}

/**
 * Line counting aligned with Angular:
 * - "" => 1
 * - split('\n').length semantics
 */
function countLines(text: string): number {
  if (text === null || text === undefined) return 1;
  const s = String(text);
  if (!s) return 1;
  return s.split('\n').length;
}

// -----------------------------
// Component
// -----------------------------

export function ICodeViewer(props: ICodeViewerProps) {
  const {
    language,
    file,
    code,

    wrap,
    compact,
    lineNumbers,

    overlay,
    showFileType,
    copy,

    scroll,
    height,

    highlighter = 'auto',

    onFileLoaded,

    children,
    ...rest
  } = props;

  // inputs (coerced like Angular)
  const wrapC = coerceBool(wrap);
  const compactC = coerceBool(compact);
  const lineNumbersC = coerceBool(lineNumbers);
  const overlayC = overlay === undefined ? true : coerceBool(overlay);
  const showFileTypeC =
    showFileType === undefined ? true : coerceBool(showFileType);
  const copyC = copy === undefined ? true : coerceBool(copy);
  const scrollC = coerceBool(scroll);
  const heightPx = parseHeight(height);

  const scrollEffective = scrollC || heightPx !== null;
  const showOverlay = overlayC && (showFileTypeC || copyC);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const requestSeqRef = useRef(0);
  const highlightSeqRef = useRef(0);

  const [fileLanguage, setFileLanguage] = useState<string>('text');
  const languageOverride = (language ?? '').trim() || null;

  const fileTrimmed = (file ?? '').trim();
  const codePropString = (code ?? '').toString();

  const effectiveLanguage = useMemo(() => {
    if (languageOverride) return languageOverride;
    if (fileTrimmed) return fileLanguage;
    return 'text';
  }, [languageOverride, fileLanguage, fileTrimmed]);

  const fileTypeLabel = useMemo(() => {
    const l = (effectiveLanguage || 'text').toUpperCase();
    return l === 'TEXT' ? 'CODE' : l;
  }, [effectiveLanguage]);

  // raw code state
  const [rawCode, setRawCode] = useState<string>(() => codePropString);

  // sync raw code from prop changes (explicit code wins)
  useEffect(() => {
    setRawCode(codePropString);
  }, [codePropString]);

  // -----------------------------
  // Projected content (Angular-like): read rendered textContent
  // - only when code prop empty, file empty, and rawCode empty
  // - useLayoutEffect to avoid "empty then fill" paint
  // -----------------------------
  const projectedRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    // Only project when:
    // - no file
    // - no explicit code
    // - and current rawCode is empty (so we don't override)
    if (fileTrimmed) return;
    if (codePropString) return;
    if (rawCode) return;

    const host = projectedRef.current;
    if (!host) return;

    const text = (host.textContent ?? '').trim();
    if (!text) return;

    setRawCode(text);
  }, [children, fileTrimmed, codePropString, rawCode]);

  // highlight.js cache (shared per component instance)
  const hljsRef = useRef<any | null>(null);
  const hljsPromiseRef = useRef<Promise<any> | null>(null);

  const shouldUseHljs = highlighter === 'hljs' || highlighter === 'auto';

  const loadHljsIfNeeded = useCallback(async (): Promise<any | null> => {
    if (hljsRef.current) return hljsRef.current;

    const w = globalThis as any;
    if (w?.hljs?.highlight && w?.hljs?.highlightAuto) {
      hljsRef.current = w.hljs;
      return hljsRef.current;
    }

    if (!hljsPromiseRef.current) {
      hljsPromiseRef.current = import('highlight.js')
        .then((m: any) => m.default ?? m)
        .catch(() => null);
    }

    const loaded = await hljsPromiseRef.current;
    if (loaded?.highlight && loaded?.highlightAuto) {
      hljsRef.current = loaded;
      return loaded;
    }

    return null;
  }, []);

  const highlightWithHljs = useCallback(
    (text: string, lang: string): string => {
      try {
        const hljs = hljsRef.current;
        if (!hljs) return escapeHtml(text);

        const normalized = normalizeHljsLanguage(lang);

        if (normalized && hljs.getLanguage?.(normalized)) {
          return hljs.highlight(text, { language: normalized }).value;
        }
        return hljs.highlightAuto(text).value;
      } catch {
        return escapeHtml(text);
      }
    },
    []
  );

  const renderToHtmlSync = useCallback(
    (text: string, lang: string): string => {
      const raw = text ?? '';
      if (!raw) return '';
      if (highlighter === 'none') return escapeHtml(raw);

      if (shouldUseHljs && hljsRef.current) {
        return highlightWithHljs(raw, lang);
      }
      return escapeHtml(raw);
    },
    [highlighter, shouldUseHljs, highlightWithHljs]
  );

  // load file when file changes
  useEffect(() => {
    const f = fileTrimmed;
    if (!f) return;

    const seq = ++requestSeqRef.current;

    setLoading(true);
    setError('');

    const langFromFile = languageFromExt(getExtFromPath(f));
    setFileLanguage(langFromFile);

    (async () => {
      try {
        const url = resolveFileUrl(f);
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error('http_error');
        const text = await res.text();

        if (seq !== requestSeqRef.current) return;

        setRawCode(text ?? '');
        setLoading(false);
        setError('');

        onFileLoaded?.({
          file: url,
          language: languageOverride ?? langFromFile,
        });
      } catch {
        if (seq !== requestSeqRef.current) return;

        setLoading(false);
        setError(`Failed to load: ${f}`);
      }
    })();
  }, [fileTrimmed, onFileLoaded, languageOverride]);

  // line numbers
  const lineNumberList = useMemo(() => {
    if (!lineNumbersC) return [];
    const lines = countLines(rawCode);
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [lineNumbersC, rawCode]);

  // rendered html
  const [renderedHtml, setRenderedHtml] = useState<string>(() =>
    renderToHtmlSync(rawCode, effectiveLanguage)
  );

  // recompute sync whenever raw/lang/highlighter changes
  useEffect(() => {
    setRenderedHtml(renderToHtmlSync(rawCode, effectiveLanguage));
  }, [rawCode, effectiveLanguage, renderToHtmlSync]);

  // maybe highlight async (lazy-load hljs) + prevent race
  useEffect(() => {
    if (!shouldUseHljs) return;
    if (!rawCode) return;

    const seq = ++highlightSeqRef.current;
    const textSnap = rawCode;
    const langSnap = effectiveLanguage;

    (async () => {
      const loaded = await loadHljsIfNeeded();
      if (!loaded) return;
      if (seq !== highlightSeqRef.current) return;

      setRenderedHtml(highlightWithHljs(textSnap, langSnap));
    })();
  }, [
    rawCode,
    effectiveLanguage,
    shouldUseHljs,
    loadHljsIfNeeded,
    highlightWithHljs,
  ]);

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    const text = rawCode ?? '';
    if (!text || loading) return;

    const done = () => {
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1200);
    };

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        done();
        return;
      }
    } catch {
      // fallback below
    }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch {
      // ignore
    }
  }, [rawCode, loading]);

  const needsProjectionHost = !fileTrimmed && !codePropString;

  return (
    <i-code-viewer {...rest}>
      {/* Hidden projection host for Angular-like "projected content" extraction */}
      {needsProjectionHost ? (
        <div ref={projectedRef} aria-hidden="true" style={{ display: 'none' }}>
          {children}
        </div>
      ) : null}

      <div
        className={[
          'i-code-viewer',
          compactC ? 'compact' : null,
          wrapC ? 'wrap' : null,
        ]
          .filter(Boolean)
          .join(' ')}>
        {loading ? <div className="i-code-viewer-loading">Loading…</div> : null}
        {error ? <div className="i-code-viewer-error">{error}</div> : null}

        <div
          className={[
            'i-code-viewer-scroll',
            showOverlay ? 'has-overlay' : null,
            scrollEffective ? 'scroll' : null,
            scrollEffective ? 'scroll-y' : null,
          ]
            .filter(Boolean)
            .join(' ')}
          style={heightPx !== null ? { height: `${heightPx}px` } : undefined}>
          {showOverlay ? (
            <div className="i-code-viewer-overlay hljs">
              {showFileTypeC ? (
                <span className="i-code-viewer-filetype">{fileTypeLabel}</span>
              ) : null}

              {copyC ? (
                <IButton
                  className="i-code-viewer-copy"
                  size="xs"
                  variant="outline"
                  disabled={loading}
                  onClick={onCopy}>
                  {copied ? 'Copied' : 'Copy'}
                </IButton>
              ) : null}
            </div>
          ) : null}

          {/* content row */}
          <div
            className={[
              'i-code-viewer-content',
              'hljs',
              scrollEffective ? 'scroll' : null,
              scrollEffective ? 'scroll-y' : null,
            ]
              .filter(Boolean)
              .join(' ')}>
            {lineNumbersC ? (
              <div aria-hidden="true" className="i-code-viewer-gutter">
                {lineNumberList.map((n) => (
                  <div key={n} className="i-code-viewer-line">
                    {n}
                  </div>
                ))}
              </div>
            ) : null}

            <pre className="i-code-viewer-pre">
              <code
                className="i-code-viewer-code hljs"
                data-language={effectiveLanguage}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </pre>
          </div>
        </div>
      </div>
    </i-code-viewer>
  );
}
