'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React8 = require('react');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var reactRouterDom = require('react-router-dom');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React8__default = /*#__PURE__*/_interopDefault(React8);

// src/components/icon/icon.constants.ts
var I_ICON_NAMES = {
  add: "fa-solid fa-plus",
  "angle-down": "fa-solid fa-angle-down",
  "angle-up": "fa-solid fa-angle-up",
  "arrow-down": "fa-solid fa-arrow-down",
  "arrow-up": "fa-solid fa-arrow-up",
  back: "fa-solid fa-chevron-left",
  bars: "fa-solid fa-bars",
  cancel: "fa-solid fa-xmark",
  calendar: "fa-solid fa-calendar-days",
  check: "fa-solid fa-check",
  "check-circle": "fa-solid fa-circle-check",
  code: "fa-solid fa-code",
  delete: "fa-solid fa-trash",
  edit: "fa-solid fa-pen",
  ellipsis: "fa-solid fa-ellipsis",
  exclamation: "fa-solid fa-circle-exclamation",
  "file-excel": "fa-solid fa-file-excel",
  "file-pdf": "fa-solid fa-file-pdf",
  "folder-open": "fa-solid fa-folder-open",
  hashtag: "fa-solid fa-hashtag",
  info: "fa-solid fa-circle-info",
  "layer-group": "fa-solid fa-layer-group",
  link: "fa-solid fa-arrow-up-right-from-square",
  maximize: "fa-solid fa-window-maximize",
  "map-marker": "fa-solid fa-location-dot",
  next: "fa-solid fa-chevron-right",
  prev: "fa-solid fa-chevron-left",
  up: "fa-solid fa-angle-up",
  down: "fa-solid fa-angle-down",
  save: "fa-solid fa-floppy-disk",
  signature: "fa-solid fa-file-signature",
  "sort-asc": "fa-solid fa-arrow-down-a-z",
  "sort-dsc": "fa-solid fa-arrow-down-z-a",
  sync: "fa-solid fa-arrows-rotate",
  tags: "fa-solid fa-tags",
  user: "fa-solid fa-user",
  users: "fa-solid fa-users",
  unlock: "fa-solid fa-unlock",
  upload: "fa-solid fa-cloud-arrow-up",
  view: "fa-solid fa-eye",
  x: "fa-solid fa-xmark",
  "x-circle": "fa-solid fa-circle-xmark"
};
var I_ICON_SIZES = {
  "2xs": "i-icon-2xs",
  xs: "i-icon-xs",
  sm: "i-icon-sm",
  md: "i-icon-md",
  lg: "i-icon-lg",
  xl: "i-icon-xl",
  "2xl": "i-icon-2xl",
  "3xl": "i-icon-3xl",
  "4xl": "i-icon-4xl"
};
function IIcon(props) {
  const { icon, size = "md", className, ...rest } = props;
  const iconSizeClass = I_ICON_SIZES[size] ?? I_ICON_SIZES.md;
  const baseClass = I_ICON_NAMES[icon] ?? String(icon);
  const innerClass = `${baseClass} ${iconSizeClass}`.trim();
  return /* @__PURE__ */ jsxRuntime.jsx("i-icon", { className, ...rest, children: /* @__PURE__ */ jsxRuntime.jsx("i", { className: innerClass }) });
}
function ILoading(props) {
  const { label = "Loading..", light = false, className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-loading",
    {
      className,
      light: light ? "true" : void 0,
      ...rest,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: [
              "spinner-border",
              "spinner-border-sm",
              light ? "light" : null
            ].filter(Boolean).join(" "),
            role: "status"
          }
        ),
        label ? ` ${label}` : null
      ]
    }
  );
}
function findClosestForm(startEl) {
  let el = startEl;
  while (el) {
    if (el instanceof HTMLFormElement) return el;
    el = el.parentElement;
  }
  return null;
}
function IButton(props) {
  const {
    disabled = false,
    loading = false,
    type = "button",
    loadingText = "",
    variant = "primary",
    size = "md",
    icon,
    onClick,
    children,
    className,
    ...rest
  } = props;
  const isBlocked = disabled || loading;
  const handleClick = (event) => {
    var _a, _b;
    if (isBlocked) {
      event.preventDefault();
      event.stopPropagation();
      (_b = (_a = event.nativeEvent) == null ? void 0 : _a.stopImmediatePropagation) == null ? void 0 : _b.call(_a);
      return;
    }
    onClick == null ? void 0 : onClick(event.nativeEvent);
    if (type === "submit" || type === "reset") {
      const form = findClosestForm(event.target);
      if (!form) return;
      if (type === "submit") {
        const requestSubmit = form.requestSubmit;
        if (typeof requestSubmit === "function") requestSubmit.call(form);
        else form.submit();
      } else {
        form.reset();
      }
    }
  };
  const handleKeyDown = (event) => {
    var _a;
    if (isBlocked) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const mouseEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        composed: true
      });
      (_a = event.target) == null ? void 0 : _a.dispatchEvent(mouseEvent);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "i-button",
    {
      ...rest,
      role: "button",
      className,
      variant,
      size,
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled ? "true" : void 0,
      "aria-busy": loading ? "true" : void 0,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      children: loading ? /* @__PURE__ */ jsxRuntime.jsx(ILoading, { label: loadingText, light: variant !== "outline" }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        icon ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon, size }) : null,
        children
      ] })
    }
  );
}
function normalizeHref(input) {
  if (input === null || input === void 0) return void 0;
  const s = String(input).trim();
  if (!s) return void 0;
  return s;
}
function routerLinkToHref(routerLink) {
  if (routerLink === void 0 || routerLink === null) return void 0;
  if (Array.isArray(routerLink)) {
    const parts = routerLink.flat().map((x) => String(x ?? "").trim()).filter(Boolean);
    if (parts.length === 0) return void 0;
    return "/" + parts.join("/").replace(/\/+/g, "/");
  }
  const s = String(routerLink).trim();
  if (!s) return void 0;
  return s.startsWith("/") ? s : `/${s}`;
}
function ICard(props) {
  const {
    href,
    routerLink,
    queryParams,
    // parity-only (unused)
    fragment,
    // parity-only (unused)
    replaceUrl = false,
    // parity-only (unused)
    skipLocationChange = false,
    // parity-only (unused)
    state,
    // parity-only (unused)
    target,
    rel,
    disabled = false,
    onClick,
    children,
    className,
    ...rest
  } = props;
  const normalizedHref = React8.useMemo(() => normalizeHref(href), [href]);
  const routerHref = React8.useMemo(() => routerLinkToHref(routerLink), [routerLink]);
  const effectiveHref = disabled ? void 0 : routerHref ?? normalizedHref;
  const hasHref = !!effectiveHref;
  const hasClick = typeof onClick === "function";
  React8.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const hasRouter = routerLink !== void 0 && routerLink !== null && routerLink !== "";
      const hasRawHref = !!normalizeHref(href);
      if (hasRawHref && hasRouter) {
        console.warn(
          "[i-card] Do not use `href` and `routerLink` together. Choose one."
        );
      }
      if (hasClick && (hasRawHref || hasRouter)) {
        console.warn(
          "[i-card] `onClick` should not be combined with `href` or `routerLink`."
        );
      }
      if (!hasRawHref && !hasRouter && !hasClick) {
        console.warn(
          "[i-card] No action provided. Add `href`, `routerLink`, or `onClick`."
        );
      }
    }
  }, [hasClick, href, routerLink]);
  const relAttr = rel ?? ((target ?? "").toLowerCase() === "_blank" ? "noopener noreferrer" : void 0);
  const handleClick = (ev) => {
    var _a, _b;
    if (disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      (_b = (_a = ev.nativeEvent) == null ? void 0 : _a.stopImmediatePropagation) == null ? void 0 : _b.call(_a);
      return;
    }
    if (hasClick) {
      ev.preventDefault();
      onClick == null ? void 0 : onClick(ev);
      return;
    }
    if (!hasHref) {
      ev.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx("i-card", { className, ...rest, children: /* @__PURE__ */ jsxRuntime.jsx(
    "a",
    {
      className: "i-card",
      "aria-disabled": disabled ? "true" : void 0,
      tabIndex: disabled ? -1 : void 0,
      href: effectiveHref,
      target: target ?? void 0,
      rel: relAttr ?? void 0,
      onClick: handleClick,
      children
    }
  ) });
}
function ICardImage(props) {
  const { src, alt, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-card-image", { children: /* @__PURE__ */ jsxRuntime.jsx("img", { alt: alt ?? "card-image", src, ...rest }) });
}
function ICardBody(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-card-body", { ...props });
}
function ICardFooter(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-card-footer", { ...props });
}
function coerceBool(v) {
  return v !== null && v !== void 0 && `${v}` !== "false";
}
function escapeHtml(s) {
  return (s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function getExtFromPath(path) {
  const clean = (path || "").split("?")[0].split("#")[0];
  const file = clean.split("/").pop() ?? "";
  const idx = file.lastIndexOf(".");
  return idx >= 0 ? file.slice(idx + 1).toLowerCase() : "";
}
function languageFromExt(ext) {
  switch ((ext || "").toLowerCase()) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "jsx":
      return "jsx";
    case "json":
      return "json";
    case "html":
    case "htm":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "yml":
    case "yaml":
      return "yaml";
    case "md":
      return "markdown";
    case "sql":
      return "sql";
    case "sh":
    case "bash":
      return "bash";
    case "txt":
      return "text";
    default:
      return "text";
  }
}
function parseHeight(v) {
  if (v === null || v === void 0) return null;
  const s = String(v).trim().toLowerCase();
  if (s === "" || s === "wrap" || s === "auto") return null;
  if (s.endsWith("px")) {
    const n2 = Number(s.slice(0, -2).trim());
    return Number.isFinite(n2) && n2 > 0 ? n2 : null;
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function isAbsoluteUrl(path) {
  return /^https?:\/\//i.test(path) || /^\/\//.test(path);
}
function resolveFileUrl(file) {
  const f = (file ?? "").trim();
  if (!f) return f;
  if (isAbsoluteUrl(f) || f.startsWith("/")) return f;
  const base = (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href));
  return new URL(f.replace(/^\.\//, ""), base).toString();
}
function normalizeHljsLanguage(lang) {
  if (lang === "html") return "xml";
  return lang;
}
function countLines(text) {
  if (text === null || text === void 0) return 1;
  const s = String(text);
  if (!s) return 1;
  return s.split("\n").length;
}
function ICodeViewer(props) {
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
    highlighter = "auto",
    onFileLoaded,
    children,
    ...rest
  } = props;
  const wrapC = coerceBool(wrap);
  const compactC = coerceBool(compact);
  const lineNumbersC = coerceBool(lineNumbers);
  const overlayC = overlay === void 0 ? true : coerceBool(overlay);
  const showFileTypeC = showFileType === void 0 ? true : coerceBool(showFileType);
  const copyC = copy === void 0 ? true : coerceBool(copy);
  const scrollC = coerceBool(scroll);
  const heightPx = parseHeight(height);
  const scrollEffective = scrollC || heightPx !== null;
  const showOverlay = overlayC && (showFileTypeC || copyC);
  const [loading, setLoading] = React8.useState(false);
  const [error, setError] = React8.useState("");
  const [copied, setCopied] = React8.useState(false);
  const requestSeqRef = React8.useRef(0);
  const highlightSeqRef = React8.useRef(0);
  const [fileLanguage, setFileLanguage] = React8.useState("text");
  const languageOverride = (language ?? "").trim() || null;
  const fileTrimmed = (file ?? "").trim();
  const codePropString = (code ?? "").toString();
  const effectiveLanguage = React8.useMemo(() => {
    if (languageOverride) return languageOverride;
    if (fileTrimmed) return fileLanguage;
    return "text";
  }, [languageOverride, fileLanguage, fileTrimmed]);
  const fileTypeLabel = React8.useMemo(() => {
    const l = (effectiveLanguage || "text").toUpperCase();
    return l === "TEXT" ? "CODE" : l;
  }, [effectiveLanguage]);
  const [rawCode, setRawCode] = React8.useState(() => codePropString);
  React8.useEffect(() => {
    setRawCode(codePropString);
  }, [codePropString]);
  const projectedRef = React8.useRef(null);
  React8.useLayoutEffect(() => {
    if (fileTrimmed) return;
    if (codePropString) return;
    if (rawCode) return;
    const host = projectedRef.current;
    if (!host) return;
    const text = (host.textContent ?? "").trim();
    if (!text) return;
    setRawCode(text);
  }, [children, fileTrimmed, codePropString, rawCode]);
  const hljsRef = React8.useRef(null);
  const hljsPromiseRef = React8.useRef(null);
  const shouldUseHljs = highlighter === "hljs" || highlighter === "auto";
  const loadHljsIfNeeded = React8.useCallback(async () => {
    var _a, _b;
    if (hljsRef.current) return hljsRef.current;
    const w = globalThis;
    if (((_a = w == null ? void 0 : w.hljs) == null ? void 0 : _a.highlight) && ((_b = w == null ? void 0 : w.hljs) == null ? void 0 : _b.highlightAuto)) {
      hljsRef.current = w.hljs;
      return hljsRef.current;
    }
    if (!hljsPromiseRef.current) {
      hljsPromiseRef.current = import('highlight.js').then((m) => m.default ?? m).catch(() => null);
    }
    const loaded = await hljsPromiseRef.current;
    if ((loaded == null ? void 0 : loaded.highlight) && (loaded == null ? void 0 : loaded.highlightAuto)) {
      hljsRef.current = loaded;
      return loaded;
    }
    return null;
  }, []);
  const highlightWithHljs = React8.useCallback(
    (text, lang) => {
      var _a;
      try {
        const hljs = hljsRef.current;
        if (!hljs) return escapeHtml(text);
        const normalized = normalizeHljsLanguage(lang);
        if (normalized && ((_a = hljs.getLanguage) == null ? void 0 : _a.call(hljs, normalized))) {
          return hljs.highlight(text, { language: normalized }).value;
        }
        return hljs.highlightAuto(text).value;
      } catch {
        return escapeHtml(text);
      }
    },
    []
  );
  const renderToHtmlSync = React8.useCallback(
    (text, lang) => {
      const raw = text ?? "";
      if (!raw) return "";
      if (highlighter === "none") return escapeHtml(raw);
      if (shouldUseHljs && hljsRef.current) {
        return highlightWithHljs(raw, lang);
      }
      return escapeHtml(raw);
    },
    [highlighter, shouldUseHljs, highlightWithHljs]
  );
  React8.useEffect(() => {
    const f = fileTrimmed;
    if (!f) return;
    const seq = ++requestSeqRef.current;
    setLoading(true);
    setError("");
    const langFromFile = languageFromExt(getExtFromPath(f));
    setFileLanguage(langFromFile);
    (async () => {
      try {
        const url = resolveFileUrl(f);
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error("http_error");
        const text = await res.text();
        if (seq !== requestSeqRef.current) return;
        setRawCode(text ?? "");
        setLoading(false);
        setError("");
        onFileLoaded == null ? void 0 : onFileLoaded({
          file: url,
          language: languageOverride ?? langFromFile
        });
      } catch {
        if (seq !== requestSeqRef.current) return;
        setLoading(false);
        setError(`Failed to load: ${f}`);
      }
    })();
  }, [fileTrimmed, onFileLoaded, languageOverride]);
  const lineNumberList = React8.useMemo(() => {
    if (!lineNumbersC) return [];
    const lines = countLines(rawCode);
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [lineNumbersC, rawCode]);
  const [renderedHtml, setRenderedHtml] = React8.useState(
    () => renderToHtmlSync(rawCode, effectiveLanguage)
  );
  React8.useEffect(() => {
    setRenderedHtml(renderToHtmlSync(rawCode, effectiveLanguage));
  }, [rawCode, effectiveLanguage, renderToHtmlSync]);
  React8.useEffect(() => {
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
    highlightWithHljs
  ]);
  const copyTimerRef = React8.useRef(null);
  React8.useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);
  const onCopy = React8.useCallback(async () => {
    var _a;
    const text = rawCode ?? "";
    if (!text || loading) return;
    const done = () => {
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1200);
    };
    try {
      if ((_a = navigator == null ? void 0 : navigator.clipboard) == null ? void 0 : _a.writeText) {
        await navigator.clipboard.writeText(text);
        done();
        return;
      }
    } catch {
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch {
    }
  }, [rawCode, loading]);
  const needsProjectionHost = !fileTrimmed && !codePropString;
  return /* @__PURE__ */ jsxRuntime.jsxs("i-code-viewer", { ...rest, children: [
    needsProjectionHost ? /* @__PURE__ */ jsxRuntime.jsx("div", { ref: projectedRef, "aria-hidden": "true", style: { display: "none" }, children }) : null,
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: [
          "i-code-viewer",
          compactC ? "compact" : null,
          wrapC ? "wrap" : null
        ].filter(Boolean).join(" "),
        children: [
          loading ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-code-viewer-loading", children: "Loading\u2026" }) : null,
          error ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-code-viewer-error", children: error }) : null,
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: [
                "i-code-viewer-scroll",
                showOverlay ? "has-overlay" : null,
                scrollEffective ? "scroll" : null,
                scrollEffective ? "scroll-y" : null
              ].filter(Boolean).join(" "),
              style: heightPx !== null ? { height: `${heightPx}px` } : void 0,
              children: [
                showOverlay ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "i-code-viewer-overlay hljs", children: [
                  showFileTypeC ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-code-viewer-filetype", children: fileTypeLabel }) : null,
                  copyC ? /* @__PURE__ */ jsxRuntime.jsx(
                    IButton,
                    {
                      className: "i-code-viewer-copy",
                      size: "xs",
                      variant: "outline",
                      disabled: loading,
                      onClick: onCopy,
                      children: copied ? "Copied" : "Copy"
                    }
                  ) : null
                ] }) : null,
                /* @__PURE__ */ jsxRuntime.jsxs(
                  "div",
                  {
                    className: [
                      "i-code-viewer-content",
                      "hljs",
                      scrollEffective ? "scroll" : null,
                      scrollEffective ? "scroll-y" : null
                    ].filter(Boolean).join(" "),
                    children: [
                      lineNumbersC ? /* @__PURE__ */ jsxRuntime.jsx("div", { "aria-hidden": "true", className: "i-code-viewer-gutter", children: lineNumberList.map((n) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-code-viewer-line", children: n }, n)) }) : null,
                      /* @__PURE__ */ jsxRuntime.jsx("pre", { className: "i-code-viewer-pre", children: /* @__PURE__ */ jsxRuntime.jsx(
                        "code",
                        {
                          className: "i-code-viewer-code hljs",
                          "data-language": effectiveLanguage,
                          dangerouslySetInnerHTML: { __html: renderedHtml }
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
function useInputMask(inputRef, mask, opts = {}) {
  const defaultAppliedRef = React8.useRef(false);
  const enableDefault = opts.enableDefault ?? true;
  React8.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (!mask) return;
    const type = mask.type;
    const emitNativeInput = () => {
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const setValue = (v) => {
      el.value = v;
      emitNativeInput();
    };
    const digitsOnly = (s) => s.replace(/[^\d]/g, "");
    if (enableDefault && !defaultAppliedRef.current) {
      if (type === "date") {
        if (!el.value) ;
        defaultAppliedRef.current = true;
      }
      if (type === "time") {
        if (!el.value) ;
        defaultAppliedRef.current = true;
      }
    }
    const onBeforeInput = (e) => {
    };
    const onInput = () => {
      const raw = el.value ?? "";
      if (type === "integer") {
        const v = digitsOnly(raw);
        if (v !== raw) setValue(v);
        return;
      }
      if (type === "number" || type === "currency") {
        const cleaned = raw.replace(/[^\d.]/g, "").replace(/^(\d*\.?\d*).*$/, "$1");
        if (cleaned !== raw) setValue(cleaned);
        return;
      }
      if (type === "date") {
        const cleaned = raw.replace(/[^\d/-]/g, "");
        if (cleaned !== raw) setValue(cleaned);
        return;
      }
      if (type === "time") {
        const cleaned = raw.replace(/[^\d:]/g, "");
        if (cleaned !== raw) setValue(cleaned);
        return;
      }
    };
    el.addEventListener("beforeinput", onBeforeInput);
    el.addEventListener("input", onInput);
    return () => {
      el.removeEventListener("beforeinput", onBeforeInput);
      el.removeEventListener("input", onInput);
    };
  }, [inputRef, mask, enableDefault]);
}
function IInputAddon(props) {
  const { addon, className, ...rest } = props;
  if (!addon || addon.visible === false) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("i-input-addon", { className, kind: addon.type, ...rest, children: addon.type === "button" ? /* @__PURE__ */ jsxRuntime.jsx(
    IButton,
    {
      size: "xs",
      type: "button",
      icon: addon.icon,
      variant: addon.variant ?? "primary",
      onClick: () => {
        var _a;
        return (_a = addon.onClick) == null ? void 0 : _a.call(addon);
      },
      children: addon.text ?? null
    }
  ) : addon.type === "icon" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: addon.icon, size: "sm" }) : addon.type === "link" ? /* @__PURE__ */ jsxRuntime.jsxs(
    "a",
    {
      href: addon.href,
      target: addon.target ?? void 0,
      rel: "noopener noreferrer",
      children: [
        addon.icon ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: addon.icon, size: "sm" }) : null,
        addon.text
      ]
    }
  ) : addon.type === "loading" ? /* @__PURE__ */ jsxRuntime.jsx(ILoading, {}) : /* @__PURE__ */ jsxRuntime.jsx("span", { children: addon.text }) });
}
function normalizeArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
var IInput = React8__default.default.forwardRef(
  function IInput2(props, forwardedRef) {
    const {
      type = "text",
      placeholder = "",
      autocomplete,
      readonly = false,
      invalid = false,
      disabled = false,
      mask,
      prepend,
      append,
      value,
      className,
      onInput,
      onBlur,
      inputRef,
      ...rest
    } = props;
    const innerRef = React8.useRef(null);
    useInputMask(innerRef, mask);
    const prepends = React8.useMemo(() => normalizeArray(prepend), [prepend]);
    const appends = React8.useMemo(() => normalizeArray(append), [append]);
    const setRefs = (node) => {
      innerRef.current = node;
      if (inputRef) {
        inputRef.current = node;
      }
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    };
    const handleHostClick = (e) => {
      var _a, _b;
      if (disabled) return;
      const target = e.target;
      if ((_a = target == null ? void 0 : target.closest) == null ? void 0 : _a.call(target, "i-input-addon")) return;
      (_b = innerRef.current) == null ? void 0 : _b.focus();
    };
    return /* @__PURE__ */ jsxRuntime.jsxs("i-input", { className, onClick: handleHostClick, children: [
      prepends.map((a, idx) => /* @__PURE__ */ jsxRuntime.jsx(IInputAddon, { addon: a }, `prepend-${idx}`)),
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          ...rest,
          ref: setRefs,
          "aria-invalid": invalid ? "true" : void 0,
          autoComplete: autocomplete ?? void 0,
          disabled,
          placeholder,
          readOnly: readonly,
          type,
          value: value ?? "",
          onInput,
          onBlur
        }
      ),
      appends.map((a, idx) => /* @__PURE__ */ jsxRuntime.jsx(IInputAddon, { addon: a }, `append-${idx}`))
    ] });
  }
);
function IFCInput(props) {
  const {
    label = "",
    placeholder = "",
    autocomplete,
    readonly = false,
    type = "text",
    mask,
    prepend,
    append,
    value,
    invalid = false,
    errorMessage = null,
    disabled = false,
    required = false,
    onInput,
    onBlur,
    children,
    className,
    ...hostProps
  } = props;
  const innerRef = React8.useRef(null);
  const focusInnerInput = () => {
    var _a;
    if (!disabled) {
      (_a = innerRef.current) == null ? void 0 : _a.focus();
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("i-fc-input", { className, ...hostProps, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "i-fc-input__label", onClick: focusInnerInput, children: [
      label,
      " :",
      " ",
      required ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-fc-input__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      IInput,
      {
        inputRef: innerRef,
        placeholder,
        autocomplete,
        readonly,
        type,
        mask,
        prepend,
        append,
        value: value ?? "",
        invalid,
        disabled,
        onInput,
        onBlur
      }
    ),
    invalid && errorMessage ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-fc-input__error", children: errorMessage }) : null,
    children
  ] });
}
function normalizePanelClass(pos) {
  const value = (pos || "bottom left").trim();
  const normalized = value.replace(/\s+/g, "-");
  return `i-options--${normalized}`;
}
function defaultFilterPredicate(row, term) {
  const haystack = JSON.stringify(row).toLowerCase();
  return haystack.includes(term);
}
function resolveByPath(obj, path) {
  const parts = path.split(".");
  let v = obj;
  for (const p of parts) {
    if (v === null || v === void 0) return null;
    v = v[p];
  }
  return v;
}
function highlightParts(text, term) {
  const t = (term ?? "").trim();
  if (!t) return text;
  const lower = text.toLowerCase();
  const q = t.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + t.length);
  const after = text.slice(idx + t.length);
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    before,
    /* @__PURE__ */ jsxRuntime.jsx("mark", { children: match }),
    after
  ] });
}
function ISelect(props) {
  const {
    placeholder = "",
    disabled = false,
    invalid = false,
    filterDelay = 200,
    panelPosition = "bottom left",
    options = null,
    options$ = null,
    displayWith,
    filterPredicate = defaultFilterPredicate,
    renderOption,
    value,
    defaultValue = null,
    onChanged,
    onOptionSelected,
    className,
    ...hostProps
  } = props;
  const hostRef = React8.useRef(null);
  const inputRef = React8.useRef(null);
  const [rawOptions, setRawOptions] = React8.useState(() => options ?? []);
  const [filteredOptions, setFilteredOptions] = React8.useState(
    () => options ?? []
  );
  const isControlled = value !== void 0;
  const [modelValue, setModelValue] = React8.useState(
    () => isControlled ? value ?? null : defaultValue ?? null
  );
  const [displayText, setDisplayText] = React8.useState("");
  const [filterText, setFilterText] = React8.useState("");
  const [isOpen, setIsOpen] = React8.useState(false);
  const [highlightIndex, setHighlightIndex] = React8.useState(-1);
  const [isLoading, setIsLoading] = React8.useState(false);
  const filterInput$ = React8.useMemo(() => new rxjs.Subject(), []);
  const filterSubRef = React8.useRef(null);
  const optionsSubRef = React8.useRef(null);
  const displayWithIsExplicit = displayWith !== void 0 && displayWith !== null;
  const resolveDisplayText = (row) => {
    if (row === null || row === void 0) return "";
    if (typeof displayWith === "function" && displayWithIsExplicit) {
      return displayWith(row);
    }
    if (typeof displayWith === "string") {
      const v = resolveByPath(row, displayWith);
      return v === null || v === void 0 ? "" : String(v);
    }
    if (!displayWithIsExplicit && typeof row === "object") {
      const entries = Object.entries(row);
      if (!entries.length) return "";
      const labelEntry = entries[1] ?? entries[0];
      const labelValue = labelEntry == null ? void 0 : labelEntry[1];
      return labelValue === null || labelValue === void 0 ? "" : String(labelValue);
    }
    return String(row);
  };
  React8.useEffect(() => {
    if (!isControlled) return;
    setModelValue(value ?? null);
  }, [isControlled, value]);
  React8.useEffect(() => {
    var _a;
    if (options$) {
      setIsLoading(true);
      (_a = optionsSubRef.current) == null ? void 0 : _a.unsubscribe();
      optionsSubRef.current = options$.subscribe({
        next: (rows) => {
          setRawOptions(rows ?? []);
          setIsLoading(false);
        },
        error: () => {
          setIsLoading(false);
        }
      });
      return () => {
        var _a2;
        (_a2 = optionsSubRef.current) == null ? void 0 : _a2.unsubscribe();
        optionsSubRef.current = null;
      };
    }
    setRawOptions(options ?? []);
    return void 0;
  }, [options$, options]);
  React8.useEffect(() => {
    var _a;
    (_a = filterSubRef.current) == null ? void 0 : _a.unsubscribe();
    filterSubRef.current = filterInput$.pipe(operators.debounceTime(filterDelay)).subscribe((val) => {
      handleInputText(val);
      setIsLoading(false);
    });
    return () => {
      var _a2;
      (_a2 = filterSubRef.current) == null ? void 0 : _a2.unsubscribe();
      filterSubRef.current = null;
    };
  }, [filterInput$, filterDelay]);
  React8.useEffect(() => {
    if (!isOpen) {
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText("");
      setHighlightIndex(-1);
    }
    if (isOpen) {
      applyFilter(true, filterText);
    } else {
      setFilteredOptions(rawOptions);
    }
  }, [modelValue, rawOptions]);
  const panelPositionClass2 = React8.useMemo(
    () => normalizePanelClass(panelPosition),
    [panelPosition]
  );
  const hasNoResults = isOpen && !!filterText && filteredOptions.length === 0;
  const hasOptionsList = isOpen && filteredOptions.length > 0;
  const applyFilter = (force, nextFilterText) => {
    const term = (nextFilterText ?? filterText ?? "").toLowerCase().trim();
    const next = !term ? [...rawOptions] : rawOptions.filter((row) => {
      try {
        return filterPredicate(row, term);
      } catch {
        return false;
      }
    });
    setFilteredOptions(next);
    setHighlightIndex((idx) => {
      if (next.length === 0) return -1;
      if (idx < 0) return -1;
      if (idx >= next.length) return -1;
      return idx;
    });
  };
  const scrollHighlightedIntoView = () => {
    setTimeout(() => {
      var _a;
      if (!isOpen) return;
      const host = hostRef.current;
      if (!host) return;
      const list = host.querySelector(".i-options");
      if (!list) return;
      const items = list.querySelectorAll(".i-option");
      const el = items[highlightIndex];
      (_a = el == null ? void 0 : el.scrollIntoView) == null ? void 0 : _a.call(el, { block: "nearest" });
    });
  };
  const openDropdown = () => {
    if (disabled) return;
    if (isOpen) return;
    setIsOpen(true);
    const term = filterText;
    const next = !term ? [...rawOptions] : rawOptions.filter(
      (row) => filterPredicate(row, term.toLowerCase().trim())
    );
    setFilteredOptions(next);
    if (next.length === 0) {
      setHighlightIndex(-1);
      return;
    }
    if (modelValue !== null && modelValue !== void 0) {
      const idx = next.indexOf(modelValue);
      if (idx >= 0) {
        setHighlightIndex(idx);
        scrollHighlightedIntoView();
        return;
      }
    }
    setHighlightIndex(0);
    scrollHighlightedIntoView();
  };
  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightIndex(-1);
  };
  const focus = () => {
    var _a, _b;
    if (disabled) return;
    (_b = (_a = inputRef.current) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
  };
  const handleInputText = (val) => {
    setDisplayText(val);
    setFilterText(val);
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => applyFilter(true, val), 0);
    } else {
      applyFilter(true, val);
    }
  };
  const onHostInput = (e) => {
    if (disabled) return;
    const v = e.currentTarget.value ?? "";
    setIsLoading(true);
    filterInput$.next(v);
  };
  const toggleDropdown = (event) => {
    if (disabled) return;
    if (!isOpen) {
      openDropdown();
    } else if (hasNoResults) {
      setDisplayText("");
      setFilterText("");
      applyFilter(true, "");
    } else {
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText("");
      closeDropdown();
    }
    focus();
  };
  const emitChange = (row) => {
    const label = resolveDisplayText(row);
    const payload = { value: row, label };
    onChanged == null ? void 0 : onChanged(payload);
    onOptionSelected == null ? void 0 : onOptionSelected(payload);
  };
  const selectRow = (row) => {
    if (disabled) return;
    if (!isControlled) {
      setModelValue(row);
    }
    setDisplayText(resolveDisplayText(row));
    setFilterText("");
    applyFilter(true, "");
    emitChange(row);
    closeDropdown();
  };
  const isRowSelected = (row) => modelValue === row;
  const setActiveIndex = (idx) => {
    if (idx < 0 || idx >= filteredOptions.length) {
      setHighlightIndex(-1);
    } else {
      setHighlightIndex(idx);
    }
  };
  const moveHighlight = (delta) => {
    const len = filteredOptions.length;
    if (!len) {
      setHighlightIndex(-1);
      return;
    }
    setHighlightIndex((prev) => {
      let next = prev;
      if (next === -1) next = 0;
      else next = (next + delta + len) % len;
      return next;
    });
    scrollHighlightedIntoView();
  };
  const onHostKeyDown = (event) => {
    if (disabled) return;
    const opts = filteredOptions;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) openDropdown();
        else if (opts.length) moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) openDropdown();
        else if (opts.length) moveHighlight(-1);
        break;
      case "Enter":
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (highlightIndex >= 0 && highlightIndex < opts.length) {
          selectRow(opts[highlightIndex]);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setDisplayText(resolveDisplayText(modelValue));
          setFilterText("");
          closeDropdown();
        }
        break;
    }
  };
  React8.useEffect(() => {
    const onDocClick = (e) => {
      if (!isOpen) return;
      const target = e.target;
      const host = hostRef.current;
      if (!host) return;
      if (target && !host.contains(target)) {
        setDisplayText(resolveDisplayText(modelValue));
        setFilterText("");
        closeDropdown();
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isOpen, modelValue, rawOptions]);
  const appendAddon = React8.useMemo(() => {
    if (isLoading) {
      return { type: "loading", visible: true };
    }
    return {
      type: "button",
      icon: isOpen ? "angle-up" : "angle-down",
      visible: true,
      variant: "primary",
      onClick: () => toggleDropdown()
    };
  }, [
    isLoading,
    isOpen,
    disabled,
    hasNoResults,
    modelValue,
    displayText,
    filterText
  ]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-select",
    {
      ...hostProps,
      className,
      ref: (el) => {
        hostRef.current = el;
      },
      onKeyDown: onHostKeyDown,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          IInput,
          {
            inputRef,
            append: appendAddon,
            invalid: invalid || hasNoResults,
            placeholder,
            readonly: disabled,
            value: displayText,
            onInput: onHostInput
          }
        ),
        hasOptionsList ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: `i-options scroll scroll-y ${panelPositionClass2}`, children: filteredOptions.map((row, idx) => /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: [
              "i-option",
              highlightIndex === idx ? "active" : null,
              isRowSelected(row) ? "selected" : null
            ].filter(Boolean).join(" "),
            onMouseEnter: () => setActiveIndex(idx),
            onMouseDown: (e) => {
              e.preventDefault();
              e.stopPropagation();
              selectRow(row);
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-option-label", children: renderOption ? renderOption(row) : /* @__PURE__ */ jsxRuntime.jsx("span", { children: highlightParts(resolveDisplayText(row), filterText) }) }),
              isRowSelected(row) ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-option-check", children: /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "check" }) }) : null
            ]
          },
          (row == null ? void 0 : row.id) ?? `${idx}-${String(row)}`
        )) }) : null
      ]
    }
  );
}
var MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" }
];
var WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function noop() {
}
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function parseInputDate(value, format) {
  if (!value) return null;
  const fmt = format || "yyyy-MM-dd";
  const parts = value.match(/\d+/g);
  if (!parts || parts.length < 3) return null;
  const tokens = fmt.match(/(yyyy|MM|dd)/g) || ["yyyy", "MM", "dd"];
  let year;
  let month;
  let day;
  tokens.forEach((t, idx) => {
    const p = parts[idx];
    if (!p) return;
    const n = Number(p);
    if (t === "yyyy") year = n;
    else if (t === "MM") month = n;
    else if (t === "dd") day = n;
  });
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return startOfDay(date);
}
function formatDateLocal(date, format) {
  const fmt = format || "yyyy-MM-dd";
  const yyyy = String(date.getFullYear());
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return fmt.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd);
}
function normalizeToDate(value, format) {
  if (value instanceof Date) return startOfDay(value);
  if (typeof value === "string" && value.trim()) {
    return parseInputDate(value.trim(), format);
  }
  return null;
}
function panelPositionClass(panelPosition) {
  const value = (panelPosition || "bottom left").trim();
  const normalized = value.replace(/\s+/g, "-");
  return `i-datepicker-panel--${normalized}`;
}
function ensureYearRange(focusYear, currentYears) {
  if (!currentYears.length || focusYear < currentYears[0] || focusYear > currentYears[currentYears.length - 1]) {
    const start = focusYear - 50;
    const end = focusYear + 10;
    const arr = [];
    for (let y = start; y <= end; y++) arr.push(y);
    return arr;
  }
  return currentYears;
}
function buildCalendar(viewYear, viewMonth, selected) {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startDay = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(viewYear, viewMonth, 1 - startDay);
  const weeks = [];
  const current = new Date(startDate);
  const today = startOfDay(/* @__PURE__ */ new Date());
  const selectedDay = selected ? startOfDay(selected) : null;
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      const inCurrentMonth = date.getMonth() === viewMonth;
      row.push({
        date,
        inCurrentMonth,
        isToday: isSameDate(date, today),
        isSelected: selectedDay ? isSameDate(date, selectedDay) : false
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}
function IDatepicker(props) {
  const {
    placeholder = "",
    disabled = false,
    invalid = false,
    format = "dd/MM/yyyy",
    panelPosition = "bottom left",
    value = null,
    onChanged = noop,
    className,
    ...rest
  } = props;
  const hostRef = React8.useRef(null);
  const inputRef = React8.useRef(null);
  const [modelValue, setModelValue] = React8.useState(null);
  const [displayText, setDisplayText] = React8.useState("");
  const [isOpen, setIsOpen] = React8.useState(false);
  const [viewYear, setViewYear] = React8.useState(0);
  const [viewMonth, setViewMonth] = React8.useState(0);
  const [years, setYears] = React8.useState([]);
  const weeks = React8.useMemo(
    () => buildCalendar(viewYear, viewMonth, modelValue),
    [viewYear, viewMonth, modelValue]
  );
  const monthSelected = React8.useMemo(
    () => MONTHS.find((m) => m.value === viewMonth) ?? null,
    [viewMonth]
  );
  const dateMask = React8.useMemo(
    () => ({ type: "date", format }),
    [format]
  );
  const refreshInputRef = React8.useCallback(() => {
    var _a;
    const host = hostRef.current;
    const input = (_a = host == null ? void 0 : host.querySelector) == null ? void 0 : _a.call(
      host,
      "i-input input"
    );
    if (input) inputRef.current = input;
  }, []);
  React8.useEffect(() => {
    const next = normalizeToDate(value, format);
    setModelValue(next);
    setDisplayText(next ? formatDateLocal(next, format) : "");
    const baseDate = next ?? parseInputDate(displayText, format) ?? startOfDay(/* @__PURE__ */ new Date());
    setViewYear(baseDate.getFullYear());
    setViewMonth(baseDate.getMonth());
    setYears((prev) => ensureYearRange(baseDate.getFullYear(), prev));
  }, [value, format]);
  React8.useEffect(() => {
    if (!modelValue && !displayText) {
      const today = startOfDay(/* @__PURE__ */ new Date());
      setModelValue(today);
      setDisplayText(formatDateLocal(today, format));
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
      setYears((p) => ensureYearRange(today.getFullYear(), p));
    }
  }, []);
  React8.useEffect(() => {
    refreshInputRef();
  }, [refreshInputRef, isOpen, displayText]);
  const initViewFromModel = React8.useCallback(() => {
    let base;
    if (modelValue) base = startOfDay(modelValue);
    else if (displayText)
      base = parseInputDate(displayText, format) ?? startOfDay(/* @__PURE__ */ new Date());
    else base = startOfDay(/* @__PURE__ */ new Date());
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYears((p) => ensureYearRange(base.getFullYear(), p));
  }, [displayText, format, modelValue]);
  const toggleOpen = React8.useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      var _a;
      const next = !prev;
      if (next) {
        refreshInputRef();
        const inputVal = ((_a = inputRef.current) == null ? void 0 : _a.value) ?? "";
        if (inputVal) {
          const parsed = parseInputDate(inputVal, format);
          if (parsed) {
            setModelValue(parsed);
            setDisplayText(formatDateLocal(parsed, format));
          }
        }
        initViewFromModel();
      }
      return next;
    });
  }, [disabled, format, initViewFromModel, refreshInputRef]);
  const appendAddon = React8.useMemo(
    () => ({
      type: "button",
      icon: "calendar",
      visible: true,
      variant: "primary",
      onClick: () => {
        var _a;
        toggleOpen();
        refreshInputRef();
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
    }),
    [refreshInputRef, toggleOpen]
  );
  const handleInput = React8.useCallback(
    (raw) => {
      setDisplayText(raw);
      const parsed = parseInputDate(raw, format);
      setModelValue(parsed);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
        setYears((p) => ensureYearRange(parsed.getFullYear(), p));
      }
      onChanged(parsed);
    },
    [format, onChanged]
  );
  React8.useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (event) => {
      const target = event.target;
      const host = hostRef.current;
      if (host && target && !host.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isOpen]);
  const prevMonth = React8.useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => {
          const ny = y - 1;
          setYears((p) => ensureYearRange(ny, p));
          return ny;
        });
        return 11;
      }
      return m - 1;
    });
  }, []);
  const nextMonth = React8.useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => {
          const ny = y + 1;
          setYears((p) => ensureYearRange(ny, p));
          return ny;
        });
        return 0;
      }
      return m + 1;
    });
  }, []);
  const onMonthChange = React8.useCallback((change) => {
    const row = change == null ? void 0 : change.value;
    if (!row) return;
    const month = typeof row === "object" && row && "value" in row ? row.value : row;
    if (typeof month !== "number") return;
    if (month < 0 || month > 11) return;
    setViewMonth(month);
  }, []);
  const onYearChange = React8.useCallback((change) => {
    const year = change.value;
    if (typeof year !== "number") return;
    setViewYear(year);
    setYears((p) => ensureYearRange(year, p));
  }, []);
  const selectDay = React8.useCallback(
    (day) => {
      if (disabled) return;
      const selected = startOfDay(day.date);
      setModelValue(selected);
      setDisplayText(formatDateLocal(selected, format));
      onChanged(selected);
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setYears((p) => ensureYearRange(selected.getFullYear(), p));
      setIsOpen(false);
    },
    [disabled, format, onChanged]
  );
  React8.useEffect(() => {
    setYears(
      (p) => ensureYearRange(viewYear || startOfDay(/* @__PURE__ */ new Date()).getFullYear(), p)
    );
  }, [viewYear]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-datepicker",
    {
      ref: (el) => {
        hostRef.current = el;
        refreshInputRef();
      },
      className,
      ...rest,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          IInput,
          {
            append: appendAddon,
            mask: dateMask,
            invalid,
            placeholder,
            readonly: disabled,
            value: displayText,
            onInput: (e) => handleInput(e.currentTarget.value ?? ""),
            onBlur: () => {
            }
          }
        ),
        isOpen ? /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: [
              "i-datepicker-panel",
              panelPositionClass(panelPosition)
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "i-datepicker-header", children: [
                /* @__PURE__ */ jsxRuntime.jsx(IButton, { icon: "prev", size: "xs", onClick: prevMonth }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  ISelect,
                  {
                    className: "i-date-picker-month-select",
                    options: MONTHS,
                    value: monthSelected,
                    onOptionSelected: onMonthChange
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  ISelect,
                  {
                    className: "i-date-picker-year-select",
                    options: years,
                    value: viewYear,
                    onOptionSelected: onYearChange
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(IButton, { icon: "next", size: "xs", onClick: nextMonth })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-datepicker-weekdays", children: WEEKDAYS.map((w) => /* @__PURE__ */ jsxRuntime.jsx("small", { children: w }, w)) }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-datepicker-weeks", children: weeks.map((week, wi) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-datepicker-week", children: week.map((d) => /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  className: [
                    "i-datepicker-day",
                    d.inCurrentMonth ? "current-month" : null,
                    d.isSelected ? "selected" : null,
                    d.isToday && !d.isSelected ? "today" : null
                  ].filter(Boolean).join(" "),
                  onClick: () => selectDay(d),
                  children: d.date.getDate()
                },
                d.date.getTime()
              )) }, `w-${wi}`)) })
            ]
          }
        ) : null
      ]
    }
  );
}
function resolveErrorMessage(label, errorKey, errorMessage) {
  const tpl = errorMessage == null ? void 0 : errorMessage[errorKey];
  if (!tpl) return null;
  return tpl.replaceAll("{label}", label);
}
function IFCDatepicker(props) {
  const {
    label = "",
    placeholder = "",
    format = "dd/MM/yyyy",
    panelPosition = "bottom left",
    value = null,
    onChanged = noop,
    disabled = false,
    required = false,
    invalid = false,
    errorMessage,
    errorKey = "required",
    className,
    ...rest
  } = props;
  const hostRef = React8.useRef(null);
  const resolvedErrorText = React8.useMemo(() => {
    if (!invalid) return null;
    return resolveErrorMessage(label || "This field", errorKey, errorMessage) ?? `${label || "This field"} is invalid`;
  }, [invalid, label, errorKey, errorMessage]);
  const focusInnerDatepicker = () => {
    var _a, _b;
    if (disabled) return;
    const input = (_b = (_a = hostRef.current) == null ? void 0 : _a.querySelector) == null ? void 0 : _b.call(
      _a,
      "i-datepicker i-input input"
    );
    input == null ? void 0 : input.focus();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-fc-datepicker",
    {
      ref: (el) => {
        hostRef.current = el;
      },
      className,
      ...rest,
      children: [
        label ? /* @__PURE__ */ jsxRuntime.jsxs(
          "label",
          {
            className: "i-fc-datepicker__label",
            onClick: focusInnerDatepicker,
            children: [
              label,
              " :",
              " ",
              required ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-fc-datepicker__required", children: "*" }) : null
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxRuntime.jsx(
          IDatepicker,
          {
            disabled,
            format,
            invalid,
            panelPosition,
            placeholder,
            value,
            onChanged
          }
        ),
        invalid && resolvedErrorText ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-fc-datepicker__error", children: resolvedErrorText }) : null
      ]
    }
  );
}
function resolveErrorMessage2(label, errorKey, errorMessage) {
  const tpl = errorMessage == null ? void 0 : errorMessage[errorKey];
  if (!tpl) return null;
  return tpl.replaceAll("{label}", label);
}
function ITextArea(props) {
  const {
    value = "",
    invalid = false,
    disabled = false,
    readonly = false,
    rows = 3,
    placeholder = "",
    onChange,
    ...rest
  } = props;
  const textareaRef = React8.useRef(null);
  const handleHostClick = React8.useCallback(() => {
    var _a;
    if (!disabled) {
      (_a = textareaRef.current) == null ? void 0 : _a.focus();
    }
  }, [disabled]);
  return /* @__PURE__ */ jsxRuntime.jsx("i-textarea", { onClick: handleHostClick, children: /* @__PURE__ */ jsxRuntime.jsx(
    "textarea",
    {
      ...rest,
      ref: textareaRef,
      "aria-invalid": invalid ? "true" : void 0,
      disabled,
      readOnly: readonly,
      rows,
      placeholder,
      value,
      onChange: (e) => onChange == null ? void 0 : onChange(e.currentTarget.value)
    }
  ) });
}
function IFCTextArea(props) {
  const {
    label = "",
    placeholder = "",
    readonly = false,
    rows = 3,
    errorMessage,
    value = "",
    onChange,
    disabled = false,
    invalid = false,
    required = false,
    errorKey = "required",
    ...hostProps
  } = props;
  const resolvedErrorText = React8.useMemo(() => {
    if (!invalid) return null;
    return resolveErrorMessage2(label || "This field", errorKey, errorMessage) ?? `${label || "This field"} is invalid`;
  }, [invalid, label, errorKey, errorMessage]);
  return /* @__PURE__ */ jsxRuntime.jsxs("i-fc-textarea", { ...hostProps, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "i-fc-textarea__label", children: [
      label,
      " :",
      " ",
      required ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-fc-textarea__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      ITextArea,
      {
        placeholder,
        readonly,
        rows,
        value,
        invalid,
        disabled,
        onChange: (v) => onChange == null ? void 0 : onChange(v)
      }
    ),
    invalid && resolvedErrorText ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-fc-textarea__error", children: resolvedErrorText }) : null
  ] });
}
var IDialogRef = class {
  _closed = false;
  _result = void 0;
  _listeners = /* @__PURE__ */ new Set();
  _resolve;
  _promise;
  constructor() {
    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }
  close(result) {
    if (this._closed) return;
    this._closed = true;
    this._result = result;
    for (const l of this._listeners) l(this._result);
    this._listeners.clear();
    this._resolve(this._result);
  }
  /** Promise style */
  afterClosed() {
    return this._promise;
  }
  /** Observable-like subscribe (no rxjs dependency) */
  subscribe(cb) {
    if (this._closed) {
      cb(this._result);
      return () => {
      };
    }
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }
};
var DIALOG_ID_COUNTER = 0;
var DialogContext = React8.createContext(null);
var DialogInstanceContext = React8.createContext(
  null
);
function useIDialog() {
  const ctx = React8.useContext(DialogContext);
  if (!ctx)
    throw new Error("useIDialog() must be used inside <IDialogProvider>.");
  return ctx;
}
function useDialogData() {
  const ctx = React8.useContext(DialogInstanceContext);
  return (ctx == null ? void 0 : ctx.data) ?? void 0;
}
function useDialogRef() {
  const ctx = React8.useContext(DialogInstanceContext);
  if (!(ctx == null ? void 0 : ctx.dialogRef)) {
    throw new Error("useDialogRef() must be used inside a dialog component.");
  }
  return ctx.dialogRef;
}
function useOptionalDialogRef() {
  const ctx = React8.useContext(DialogInstanceContext);
  return (ctx == null ? void 0 : ctx.dialogRef) ?? null;
}
function IDialogProvider(props) {
  const { children } = props;
  const [dialogs, setDialogs] = React8.useState([]);
  const open = React8.useCallback((component, config = {}) => {
    const id = config.id ?? `i-dialog-${++DIALOG_ID_COUNTER}`;
    const ref = new IDialogRef();
    const instance = {
      id,
      component,
      config: {
        width: config.width ?? "auto",
        height: config.height ?? "auto",
        disableClose: config.disableClose ?? false,
        backdropClose: config.backdropClose ?? true,
        data: config.data ?? void 0,
        id
      },
      ref
    };
    setDialogs((prev) => [...prev, instance]);
    ref.subscribe(() => {
      setDialogs((prev) => prev.filter((d) => d.id !== id));
    });
    return ref;
  }, []);
  const closeById = React8.useCallback(
    (id, result) => {
      const inst = dialogs.find((d) => d.id === id);
      inst == null ? void 0 : inst.ref.close(result);
    },
    [dialogs]
  );
  const closeAll = React8.useCallback(() => {
    dialogs.forEach((d) => d.ref.close(void 0));
  }, [dialogs]);
  const api = React8.useMemo(
    () => ({ dialogs, open, closeById, closeAll }),
    [dialogs, open, closeById, closeAll]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(DialogContext.Provider, { value: api, children });
}
function IDialogContainer(props) {
  const { instance, isTopMost } = props;
  const { width, height, disableClose, backdropClose } = instance.config;
  const onEsc = React8.useCallback(
    (e) => {
      if (!isTopMost) return;
      if (e.key !== "Escape") return;
      if (disableClose) return;
      instance.ref.close(void 0);
    },
    [isTopMost, disableClose, instance.ref]
  );
  React8.useEffect(() => {
    document.addEventListener("keydown", onEsc, true);
    return () => document.removeEventListener("keydown", onEsc, true);
  }, [onEsc]);
  const onBackdropClick = (e) => {
    if (!isTopMost) return;
    if (disableClose) return;
    if (!backdropClose) return;
    e.preventDefault();
    instance.ref.close(void 0);
  };
  const panelStyles = {
    width: width || void 0,
    height: height || void 0
  };
  const Comp = instance.component;
  return /* @__PURE__ */ jsxRuntime.jsxs("i-dialog-container", { "data-dialog-id": instance.id, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-backdrop", onClick: onBackdropClick }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-wrapper", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-panel", style: panelStyles, children: /* @__PURE__ */ jsxRuntime.jsx(
      DialogInstanceContext.Provider,
      {
        value: { data: instance.config.data, dialogRef: instance.ref },
        children: /* @__PURE__ */ jsxRuntime.jsx(Comp, {})
      }
    ) }) })
  ] });
}
function IDialogOutlet() {
  const { dialogs } = useIDialog();
  return /* @__PURE__ */ jsxRuntime.jsx("i-dialog-outlet", { children: dialogs.map((dialog, idx) => {
    const last = idx === dialogs.length - 1;
    return /* @__PURE__ */ jsxRuntime.jsx(
      IDialogContainer,
      {
        instance: dialog,
        isTopMost: last
      },
      dialog.id
    );
  }) });
}
function IDialogClose(props) {
  const { result, children, className } = props;
  const ref = useDialogRef();
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className,
      onClick: (e) => {
        e.preventDefault();
        ref.close(result);
      },
      children
    }
  );
}
function normalizeActions(actions) {
  return (actions ?? ["save", "cancel"]).map(
    (a) => typeof a === "string" ? { type: a } : a
  );
}
function IDialog(props) {
  const {
    title,
    actions = ["save", "cancel"],
    onOk,
    onConfirm,
    onSave,
    onCustomAction,
    children,
    ...rest
  } = props;
  const dialogRef = useOptionalDialogRef();
  const normalized = React8.useMemo(() => normalizeActions(actions), [actions]);
  const saveAction = normalized.find((a) => a.type === "save");
  const okAction = normalized.find((a) => a.type === "ok");
  const confirmAction = normalized.find((a) => a.type === "confirm");
  const cancelAction = normalized.find((a) => a.type === "cancel");
  const customActions = normalized.filter(
    (a) => a.type === "custom"
  );
  const hasActionsBlock = (actions ?? []).length > 0;
  const hasBuiltInActions = !!(okAction || confirmAction || saveAction || cancelAction);
  return /* @__PURE__ */ jsxRuntime.jsxs("i-dialog", { ...rest, children: [
    title ? /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "i-dialog-title", children: title }) : null,
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-content", children }),
    hasActionsBlock ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "i-dialog-actions", children: [
      customActions.length > 0 ? customActions.map((a, idx) => /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          icon: a.icon,
          className: a.className,
          variant: a.variant || "primary",
          onClick: () => {
            onCustomAction == null ? void 0 : onCustomAction(a);
          },
          children: a.label
        },
        idx
      )) : null,
      hasBuiltInActions && customActions.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-fill" }) : null,
      okAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          icon: "check",
          variant: "primary",
          className: okAction.className,
          onClick: () => onOk == null ? void 0 : onOk(),
          children: "OK"
        }
      ) : null,
      confirmAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          icon: "save",
          variant: "primary",
          className: confirmAction.className,
          onClick: () => onConfirm == null ? void 0 : onConfirm(),
          children: "Confirm"
        }
      ) : null,
      saveAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          icon: "save",
          variant: "primary",
          className: saveAction.className,
          onClick: () => onSave == null ? void 0 : onSave(),
          children: "Save"
        }
      ) : null,
      cancelAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          icon: "cancel",
          variant: "danger",
          className: cancelAction.className,
          onClick: (e) => {
            e.preventDefault();
            dialogRef == null ? void 0 : dialogRef.close(void 0);
          },
          children: "Cancel"
        }
      ) : null
    ] }) : null
  ] });
}
function IAlert() {
  const data = useDialogData();
  const dialog = useDialogRef();
  const alertClass = `i-alert i-alert-${data.type}`;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    IDialog,
    {
      className: alertClass,
      actions: [{ type: "ok", className: "w-full" }],
      onOk: () => dialog.close(true),
      children: [
        data.type === "information" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "info", size: "3xl" }) : null,
        data.type === "success" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "check-circle", size: "3xl" }) : null,
        data.type === "warning" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "exclamation", size: "3xl" }) : null,
        data.type === "danger" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "x-circle", size: "3xl" }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("h4", { children: data.title }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { dangerouslySetInnerHTML: { __html: data.description } })
      ]
    }
  );
}
function useIAlertService() {
  const dialog = useIDialog();
  const show = React8.useCallback(
    async (data) => {
      const ref = dialog.open(IAlert, {
        width: "",
        data,
        disableClose: true
      });
      const result = await ref.afterClosed();
      return !!result;
    },
    [dialog]
  );
  return React8.useMemo(
    () => ({
      show,
      information: (title, description) => show({ title, description, type: "information" }),
      success: (title, description) => show({ title, description, type: "success" }),
      warning: (title, description) => show({ title, description, type: "warning" }),
      danger: (title, description) => show({ title, description, type: "danger" })
    }),
    [show]
  );
}
function IConfirm() {
  const data = useDialogData();
  const dialog = useDialogRef();
  const [reason, setReason] = React8.useState("");
  const [invalid, setInvalid] = React8.useState(false);
  const confirmClass = `i-confirm i-confirm-${data.type}`;
  const submit = () => {
    if (data.reason) {
      const ok = !!reason.trim();
      setInvalid(!ok);
      if (!ok) return;
      dialog.close(reason);
      return;
    }
    dialog.close(true);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    IDialog,
    {
      className: confirmClass,
      actions: [
        { type: "confirm", className: "w-104" },
        { type: "cancel", className: "w-104" }
      ],
      onConfirm: submit,
      children: [
        data.type === "information" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "info", size: "3xl" }) : null,
        data.type === "success" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "check-circle", size: "3xl" }) : null,
        data.type === "warning" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "exclamation", size: "3xl" }) : null,
        data.type === "danger" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "x-circle", size: "3xl" }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("h4", { children: data.title }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { dangerouslySetInnerHTML: { __html: data.description } }),
        data.reason ? /* @__PURE__ */ jsxRuntime.jsxs(
          "form",
          {
            className: "mt-xs",
            onSubmit: (e) => {
              e.preventDefault();
              submit();
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                IFCTextArea,
                {
                  label: "Reason",
                  placeholder: "Fill your reason here..",
                  value: reason,
                  onChange: (v) => {
                    setReason(v);
                    if (invalid) setInvalid(false);
                  },
                  invalid,
                  errorMessage: { required: "Please fill in the reason.." },
                  errorKey: "required"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("button", { className: "hidden", type: "submit", children: "Submit" })
            ]
          }
        ) : null
      ]
    }
  );
}
function useIConfirmService() {
  const dialog = useIDialog();
  const show = React8.useCallback(
    async (data) => {
      const ref = dialog.open(IConfirm, {
        width: "",
        data
      });
      return ref.afterClosed();
    },
    [dialog]
  );
  return React8.useMemo(
    () => ({
      show,
      information: async (title, description) => {
        const r = await show({ title, description, type: "information" });
        return !!r;
      },
      success: async (title, description) => {
        const r = await show({ title, description, type: "success" });
        return !!r;
      },
      warning: (title, description, reason) => show({ title, description, type: "warning", reason }),
      danger: (title, description, reason) => show({ title, description, type: "danger", reason })
    }),
    [show]
  );
}
function IPaginator(props) {
  const { length, pageIndex, pageSize, pageSizeOptions, onPageChange } = props;
  const maxVisiblePages = 6;
  const pageCount = Math.max(1, Math.ceil(length / pageSize));
  const pageItems = React8.useMemo(() => {
    const total = pageCount;
    const current = pageIndex + 1;
    const last = total;
    const range = (from, to) => {
      const out = [];
      for (let i = from; i <= to; i++) out.push(i);
      return out;
    };
    const pageItem = (pageNumber1Based) => {
      const idx = pageNumber1Based - 1;
      return {
        type: "page",
        pageIndex: idx,
        label: String(pageNumber1Based),
        active: pageNumber1Based === current
      };
    };
    if (total <= maxVisiblePages) {
      return range(1, last).map(pageItem);
    }
    if (current <= 4) {
      return [
        ...range(1, 5).map(pageItem),
        { type: "ellipsis", key: "e-end" },
        pageItem(last)
      ];
    }
    if (current >= last - 3) {
      const start = last - 4;
      return [
        pageItem(1),
        { type: "ellipsis", key: "e-start" },
        ...range(start, last).map(pageItem)
      ];
    }
    const midStart = current - 2;
    const midEnd = current + 1;
    return [
      pageItem(1),
      { type: "ellipsis", key: "e-start" },
      ...range(midStart, midEnd).map(pageItem),
      { type: "ellipsis", key: "e-end" },
      pageItem(last)
    ];
  }, [pageCount, pageIndex]);
  const emit = (nextIndex, nextSize) => {
    const maxIndex = pageCount - 1;
    const clampedIndex = Math.max(0, Math.min(maxIndex, nextIndex));
    onPageChange({ pageIndex: clampedIndex, pageSize: nextSize });
  };
  const goToPage = (idx) => {
    if (idx === pageIndex) return;
    emit(idx, pageSize);
  };
  const changePageSize = (size) => {
    const newSize = Number(size);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    const oldSize = pageSize;
    const firstItemIndex = pageIndex * oldSize;
    const nextIndex = Math.floor(firstItemIndex / newSize);
    emit(nextIndex, newSize);
  };
  return /* @__PURE__ */ jsxRuntime.jsx("i-paginator", { className: "i-paginator", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "i-paginator flex align-center gap-md flex-fill", children: [
    pageSizeOptions.map((size) => /* @__PURE__ */ jsxRuntime.jsx(
      IButton,
      {
        size: "sm",
        disabled: pageSize === size,
        onClick: () => changePageSize(size),
        children: size
      },
      size
    )),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex-fill" }),
    /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
      "Page ",
      pageIndex + 1,
      " of ",
      pageCount,
      " (",
      length,
      " row",
      length > 1 ? "s" : "",
      ")"
    ] }),
    pageCount > 1 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-paginator-pages flex align-center gap-xs", children: pageItems.map((item) => {
      if (item.type === "ellipsis") {
        return /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "i-paginator-ellipsis",
            children: "..."
          },
          item.key
        );
      }
      return /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          size: "sm",
          disabled: item.active,
          onClick: () => goToPage(item.pageIndex),
          children: item.label
        },
        `p-${item.pageIndex}`
      );
    }) }) : null
  ] }) });
}

