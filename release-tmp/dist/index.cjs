'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React8 = require('react');
var reactRouterDom = require('react-router-dom');
var reactDom = require('react-dom');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React8__default = /*#__PURE__*/_interopDefault(React8);

// src/components/icon/icon.tsx
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
  "3xs": "i-icon-3xs",
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
  const iconSizeClass = I_ICON_SIZES[size] ?? I_ICON_SIZES.sm;
  const baseClass = I_ICON_NAMES[icon] ?? String(icon);
  const iconClass = `${baseClass} ${iconSizeClass}`;
  return /* @__PURE__ */ jsxRuntime.jsx("i-icon", { class: className, icon: String(icon), size, ...rest, children: /* @__PURE__ */ jsxRuntime.jsx("i", { className: iconClass }) });
}
function ILoading(props) {
  const { label = "Loading..", light = false, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsxs("i-loading", { light: light ? "true" : void 0, ...rest, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: `spinner-border spinner-border-sm${light ? " light" : ""}`,
        role: "status"
      }
    ),
    label
  ] });
}
function findClosestForm(startEl) {
  let el = startEl;
  while (el) {
    if (el instanceof HTMLFormElement) return el;
    el = el.parentElement;
  }
  return null;
}
function buildUrl(base, queryParams, fragment) {
  if (!base) return void 0;
  let url = base;
  if (queryParams) {
    const params = new URLSearchParams();
    for (const key in queryParams) {
      const value = queryParams[key];
      if (value !== void 0 && value !== null) {
        params.append(key, String(value));
      }
    }
    const query = params.toString();
    if (query) url += `?${query}`;
  }
  if (fragment) url += `#${fragment}`;
  return url;
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
    routerLink,
    queryParams,
    fragment,
    state,
    href,
    target,
    rel,
    children,
    className,
    ...rest
  } = props;
  const isDisabled = disabled || loading;
  const computedRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel ?? void 0;
  let mode = "button";
  if (routerLink) mode = "router";
  else if (href) mode = "anchor";
  const url = buildUrl(routerLink ?? href, queryParams, fragment);
  const handleClick = (event) => {
    var _a, _b;
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      (_b = (_a = event.nativeEvent) == null ? void 0 : _a.stopImmediatePropagation) == null ? void 0 : _b.call(_a);
      return;
    }
    onClick == null ? void 0 : onClick(event.nativeEvent);
    if (mode === "button" && (type === "submit" || type === "reset")) {
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
  const content = loading ? /* @__PURE__ */ jsxRuntime.jsx(ILoading, { label: loadingText, light: variant !== "outline" }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    icon ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon, size }) : null,
    children
  ] });
  return /* @__PURE__ */ jsxRuntime.jsx(
    "i-button",
    {
      ...rest,
      class: className,
      variant,
      size,
      icon: icon ? String(icon) : void 0,
      "data-mode": mode,
      "aria-disabled": isDisabled ? "true" : void 0,
      "aria-busy": loading ? "true" : void 0,
      children: mode === "router" || mode === "anchor" ? /* @__PURE__ */ jsxRuntime.jsx(
        "a",
        {
          className: "i-button-inner",
          "aria-disabled": isDisabled ? "true" : void 0,
          href: isDisabled ? void 0 : url,
          target,
          rel: computedRel,
          onClick: handleClick,
          children: content
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          className: "i-button-inner",
          disabled: isDisabled,
          type,
          onClick: handleClick,
          children: content
        }
      )
    }
  );
}
var SIZE_PRESETS = {
  "3xs": 12,
  "2xs": 16,
  xs: 20,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  "2xl": 128,
  "3xl": 160,
  "4xl": 200
};
function resolveIconSize(size) {
  if (size <= 24) return "sm";
  if (size <= 40) return "md";
  if (size <= 64) return "lg";
  if (size <= 96) return "xl";
  if (size <= 128) return "2xl";
  if (size <= 160) return "3xl";
  return "4xl";
}
function resolvePixelSize(size) {
  return typeof size === "number" ? size : SIZE_PRESETS[size];
}
function IAvatar(props) {
  const {
    src,
    alt = "",
    size = 40,
    shape = "circle",
    fallbackSrc,
    className,
    style,
    ...rest
  } = props;
  const [hasSourceError, setHasSourceError] = React8.useState(false);
  const [hasFallbackError, setHasFallbackError] = React8.useState(false);
  React8.useEffect(() => {
    setHasSourceError(false);
  }, [src]);
  React8.useEffect(() => {
    setHasFallbackError(false);
  }, [fallbackSrc]);
  const pixelSize = resolvePixelSize(size);
  const iconSize = typeof size === "string" ? size : resolveIconSize(size);
  const hostStyle = React8.useMemo(
    () => ({ width: pixelSize, height: pixelSize, ...style }),
    [pixelSize, style]
  );
  const imageSource = !hasSourceError && src ? src : void 0;
  const fallbackImageSource = !imageSource && !hasFallbackError && fallbackSrc ? fallbackSrc : void 0;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "i-avatar",
    {
      ...rest,
      class: ["i-avatar", className].filter(Boolean).join(" "),
      "data-shape": shape,
      style: hostStyle,
      children: imageSource ? /* @__PURE__ */ jsxRuntime.jsx("img", { alt, src: imageSource, onError: () => setHasSourceError(true) }) : fallbackImageSource ? /* @__PURE__ */ jsxRuntime.jsx(
        "img",
        {
          alt,
          src: fallbackImageSource,
          onError: () => setHasFallbackError(true)
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx(IIcon, { "aria-label": "User avatar", icon: "user", size: iconSize })
    }
  );
}
function normalizeHref(input) {
  if (input === null || input === void 0) return void 0;
  const s = String(input).trim();
  return s ? s : void 0;
}
function routerLinkToTo(routerLink) {
  if (!routerLink) return void 0;
  if (Array.isArray(routerLink)) {
    const parts = routerLink.flat().map((x) => String(x ?? "").trim()).filter(Boolean);
    if (!parts.length) return void 0;
    return parts.join("/").replace(/\/+/g, "/");
  }
  const s = String(routerLink).trim();
  return s || void 0;
}
function buildSearch(queryParams) {
  if (!queryParams) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(queryParams)) {
    if (v === void 0 || v === null) continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}
function buildHash(fragment) {
  if (!fragment) return "";
  const f = String(fragment).trim();
  if (!f) return "";
  return f.startsWith("#") ? f : `#${f}`;
}
function ICard(props) {
  const {
    href,
    routerLink,
    queryParams,
    fragment,
    replaceUrl = false,
    skipLocationChange = false,
    state,
    target,
    rel,
    disabled = false,
    onClick,
    children,
    className,
    ...rest
  } = props;
  const normalizedHref = React8.useMemo(() => normalizeHref(href), [href]);
  const toBase = React8.useMemo(() => routerLinkToTo(routerLink), [routerLink]);
  const search = React8.useMemo(() => buildSearch(queryParams), [queryParams]);
  const hash = React8.useMemo(() => buildHash(fragment), [fragment]);
  const to = React8.useMemo(() => {
    if (!toBase) return void 0;
    const hasSearch = toBase.includes("?");
    const hasHash = toBase.includes("#");
    let out = toBase;
    if (search && !hasSearch) out += search;
    if (hash && !hasHash) out += hash;
    return out;
  }, [toBase, search, hash]);
  const useRouterLink = !disabled && !!to;
  const relAttr = rel ?? ((target ?? "").toLowerCase() === "_blank" ? "noopener noreferrer" : void 0);
  const handleClick = (ev) => {
    var _a, _b;
    if (disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      (_b = (_a = ev.nativeEvent) == null ? void 0 : _a.stopImmediatePropagation) == null ? void 0 : _b.call(_a);
      return;
    }
    if (onClick) {
      ev.preventDefault();
      onClick(ev);
      return;
    }
    if (!to && !normalizedHref) {
      ev.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx("i-card", { class: className, ...rest, children: useRouterLink ? /* @__PURE__ */ jsxRuntime.jsx(
    reactRouterDom.Link,
    {
      className: "i-card",
      "aria-disabled": disabled ? "true" : void 0,
      tabIndex: disabled ? -1 : void 0,
      to,
      replace: replaceUrl,
      state,
      target: target ?? void 0,
      rel: relAttr ?? void 0,
      onClick: handleClick,
      children
    }
  ) : /* @__PURE__ */ jsxRuntime.jsx(
    "a",
    {
      className: "i-card",
      "aria-disabled": disabled ? "true" : void 0,
      tabIndex: disabled ? -1 : void 0,
      href: disabled ? void 0 : normalizedHref,
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
function documentBaseUrl() {
  const base = document.querySelector("base[href]");
  return (base == null ? void 0 : base.href) ?? `${window.location.origin}/`;
}
function resolveFileUrl(file) {
  const f = (file ?? "").trim();
  if (!f) return f;
  if (isAbsoluteUrl(f)) return f;
  return new URL(f.replace(/^\.?\//, ""), documentBaseUrl()).toString();
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
function extractTextFromReactNode(node) {
  if (node === null || node === void 0 || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join("");
  }
  if (React8__default.default.isValidElement(node)) {
    return extractTextFromReactNode(node.props.children);
  }
  return "";
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
    className,
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
  const projectedText = React8.useMemo(
    () => extractTextFromReactNode(children),
    [children]
  );
  React8.useLayoutEffect(() => {
    if (fileTrimmed) return;
    if (codePropString) return;
    if (rawCode) return;
    const text = (projectedText ?? "").trim();
    if (!text) return;
    setRawCode(text);
  }, [projectedText, fileTrimmed, codePropString, rawCode]);
  const hljsRef = React8.useRef(null);
  const hljsPromiseRef = React8.useRef(null);
  const shouldUseHljs = highlighter === "hljs" || highlighter === "auto";
  const loadHljsIfNeeded = React8.useCallback(async () => {
    if (hljsRef.current) return hljsRef.current;
    const w = globalThis;
    if (w == null ? void 0 : w.hljs) {
      hljsRef.current = w.hljs;
      return hljsRef.current;
    }
    if (!hljsPromiseRef.current) {
      hljsPromiseRef.current = import('highlight.js').then((m) => {
        const mod = m;
        return mod.default ?? m;
      }).catch(() => null);
    }
    const loaded = await hljsPromiseRef.current;
    if (loaded) {
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
    if (!f) {
      setLoading(false);
      setError("");
      return;
    }
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
  return /* @__PURE__ */ jsxRuntime.jsx("i-code-viewer", { class: className, ...rest, children: /* @__PURE__ */ jsxRuntime.jsxs(
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
                    // ✅ Match Angular: always scroll classes here
                    "i-code-viewer-content",
                    "hljs",
                    "scroll",
                    "scroll-y"
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
  ) });
}
function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}
function normalizeArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
function countDigitsBeforePos(value, pos) {
  let n = 0;
  for (let i = 0; i < Math.min(pos, value.length); i++) {
    if (/\d/.test(value[i])) n++;
  }
  return n;
}
function caretPosAfterDigits(value, digitCount) {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < value.length; i++) {
    if (/\d/.test(value[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }
  return value.length;
}
function useInputMask(inputRef, mask, opts = {}) {
  const defaultAppliedRef = React8.useRef(false);
  const enableDefault = opts.enableDefault ?? true;
  React8.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (!mask) return;
    if (el.readOnly || el.disabled) return;
    const type = mask.type;
    const fmt = mask.format;
    const dispatchInput = () => {
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const safeSetSelectionRange = (start, end) => {
      try {
        if (typeof el.setSelectionRange === "function") {
          el.setSelectionRange(start, end);
        }
      } catch {
      }
    };
    const setValue = (v, o) => {
      const old = el.value ?? "";
      if (v === old) return;
      const prevPos = (o == null ? void 0 : o.anchorPos) ?? el.selectionStart ?? old.length;
      el.value = v;
      const delta = v.length - old.length;
      const newPos = Math.max(0, Math.min(v.length, prevPos + delta));
      safeSetSelectionRange(newPos, newPos);
      if ((o == null ? void 0 : o.emit) !== false) {
        dispatchInput();
      }
    };
    const pad2 = (n) => String(n).padStart(2, "0");
    const isControlKey = (e) => {
      const key = e.key;
      const controlKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
        "Home",
        "End",
        "Enter",
        "Escape"
      ];
      if (controlKeys.includes(key)) return true;
      if (e.ctrlKey || e.metaKey || e.altKey) return true;
      return false;
    };
    const formatDateDefault = (d, format) => {
      const yyyy = String(d.getFullYear());
      const MM = pad2(d.getMonth() + 1);
      const dd = pad2(d.getDate());
      return (format || "dd/MM/yyyy").replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd);
    };
    const formatTimeDefault = (d, format) => {
      const HH = pad2(d.getHours());
      const mm = pad2(d.getMinutes());
      const ss = pad2(d.getSeconds());
      return (format || "HH:mm").replace(/HH/g, HH).replace(/mm/g, mm).replace(/ss/g, ss);
    };
    const applyInitialDefaultIfNeeded = () => {
      if (!enableDefault) return;
      if (defaultAppliedRef.current) return;
      if (el.value && el.value.trim().length > 0) return;
      const now = /* @__PURE__ */ new Date();
      if (type === "date") {
        const v = formatDateDefault(now, fmt || "dd/MM/yyyy");
        defaultAppliedRef.current = true;
        el.value = v;
        dispatchInput();
      } else if (type === "time") {
        const v = formatTimeDefault(now, fmt || "HH:mm");
        defaultAppliedRef.current = true;
        el.value = v;
        dispatchInput();
      }
    };
    applyInitialDefaultIfNeeded();
    const applyNumericMask = (raw, allowDecimal) => {
      if (!raw) return "";
      let out = "";
      let hasDecimal = false;
      for (const ch of raw) {
        if (/\d/.test(ch)) {
          out += ch;
          continue;
        }
        if (allowDecimal && (ch === "." || ch === ",")) {
          if (!hasDecimal) {
            hasDecimal = true;
            out += ch;
          }
        }
      }
      return out;
    };
    const applyTextCaseMask = (value, caseType) => {
      if (!value) return value;
      return caseType === "lowercase" ? value.toLowerCase() : value.toUpperCase();
    };
    const daysInMonth = (year, month1) => new Date(year, month1, 0).getDate();
    const splitDateFormat = (format) => {
      const tokens = [];
      const seps = [];
      let currentSep = "";
      let i = 0;
      const isTokenChar = (c) => c === "d" || c === "M" || c === "y";
      while (i < format.length) {
        const c = format[i];
        if (!isTokenChar(c)) {
          currentSep += c;
          i++;
          continue;
        }
        seps.push(currentSep);
        currentSep = "";
        const ch = c;
        let token = ch;
        let j = i + 1;
        while (j < format.length && format[j] === ch) {
          token += format[j];
          j++;
        }
        tokens.push(token);
        i = j;
      }
      seps.push(currentSep);
      return { tokens, seps };
    };
    const getDateSegments = (value, format) => {
      const { tokens, seps } = splitDateFormat(format);
      const segments = [];
      let pos = 0;
      if (seps[0]) {
        const s0 = seps[0];
        if (value.startsWith(s0)) pos += s0.length;
      }
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const kind = ch === "d" ? "day" : ch === "M" ? "month" : "year";
        const start = pos;
        let end = pos;
        while (end < value.length && /\d/.test(value[end])) end++;
        const raw = value.slice(start, end);
        segments.push({ kind, start, end, raw });
        pos = end;
        const sep = seps[i + 1] ?? "";
        if (sep && value.substr(pos, sep.length) === sep) {
          pos += sep.length;
        }
      }
      return segments;
    };
    const formatDateFromParts = (day, month, year, format) => {
      const { tokens, seps } = splitDateFormat(format);
      let result = seps[0] ?? "";
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;
        if (ch === "d") {
          result += String(day).padStart(len, "0");
        } else if (ch === "M") {
          result += String(month).padStart(len, "0");
        } else {
          let s = String(year);
          if (s.length < len) s = s.padStart(len, "0");
          else if (s.length > len) s = s.slice(-len);
          result += s;
        }
        if (i < tokens.length - 1) {
          result += seps[i + 1] ?? "";
        }
      }
      return result;
    };
    const applyDateMaskDigitsOnly = (digits, format) => {
      const { tokens, seps } = splitDateFormat(format);
      if (!tokens.length) return digits;
      const totalDigits = tokens.reduce((a, t) => a + t.length, 0);
      const d = digits.replace(/\D/g, "").slice(0, totalDigits);
      const firstSep = seps[1] ?? "";
      const secondSep = seps[2] ?? "";
      if (d.length <= 2) {
        if (d.length === 2 && firstSep) return d + firstSep;
        return d;
      }
      if (d.length <= 4) {
        const dRaw = d.slice(0, 2);
        const mRaw = d.slice(2);
        let res = dRaw;
        if (firstSep) res += firstSep;
        if (mRaw.length) {
          res += mRaw;
          if (mRaw.length === 2 && secondSep) res += secondSep;
        }
        return res;
      }
      const dStr = d.slice(0, 2);
      const mStr = d.slice(2, 4);
      const yStr = d.slice(4, 8);
      let day = Number(dStr || "1");
      let month = Number(mStr || "1");
      let year = Number(yStr || "2000");
      month = clamp(month, 1, 12);
      if (!Number.isFinite(year) || year <= 0) year = 2e3;
      year = Math.min(year, 9999);
      const maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);
      return formatDateFromParts(day, month, year, format);
    };
    const applyDateMask = (raw, format) => {
      if (!raw) return "";
      const hasSeparator = /[^0-9]/.test(raw);
      const { tokens, seps } = splitDateFormat(format);
      if (!tokens.length) return raw.replace(/\D/g, "");
      if (!hasSeparator) {
        const digits = raw.replace(/\D/g, "");
        if (!digits) return "";
        return applyDateMaskDigitsOnly(digits, format);
      }
      const rawSegs = raw.split(/[^0-9]/);
      const rawSeps = raw.match(/[^0-9]+/g) ?? [];
      const parts = [];
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;
        const rawSeg = (rawSegs[i] ?? "").replace(/\D/g, "").slice(0, len);
        const kind = ch === "d" ? "day" : ch === "M" ? "month" : "year";
        const closed = rawSeg.length >= len;
        parts.push({ kind, raw: rawSeg, len, closed, out: "" });
      }
      const dayPart = parts.find((p) => p.kind === "day");
      const monthPart = parts.find((p) => p.kind === "month");
      const yearPart = parts.find((p) => p.kind === "year");
      let monthNumForClamp = null;
      if (monthPart && monthPart.closed && monthPart.raw) {
        let m = Number(monthPart.raw);
        if (!Number.isFinite(m)) m = 1;
        m = clamp(m, 1, 12);
        monthNumForClamp = m;
      }
      let yearForCalc = 2e3;
      if (yearPart && yearPart.closed && yearPart.raw) {
        let y = Number(yearPart.raw);
        if (!Number.isFinite(y) || y <= 0) y = 2e3;
        y = Math.min(y, 9999);
        yearForCalc = y;
      }
      if (monthPart) {
        if (monthPart.closed && monthPart.raw) {
          let m = monthNumForClamp ?? Number(monthPart.raw);
          if (!Number.isFinite(m)) m = 1;
          m = clamp(m, 1, 12);
          monthPart.out = String(m).padStart(monthPart.len, "0");
          monthNumForClamp = m;
        } else {
          monthPart.out = monthPart.raw;
        }
      }
      if (dayPart) {
        if (dayPart.closed && dayPart.raw) {
          let d = Number(dayPart.raw);
          if (!Number.isFinite(d)) d = 1;
          const monthForDay = monthNumForClamp !== null ? monthNumForClamp : 1;
          const maxDay = daysInMonth(yearForCalc, monthForDay);
          d = clamp(d, 1, maxDay);
          dayPart.out = String(d).padStart(dayPart.len, "0");
        } else {
          dayPart.out = dayPart.raw;
        }
      }
      if (yearPart) {
        yearPart.out = yearPart.raw;
      }
      const outSegs = parts.map((p) => p.out);
      const hasDigitsArr = parts.map((p) => p.raw.length > 0);
      let result = seps[0] ?? "";
      for (let i = 0; i < parts.length; i++) {
        result += outSegs[i] ?? "";
        if (i < parts.length - 1) {
          const sepFmt = seps[i + 1] ?? "";
          const hadRawSep = i < rawSeps.length;
          const segClosed = parts[i].closed;
          const nextHasDigits = hasDigitsArr[i + 1];
          if (sepFmt && (hadRawSep || segClosed || nextHasDigits)) {
            result += sepFmt;
          }
        }
      }
      return result.replace(/[^0-9]+$/, (sep) => {
        const prefix = result.slice(0, -sep.length);
        return /\d/.test(prefix) ? sep : "";
      });
    };
    const normalizeDateValue = (value, format) => {
      if (!value) return value;
      const segments = getDateSegments(value, format);
      if (!segments.length) return value;
      let day = 1;
      let month = 1;
      let year = 2e3;
      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg.kind === "day") day = n;
        else if (seg.kind === "month") month = n;
        else year = n;
      }
      month = clamp(month, 1, 12);
      if (!Number.isFinite(year) || year <= 0) year = 2e3;
      year = Math.min(year, 9999);
      const maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);
      return formatDateFromParts(day, month, year, format);
    };
    const normalizePastedDate = (text, format) => {
      if (!text) return "";
      const nums = text.match(/\d+/g) ?? [];
      if (!nums.length) return "";
      const { tokens } = splitDateFormat(format);
      let day = 1;
      let month = 1;
      let year = 2e3;
      if (nums.length >= 3) {
        const a = nums[0] ?? "";
        const b = nums[1] ?? "";
        const c = nums[2] ?? "";
        const aNum = Number(a);
        const bNum = Number(b);
        const cNum = Number(c);
        if (a.length === 4) {
          year = aNum;
          month = bNum;
          day = cNum;
        } else if (c.length === 4) {
          day = aNum;
          month = bNum;
          year = cNum;
        } else {
          tokens.forEach((t, i) => {
            const rawNum = nums[i] ?? "";
            const n = Number(rawNum);
            if (!Number.isFinite(n)) return;
            if (t[0] === "d") day = n;
            else if (t[0] === "M") month = n;
            else year = n;
          });
        }
      } else {
        const digits = nums.join("").replace(/\D/g, "");
        return applyDateMaskDigitsOnly(digits, format);
      }
      if (!Number.isFinite(year) || year <= 0) year = 2e3;
      year = Math.min(year, 9999);
      month = clamp(month, 1, 12);
      const maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);
      return formatDateFromParts(day, month, year, format);
    };
    const handleDateDigitKeydown = (digitChar) => {
      if (type !== "date") return false;
      const format = fmt || "dd/MM/yyyy";
      const { tokens } = splitDateFormat(format);
      if (!tokens.length) return false;
      const lens = tokens.map((t) => t.length);
      const totalDigits = lens.reduce((a, b) => a + b, 0);
      const currentDigits = (el.value ?? "").replace(/\D/g, "").slice(0, totalDigits);
      const caret = el.selectionStart ?? (el.value ?? "").length;
      const digitCursor = countDigitsBeforePos(el.value ?? "", caret);
      const ranges = [];
      let acc = 0;
      for (const tok of tokens) {
        const kind = tok[0] === "d" ? "day" : tok[0] === "M" ? "month" : "year";
        const len = tok.length;
        ranges.push({ start: acc, end: acc + len, kind });
        acc += len;
      }
      let idx = ranges.findIndex((r2) => digitCursor < r2.end);
      if (idx === -1) idx = ranges.length - 1;
      if (idx > 0 && digitCursor === ranges[idx].start) idx = idx - 1;
      const r = ranges[idx];
      const tokenLen = r.end - r.start;
      const tokenDigits = currentDigits.slice(r.start, r.end);
      const isFull = tokenDigits.length >= tokenLen;
      let rel = digitCursor - r.start;
      rel = clamp(rel, 0, tokenLen);
      let newToken = tokenDigits;
      if (!isFull) {
        newToken = (tokenDigits.slice(0, rel) + digitChar + tokenDigits.slice(rel)).slice(0, tokenLen);
      } else {
        if (digitCursor >= r.end) {
          newToken = tokenDigits.slice(1) + digitChar;
        } else {
          newToken = (tokenDigits.slice(0, rel) + digitChar + tokenDigits.slice(rel + 1)).slice(0, tokenLen);
        }
      }
      const before = currentDigits.slice(0, r.start);
      const after = currentDigits.slice(r.end);
      let nextDigits = (before + newToken + after).slice(0, totalDigits);
      const monthRange = ranges.find((x) => x.kind === "month");
      const yearRange = ranges.find((x) => x.kind === "year");
      const monthRaw = monthRange ? nextDigits.slice(monthRange.start, monthRange.end) : "";
      const yearRaw = yearRange ? nextDigits.slice(yearRange.start, yearRange.end) : "";
      if (r.kind === "month" && newToken.length === 2) {
        let m = Number(newToken);
        if (!Number.isFinite(m)) m = 1;
        m = clamp(m, 1, 12);
        nextDigits = nextDigits.slice(0, r.start) + String(m).padStart(2, "0") + nextDigits.slice(r.end);
        nextDigits = nextDigits.slice(0, totalDigits);
      }
      if (r.kind === "day" && newToken.length === 2) {
        let d = Number(newToken);
        if (!Number.isFinite(d)) d = 1;
        let m = Number(monthRaw);
        if (!Number.isFinite(m) || m < 1) m = 1;
        m = clamp(m, 1, 12);
        let y = Number(yearRaw);
        if (!Number.isFinite(y) || y <= 0) y = 2e3;
        y = Math.min(y, 9999);
        const maxDay = daysInMonth(y, m);
        d = clamp(d, 1, maxDay);
        nextDigits = nextDigits.slice(0, r.start) + String(d).padStart(2, "0") + nextDigits.slice(r.end);
        nextDigits = nextDigits.slice(0, totalDigits);
      }
      if (yearRange) {
        const y = nextDigits.slice(yearRange.start, yearRange.end).slice(0, 4);
        nextDigits = nextDigits.slice(0, yearRange.start) + y + nextDigits.slice(yearRange.end);
        nextDigits = nextDigits.slice(0, totalDigits);
      }
      const masked = applyDateMaskDigitsOnly(nextDigits, format);
      const didRollAtEnd = isFull && digitCursor >= r.end;
      const nextDigitCursor = didRollAtEnd ? r.end : Math.min(totalDigits, digitCursor + 1);
      el.value = masked;
      dispatchInput();
      const nextCaret = caretPosAfterDigits(masked, nextDigitCursor);
      safeSetSelectionRange(nextCaret, nextCaret);
      return true;
    };
    const adjustDateSegmentByArrow = (key) => {
      if (type !== "date" || !fmt) return;
      const format = fmt;
      const value = el.value ?? "";
      const segments = getDateSegments(value, format);
      if (!segments.length) return;
      const caret = el.selectionStart ?? value.length;
      let idx = segments.findIndex((s) => caret >= s.start && caret <= s.end);
      if (idx === -1) {
        idx = segments.findIndex((s) => caret < s.start);
        if (idx === -1) idx = segments.length - 1;
        if (idx > 0 && caret > segments[idx - 1].end) idx = idx - 1;
      }
      if (idx < 0) idx = 0;
      let day = 1;
      let month = 1;
      let year = 2e3;
      for (const seg2 of segments) {
        const n = seg2.raw ? Number(seg2.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg2.kind === "day") day = n;
        else if (seg2.kind === "month") month = n;
        else year = n;
      }
      month = clamp(month, 1, 12);
      if (!Number.isFinite(year) || year <= 0) year = 2e3;
      year = Math.min(year, 9999);
      let maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);
      const seg = segments[idx];
      if (seg.kind === "day") {
        if (key === "ArrowUp") {
          day = day + 1;
          if (day > maxDay) day = 1;
        } else {
          day = day - 1;
          if (day < 1) day = maxDay;
        }
      } else if (seg.kind === "month") {
        if (key === "ArrowUp") {
          month = month + 1;
          if (month > 12) month = 1;
        } else {
          month = month - 1;
          if (month < 1) month = 12;
        }
      } else {
        if (key === "ArrowUp") year = year + 1;
        else year = Math.max(0, year - 1);
      }
      maxDay = daysInMonth(year > 0 ? year : 2e3, month);
      if (day > maxDay) day = maxDay;
      const newValue = formatDateFromParts(day, month, year, format);
      el.value = newValue;
      dispatchInput();
      const newSegments = getDateSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) safeSetSelectionRange(newSeg.start, newSeg.end);
    };
    const splitTimeFormat = (format) => {
      const tokens = [];
      const seps = [];
      let currentSep = "";
      let i = 0;
      const isTokenChar = (c) => c === "H" || c === "m" || c === "s";
      while (i < format.length) {
        const c = format[i];
        if (!isTokenChar(c)) {
          currentSep += c;
          i++;
          continue;
        }
        seps.push(currentSep);
        currentSep = "";
        const ch = c;
        let token = ch;
        let j = i + 1;
        while (j < format.length && format[j] === ch) {
          token += format[j];
          j++;
        }
        tokens.push(token);
        i = j;
      }
      seps.push(currentSep);
      return { tokens, seps };
    };
    const getTimeSegments = (value, format) => {
      const { tokens, seps } = splitTimeFormat(format);
      const segments = [];
      let pos = 0;
      if (seps[0]) {
        const s0 = seps[0];
        if (value.startsWith(s0)) pos += s0.length;
      }
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const kind = ch === "H" ? "hour" : ch === "m" ? "minute" : "second";
        const start = pos;
        let end = pos;
        while (end < value.length && /\d/.test(value[end])) end++;
        const raw = value.slice(start, end);
        segments.push({ kind, start, end, raw });
        pos = end;
        const sep = seps[i + 1] ?? "";
        if (sep && value.substr(pos, sep.length) === sep) {
          pos += sep.length;
        }
      }
      return segments;
    };
    const formatTimeFromParts = (hour, minute, second, format) => {
      const { tokens, seps } = splitTimeFormat(format);
      let result = seps[0] ?? "";
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;
        if (ch === "H") result += String(hour).padStart(len, "0");
        else if (ch === "m") result += String(minute).padStart(len, "0");
        else result += String(second).padStart(len, "0");
        if (i < tokens.length - 1) {
          result += seps[i + 1] ?? "";
        }
      }
      return result;
    };
    const normalizeTimeValue = (value, format) => {
      if (!value) return value;
      const segments = getTimeSegments(value, format);
      if (!segments.length) return value;
      let hour = 0;
      let minute = 0;
      let second = 0;
      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg.kind === "hour") hour = n;
        else if (seg.kind === "minute") minute = n;
        else second = n;
      }
      hour = clamp(hour, 0, 23);
      minute = clamp(minute, 0, 59);
      second = clamp(second, 0, 59);
      return formatTimeFromParts(hour, minute, second, format);
    };
    const applyTimeMaskDigitsOnly = (digits, format) => {
      const { tokens, seps } = splitTimeFormat(format);
      if (!tokens.length) return digits;
      const totalDigits = tokens.reduce((a, t) => a + t.length, 0);
      const d = digits.replace(/\D/g, "").slice(0, totalDigits);
      const firstSep = seps[1] ?? "";
      const secondSep = seps[2] ?? "";
      const hasMinutes = tokens.length >= 2 && tokens[1][0] === "m";
      const hasSeconds = tokens.length >= 3 && tokens[2][0] === "s";
      if (hasMinutes && !hasSeconds) {
        if (d.length <= 2) {
          if (d.length === 2 && firstSep) return d + firstSep;
          return d;
        }
        if (d.length <= 4) {
          const hRaw = d.slice(0, 2);
          const mRaw = d.slice(2);
          let res = hRaw;
          if (firstSep) res += firstSep;
          if (mRaw.length) res += mRaw;
          return res;
        }
        const hStr = d.slice(0, 2);
        const mStr = d.slice(2, 4);
        let hour = Number(hStr || "0");
        let minute = Number(mStr || "0");
        hour = clamp(hour, 0, 23);
        minute = clamp(minute, 0, 59);
        return formatTimeFromParts(hour, minute, 0, format);
      }
      if (hasMinutes && hasSeconds) {
        if (d.length <= 2) {
          if (d.length === 2 && firstSep) return d + firstSep;
          return d;
        }
        if (d.length <= 4) {
          const hRaw = d.slice(0, 2);
          const mRaw = d.slice(2);
          let res = hRaw;
          if (firstSep) res += firstSep;
          if (mRaw.length) {
            res += mRaw;
            if (mRaw.length === 2 && secondSep) res += secondSep;
          }
          return res;
        }
        if (d.length <= 6) {
          const hRaw = d.slice(0, 2);
          const mRaw = d.slice(2, 4);
          const sRaw = d.slice(4);
          let res = hRaw;
          if (firstSep) res += firstSep;
          res += mRaw;
          if (secondSep) res += secondSep;
          res += sRaw;
          return res;
        }
        const hStr = d.slice(0, 2);
        const mStr = d.slice(2, 4);
        const sStr = d.slice(4, 6);
        let hour = Number(hStr || "0");
        let minute = Number(mStr || "0");
        let second = Number(sStr || "0");
        hour = clamp(hour, 0, 23);
        minute = clamp(minute, 0, 59);
        second = clamp(second, 0, 59);
        return formatTimeFromParts(hour, minute, second, format);
      }
      return d;
    };
    const applyTimeMask = (raw, format) => {
      if (!raw) return "";
      const hasSeparator = /[^0-9]/.test(raw);
      const { tokens, seps } = splitTimeFormat(format);
      if (!tokens.length) return raw.replace(/\D/g, "");
      if (!hasSeparator) {
        const digits = raw.replace(/\D/g, "");
        if (!digits) return "";
        return applyTimeMaskDigitsOnly(digits, format);
      }
      const rawSegs = raw.split(/[^0-9]/);
      const rawSeps = raw.match(/[^0-9]+/g) ?? [];
      const parts = [];
      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;
        const rawSeg = (rawSegs[i] ?? "").replace(/\D/g, "").slice(0, len);
        const kind = ch === "H" ? "hour" : ch === "m" ? "minute" : "second";
        const closed = rawSeg.length >= len;
        parts.push({ kind, raw: rawSeg, len, closed, out: "" });
      }
      const hourPart = parts.find((p) => p.kind === "hour");
      const minutePart = parts.find((p) => p.kind === "minute");
      const secondPart = parts.find((p) => p.kind === "second");
      let hour = (hourPart == null ? void 0 : hourPart.raw) ? Number(hourPart.raw) : 0;
      let minute = (minutePart == null ? void 0 : minutePart.raw) ? Number(minutePart.raw) : 0;
      let second = (secondPart == null ? void 0 : secondPart.raw) ? Number(secondPart.raw) : 0;
      if (hourPart) {
        if (hourPart.closed && hourPart.raw) {
          if (hour < 0) hour = 0;
          if (hour > 23) hour = 23;
          hourPart.out = String(hour).padStart(hourPart.len, "0");
        } else {
          hourPart.out = hourPart.raw;
        }
      }
      if (minutePart) {
        if (minutePart.closed && minutePart.raw) {
          if (minute < 0) minute = 0;
          if (minute > 59) minute = 59;
          minutePart.out = String(minute).padStart(minutePart.len, "0");
        } else {
          minutePart.out = minutePart.raw;
        }
      }
      if (secondPart) {
        if (secondPart.closed && secondPart.raw) {
          if (second < 0) second = 0;
          if (second > 59) second = 59;
          secondPart.out = String(second).padStart(secondPart.len, "0");
        } else {
          secondPart.out = secondPart.raw;
        }
      }
      const outSegs = parts.map((p) => p.out);
      const hasDigitsArr = parts.map((p) => p.raw.length > 0);
      let result = seps[0] ?? "";
      for (let i = 0; i < parts.length; i++) {
        result += outSegs[i] ?? "";
        if (i < parts.length - 1) {
          const sepFmt = seps[i + 1] ?? "";
          const hadRawSep = i < rawSeps.length;
          const segClosed = parts[i].closed;
          const nextHasDigits = hasDigitsArr[i + 1];
          if (sepFmt && (hadRawSep || segClosed || nextHasDigits)) {
            result += sepFmt;
          }
        }
      }
      return result.replace(/[^0-9]+$/, (sep) => {
        const prefix = result.slice(0, -sep.length);
        return /\d/.test(prefix) ? sep : "";
      });
    };
    const normalizePastedTime = (text, format) => {
      if (!text) return "";
      const nums = text.match(/\d+/g) ?? [];
      if (!nums.length) return "";
      const digits = nums.join("");
      let hour = 0;
      let minute = 0;
      let second = 0;
      if (digits.length >= 2) hour = Number(digits.slice(0, 2));
      if (digits.length >= 4) minute = Number(digits.slice(2, 4));
      if (digits.length >= 6) second = Number(digits.slice(4, 6));
      hour = clamp(hour, 0, 23);
      minute = clamp(minute, 0, 59);
      second = clamp(second, 0, 59);
      return formatTimeFromParts(hour, minute, second, format);
    };
    const handleTimeDigitKeydown = (digitChar) => {
      if (type !== "time") return false;
      const format = fmt || "HH:mm";
      const { tokens } = splitTimeFormat(format);
      if (!tokens.length) return false;
      const lens = tokens.map((t) => t.length);
      const totalDigits = lens.reduce((a, b) => a + b, 0);
      const currentDigits = (el.value ?? "").replace(/\D/g, "").slice(0, totalDigits);
      const caret = el.selectionStart ?? (el.value ?? "").length;
      const digitCursor = countDigitsBeforePos(el.value ?? "", caret);
      const ranges = [];
      let acc = 0;
      for (const tok of tokens) {
        const kind = tok[0] === "H" ? "hour" : tok[0] === "m" ? "minute" : "second";
        const len = tok.length;
        ranges.push({ start: acc, end: acc + len, kind });
        acc += len;
      }
      let idx = ranges.findIndex((r2) => digitCursor < r2.end);
      if (idx === -1) idx = ranges.length - 1;
      if (idx > 0 && digitCursor === ranges[idx].start) idx = idx - 1;
      const r = ranges[idx];
      const tokenLen = r.end - r.start;
      const tokenDigits = currentDigits.slice(r.start, r.end);
      const isFull = tokenDigits.length >= tokenLen;
      let rel = digitCursor - r.start;
      rel = clamp(rel, 0, tokenLen);
      let newToken = tokenDigits;
      if (!isFull) {
        newToken = (tokenDigits.slice(0, rel) + digitChar + tokenDigits.slice(rel)).slice(0, tokenLen);
      } else {
        if (digitCursor >= r.end) {
          newToken = tokenDigits.slice(1) + digitChar;
        } else {
          newToken = (tokenDigits.slice(0, rel) + digitChar + tokenDigits.slice(rel + 1)).slice(0, tokenLen);
        }
      }
      const before = currentDigits.slice(0, r.start);
      const after = currentDigits.slice(r.end);
      let nextDigits = (before + newToken + after).slice(0, totalDigits);
      const read2 = (start, end) => Number(nextDigits.slice(start, end) || "0");
      const hourR = ranges.find((x) => x.kind === "hour");
      const minR = ranges.find((x) => x.kind === "minute");
      const secR = ranges.find((x) => x.kind === "second");
      if (r.kind === "hour" && newToken.length === 2 && hourR) {
        let h = read2(hourR.start, hourR.end);
        if (!Number.isFinite(h)) h = 0;
        h = clamp(h, 0, 23);
        nextDigits = nextDigits.slice(0, hourR.start) + String(h).padStart(2, "0") + nextDigits.slice(hourR.end);
      }
      if (r.kind === "minute" && newToken.length === 2 && minR) {
        let m = read2(minR.start, minR.end);
        if (!Number.isFinite(m)) m = 0;
        m = clamp(m, 0, 59);
        nextDigits = nextDigits.slice(0, minR.start) + String(m).padStart(2, "0") + nextDigits.slice(minR.end);
      }
      if (r.kind === "second" && newToken.length === 2 && secR) {
        let s = read2(secR.start, secR.end);
        if (!Number.isFinite(s)) s = 0;
        s = clamp(s, 0, 59);
        nextDigits = nextDigits.slice(0, secR.start) + String(s).padStart(2, "0") + nextDigits.slice(secR.end);
      }
      const masked = applyTimeMaskDigitsOnly(nextDigits, format);
      const didRollAtEnd = isFull && digitCursor >= r.end;
      const nextDigitCursor = didRollAtEnd ? r.end : Math.min(totalDigits, digitCursor + 1);
      el.value = masked;
      dispatchInput();
      const nextCaret = caretPosAfterDigits(masked, nextDigitCursor);
      safeSetSelectionRange(nextCaret, nextCaret);
      return true;
    };
    const adjustTimeSegmentByArrow = (key) => {
      if (type !== "time" || !fmt) return;
      const format = fmt;
      const value = el.value ?? "";
      const segments = getTimeSegments(value, format);
      if (!segments.length) return;
      const caret = el.selectionStart ?? value.length;
      let idx = segments.findIndex((s) => caret >= s.start && caret <= s.end);
      if (idx === -1) {
        idx = segments.findIndex((s) => caret < s.start);
        if (idx === -1) idx = segments.length - 1;
        if (idx > 0 && caret > segments[idx - 1].end) idx = idx - 1;
      }
      if (idx < 0) idx = 0;
      let hour = 0;
      let minute = 0;
      let second = 0;
      for (const seg2 of segments) {
        const n = seg2.raw ? Number(seg2.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg2.kind === "hour") hour = n;
        else if (seg2.kind === "minute") minute = n;
        else second = n;
      }
      const seg = segments[idx];
      if (seg.kind === "hour") {
        if (key === "ArrowUp") hour = (hour + 1) % 24;
        else hour = (hour - 1 + 24) % 24;
      } else if (seg.kind === "minute") {
        if (key === "ArrowUp") minute = (minute + 1) % 60;
        else minute = (minute - 1 + 60) % 60;
      } else {
        if (key === "ArrowUp") second = (second + 1) % 60;
        else second = (second - 1 + 60) % 60;
      }
      const newValue = formatTimeFromParts(hour, minute, second, format);
      el.value = newValue;
      dispatchInput();
      const newSegments = getTimeSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) safeSetSelectionRange(newSeg.start, newSeg.end);
    };
    const onInput = () => {
      const raw = el.value ?? "";
      let next = raw;
      if (type === "date" && fmt) {
        next = applyDateMask(raw, fmt);
      } else if (type === "time" && fmt) {
        next = applyTimeMask(raw, fmt);
      } else if (type === "integer") {
        next = applyNumericMask(raw, false);
      } else if (type === "number" || type === "currency") {
        next = applyNumericMask(raw, true);
      } else if (type === "lowercase" || type === "uppercase") {
        next = applyTextCaseMask(raw, type);
      }
      if (next !== raw) {
        setValue(next, { emit: false });
      }
    };
    const onBlur = () => {
      const raw = el.value ?? "";
      if (!raw) return;
      if (type === "date" && fmt) {
        const norm = normalizeDateValue(raw, fmt);
        if (norm !== raw) setValue(norm);
      }
      if (type === "time" && fmt) {
        const norm = normalizeTimeValue(raw, fmt);
        if (norm !== raw) setValue(norm);
      }
    };
    const onFocus = () => {
      if (!defaultAppliedRef.current && (el.value ?? "").trim() === "") {
        applyInitialDefaultIfNeeded();
      }
    };
    const onPaste = (e) => {
      var _a;
      if (el.readOnly || el.disabled) return;
      if (!mask) return;
      const text = (_a = e.clipboardData) == null ? void 0 : _a.getData("text");
      if (!text) return;
      e.preventDefault();
      let next = "";
      if (type === "date" && fmt) {
        next = normalizePastedDate(text, fmt);
      } else if (type === "time" && fmt) {
        next = normalizePastedTime(text, fmt);
      } else if (type === "integer") {
        next = text.replace(/\D/g, "");
      } else if (type === "number" || type === "currency") {
        next = applyNumericMask(text, true);
      } else {
        return;
      }
      el.value = next;
      dispatchInput();
      safeSetSelectionRange(next.length, next.length);
    };
    const onKeydown = (e) => {
      if (el.readOnly || el.disabled) return;
      if (type === "date" && fmt && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        adjustDateSegmentByArrow(e.key);
        return;
      }
      if (type === "time" && fmt && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        adjustTimeSegmentByArrow(e.key);
        return;
      }
      if (type === "date" && fmt && e.key === "Enter") {
        e.preventDefault();
        if (el.value) {
          const norm = normalizeDateValue(el.value, fmt);
          if (norm !== el.value) {
            el.value = norm;
            dispatchInput();
          }
        }
        return;
      }
      if (type === "time" && fmt && e.key === "Enter") {
        e.preventDefault();
        if (el.value) {
          const norm = normalizeTimeValue(el.value, fmt);
          if (norm !== el.value) {
            el.value = norm;
            dispatchInput();
          }
        }
        return;
      }
      if (isControlKey(e)) return;
      if (type === "lowercase" || type === "uppercase") {
        return;
      }
      if (type === "date" || type === "time") {
        const format = fmt || "";
        const allowedSeps = /* @__PURE__ */ new Set();
        for (const c of format) {
          if (!/[dMyHms]/.test(c)) {
            allowedSeps.add(c);
          }
        }
        if (/\d/.test(e.key)) {
          e.preventDefault();
          if (type === "date") {
            handleDateDigitKeydown(e.key);
          } else {
            handleTimeDigitKeydown(e.key);
          }
          return;
        }
        if (allowedSeps.has(e.key)) return;
        e.preventDefault();
        return;
      }
      if (type === "integer") {
        if (!/\d/.test(e.key)) e.preventDefault();
        return;
      }
      if (type === "number" || type === "currency") {
        if (/\d/.test(e.key)) return;
        if (e.key === "." || e.key === ",") {
          const v = el.value ?? "";
          if (v.includes(".") || v.includes(",")) {
            e.preventDefault();
          }
          return;
        }
        e.preventDefault();
      }
    };
    el.addEventListener("input", onInput);
    el.addEventListener("blur", onBlur);
    el.addEventListener("focus", onFocus);
    el.addEventListener("keydown", onKeydown);
    el.addEventListener("paste", onPaste);
    return () => {
      el.removeEventListener("input", onInput);
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("keydown", onKeydown);
      el.removeEventListener("paste", onPaste);
    };
  }, [inputRef, mask, enableDefault]);
}
function IInputAddon(props) {
  const { addon, className, ...rest } = props;
  if (!addon || addon.visible === false) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx("i-input-addon", { class: className, kind: addon.type, ...rest, children: addon.type === "button" ? /* @__PURE__ */ jsxRuntime.jsx(
    IButton,
    {
      size: "xs",
      type: "button",
      icon: addon.icon,
      variant: addon.variant ?? "primary",
      onClick: () => addon.onClick ? addon.onClick() : null
    }
  ) : addon.type === "link" ? /* @__PURE__ */ jsxRuntime.jsx(
    "a",
    {
      className: "i-btn i-btn-xs",
      target: "_blank",
      variant: addon.variant ?? "primary",
      href: addon.href,
      children: /* @__PURE__ */ jsxRuntime.jsx(IIcon, { size: "xs", icon: addon.icon })
    }
  ) : addon.type === "icon" ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { size: "sm", icon: addon.icon }) : addon.type === "loading" ? /* @__PURE__ */ jsxRuntime.jsx(ILoading, { label: "" }) : /* @__PURE__ */ jsxRuntime.jsx("span", { children: addon.text }) });
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
      autoDefault = true,
      prepend,
      append,
      value,
      className,
      onInput,
      onBlur,
      inputRef: inputRefProp,
      ...rest
    } = props;
    const inputRef = inputRefProp;
    const innerRef = React8.useRef(null);
    useInputMask(innerRef, mask, { enableDefault: autoDefault });
    const prepends = React8.useMemo(() => normalizeArray(prepend), [prepend]);
    const appends = React8.useMemo(
      () => normalizeArray(append),
      [append]
    );
    const setRefs = (node) => {
      innerRef.current = node;
      if (inputRef) {
        inputRef.current = node;
      }
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    };
    const handleHostClick = (event) => {
      if (disabled || !innerRef.current) {
        return;
      }
      const target = event.target;
      if (target && target.closest("i-input-addon")) {
        return;
      }
      innerRef.current.focus();
    };
    return /* @__PURE__ */ jsxRuntime.jsxs("i-input", { class: className, onClick: handleHostClick, children: [
      prepends.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(IInputAddon, { addon: item }, `prepend-${index}`)),
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
          onBlur,
          onInput
        }
      ),
      appends.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(IInputAddon, { addon: item }, `append-${index}`))
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
    className,
    ...hostProps
  } = props;
  const innerRef = React8.useRef(null);
  const focusInnerInput = () => {
    if (!disabled && innerRef.current) {
      innerRef.current.focus();
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("i-fc-input", { class: className, ...hostProps, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "i-fc-input__label", onClick: focusInnerInput, children: [
      label,
      " :",
      required ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-fc-input__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      IInput,
      {
        inputRef: innerRef,
        append,
        autocomplete,
        disabled,
        invalid,
        mask,
        placeholder,
        prepend,
        readonly,
        type,
        value: value ?? "",
        onBlur,
        onInput
      }
    ),
    invalid && errorMessage ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-fc-input__error", children: errorMessage }) : null
  ] });
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
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  const parts = [];
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }
    parts.push(
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "highlight-search", children: text.slice(start, end) }, `h-${i}-${start}-${end}`)
    );
    lastIndex = end;
    i += 1;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: parts });
}
function getScrollParents(el) {
  const out = [];
  if (!el) return [window];
  const overflowRe = /(auto|scroll|overlay)/;
  let node = el.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const oy = style.overflowY;
    const ox = style.overflowX;
    if (overflowRe.test(oy) || overflowRe.test(ox)) out.push(node);
    node = node.parentElement;
  }
  out.push(window);
  return out;
}
var ISelect = React8.forwardRef(function ISelectInner(props, ref) {
  const {
    placeholder = "",
    disabled = false,
    invalid = false,
    filterDelay = 200,
    filterMinLength = 0,
    panelPosition = "bottom left",
    portalToBody = true,
    panelOffset = 6,
    matchTriggerWidth = false,
    options = null,
    options$ = null,
    displayWith,
    filterPredicate = defaultFilterPredicate,
    renderOption,
    iSelectOption,
    value,
    defaultValue = null,
    onChange,
    onChanged,
    onOptionSelected,
    className,
    ...hostProps
  } = props;
  const optionRenderer = renderOption ?? iSelectOption;
  const hostRef = React8.useRef(null);
  const inputRef = React8.useRef(null);
  const panelRef = React8.useRef(null);
  const rafRef = React8.useRef(0);
  const scrollParentsRef = React8.useRef([]);
  const listeningScrollParentsRef = React8.useRef(false);
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
  const [panelHidden, setPanelHidden] = React8.useState(false);
  const wantsOpenRef = React8.useRef(false);
  const openSeqRef = React8.useRef(0);
  const unhideTimerRef = React8.useRef(null);
  const filterInput$ = React8.useMemo(() => new rxjs.Subject(), []);
  const filterSubRef = React8.useRef(null);
  const optionsSubRef = React8.useRef(null);
  React8.useEffect(() => {
    return () => {
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
    };
  }, []);
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
    if (!displayWithIsExplicit && (row === null || typeof row !== "object")) {
      const primitive = row;
      const match = rawOptions.find((opt) => {
        if (opt === null || typeof opt !== "object") return false;
        const entries = Object.entries(opt);
        if (!entries.length) return false;
        const valueEntry = entries[0];
        return (valueEntry == null ? void 0 : valueEntry[1]) === primitive;
      });
      if (match) {
        const entries = Object.entries(match);
        if (!entries.length) return String(primitive);
        const labelEntry = entries[1] ?? entries[0];
        const labelValue = labelEntry == null ? void 0 : labelEntry[1];
        return labelValue === null || labelValue === void 0 ? String(primitive) : String(labelValue);
      }
    }
    return String(row);
  };
  const focus = React8.useCallback(() => {
    var _a, _b;
    if (disabled) return;
    (_b = (_a = inputRef.current) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
  }, [disabled]);
  React8.useImperativeHandle(
    ref,
    () => ({
      focus
    }),
    [focus]
  );
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
  const panelPositionClass2 = React8.useMemo(
    () => normalizePanelClass(panelPosition),
    [panelPosition]
  );
  const effectiveFilterText = filterText && filterText.trim().length >= filterMinLength ? filterText : "";
  const hasNoResults = isOpen && !!effectiveFilterText && filteredOptions.length === 0;
  const hasOptionsList = isOpen && filteredOptions.length > 0;
  const applyFilter = (force, nextFilterText) => {
    const term = (nextFilterText ?? filterText ?? "").toLowerCase().trim();
    if (term && term.length < filterMinLength) {
      setFilteredOptions([...rawOptions]);
      setHighlightIndex(-1);
      return;
    }
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
  React8.useEffect(() => {
    if (!isOpen) {
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText("");
      setHighlightIndex(-1);
      setFilteredOptions(rawOptions);
      return;
    }
    setDisplayText(resolveDisplayText(modelValue));
    applyFilter(true, filterText);
  }, [modelValue, rawOptions]);
  const getAnchorEl = () => {
    const host = hostRef.current;
    if (!host) return null;
    const iInput = host.querySelector("i-input");
    return iInput ?? host;
  };
  const getAnchorRect = () => {
    var _a;
    const el = getAnchorEl();
    const rect = ((_a = el == null ? void 0 : el.getBoundingClientRect) == null ? void 0 : _a.call(el)) ?? null;
    if (!rect) return null;
    const viewportWidth = window.innerWidth;
    const safeLeft = Math.max(0, rect.left);
    const safeRight = Math.min(viewportWidth, rect.right);
    const safeWidth = Math.max(1, safeRight - safeLeft);
    return {
      bottom: rect.bottom,
      height: rect.height,
      left: safeLeft,
      right: safeLeft + safeWidth,
      top: rect.top,
      width: safeWidth,
      x: safeLeft,
      y: rect.y,
      toJSON: () => ({})
    };
  };
  const repositionPanelNow = () => {
    if (!wantsOpenRef.current) return;
    const panel = panelRef.current;
    const rect = getAnchorRect();
    if (!panel || !rect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 8;
    const availableWidth = Math.max(1, vw - gap * 2);
    const pos = (panelPosition || "bottom left").trim().toLowerCase();
    panel.style.position = "fixed";
    panel.style.zIndex = "2000";
    panel.style.boxSizing = "border-box";
    panel.style.overflowX = "clip";
    panel.style.overflowY = "auto";
    panel.style.maxWidth = `${Math.floor(availableWidth)}px`;
    const triggerWidth = Math.min(
      Math.max(1, Math.round(rect.width)),
      availableWidth
    );
    if (matchTriggerWidth) {
      panel.style.width = `${triggerWidth}px`;
      panel.style.minWidth = `${triggerWidth}px`;
    } else {
      const computedMinWidth = Number.parseFloat(
        window.getComputedStyle(panel).minWidth
      );
      const minWidth = Number.isFinite(computedMinWidth) ? Math.min(computedMinWidth, availableWidth) : 0;
      const panelMinWidth = Math.max(triggerWidth, minWidth);
      panel.style.width = "max-content";
      panel.style.minWidth = `${Math.floor(panelMinWidth)}px`;
    }
    const panelRect = panel.getBoundingClientRect();
    const panelWidth = Math.min(
      Math.max(1, panelRect.width),
      availableWidth
    );
    const wantTop = pos.startsWith("top");
    const wantBottom = pos.startsWith("bottom") || !pos.startsWith("top") && !pos.startsWith("left") && !pos.startsWith("right");
    const wantLeft = pos.includes("left") || pos === "left";
    const wantRight = pos.includes("right") || pos === "right";
    const alignRight = wantRight && !wantLeft;
    let left = alignRight ? rect.right - panelWidth : rect.left;
    const maxLeft = Math.max(gap, vw - panelWidth - gap);
    left = Math.min(Math.max(gap, left), maxLeft);
    if (pos === "left") {
      left = rect.left - panelWidth - panelOffset;
      left = Math.min(Math.max(gap, left), maxLeft);
      const panelHeight = Math.min(
        panelRect.height,
        Math.max(60, vh - gap * 2)
      );
      const top2 = Math.min(
        Math.max(gap, rect.top),
        Math.max(gap, vh - panelHeight - gap)
      );
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top2)}px`;
      const maxH2 = Math.max(60, vh - top2 - gap);
      panel.style.maxHeight = `${Math.floor(maxH2)}px`;
      return;
    }
    if (pos === "right") {
      left = rect.right + panelOffset;
      left = Math.min(Math.max(gap, left), maxLeft);
      const panelHeight = Math.min(
        panelRect.height,
        Math.max(60, vh - gap * 2)
      );
      const top2 = Math.min(
        Math.max(gap, rect.top),
        Math.max(gap, vh - panelHeight - gap)
      );
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top2)}px`;
      const maxH2 = Math.max(60, vh - top2 - gap);
      panel.style.maxHeight = `${Math.floor(maxH2)}px`;
      return;
    }
    const spaceBelow = vh - rect.bottom - panelOffset - gap;
    const spaceAbove = rect.top - panelOffset - gap;
    let side = wantTop && !wantBottom ? "top" : "bottom";
    if (side === "bottom" && panelRect.height > spaceBelow && spaceAbove > spaceBelow) {
      side = "top";
    } else if (side === "top" && panelRect.height > spaceAbove && spaceBelow > spaceAbove) {
      side = "bottom";
    }
    const maxH = Math.max(60, side === "bottom" ? spaceBelow : spaceAbove);
    panel.style.maxHeight = `${Math.floor(maxH)}px`;
    const effectiveH = Math.min(panelRect.height, maxH);
    let top = side === "bottom" ? rect.bottom + panelOffset : rect.top - effectiveH - panelOffset;
    const maxTop = Math.max(gap, vh - effectiveH - gap);
    top = Math.min(Math.max(gap, top), maxTop);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    const rect2 = panel.getBoundingClientRect();
    if (rect2.height !== effectiveH) {
      const eff2 = Math.min(rect2.height, maxH);
      let top2 = side === "bottom" ? rect.bottom + panelOffset : rect.top - eff2 - panelOffset;
      const maxTop2 = Math.max(gap, vh - eff2 - gap);
      top2 = Math.min(Math.max(gap, top2), maxTop2);
      panel.style.top = `${Math.round(top2)}px`;
    }
  };
  const scheduleReposition = (after, doubleRaf = false) => {
    if (!wantsOpenRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      repositionPanelNow();
      if (doubleRaf) {
        requestAnimationFrame(() => {
          repositionPanelNow();
          after == null ? void 0 : after();
        });
      } else {
        after == null ? void 0 : after();
      }
    });
  };
  const addScrollParentListeners = () => {
    if (listeningScrollParentsRef.current) return;
    const anchor = getAnchorEl();
    scrollParentsRef.current = getScrollParents(anchor);
    const onAnyScroll = () => scheduleReposition();
    const onResize = () => scheduleReposition();
    for (const p of scrollParentsRef.current) {
      if (p === window) {
        window.addEventListener("scroll", onAnyScroll, {
          passive: true,
          capture: true
        });
      } else {
        p.addEventListener("scroll", onAnyScroll, { passive: true });
      }
    }
    window.addEventListener("resize", onResize, { passive: true });
    addScrollParentListeners._rm = () => {
      for (const p of scrollParentsRef.current) {
        if (p === window) {
          window.removeEventListener("scroll", onAnyScroll, true);
        } else {
          p.removeEventListener("scroll", onAnyScroll);
        }
      }
      window.removeEventListener("resize", onResize);
      scrollParentsRef.current = [];
    };
    listeningScrollParentsRef.current = true;
  };
  const removeScrollParentListeners = () => {
    if (!listeningScrollParentsRef.current) return;
    const rm = addScrollParentListeners._rm;
    if (rm) rm();
    delete addScrollParentListeners._rm;
    listeningScrollParentsRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  };
  React8.useLayoutEffect(() => {
    if (!isOpen) {
      wantsOpenRef.current = false;
      setPanelHidden(false);
      removeScrollParentListeners();
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
      return;
    }
    wantsOpenRef.current = true;
    if (!hasOptionsList) {
      setPanelHidden(false);
      return;
    }
    const seq = ++openSeqRef.current;
    setPanelHidden(true);
    addScrollParentListeners();
    scheduleReposition(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    }, true);
    if (unhideTimerRef.current) window.clearTimeout(unhideTimerRef.current);
    unhideTimerRef.current = window.setTimeout(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    }, 0);
  }, [isOpen, hasOptionsList]);
  React8.useLayoutEffect(() => {
    if (!isOpen) return;
    if (!hasOptionsList) return;
    scheduleReposition();
  }, [
    isOpen,
    panelPosition,
    matchTriggerWidth,
    panelOffset,
    filteredOptions.length
  ]);
  React8.useEffect(() => {
    return () => {
      removeScrollParentListeners();
    };
  }, []);
  const scrollHighlightedIntoView = () => {
    setTimeout(() => {
      var _a;
      if (!isOpen) return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll(".i-option");
      const el = items[highlightIndex];
      (_a = el == null ? void 0 : el.scrollIntoView) == null ? void 0 : _a.call(el, { block: "nearest" });
    });
  };
  const openDropdown = (nextFilterText) => {
    if (disabled) return;
    if (isOpen) return;
    setIsOpen(true);
    const term = (nextFilterText ?? filterText).toLowerCase().trim();
    const effectiveTerm = term && term.length < filterMinLength ? "" : term;
    const next = !effectiveTerm ? [...rawOptions] : rawOptions.filter((row) => {
      try {
        return filterPredicate(row, effectiveTerm);
      } catch {
        return false;
      }
    });
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
    setPanelHidden(false);
    if (unhideTimerRef.current) {
      window.clearTimeout(unhideTimerRef.current);
      unhideTimerRef.current = null;
    }
    removeScrollParentListeners();
    const panel = panelRef.current;
    if (panel) {
      panel.style.position = "";
      panel.style.zIndex = "";
      panel.style.left = "";
      panel.style.top = "";
      panel.style.width = "";
      panel.style.minWidth = "";
      panel.style.maxWidth = "";
      panel.style.maxHeight = "";
      panel.style.overflowX = "";
      panel.style.overflowY = "";
      panel.style.boxSizing = "";
      panel.classList.remove("i-options--portaled");
    }
  };
  const handleInputText = (val) => {
    setDisplayText(val);
    setFilterText(val);
    if (!isOpen) {
      openDropdown(val);
    } else {
      applyFilter(true, val);
      scheduleReposition();
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
      scheduleReposition();
    } else {
      setDisplayText(resolveDisplayText(modelValue));
      closeDropdown();
    }
    window.setTimeout(() => focus());
  };
  const emitChange = (row) => {
    const label = resolveDisplayText(row);
    const payload = { value: row, label };
    onChange == null ? void 0 : onChange(payload);
    onChanged == null ? void 0 : onChanged(payload);
    onOptionSelected == null ? void 0 : onOptionSelected(payload);
  };
  const selectRow = (row, event) => {
    event == null ? void 0 : event.preventDefault();
    event == null ? void 0 : event.stopPropagation();
    if (disabled) return;
    if (!isControlled) setModelValue(row);
    const label = resolveDisplayText(row);
    setDisplayText(label);
    setFilterText("");
    applyFilter(true, "");
    emitChange(row);
    closeDropdown();
  };
  const isRowSelected = (row) => modelValue === row;
  const setActiveIndex = (idx) => {
    if (idx < 0 || idx >= filteredOptions.length) setHighlightIndex(-1);
    else setHighlightIndex(idx);
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
          closeDropdown();
        }
        break;
    }
  };
  React8.useEffect(() => {
    const onDocClick = (e) => {
      if (!isOpen) return;
      const target = e.target;
      if (!target) return;
      const host = hostRef.current;
      const panel = panelRef.current;
      const insideHost = !!host && host.contains(target);
      const insidePanel = !!panel && panel.contains(target);
      if (!insideHost && !insidePanel) {
        closeDropdown();
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isOpen]);
  const appendAddon = React8.useMemo(() => {
    if (isLoading) return { type: "loading", visible: true };
    return {
      type: "button",
      icon: isOpen ? "angle-up" : "angle-down",
      visible: true,
      variant: "primary",
      onClick: () => toggleDropdown()
    };
  }, [isLoading, isOpen]);
  const optionsNode = hasOptionsList ? /* @__PURE__ */ jsxRuntime.jsx(
    "i-options",
    {
      ref: (el) => {
        panelRef.current = el;
        if (panelRef.current) {
          if (portalToBody)
            panelRef.current.classList.add("i-options--portaled");
          else panelRef.current.classList.remove("i-options--portaled");
        }
      },
      class: `i-options scroll scroll-y ${panelPositionClass2}${portalToBody ? " i-options--portaled" : ""}`,
      style: {
        visibility: panelHidden ? "hidden" : "visible",
        pointerEvents: panelHidden ? "none" : "auto"
      },
      children: filteredOptions.map((row, idx) => /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: [
            "i-option",
            highlightIndex === idx ? "active" : null,
            isRowSelected(row) ? "selected" : null
          ].filter(Boolean).join(" "),
          onMouseEnter: () => setActiveIndex(idx),
          onMouseDown: (event) => selectRow(row, event),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-option-label", children: optionRenderer ? optionRenderer(row) : highlightParts(resolveDisplayText(row), effectiveFilterText) }),
            isRowSelected(row) ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-option-check", children: /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "check" }) }) : null
          ]
        },
        (row == null ? void 0 : row.id) ?? `${idx}-${String(row)}`
      ))
    }
  ) : null;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-select",
    {
      ...hostProps,
      class: className,
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
        portalToBody ? optionsNode ? reactDom.createPortal(optionsNode, document.body) : null : optionsNode
      ]
    }
  );
});
var IFCSelect = React8.forwardRef(function IFCSelectInner(props, ref) {
  const {
    label = "",
    placeholder = "",
    options = null,
    options$ = null,
    displayWith,
    filterDelay = 200,
    filterMinLength = 0,
    filterPredicate,
    panelPosition = "bottom left",
    errors = null,
    errorMessage,
    submitted,
    touched,
    dirty,
    disabled = false,
    value,
    defaultValue = null,
    onChange,
    onChanged,
    onOptionSelected,
    renderOption,
    iSelectOption,
    portalToBody = true,
    panelOffset = 6,
    matchTriggerWidth = false,
    invalid = false,
    className,
    ...hostProps
  } = props;
  const innerSelectRef = React8.useRef(null);
  const focusInnerSelect = React8.useCallback(() => {
    var _a;
    if (!disabled) (_a = innerSelectRef.current) == null ? void 0 : _a.focus();
  }, [disabled]);
  React8.useImperativeHandle(
    ref,
    () => ({
      focus: focusInnerSelect
    }),
    [focusInnerSelect]
  );
  const controlInvalid = React8.useMemo(() => {
    const hasErr = !!errors && Object.keys(errors).length > 0;
    if (!hasErr) return false;
    if (submitted !== void 0) return !!submitted;
    return !!touched || !!dirty;
  }, [errors, submitted, touched, dirty]);
  const required = React8.useMemo(
    () => isControlRequired({ errors: errors ?? void 0, errorMessage }),
    [errors, errorMessage]
  );
  const resolvedErrorText = React8.useMemo(
    () => resolveControlErrorMessage({
      errors: errors ?? void 0,
      label,
      errorMessage
    }),
    [errors, label, errorMessage]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("i-fc-select", { ...hostProps, class: className, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "i-fc-select__label", onClick: focusInnerSelect, children: [
      label,
      " :",
      required ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-fc-select__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
      ISelect,
      {
        ref: (api) => {
          innerSelectRef.current = api ?? null;
        },
        disabled,
        invalid: invalid || controlInvalid,
        placeholder,
        options,
        options$,
        displayWith,
        filterDelay,
        filterMinLength,
        filterPredicate,
        panelPosition,
        portalToBody,
        panelOffset,
        matchTriggerWidth,
        renderOption,
        iSelectOption,
        value,
        defaultValue: defaultValue ?? void 0,
        onChange,
        onChanged,
        onOptionSelected
      }
    ),
    controlInvalid && resolvedErrorText ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-fc-select__error", children: resolvedErrorText }) : null
  ] });
});
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
function dateKey(d) {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return null;
  }
  return startOfDay(d);
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
  if (typeof value === "string" && value.trim())
    return parseInputDate(value.trim(), format);
  return null;
}
function panelPositionClass(pos) {
  const value = (pos || "bottom left").trim();
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
      const d = new Date(current);
      const inCurrentMonth = d.getMonth() === viewMonth;
      row.push({
        date: d,
        inCurrentMonth,
        isToday: isSameDate(d, today),
        isSelected: selectedDay ? isSameDate(d, selectedDay) : false
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}
function getScrollParents2(el) {
  const out = [];
  if (!el) return [window];
  const overflowRe = /(auto|scroll|overlay)/;
  let node = el.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const oy = style.overflowY;
    const ox = style.overflowX;
    if (overflowRe.test(oy) || overflowRe.test(ox)) out.push(node);
    node = node.parentElement;
  }
  out.push(window);
  return out;
}
function IDatepicker(props) {
  const {
    placeholder = "",
    disabled = false,
    invalid = false,
    format = "dd/MM/yyyy",
    panelPosition = "bottom left",
    portalToBody = true,
    matchTriggerWidth = true,
    panelOffset = 6,
    value = null,
    onChanged = noop,
    className,
    ...rest
  } = props;
  const hostRef = React8.useRef(null);
  const panelRef = React8.useRef(null);
  const inputElRef = React8.useRef(null);
  const rafRef = React8.useRef(0);
  const scrollParentsRef = React8.useRef([]);
  const listeningScrollParentsRef = React8.useRef(false);
  const [modelValue, setModelValue] = React8.useState(null);
  const [displayText, setDisplayText] = React8.useState("");
  const [isOpen, setIsOpen] = React8.useState(false);
  const [viewYear, setViewYear] = React8.useState(0);
  const [viewMonth, setViewMonth] = React8.useState(0);
  const [years, setYears] = React8.useState([]);
  const [panelHidden, setPanelHidden] = React8.useState(false);
  const wantsOpenRef = React8.useRef(false);
  const openSeqRef = React8.useRef(0);
  const unhideTimerRef = React8.useRef(null);
  const isEditingRef = React8.useRef(false);
  const lastEmittedKeyRef = React8.useRef(null);
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
  React8.useEffect(() => {
    return () => {
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
    };
  }, []);
  const refreshInnerInputRef = React8.useCallback(() => {
    var _a;
    const host = hostRef.current;
    const el = (_a = host == null ? void 0 : host.querySelector) == null ? void 0 : _a.call(
      host,
      "i-input input"
    );
    if (el) inputElRef.current = el;
  }, []);
  const getPanelEl = () => panelRef.current;
  const getAnchorEl = React8.useCallback(() => {
    const host = hostRef.current;
    if (!host) return null;
    const iInput = host.querySelector("i-input");
    return iInput ?? host;
  }, []);
  React8.useEffect(() => {
    const next = normalizeToDate(value, format);
    const nextKey = dateKey(next);
    if (isEditingRef.current && nextKey === lastEmittedKeyRef.current) {
      setModelValue(next);
      return;
    }
    setModelValue(next);
    setDisplayText(next ? formatDateLocal(next, format) : "");
    const base = next ?? startOfDay(/* @__PURE__ */ new Date());
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYears((prev) => ensureYearRange(base.getFullYear(), prev));
  }, [value, format]);
  React8.useEffect(() => {
    if (!viewYear) return;
    setYears((p) => ensureYearRange(viewYear, p));
  }, [viewYear]);
  const syncFromInnerInputSafely = React8.useCallback(() => {
    refreshInnerInputRef();
    const input = inputElRef.current;
    if (!input) return;
    const raw = (input.value ?? "").trim();
    if (!raw) return;
    const parsed = parseInputDate(raw, format);
    if (!parsed) return;
    setModelValue(parsed);
    setDisplayText(formatDateLocal(parsed, format));
  }, [format, refreshInnerInputRef]);
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
  const repositionPanelNow = React8.useCallback(() => {
    var _a;
    if (!wantsOpenRef.current) return;
    const panel = getPanelEl();
    const anchor = getAnchorEl();
    const rect = ((_a = anchor == null ? void 0 : anchor.getBoundingClientRect) == null ? void 0 : _a.call(anchor)) ?? null;
    if (!panel || !rect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 8;
    const pos = (panelPosition || "bottom left").trim().toLowerCase();
    panel.style.position = "fixed";
    panel.style.zIndex = "2000";
    panel.style.boxSizing = "border-box";
    panel.style.overflowY = "auto";
    if (matchTriggerWidth) {
      panel.style.width = `${Math.round(rect.width)}px`;
    } else {
      panel.style.width = "";
    }
    let panelRect = panel.getBoundingClientRect();
    const wantTop = pos.startsWith("top");
    const wantBottom = pos.startsWith("bottom") || !pos.startsWith("top") && !pos.startsWith("left") && !pos.startsWith("right");
    const wantLeft = pos.includes("left") || pos === "left";
    const wantRight = pos.includes("right") || pos === "right";
    const alignRight = wantRight && !wantLeft;
    let left = alignRight ? rect.right - panelRect.width : rect.left;
    const maxLeft = Math.max(gap, vw - panelRect.width - gap);
    left = Math.min(Math.max(gap, left), maxLeft);
    if (pos === "left") {
      left = rect.left - panelRect.width - panelOffset;
      left = Math.min(Math.max(gap, left), maxLeft);
      const top2 = Math.min(
        Math.max(gap, rect.top),
        Math.max(gap, vh - panelRect.height - gap)
      );
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top2)}px`;
      const maxH2 = Math.max(120, vh - top2 - gap);
      panel.style.maxHeight = `${Math.floor(maxH2)}px`;
      return;
    }
    if (pos === "right") {
      left = rect.right + panelOffset;
      left = Math.min(Math.max(gap, left), maxLeft);
      const top2 = Math.min(
        Math.max(gap, rect.top),
        Math.max(gap, vh - panelRect.height - gap)
      );
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top2)}px`;
      const maxH2 = Math.max(120, vh - top2 - gap);
      panel.style.maxHeight = `${Math.floor(maxH2)}px`;
      return;
    }
    const spaceBelow = vh - rect.bottom - panelOffset - gap;
    const spaceAbove = rect.top - panelOffset - gap;
    let side = wantTop && !wantBottom ? "top" : "bottom";
    if (side === "bottom" && panelRect.height > spaceBelow && spaceAbove > spaceBelow) {
      side = "top";
    } else if (side === "top" && panelRect.height > spaceAbove && spaceBelow > spaceAbove) {
      side = "bottom";
    }
    const maxH = Math.max(120, side === "bottom" ? spaceBelow : spaceAbove);
    panel.style.maxHeight = `${Math.floor(maxH)}px`;
    const effectiveH = Math.min(panelRect.height, maxH);
    let top = side === "bottom" ? rect.bottom + panelOffset : rect.top - effectiveH - panelOffset;
    const maxTop = Math.max(gap, vh - effectiveH - gap);
    top = Math.min(Math.max(gap, top), maxTop);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panelRect = panel.getBoundingClientRect();
    if (panelRect.height !== effectiveH) {
      const eff2 = Math.min(panelRect.height, maxH);
      const maxTop2 = Math.max(gap, vh - eff2 - gap);
      let top2 = side === "bottom" ? rect.bottom + panelOffset : rect.top - eff2 - panelOffset;
      top2 = Math.min(Math.max(gap, top2), maxTop2);
      panel.style.top = `${Math.round(top2)}px`;
    }
  }, [getAnchorEl, matchTriggerWidth, panelOffset, panelPosition]);
  const scheduleReposition = React8.useCallback(
    (after, doubleRaf = false) => {
      if (!wantsOpenRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        repositionPanelNow();
        if (doubleRaf) {
          requestAnimationFrame(() => {
            repositionPanelNow();
            after == null ? void 0 : after();
          });
        } else {
          after == null ? void 0 : after();
        }
      });
    },
    [repositionPanelNow]
  );
  const addScrollParentListeners = React8.useCallback(() => {
    if (listeningScrollParentsRef.current) return;
    const anchor = getAnchorEl();
    scrollParentsRef.current = getScrollParents2(anchor);
    const onAnyScroll = () => scheduleReposition();
    const onResize = () => scheduleReposition();
    for (const p of scrollParentsRef.current) {
      if (p === window) {
        window.addEventListener("scroll", onAnyScroll, {
          passive: true,
          capture: true
        });
      } else {
        p.addEventListener("scroll", onAnyScroll, { passive: true });
      }
    }
    window.addEventListener("resize", onResize, { passive: true });
    addScrollParentListeners._rm = () => {
      for (const p of scrollParentsRef.current) {
        if (p === window) {
          window.removeEventListener("scroll", onAnyScroll, true);
        } else {
          p.removeEventListener("scroll", onAnyScroll);
        }
      }
      window.removeEventListener("resize", onResize);
      scrollParentsRef.current = [];
    };
    listeningScrollParentsRef.current = true;
  }, [getAnchorEl, scheduleReposition]);
  const removeScrollParentListeners = React8.useCallback(() => {
    if (!listeningScrollParentsRef.current) return;
    const rm = addScrollParentListeners._rm;
    if (rm) rm();
    delete addScrollParentListeners._rm;
    listeningScrollParentsRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, [addScrollParentListeners]);
  const openPanel = React8.useCallback(() => {
    if (disabled) return;
    if (isOpen) return;
    setIsOpen(true);
  }, [disabled, isOpen]);
  const closePanel = React8.useCallback(
    (skipCleanupStyles = false) => {
      wantsOpenRef.current = false;
      setIsOpen(false);
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
      removeScrollParentListeners();
      const panel = getPanelEl();
      if (panel && !skipCleanupStyles) {
        panel.style.position = "";
        panel.style.zIndex = "";
        panel.style.left = "";
        panel.style.top = "";
        panel.style.width = "";
        panel.style.maxHeight = "";
        panel.style.overflowY = "";
        panel.style.boxSizing = "";
        panel.style.visibility = "";
        panel.style.pointerEvents = "";
        panel.classList.remove("i-datepicker-panel--portaled");
      }
      setPanelHidden(false);
    },
    [removeScrollParentListeners]
  );
  React8.useLayoutEffect(() => {
    if (!isOpen) return;
    wantsOpenRef.current = true;
    const seq = ++openSeqRef.current;
    refreshInnerInputRef();
    setPanelHidden(true);
    const panel = getPanelEl();
    if (panel && portalToBody)
      panel.classList.add("i-datepicker-panel--portaled");
    addScrollParentListeners();
    scheduleReposition(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    }, true);
    if (unhideTimerRef.current) window.clearTimeout(unhideTimerRef.current);
    unhideTimerRef.current = window.setTimeout(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    }, 0);
    return () => {
      wantsOpenRef.current = false;
    };
  }, [
    addScrollParentListeners,
    isOpen,
    portalToBody,
    refreshInnerInputRef,
    scheduleReposition
  ]);
  React8.useLayoutEffect(() => {
    if (!isOpen) return;
    scheduleReposition();
  }, [
    isOpen,
    scheduleReposition,
    viewMonth,
    viewYear,
    panelPosition,
    matchTriggerWidth,
    panelOffset
  ]);
  const appendAddon = React8.useMemo(
    () => ({
      type: "button",
      icon: "calendar",
      visible: true,
      variant: "primary",
      onClick: () => {
        var _a, _b;
        if (disabled) return;
        if (!isOpen) {
          syncFromInnerInputSafely();
          initViewFromModel();
          openPanel();
        } else {
          closePanel();
        }
        refreshInnerInputRef();
        (_b = (_a = inputElRef.current) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
      }
    }),
    [
      closePanel,
      disabled,
      initViewFromModel,
      isOpen,
      openPanel,
      refreshInnerInputRef,
      syncFromInnerInputSafely
    ]
  );
  const handleInput = React8.useCallback(
    (raw) => {
      setDisplayText(raw);
      const trimmed = raw.trim();
      const parsed = trimmed ? parseInputDate(trimmed, format) : null;
      setModelValue(parsed);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
        setYears((p) => ensureYearRange(parsed.getFullYear(), p));
      }
      lastEmittedKeyRef.current = parsed ? dateKey(parsed) : null;
      onChanged(parsed);
      if (isOpen) scheduleReposition();
    },
    [format, isOpen, onChanged, scheduleReposition]
  );
  const selectDay = React8.useCallback(
    (day) => {
      if (disabled) return;
      const selected = startOfDay(day.date);
      setModelValue(selected);
      setDisplayText(formatDateLocal(selected, format));
      lastEmittedKeyRef.current = dateKey(selected);
      onChanged(selected);
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setYears((p) => ensureYearRange(selected.getFullYear(), p));
      closePanel();
    },
    [closePanel, disabled, format, onChanged]
  );
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
  const onMonthChange = React8.useCallback(
    (change) => {
      const row = change == null ? void 0 : change.value;
      if (!row) return;
      const month = typeof row === "object" && row && "value" in row ? row.value : row;
      if (typeof month !== "number" || month < 0 || month > 11) return;
      setViewMonth(month);
      if (wantsOpenRef.current) scheduleReposition();
    },
    [scheduleReposition]
  );
  const onYearChange = React8.useCallback(
    (change) => {
      const year = change.value;
      if (typeof year !== "number") return;
      setViewYear(year);
      setYears((p) => ensureYearRange(year, p));
      if (wantsOpenRef.current) scheduleReposition();
    },
    [scheduleReposition]
  );
  const onHostInputCapture = (event) => {
    const target = event.target;
    const dateInput = inputElRef.current;
    if (!dateInput) return;
    if (target !== dateInput) return;
    handleInput(dateInput.value ?? "");
  };
  React8.useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (event) => {
      if (!wantsOpenRef.current) return;
      const target = event.target;
      if (!target) return;
      const host = hostRef.current;
      const panel = panelRef.current;
      const insideHost = !!host && host.contains(target);
      const insidePanel = !!panel && panel.contains(target);
      if (insideHost || insidePanel) return;
      const active = document.activeElement;
      const activeInsidePanel = !!panel && !!active && panel.contains(active);
      const clickedInAnySelectOptions = !!target.closest("i-options") || !!target.closest(".i-options");
      if (activeInsidePanel && clickedInAnySelectOptions) return;
      closePanel();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [closePanel, isOpen]);
  React8.useEffect(() => {
    return () => {
      closePanel(true);
    };
  }, [closePanel]);
  const panelNode = /* @__PURE__ */ jsxRuntime.jsxs(
    "i-datepicker-panel",
    {
      ref: (el) => {
        panelRef.current = el;
      },
      class: [
        "i-datepicker-panel",
        panelPositionClass(panelPosition),
        portalToBody && isOpen ? "i-datepicker-panel--portaled" : null
      ].filter(Boolean).join(" "),
      style: {
        display: isOpen ? "" : "none",
        visibility: panelHidden ? "hidden" : "visible",
        pointerEvents: panelHidden ? "none" : "auto"
      },
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
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-datepicker",
    {
      ref: (el) => {
        hostRef.current = el;
        refreshInnerInputRef();
      },
      class: [
        className,
        disabled ? "i-datepicker--disabled" : null
      ].filter(Boolean).join(" "),
      onInput: onHostInputCapture,
      ...rest,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          IInput,
          {
            append: appendAddon,
            autoDefault: false,
            mask: dateMask,
            invalid,
            placeholder,
            readonly: disabled,
            value: displayText,
            onFocus: () => {
              isEditingRef.current = true;
            },
            onBlur: () => {
              isEditingRef.current = false;
            },
            onInput: () => {
            }
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { style: { display: "none" } }),
        portalToBody && isOpen ? reactDom.createPortal(panelNode, document.body) : panelNode
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
    portalToBody = true,
    matchTriggerWidth = true,
    panelOffset = 6,
    value = null,
    onChange: onChanged = noop,
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
    var _a, _b, _c;
    if (disabled) return;
    const input = (_b = (_a = hostRef.current) == null ? void 0 : _a.querySelector) == null ? void 0 : _b.call(
      _a,
      "i-datepicker i-input input"
    );
    (_c = input == null ? void 0 : input.focus) == null ? void 0 : _c.call(input);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-fc-datepicker",
    {
      ref: (el) => {
        hostRef.current = el;
      },
      class: className,
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
            onChanged,
            portalToBody,
            matchTriggerWidth,
            panelOffset
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
    className,
    ...rest
  } = props;
  const textareaRef = React8.useRef(null);
  const handleHostClick = React8.useCallback(() => {
    var _a;
    if (!disabled) {
      (_a = textareaRef.current) == null ? void 0 : _a.focus();
    }
  }, [disabled]);
  return /* @__PURE__ */ jsxRuntime.jsx("i-textarea", { class: className, onClick: handleHostClick, children: /* @__PURE__ */ jsxRuntime.jsx(
    "textarea",
    {
      ...rest,
      ref: textareaRef,
      "aria-invalid": invalid ? "true" : void 0,
      disabled,
      readOnly: readonly,
      rows,
      placeholder,
      value: value ?? "",
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
  const hostRef = React8.useRef(null);
  const focusInnerTextarea = React8.useCallback(() => {
    if (disabled) return;
    const host = hostRef.current;
    if (!host) return;
    const textarea = host.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
    }
  }, [disabled]);
  return /* @__PURE__ */ jsxRuntime.jsxs("i-fc-textarea", { ...hostProps, ref: hostRef, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsxs("label", { className: "i-fc-textarea__label", onClick: focusInnerTextarea, children: [
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
var IDialogContext = React8.createContext(null);
var IDialogInstanceContext = React8.createContext(null);
function useIDialog() {
  const ctx = React8.useContext(IDialogContext);
  if (!ctx)
    throw new Error("useIDialog() must be used inside <IDialogProvider>.");
  return ctx;
}
function useIDialogData() {
  const ctx = React8.useContext(IDialogInstanceContext);
  return (ctx == null ? void 0 : ctx.data) ?? void 0;
}
function useIDialogRef() {
  const ctx = React8.useContext(IDialogInstanceContext);
  if (!(ctx == null ? void 0 : ctx.dialogRef)) {
    throw new Error("useDialogRef() must be used inside a dialog component.");
  }
  return ctx.dialogRef;
}
function useOptionalIDialogRef() {
  const ctx = React8.useContext(IDialogInstanceContext);
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
  return /* @__PURE__ */ jsxRuntime.jsx(IDialogContext.Provider, { value: api, children });
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
  const onBackdropClick = () => {
    if (!isTopMost) return;
    if (disableClose) return;
    if (!backdropClose) return;
    instance.ref.close(void 0);
  };
  const panelStyles = {
    width: width || void 0,
    height: height || void 0
  };
  const Comp = instance.component;
  return /* @__PURE__ */ jsxRuntime.jsxs("i-dialog-container", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-backdrop", onClick: onBackdropClick }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-wrapper", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-panel", style: panelStyles, children: /* @__PURE__ */ jsxRuntime.jsx(
      IDialogInstanceContext.Provider,
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
  var _a;
  const { result, children, className } = props;
  const ref = useIDialogRef();
  if (!children) return null;
  return React8__default.default.cloneElement(children, {
    className: [(_a = children.props) == null ? void 0 : _a.className, className].filter(Boolean).join(" "),
    onClick: (e) => {
      var _a2, _b;
      (_b = (_a2 = children.props) == null ? void 0 : _a2.onClick) == null ? void 0 : _b.call(_a2, e);
      e.preventDefault();
      ref.close(result);
    }
  });
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
    className,
    ...rest
  } = props;
  const dialogRef = useOptionalIDialogRef();
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
  return /* @__PURE__ */ jsxRuntime.jsxs("i-dialog", { class: className, ...rest, children: [
    title ? /* @__PURE__ */ jsxRuntime.jsx("h4", { className: "i-dialog-title", children: title }) : null,
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "i-dialog-content", children }),
    hasActionsBlock ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "i-dialog-actions", children: [
      customActions.length > 0 ? customActions.map((a, idx) => /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          disabled: a.disabled,
          icon: a.icon,
          className: a.className,
          loading: a.loading,
          type: a.buttonType ?? "button",
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
          disabled: okAction.disabled,
          icon: "check",
          variant: "primary",
          className: okAction.className,
          loading: okAction.loading,
          type: okAction.buttonType ?? "button",
          onClick: () => onOk == null ? void 0 : onOk(),
          children: "OK"
        }
      ) : null,
      confirmAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          disabled: confirmAction.disabled,
          icon: "save",
          variant: "primary",
          className: confirmAction.className,
          loading: confirmAction.loading,
          type: confirmAction.buttonType ?? "button",
          onClick: () => onConfirm == null ? void 0 : onConfirm(),
          children: "Confirm"
        }
      ) : null,
      saveAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          disabled: saveAction.disabled,
          icon: "save",
          variant: "primary",
          className: saveAction.className,
          loading: saveAction.loading,
          type: saveAction.buttonType ?? "button",
          onClick: () => onSave == null ? void 0 : onSave(),
          children: "Save"
        }
      ) : null,
      cancelAction ? /* @__PURE__ */ jsxRuntime.jsx(
        IButton,
        {
          disabled: cancelAction.disabled,
          icon: "cancel",
          variant: "danger",
          className: cancelAction.className,
          loading: cancelAction.loading,
          type: cancelAction.buttonType ?? "button",
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
  const data = useIDialogData();
  const dialog = useIDialogRef();
  const alertClass = `i-alert i-alert-${data.type}`;
  return /* @__PURE__ */ jsxRuntime.jsx("i-alert", { children: /* @__PURE__ */ jsxRuntime.jsxs(
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
  ) });
}
function useIAlert() {
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
  const data = useIDialogData();
  const dialog = useIDialogRef();
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
  return /* @__PURE__ */ jsxRuntime.jsx("i-confirm", { children: /* @__PURE__ */ jsxRuntime.jsxs(
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
  ) });
}
function useIConfirm() {
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
  return /* @__PURE__ */ jsxRuntime.jsx("i-paginator", { class: "i-paginator", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "i-paginator flex align-center gap-md flex-fill", children: [
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
  _serverSide = null;
  _serverSortListeners = /* @__PURE__ */ new Set();
  _serverPageListeners = /* @__PURE__ */ new Set();
  _serverFilterListeners = /* @__PURE__ */ new Set();
  // listeners
  _listeners = /* @__PURE__ */ new Set();
  constructor(initialData = [], config = {}) {
    this._rawData = initialData || [];
    this._serverSide = config.serverSide ?? null;
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
    var _a, _b;
    if (!this._paginatorEnabled || !state) return;
    this._pageIndex = state.pageIndex;
    this._pageSize = state.pageSize;
    if (this._delegatesPage()) {
      const page = { pageIndex: state.pageIndex, pageSize: state.pageSize };
      (_b = (_a = this._serverSide) == null ? void 0 : _a.onPageChange) == null ? void 0 : _b.call(_a, page);
      this._serverPageListeners.forEach((listener) => listener(page));
      return;
    }
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
    var _a;
    if (this._delegatesPage()) return ((_a = this._serverSide) == null ? void 0 : _a.totalRowCount) ?? 0;
    return this._rawData.length;
  }
  get serverSide() {
    return this._serverSide;
  }
  set serverSide(config) {
    this._serverSide = config;
  }
  /** Push a server response and synchronize its pagination metadata. */
  setData(rows, options) {
    this._rawData = rows || [];
    if (this._serverSide) {
      if ((options == null ? void 0 : options.total) !== void 0) this._serverSide.totalRowCount = options.total;
      if ((options == null ? void 0 : options.pageIndex) !== void 0) this._pageIndex = options.pageIndex;
      if ((options == null ? void 0 : options.pageSize) !== void 0) this._pageSize = options.pageSize;
    }
    this._emit();
  }
  /** Subscribe to grid-level server delegation outputs. */
  subscribeServerSort(listener) {
    this._serverSortListeners.add(listener);
    return () => this._serverSortListeners.delete(listener);
  }
  subscribeServerPage(listener) {
    this._serverPageListeners.add(listener);
    return () => this._serverPageListeners.delete(listener);
  }
  subscribeServerFilter(listener) {
    this._serverFilterListeners.add(listener);
    return () => this._serverFilterListeners.delete(listener);
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
      this._notifyOrEmitFilter("");
      return;
    }
    if (typeof value === "string") {
      this._filter = value.toLowerCase().trim();
      this._recursive = false;
      this._childrenKey = "children";
      this._notifyOrEmitFilter(this._filter);
      return;
    }
    this._filter = (value.text ?? "").toLowerCase().trim();
    this._recursive = value.recursive === true;
    this._childrenKey = (value.key || "children").trim() || "children";
    this._notifyOrEmitFilter(this._filter);
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
    var _a, _b;
    this._sort = this._normalizeSort(value);
    if (this._delegatesSort()) {
      const sort = this._sort ?? [];
      (_b = (_a = this._serverSide) == null ? void 0 : _a.onSortChange) == null ? void 0 : _b.call(_a, sort);
      this._serverSortListeners.forEach((listener) => listener(sort));
      return;
    }
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
  _delegatesSort() {
    var _a;
    return !!((_a = this._serverSide) == null ? void 0 : _a.onSortChange) || this._serverSortListeners.size > 0;
  }
  _delegatesPage() {
    var _a;
    return !!((_a = this._serverSide) == null ? void 0 : _a.onPageChange) || this._serverPageListeners.size > 0;
  }
  _delegatesFilter() {
    var _a;
    return !!((_a = this._serverSide) == null ? void 0 : _a.onFilterChange) || this._serverFilterListeners.size > 0;
  }
  _notifyOrEmitFilter(filter) {
    var _a, _b;
    if (this._delegatesFilter()) {
      (_b = (_a = this._serverSide) == null ? void 0 : _a.onFilterChange) == null ? void 0 : _b.call(_a, filter);
      this._serverFilterListeners.forEach((listener) => listener(filter));
      return;
    }
    this._emit();
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
    if (this._filter && !this._delegatesFilter()) {
      const f = this._filter;
      if (this._recursive) {
        data = this._filterRecursiveArray(data, f);
      } else {
        data = data.filter((row) => this.filterPredicate(row, f));
      }
    }
    if (this._sort && this._sort.length > 0 && !this._delegatesSort()) {
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
    if (this._paginatorEnabled && !this._delegatesPage()) {
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
  const { checked, indeterminate, disabled = false, onChange, className, stopRowClick } = props;
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
      disabled,
      onChange: (e) => onChange(e.target.checked),
      onClick: (e) => {
        if (stopRowClick) e.stopPropagation();
      }
    }
  );
}
function defaultHighlightSearch(text, rawTerm) {
  const term = typeof rawTerm === "string" ? rawTerm.trim() : String(rawTerm ?? "").trim();
  if (!text || !term) return text ?? "";
  const value = String(text);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  const parts = [];
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(value)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      parts.push(value.slice(lastIndex, start));
    }
    parts.push(
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "highlight-search", children: value.slice(start, end) }, `h-${i}-${start}-${end}`)
    );
    lastIndex = end;
    i += 1;
  }
  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: parts });
}
function renderCellDef(def, row, ctx) {
  if (!def) return null;
  return def.length >= 2 ? def(row, ctx) : def(row);
}
function IGridInner(props, ref) {
  const {
    dataSource,
    selectionMode = false,
    selectionRowHidden,
    selectionRowDisabled,
    tree = null,
    treeIndent = 16,
    treeColumn,
    treeInitialExpandLevel = null,
    showNumberColumn = true,
    sortMode = "multi",
    onSelectionChange,
    onRowClick,
    onRowExpandChange,
    onExpandedRowsChange,
    onServerSortChange,
    onServerPageChange,
    onServerFilterChange,
    children,
    highlightSearch,
    trackBy
  } = props;
  const idRef = React8.useRef(Math.random().toString(36).slice(2));
  const selectionColumnWidth = 32;
  const numberColumnWidth = 60;
  const expandColumnWidth = 32;
  const defaultColumnWidth = 200;
  const numberColumn = React8.useMemo(
    () => ({
      fieldName: void 0,
      title: "No.",
      sortable: false,
      resizable: true,
      width: numberColumnWidth,
      freeze: false,
      headerDef: void 0,
      cellDef: void 0,
      isAuto: false
    }),
    [numberColumnWidth]
  );
  const [renderedData, setRenderedData] = React8.useState([]);
  const [currentFilterText, setCurrentFilterText] = React8.useState("");
  const [sortStates, setSortStates] = React8.useState([]);
  const columnWidthsRef = React8.useRef(/* @__PURE__ */ new Map());
  const [, setTick] = React8.useState(0);
  const [selectionSet, setSelectionSet] = React8.useState(/* @__PURE__ */ new Set());
  const [expandedSet, setExpandedSet] = React8.useState(/* @__PURE__ */ new Set());
  const selectionSetRef = React8.useRef(selectionSet);
  React8.useEffect(() => {
    selectionSetRef.current = selectionSet;
  }, [selectionSet]);
  React8.useEffect(() => {
    if (!(dataSource instanceof IGridDataSource)) return void 0;
    const unsubscribers = [
      onServerSortChange ? dataSource.subscribeServerSort(onServerSortChange) : void 0,
      onServerPageChange ? dataSource.subscribeServerPage(onServerPageChange) : void 0,
      onServerFilterChange ? dataSource.subscribeServerFilter(onServerFilterChange) : void 0
    ].filter((unsubscribe) => !!unsubscribe);
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [dataSource, onServerFilterChange, onServerPageChange, onServerSortChange]);
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
    return "1 1 0%";
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
    if (includeNumber && showNumberColumnEffective) {
      const width = getColumnWidth(numberColumn);
      if (width !== null) left += width;
    }
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
  const isSelectionHidden = (row) => !!(selectionRowHidden == null ? void 0 : selectionRowHidden(row));
  const isSelectionDisabled = (row) => !!(selectionRowDisabled == null ? void 0 : selectionRowDisabled(row));
  const isRowSelectable = (row) => !isSelectionHidden(row) && !isSelectionDisabled(row);
  const getAllDataRows = () => {
    if (!treeEnabled) {
      return dataSource instanceof IGridDataSource ? dataSource.data : dataSource;
    }
    const rows = [];
    const visit = (row) => {
      rows.push(row);
      getTreeChildren(row).forEach(visit);
    };
    treeRootsRef.current.forEach(visit);
    return rows;
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
    const descendants = getTreeDescendants(row).filter(isRowSelectable);
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
    const descendants = getTreeDescendants(row).filter(isRowSelectable);
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
    const selectable = renderedData.filter(isRowSelectable);
    return selectable.length > 0 && selectable.every((r) => getRowChecked(r));
  };
  const someVisibleSelected = () => {
    if (!selectionMode || !renderedData.length) return false;
    const selectable = renderedData.filter(isRowSelectable);
    if (!selectable.length) return false;
    const anySelected = selectable.some(
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
      const descendants = getTreeDescendants(current).filter(isRowSelectable);
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
    const all = [row, ...getTreeDescendants(row)].filter(isRowSelectable);
    if (selected) all.forEach((r) => next.add(r));
    else all.forEach((r) => next.delete(r));
  };
  const onRowSelectionToggle = (row) => {
    if (!selectionMode) return;
    if (!isRowSelectable(row)) return;
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
    const selectableRows = renderedData.filter(isRowSelectable);
    if (!selectableRows.length) return;
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
    if (shouldSelect) selectableRows.forEach((r) => next.add(r));
    else selectableRows.forEach((r) => next.delete(r));
    setSelectionSet(next);
    emitSelectionChange(null, next);
  };
  const setSelected = (rows) => {
    if (!selectionMode) return;
    const validRows = new Set(getAllDataRows());
    const next = new Set(rows.filter((row) => validRows.has(row) && isRowSelectable(row)));
    if (selectionMode === "single" && next.size > 1) {
      const first = next.values().next().value;
      next.clear();
      next.add(first);
    }
    const unchanged = next.size === selectionSet.size && Array.from(next).every((row) => selectionSet.has(row));
    if (unchanged) return;
    selectionSetRef.current = next;
    setSelectionSet(next);
    emitSelectionChange(null, next);
  };
  React8.useImperativeHandle(
    ref,
    () => ({
      setSelected,
      getSelected: () => Array.from(selectionSetRef.current)
    })
  );
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
      const expandSingle = !!((expandableRowDef == null ? void 0 : expandableRowDef.expandSingle) ?? (expandableRowDef == null ? void 0 : expandableRowDef.iRowDefExpandSingle));
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
      const expandSingle = !!((expandableRowDef == null ? void 0 : expandableRowDef.expandSingle) ?? (expandableRowDef == null ? void 0 : expandableRowDef.iRowDefExpandSingle));
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
    if (sortMode === "single") {
      if (idx === -1) return [{ active: columnId, direction: "asc" }];
      if (next[idx].direction === "asc") {
        return [{ active: columnId, direction: "desc" }];
      }
      return [];
    }
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
    sortStatesRef.current = next;
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
    const stickyEnabled = (sticky == null ? void 0 : sticky.sticky) ?? computedFrozen;
    const frozenClass = (sticky == null ? void 0 : sticky.addFrozenClass) ?? computedFrozen;
    const stickyLeft = stickyEnabled ? (sticky == null ? void 0 : sticky.stickyLeft) ?? computedLeft : null;
    const zIndex = stickyEnabled ? (sticky == null ? void 0 : sticky.zIndex) ?? computedZ : null;
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
        class: [
          "i-grid-header-cell",
          className,
          isSortable ? "i-grid-header-cell--sortable" : null,
          direction !== "" ? "i-grid-header-cell--sorted" : null,
          direction === "asc" ? "i-grid-header-cell--sorted-asc" : null,
          direction === "desc" ? "i-grid-header-cell--sorted-desc" : null,
          resizable ? "i-grid-header-cell--resizable" : null,
          frozenClass ? "i-grid-header-cell--frozen" : null,
          auto ? "i-grid-header-cell--auto" : null
        ].filter(Boolean).join(" "),
        role: "columnheader",
        style: {
          flex,
          position: stickyEnabled ? "sticky" : void 0,
          left: stickyEnabled ? stickyLeft ?? void 0 : void 0,
          zIndex: stickyEnabled && typeof zIndex === "number" ? zIndex : void 0
          // ✅ only if explicitly passed
        },
        onClick: () => {
          if (isResizingRef.current) return;
          if (!col) return;
          if (!isSortable) return;
          sortByColumn(col);
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__content", truncatedtooltip: "", children: children2 }),
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
    const stickyEnabled = (sticky == null ? void 0 : sticky.sticky) ?? computedFrozen;
    const frozenClass = (sticky == null ? void 0 : sticky.addFrozenClass) ?? computedFrozen;
    const stickyLeft = stickyEnabled ? (sticky == null ? void 0 : sticky.stickyLeft) ?? computedLeft : null;
    const zIndex = stickyEnabled ? (sticky == null ? void 0 : sticky.zIndex) ?? computedZ : null;
    const flex = typeof fixedWidth === "number" ? `0 0 ${fixedWidth}px` : col ? getColumnFlex(col) : "1 1 0";
    return /* @__PURE__ */ jsxRuntime.jsx(
      "i-grid-cell",
      {
        class: [
          "i-grid-cell",
          className,
          frozenClass ? "i-grid-cell--frozen" : null,
          auto ? "i-grid-cell--auto" : null
        ].filter(Boolean).join(" "),
        role: "cell",
        style: {
          flex,
          position: stickyEnabled ? "sticky" : void 0,
          left: stickyEnabled ? stickyLeft ?? void 0 : void 0,
          zIndex: stickyEnabled && typeof zIndex === "number" ? zIndex : void 0
          // ✅ only if explicitly passed
        },
        onClick: (e) => {
          if (onClickStop) e.stopPropagation();
        },
        children: children2
      }
    );
  };
  const highlightSearchFn = React8.useMemo(
    () => highlightSearch ?? defaultHighlightSearch,
    [highlightSearch]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("i-grid", { class: "i-grid", role: "table", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("i-grid-viewport", { class: "i-grid-viewport", children: [
      effectiveHeaderItems.length ? /* @__PURE__ */ jsxRuntime.jsxs("i-grid-header-row", { class: "i-grid-header-row", children: [
        !treeEnabled && hasExpandableRow && !((expandableRowDef == null ? void 0 : expandableRowDef.expandSingle) ?? (expandableRowDef == null ? void 0 : expandableRowDef.iRowDefExpandSingle)) ? /* @__PURE__ */ jsxRuntime.jsx(
          HeaderCell,
          {
            className: "i-grid-expand-cell i-grid-expand-cell--header i-grid-header-cell--frozen",
            fixedWidth: expandColumnWidth,
            disableSortClick: true,
            sticky: {
              sticky: true,
              addFrozenClass: true,
              stickyLeft: getStickyLeftForExpandColumn()
            },
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__content", children: /* @__PURE__ */ jsxRuntime.jsx(
              IButton,
              {
                className: "i-grid-expand-toggle",
                size: "2xs",
                variant: "outline",
                icon: allVisibleExpanded() ? "down" : "next",
                onClick: () => onToggleAllExpanded()
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
              sticky: true,
              addFrozenClass: true,
              stickyLeft: getStickyLeftForSelectionColumn()
            },
            children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-header-cell__content", children: selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
              IndeterminateCheckbox,
              {
                checked: allVisibleSelected(),
                indeterminate: someVisibleSelected(),
                disabled: renderedData.filter(isRowSelectable).length === 0,
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
            col: numberColumn,
            resizable: numberColumn.resizable,
            disableSortClick: true,
            sticky: hasFrozenColumns ? {
              sticky: true,
              addFrozenClass: true,
              stickyLeft: getStickyLeftForNumberColumn(),
              // Angular template: number header z=3 when frozen
              zIndex: 3
            } : void 0,
            children: numberColumn.title
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
                        disabled: renderedData.filter(isRowSelectable).length === 0,
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
              class: "i-grid-header-cell-group",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(HeaderCell, { disableSortClick: true, children: item.title }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "i-grid-header-cell-group-columns",
                  {
                    class: "i-grid-header-cell-group-columns",
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
        const key = props.rowKey ? props.rowKey(row, rowIndex) : trackBy ? trackBy(row, rowIndex) : rowIndex;
        return /* @__PURE__ */ jsxRuntime.jsxs(React8__default.default.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs(
            "i-grid-row",
            {
              class: [
                "i-grid-row",
                selectionMode ? "i-grid-selection-row" : null
              ].filter(Boolean).join(" "),
              onClick: () => {
                onRowClick == null ? void 0 : onRowClick(row);
                if (treeEnabled && selectionMode) onRowSelectionToggle(row);
              },
              children: [
                !treeEnabled && hasExpandableRow ? /* @__PURE__ */ jsxRuntime.jsx(
                  Cell,
                  {
                    className: "i-grid-expand-cell i-grid-expand-cell--body",
                    fixedWidth: expandColumnWidth,
                    onClickStop: true,
                    sticky: {
                      sticky: true,
                      addFrozenClass: false,
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
                      sticky: true,
                      addFrozenClass: false,
                      stickyLeft: getStickyLeftForSelectionColumn()
                    },
                    children: isSelectionHidden(row) ? /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": "true", className: "i-grid-selection-spacer" }) : selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
                      IndeterminateCheckbox,
                      {
                        checked: getRowChecked(row),
                        indeterminate: getRowIndeterminate(row),
                        disabled: isSelectionDisabled(row),
                        onChange: () => onRowSelectionToggle(row),
                        stopRowClick: true
                      }
                    ) : /* @__PURE__ */ jsxRuntime.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: selectionSet.has(row),
                        disabled: isSelectionDisabled(row),
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
                    col: numberColumn,
                    onClickStop: true,
                    sticky: hasFrozenColumns ? {
                      sticky: true,
                      addFrozenClass: true,
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
                          isSelectionHidden(row) ? /* @__PURE__ */ jsxRuntime.jsx(
                            "span",
                            {
                              "aria-hidden": "true",
                              className: "i-grid-tree-selection-spacer"
                            }
                          ) : selectionMode === "multiple" ? /* @__PURE__ */ jsxRuntime.jsx(
                            IndeterminateCheckbox,
                            {
                              className: "i-grid-tree-checkbox",
                              checked: getRowChecked(row),
                              indeterminate: getRowIndeterminate(row),
                              disabled: isSelectionDisabled(row),
                              onChange: () => onRowSelectionToggle(row),
                              stopRowClick: true
                            }
                          ) : selectionMode === "single" ? /* @__PURE__ */ jsxRuntime.jsx(
                            "input",
                            {
                              className: "i-grid-tree-radio",
                              type: "radio",
                              checked: selectionSet.has(row),
                              disabled: isSelectionDisabled(row),
                              name: `i-grid-radio-${idRef.current}`,
                              onChange: () => onRowSelectionToggle(row),
                              onClick: (e) => e.stopPropagation()
                            }
                          ) : null,
                          col.cellDef ? renderCellDef(col.cellDef, row, {
                            row,
                            index: rowIndex,
                            column: col
                          }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-tree-text", truncatedtooltip: "", children: col.fieldName ? highlightSearchFn(
                            String(
                              (row == null ? void 0 : row[col.fieldName]) ?? ""
                            ),
                            currentFilterText
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
                      }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-grid-cell__content", truncatedtooltip: "", children: col.fieldName ? highlightSearchFn(
                        String(
                          (row == null ? void 0 : row[col.fieldName]) ?? ""
                        ),
                        currentFilterText
                      ) : "" })
                    },
                    `c-${rowIndex}-${colIndex}`
                  );
                })
              ]
            }
          ),
          hasExpandableRow && isRowExpanded(row) ? /* @__PURE__ */ jsxRuntime.jsx("i-grid-expandable-row", { class: "i-grid-expandable-row flex", children: expandableRowDef.render(row, { row, index: rowIndex }) }) : null
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
var IGrid = React8.forwardRef(IGridInner);
var InsightAuthContext = React8.createContext(null);
function useInsightAuth() {
  const ctx = React8.useContext(InsightAuthContext);
  if (!ctx) {
    throw new Error(
      "useInsightAuth() must be used under <InsightAuthProvider> \u2014 wrap your app root with it (and provide an auth config)."
    );
  }
  return ctx;
}
function useSession() {
  const ctx = useInsightAuth();
  React8.useSyncExternalStore(ctx.session.subscribe, ctx.session.getVersion);
  return ctx.session;
}
function useApi() {
  return useInsightAuth().api;
}
function useAuth() {
  return useInsightAuth().auth;
}
function useCsrf() {
  return useInsightAuth().csrf;
}
function useSessionExpired() {
  const ctx = useInsightAuth();
  React8.useSyncExternalStore(ctx.sessionExpired.subscribe, ctx.sessionExpired.getVersion);
  return ctx.sessionExpired;
}
function useUserMenuStore() {
  const ctx = useInsightAuth();
  React8.useSyncExternalStore(ctx.userMenuStore.subscribe, ctx.userMenuStore.getVersion);
  return ctx.userMenuStore;
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

// src/components/host/menu.ts
function getMenuRoute(menu) {
  var _a;
  return ((_a = menu == null ? void 0 : menu.route) == null ? void 0 : _a.trim()) || null;
}
function isHttpRoute(route) {
  return !!(route == null ? void 0 : route.trim().toLowerCase().startsWith("http"));
}
function getMenuKey(menu) {
  return (menu == null ? void 0 : menu.id) ?? (menu == null ? void 0 : menu.menuId) ?? null;
}
function getMenuLabel(menu) {
  var _a;
  return ((_a = menu == null ? void 0 : menu.name) == null ? void 0 : _a.trim()) || (menu == null ? void 0 : menu.menuName) || "";
}
function getMenuChildren(menu) {
  return (menu == null ? void 0 : menu.children) ?? (menu == null ? void 0 : menu.child) ?? [];
}
function hasMenuChildren(menu) {
  return getMenuChildren(menu).length > 0;
}
function isModuleMenu(menu) {
  if (!menu) return false;
  if (menu.type) return false;
  return Number(menu.menuTypeId) === 2;
}
function isGroupNode(menu) {
  if (!menu) return false;
  if (menu.type) return menu.type === "group";
  const typeId = Number(menu.menuTypeId);
  return typeId === 2 || typeId === 3 && hasMenuChildren(menu);
}
function isLeafItem(menu) {
  if (!menu) return false;
  if (menu.type) return menu.type === "item" || menu.type === "function";
  return Number(menu.menuTypeId) === 3 && !hasMenuChildren(menu);
}
function isNewTabMenu(menu) {
  const route = getMenuRoute(menu);
  if (!route) return false;
  if (menu == null ? void 0 : menu.openIn) return menu.openIn === "NEW_TAB" || menu.openIn === "NEW_WINDOW";
  return !!(menu == null ? void 0 : menu.openInNewTab);
}
function isReloadMenu(menu) {
  const route = getMenuRoute(menu);
  if (!route) return false;
  if (menu == null ? void 0 : menu.openIn) {
    return menu.openIn === "CURRENT_TAB" && isHttpRoute(route);
  }
  if (menu == null ? void 0 : menu.openInNewTab) return false;
  return !!(menu == null ? void 0 : menu.reload) || isHttpRoute(route);
}
function isSpaMenu(menu) {
  const route = getMenuRoute(menu);
  if (!route) return false;
  if (menu == null ? void 0 : menu.openIn) return menu.openIn === "CURRENT_TAB" && !isHttpRoute(route);
  if (menu == null ? void 0 : menu.openInNewTab) return false;
  if (menu == null ? void 0 : menu.reload) return false;
  if (isHttpRoute(route)) return false;
  return true;
}
var isModernMenu = (menu) => !!menu.type;
function normalizeMenu(menu, level) {
  if (!isModernMenu(menu)) return menu;
  const children = getMenuChildren(menu);
  const normalized = {
    ...menu,
    menuName: getMenuLabel(menu),
    menuTypeId: 3,
    parentId: 0,
    sequence: Number(menu.sequence) || 0,
    level,
    child: children.map((child) => normalizeMenu(child, level + 1)),
    children: void 0,
    name: void 0,
    type: void 0
  };
  return normalized;
}
function normalizeMenuTree(menus) {
  return (menus ?? []).map((menu) => normalizeMenu(menu, 0));
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
var MENU_ICON_FALLBACK = "fa-brands fa-microsoft";
var SIDEBAR_FAVORITES_GROUP_ID = "favorites";
function hasFaToken(icon) {
  return /(?:^|\s)fa-[a-z0-9-]+(?:\s|$)/i.test(icon ?? "");
}
function resolveMenuIcon(icon) {
  const value = (icon ?? "").trim();
  return `${hasFaToken(value) ? value : MENU_ICON_FALLBACK} fa-fw`;
}
function appendMenuFilterToUrl(raw, rawFilter) {
  const term = (rawFilter ?? "").trim();
  if (!term) return raw;
  try {
    const u = new URL(raw);
    u.searchParams.set("menu-filter", term);
    return u.toString();
  } catch {
    const origin = window.location.origin;
    const u = new URL(raw, origin);
    u.searchParams.set("menu-filter", term);
    return `${u.pathname}${u.search}${u.hash}`;
  }
}
function normalizeCrumbs(items) {
  if (!(items == null ? void 0 : items.length)) return [];
  return items.filter((x) => !!(x == null ? void 0 : x.label));
}
function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
function isInternalAppUrl(url) {
  return url.startsWith("/") && !isHttpRoute(url);
}
function IHContent(props) {
  const nav = reactRouterDom.useNavigate();
  const { onNavigate, loading, onLoadingChange } = props;
  React8.useEffect(() => {
    onLoadingChange == null ? void 0 : onLoadingChange(loading ?? false);
  }, [loading, onLoadingChange]);
  const assetBase = undefined.BASE_URL ?? "/";
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
      if (onNavigate) return onNavigate(url);
      nav(url);
    },
    [nav, onNavigate]
  );
  const onCrumbClick = React8.useCallback(
    (e, url) => {
      if (!isPlainLeftClick(e)) return;
      if (isInternalAppUrl(url)) {
        e.preventDefault();
        go(url);
      }
    },
    [go]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs("ih-content", { children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ih-content-header", children: [
      /* @__PURE__ */ jsxRuntime.jsx("a", { className: "i-clickable", onClick: toggleSidebar, children: sidebarVisibility ? /* @__PURE__ */ jsxRuntime.jsx("img", { alt: "sidebar-left", src: `${assetBase}svgs/sidebar-left.svg` }) : /* @__PURE__ */ jsxRuntime.jsx("img", { alt: "sidebar-right", src: `${assetBase}svgs/sidebar-right.svg` }) }),
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
function IHContentLayout(props) {
  const ui = useHostUi();
  const hostApi = useHostApiOptional();
  const session = useSession();
  const store = useUserMenuStore();
  return /* @__PURE__ */ jsxRuntime.jsx(
    IHContent,
    {
      title: ui.title,
      breadcrumbs: ui.breadcrumbs,
      loading: session.initializing || store.initializing,
      onLoadingChange: props.onLoadingChange,
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
  if (Number(cloned.menuTypeId) === 3 && (selfMatches || childMatches)) {
    cloned.visibility = "expanded";
  }
  return cloned;
}
function flattenNavigableMenus(menus) {
  const result = [];
  const visit = (menu) => {
    const children = menu.child ?? [];
    const hasChildren = children.length > 0;
    const isLeaf = Number(menu.menuTypeId) === 3 && (!hasChildren || menu.visibility === "no-child");
    if (isLeaf) result.push(menu);
    for (const c of children) visit(c);
  };
  for (const m of menus) visit(m);
  return result;
}
var IHMenu = React8.memo(function IHMenu2(props) {
  const {
    menu,
    filter,
    selectedMenuId,
    onToggleGroup,
    collapsible,
    favoriteMode,
    dragEnabled,
    depth = 0,
    showApplication = false,
    onFavoriteToggle
  } = props;
  const navigate = reactRouterDom.useNavigate();
  const menuItemRef = React8.useRef(null);
  const menuKey = React8.useMemo(() => getMenuKey(menu), [menu]);
  const menuLabel = React8.useMemo(() => getMenuLabel(menu), [menu]);
  const menuRoute = React8.useMemo(() => getMenuRoute(menu), [menu]);
  const hasChild = React8.useMemo(() => hasMenuChildren(menu), [menu]);
  const menuChildren = React8.useMemo(() => getMenuChildren(menu), [menu]);
  const isModuleNode = React8.useMemo(() => isModuleMenu(menu), [menu]);
  const isGroupNodeValue = React8.useMemo(() => isGroupNode(menu), [menu]);
  const isLeaf = React8.useMemo(() => isLeafItem(menu), [menu]);
  const isFavoritesGroup = menuKey === SIDEBAR_FAVORITES_GROUP_ID;
  const isNewTab = isNewTabMenu(menu);
  const isReload = isReloadMenu(menu);
  const isSpa = isSpaMenu(menu);
  const menuIsFavorite = !!(menu == null ? void 0 : menu.isFavorite);
  const iconClass = React8.useMemo(() => resolveMenuIcon(menu == null ? void 0 : menu.icon), [menu]);
  const isGroupExpanded = React8.useMemo(() => {
    if (!collapsible) return true;
    return (menu == null ? void 0 : menu.visibility) !== "collapsed";
  }, [collapsible, menu == null ? void 0 : menu.visibility]);
  const href = React8.useMemo(() => {
    if (!menuRoute) return "#";
    return appendMenuFilterToUrl(menuRoute, filter);
  }, [menuRoute, filter]);
  const isSelected = React8.useMemo(() => {
    if (!menu) return false;
    const matchesId = menuKey !== null && menuKey === selectedMenuId;
    if (!matchesId) return false;
    return isLeaf;
  }, [menu, menuKey, selectedMenuId, isLeaf]);
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
    if (menuKey === null) return;
    if (menu.visibility !== "no-child") onToggleGroup(menuKey);
  }, [menu, menuKey, onToggleGroup]);
  const renderIndent = () => {
    const indentLevel = Math.max(0, depth - 1);
    if (!indentLevel) return null;
    return Array.from({ length: indentLevel }).map((_, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: `indent-${depth}` }, i));
  };
  const onLeafClick = React8.useCallback(
    (e) => {
      if (!menu) return;
      if (!menuRoute) return;
      if (!isPlainLeftClick(e)) return;
      if (isNewTab) return;
      if (isReload) return;
      if (isSpa) {
        e.preventDefault();
        navigate(href);
      }
    },
    [menu, menuRoute, isNewTab, isReload, isSpa, href, navigate]
  );
  const onToggleFavorite = React8.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (menuKey === null) return;
      onFavoriteToggle == null ? void 0 : onFavoriteToggle({ id: menuKey, isFavorite: !menuIsFavorite });
    },
    [menuKey, menuIsFavorite, onFavoriteToggle]
  );
  if (!menu) return null;
  const menuDragProps = {
    "data-menu-id": dragEnabled && menuKey != null ? String(menuKey) : void 0
  };
  const renderLeafInner = () => {
    var _a;
    return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      renderIndent(),
      /* @__PURE__ */ jsxRuntime.jsx("i", { className: iconClass }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        "span",
        {
          className: [
            "ih-menu-label",
            showApplication ? "ih-menu-label--compact" : ""
          ].filter(Boolean).join(" "),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("h6", { children: /* @__PURE__ */ jsxRuntime.jsx(Highlighted, { text: menuLabel, term: filter }) }),
            showApplication && ((_a = menu.application) == null ? void 0 : _a.name) ? /* @__PURE__ */ jsxRuntime.jsx("small", { className: "ih-menu-application", children: menu.application.name }) : null
          ]
        }
      ),
      favoriteMode && onFavoriteToggle ? /* @__PURE__ */ jsxRuntime.jsx(
        "i",
        {
          className: `ih-menu-favorite ${menuIsFavorite ? "fa-solid fa-star is-favorite" : "fa-regular fa-star"}`,
          role: "button",
          tabIndex: 0,
          "aria-label": menuIsFavorite ? "Remove from favorites" : "Add to favorites",
          onClick: onToggleFavorite
        }
      ) : null
    ] });
  };
  return /* @__PURE__ */ jsxRuntime.jsx("ih-menu", { "data-ih-menu": true, children: /* @__PURE__ */ jsxRuntime.jsxs(
    "li",
    {
      className: [
        isModuleNode ? "is-module" : "",
        isModuleNode ? menu.visibility ?? "" : ""
      ].filter(Boolean).join(" "),
      children: [
        isModuleNode ? /* @__PURE__ */ jsxRuntime.jsxs(
          "small",
          {
            className: [
              "ih-menu-module",
              collapsible && hasChild ? "ih-menu-module--collapsible" : ""
            ].filter(Boolean).join(" "),
            onClick: collapsible && hasChild ? clickGroup : void 0,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: /* @__PURE__ */ jsxRuntime.jsx(Highlighted, { text: menuLabel, term: filter }) }),
              collapsible && hasChild ? /* @__PURE__ */ jsxRuntime.jsx(
                "i",
                {
                  className: [
                    "ih-menu-chevron",
                    isGroupExpanded ? "fas fa-angle-up" : "fas fa-angle-down"
                  ].filter(Boolean).join(" ")
                }
              ) : null
            ]
          }
        ) : isGroupNodeValue ? /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: [
              "ih-menu-group",
              collapsible ? "ih-menu-group--collapsible" : "",
              depth === 0 ? "ih-menu-group--top" : ""
            ].filter(Boolean).join(" "),
            "data-menu-id": dragEnabled && menuKey != null ? String(menuKey) : void 0,
            onClick: collapsible ? clickGroup : void 0,
            children: [
              renderIndent(),
              depth > 0 || isFavoritesGroup ? /* @__PURE__ */ jsxRuntime.jsx("i", { className: iconClass }) : null,
              /* @__PURE__ */ jsxRuntime.jsx("h6", { children: /* @__PURE__ */ jsxRuntime.jsx(Highlighted, { text: menuLabel, term: filter }) }),
              collapsible ? /* @__PURE__ */ jsxRuntime.jsx(
                "i",
                {
                  className: [
                    "ih-menu-chevron",
                    isGroupExpanded ? "fas fa-angle-up" : "fas fa-angle-down"
                  ].filter(Boolean).join(" ")
                }
              ) : null
            ]
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: isNewTab && menuRoute ? /* @__PURE__ */ jsxRuntime.jsx(
          "a",
          {
            className: isSelected ? "is-new-tab is-selected" : "is-new-tab",
            rel: "noopener noreferrer",
            target: "_blank",
            href,
            ...menuDragProps,
            children: renderLeafInner()
          }
        ) : isReload && menuRoute ? /* @__PURE__ */ jsxRuntime.jsx(
          "a",
          {
            className: isSelected ? "is-reload is-selected" : "is-reload",
            target: "_self",
            href,
            ...menuDragProps,
            children: renderLeafInner()
          }
        ) : isSpa && menuRoute ? /* @__PURE__ */ jsxRuntime.jsx(
          "a",
          {
            ref: (el) => {
              menuItemRef.current = el;
            },
            className: isSelected ? "is-spa is-selected" : "is-spa",
            href,
            onClick: onLeafClick,
            ...menuDragProps,
            children: renderLeafInner()
          }
        ) : null }),
        hasChild ? /* @__PURE__ */ jsxRuntime.jsx(
          "ul",
          {
            className: (isGroupNodeValue || isModuleNode) && collapsible ? isGroupExpanded ? "expanded" : "collapsed" : "",
            children: menuChildren.map((m) => /* @__PURE__ */ jsxRuntime.jsx(
              IHMenu2,
              {
                menu: m,
                filter,
                selectedMenuId,
                onToggleGroup,
                collapsible,
                favoriteMode,
                dragEnabled,
                showApplication,
                depth: depth + 1,
                onFavoriteToggle
              },
              String(getMenuKey(m))
            ))
          }
        ) : null
      ]
    }
  ) });
});
function FavoritesSection({
  favorites,
  collapsible,
  onFavoriteToggle,
  onFavoriteReorder
}) {
  const [favoritesCollapsed, setFavoritesCollapsed] = React8.useState(false);
  const [favoriteItems, setFavoriteItems] = React8.useState(favorites);
  const [dragOver, setDragOver] = React8.useState(false);
  const listRef = React8.useRef(null);
  const itemsRef = React8.useRef(favorites);
  const dragRef = React8.useRef(null);
  const dragHandlersRef = React8.useRef(null);
  React8.useEffect(() => {
    itemsRef.current = favorites;
    setFavoriteItems(favorites);
  }, [favorites]);
  const group = React8.useMemo(() => {
    if (!(favoriteItems == null ? void 0 : favoriteItems.length)) return null;
    const node = {
      id: SIDEBAR_FAVORITES_GROUP_ID,
      name: "Favorites",
      type: "group",
      icon: "fa-solid fa-star",
      visibility: favoritesCollapsed ? "collapsed" : "expanded",
      children: favoriteItems
    };
    return normalizeMenuTree([node])[0] ?? null;
  }, [favoriteItems, favoritesCollapsed]);
  const computeDropIndex = React8.useCallback((clientY) => {
    const host = listRef.current;
    if (!host) return 0;
    const leaves = Array.from(
      host.querySelectorAll(".ih-sidebar-favorites [data-menu-id]")
    ).filter((el) => el.getAttribute("data-menu-id") !== SIDEBAR_FAVORITES_GROUP_ID);
    for (let i = 0; i < leaves.length; i++) {
      const rect = leaves[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return leaves.length;
  }, []);
  const reorderLive = React8.useCallback((menuId, targetIndex) => {
    const items = itemsRef.current;
    const sourceIndex = items.findIndex((menu) => String(getMenuKey(menu)) === menuId);
    if (sourceIndex === -1) return;
    const insertAt = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    if (insertAt === sourceIndex) return;
    const reordered = [...items];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(insertAt, 0, moved);
    itemsRef.current = reordered;
    setFavoriteItems(reordered);
  }, []);
  const cleanupDrag = React8.useCallback(() => {
    var _a, _b;
    const handlers = dragHandlersRef.current;
    const ghost = ((_a = dragRef.current) == null ? void 0 : _a.ghost) ?? null;
    dragRef.current = null;
    dragHandlersRef.current = null;
    setDragOver(false);
    (_b = listRef.current) == null ? void 0 : _b.querySelectorAll(".is-dragging").forEach((el) => el.classList.remove("is-dragging"));
    if (handlers) {
      document.removeEventListener("mousemove", handlers.move);
      document.removeEventListener("mouseup", handlers.up);
    }
    ghost == null ? void 0 : ghost.remove();
  }, []);
  const startDrag = React8.useCallback(
    (event) => {
      const target = event.target;
      const leaf = target.closest(".ih-sidebar-favorites [data-menu-id]");
      if (!leaf) return;
      const menuId = leaf.dataset["menuId"];
      if (!menuId) return;
      event.preventDefault();
      const ghost = leaf.cloneNode(true);
      ghost.classList.add("ih-drag-ghost");
      ghost.classList.remove("is-dragging");
      ghost.style.display = "none";
      document.body.appendChild(ghost);
      dragRef.current = {
        menuId,
        startY: event.clientY,
        moved: false,
        lastTargetIndex: null,
        ghost
      };
      leaf.classList.add("is-dragging");
      const move = (e) => {
        const state = dragRef.current;
        if (!state) return;
        if (!state.moved && Math.abs(e.clientY - state.startY) < 5) return;
        state.moved = true;
        if (state.ghost) {
          state.ghost.style.display = "";
          state.ghost.style.left = `${e.clientX}px`;
          state.ghost.style.top = `${e.clientY}px`;
        }
        const targetIndex = computeDropIndex(e.clientY);
        if (targetIndex !== state.lastTargetIndex) {
          reorderLive(state.menuId, targetIndex);
          state.lastTargetIndex = targetIndex;
        }
        setDragOver(true);
      };
      const up = () => {
        const state = dragRef.current;
        if (!state) return;
        if (state.moved) {
          const reordered = itemsRef.current;
          cleanupDrag();
          const menuIds = reordered.map((menu) => getMenuKey(menu)).filter((key) => key !== null && key !== void 0);
          onFavoriteReorder == null ? void 0 : onFavoriteReorder({ menuIds });
        } else {
          cleanupDrag();
        }
      };
      dragHandlersRef.current = { move, up };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [computeDropIndex, reorderLive, cleanupDrag, onFavoriteReorder]
  );
  if (!group) return null;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "ul",
    {
      ref: listRef,
      className: ["ih-sidebar-favorites", dragOver ? "is-drag-over" : ""].filter(Boolean).join(" "),
      onMouseDown: startDrag,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        IHMenu,
        {
          menu: group,
          filter: "",
          selectedMenuId: null,
          onToggleGroup: () => setFavoritesCollapsed((c) => !c),
          collapsible,
          favoriteMode: true,
          onFavoriteToggle,
          dragEnabled: true,
          showApplication: true
        }
      )
    }
  );
}
function IHSidebar(props) {
  const {
    user,
    menus,
    visible = true,
    footerText = "Insight Local",
    collapsible = false,
    favoriteMode = false,
    favorites = [],
    onFavoriteToggle,
    onFavoriteReorder
  } = props;
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
  const [menuTree, setMenuTree] = React8.useState(() => normalizeMenuTree(menus));
  React8.useEffect(() => {
    setMenuTree(normalizeMenuTree(menus));
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
      setSelectedMenuId(getMenuKey(navigableMenus[idx]));
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
  const navigateToMenu = React8.useCallback(
    (menu) => {
      const route = getMenuRoute(menu);
      if (!route) return;
      const urlWithFilter = appendMenuFilterToUrl(route, menuFilter);
      if (isNewTabMenu(menu)) {
        window.open(urlWithFilter, "_blank", "noopener,noreferrer");
        return;
      }
      if (isReloadMenu(menu)) {
        window.location.href = urlWithFilter;
        return;
      }
      if (isSpaMenu(menu)) {
        navigate(urlWithFilter);
      }
    },
    [menuFilter, navigate]
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
          setSelectedMenuId(getMenuKey(navigableMenus[0]));
          return;
        }
        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current + 1 > max ? 0 : current + 1;
          setSelectedMenuId(getMenuKey(navigableMenus[next]));
          return next;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!keyboardNavActive) {
          setKeyboardNavActive(true);
          const last = navigableMenus.length - 1;
          setSelectedIndex(last);
          setSelectedMenuId(getMenuKey(navigableMenus[last]));
          return;
        }
        setSelectedIndex((cur) => {
          const current = cur ?? 0;
          const max = navigableMenus.length - 1;
          const next = current - 1 < 0 ? max : current - 1;
          setSelectedMenuId(getMenuKey(navigableMenus[next]));
          return next;
        });
      } else if (event.key === "Enter") {
        if (!keyboardNavActive) return;
        event.preventDefault();
        const idx = selectedIndex;
        if (idx == null || idx < 0 || idx >= navigableMenus.length) return;
        navigateToMenu(navigableMenus[idx]);
      }
    },
    [
      navigableMenus,
      menuFilter,
      keyboardNavActive,
      selectedIndex,
      navigateToMenu
    ]
  );
  const onToggleGroup = React8.useCallback((menuId) => {
    const update = (list) => list.map((m) => {
      var _a;
      if (getMenuKey(m) === menuId) {
        if (m.visibility !== "no-child") {
          const isExpanded = m.visibility !== "collapsed";
          const nextVis = isExpanded ? "collapsed" : "expanded";
          return { ...m, visibility: nextVis };
        }
        return m;
      }
      if ((_a = m.child) == null ? void 0 : _a.length) return { ...m, child: update(m.child) };
      return m;
    });
    setMenuTree((prev) => update(prev));
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("ih-sidebar", { class: !visible ? "hidden" : void 0, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-sidebar-header", children: user ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "user-image", children: /* @__PURE__ */ jsxRuntime.jsx(IAvatar, { alt: user.fullName, size: 28, src: user.userImagePath }) }),
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
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ih-sidebar-body scroll scroll-y", children: [
      favoriteMode ? /* @__PURE__ */ jsxRuntime.jsx(
        FavoritesSection,
        {
          favorites,
          collapsible,
          onFavoriteToggle,
          onFavoriteReorder
        }
      ) : null,
      /* @__PURE__ */ jsxRuntime.jsx("ul", { children: filteredMenus.map((m) => /* @__PURE__ */ jsxRuntime.jsx(
        IHMenu,
        {
          menu: m,
          filter: menuFilter,
          selectedMenuId,
          onToggleGroup,
          collapsible,
          favoriteMode,
          onFavoriteToggle
        },
        String(getMenuKey(m))
      )) })
    ] }),
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
function IPill({
  icon,
  size = "md",
  variant = "default",
  disabled = false,
  closable = false,
  className,
  children,
  onClick,
  onClose,
  ...rest
}) {
  const handleHostClick = React8.useCallback(
    (e) => {
      var _a;
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const target = e.target;
      if ((_a = target == null ? void 0 : target.closest) == null ? void 0 : _a.call(target, ".i-pill__close")) return;
      onClick == null ? void 0 : onClick(e);
    },
    [disabled, onClick]
  );
  const handleClose = React8.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onClose == null ? void 0 : onClose(e);
    },
    [disabled, onClose]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-pill",
    {
      class: ["i-pill", className].filter(Boolean).join(" "),
      size,
      variant,
      "aria-disabled": disabled ? "true" : void 0,
      onClick: handleHostClick,
      ...rest,
      children: [
        icon ? /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon, size }) : null,
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "i-pill__content", children }),
        closable ? /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            "aria-label": "Close",
            className: "i-pill__close",
            type: "button",
            disabled,
            onClick: handleClose,
            children: "\xD7"
          }
        ) : null
      ]
    }
  );
}
var CHEVRON_WIDTH_BY_SIZE = {
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32
};
function isTruthyAttr(v) {
  if (v === null || v === void 0) return false;
  const s = String(v).trim().toLowerCase();
  if (s === "false" || s === "0" || s === "null" || s === "undefined")
    return false;
  return true;
}
function parseOpened(v) {
  if (v === null || v === void 0) return false;
  return `${v}` !== "false";
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
  return typeof index === "number" && Number.isInteger(index) && index >= 0 && index < len;
}
function ISection(props) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-section", { class: className, ...rest });
}
function ISectionHeader(props) {
  const { children, className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-header", { class: className, ...rest, children: /* @__PURE__ */ jsxRuntime.jsx("h4", { children }) });
}
function ISectionSubHeader(props) {
  const { children, className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-sub-header", { class: className, ...rest, children: /* @__PURE__ */ jsxRuntime.jsx("h6", { children }) });
}
function ISectionFilter(props) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-filter", { class: className, ...rest });
}
function ISectionBody(props) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-body", { class: className, ...rest });
}
function ISectionFooter(props) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx("i-section-footer", { class: className, ...rest });
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
  const opened = parseOpened(props.opened);
  const parsed = parseBadge(props.badge);
  const headerNode = props.header !== void 0 && props.header !== null ? props.header : /* @__PURE__ */ jsxRuntime.jsx(
    DefaultHeader,
    {
      title,
      badgeEnabled: parsed.enabled,
      badgeValue: parsed.value
    }
  );
  return {
    key: node.key ?? `tab-${index}`,
    title,
    opened,
    badgeEnabled: parsed.enabled,
    badgeValue: parsed.value,
    headerNode,
    contentNode: props.children ?? null
  };
}
function ISectionTabs(props) {
  const {
    selectedIndex = null,
    onSelectedIndexChange,
    height = "wrap",
    sticky = false,
    stickyTopOffset = "-16px",
    scrollable = false,
    chevronSize = "lg",
    tabMinHeight = "",
    headerClass = "",
    tabClass = "",
    styleVariant = "default",
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
  const chevronWidth = CHEVRON_WIDTH_BY_SIZE[chevronSize];
  const isFixedHeight = contentHeightPx !== null;
  const hasValidControlledIndex = selectedIndex !== null && selectedIndex !== void 0 && isValidIndex(selectedIndex, tabs.length);
  const computeNextIndex = React8.useCallback(() => {
    if (hasValidControlledIndex) return selectedIndex;
    if (openedIndex >= 0 && isValidIndex(openedIndex, tabs.length))
      return openedIndex;
    return 0;
  }, [hasValidControlledIndex, selectedIndex, openedIndex, tabs.length]);
  const [activeIndex, setActiveIndex] = React8.useState(
    () => computeNextIndex()
  );
  const scrollContainerRef = React8.useRef(null);
  const [showLeftChevron, setShowLeftChevron] = React8.useState(false);
  const [showRightChevron, setShowRightChevron] = React8.useState(false);
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
  const checkOverflow = React8.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !scrollable) {
      setShowLeftChevron(false);
      setShowRightChevron(false);
      return;
    }
    setShowLeftChevron(container.scrollLeft > 2);
    setShowRightChevron(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 2
    );
  }, [scrollable]);
  React8.useEffect(() => {
    checkOverflow();
    const container = scrollContainerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return void 0;
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);
    return () => observer.disconnect();
  }, [checkOverflow, tabs]);
  React8.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !scrollable) return;
    const activeHeader = container.querySelector(
      ".i-section-tabs-header.active"
    );
    if (typeof (activeHeader == null ? void 0 : activeHeader.scrollIntoView) === "function") {
      activeHeader.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
    checkOverflow();
  }, [activeIndex, checkOverflow, scrollable]);
  const activateFromKeyboard = React8.useCallback(
    (event, index) => {
      var _a, _b;
      const lastIndex = tabs.length - 1;
      let nextIndex = null;
      if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = lastIndex;
      if (nextIndex === null) return;
      event.preventDefault();
      setActive(nextIndex, true);
      const headers = (_a = event.currentTarget.parentElement) == null ? void 0 : _a.querySelectorAll(
        ".i-section-tabs-header"
      );
      (_b = headers == null ? void 0 : headers[nextIndex]) == null ? void 0 : _b.focus();
    },
    [setActive, tabs.length]
  );
  const scrollBy = React8.useCallback(
    (left) => {
      const container = scrollContainerRef.current;
      if (typeof (container == null ? void 0 : container.scrollBy) === "function") {
        container.scrollBy({ left, behavior: "smooth" });
      }
    },
    []
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "i-section-tabs",
    {
      class: [
        styleVariant === "bar" ? "i-section-tabs--bar" : null,
        className
      ].filter(Boolean).join(" "),
      ...rest,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: [
              "i-section-tabs-headers",
              sticky ? "i-section-tabs-headers--sticky" : null,
              headerClass
            ].filter(Boolean).join(" "),
            role: "tablist",
            style: sticky ? { "--i-section-tabs-sticky-top": stickyTopOffset } : void 0,
            children: [
              scrollable ? /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  "aria-label": "Scroll tabs left",
                  className: [
                    "i-section-tabs-chevron",
                    "i-section-tabs-chevron--left",
                    !showLeftChevron ? "hidden" : null
                  ].filter(Boolean).join(" "),
                  style: { minWidth: chevronWidth, width: chevronWidth },
                  type: "button",
                  onClick: () => scrollBy(-200),
                  children: /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "prev", size: chevronSize })
                }
              ) : null,
              /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  ref: scrollContainerRef,
                  className: [
                    "i-section-tabs-scroll",
                    scrollable ? "i-section-tabs-scroll--scrollable" : null
                  ].filter(Boolean).join(" "),
                  onScroll: checkOverflow,
                  children: tabs.map((tab, index) => {
                    const isActive = index === activeIndex;
                    return /* @__PURE__ */ jsxRuntime.jsx(
                      "button",
                      {
                        className: [
                          "i-section-tabs-header",
                          isActive ? "active" : null,
                          tabClass
                        ].filter(Boolean).join(" "),
                        role: "tab",
                        type: "button",
                        "aria-selected": isActive,
                        tabIndex: isActive ? 0 : -1,
                        style: tabMinHeight ? { minHeight: tabMinHeight } : void 0,
                        onClick: () => setActive(index, true),
                        onKeyDown: (event) => activateFromKeyboard(event, index),
                        children: tab.headerNode
                      },
                      tab.key
                    );
                  })
                }
              ),
              scrollable ? /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  "aria-label": "Scroll tabs right",
                  className: [
                    "i-section-tabs-chevron",
                    "i-section-tabs-chevron--right",
                    !showRightChevron ? "hidden" : null
                  ].filter(Boolean).join(" "),
                  style: { minWidth: chevronWidth, width: chevronWidth },
                  type: "button",
                  onClick: () => scrollBy(200),
                  children: /* @__PURE__ */ jsxRuntime.jsx(IIcon, { icon: "next", size: chevronSize })
                }
              ) : null
            ]
          }
        ),
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
      ]
    }
  );
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
    size = "md",
    labelPosition = "right",
    onChange,
    onTouched,
    children,
    className,
    ...rest
  } = props;
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
  const sizeStyle = React8.useMemo(() => {
    if (size === "md") return void 0;
    const designToken = `var(--i-size-${size})`;
    return {
      "--i-toggle-height": designToken,
      "--i-toggle-width": `calc(${designToken} * 1.75)`,
      "--i-toggle-handle-size": `calc(${designToken} - (var(--i-toggle-padding) * 2))`
    };
  }, [size]);
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
      class: hostClassName,
      size,
      style: sizeStyle,
      onClick: handleHostClick,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            ref: inputRef,
            className: "i-toggle__input",
            type: "checkbox",
            checked: currentChecked,
            disabled,
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