// src/components/shared/form.errors.ts
function isRecord(v) {
  return typeof v === "object" && v !== null;
}
function hasNumber(obj, key) {
  return typeof obj[key] === "number";
}
function asMinMaxLengthError(err) {
  if (!isRecord(err)) return null;
  if (!hasNumber(err, "requiredLength")) return null;
  if (!hasNumber(err, "actualLength")) return null;
  return { requiredLength: err.requiredLength, actualLength: err.actualLength };
}
function readNumber(err, key) {
  if (!isRecord(err)) return null;
  const v = err[key];
  return typeof v === "number" ? v : null;
}
var DEFAULT_ERROR_FACTORIES = {
  required: ({ label }) => `${label || "This field"} is required.`,
  requiredTrue: ({ label }) => `Please confirm ${label || "this field"}.`,
  minlength: ({ label, error }) => {
    const e = asMinMaxLengthError(error);
    if (!e) return `${label || "This field"} is too short.`;
    return `${label || "This field"} must be at least ${e.requiredLength} characters (currently ${e.actualLength}).`;
  },
  maxlength: ({ label, error }) => {
    const e = asMinMaxLengthError(error);
    if (!e) return `${label || "This field"} is too long.`;
    return `${label || "This field"} must be at most ${e.requiredLength} characters (currently ${e.actualLength}).`;
  },
  pattern: ({ label }) => `${label || "This field"} format is invalid.`,
  email: ({ label }) => `Please enter a valid ${label || "email"}.`,
  min: ({ label, error }) => {
    const min = readNumber(error, "min");
    return min === null ? `${label || "This field"} is too small.` : `${label || "This field"} must be \u2265 ${min}.`;
  },
  max: ({ label, error }) => {
    const max = readNumber(error, "max");
    return max === null ? `${label || "This field"} is too large.` : `${label || "This field"} must be \u2264 ${max}.`;
  }
};
function resolveControlErrorMessage({
  errors,
  label,
  errorMessage,
  extraFactories = {},
  control
}) {
  if (!errors) return null;
  const keys = Object.keys(errors);
  if (keys.length === 0) return null;
  const key = keys[0];
  const err = errors[key];
  const trimmedLabel = (label || "").trim();
  const ctx = {
    label: trimmedLabel,
    error: err,
    control
  };
  const customTpl = errorMessage == null ? void 0 : errorMessage[key];
  if (customTpl) {
    return interpolate(customTpl, ctx);
  }
  const factories = { ...DEFAULT_ERROR_FACTORIES, ...extraFactories };
  const factory = factories[key];
  if (factory) return factory(ctx);
  return `${trimmedLabel || "This field"} is invalid.`;
}
function isControlRequired(args) {
  const { errors, errorMessage } = args;
  const hasCustomRequired = !!(errorMessage == null ? void 0 : errorMessage.required);
  const hasRequiredError = !!(errors == null ? void 0 : errors.required);
  return hasCustomRequired || hasRequiredError;
}
function interpolate(tpl, ctx) {
  const err = isRecord(ctx.error) ? ctx.error : {};
  const map = {
    label: ctx.label || "This field",
    requiredLength: typeof err.requiredLength === "number" ? err.requiredLength : void 0,
    actualLength: typeof err.actualLength === "number" ? err.actualLength : void 0,
    min: typeof err.min === "number" ? err.min : void 0,
    max: typeof err.max === "number" ? err.max : void 0,
    ...err
  };
  return tpl.replace(/\{(\w+)\}/g, (_match, key) => {
    const v = map[key];
    return v === void 0 || v === null ? `{${key}}` : String(v);
  });
}
var IGridDataSource = class {
  _rawData = [];
  // filter internal
  _filter = "";
  _recursive = false;
  _childrenKey = "children";
  // sort internal
  _sort = null;
  // paginator internal
  _paginatorEnabled = true;
  _pageIndex = 0;
  _pageSize = 10;
  _pageSizeOptions = [10, 50, 100];
  // listeners
  _listeners = /* @__PURE__ */ new Set();
  constructor(initialData = [], config = {}) {
    this._rawData = initialData || [];
    if (config.filter !== null) {
      this.filter = config.filter;
    }
    this._sort = this._normalizeSort(config.sort ?? null);
    this._applyPaginatorConfig(config.paginator);
    this._emit();
  }
  /* ---------------- paginator config ---------------- */
  _applyPaginatorConfig(config) {
    if (config === false) {
      this._paginatorEnabled = false;
      return;
    }
    this._paginatorEnabled = true;
    if (config && typeof config === "object") {
      this._pageIndex = config.pageIndex ?? 0;
      this._pageSizeOptions = config.pageSizeOptions ?? this._pageSizeOptions;
      this._pageSize = config.pageSize ?? this._pageSizeOptions[0];
      return;
    }
    this._pageIndex = 0;
    this._pageSizeOptions = [10, 50, 100];
    this._pageSize = 10;
  }
  get paginatorEnabled() {
    return this._paginatorEnabled;
  }
  get pageIndex() {
    return this._pageIndex;
  }
  get pageSize() {
    return this._pageSize;
  }
  get pageSizeOptions() {
    return this._pageSizeOptions;
  }
  set paginator(state) {
    if (!this._paginatorEnabled || !state) return;
    this._pageIndex = state.pageIndex;
    this._pageSize = state.pageSize;
    this._emit();
  }
  get paginator() {
    if (!this._paginatorEnabled) return null;
    return { pageIndex: this._pageIndex, pageSize: this._pageSize };
  }
  /* ---------------- data ---------------- */
  get data() {
    return this._rawData;
  }
  set data(value) {
    this._rawData = value || [];
    this._emit();
  }
  get length() {
    return this._rawData.length;
  }
  /* ---------------- filter / sort ---------------- */
  /**
   * Smart filter:
   * - string: normal flat filtering
   * - { recursive: true, text, key? }: recursive tree filtering
   */
  set filter(value) {
    if (!value) {
      this._filter = "";
      this._recursive = false;
      this._childrenKey = "children";
      this._emit();
      return;
    }
    if (typeof value === "string") {
      this._filter = value.toLowerCase().trim();
      this._recursive = false;
      this._childrenKey = "children";
      this._emit();
      return;
    }
    this._filter = (value.text ?? "").toLowerCase().trim();
    this._recursive = value.recursive === true;
    this._childrenKey = (value.key || "children").trim() || "children";
    this._emit();
  }
  /**
   * Returns the current normalized filter text.
   * (Always plain string, lowercased & trimmed.)
   */
  get filter() {
    return this._filter;
  }
  get sort() {
    return this._sort;
  }
  set sort(value) {
    this._sort = this._normalizeSort(value);
    this._emit();
  }
  // can be customized by consumer
  filterPredicate = (data, filter) => {
    if (!filter) return true;
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
  sortAccessor = (data, columnId) => {
    if (!isRecord(data)) return "";
    const v = data[columnId];
    if (typeof v === "string" || typeof v === "number") return v;
    if (v === null || v === void 0) return "";
    if (v instanceof Date) return v.getTime();
    return String(v);
  };
  /* ---------------- connect ---------------- */
  connect(listener) {
    this._listeners.add(listener);
    listener(this._computeRendered());
    return () => {
      this._listeners.delete(listener);
    };
  }
  disconnect() {
    this._listeners.clear();
  }
  /* ---------------- internals ---------------- */
  /** Basic row match using public filterPredicate */
  _rowMatchesFilter(data, filter) {
    if (!filter) return true;
    return this.filterPredicate(data, filter);
  }
  _filterRecursiveArray(nodes, filter) {
    const result = [];
    for (const node of nodes) {
      const pruned = this._filterRecursiveNode(node, filter);
      if (pruned !== null) result.push(pruned);
    }
    return result;
  }
  _filterRecursiveNode(node, filter) {
    if (!isRecord(node)) {
      const selfMatches2 = this._rowMatchesFilter(node, filter);
      return selfMatches2 ? node : null;
    }
    const rawChildren = node[this._childrenKey];
    const children = Array.isArray(rawChildren) ? rawChildren : [];
    const filteredChildren = this._filterRecursiveArray(children, filter);
    const selfMatches = this._rowMatchesFilter(node, filter);
    if (!selfMatches && filteredChildren.length === 0) {
      return null;
    }
    const clone = { ...node };
    if (filteredChildren.length) {
      clone[this._childrenKey] = filteredChildren;
    } else {
      if (Object.prototype.hasOwnProperty.call(clone, this._childrenKey)) {
        delete clone[this._childrenKey];
      }
    }
    return clone;
  }
  _normalizeSort(sort) {
    if (!sort) return null;
    const arr = Array.isArray(sort) ? sort : [sort];
    const cleaned = arr.filter(
      (s) => !!s && typeof s.active === "string" && (s.direction === "asc" || s.direction === "desc")
    );
    return cleaned.length ? cleaned : null;
  }
  _computeRendered() {
    let data = [...this._rawData];
    if (this._filter) {
      const f = this._filter;
      if (this._recursive) {
        data = this._filterRecursiveArray(data, f);
      } else {
        data = data.filter((row) => this.filterPredicate(row, f));
      }
    }
    if (this._sort && this._sort.length > 0) {
      const sorts = [...this._sort];
      data.sort((a, b) => {
        for (const sort of sorts) {
          const { active, direction } = sort;
          if (!active || !direction) continue;
          const dir = direction === "asc" ? 1 : -1;
          const aValue = this.sortAccessor(a, active);
          const bValue = this.sortAccessor(b, active);
          if (aValue < bValue) return -1 * dir;
          if (aValue > bValue) return 1 * dir;
        }
        return 0;
      });
    }
    if (this._paginatorEnabled) {
      const start = this._pageIndex * this._pageSize;
      data = data.slice(start, start + this._pageSize);
    }
    return data;
  }
  _emit() {
    const rendered = this._computeRendered();
    this._listeners.forEach((l) => l(rendered));
  }
};
function IGridColumn(_props) {
  return null;
}
IGridColumn.$$kind = "IGridColumn";
function IGridCustomColumn(_props) {
  return null;
}
IGridCustomColumn.$$kind = "IGridCustomColumn";
function IGridColumnGroup(_props) {
  return null;
}
IGridColumnGroup.$$kind = "IGridColumnGroup";
function IGridExpandableRow(_props) {
  return null;
}
IGridExpandableRow.$$kind = "IGridExpandableRow";
function IndeterminateCheckbox(props) {
  const { checked, indeterminate, onChange, className, stopRowClick } = props;
  const ref = React8.useRef(null);
  React8.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      ref,
      className,
      type: "checkbox",
      checked,
      onChange: (e) => onChange(e.target.checked),
      onClick: (e) => {
        if (stopRowClick) e.stopPropagation();
      }
    }
  );
}
function renderCellDef(def, row, ctx) {
  if (!def) return null;
  return def.length >= 2 ? def(row, ctx) : def(row);
}
function IGrid(props) {
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
    highlightSearch
  } = props;
  const idRef = React8.useRef(Math.random().toString(36).slice(2));
  const selectionColumnWidth = 32;
  const numberColumnWidth = 60;
  const expandColumnWidth = 32;
  const defaultColumnWidth = 200;
  const [renderedData, setRenderedData] = React8.useState([]);
  const [currentFilterText, setCurrentFilterText] = React8.useState("");
  const [sortStates, setSortStates] = React8.useState([]);
  const columnWidthsRef = React8.useRef(/* @__PURE__ */ new Map());
  const [, setTick] = React8.useState(0);
  const [selectionSet, setSelectionSet] = React8.useState(/* @__PURE__ */ new Set());
  const [expandedSet, setExpandedSet] = React8.useState(/* @__PURE__ */ new Set());
  const treeMetaRef = React8.useRef(/* @__PURE__ */ new Map());
  const treeRootsRef = React8.useRef([]);
  const { headerItems, columns, expandableRowDef } = React8.useMemo(() => {
    var _a;
    const all = React8.Children.toArray(children).filter(Boolean);
    let expandable = null;
    const parseColumnEl = (el) => {
      var _a2;
      const kind = (_a2 = el.type) == null ? void 0 : _a2.$$kind;
      if (kind !== "IGridColumn" && kind !== "IGridCustomColumn") return null;
      const p = el.props;
      const isDataCol = kind === "IGridColumn";
      const col = {
        fieldName: isDataCol ? p.fieldName : void 0,
        title: p.title ?? "",
        // ✅ Angular-ish defaults:
        sortable: p.sortable ?? (isDataCol ? true : false),
        resizable: p.resizable ?? true,
        freeze: !!p.freeze,
        width: p.width,
        headerDef: p.headerDef,
        cellDef: p.cellDef,
        isAuto: false
      };
      return col;
    };
    const header = [];
    for (const node of all) {
      const kind = (_a = node.type) == null ? void 0 : _a.$$kind;
      if (kind === "IGridExpandableRow") {
        expandable = node.props;
        continue;
      }
      if (kind === "IGridColumnGroup") {
        const gp = node.props;
        const kids = React8.Children.toArray(gp.children).filter(
          Boolean
        );
        const gCols = [];
        for (const kid of kids) {
          const c2 = parseColumnEl(kid);
          if (c2) gCols.push(c2);
        }
        header.push({
          kind: "group",
          title: gp.title ?? "",
          columns: gCols
        });
        continue;
      }
      const c = parseColumnEl(node);
      if (c) header.push({ kind: "col", col: c });
    }
    const explicit = header.some(
      (h) => h.kind === "col" || h.kind === "group" && h.columns && h.columns.length > 0
    );
    if (!explicit) {
      return {
        headerItems: [],
        columns: [],
        expandableRowDef: expandable
      };
    }
    const flat = [];
    for (const item of header) {
      if (item.kind === "col") flat.push(item.col);
      else flat.push(...item.columns);
    }
    return { headerItems: header, columns: flat, expandableRowDef: expandable };
  }, [children]);
  const hasExpandableRow = !!(expandableRowDef == null ? void 0 : expandableRowDef.render);
  const treeEnabled = tree !== null && tree !== false;
  const treeChildrenKey = React8.useMemo(() => {
    if (!treeEnabled) return "children";
    if (tree === true) return "children";
    if (typeof tree === "string") {
      const t = tree.trim();
      if (!t || t === "true") return "children";
      return t;
    }
    return "children";
  }, [tree, treeEnabled]);
  const showNumberColumnEffective = !treeEnabled ? showNumberColumn : false;
  const rawRows = React8.useMemo(() => {
    if (dataSource instanceof IGridDataSource) return dataSource.data ?? [];
    if (Array.isArray(dataSource)) return dataSource;
    return [];
  }, [dataSource]);
  const autoColumns = React8.useMemo(() => {
    if (!rawRows.length) return [];
    const first = rawRows[0];
    if (first === null || typeof first !== "object") return [];
    const keys = Object.keys(first);
    return keys.map((key) => ({
      fieldName: key,
      title: key,
      sortable: true,
      resizable: true,
      width: "fill",
      freeze: false,
      headerDef: void 0,
      cellDef: void 0,
      isAuto: true
    }));
  }, [rawRows]);
  const effectiveHeaderItems = React8.useMemo(() => {
    if (headerItems.length) return headerItems;
    return autoColumns.map((c) => ({ kind: "col", col: c }));
  }, [headerItems, autoColumns]);
  const effectiveColumns = React8.useMemo(() => {
    if (columns.length) return columns;
    return autoColumns;
  }, [columns, autoColumns]);
  const getColumnWidth = (col) => {
    const override = columnWidthsRef.current.get(col);
    if (typeof override === "number") return override;
    if (typeof col.width === "number") return col.width;
    if (col.width === "fill") return null;
    return defaultColumnWidth;
  };
  const getColumnFlex = (col) => {
    const px = getColumnWidth(col);
    if (px !== null) return `0 0 ${px}px`;
    return "1 1 0";
  };
  const setColumnWidth = (col, width) => {
    columnWidthsRef.current.set(col, width);
    setTick((n) => n + 1);
  };
  React8.useEffect(() => {
    const map = columnWidthsRef.current;
    for (const col of effectiveColumns) {
      if (!map.has(col)) {
        const px = getColumnWidth(col);
        if (px !== null) map.set(col, px);
      }
    }
  }, [effectiveColumns]);
  const getFrozenEndIndex = () => {
    for (let i = effectiveColumns.length - 1; i >= 0; i--) {
      if (effectiveColumns[i].freeze) return i;
    }
    return -1;
  };
  const hasFrozenColumns = getFrozenEndIndex() >= 0;
  const isColumnFrozen = (col) => {
    const end = getFrozenEndIndex();
    if (end < 0) return false;
    const idx = effectiveColumns.indexOf(col);
    if (idx === -1) return false;
    return idx <= end;
  };
  const getSpecialColumnsLeftOffset = (opts) => {
    const includeNumber = (opts == null ? void 0 : opts.includeNumber) ?? true;
    const includeExpand = (opts == null ? void 0 : opts.includeExpand) ?? true;
    const includeSelection = (opts == null ? void 0 : opts.includeSelection) ?? true;
    let left = 0;
    if (!treeEnabled) {
      if (includeSelection && !!selectionMode) left += selectionColumnWidth;
      if (includeExpand && hasExpandableRow) left += expandColumnWidth;
    }
    if (includeNumber && showNumberColumnEffective) left += numberColumnWidth;
    return left;
  };
  const getStickyLeftForExpandColumn = () => getSpecialColumnsLeftOffset({
    includeSelection: false,
    includeExpand: false,
    includeNumber: false
  });
  const getStickyLeftForSelectionColumn = () => getSpecialColumnsLeftOffset({
    includeSelection: false,
    includeExpand: true,
    includeNumber: false
  });
  const getStickyLeftForNumberColumn = () => getSpecialColumnsLeftOffset({
    includeSelection: true,
    includeExpand: true,
    includeNumber: false
  });
  const getColumnStickyLeft = (col) => {
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
  const getFrozenColumnZ = (col) => {
    const end = getFrozenEndIndex();
    if (end < 0) return 2;
    const idx = effectiveColumns.indexOf(col);
    if (idx === -1) return 2;
    const base = 20;
    return base + (end - idx);
  };
  React8.useEffect(() => {
    var _a, _b;
    const updateFilterText = () => {
      setCurrentFilterText(
        dataSource instanceof IGridDataSource ? dataSource.filter : ""
      );
    };
    const buildTreeMeta = (roots) => {
      treeMetaRef.current.clear();
      treeRootsRef.current = [];
      const getChildren = (row) => {
        const r = row;
        const value = r == null ? void 0 : r[treeChildrenKey];
        return Array.isArray(value) ? value : [];
      };
      const getInitialExpandLevelInternal = () => {
        if (!treeEnabled) return null;
        if (treeInitialExpandLevel === null) return null;
        const n = Number(treeInitialExpandLevel);
        if (!Number.isFinite(n) || n <= 0) return null;
        return n - 1;
      };
      const shouldRowStartExpanded = (level, hasChildrenFlag) => {
        if (!hasChildrenFlag) return false;
        const max = getInitialExpandLevelInternal();
        if (max === null) return false;
        return level <= max;
      };
      const visit = (row, level, parent) => {
        const children2 = getChildren(row);
        const hasChildrenFlag = children2.length > 0;
        const expanded = shouldRowStartExpanded(level, hasChildrenFlag);
        if (parent === null) treeRootsRef.current.push(row);
        treeMetaRef.current.set(row, {
          level,
          parent,
          hasChildren: hasChildrenFlag,
          expanded
        });
        children2.forEach((c) => visit(c, level + 1, row));
      };
      (roots || []).forEach((r) => visit(r, 0, null));
    };
    const rebuildTreeRenderedWith = (getChildren) => {
      const out = [];
      const appendVisible = (row) => {
        out.push(row);
        const meta = treeMetaRef.current.get(row);
        if (!(meta == null ? void 0 : meta.expanded)) return;
        const children2 = getChildren(row);
        for (const child of children2) appendVisible(child);
      };
      for (const root of treeRootsRef.current) appendVisible(root);
      setRenderedData(out);
      updateFilterText();
    };
    const connectTree = (roots) => {
      const getChildren = (row) => {
        const r = row;
        const value = r == null ? void 0 : r[treeChildrenKey];
        return Array.isArray(value) ? value : [];
      };
      buildTreeMeta(roots);
      rebuildTreeRenderedWith(getChildren);
    };
    if (treeEnabled) {
      if (dataSource instanceof IGridDataSource) {
        setSortStates(
          ((_a = dataSource.sort) == null ? void 0 : _a.length) ? dataSource.sort.map((s) => ({ ...s })) : []
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
    if (dataSource instanceof IGridDataSource) {
      setSortStates(
        ((_b = dataSource.sort) == null ? void 0 : _b.length) ? dataSource.sort.map((s) => ({ ...s })) : []
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
  const getTreeChildren = (row) => {
    if (!treeEnabled || !row) return [];
    const r = row;
    const value = r == null ? void 0 : r[treeChildrenKey];
    return Array.isArray(value) ? value : [];
  };
  const getTreeDescendants = (row) => {
    const out = [];
    const visit = (r) => {
      const children2 = getTreeChildren(r);
      for (const child of children2) {
        out.push(child);
        visit(child);
      }
    };
    visit(row);
    return out;
  };
  const hasChildren = (row) => {
    var _a;
    if (!treeEnabled) return false;
    return ((_a = treeMetaRef.current.get(row)) == null ? void 0 : _a.hasChildren) ?? false;
  };
  const getRowChecked = (row) => {
    if (!treeEnabled) return selectionSet.has(row);
    const descendants = getTreeDescendants(row);
    if (!descendants.length) return selectionSet.has(row);
    const total = descendants.length;
    const selectedChildren = descendants.filter(
      (c) => selectionSet.has(c)
    ).length;
    const allChildrenSelected = total > 0 && selectedChildren === total;
    const anyChildrenSelected = selectedChildren > 0;
    if (allChildrenSelected && selectionSet.has(row)) return true;
    if (anyChildrenSelected && !allChildrenSelected) return false;
    return selectionSet.has(row);
  };
  const getRowIndeterminate = (row) => {
    if (!treeEnabled) return false;
    const descendants = getTreeDescendants(row);
    if (!descendants.length) return false;
    const total = descendants.length;
    const selectedChildren = descendants.filter(
      (c) => selectionSet.has(c)
    ).length;
    const allChildrenSelected = total > 0 && selectedChildren === total;
    const anyChildrenSelected = selectedChildren > 0;
    return anyChildrenSelected && !allChildrenSelected;
  };
  const allVisibleSelected = () => {
    if (!selectionMode || !renderedData.length) return false;
    return renderedData.every((r) => getRowChecked(r));
  };
  const someVisibleSelected = () => {
    if (!selectionMode || !renderedData.length) return false;
    const anySelected = renderedData.some(
      (r) => getRowChecked(r) || getRowIndeterminate(r)
    );
    return anySelected && !allVisibleSelected();
  };
  const emitSelectionChange = (lastChanged, next) => {
    if (!selectionMode) return;
    onSelectionChange == null ? void 0 : onSelectionChange({ selected: Array.from(next), lastChanged });
  };
  const syncSelectionUpwardsFrom = (row, next) => {
    var _a, _b, _c;
    if (!treeEnabled) return;
    let current = ((_a = treeMetaRef.current.get(row)) == null ? void 0 : _a.parent) ?? null;
    while (current) {
      const descendants = getTreeDescendants(current);
      if (!descendants.length) {
        current = ((_b = treeMetaRef.current.get(current)) == null ? void 0 : _b.parent) ?? null;
        continue;
      }
      const total = descendants.length;
      const selectedChildren = descendants.filter((c) => next.has(c)).length;
      if (selectedChildren === 0) next.delete(current);
      else if (selectedChildren === total) next.add(current);
      else next.delete(current);
      current = ((_c = treeMetaRef.current.get(current)) == null ? void 0 : _c.parent) ?? null;
    }
  };
  const setBranchSelection = (row, selected, next) => {
    if (!treeEnabled) {
      if (selected) next.add(row);
      else next.delete(row);
      return;
    }
    const all = [row, ...getTreeDescendants(row)];
    if (selected) all.forEach((r) => next.add(r));
    else all.forEach((r) => next.delete(r));
  };
  const onRowSelectionToggle = (row) => {
    if (!selectionMode) return;
    if (selectionMode === "single") {
      const next2 = /* @__PURE__ */ new Set();
      next2.add(row);
      setSelectionSet(next2);
      emitSelectionChange(row, next2);
      return;
    }
    if (treeEnabled) {
      const next2 = new Set(selectionSet);
      if (hasChildren(row)) {
        const currentlyChecked = getRowChecked(row);
        setBranchSelection(row, !currentlyChecked, next2);
      } else {
        if (next2.has(row)) next2.delete(row);
        else next2.add(row);
      }
      syncSelectionUpwardsFrom(row, next2);
      setSelectionSet(next2);
      emitSelectionChange(row, next2);
      return;
    }
    const next = new Set(selectionSet);
    if (next.has(row)) next.delete(row);
    else next.add(row);
    setSelectionSet(next);
    emitSelectionChange(row, next);
  };
  const onToggleAllVisible = () => {
    if (selectionMode !== "multiple") return;
    const shouldSelect = !allVisibleSelected();
    if (treeEnabled) {
      const next2 = new Set(selectionSet);
      const roots = [...treeRootsRef.current];
      roots.forEach((r) => {
        setBranchSelection(r, shouldSelect, next2);
        syncSelectionUpwardsFrom(r, next2);
      });
      setSelectionSet(next2);
      emitSelectionChange(null, next2);
      return;
    }
    const next = new Set(selectionSet);
    if (shouldSelect) renderedData.forEach((r) => next.add(r));
    else renderedData.forEach((r) => next.delete(r));
    setSelectionSet(next);
    emitSelectionChange(null, next);
  };
  const isTreeHostColumn = (col) => {
    var _a, _b;
    if (!treeEnabled) return false;
    const wanted = (treeColumn ?? "").trim();
    const host = wanted ? (_a = effectiveColumns.find((c) => !!c.fieldName && c.fieldName === wanted)) == null ? void 0 : _a.fieldName : (_b = effectiveColumns.find((c) => !!c.fieldName)) == null ? void 0 : _b.fieldName;
    if (!host) return false;
    return !!col.fieldName && col.fieldName === host;
  };
  const isExpandedTree = (row) => {
    var _a;
    if (!treeEnabled) return false;
    return ((_a = treeMetaRef.current.get(row)) == null ? void 0 : _a.expanded) ?? false;
  };
  const anyTreeExpanded = () => {
    if (!treeEnabled || !treeRootsRef.current.length) return false;
    return treeRootsRef.current.some((r) => {
      const meta = treeMetaRef.current.get(r);
      return !!(meta == null ? void 0 : meta.hasChildren) && !!(meta == null ? void 0 : meta.expanded);
    });
  };
  const allTreeExpanded = () => {
    if (!treeEnabled || !treeRootsRef.current.length) return false;
    for (const meta of treeMetaRef.current.values()) {
      if (meta.hasChildren && !meta.expanded) return false;
    }
    return true;
  };
  const rebuildTreeRendered = () => {
    const out = [];
    const appendVisible = (row) => {
      out.push(row);
      const meta = treeMetaRef.current.get(row);
      if (!(meta == null ? void 0 : meta.expanded)) return;
      const children2 = getTreeChildren(row);
      for (const child of children2) appendVisible(child);
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
  const onTreeToggle = (row, event) => {
    event == null ? void 0 : event.stopPropagation();
    if (!treeEnabled) return;
    const meta = treeMetaRef.current.get(row);
    if (!meta || !meta.hasChildren) return;
    meta.expanded = !meta.expanded;
    rebuildTreeRendered();
  };
  const getRowLevel = (row) => {
    var _a;
    if (!treeEnabled) return 0;
    return ((_a = treeMetaRef.current.get(row)) == null ? void 0 : _a.level) ?? 0;
  };
  const getTreeIndentPx = (row) => getRowLevel(row) * treeIndent;
  const isRowExpanded = (row) => expandedSet.has(row);
  const setExpanded = (row, expanded) => {
    if (!hasExpandableRow) return;
    setExpandedSet((prev) => {
      const expandSingle = !!(expandableRowDef == null ? void 0 : expandableRowDef.expandSingle);
      const was = prev.has(row);
      if (expanded === was) return prev;
      const next = new Set(prev);
      if (expanded) {
        if (expandSingle) {
          const toCollapse = Array.from(next).filter((r) => r !== row);
          toCollapse.forEach(
            (r) => onRowExpandChange == null ? void 0 : onRowExpandChange({ row: r, expanded: false })
          );
          next.clear();
        }
        next.add(row);
        onRowExpandChange == null ? void 0 : onRowExpandChange({ row, expanded: true });
      } else {
        next.delete(row);
        onRowExpandChange == null ? void 0 : onRowExpandChange({ row, expanded: false });
      }
      onExpandedRowsChange == null ? void 0 : onExpandedRowsChange(Array.from(next));
      return next;
    });
  };
  const allVisibleExpanded = () => {
    if (!hasExpandableRow || !renderedData.length) return false;
    return renderedData.every((r) => expandedSet.has(r));
  };
  const onToggleAllExpanded = () => {
    if (!hasExpandableRow) return;
    const shouldExpand = !allVisibleExpanded();
    if (shouldExpand) {
      const expandSingle = !!(expandableRowDef == null ? void 0 : expandableRowDef.expandSingle);
      if (expandSingle) {
        const first = renderedData[0];
        setExpandedSet((prev) => {
          const next = /* @__PURE__ */ new Set();
          Array.from(prev).forEach(
            (r) => onRowExpandChange == null ? void 0 : onRowExpandChange({ row: r, expanded: false })
          );
          if (first) {
            next.add(first);
            onRowExpandChange == null ? void 0 : onRowExpandChange({ row: first, expanded: true });
          }
          onExpandedRowsChange == null ? void 0 : onExpandedRowsChange(Array.from(next));
          return next;
        });
        return;
      }
      setExpandedSet((prev) => {
        const before = new Set(prev);
        const next = new Set(prev);
        for (const row of renderedData) next.add(row);
        for (const row of renderedData)
          if (!before.has(row)) onRowExpandChange == null ? void 0 : onRowExpandChange({ row, expanded: true });
        onExpandedRowsChange == null ? void 0 : onExpandedRowsChange(Array.from(next));
        return next;
      });
      return;
    }
    setExpandedSet((prev) => {
      const prevArr = Array.from(prev);
      prevArr.forEach((r) => onRowExpandChange == null ? void 0 : onRowExpandChange({ row: r, expanded: false }));
      onExpandedRowsChange == null ? void 0 : onExpandedRowsChange([]);
      return /* @__PURE__ */ new Set();
    });
  };
  const sortStatesRef = React8.useRef([]);
  React8.useEffect(() => {
    sortStatesRef.current = sortStates;
  }, [sortStates]);
  const computeNextSort = (prev, columnId) => {
    const next = prev.map((s) => ({ ...s }));
    const idx = next.findIndex((s) => s.active === columnId);
    if (idx === -1) {
      next.push({ active: columnId, direction: "asc" });
      return next;
    }
    const cur = next[idx];
    if (cur.direction === "asc") {
      cur.direction = "desc";
      return next;
    }
    if (cur.direction === "desc") {
      next.splice(idx, 1);
      return next;
    }
    cur.direction = "asc";
    return next;
  };
  const sortByColumn = (col) => {
    if (!(dataSource instanceof IGridDataSource)) return;
    const columnId = col.fieldName;
    if (!columnId) return;
    if (col.sortable === false) return;
    const next = computeNextSort(sortStatesRef.current, columnId);
    setSortStates(next);
    dataSource.sort = next.length ? next : null;
    if (dataSource.paginatorEnabled) {
      dataSource.paginator = { pageIndex: 0, pageSize: dataSource.pageSize };
    }
  };
  const getColumnDirection = (columnId) => {
    const found = sortStates.find((s) => s.active === columnId);
    return found ? found.direction : "";
  };
  const hasPagination = !treeEnabled && dataSource instanceof IGridDataSource && dataSource.paginatorEnabled;
  const totalLength = dataSource instanceof IGridDataSource ? dataSource.length : renderedData.length;
  const pageIndex = dataSource instanceof IGridDataSource ? dataSource.pageIndex : 0;
  const pageSize = dataSource instanceof IGridDataSource ? dataSource.pageSize : 0;
  const pageSizeOptions = dataSource instanceof IGridDataSource ? dataSource.pageSizeOptions : [];
  const onPageChange = (e) => {
    if (!(dataSource instanceof IGridDataSource)) return;
    dataSource.paginator = { pageIndex: e.pageIndex, pageSize: e.pageSize };
  };
  const getRowNumber = (visibleRowIndex) => {
    if (dataSource instanceof IGridDataSource && hasPagination) {
      return pageIndex * pageSize + visibleRowIndex + 1;
    }
    return visibleRowIndex + 1;
  };
  const HeaderCell = (p) => {
    const {
      col,
      fixedWidth,
      children: children2,
      className,
      resizable,
      disableSortClick,
      auto,
      sticky
    } = p;
    const minWidth = 50;
    const isResizingRef = React8.useRef(false);
    const computedFrozen = !!col && isColumnFrozen(col);
    const computedLeft = computedFrozen && col ? getColumnStickyLeft(col) : null;
    const computedZ = computedFrozen && col ? getFrozenColumnZ(col) : null;
    const frozen = (sticky == null ? void 0 : sticky.frozen) ?? computedFrozen;
    const stickyLeft = (sticky == null ? void 0 : sticky.stickyLeft) ?? computedLeft;
    const zIndex = (sticky == null ? void 0 : sticky.zIndex) ?? computedZ;
    const isSortable = !disableSortClick && !!(col == null ? void 0 : col.fieldName) && col.sortable !== false && dataSource instanceof IGridDataSource;
    const direction = (col == null ? void 0 : col.fieldName) ? getColumnDirection(col.fieldName) : "";
    const showIcon = isSortable && direction !== "";
    const flex = typeof fixedWidth === "number" ? `0 0 ${fixedWidth}px` : col ? getColumnFlex(col) : "1 1 0";
    const onResizeMouseDown = (event) => {
      if (!col || !resizable) return;
      event.stopPropagation();
      event.preventDefault();
      const startX = event.clientX;
      const headerEl = event.currentTarget.closest(
        "i-grid-header-cell"
      );
      const currentWidth = getColumnWidth(col) ?? (headerEl == null ? void 0 : headerEl.clientWidth) ?? defaultColumnWidth;
      const startWidth = currentWidth;
      const onMove = (e) => {
        const delta = e.clientX - startX;
        let next = startWidth + delta;
        if (next < minWidth) next = minWidth;
        setColumnWidth(col, next);
      };
      isResizingRef.current = true;
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setTimeout(() => {
          isResizingRef.current = false;
        }, 0);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "i-grid-header-cell",
      {
        className: [
          "i-grid-header-cell",
          className,
          isSortable ? "i-grid-header-cell--sortable" : null,
          direction !== "" ? "i-grid-header-cell--sorted" : null,
          direction === "asc" ? "i-grid-header-cell--sorted-asc" : null,
          direction === "desc" ? "i-grid-header-cell--sorted-desc" : null,
          resizable ? "i-grid-header-cell--resizable" : null,
          frozen ? "i-grid-header-cell--frozen" : null,
          auto ? "i-grid-header-cell--auto" : null
        ].filter(Boolean).join(" "),
        role: "columnheader",
        style: {
          flex,
          position: frozen ? "sticky" : void 0,
          left: frozen ? stickyLeft ?? void 0 : void 0,
          zIndex: frozen && typeof zIndex === "number" ? zIndex : void 0
          // ✅ only if explicitly passed
        },
        onClick: () => {
          if (isResizingRef.current) return;
          if (!col) return;
          if (!isSortable) return;
          sortByColumn(col);
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__content", children: children2 }),
          showIcon ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__icon", children: /* @__PURE__ */ jsxRuntime.jsx(
            IIcon,
            {
              size: "sm",
              icon: direction === "asc" ? "sort-asc" : "sort-dsc"
            }
          ) }) : null,
          /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "i-grid-header-cell__resize-handle",
              onMouseDown: (e) => {
                e.stopPropagation();
                e.preventDefault();
                onResizeMouseDown(e);
              },
              onClick: (e) => {
                e.stopPropagation();
                e.preventDefault();
              }
            }
          )
        ]
      }
    );
  };
  const Cell = (p) => {
    const { col, fixedWidth, children: children2, className, onClickStop, auto, sticky } = p;
    const computedFrozen = !!col && isColumnFrozen(col);
    const computedLeft = computedFrozen && col ? getColumnStickyLeft(col) : null;
    const computedZ = computedFrozen && col ? getFrozenColumnZ(col) : null;
    const frozen = (sticky == null ? void 0 : sticky.frozen) ?? computedFrozen;
    const stickyLeft = (sticky == null ? void 0 : sticky.stickyLeft) ?? computedLeft;
    const zIndex = (sticky == null ? void 0 : sticky.zIndex) ?? computedZ;
    const flex = typeof fixedWidth === "number" ? `0 0 ${fixedWidth}px` : col ? getColumnFlex(col) : "1 1 0";
    return /* @__PURE__ */ jsxRuntime.jsx(
      "i-grid-cell",
      {
        className: [
          "i-grid-cell",
          className,
          frozen ? "i-grid-cell--frozen" : null,
          auto ? "i-grid-cell--auto" : null
        ].filter(Boolean).join(" "),
        role: "cell",
        style: {
          flex,
          position: frozen ? "sticky" : void 0,
          left: frozen ? stickyLeft ?? void 0 : void 0,
          zIndex: frozen && typeof zIndex === "number" ? zIndex : void 0
          // ✅ only if explicitly passed
        },
        onClick: (e) => {
          if (onClickStop) e.stopPropagation();
        },
        children: children2
      }
    );
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("i-grid", { className: "i-grid", role: "table", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("i-grid-viewport", { className: "i-grid-viewport", children: [
      effectiveHeaderItems.length ? /* @__PURE__ */ jsxRuntime.jsxs("i-grid-header-row", { className: "i-grid-header-row", role: "row", children: [
        !treeEnabled && hasExpandableRow && !(expandableRowDef == null ? void 0 : expandableRowDef.expandSingle) ? /* @__PURE__ */ jsxRuntime.jsx(
          HeaderCell,
          {
            className: "i-grid-expand-cell i-grid-expand-cell--header i-grid-header-cell--frozen",
            fixedWidth: expandColumnWidth,
            disableSortClick: true,
            sticky: {
              frozen: true,
              stickyLeft: getStickyLeftForExpandColumn()
            },
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__content", children: /* @__PURE__ */ jsxRuntime.jsx(
              IButton,
              {
                className: "i-grid-expand-toggle",
                size: "2xs",
                variant: "outline",
                icon: allVisibleExpanded() ? "down" : "next",
                onClick: (e) => {
                  e.stopPropagation();
                  onToggleAllExpanded();
                }
              }
            ) })
          }
        ) : null,
        !treeEnabled && selectionMode ? /* @__PURE__ */ jsxRuntime.jsx(
          HeaderCell,
          {
            className: "i-grid-selection-cell i-grid-selection-cell--header i-grid-header-cell--frozen",
            fixedWidth: selectionColumnWidth,
            disableSortClick: true,
            sticky: {
              frozen: true,
              stickyLeft: getStickyLeftForSelectionColumn()
            },
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__content", children: selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
              IndeterminateCheckbox,
              {
                checked: allVisibleSelected(),
                indeterminate: someVisibleSelected(),
                onChange: () => onToggleAllVisible(),
                stopRowClick: true
              }
            ) : null })
          }
        ) : null,
        showNumberColumnEffective ? /* @__PURE__ */ jsxRuntime.jsx(
          HeaderCell,
          {
            className: "i-grid-number-cell i-grid-number-cell--header",
            fixedWidth: numberColumnWidth,
            disableSortClick: true,
            sticky: hasFrozenColumns ? {
              frozen: true,
              stickyLeft: getStickyLeftForNumberColumn(),
              // Angular template: number header z=3 when frozen
              zIndex: 3
            } : void 0,
            children: "No."
          }
        ) : null,
        effectiveHeaderItems.map((item, idx) => {
          if (item.kind === "col") {
            const col = item.col;
            if (treeEnabled && isTreeHostColumn(col)) {
              return /* @__PURE__ */ jsxRuntime.jsx(
                HeaderCell,
                {
                  col,
                  resizable: col.resizable,
                  auto: !!col.isAuto,
                  children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "i-grid-tree-head", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      IButton,
                      {
                        className: "i-grid-tree-expand-all",
                        size: "2xs",
                        variant: "outline",
                        icon: anyTreeExpanded() ? "down" : "next",
                        onClick: (e) => {
                          e.stopPropagation();
                          onToggleAllTree();
                        }
                      }
                    ),
                    selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
                      IndeterminateCheckbox,
                      {
                        className: "i-grid-tree-header-checkbox",
                        checked: allVisibleSelected(),
                        indeterminate: someVisibleSelected(),
                        onChange: () => onToggleAllVisible(),
                        stopRowClick: true
                      }
                    ) : null,
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-tree-head__title", children: col.title || col.fieldName })
                  ] })
                },
                `h-${idx}`
              );
            }
            if (col.headerDef) {
              return /* @__PURE__ */ jsxRuntime.jsx(React8__default.default.Fragment, { children: col.headerDef(col) }, `h-${idx}`);
            }
            return /* @__PURE__ */ jsxRuntime.jsx(
              HeaderCell,
              {
                col,
                resizable: col.resizable,
                auto: !!col.isAuto,
                children: col.title || col.fieldName
              },
              `h-${idx}`
            );
          }
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "i-grid-header-cell-group",
            {
              className: "i-grid-header-cell-group",
              role: "presentation",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(HeaderCell, { disableSortClick: true, children: item.title }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "i-grid-header-cell-group-columns",
                  {
                    className: "i-grid-header-cell-group-columns",
                    role: "presentation",
                    children: item.columns.map((col, cIdx) => {
                      if (col.headerDef) {
                        return /* @__PURE__ */ jsxRuntime.jsx(React8__default.default.Fragment, { children: col.headerDef(col) }, `gc-${cIdx}`);
                      }
                      return /* @__PURE__ */ jsxRuntime.jsx(
                        HeaderCell,
                        {
                          col,
                          resizable: col.resizable,
                          auto: !!col.isAuto,
                          children: col.title || col.fieldName
                        },
                        `gc-${cIdx}`
                      );
                    })
                  }
                )
              ]
            },
            `g-${idx}`
          );
        })
      ] }) : null,
      renderedData.map((row, rowIndex) => {
        const key = props.rowKey ? props.rowKey(row, rowIndex) : rowIndex;
        return /* @__PURE__ */ jsxRuntime.jsxs(React8__default.default.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            "i-grid-row",
            {
              className: [
                "i-grid-row",
                selectionMode ? "i-grid-selection-row" : null
              ].filter(Boolean).join(" "),
              role: "row",
              onClick: () => onRowClick == null ? void 0 : onRowClick(row),
              children: [
                !treeEnabled && hasExpandableRow ? /* @__PURE__ */ jsxRuntime.jsx(
                  Cell,
                  {
                    className: "i-grid-expand-cell i-grid-expand-cell--body",
                    fixedWidth: expandColumnWidth,
                    onClickStop: true,
                    sticky: {
                      frozen: true,
                      stickyLeft: getStickyLeftForExpandColumn()
                    },
                    children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-expand-cell__content", children: /* @__PURE__ */ jsxRuntime.jsx(
                      IButton,
                      {
                        className: "i-grid-expand-toggle",
                        size: "2xs",
                        variant: "outline",
                        icon: isRowExpanded(row) ? "down" : "next",
                        onClick: (e) => {
                          e.stopPropagation();
                          setExpanded(row, !isRowExpanded(row));
                        }
                      }
                    ) })
                  }
                ) : null,
                !treeEnabled && selectionMode ? /* @__PURE__ */ jsxRuntime.jsx(
                  Cell,
                  {
                    className: "i-grid-selection-cell i-grid-selection-cell--body",
                    fixedWidth: selectionColumnWidth,
                    onClickStop: true,
                    sticky: {
                      frozen: true,
                      stickyLeft: getStickyLeftForSelectionColumn()
                    },
                    children: selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
                      IndeterminateCheckbox,
                      {
                        checked: getRowChecked(row),
                        indeterminate: getRowIndeterminate(row),
                        onChange: () => onRowSelectionToggle(row),
                        stopRowClick: true
                      }
                    ) : /* @__PURE__ */ jsxRuntime.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: selectionSet.has(row),
                        name: `i-grid-radio-${idRef.current}`,
                        onChange: () => onRowSelectionToggle(row),
                        onClick: (e) => e.stopPropagation()
                      }
                    )
                  }
                ) : null,
                showNumberColumnEffective ? /* @__PURE__ */ jsxRuntime.jsx(
                  Cell,
                  {
                    className: "i-grid-number-cell i-grid-number-cell--body",
                    fixedWidth: numberColumnWidth,
                    onClickStop: true,
                    sticky: hasFrozenColumns ? {
                      frozen: true,
                      stickyLeft: getStickyLeftForNumberColumn(),
                      zIndex: 2
                    } : void 0,
                    children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-cell__content", children: getRowNumber(rowIndex) })
                  }
                ) : null,
                effectiveColumns.map((col, colIndex) => {
                  if (treeEnabled && isTreeHostColumn(col)) {
                    return /* @__PURE__ */ jsxRuntime.jsx(
                      Cell,
                      {
                        col,
                        onClickStop: true,
                        auto: !!col.isAuto,
                        children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "i-grid-tree-inline", children: [
                          /* @__PURE__ */ jsxRuntime.jsx(
                            "span",
                            {
                              className: "i-grid-tree-indent",
                              style: { width: getTreeIndentPx(row) }
                            }
                          ),
                          hasChildren(row) ? /* @__PURE__ */ jsxRuntime.jsx(
                            IButton,
                            {
                              className: "i-grid-tree-toggle",
                              size: "2xs",
                              variant: "outline",
                              icon: isExpandedTree(row) ? "down" : "next",
                              onClick: (e) => {
                                e.stopPropagation();
                                onTreeToggle(row, e);
                              }
                            }
                          ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-tree-spacer" }),
                          selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
                            IndeterminateCheckbox,
                            {
                              className: "i-grid-tree-checkbox",
                              checked: getRowChecked(row),
                              indeterminate: getRowIndeterminate(row),
                              onChange: () => onRowSelectionToggle(row),
                              stopRowClick: true
                            }
                          ) : selectionMode === "single" ? /* @__PURE__ */ jsxRuntime.jsx(
                            "input",
                            {
                              className: "i-grid-tree-radio",
                              type: "radio",
                              checked: selectionSet.has(row),
                              name: `i-grid-radio-${idRef.current}`,
                              onChange: () => onRowSelectionToggle(row),
                              onClick: (e) => e.stopPropagation()
                            }
                          ) : null,
                          col.cellDef ? renderCellDef(col.cellDef, row, {
                            row,
                            index: rowIndex,
                            column: col
                          }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-tree-text", children: col.fieldName ? highlightSearch ? highlightSearch(
                            String(
                              (row == null ? void 0 : row[col.fieldName]) ?? ""
                            ),
                            currentFilterText
                          ) : String(
                            (row == null ? void 0 : row[col.fieldName]) ?? ""
                          ) : "" })
                        ] })
                      },
                      `c-${rowIndex}-${colIndex}`
                    );
                  }
                  return /* @__PURE__ */ jsxRuntime.jsx(
                    Cell,
                    {
                      col,
                      auto: !!col.isAuto,
                      children: col.cellDef ? renderCellDef(col.cellDef, row, {
                        row,
                        index: rowIndex,
                        column: col
                      }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-cell__content", children: col.fieldName ? highlightSearch ? highlightSearch(
                        String(
                          (row == null ? void 0 : row[col.fieldName]) ?? ""
                        ),
                        currentFilterText
                      ) : String(
                        (row == null ? void 0 : row[col.fieldName]) ?? ""
                      ) : "" })
                    },
                    `c-${rowIndex}-${colIndex}`
                  );
                })
              ]
            }
          ),
          hasExpandableRow && isRowExpanded(row) ? /* @__PURE__ */ jsxRuntime.jsx(
            "i-grid-expandable-row",
            {
              className: "i-grid-expandable-row flex",
              role: "row",
              children: expandableRowDef.render(row, { row, index: rowIndex })
            }
          ) : null
        ] }, `r-${key}`);
      })
    ] }),
    hasPagination ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-grid-footer", children: /* @__PURE__ */ jsxRuntime.jsx(
      IPaginator,
      {
        length: totalLength,
        pageIndex,
        pageSize,
        pageSizeOptions,
        onPageChange
      }
    ) }) : null
  ] });
}
var IHostApiContext = React8.createContext(null);
function IHostApiProvider(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(IHostApiContext.Provider, { value: props.hostApi, children: props.children });
}
function useHostApi() {
  const api = React8.useContext(IHostApiContext);
  if (!api)
    throw new Error(
      "useHostApi() must be used under <IHostApiProvider hostApi={...} />"
    );
  return api;
}
function useHostApiOptional() {
  return React8.useContext(IHostApiContext);
}
var IHostUiContext = React8.createContext(null);
function IHostUiProvider(props) {
  const [title, setTitle] = React8.useState(null);
  const [breadcrumbs, setBreadcrumbs] = React8.useState(
    null
  );
  const value = React8.useMemo(
    () => ({ title, breadcrumbs, setTitle, setBreadcrumbs }),
    [title, breadcrumbs]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(IHostUiContext.Provider, { value, children: props.children });
}
function useHostUi() {
  const ctx = React8.useContext(IHostUiContext);
  if (!ctx)
    throw new Error("useHostUi() must be used under <IHostUiProvider />");
  return ctx;
}
function escapeHtml2(input) {
  return (input ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function highlightSearchHtml(text, rawTerm) {
  const term = (rawTerm ?? "").trim();
  if (!term) return escapeHtml2(text ?? "");
  const safeText = text ?? "";
  const lower = safeText.toLowerCase();
  const lowerTerm = term.toLowerCase();
  let out = "";
  let i = 0;
  while (i < safeText.length) {
    const idx = lower.indexOf(lowerTerm, i);
    if (idx === -1) {
      out += escapeHtml2(safeText.slice(i));
      break;
    }
    out += escapeHtml2(safeText.slice(i, idx));
    out += `<span class="highlight-search">${escapeHtml2(
      safeText.slice(idx, idx + term.length)
    )}</span>`;
    i = idx + term.length;
  }
  return out;
}
var Highlighted = React8.memo(function Highlighted2(props) {
  const { text, term, as = "span" } = props;
  const html = React8.useMemo(() => highlightSearchHtml(text, term), [text, term]);
  const Tag = as;
  return /* @__PURE__ */ jsxRuntime.jsx(Tag, { dangerouslySetInnerHTML: { __html: html } });
});
function normalizeCrumbs(items) {
  if (!(items == null ? void 0 : items.length)) return [];
  return items.filter((x) => !!(x == null ? void 0 : x.label));
}
function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
function IHContent(props) {
  const nav = reactRouterDom.useNavigate();
  const crumbs = React8.useMemo(
    () => normalizeCrumbs(props.breadcrumbs),
    [props.breadcrumbs]
  );
  const title = props.title ?? (crumbs.length ? crumbs[crumbs.length - 1].label : null);
  const [sidebarVisibility, setSidebarVisibility] = React8.useState(
    props.defaultSidebarVisible ?? true
  );
  const toggleSidebar = React8.useCallback(() => {
    setSidebarVisibility((prev) => {
      var _a;
      const next = !prev;
      (_a = props.onSidebarToggled) == null ? void 0 : _a.call(props, next);
      return next;
    });
  }, [props]);
  const go = React8.useCallback(
    (url) => {
      if (props.onNavigate) return props.onNavigate(url);
      nav(url);
    },
    [nav, props.onNavigate]
  );
  const onCrumbClick = React8.useCallback(
    (e, url) => {
      if (!isPlainLeftClick(e)) return;
      e.preventDefault();
      if (url.startsWith("/")) go(url);
      else window.location.href = url;
    },
    [go]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("ih-content", { children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ih-content-header", children: [
      /* @__PURE__ */ jsxRuntime.jsx("a", { className: "i-clickable", onClick: toggleSidebar, children: sidebarVisibility ? /* @__PURE__ */ jsxRuntime.jsx("img", { alt: "sidebar-left", src: "/svgs/sidebar-left.svg" }) : /* @__PURE__ */ jsxRuntime.jsx("img", { alt: "sidebar-right", src: "/svgs/sidebar-right.svg" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("h1", { children: title || "Insight" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-content-breadcrumbs", children: crumbs.length ? crumbs.map((b, idx) => {
      const first = idx === 0;
      const last = idx === crumbs.length - 1;
      const clickable = !first && !last && !!b.url;
      return /* @__PURE__ */ jsxRuntime.jsxs(React8__default.default.Fragment, { children: [
        clickable ? /* @__PURE__ */ jsxRuntime.jsx(
          "a",
          {
            className: "ih-content-breadcrumb ih-content-breadcrumb__link",
            href: b.url,
            onClick: (e) => onCrumbClick(e, b.url),
            children: b.label
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          "span",
          {
            className: [
              "ih-content-breadcrumb",
              last ? "ih-content-breadcrumb__current" : "ih-content-breadcrumb__link",
              first ? "ih-content-breadcrumb__first" : ""
            ].filter(Boolean).join(" "),
            children: b.label
          }
        ),
        !last ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ih-content-breadcrumb ih-content-breadcrumb__separator", children: ">" }) : null
      ] }, `${b.label}-${idx}`);
    }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ih-content-breadcrumb ih-content-breadcrumb__first", children: "Home" }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-content-body scroll scroll-y", children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Outlet, {}) })
  ] });
}
function IHContentLayout() {
  const ui = useHostUi();
  const hostApi = useHostApiOptional();
  return /* @__PURE__ */ jsxRuntime.jsx(
    IHContent,
    {
      title: ui.title,
      breadcrumbs: ui.breadcrumbs,
      onNavigate: hostApi ? (url) => void hostApi.navigate(url) : void 0
    }
  );
}
function filterMenuTree(menus, rawTerm) {
  const term = (rawTerm ?? "").trim().toLowerCase();
  if (!term) return menus;
  const filtered = [];
  for (const menu of menus) {
    const result = filterMenuBranch(menu, term);
    if (result) filtered.push(result);
  }
  return filtered;
}
function filterMenuBranch(menu, term) {
  const name = (menu.menuName ?? "").toLowerCase();
  const selfMatches = name.includes(term);
  const originalChildren = menu.child ?? [];
  const filteredChildren = [];
  for (const child of originalChildren) {
    const childResult = filterMenuBranch(child, term);
    if (childResult) filteredChildren.push(childResult);
  }
  const childMatches = filteredChildren.length > 0;
  if (!selfMatches && !childMatches) return null;
  const childrenToUse = selfMatches ? originalChildren : filteredChildren;
  const cloned = { ...menu, child: childrenToUse };
  if (+cloned.menuTypeId === 3 && (selfMatches || childMatches)) {
    cloned.visibility = "expanded";
  }
  return cloned;
}
function flattenNavigableMenus(menus) {
  const result = [];
  const visit = (menu) => {
    const children = menu.child ?? [];
    const hasChildren = children.length > 0;
    const isLeaf = +menu.menuTypeId === 3 && (!hasChildren || menu.visibility === "no-child");
    if (isLeaf) result.push(menu);
    for (const c of children) visit(c);
  };
  for (const m of menus) visit(m);
  return result;
}
var IHMenu = React8.memo(function IHMenu2(props) {
  var _a;
  const { menu, filter, selectedMenuId, onToggleGroup } = props;
  const navigate = reactRouterDom.useNavigate();
  const menuItemRef = React8.useRef(null);
  const hasChild = !!((_a = menu == null ? void 0 : menu.child) == null ? void 0 : _a.length);
  const isSelected = React8.useMemo(() => {
    if (!menu) return false;
    const matchesId = menu.menuId === selectedMenuId;
    if (!matchesId) return false;
    const children = menu.child ?? [];
    const hasChildren = children.length > 0;
    const isLeaf = +menu.menuTypeId === 3 && (!hasChildren || menu.visibility === "no-child");
    return isLeaf;
  }, [menu, selectedMenuId]);
  React8.useLayoutEffect(() => {
    if (isSelected && menuItemRef.current) {
      menuItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [isSelected]);
  const clickGroup = React8.useCallback(() => {
    if (!menu) return;
    if (menu.visibility !== "no-child") onToggleGroup(menu.menuId);
  }, [menu, onToggleGroup]);
  const renderIndent = (level) => {
    if (!level || level <= 0) return null;
    return Array.from({ length: level }).map((_, i) => /* @__PURE__ */ jsxRuntime.jsx("span", {}, i));
  };
  const onLeafNavigate = React8.useCallback(
    (m) => {
      if (m.applicationCode === "INS5" && m.route) {
        navigate(m.route);
      } else if (m.applicationUrl) {
        window.location.href = m.applicationUrl;
      }
    },
    [navigate]
  );
  if (!menu) return null;
  return /* @__PURE__ */ jsxRuntime.jsx("ih-menu", { children: /* @__PURE__ */ jsxRuntime.jsxs(
    "li",
    {
      className: [
        +menu.menuTypeId === 2 ? "is-module" : "",
        +menu.menuTypeId === 2 ? menu.visibility ?? "" : ""
      ].filter(Boolean).join(" "),
      children: [
        +menu.menuTypeId === 2 ? /* @__PURE__ */ jsxRuntime.jsx("small", { children: /* @__PURE__ */ jsxRuntime.jsx(Highlighted, { text: menu.menuName, term: filter }) }) : +menu.menuTypeId === 3 ? hasChild ? /* @__PURE__ */ jsxRuntime.jsxs("div", { onClick: clickGroup, children: [
          menu.level > 0 ? renderIndent(menu.level) : null,
          /* @__PURE__ */ jsxRuntime.jsx("i", { className: menu.icon ?? "" }),
          /* @__PURE__ */ jsxRuntime.jsx("h6", { children: /* @__PURE__ */ jsxRuntime.jsx(Highlighted, { text: menu.menuName, term: filter }) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "i",
            {
              className: menu.visibility === "expanded" ? "fas fa-angle-up" : "fas fa-angle-down"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntime.jsxs(
          "a",
          {
            ref: (el) => {
              menuItemRef.current = el;
            },
            className: isSelected ? "is-selected" : "",
            href: menu.applicationCode === "INS5" ? menu.route ?? "#" : menu.applicationUrl ?? "#",
            onClick: (e) => {
              if (!isPlainLeftClick(e)) return;
              if (menu.applicationCode === "INS5") {
                e.preventDefault();
                onLeafNavigate(menu);
                return;
              }
              if (menu.applicationCode !== "INS5" && !menu.applicationUrl) {
                e.preventDefault();
                onLeafNavigate(menu);
              }
            },
            children: [
              menu.level > 0 ? renderIndent(menu.level) : null,
              /* @__PURE__ */ jsxRuntime.jsx("i", { className: menu.icon ?? "" }),
              /* @__PURE__ */ jsxRuntime.jsx("h6", { children: /* @__PURE__ */ jsxRuntime.jsx(Highlighted, { text: menu.menuName, term: filter }) })
            ]
          }
        ) : null,
        hasChild ? /* @__PURE__ */ jsxRuntime.jsx("ul", { className: +menu.menuTypeId === 3 ? menu.visibility ?? "" : "", children: (menu.child ?? []).map((m) => /* @__PURE__ */ jsxRuntime.jsx(
          IHMenu2,
          {
            menu: m,
            filter,
            selectedMenuId,
            onToggleGroup
          },
          m.menuId
        )) }) : null
      ]
    }
  ) });
});
function IHSidebar(props) {
  const { user, menus, visible = true, footerText = "Insight Local" } = props;
  const location = reactRouterDom.useLocation();
  const navigate = reactRouterDom.useNavigate();
  const initialFilter = React8.useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("menu-filter") ?? "";
  }, [location.search]);
  const [menuFilter, setMenuFilter] = React8.useState(initialFilter);
  const [keyboardNavActive, setKeyboardNavActive] = React8.useState(false);
  const [selectedIndex, setSelectedIndex] = React8.useState(null);
  const [selectedMenuId, setSelectedMenuId] = React8.useState(null);
  const [menuTree, setMenuTree] = React8.useState(menus);
  React8.useEffect(() => {
    setMenuTree(menus);
  }, [menus]);
  const filteredMenus = React8.useMemo(
    () => filterMenuTree(menuTree, menuFilter),
    [menuTree, menuFilter]
  );
  const navigableMenus = React8.useMemo(
    () => flattenNavigableMenus(filteredMenus),
    [filteredMenus]
  );
  const updateUrl = React8.useCallback(
    (nextFilter) => {
      const sp = new URLSearchParams(location.search);
      const f = nextFilter.trim();
      if (f) sp.set("menu-filter", f);
      else sp.delete("menu-filter");
      navigate(
        { search: sp.toString() ? `?${sp.toString()}` : "" },
        { replace: true }
      );
    },
    [location.search, navigate]
  );
  React8.useEffect(() => {
    const hasFilter = !!menuFilter.trim();
    if (!navigableMenus.length || !hasFilter) {
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
      return;
    }
    if (keyboardNavActive) {
      const maxIndex = navigableMenus.length - 1;
      let idx = selectedIndex;
      if (idx == null || idx < 0 || idx > maxIndex) idx = 0;
      setSelectedIndex(idx);
      setSelectedMenuId(navigableMenus[idx].menuId);
    } else {
      setSelectedIndex(null);
      setSelectedMenuId(null);
    }
  }, [navigableMenus, menuFilter]);
  const onFilterChange = React8.useCallback(
    (next) => {
      setMenuFilter(next);
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
      updateUrl(next);
    },
    [updateUrl]
  );
  const onSearchKeyDown = React8.useCallback(
    (event) => {
      if (!navigableMenus.length) return;
      if (!menuFilter.trim()) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          setSelectedIndex(0);
          setSelectedMenuId(navigableMenus[0].menuId);
          return;
        }
        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current + 1 > max ? 0 : current + 1;
          setSelectedMenuId(navigableMenus[next].menuId);
          return next;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          const last = navigableMenus.length - 1;
          setSelectedIndex(last);
          setSelectedMenuId(navigableMenus[last].menuId);
          return;
        }
        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current - 1 < 0 ? max : current - 1;
          setSelectedMenuId(navigableMenus[next].menuId);
          return next;
        });
      } else if (event.key === "Enter") {
        if (!keyboardNavActive) return;
        event.preventDefault();
        const idx = selectedIndex;
        if (idx == null || idx < 0 || idx >= navigableMenus.length) return;
        const m = navigableMenus[idx];
        if (m.applicationCode === "INS5" && m.route) {
          navigate(m.route);
        } else if (m.applicationUrl) {
          window.location.href = m.applicationUrl;
        }
      }
    },
    [navigableMenus, menuFilter, keyboardNavActive, selectedIndex, navigate]
  );
  const onToggleGroup = React8.useCallback((menuId) => {
    const update = (list) => list.map((m) => {
      var _a;
      if (m.menuId === menuId) {
        if (m.visibility !== "no-child") {
          const nextVis = m.visibility === "expanded" ? "collapsed" : "expanded";
          return { ...m, visibility: nextVis };
        }
        return m;
      }
      if ((_a = m.child) == null ? void 0 : _a.length) return { ...m, child: update(m.child) };
      return m;
    });
    setMenuTree((prev) => update(prev));
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("ih-sidebar", { className: !visible ? "hidden" : void 0, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-sidebar-header", children: user ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "user-image", children: /* @__PURE__ */ jsxRuntime.jsx("img", { alt: "User Image", src: user.userImagePath }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "user-info", children: [
        /* @__PURE__ */ jsxRuntime.jsx("small", { className: "text-subtle", children: user.employeeCode }),
        /* @__PURE__ */ jsxRuntime.jsx("h6", { children: user.fullName })
      ] })
    ] }) : null }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-sidebar-search", children: /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        placeholder: "Search Menu..",
        className: "form-control",
        value: menuFilter,
        onChange: (e) => onFilterChange(e.target.value),
        onKeyDown: onSearchKeyDown
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-sidebar-body scroll scroll-y", children: /* @__PURE__ */ jsxRuntime.jsx("ul", { children: filteredMenus.map((m) => /* @__PURE__ */ jsxRuntime.jsx(
      IHMenu,
      {
        menu: m,
        filter: menuFilter,
        selectedMenuId,
        onToggleGroup
      },
      m.menuId
    )) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-sidebar-footer", children: /* @__PURE__ */ jsxRuntime.jsx("small", { children: footerText }) })
  ] });
}
function HostApiBridge(props) {
  const navigate = reactRouterDom.useNavigate();
  const { setTitle, setBreadcrumbs } = useHostUi();
  const hostApi = React8.useMemo(
    () => ({
      navigate: (url) => navigate(url),
      setTitle,
      setBreadcrumbs
    }),
    [navigate, setTitle, setBreadcrumbs]
    // ✅ stable deps
  );
  return /* @__PURE__ */ jsxRuntime.jsx(IHostApiProvider, { hostApi, children: props.children });
}
function HostShell(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(IHostUiProvider, { children: /* @__PURE__ */ jsxRuntime.jsx(HostApiBridge, { children: props.children }) });
}
function stripSlashes(s) {
  return (s ?? "").replace(/^\/+|\/+$/g, "");
}
function normalizePath(path) {
  if (path == null) return "";
  return path;
}
function splitPathname(pathname) {
  const clean = stripSlashes(pathname);
  return clean ? clean.split("/").filter(Boolean) : [];
}
function matchSegment(routeSegment, urlSegment) {
  if (routeSegment.startsWith(":")) return true;
  return routeSegment === urlSegment;
}
function expandImplicitIndexRoutes(routes) {
  const walk = (list) => list.map((r) => {
    var _a;
    const hasChildren = !!((_a = r.children) == null ? void 0 : _a.length);
    const hasOwnContent = !!r.element || !!r.loadComponent;
    if (!hasChildren) return r;
    const expandedChildren = walk(r.children ?? []);
    if (!hasOwnContent) {
      return { ...r, children: expandedChildren };
    }
    const p = r.path;
    const isIndexLikeLayout = p == null || p === "";
    if (isIndexLikeLayout) {
      return { ...r, children: expandedChildren };
    }
    const hasExplicitIndex = expandedChildren.some((c) => c.index === true);
    const implicitIndex = {
      index: true,
      // ✅ NO meta here (parent keeps it so nested children show parent crumb)
      title: void 0,
      breadcrumb: void 0,
      redirectTo: void 0,
      element: r.element,
      loadComponent: r.loadComponent
    };
    const parent = {
      ...r,
      element: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Outlet, {}),
      loadComponent: void 0,
      children: hasExplicitIndex ? expandedChildren : [implicitIndex, ...expandedChildren]
    };
    return parent;
  });
  return walk(routes);
}
function findMatchChain(routes, urlSegments, baseUrl) {
  var _a, _b, _c;
  if (urlSegments.length === 0) {
    const indexRoute = routes.find((r) => r.index);
    if (indexRoute) return [{ route: indexRoute, url: baseUrl || "/" }];
    return null;
  }
  for (const r of routes) {
    if (r.index) continue;
    const routePath = stripSlashes(normalizePath(r.path));
    const routeSegments = routePath ? routePath.split("/").filter(Boolean) : [];
    if (routeSegments.length === 0) {
      if ((_a = r.children) == null ? void 0 : _a.length) {
        const next = findMatchChain(r.children, urlSegments, baseUrl);
        if (next) return [{ route: r, url: baseUrl || "/" }, ...next];
      }
      continue;
    }
    if (routeSegments.length > urlSegments.length) continue;
    let ok = true;
    const consumed = [];
    for (let i = 0; i < routeSegments.length; i++) {
      const a = routeSegments[i];
      const b = urlSegments[i];
      if (!matchSegment(a, b)) {
        ok = false;
        break;
      }
      consumed.push(b);
    }
    if (!ok) continue;
    const nextBase = (baseUrl + "/" + consumed.join("/")).replace(/\/+/g, "/");
    const remaining = urlSegments.slice(routeSegments.length);
    if (remaining.length === 0) {
      if ((_b = r.children) == null ? void 0 : _b.length) {
        const indexChild = r.children.find((c) => c.index);
        if (indexChild) {
          return [
            { route: r, url: nextBase || "/" },
            { route: indexChild, url: nextBase || "/" }
          ];
        }
      }
      return [{ route: r, url: nextBase || "/" }];
    }
    if ((_c = r.children) == null ? void 0 : _c.length) {
      const child = findMatchChain(r.children, remaining, nextBase);
      if (child) return [{ route: r, url: nextBase || "/" }, ...child];
    }
  }
  return null;
}
function buildBreadcrumbsFromChain(chain) {
  const items = [];
  for (const m of chain) {
    if (m.route.redirectTo) continue;
    const label = m.route.breadcrumb ?? m.route.title;
    if (!label) continue;
    const last = items[items.length - 1];
    if (last && last.label === label) continue;
    items.push({ label, url: m.url });
  }
  if (items.length) {
    items[items.length - 1] = { ...items[items.length - 1], url: void 0 };
  }
  return items;
}
function makeElement(r) {
  var _a;
  if (r.redirectTo) return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Navigate, { to: r.redirectTo, replace: true });
  if (r.element) return r.element;
  if (r.loadComponent) {
    const C = React8.lazy(async () => {
      const comp = await r.loadComponent();
      return { default: comp };
    });
    return /* @__PURE__ */ jsxRuntime.jsx(C, {});
  }
  if ((_a = r.children) == null ? void 0 : _a.length) return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Outlet, {});
  return null;
}
function renderRouteTree(routes) {
  return routes.map((r, idx) => {
    var _a, _b;
    const element = makeElement(r);
    const isIndexLike = r.index === true || r.path === "" || r.path == null;
    if (isIndexLike) {
      if (r.redirectTo) {
        return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element }, `redir-${idx}`);
      }
      if (r.index) {
        return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element }, `idx-${idx}`);
      }
      return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { element, children: ((_a = r.children) == null ? void 0 : _a.length) ? renderRouteTree(r.children) : null }, `layout-${idx}`);
    }
    const path = normalizePath(r.path) || void 0;
    return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path, element, children: ((_b = r.children) == null ? void 0 : _b.length) ? renderRouteTree(r.children) : null }, `${path ?? "root"}-${idx}`);
  });
}
function IRouter(props) {
  const {
    routes,
    loading = /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: 16 }, children: "Loading\u2026" }),
    notFound = /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: 16 }, children: "Not Found" })
  } = props;
  const hostApi = useHostApiOptional();
  const location = reactRouterDom.useLocation();
  const expandedRoutes = React8.useMemo(
    () => expandImplicitIndexRoutes(routes),
    [routes]
  );
  const routeElements = React8.useMemo(
    () => renderRouteTree(expandedRoutes),
    [expandedRoutes]
  );
  const lastTitleRef = React8.useRef(null);
  const lastCrumbsKeyRef = React8.useRef("");
  React8.useEffect(() => {
    var _a;
    if (!hostApi) return;
    const urlSegments = splitPathname(location.pathname);
    const chain = findMatchChain(expandedRoutes, urlSegments, "") ?? [];
    const crumbs = buildBreadcrumbsFromChain(chain);
    const crumbsKey = JSON.stringify(
      crumbs.map((c) => ({ l: c.label, u: c.url ?? "" }))
    );
    const lastWithTitle = (_a = [...chain].reverse().find((x) => x.route.title)) == null ? void 0 : _a.route;
    const nextTitle = (lastWithTitle == null ? void 0 : lastWithTitle.title) ?? null;
    if (lastTitleRef.current !== nextTitle) {
      lastTitleRef.current = nextTitle;
      hostApi.setTitle(nextTitle);
    }
    if (lastCrumbsKeyRef.current !== crumbsKey) {
      lastCrumbsKeyRef.current = crumbsKey;
      hostApi.setBreadcrumbs(crumbs.length ? crumbs : null);
    }
  }, [hostApi, location.pathname, expandedRoutes]);
  return /* @__PURE__ */ jsxRuntime.jsx(React8.Suspense, { fallback: loading, children: /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    routeElements,
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: notFound })
  ] }) });
}
function isTruthyAttr(v) {
  if (v === null || v === void 0) return false;
  const s = String(v).trim().toLowerCase();
  if (s === "false" || s === "0" || s === "null" || s === "undefined")
    return false;
  return true;
}
function parseBadge(v) {
  if (!isTruthyAttr(v)) return { enabled: false, value: null };
  const raw = String(v).trim();
  if (raw === "" || raw.toLowerCase() === "true")
    return { enabled: true, value: null };
  const n = Number(raw);
  if (Number.isFinite(n) && Number.isInteger(n) && n >= 0) {
    return { enabled: true, value: n };
  }
  return { enabled: true, value: null };
}
function parseTabsHeight(v) {
  if (v === null || v === void 0) return null;
  const s = String(v).trim().toLowerCase();
  if (s === "" || s === "wrap" || s === "auto") return null;
  if (s.endsWith("px")) {
    const n2 = Number(s.slice(0, -2).trim());
    return Number.isFinite(n2) && n2 > 0 ? n2 : null;
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function isValidIndex(index, len) {
  return Number.isInteger(index) && index >= 0 && index < len;
}
function ISection(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-section", { ...props });
}
function ISectionHeader(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-header", { ...props, children: /* @__PURE__ */ jsxRuntime.jsx("h4", { children: props.children }) });
}
function ISectionSubHeader(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-sub-header", { ...props, children: /* @__PURE__ */ jsxRuntime.jsx("h6", { children: props.children }) });
}
function ISectionFilter(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-filter", { ...props });
}
function ISectionBody(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-body", { ...props });
}
function ISectionFooter(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-footer", { ...props });
}
function ISectionTab(_props) {
  return null;
}
function DefaultHeader(props) {
  const { title, badgeEnabled, badgeValue } = props;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-section-tab-title", children: title }),
    badgeEnabled ? /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: [
          "i-section-tab-badge",
          badgeValue !== null ? "has-number" : null
        ].filter(Boolean).join(" "),
        children: badgeValue !== null ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-section-tab-badge-number", children: badgeValue }) : null
      }
    ) : null
  ] });
}
function normalizeTab(node, index) {
  if (!React8__default.default.isValidElement(node)) return null;
  if (node.type !== ISectionTab) return null;
  const props = node.props;
  const title = String(props.title ?? "");
  const opened = !!props.opened;
  const parsed = parseBadge(props.badge);
  const badgeEnabled = parsed.enabled;
  const badgeValue = parsed.value;
  const headerNode = props.header !== void 0 && props.header !== null ? props.header : /* @__PURE__ */ jsxRuntime.jsx(
    DefaultHeader,
    {
      title,
      badgeEnabled,
      badgeValue
    }
  );
  const contentNode = props.children ?? null;
  return {
    key: `tab-${index}`,
    title,
    opened,
    badgeEnabled,
    badgeValue,
    headerNode,
    contentNode
  };
}
function ISectionTabs(props) {
  const {
    selectedIndex = null,
    onSelectedIndexChange,
    height = "wrap",
    children,
    className,
    ...rest
  } = props;
  const tabs = React8.useMemo(() => {
    const arr = React8__default.default.Children.toArray(children);
    return arr.map((n, i) => normalizeTab(n, i)).filter(Boolean);
  }, [children]);
  const openedIndex = React8.useMemo(() => tabs.findIndex((t) => t.opened), [tabs]);
  const contentHeightPx = React8.useMemo(() => parseTabsHeight(height), [height]);
  const isFixedHeight = contentHeightPx !== null;
  const hasValidControlledIndex = React8.useMemo(
    () => selectedIndex !== null && selectedIndex !== void 0 && isValidIndex(selectedIndex, tabs.length),
    [selectedIndex, tabs.length]
  );
  const computeNextIndex = React8.useCallback(() => {
    if (hasValidControlledIndex) return selectedIndex;
    if (openedIndex >= 0 && isValidIndex(openedIndex, tabs.length))
      return openedIndex;
    return 0;
  }, [hasValidControlledIndex, selectedIndex, openedIndex, tabs.length]);
  const [activeIndex, setActiveIndex] = React8.useState(
    () => computeNextIndex()
  );
  React8.useEffect(() => {
    setActiveIndex(computeNextIndex());
  }, [computeNextIndex]);
  const activeTab = tabs[activeIndex] ?? null;
  const setActive = React8.useCallback(
    (index, emit) => {
      if (!isValidIndex(index, tabs.length)) return;
      setActiveIndex(index);
      if (emit) {
        onSelectedIndexChange == null ? void 0 : onSelectedIndexChange(index);
      }
    },
    [onSelectedIndexChange, tabs.length]
  );
  const activateByIndex = React8.useCallback(
    (index) => {
      setActive(index, true);
    },
    [setActive]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("i-section-tabs", { className, ...rest, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-section-tabs-headers", role: "tablist", children: tabs.map((tab, index) => {
      const isActive = index === activeIndex;
      return /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          className: ["i-section-tabs-header", isActive ? "active" : null].filter(Boolean).join(" "),
          role: "tab",
          type: "button",
          "aria-selected": isActive,
          tabIndex: isActive ? 0 : -1,
          onClick: () => activateByIndex(index),
          children: tab.headerNode
        },
        tab.key
      );
    }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: [
          "i-section-tabs-content",
          isFixedHeight ? "scroll" : null,
          isFixedHeight ? "scroll-y" : null
        ].filter(Boolean).join(" "),
        style: isFixedHeight ? { height: `${contentHeightPx}px` } : void 0,
        children: activeTab ? activeTab.contentNode : null
      }
    )
  ] });
}
var INTERACTIVE_SELECTOR_PARTS = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  '[role="button"]',
  '[role="link"]',
  '[role="switch"]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
];
var INTERACTIVE_SELECTOR = INTERACTIVE_SELECTOR_PARTS.join(",");
function isInteractive(el) {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "a" || tag === "button" || tag === "input" || tag === "textarea" || tag === "select" || tag === "label")
    return true;
  const role = el.getAttribute("role");
  if (role === "button" || role === "link" || role === "switch") return true;
  if (el.isContentEditable) return true;
  const tabindex = el.getAttribute("tabindex");
  if (tabindex != null && tabindex !== "-1") return true;
  return false;
}
function IToggle(props) {
  const {
    checked,
    defaultChecked = false,
    disabled = false,
    labelPosition = "right",
    onChange,
    onTouched,
    children,
    className,
    name,
    value,
    ...rest
  } = props;
  const inputId = React8.useId();
  const inputRef = React8.useRef(null);
  const isControlled = checked != null;
  const [uncontrolledChecked, setUncontrolledChecked] = React8.useState(defaultChecked);
  const currentChecked = isControlled ? !!checked : uncontrolledChecked;
  const hostClassName = React8.useMemo(() => {
    return [
      "i-toggle",
      currentChecked ? "i-toggle__active" : null,
      disabled ? "i-toggle__disabled" : null,
      labelPosition === "left" ? "i-toggle__label-left" : null,
      className ?? null
    ].filter(Boolean).join(" ");
  }, [currentChecked, disabled, labelPosition, className]);
  const emitChange = React8.useCallback(
    (next) => {
      if (!isControlled) setUncontrolledChecked(next);
      onChange == null ? void 0 : onChange(next);
    },
    [isControlled, onChange]
  );
  const handleNativeChange = React8.useCallback(
    (e) => {
      if (disabled) return;
      emitChange(!!e.target.checked);
    },
    [disabled, emitChange]
  );
  const handleBlur = React8.useCallback(() => {
    onTouched == null ? void 0 : onTouched();
  }, [onTouched]);
  const handleHostClick = React8.useCallback(
    (e) => {
      var _a;
      if (disabled) return;
      const target = e.target;
      if ((target == null ? void 0 : target.tagName.toLowerCase()) === "input") return;
      if (target && (isInteractive(target) || target.closest(INTERACTIVE_SELECTOR))) {
        return;
      }
      (_a = inputRef.current) == null ? void 0 : _a.click();
    },
    [disabled]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-toggle",
    {
      ...rest,
      className: hostClassName,
      onClick: handleHostClick,
      role: "switch",
      "aria-checked": currentChecked,
      "aria-disabled": disabled || void 0,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref: inputRef,
            id: inputId,
            className: "i-toggle__input",
            type: "checkbox",
            checked: currentChecked,
            disabled,
            name,
            value,
            onChange: handleNativeChange,
            onBlur: handleBlur
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-toggle__thumb" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-toggle__label", children })
      ]
    }
  );
}