// src/components/environments/environment.ts
var environment = {
  production: false,
  releaseStage: "development",
  appName: "Insight UI",
  version: "1.0.2",
  api: {
    identity: "https://account-dev.paramountenterprise.co.id/api",
    user: "https://account-dev.paramountenterprise.co.id/api/v1/users",
    configuration: "https://account-dev.paramountenterprise.co.id/api/v1",
    application: "https://account-dev.paramountenterprise.co.id/api/v1/applications"
  },
  signinUrl: "https://account-dev.paramountenterprise.co.id/signin",
  authCallbackUrl: "https://account-dev.paramountenterprise.co.id/auth",
  cookieDomain: ".paramountenterprise.co.id",
  securityMode: true,
  tokenLifespan: {
    accessTokenSeconds: 3600,
    refreshTokenSeconds: 7200,
    ssoSessionMaxSeconds: 54e3
  },
  cookieSecure: true,
  csrfTokenMaxAgeSeconds: 7170,
  mfaChallengeSessionTimeoutSeconds: 300,
  allowedReturnOrigins: [
    "https://account-dev.paramountenterprise.co.id",
    "https://*.paramountenterprise.co.id"
  ]
};

// src/components/auth/auth-config.ts
function getDefaultInsightAuthConfig() {
  return {
    api: {
      identity: environment.api.identity,
      user: environment.api.user,
      configuration: environment.api.configuration,
      application: environment.api.application
    },
    signinUrl: environment.signinUrl,
    callbackPath: "/auth/callback",
    allowedReturnOrigins: [window.location.origin],
    cookieDomain: window.location.hostname,
    tokenLifespan: { ...environment.tokenLifespan },
    csrfTokenMaxAgeSeconds: environment.csrfTokenMaxAgeSeconds,
    apiKey: environment.apiKey,
    appId: environment.appId,
    unauthorizedHandling: "dialog"
  };
}
function resolveInsightAuthConfig(overrides) {
  const defaults = getDefaultInsightAuthConfig();
  return {
    ...defaults,
    ...overrides,
    api: { ...defaults.api, ...overrides == null ? void 0 : overrides.api },
    tokenLifespan: { ...defaults.tokenLifespan, ...overrides == null ? void 0 : overrides.tokenLifespan }
  };
}

// src/components/auth/sanitize-return-url.ts
function sanitizeReturnUrl(url, allowedReturnOrigins) {
  if (!url) {
    return { returnUrl: "/", isExternal: false };
  }
  if (url.startsWith("//")) {
    return { returnUrl: "/", isExternal: false };
  }
  if (url.startsWith("/")) {
    return { returnUrl: url, isExternal: false };
  }
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (isAllowedOrigin(parsed.origin, allowedReturnOrigins)) {
        return { returnUrl: url, isExternal: true };
      }
    } catch {
    }
  }
  return { returnUrl: "/", isExternal: false };
}
function isAllowedOrigin(origin, allowedReturnOrigins) {
  const allowed = allowedReturnOrigins ?? [];
  return allowed.some((pattern) => {
    const regexStr = pattern.split("*").map((segment) => segment.replace(/[.+^${}()|[\]\\]/g, "\\$&")).join("[^.]+");
    try {
      return new RegExp(`^${regexStr}$`, "i").test(origin);
    } catch {
      return origin === pattern;
    }
  });
}

// src/components/auth/build-signin-redirect-url.ts
function buildExternalSigninUrl(config, targetPath) {
  const callbackPath = config.callbackPath ?? "/auth/callback";
  const callbackUrl = `${window.location.origin}${callbackPath}?returnUrl=${encodeURIComponent(targetPath)}`;
  return `${config.signinUrl}?returnUrl=${encodeURIComponent(callbackUrl)}`;
}