exports.DEFAULT_ERROR_FACTORIES = DEFAULT_ERROR_FACTORIES;
exports.HostShell = HostShell;
exports.IAlert = IAlert;
exports.IButton = IButton;
exports.ICard = ICard;
exports.ICardBody = ICardBody;
exports.ICardFooter = ICardFooter;
exports.ICardImage = ICardImage;
exports.ICodeViewer = ICodeViewer;
exports.IConfirm = IConfirm;
exports.IDatepicker = IDatepicker;
exports.IDialog = IDialog;
exports.IDialogClose = IDialogClose;
exports.IDialogOutlet = IDialogOutlet;
exports.IDialogProvider = IDialogProvider;
exports.IDialogRef = IDialogRef;
exports.IFCDatepicker = IFCDatepicker;
exports.IFCInput = IFCInput;
exports.IFCTextArea = IFCTextArea;
exports.IGrid = IGrid;
exports.IGridColumn = IGridColumn;
exports.IGridColumnGroup = IGridColumnGroup;
exports.IGridCustomColumn = IGridCustomColumn;
exports.IGridDataSource = IGridDataSource;
exports.IGridExpandableRow = IGridExpandableRow;
exports.IHContent = IHContent;
exports.IHContentLayout = IHContentLayout;
exports.IHMenu = IHMenu;
exports.IHSidebar = IHSidebar;
exports.IHostApiProvider = IHostApiProvider;
exports.IHostUiProvider = IHostUiProvider;
exports.IIcon = IIcon;
exports.IInput = IInput;
exports.IInputAddon = IInputAddon;
exports.ILoading = ILoading;
exports.IPaginator = IPaginator;
exports.IRouter = IRouter;
exports.ISection = ISection;
exports.ISectionBody = ISectionBody;
exports.ISectionFilter = ISectionFilter;
exports.ISectionFooter = ISectionFooter;
exports.ISectionHeader = ISectionHeader;
exports.ISectionSubHeader = ISectionSubHeader;
exports.ISectionTab = ISectionTab;
exports.ISectionTabs = ISectionTabs;
exports.ISelect = ISelect;
exports.ITextArea = ITextArea;
exports.IToggle = IToggle;
exports.I_ICON_NAMES = I_ICON_NAMES;
exports.I_ICON_SIZES = I_ICON_SIZES;
exports.asMinMaxLengthError = asMinMaxLengthError;
exports.hasNumber = hasNumber;
exports.interpolate = interpolate;
exports.isControlRequired = isControlRequired;
exports.isRecord = isRecord;
exports.readNumber = readNumber;
exports.resolveControlErrorMessage = resolveControlErrorMessage;
exports.useDialogData = useDialogData;
exports.useDialogRef = useDialogRef;
exports.useHostApi = useHostApi;
exports.useHostApiOptional = useHostApiOptional;
exports.useHostUi = useHostUi;
exports.useIAlertService = useIAlertService;
exports.useIConfirmService = useIConfirmService;
exports.useIDialog = useIDialog;
exports.useInputMask = useInputMask;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map