// src/components/api/api.client.ts
async function normalizeFetchError(res, body) {
  const retryAfterHeader = res.headers.get("Retry-After");
  const parsedHeader = retryAfterHeader ? Number(retryAfterHeader) : NaN;
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const b = body;
    return {
      ...b,
      status: typeof b.status === "number" ? b.status : res.status,
      message: typeof b.message === "string" ? b.message : res.statusText,
      detail: (typeof b.detail === "string" ? b.detail : void 0) ?? (typeof b.title === "string" ? b.title : void 0) ?? res.statusText ?? "An error occurred",
      retryAfter: (typeof b.retryAfter === "number" ? b.retryAfter : void 0) ?? (Number.isFinite(parsedHeader) ? parsedHeader : void 0)
    };
  }
  return {
    status: res.status,
    message: res.statusText,
    detail: res.statusText || "An error occurred",
    retryAfter: Number.isFinite(parsedHeader) ? parsedHeader : void 0
  };
}
async function rawRequest(baseUrl, path, csrf, options = {}) {
  const method = options.method ?? "GET";
  const url = buildUrl2(baseUrl, path, options.params);
  const hasBody = options.body !== void 0;
  const headers = {
    Accept: "application/json",
    // Only send Content-Type when there is a body — a JSON Content-Type with an
    // EMPTY body is rejected by the backend (e.g. DELETE /me/menus/{id}/favorite).
    ...hasBody ? { "Content-Type": "application/json" } : {},
    ...options.headers ?? {}
  };
  const csrfToken = (csrf == null ? void 0 : csrf.getToken()) ?? null;
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  let res;
  try {
    res = await fetch(url, {
      method,
      credentials: "include",
      headers,
      body: options.body !== void 0 && method !== "GET" ? JSON.stringify(options.body) : void 0
    });
  } catch (err) {
    throw { status: 0, detail: "Network error", ...err };
  }
  const text = await res.text().catch(() => "");
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    throw await normalizeFetchError(res, body);
  }
  if (body === null || body === "") {
    return void 0;
  }
  return body;
}
function buildUrl2(baseUrl, path, params) {
  let url = `${baseUrl}${path}`;
  if (params) {
    const qs = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== void 0)
    ).toString();
    if (qs) {
      url += `${url.includes("?") ? "&" : "?"}${qs}`;
    }
  }
  return url;
}
var AUTH_SKIP_URLS = ["/auth/csrf", "/auth/refresh"];
var isAuthSkipUrl = (url) => AUTH_SKIP_URLS.some((skip) => url.includes(skip));
function createApiClient(deps) {
  const base = deps.config.api.identity;
  async function doRequest(path, method, body, options = {}) {
    const baseUrl = options.apiUrl ?? base;
    const skipAuth = isAuthSkipUrl(path) || options.skipBearer === true;
    const headers = { ...options.headers ?? {} };
    if (deps.config.apiKey) {
      headers["Api-Key"] = deps.config.apiKey;
    }
    const token = deps.session.getAccessToken();
    if (!skipAuth && token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      return await rawRequest(baseUrl, path, deps.csrf, {
        method,
        body: method === "DELETE" && body !== void 0 ? body : body,
        headers,
        params: options.params
      });
    } catch (err) {
      const error = err;
      if (skipAuth || error.status !== 401) {
        throw error;
      }
      const newToken = await deps.session.refreshToken().catch((refreshErr) => {
        var _a;
        (_a = deps.onSessionExpired) == null ? void 0 : _a.call(deps, refreshErr);
        throw refreshErr;
      });
      if (!headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${newToken}`;
      }
      return rawRequest(baseUrl, path, deps.csrf, { method, body, headers, params: options.params });
    }
  }
  return {
    get: (path, options) => doRequest(path, "GET", void 0, options),
    post: (path, body, options) => doRequest(path, "POST", body, options),
    put: (path, body, options) => doRequest(path, "PUT", body, options),
    patch: (path, body, options) => doRequest(path, "PATCH", body, options),
    delete: (path, options) => doRequest(path, "DELETE", options == null ? void 0 : options.body, options)
  };
}

// src/components/auth/auth.service.ts
var MAX_LOGIN_ATTEMPTS = 5;
var LOCKOUT_DURATION_MS = 1 * 60 * 1e3;
var IDLE_RESET_MS = 12 * 60 * 60 * 1e3;
var LOCK_STORAGE_KEY = "iam.mock.login_lockout";
var AuthService = class {
  config;
  csrf;
  constructor(config, csrf) {
    this.config = config;
    this.csrf = csrf;
  }
  get identityUrl() {
    return this.config.api.identity;
  }
  async login(username, password, recaptchaToken, isChallengeResponse) {
    const cleanUsername = username.trim().toLowerCase();
    const lockData = this.getLockoutData(cleanUsername);
    if (lockData.lockedUntil && lockData.lockedUntil > Date.now()) {
      const retryAfter = Math.ceil((lockData.lockedUntil - Date.now()) / 1e3);
      throw {
        status: 423,
        message: "Login access is temporarily restricted. Please try again in a few moments.",
        detail: "Login access is temporarily restricted. Please try again in a few moments.",
        retryAfter
      };
    }
    try {
      const res = await rawRequest(this.identityUrl, "/auth/login", this.csrf, {
        method: "POST",
        body: {
          username,
          password,
          recaptchaToken,
          isChallengeResponse: isChallengeResponse ?? false
        }
      });
      if (res.accessToken || res.mfaRequired || res.passwordExpired) {
        this.resetLockout(cleanUsername);
      }
      return res;
    } catch (err) {
      const error = err;
      if (error.status === 401 || error.status === 423) {
        this.recordFailedAttempt(cleanUsername);
      }
      throw error;
    }
  }
  /** Silently refresh the access token via the HttpOnly refresh-token cookie. */
  refresh() {
    return rawRequest(this.identityUrl, "/auth/refresh", this.csrf, {
      method: "POST",
      body: {}
    });
  }
  /** Clear the server-side session and expire the HttpOnly refresh cookie. */
  async logout(refreshToken) {
    await rawRequest(this.identityUrl, "/auth/logout", this.csrf, {
      method: "POST",
      body: { refreshToken }
    });
  }
  /** Exchange a short-lived `at=` auth token for a full session (cross-app handoff). */
  exchangeAuthToken(authToken) {
    return rawRequest(this.identityUrl, "/auth/exchange", this.csrf, {
      method: "POST",
      body: {},
      headers: { Authorization: authToken }
    });
  }
  /** Verify the MFA TOTP code during a login challenge. */
  verifyMfaChallenge(mfaSessionId, totpCode) {
    return rawRequest(this.identityUrl, "/auth/mfa/verify", this.csrf, {
      method: "POST",
      body: { mfaSessionId, totpCode }
    });
  }
  /** Verify the TOTP code during first-time MFA enrollment (forced at login). */
  verifyMfaEnroll(mfaSessionId, totpCode) {
    return rawRequest(this.identityUrl, "/auth/mfa/enroll/verify", this.csrf, {
      method: "POST",
      body: { mfaSessionId, totpCode }
    });
  }
  /** Self-service MFA — check enrollment status (`GET /profile/mfa`). */
  selfServiceGetStatus() {
    return rawRequest(
      this.identityUrl,
      "/profile/mfa",
      this.csrf,
      { method: "GET" }
    );
  }
  /** Self-service MFA — initiate enrollment to get the QR & session id (`POST /profile/mfa/enroll`). */
  selfServiceEnrollInitiate() {
    return rawRequest(
      this.identityUrl,
      "/profile/mfa/enroll",
      this.csrf,
      { method: "POST", body: {} }
    );
  }
  /** Self-service MFA — verify OTP and complete enrollment (`POST /profile/mfa/enroll/verify`). */
  async selfServiceEnrollVerify(enrollmentSessionId, totpCode) {
    await rawRequest(this.identityUrl, "/profile/mfa/enroll/verify", this.csrf, {
      method: "POST",
      body: { enrollmentSessionId, totpCode }
    });
  }
  /** Self-service reset (un-enroll) MFA for the current user — requires password (`DELETE /profile/mfa`). */
  async selfServiceResetMfa(userSub, password) {
    await rawRequest(this.identityUrl, "/profile/mfa", this.csrf, {
      method: "DELETE",
      body: { password, userSub }
    });
  }
  /**
   * Change password when it has expired (forced change flow). Uses a short-lived
   * `changePasswordToken` (10 min, scope `change_password_only`) as the Bearer
   * header. Backend returns a full accessToken on success so the user continues
   * seamlessly without re-login.
   */
  changePassword(changePasswordToken, newPassword, confirmPassword) {
    return rawRequest(
      this.identityUrl,
      "/auth/change-password",
      this.csrf,
      {
        method: "POST",
        body: { newPassword, confirmPassword },
        headers: { Authorization: `Bearer ${changePasswordToken}` }
      }
    );
  }
  /** Request a password-reset link via email or WhatsApp (`POST /auth/forgot-password`). */
  forgotPassword(identifier, mode) {
    return rawRequest(this.identityUrl, "/auth/forgot-password", this.csrf, {
      method: "POST",
      body: { identifier, method: mode }
    });
  }
  /** Validate a reset token before showing the reset form (`GET /auth/reset-password/validate`). */
  validateResetToken(token) {
    return rawRequest(this.identityUrl, "/auth/reset-password/validate", this.csrf, {
      method: "GET",
      params: { token }
    });
  }
  /** Submit a new password using the reset token (`POST /auth/reset-password`). */
  resetPassword(token, newPassword, confirmPassword) {
    return rawRequest(this.identityUrl, "/auth/reset-password", this.csrf, {
      method: "POST",
      body: { token, newPassword, confirmPassword }
    });
  }
  // ─── Login lockout helpers (sessionStorage per-username) ─────────────────────
  getLockoutData(username) {
    try {
      const raw = sessionStorage.getItem(`${LOCK_STORAGE_KEY}_${username}`);
      const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null, lastAttemptAt: null };
      if (data.lastAttemptAt && Date.now() - data.lastAttemptAt >= IDLE_RESET_MS) {
        return { attempts: 0, lockedUntil: null, lastAttemptAt: null };
      }
      return data;
    } catch {
      return { attempts: 0, lockedUntil: null, lastAttemptAt: null };
    }
  }
  recordFailedAttempt(username) {
    const data = this.getLockoutData(username);
    data.attempts += 1;
    data.lastAttemptAt = Date.now();
    if (data.attempts >= MAX_LOGIN_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      data.attempts = 0;
    }
    sessionStorage.setItem(`${LOCK_STORAGE_KEY}_${username}`, JSON.stringify(data));
  }
  resetLockout(username) {
    sessionStorage.removeItem(`${LOCK_STORAGE_KEY}_${username}`);
  }
};
function extractAccessTokenFromHash(hash) {
  const current = hash ?? window.location.hash;
  if (!current || current.length < 2) {
    return null;
  }
  const params = new URLSearchParams(current.substring(1));
  return params.get("at");
}
function AuthCallback() {
  const { config, session } = useInsightAuth();
  const location = reactRouterDom.useLocation();
  const navigate = reactRouterDom.useNavigate();
  const [handled, setHandled] = React8.useState(false);
  React8.useEffect(() => {
    if (handled) return;
    setHandled(true);
    const accessToken = extractAccessTokenFromHash(window.location.hash);
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (!accessToken) {
      window.location.href = config.signinUrl;
      return;
    }
    session.setAccessToken(accessToken);
    const rawReturnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";
    const { returnUrl, isExternal } = sanitizeReturnUrl(
      rawReturnUrl,
      config.allowedReturnOrigins
    );
    const callbackPath = config.callbackPath ?? "/auth/callback";
    const safeReturnUrl = !isExternal && returnUrl.startsWith(callbackPath) ? "/" : returnUrl;
    if (isExternal) {
      window.location.href = returnUrl;
    } else {
      void navigate(safeReturnUrl, { replace: true });
    }
  }, [handled, config, session, navigate, location]);
  return null;
}

// src/components/csrf/csrf.service.ts
var CsrfService = class {
  config;
  /** In-memory CSRF token — retrieved from the backend response body, never from document.cookie directly. */
  token = null;
  tokenFetchedAt = null;
  constructor(config) {
    this.config = config;
  }
  /**
   * Return the in-memory CSRF token, or `null` if never fetched or expired
   * (expiry triggers callers to re-invoke `ensureToken()`).
   */
  getToken() {
    if (this.token && this.isTokenExpired()) {
      return null;
    }
    return this.token;
  }
  /** Whether the in-memory token has exceeded its TTL (`csrfTokenMaxAgeSeconds`). */
  isTokenExpired() {
    if (this.tokenFetchedAt === null) {
      return false;
    }
    const maxAgeMs = (this.config.csrfTokenMaxAgeSeconds ?? 7170) * 1e3;
    return Date.now() - this.tokenFetchedAt >= maxAgeMs;
  }
  /**
   * Fetch a fresh CSRF token from `iam-identity-api` and store it in memory.
   * On failure the error is propagated — a failed fetch must not be silently
   * swallowed.
   */
  async ensureToken() {
    const res = await fetch(`${this.config.api.identity}/auth/csrf`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`CSRF fetch failed (${res.status})`);
    }
    const body = await res.json().catch(() => null);
    this.token = (body == null ? void 0 : body.csrfToken) ?? null;
    this.tokenFetchedAt = Date.now();
  }
};

// src/components/session-expired/session-expired.service.ts
var valueAt = (value, key) => {
  if (typeof value !== "object" || value === null) {
    return void 0;
  }
  const candidate = value[key];
  return typeof candidate === "string" && candidate.length > 0 ? candidate : void 0;
};
var extractProblemDetailsErrorCode = (error) => {
  if (error === null || error === void 0) {
    return void 0;
  }
  const problem = error;
  return problem.errorCode ?? problem.code ?? valueAt(error == null ? void 0 : error.error, "errorCode") ?? valueAt(error == null ? void 0 : error.error, "code");
};
var toSessionExpiredReason = (errorCode) => {
  switch (errorCode) {
    case "AUTH_TOKEN_EXPIRED":
    case "TOKEN_EXPIRED":
    case "AUTH_NO_SESSION":
      return "TOKEN_EXPIRED";
    case "AUTH_SESSION_REVOKED":
    case "SESSION_REVOKED":
      return "SESSION_REVOKED";
    case "AUTH_SESSION_REPLACED":
    case "SESSION_REPLACED":
      return "SESSION_REPLACED";
    default:
      return void 0;
  }
};
var isSessionExpiredError = (error) => {
  const status = error == null ? void 0 : error.status;
  if (status === 401 || status === 498) {
    return true;
  }
  return toSessionExpiredReason(extractProblemDetailsErrorCode(error)) !== void 0;
};
var SessionExpiredService = class {
  visibleValue = false;
  returnUrlValue = "/";
  reasonValue = void 0;
  errorCodeValue = null;
  detailValue = null;
  version = 0;
  listeners = /* @__PURE__ */ new Set();
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = () => this.version;
  notify() {
    this.version++;
    this.listeners.forEach((listener) => listener());
  }
  get visible() {
    return this.visibleValue;
  }
  get returnUrl() {
    return this.returnUrlValue;
  }
  get reason() {
    return this.reasonValue;
  }
  get errorCode() {
    return this.errorCodeValue;
  }
  get detail() {
    return this.detailValue;
  }
  show(returnUrl, reason, errorCode, detail) {
    this.returnUrlValue = returnUrl || "/";
    this.reasonValue = reason;
    this.errorCodeValue = errorCode ?? null;
    this.detailValue = detail ?? null;
    this.visibleValue = true;
    this.notify();
  }
  hide() {
    this.visibleValue = false;
    this.notify();
  }
};
var sessionExpiredService = new SessionExpiredService();

// src/components/session/session.service.ts
function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
    const json = decodeURIComponent(
      atob(padded).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function decodeUser(accessToken) {
  const decoded = decodeJwtPayload(accessToken);
  const realmAccess = decoded == null ? void 0 : decoded["realm_access"];
  const roles = Array.isArray(realmAccess == null ? void 0 : realmAccess.roles) ? realmAccess.roles : [];
  return {
    sub: typeof (decoded == null ? void 0 : decoded["sub"]) === "string" ? decoded["sub"] : "",
    email: typeof (decoded == null ? void 0 : decoded["email"]) === "string" ? decoded["email"] : "",
    name: typeof (decoded == null ? void 0 : decoded["name"]) === "string" ? decoded["name"] : "",
    roles,
    userType: (decoded == null ? void 0 : decoded["user_type"]) === "external" ? "external" : "internal"
  };
}
var SessionService = class {
  config;
  authService;
  csrf;
  sessionExpiredService;
  // In-memory token storage — intentionally NOT persisted to Web Storage.
  accessToken = null;
  _refreshToken = null;
  expiresAt = null;
  sessionStartedAt = null;
  currentUser = null;
  passwordExpired = false;
  changePasswordTokenValue = null;
  lastVerifiedAt = 0;
  initializingValue = true;
  refreshInFlight = null;
  restoreInFlight = null;
  version = 0;
  listeners = /* @__PURE__ */ new Set();
  constructor(config, authService, csrf, sessionExpiredService2) {
    this.config = config;
    this.authService = authService;
    this.csrf = csrf;
    this.sessionExpiredService = sessionExpiredService2;
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = () => this.version;
  notify() {
    this.version++;
    this.listeners.forEach((listener) => listener());
  }
  /**
   * True while the app is restoring/validating the session on load (starts
   * `true` on cold start so guards can allow navigation during the restore and
   * consumer apps can show a loading state). Cleared once the session is
   * established (`setAccessToken`/`setSession`) or `tryRestoreSession()` settles.
   */
  get initializing() {
    return this.initializingValue;
  }
  isAuth() {
    return !!this.accessToken && !this.isTokenExpired() && !this.isSsoSessionExpired();
  }
  isTokenExpired() {
    if (!this.accessToken || this.expiresAt === null) {
      return true;
    }
    return Date.now() >= this.expiresAt;
  }
  /**
   * Whether the max SSO session duration has been exceeded (default 15h,
   * configured via `tokenLifespan.ssoSessionMaxSeconds`). After this, the
   * user must re-authenticate regardless of token state.
   */
  isSsoSessionExpired() {
    if (this.sessionStartedAt === null) {
      return false;
    }
    const maxDurationMs = this.config.tokenLifespan.ssoSessionMaxSeconds * 1e3;
    return Date.now() - this.sessionStartedAt >= maxDurationMs;
  }
  isPasswordExpired() {
    return this.passwordExpired;
  }
  clearPasswordExpired() {
    this.passwordExpired = false;
  }
  setPasswordExpired() {
    this.passwordExpired = true;
  }
  setChangePasswordToken(token) {
    this.changePasswordTokenValue = token;
    sessionStorage.setItem("iam.changePasswordToken", token);
  }
  getChangePasswordToken() {
    if (this.changePasswordTokenValue) {
      return this.changePasswordTokenValue;
    }
    const stored = sessionStorage.getItem("iam.changePasswordToken");
    if (stored) {
      this.changePasswordTokenValue = stored;
      return stored;
    }
    return null;
  }
  clearChangePasswordToken() {
    this.changePasswordTokenValue = null;
    sessionStorage.removeItem("iam.changePasswordToken");
  }
  getAccessToken() {
    return this.accessToken;
  }
  getRefreshToken() {
    return this._refreshToken;
  }
  getUser() {
    return this.currentUser;
  }
  /** Role-membership check against the decoded token roles (ANY match). */
  hasMn(mn) {
    const roles = this.getRoles();
    if (Array.isArray(mn)) {
      return mn.some((m) => roles.includes(m));
    }
    return roles.includes(mn);
  }
  /**
   * Roles claimed by the current access token (Keycloak `realm_access.roles`).
   * Returns an empty array while no token is set. Used by role-mode permission
   * checks.
   */
  getRoles() {
    var _a;
    if (!this.accessToken) {
      return [];
    }
    const decoded = decodeJwtPayload(this.accessToken);
    const roles = (_a = decoded == null ? void 0 : decoded.realm_access) == null ? void 0 : _a.roles;
    return Array.isArray(roles) ? roles.filter((role) => typeof role === "string") : [];
  }
  /** True if the current access token claims ANY of the given roles. */
  hasRole(code) {
    const roles = this.getRoles();
    if (Array.isArray(code)) {
      return code.some((role) => roles.includes(role));
    }
    return roles.includes(code);
  }
  /**
   * Store the access token received from the SSO handoff (URL hash fragment)
   * or from a refresh response. `expiresIn` (seconds) defaults to the token's
   * own `exp` claim, then falls back to the configured `accessTokenSeconds`.
   */
  setAccessToken(accessToken, expiresIn) {
    this.accessToken = accessToken;
    const effectiveExpiresIn = expiresIn ?? this.readExpiresInFromToken(accessToken) ?? this.config.tokenLifespan.accessTokenSeconds;
    this.expiresAt = Date.now() + (effectiveExpiresIn - 30) * 1e3;
    if (this.sessionStartedAt === null) {
      this.sessionStartedAt = Date.now();
    }
    this.initializingValue = false;
    this.notify();
  }
  /**
   * Full session establishment (login / MFA / exchange / refresh). Sets the
   * user, decodes password-expiry claims, stamps the last-verified time, and
   * marks an active session so `tryRestoreSession()` can distinguish a cold
   * start from a refresh-after-revocation.
   */
  setSession(accessToken, expiresIn, user, refreshToken) {
    this.accessToken = accessToken;
    if (refreshToken) {
      this._refreshToken = refreshToken;
    }
    this.expiresAt = Date.now() + (expiresIn - 30) * 1e3;
    this.currentUser = user;
    this.sessionStartedAt = Date.now();
    const decoded = decodeJwtPayload(accessToken);
    const neverExpired = (decoded == null ? void 0 : decoded["never_expired"]) === true;
    const pwdExpired = (decoded == null ? void 0 : decoded["pwd_expired"]) === true;
    this.passwordExpired = !neverExpired && pwdExpired;
    sessionStorage.setItem("iam.session.active", "true");
    this.lastVerifiedAt = Date.now();
    this.initializingValue = false;
    this.notify();
  }
  clearSession() {
    this.accessToken = null;
    this._refreshToken = null;
    this.expiresAt = null;
    this.currentUser = null;
    this.passwordExpired = false;
    this.sessionStartedAt = null;
    this.changePasswordTokenValue = null;
    sessionStorage.removeItem("iam.changePasswordToken");
    this.notify();
  }
  /**
   * Clears the client-side session AND invalidates the server-side session by
   * revoking the refresh token. Resolves after the server logout call finishes
   * (or fails — failures are swallowed so the user is never stuck on a logout
   * page).
   */
  async logout() {
    const refreshToken = this._refreshToken ?? void 0;
    this.clearSession();
    sessionStorage.removeItem("iam.session.active");
    try {
      await this.csrf.ensureToken();
    } catch {
    }
    try {
      await this.authService.logout(refreshToken);
    } catch {
    }
  }
  /**
   * Silently refresh the access token via the HttpOnly refresh cookie
   * (`POST {api.identity}/auth/refresh`, `credentials: 'include'`).
   * Single-flight: concurrent callers share the in-flight refresh.
   */
  refreshToken() {
    if (this.refreshInFlight) {
      return this.refreshInFlight;
    }
    const inFlight = this.authService.refresh().then((res) => {
      this.setSession(
        res.accessToken,
        res.expiresIn,
        this.currentUser ?? decodeUser(res.accessToken),
        res.refreshToken
      );
      return res.accessToken;
    }).catch((err) => {
      console.warn("[@insight/ui][SESSION] silent refresh failed", {
        status: err == null ? void 0 : err.status,
        errorCode: extractProblemDetailsErrorCode(err)
      });
      throw err;
    }).finally(() => {
      this.refreshInFlight = null;
    });
    this.refreshInFlight = inFlight;
    return inFlight;
  }
  /** True if the session was verified against the backend within `cooldownMs` (default 30s). */
  isRecentlyVerified(cooldownMs = 3e4) {
    return !!this.accessToken && Date.now() - this.lastVerifiedAt < cooldownMs;
  }
  /**
   * Proactive session validation for guards. Refreshes the token to check
   * session validity WITHOUT resetting the SSO session timer. Skips the refresh
   * if the last check was within 30 seconds.
   */
  async proactiveValidate() {
    if (this.isRecentlyVerified()) {
      return this.accessToken;
    }
    const savedStartedAt = this.sessionStartedAt;
    const token = await this.refreshToken();
    this.sessionStartedAt = savedStartedAt;
    return token;
  }
  /**
   * Cold-start session restore from the HttpOnly cookie (called on app load).
   * Skips non-signin auth sub-pages (forgot/reset password, MFA, callback).
   * The signin page ALWAYS attempts the silent refresh. Shows the
   * session-expired overlay when refreshing after a previously-active session.
   * Returns the reason (if any) extracted from the error so the guard can
   * decide overlay vs. signin.
   */
  tryRestoreSession() {
    if (this.restoreInFlight) {
      return this.restoreInFlight;
    }
    const pathname = window.location.pathname ?? "";
    const isSigninPage = /^\/auth\/signin$|^\/signin$/i.test(pathname);
    const isOtherAuthPage = /^\/auth(\/|$)|^\/forgot-password|^\/reset-password/i.test(pathname) && !isSigninPage;
    if (isOtherAuthPage) {
      this.initializingValue = false;
      return Promise.resolve({});
    }
    const restorePromise = this.authService.refresh().then((res) => {
      this.setSession(res.accessToken, res.expiresIn, decodeUser(res.accessToken), res.refreshToken);
      return {};
    }).catch((err) => {
      console.debug("[@insight/ui][SESSION] tryRestoreSession: FAILED", {
        status: err == null ? void 0 : err.status
      });
      const rawErrorCode = extractProblemDetailsErrorCode(err);
      const code = toSessionExpiredReason(rawErrorCode);
      const wasActive = sessionStorage.getItem("iam.session.active") === "true";
      const isAuthPage = /^\/auth(\/|$)|^\/signin$|^\/logout$/i.test(pathname);
      if (wasActive && !isAuthPage && isSessionExpiredError(err)) {
        this.sessionExpiredService.show(
          pathname,
          code ?? "TOKEN_EXPIRED",
          rawErrorCode,
          err == null ? void 0 : err.detail
        );
      }
      if (isSessionExpiredError(err)) {
        this.authService.logout().catch(() => void 0);
      }
      return { reason: code };
    });
    const safetyTimer = new Promise(
      (resolve) => setTimeout(() => resolve({}), 1e4)
    );
    this.restoreInFlight = Promise.race([restorePromise, safetyTimer]).finally(() => {
      this.initializingValue = false;
      this.notify();
    });
    return this.restoreInFlight;
  }
  readExpiresInFromToken(token) {
    const decoded = decodeJwtPayload(token);
    if (!decoded || typeof decoded["exp"] !== "number") {
      return null;
    }
    return Math.max(0, decoded["exp"] - Math.floor(Date.now() / 1e3));
  }
};

// src/components/user/user.mapper.ts
function mapToSidebarUser(user) {
  return {
    employeeCode: user.employeeCode ?? user.username ?? "",
    fullName: user.fullName ?? user.username ?? "",
    userImagePath: user.photoUrl ?? ""
  };
}
function toIMenu(node) {
  var _a, _b;
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    menuCode: node.menuCode,
    route: node.route,
    icon: node.icon,
    openIn: node.openIn,
    application: node.application ? { ...node.application } : null,
    companies: ((_a = node.companies) == null ? void 0 : _a.map((company) => ({ ...company }))) ?? [],
    isFavorite: node.isFavorite,
    children: ((_b = node.children) == null ? void 0 : _b.map(toIMenu)) ?? []
  };
}
function toIMenus(nodes) {
  return (nodes ?? []).map(toIMenu);
}
function toIMenuFavorite(item) {
  var _a;
  return {
    id: item.id,
    name: item.name,
    menuCode: item.menuCode,
    route: item.route,
    icon: item.icon,
    openIn: item.openIn,
    application: item.application ? { ...item.application } : null,
    companies: ((_a = item.companies) == null ? void 0 : _a.map((company) => ({ ...company }))) ?? [],
    isFavorite: true
  };
}
function collectMenuCodes(menus) {
  const codes = /* @__PURE__ */ new Set();
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.menuCode) {
        codes.add(node.menuCode);
      }
      walk(getMenuChildren(node));
    }
  };
  walk(menus);
  return [...codes];
}
function hasAnyMenuCode(menus, code) {
  const codes = new Set(collectMenuCodes(menus));
  if (Array.isArray(code)) {
    return code.some((item) => codes.has(item));
  }
  return codes.has(code);
}
function findFirstLeafRoute(menus) {
  for (const menu of menus) {
    if (isLeafItem(menu)) {
      const route = getMenuRoute(menu);
      if (route) {
        return route;
      }
    }
    const childRoute = findFirstLeafRoute(getMenuChildren(menu));
    if (childRoute) {
      return childRoute;
    }
  }
  return null;
}
function findMenuNameById(menus, menuId) {
  for (const menu of menus) {
    if (getMenuKey(menu) === menuId) {
      const label = getMenuLabel(menu);
      return label || null;
    }
    const child = findMenuNameById(getMenuChildren(menu), menuId);
    if (child) {
      return child;
    }
  }
  return null;
}

// src/components/user/user-menu.service.ts
var UserMenuService = class {
  config;
  api;
  constructor(config, api) {
    this.config = config;
    this.api = api;
  }
  get baseUrl() {
    return this.config.api["user"] ?? environment.api.user;
  }
  /** GET `{api.user}/me/menus` — effective navigation tree for one or all active applications. */
  async getEffectiveMenus(applicationId) {
    const id = applicationId ?? this.config.appId;
    const response = await this.api.get("/me/menus", {
      apiUrl: this.baseUrl,
      params: id ? { applicationId: id } : void 0
    });
    return response.data;
  }
  /** GET `{api.user}/me/menus/favorites` — effective favorite items, sorted by name. */
  async getFavorites(applicationId) {
    const id = applicationId ?? this.config.appId;
    const response = await this.api.get("/me/menus/favorites", {
      apiUrl: this.baseUrl,
      params: id ? { applicationId: id } : void 0
    });
    return response.data;
  }
  /** PUT `{api.user}/me/menus/{menuId}/favorite` — pin an effective menu item (204 No Content). */
  addFavorite(menuId) {
    return this.api.put(`/me/menus/${menuId}/favorite`, {}, { apiUrl: this.baseUrl });
  }
  /** DELETE `{api.user}/me/menus/{menuId}/favorite` — unpin a menu item (204 No Content). */
  removeFavorite(menuId) {
    return this.api.delete(`/me/menus/${menuId}/favorite`, { apiUrl: this.baseUrl });
  }
  /**
   * PUT `{api.user}/me/menus/favorites` — atomically replace the complete
   * favorite collection after a drag-drop. `displayOrder` values form the
   * complete sequence 1..n. Returns 204 No Content.
   */
  async reorderFavorites(menuIds) {
    const items = menuIds.map((menuId, index) => ({
      menuId: String(menuId),
      displayOrder: index + 1
    }));
    await this.api.put("/me/menus/favorites", { items }, { apiUrl: this.baseUrl });
  }
};

// src/components/user/current-user.service.ts
var CurrentUserService = class {
  config;
  api;
  constructor(config, api) {
    this.config = config;
    this.api = api;
  }
  get baseUrl() {
    return this.config.api["user"] ?? environment.api.user;
  }
  /** GET `{api.user}/users/user` — raw current-user DTO. Override `T` to use your own response type. */
  getCurrentUser() {
    return this.api.get("/users/user", { apiUrl: this.baseUrl });
  }
};

// src/components/store/user-menu.store.ts
var UserMenuStore = class {
  currentUserService;
  menuService;
  session;
  currentUserValue = null;
  rawCurrentUserValue = null;
  menusValue = [];
  favoritesValue = [];
  rolesValue = [];
  initializingValue = false;
  loadErrorValue = null;
  version = 0;
  listeners = /* @__PURE__ */ new Set();
  constructor(currentUserService, menuService, session) {
    this.currentUserService = currentUserService;
    this.menuService = menuService;
    this.session = session;
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = () => this.version;
  notify() {
    this.version++;
    this.listeners.forEach((listener) => listener());
  }
  /** Sidebar-shaped current user (`IUser`) — `null` until loaded. */
  get currentUser() {
    return this.currentUserValue;
  }
  /** Raw current-user DTO as returned by the backend — `null` until loaded. */
  get rawCurrentUser() {
    return this.rawCurrentUserValue;
  }
  /** Effective navigation tree (`IMenu` modern shape). */
  get menus() {
    return this.menusValue;
  }
  /** Favorite menus (`IMenu` modern shape). */
  get favorites() {
    return this.favoritesValue;
  }
  /** Roles decoded from the access token (for `source: 'role'` permission checks). */
  get roles() {
    return this.rolesValue;
  }
  /** True while the cold-start `load()` is in flight. */
  get initializing() {
    return this.initializingValue;
  }
  /** First error encountered during `load()`, if any (e.g. `menus: ...`). */
  get loadError() {
    return this.loadErrorValue;
  }
  /**
   * Post-login default landing (when no return URL is present).
   * Order: (1) first navigable favorite route, (2) first navigable menu route.
   */
  get defaultRoute() {
    return findFirstLeafRoute(this.favoritesValue) ?? findFirstLeafRoute(this.menusValue);
  }
  /** Finds a menu node's display name by id (recursive), or null. */
  findMenuName(menuId) {
    return findMenuNameById(this.menusValue, menuId);
  }
  /**
   * Cold-start: fetch user + menus + favorites concurrently. A failure in one
   * branch does not block the others; `initializing` clears once all settle.
   * Resolves when the load settles, so callers can await it (e.g. to navigate
   * to `defaultRoute` after login).
   */
  async load() {
    if (this.initializingValue) {
      await this.waitUntilSettled();
      return;
    }
    this.initializingValue = true;
    this.loadErrorValue = null;
    this.rolesValue = this.session.getRoles();
    this.notify();
    await Promise.all([
      this.loadUserInternal().catch((err) => this.recordError("user", err)),
      this.loadMenusInternal().catch((err) => this.recordError("menus", err)),
      this.loadFavoritesInternal().catch((err) => this.recordError("favorites", err))
    ]);
    this.initializingValue = false;
    this.notify();
  }
  async waitUntilSettled() {
    while (this.initializingValue) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  /** Refresh roles from the current access token (call after login / token change). */
  syncRoles() {
    this.rolesValue = this.session.getRoles();
    this.notify();
  }
  /** Menu-mode permission check against the in-memory menu codes (ANY match). */
  hasMenu(code) {
    return hasAnyMenuCode(this.menusValue, code);
  }
  /** Role-mode permission check against the in-memory roles. ANY match. */
  hasRole(code) {
    const roles = this.rolesValue;
    if (Array.isArray(code)) {
      return code.some((role) => roles.includes(role));
    }
    return roles.includes(code);
  }
  /**
   * Pin (`isFavorite: true`) or unpin a menu item. Flips the star icon in the
   * `menus` tree immediately (optimistic), calls the backend, then re-fetches
   * favorites so the server remains the source of truth. The menu-star change
   * is reverted on error.
   */
  async toggleFavorite(menuId, isFavorite) {
    const previousMenus = this.menusValue;
    this.menusValue = this.applyMenuFavorite(previousMenus, menuId, isFavorite);
    this.notify();
    const call = isFavorite ? this.menuService.addFavorite(menuId) : this.menuService.removeFavorite(menuId);
    try {
      await call;
      await this.reloadFavorites();
    } catch (err) {
      this.menusValue = previousMenus;
      this.notify();
      throw err;
    }
  }
  /**
   * Persists the new favorite order after a drag-drop. Reorders the in-memory
   * `favorites` locally (optimistic) and calls the backend — no GET refetch
   * after the write. The local change is reverted on error.
   */
  async reorderFavorites(menuIds) {
    const previous = this.favoritesValue;
    this.favoritesValue = this.applyFavoriteReorder(previous, menuIds);
    this.notify();
    try {
      await this.menuService.reorderFavorites(menuIds);
    } catch (err) {
      this.favoritesValue = previous;
      this.notify();
      throw err;
    }
  }
  /** Re-fetches the favorites from the backend (manual refresh). */
  async reloadFavorites() {
    await this.loadFavoritesInternal();
  }
  /**
   * Loads the effective navigation tree into `menus` — for one application
   * (`applicationId`) or all active applications when omitted. Returns the
   * mapped `IMenu[]`.
   */
  async loadMenus(applicationId) {
    const nodes = await this.menuService.getEffectiveMenus(applicationId);
    const mapped = toIMenus(nodes);
    this.menusValue = mapped;
    this.notify();
    return mapped;
  }
  /** Loads favorites into `favorites` — optionally for a single application. Returns the mapped `IMenu[]`. */
  async loadFavorites(applicationId) {
    const items = await this.menuService.getFavorites(applicationId);
    const mapped = items.map(toIMenuFavorite);
    this.favoritesValue = mapped;
    this.notify();
    return mapped;
  }
  /** Returns a new menu tree with the matching node's `isFavorite` flipped (star icon). */
  applyMenuFavorite(menus, menuId, isFavorite) {
    return menus.map((menu) => {
      var _a, _b;
      if (getMenuKey(menu) === menuId) {
        return { ...menu, isFavorite };
      }
      if ((_a = menu.children) == null ? void 0 : _a.length) {
        return { ...menu, children: this.applyMenuFavorite(menu.children, menuId, isFavorite) };
      }
      if ((_b = menu.child) == null ? void 0 : _b.length) {
        return { ...menu, child: this.applyMenuFavorite(menu.child, menuId, isFavorite) };
      }
      return menu;
    });
  }
  applyFavoriteReorder(favorites, menuIds) {
    const byId = new Map(favorites.map((favorite) => [String(getMenuKey(favorite)), favorite]));
    const ordered = [];
    const seen = /* @__PURE__ */ new Set();
    for (const id of menuIds) {
      const item = byId.get(String(id));
      if (item) {
        ordered.push(item);
        seen.add(String(id));
      }
    }
    for (const favorite of favorites) {
      if (!seen.has(String(getMenuKey(favorite)))) {
        ordered.push(favorite);
      }
    }
    return ordered;
  }
  async loadUserInternal() {
    const raw = await this.currentUserService.getCurrentUser();
    this.rawCurrentUserValue = raw;
    this.currentUserValue = mapToSidebarUser(raw);
    this.notify();
  }
  async loadMenusInternal() {
    await this.loadMenus();
  }
  async loadFavoritesInternal() {
    await this.loadFavorites();
  }
  recordError(source, err) {
    const detail = (err == null ? void 0 : err.detail) ?? "Failed to load";
    this.loadErrorValue = `${source}: ${detail}`;
    console.error(`[@insight/ui][STORE] load "${source}" failed`, err);
    this.notify();
  }
};
function InsightAuthProvider({
  config,
  children
}) {
  const resolved = React8.useMemo(() => resolveInsightAuthConfig(config), [config]);
  const [services] = React8.useState(() => {
    const csrf = new CsrfService(resolved);
    const auth = new AuthService(resolved, csrf);
    const sessionExpired = new SessionExpiredService();
    const session = new SessionService(resolved, auth, csrf, sessionExpired);
    const api = createApiClient({
      config: resolved,
      csrf,
      session,
      onSessionExpired: (err) => {
        if (resolved.onUnauthorized) {
          resolved.onUnauthorized(err);
          return;
        }
        const errorCode = extractProblemDetailsErrorCode(err);
        const reason = toSessionExpiredReason(errorCode);
        const showDialog = (resolved.unauthorizedHandling ?? "dialog") === "dialog";
        if (reason && showDialog) {
          sessionExpired.show(
            window.location.pathname,
            reason,
            errorCode,
            err == null ? void 0 : err.detail
          );
        } else {
          session.clearSession();
          const targetPath = window.location.pathname + window.location.search;
          window.location.href = buildExternalSigninUrl(resolved, targetPath);
        }
      }
    });
    const currentUserService = new CurrentUserService(resolved, api);
    const userMenuService = new UserMenuService(resolved, api);
    const userMenuStore = new UserMenuStore(currentUserService, userMenuService, session);
    const value = {
      config: resolved,
      session,
      auth,
      csrf,
      api,
      sessionExpired,
      userMenuStore
    };
    return { value, session };
  });
  const restoredRef = React8.useRef(false);
  React8.useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    void services.session.tryRestoreSession();
  }, [services.session]);
  return /* @__PURE__ */ jsxRuntime.jsx(InsightAuthContext.Provider, { value: services.value, children });
}
var TITLES = {
  SESSION_REPLACED: "Signed Out Remotely",
  SESSION_REVOKED: "Session Ended",
  TOKEN_EXPIRED: "Session Expired",
  default: "Session Expired"
};
var MESSAGES = {
  TOKEN_EXPIRED: "Your session has expired. Please log in again to continue.",
  SESSION_REVOKED: "Your session has been ended. Please log in again.",
  SESSION_REPLACED: "Your session was ended because you signed in from another device or your concurrent session access was revoked. Please log in again.",
  default: "Your session is no longer valid. Please log in again."
};
var overlayStyle = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9999
};
var cardStyle = {
  background: "#ffffff",
  borderRadius: 8,
  padding: 32,
  maxWidth: 380,
  width: "calc(100% - 32px)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  textAlign: "center"
};
var iconStyle = {
  fontSize: 48,
  color: "#f59e0b",
  marginBottom: 16
};
var titleStyle = {
  margin: "0 0 8px",
  fontSize: 22,
  fontWeight: 600,
  color: "#1f2937"
};
var messageStyle = {
  margin: "0 0 24px",
  fontSize: 14,
  lineHeight: 1.5,
  color: "#6b7280"
};
var actionStyle = {
  border: "none",
  borderRadius: 6,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  background: "#2563eb",
  color: "#ffffff"
};
function SessionExpiredDialog() {
  const sessionExpired = useSessionExpired();
  const { config } = useInsightAuth();
  if (!sessionExpired.visible) {
    return null;
  }
  const reason = sessionExpired.reason;
  const iconClass = reason === "SESSION_REPLACED" ? "fa-solid fa-right-from-bracket" : "fa-solid fa-clock";
  const onConfirm = () => {
    const returnUrl = sessionExpired.returnUrl;
    sessionExpired.hide();
    window.location.href = buildExternalSigninUrl(config, returnUrl);
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { style: overlayStyle, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: cardStyle, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: iconStyle, children: /* @__PURE__ */ jsxRuntime.jsx("i", { className: iconClass }) }),
    /* @__PURE__ */ jsxRuntime.jsx("h1", { style: titleStyle, children: TITLES[reason ?? "default"] }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { style: messageStyle, children: MESSAGES[reason ?? "default"] }),
    /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", style: actionStyle, onClick: onConfirm, children: "Log in again" })
  ] }) });
}

// src/components/storage/storage.service.ts
var StorageService = class {
  storageKey = "@insight/ui";
  get(key) {
    const session = JSON.parse(sessionStorage.getItem(this.storageKey) || "{}") || {};
    return session[key] ?? "";
  }
  set(key, value) {
    const session = JSON.parse(sessionStorage.getItem(this.storageKey) || "{}") || {};
    session[key] = value;
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
  }
  delete(key) {
    const session = JSON.parse(sessionStorage.getItem(this.storageKey) || "{}") || {};
    delete session[key];
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
  }
  clear() {
    sessionStorage.removeItem(this.storageKey);
  }
  /** Save the return URL for post-login/post-password-change redirect (keyed `ru`). */
  setReturnUrl(url) {
    this.set("ru", url);
  }
  /** Retrieve and clear the saved return URL. Returns `'/'` when none is saved. */
  getReturnUrl() {
    const url = this.get("ru");
    this.delete("ru");
    return url || "/";
  }
};
var storageService = new StorageService();
function RequireAuth({
  children,
  loading
}) {
  const session = useSession();
  const { config } = useInsightAuth();
  const sessionExpired = useSessionExpired();
  const location = reactRouterDom.useLocation();
  const isInitializing = session.initializing;
  const isAuth = session.isAuth();
  const overlayVisible = sessionExpired.visible;
  React8.useEffect(() => {
    if (overlayVisible) return;
    if (isInitializing) return;
    if (isAuth) return;
    const targetPath = location.pathname + location.search;
    window.location.href = buildExternalSigninUrl(config, targetPath);
  }, [overlayVisible, isInitializing, isAuth, config, location.pathname, location.search]);
  if (overlayVisible) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
  }
  if (isInitializing) {
    return loading ?? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ih-route-loading", children: "Loading session..." });
  }
  if (!isAuth) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}
function resolvePermission(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return { source: value.source, codes: value.value };
  }
  return { source: "menu", codes: value };
}
function usePermission(value) {
  const store = useUserMenuStore();
  const resolved = resolvePermission(value ?? null);
  if (!resolved) {
    return false;
  }
  if (resolved.source === "role") {
    return store.hasRole(resolved.codes);
  }
  return store.hasMenu(resolved.codes);
}
function HasMn({
  value,
  children
}) {
  const allowed = usePermission(value);
  return allowed ? /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children }) : null;
}
function NotHasMn({
  value,
  children
}) {
  const allowed = usePermission(value);
  return allowed ? null : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}

exports.AuthCallback = AuthCallback;
exports.AuthService = AuthService;
exports.CsrfService = CsrfService;
exports.CurrentUserService = CurrentUserService;
exports.DEFAULT_ERROR_FACTORIES = DEFAULT_ERROR_FACTORIES;
exports.HasMn = HasMn;
exports.HostShell = HostShell;
exports.IAlert = IAlert;
exports.IAvatar = IAvatar;
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
exports.IFCSelect = IFCSelect;
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
exports.IPill = IPill;
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
exports.InsightAuthContext = InsightAuthContext;
exports.InsightAuthProvider = InsightAuthProvider;
exports.NotHasMn = NotHasMn;
exports.RequireAuth = RequireAuth;
exports.SessionExpiredDialog = SessionExpiredDialog;
exports.SessionExpiredService = SessionExpiredService;
exports.SessionService = SessionService;
exports.StorageService = StorageService;
exports.UserMenuService = UserMenuService;
exports.UserMenuStore = UserMenuStore;
exports.asMinMaxLengthError = asMinMaxLengthError;
exports.buildExternalSigninUrl = buildExternalSigninUrl;
exports.buildUrl = buildUrl2;
exports.collectMenuCodes = collectMenuCodes;
exports.createApiClient = createApiClient;
exports.decodeJwtPayload = decodeJwtPayload;
exports.decodeUser = decodeUser;
exports.environment = environment;
exports.extractAccessTokenFromHash = extractAccessTokenFromHash;
exports.extractProblemDetailsErrorCode = extractProblemDetailsErrorCode;
exports.findFirstLeafRoute = findFirstLeafRoute;
exports.findMenuNameById = findMenuNameById;
exports.getDefaultInsightAuthConfig = getDefaultInsightAuthConfig;
exports.getMenuChildren = getMenuChildren;
exports.getMenuKey = getMenuKey;
exports.getMenuLabel = getMenuLabel;
exports.getMenuRoute = getMenuRoute;
exports.hasAnyMenuCode = hasAnyMenuCode;
exports.hasMenuChildren = hasMenuChildren;
exports.hasNumber = hasNumber;
exports.interpolate = interpolate;
exports.isControlRequired = isControlRequired;
exports.isGroupNode = isGroupNode;
exports.isHttpRoute = isHttpRoute;
exports.isLeafItem = isLeafItem;
exports.isModuleMenu = isModuleMenu;
exports.isNewTabMenu = isNewTabMenu;
exports.isRecord = isRecord;
exports.isReloadMenu = isReloadMenu;
exports.isSessionExpiredError = isSessionExpiredError;
exports.isSpaMenu = isSpaMenu;
exports.mapToSidebarUser = mapToSidebarUser;
exports.normalizeFetchError = normalizeFetchError;
exports.normalizeMenuTree = normalizeMenuTree;
exports.rawRequest = rawRequest;
exports.readNumber = readNumber;
exports.resolveControlErrorMessage = resolveControlErrorMessage;
exports.resolveInsightAuthConfig = resolveInsightAuthConfig;
exports.resolvePermission = resolvePermission;
exports.sanitizeReturnUrl = sanitizeReturnUrl;
exports.sessionExpiredService = sessionExpiredService;
exports.storageService = storageService;
exports.toIMenu = toIMenu;
exports.toIMenuFavorite = toIMenuFavorite;
exports.toIMenus = toIMenus;
exports.toSessionExpiredReason = toSessionExpiredReason;
exports.useApi = useApi;
exports.useAuth = useAuth;
exports.useCsrf = useCsrf;
exports.useHostApi = useHostApi;
exports.useHostApiOptional = useHostApiOptional;
exports.useHostUi = useHostUi;
exports.useIAlert = useIAlert;
exports.useIConfirm = useIConfirm;
exports.useIDialog = useIDialog;
exports.useIDialogData = useIDialogData;
exports.useIDialogRef = useIDialogRef;
exports.useInputMask = useInputMask;
exports.useInsightAuth = useInsightAuth;
exports.usePermission = usePermission;
exports.useSession = useSession;
exports.useSessionExpired = useSessionExpired;
exports.useUserMenuStore = useUserMenuStore;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map