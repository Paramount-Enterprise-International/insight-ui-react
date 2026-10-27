import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React9, { useRef, useMemo, forwardRef, useState, useCallback, useEffect, useImperativeHandle, useLayoutEffect, createContext, memo, Children, useContext, useSyncExternalStore, Fragment as Fragment$1, useReducer, Suspense, useId, lazy, createElement } from 'react';
import { useNavigate, Link, useHref, Outlet, useLocation, UNSAFE_RouteContext, matchRoutes, Routes, Route, Navigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// src/components/action-placeholder/action-placeholder.tsx
function IActionPlaceholder({
  size = "md",
  className
}) {
  return /* @__PURE__ */ jsx(
    "i-action-placeholder",
    {
      class: ["i-action-placeholder", className].filter(Boolean).join(" "),
      "aria-hidden": "true",
      style: {
        width: `max(var(--i-size-${size}), calc(var(--i-icon-${size}) + 2 * var(--i-padding-${size})))`,
        height: `var(--i-size-${size})`
      }
    }
  );
}
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
  return /* @__PURE__ */ jsx("i-icon", { class: className, icon: String(icon), size, ...rest, children: /* @__PURE__ */ jsx("i", { className: iconClass }) });
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
  const [hasSourceError, setHasSourceError] = useState(false);
  const [hasFallbackError, setHasFallbackError] = useState(false);
  useEffect(() => {
    setHasSourceError(false);
  }, [src]);
  useEffect(() => {
    setHasFallbackError(false);
  }, [fallbackSrc]);
  const pixelSize = resolvePixelSize(size);
  const iconSize = typeof size === "string" ? size : resolveIconSize(size);
  const hostStyle = useMemo(
    () => ({ width: pixelSize, height: pixelSize, ...style }),
    [pixelSize, style]
  );
  const imageSource = !hasSourceError && src ? src : void 0;
  const fallbackImageSource = !imageSource && !hasFallbackError && fallbackSrc ? fallbackSrc : void 0;
  return /* @__PURE__ */ jsx(
    "i-avatar",
    {
      ...rest,
      class: ["i-avatar", className].filter(Boolean).join(" "),
      "data-shape": shape,
      style: hostStyle,
      children: imageSource ? /* @__PURE__ */ jsx("img", { alt, src: imageSource, onError: () => setHasSourceError(true) }) : fallbackImageSource ? /* @__PURE__ */ jsx(
        "img",
        {
          alt,
          src: fallbackImageSource,
          onError: () => setHasFallbackError(true)
        }
      ) : /* @__PURE__ */ jsx(IIcon, { "aria-label": "User avatar", icon: "user", size: iconSize })
    }
  );
}
function IBanner({
  message,
  variant = "info",
  prefixIcon,
  suffixIcon,
  children: children2,
  closable = false,
  closeLabel = "Close",
  open,
  defaultOpen = true,
  onOpenChange,
  onClose,
  className,
  ...rest
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const hasChildren = Children.toArray(children2).some(
    (child) => typeof child === "string" ? Boolean(child.trim()) : child !== null && typeof child !== "boolean"
  );
  if (!(open ?? internalOpen) || !(message == null ? void 0 : message.trim()) && !hasChildren)
    return null;
  return /* @__PURE__ */ jsxs(
    "i-banner",
    {
      ...rest,
      class: ["i-banner", className].filter(Boolean).join(" "),
      variant,
      role: variant === "danger" ? "alert" : "status",
      children: [
        prefixIcon ? /* @__PURE__ */ jsx(
          IIcon,
          {
            icon: prefixIcon,
            className: "i-banner__icon",
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ jsxs("div", { className: "i-banner__body", children: [
          (message == null ? void 0 : message.trim()) ? /* @__PURE__ */ jsx("div", { className: "i-banner__message", children: message }) : null,
          /* @__PURE__ */ jsx("div", { className: "i-banner__content", children: children2 })
        ] }),
        suffixIcon ? /* @__PURE__ */ jsx(
          IIcon,
          {
            icon: suffixIcon,
            className: "i-banner__icon",
            "aria-hidden": "true"
          }
        ) : null,
        closable ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "i-banner__close",
            "aria-label": closeLabel,
            onClick: (event) => {
              event.stopPropagation();
              if (open === void 0) setInternalOpen(false);
              onOpenChange == null ? void 0 : onOpenChange(false);
              onClose == null ? void 0 : onClose(event.nativeEvent);
            },
            children: /* @__PURE__ */ jsx(IIcon, { icon: "x", "aria-hidden": "true" })
          }
        ) : null
      ]
    }
  );
}
function ILoading(props) {
  const {
    label = "Loading..",
    light = false,
    mode = "inline",
    ...rest
  } = props;
  const page = mode !== "inline";
  return /* @__PURE__ */ jsxs(
    "i-loading",
    {
      mode,
      light: light ? "true" : void 0,
      role: page ? "status" : void 0,
      "aria-live": page ? "polite" : void 0,
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `spinner-border spinner-border-sm${light ? " light" : ""}`,
            role: page ? void 0 : "status",
            "aria-hidden": page ? "true" : void 0
          }
        ),
        label,
        page && !label ? /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Loading..." }) : null
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
    placeholder = false,
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
    children: children2,
    className,
    "aria-label": ariaLabel,
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
    if (placeholder || isDisabled) {
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
  const content = loading ? /* @__PURE__ */ jsx(ILoading, { label: loadingText, light: variant !== "outline" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    icon ? /* @__PURE__ */ jsx(IIcon, { icon, size }) : null,
    children2
  ] });
  if (placeholder)
    return /* @__PURE__ */ jsx(IActionPlaceholder, { size, className });
  return /* @__PURE__ */ jsx(
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
      children: mode === "router" || mode === "anchor" ? /* @__PURE__ */ jsx(
        "a",
        {
          className: "i-button-inner",
          "aria-label": ariaLabel,
          "aria-disabled": isDisabled ? "true" : void 0,
          href: isDisabled ? void 0 : url,
          target,
          rel: computedRel,
          onClick: handleClick,
          children: content
        }
      ) : /* @__PURE__ */ jsx(
        "button",
        {
          className: "i-button-inner",
          "aria-label": ariaLabel,
          disabled: isDisabled,
          type,
          onClick: handleClick,
          children: content
        }
      )
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
    children: children2,
    className,
    ...rest
  } = props;
  const normalizedHref = useMemo(() => normalizeHref(href), [href]);
  const toBase = useMemo(() => routerLinkToTo(routerLink), [routerLink]);
  const search = useMemo(() => buildSearch(queryParams), [queryParams]);
  const hash = useMemo(() => buildHash(fragment), [fragment]);
  const to = useMemo(() => {
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
  return /* @__PURE__ */ jsx("i-card", { class: className, ...rest, children: useRouterLink ? /* @__PURE__ */ jsx(
    Link,
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
      children: children2
    }
  ) : /* @__PURE__ */ jsx(
    "a",
    {
      className: "i-card",
      "aria-disabled": disabled ? "true" : void 0,
      tabIndex: disabled ? -1 : void 0,
      href: disabled ? void 0 : normalizedHref,
      target: target ?? void 0,
      rel: relAttr ?? void 0,
      onClick: handleClick,
      children: children2
    }
  ) });
}
function ICardImage(props) {
  const { src, alt, ...rest } = props;
  return /* @__PURE__ */ jsx("i-card-image", { children: /* @__PURE__ */ jsx("img", { alt: alt ?? "card-image", src, ...rest }) });
}
function ICardBody(props) {
  return /* @__PURE__ */ jsx("i-card-body", { ...props });
}
function ICardFooter(props) {
  return /* @__PURE__ */ jsx("i-card-footer", { ...props });
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
function countLines(text2) {
  if (text2 === null || text2 === void 0) return 1;
  const s = String(text2);
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
  if (React9.isValidElement(node)) {
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
    children: children2,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const requestSeqRef = useRef(0);
  const highlightSeqRef = useRef(0);
  const [fileLanguage, setFileLanguage] = useState("text");
  const languageOverride = (language ?? "").trim() || null;
  const fileTrimmed = (file ?? "").trim();
  const codePropString = (code ?? "").toString();
  const effectiveLanguage = useMemo(() => {
    if (languageOverride) return languageOverride;
    if (fileTrimmed) return fileLanguage;
    return "text";
  }, [languageOverride, fileLanguage, fileTrimmed]);
  const fileTypeLabel = useMemo(() => {
    const l = (effectiveLanguage || "text").toUpperCase();
    return l === "TEXT" ? "CODE" : l;
  }, [effectiveLanguage]);
  const [rawCode, setRawCode] = useState(() => codePropString);
  useEffect(() => {
    setRawCode(codePropString);
  }, [codePropString]);
  const projectedText = useMemo(
    () => extractTextFromReactNode(children2),
    [children2]
  );
  useLayoutEffect(() => {
    if (fileTrimmed) return;
    if (codePropString) return;
    if (rawCode) return;
    const text2 = (projectedText ?? "").trim();
    if (!text2) return;
    setRawCode(text2);
  }, [projectedText, fileTrimmed, codePropString, rawCode]);
  const hljsRef = useRef(null);
  const hljsPromiseRef = useRef(null);
  const shouldUseHljs = highlighter === "hljs" || highlighter === "auto";
  const loadHljsIfNeeded = useCallback(async () => {
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
  const highlightWithHljs = useCallback(
    (text2, lang) => {
      var _a;
      try {
        const hljs = hljsRef.current;
        if (!hljs) return escapeHtml(text2);
        const normalized = normalizeHljsLanguage(lang);
        if (normalized && ((_a = hljs.getLanguage) == null ? void 0 : _a.call(hljs, normalized))) {
          return hljs.highlight(text2, { language: normalized }).value;
        }
        return hljs.highlightAuto(text2).value;
      } catch {
        return escapeHtml(text2);
      }
    },
    []
  );
  const renderToHtmlSync = useCallback(
    (text2, lang) => {
      const raw = text2 ?? "";
      if (!raw) return "";
      if (highlighter === "none") return escapeHtml(raw);
      if (shouldUseHljs && hljsRef.current) {
        return highlightWithHljs(raw, lang);
      }
      return escapeHtml(raw);
    },
    [highlighter, shouldUseHljs, highlightWithHljs]
  );
  useEffect(() => {
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
        const text2 = await res.text();
        if (seq !== requestSeqRef.current) return;
        setRawCode(text2 ?? "");
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
  const lineNumberList = useMemo(() => {
    if (!lineNumbersC) return [];
    const lines = countLines(rawCode);
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [lineNumbersC, rawCode]);
  const [renderedHtml, setRenderedHtml] = useState(
    () => renderToHtmlSync(rawCode, effectiveLanguage)
  );
  useEffect(() => {
    setRenderedHtml(renderToHtmlSync(rawCode, effectiveLanguage));
  }, [rawCode, effectiveLanguage, renderToHtmlSync]);
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
    highlightWithHljs
  ]);
  const copyTimerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);
  const onCopy = useCallback(async () => {
    var _a;
    const text2 = rawCode ?? "";
    if (!text2 || loading) return;
    const done = () => {
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1200);
    };
    try {
      if ((_a = navigator == null ? void 0 : navigator.clipboard) == null ? void 0 : _a.writeText) {
        await navigator.clipboard.writeText(text2);
        done();
        return;
      }
    } catch {
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text2;
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
  return /* @__PURE__ */ jsx("i-code-viewer", { class: className, ...rest, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: [
        "i-code-viewer",
        compactC ? "compact" : null,
        wrapC ? "wrap" : null
      ].filter(Boolean).join(" "),
      children: [
        loading ? /* @__PURE__ */ jsx("div", { className: "i-code-viewer-loading", children: "Loading\u2026" }) : null,
        error ? /* @__PURE__ */ jsx("div", { className: "i-code-viewer-error", children: error }) : null,
        /* @__PURE__ */ jsxs(
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
              showOverlay ? /* @__PURE__ */ jsxs("div", { className: "i-code-viewer-overlay hljs", children: [
                showFileTypeC ? /* @__PURE__ */ jsx("span", { className: "i-code-viewer-filetype", children: fileTypeLabel }) : null,
                copyC ? /* @__PURE__ */ jsx(
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
              /* @__PURE__ */ jsxs(
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
                    lineNumbersC ? /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "i-code-viewer-gutter", children: lineNumberList.map((n) => /* @__PURE__ */ jsx("div", { className: "i-code-viewer-line", children: n }, n)) }) : null,
                    /* @__PURE__ */ jsx("pre", { className: "i-code-viewer-pre", children: /* @__PURE__ */ jsx(
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
  const defaultAppliedRef = useRef(false);
  const enableDefault = opts.enableDefault ?? true;
  useEffect(() => {
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
      const totalDigits = tokens.reduce((sum, token) => sum + token.length, 0);
      const value = digits.replace(/\D/g, "").slice(0, totalDigits);
      let result = seps[0] ?? "";
      let offset = 0;
      for (let i = 0; i < tokens.length; i++) {
        const part = value.slice(offset, offset + tokens[i].length);
        if (!part) break;
        result += part;
        offset += part.length;
        if (part.length === tokens[i].length && i < tokens.length - 1) {
          result += seps[i + 1] ?? "";
        }
      }
      return result;
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
      for (const part of parts) part.out = part.raw;
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
    const normalizePastedDate = (text2, format) => {
      return applyDateMask(text2, format);
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
      const nextDigits = (before + newToken + after).slice(0, totalDigits);
      const masked = applyDateMaskDigitsOnly(nextDigits, format);
      const didRollAtEnd = isFull && digitCursor >= r.end;
      const nextDigitCursor = didRollAtEnd ? r.end : Math.min(totalDigits, digitCursor + 1);
      el.value = masked;
      dispatchInput();
      let nextCaret = caretPosAfterDigits(masked, nextDigitCursor);
      while (nextCaret < masked.length && /\D/.test(masked[nextCaret])) {
        nextCaret++;
      }
      safeSetSelectionRange(nextCaret, nextCaret);
      return true;
    };
    const handleDateSeparatorKeydown = (key) => {
      var _a;
      const format = fmt || "dd/MM/yyyy";
      const { tokens, seps } = splitDateFormat(format);
      const value = el.value;
      const caret = el.selectionStart ?? value.length;
      const segments = getDateSegments(value, format);
      const index = segments.findIndex(
        (segment2, i) => i < tokens.length - 1 && caret >= segment2.start && caret <= segment2.end
      );
      if (index < 0 || !((_a = seps[index + 1]) == null ? void 0 : _a.includes(key))) return;
      const segment = segments[index];
      if (!segment.raw) return;
      const padded = segment.raw.padStart(tokens[index].length, "0");
      let next = value.slice(0, segment.start) + padded + value.slice(segment.end);
      let nextCaret = segment.start + padded.length;
      const separator = seps[index + 1];
      if (!next.startsWith(separator, nextCaret)) {
        next = next.slice(0, nextCaret) + separator + next.slice(nextCaret);
      }
      nextCaret += separator.length;
      el.value = next;
      dispatchInput();
      safeSetSelectionRange(nextCaret, nextCaret);
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
    const normalizePastedTime = (text2, format) => {
      if (!text2) return "";
      const nums = text2.match(/\d+/g) ?? [];
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
      const text2 = (_a = e.clipboardData) == null ? void 0 : _a.getData("text");
      if (!text2) return;
      e.preventDefault();
      let next = "";
      if (type === "date" && fmt) {
        next = normalizePastedDate(text2, fmt);
      } else if (type === "time" && fmt) {
        next = normalizePastedTime(text2, fmt);
      } else if (type === "integer") {
        next = text2.replace(/\D/g, "");
      } else if (type === "number" || type === "currency") {
        next = applyNumericMask(text2, true);
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
        if (type === "date" && allowedSeps.has(e.key)) {
          e.preventDefault();
          handleDateSeparatorKeydown(e.key);
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
  return /* @__PURE__ */ jsx("i-input-addon", { class: className, kind: addon.type, ...rest, children: addon.type === "button" ? /* @__PURE__ */ jsx(
    IButton,
    {
      size: "xs",
      type: "button",
      icon: addon.icon,
      disabled: addon.disabled,
      variant: addon.variant ?? "primary",
      onClick: () => addon.onClick ? addon.onClick() : null
    }
  ) : addon.type === "link" ? /* @__PURE__ */ jsx(
    "a",
    {
      className: "i-btn i-btn-xs",
      target: "_blank",
      variant: addon.variant ?? "primary",
      href: addon.href,
      children: /* @__PURE__ */ jsx(IIcon, { size: "xs", icon: addon.icon })
    }
  ) : addon.type === "icon" ? /* @__PURE__ */ jsx(IIcon, { size: "sm", icon: addon.icon }) : addon.type === "loading" ? /* @__PURE__ */ jsx(ILoading, { label: "" }) : /* @__PURE__ */ jsx("span", { children: addon.text }) });
}
var IInput = React9.forwardRef(
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
    const innerRef = useRef(null);
    useInputMask(innerRef, mask, { enableDefault: autoDefault });
    const prepends = useMemo(() => normalizeArray(prepend), [prepend]);
    const appends = useMemo(
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
    return /* @__PURE__ */ jsxs("i-input", { class: className, onClick: handleHostClick, children: [
      prepends.map((item, index) => /* @__PURE__ */ jsx(IInputAddon, { addon: item }, `prepend-${index}`)),
      /* @__PURE__ */ jsx(
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
      appends.map((item, index) => /* @__PURE__ */ jsx(IInputAddon, { addon: item }, `append-${index}`))
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
  const innerRef = useRef(null);
  const focusInnerInput = () => {
    if (!disabled && innerRef.current) {
      innerRef.current.focus();
    }
  };
  return /* @__PURE__ */ jsxs("i-fc-input", { class: className, ...hostProps, children: [
    label ? /* @__PURE__ */ jsxs("label", { className: "i-fc-input__label", onClick: focusInnerInput, children: [
      label,
      " :",
      required ? /* @__PURE__ */ jsx("span", { className: "i-fc-input__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(
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
    invalid && errorMessage ? /* @__PURE__ */ jsx("div", { className: "i-fc-input__error", children: errorMessage }) : null
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
function highlightParts(text2, term) {
  const t = (term ?? "").trim();
  if (!t) return text2;
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  const parts = [];
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text2)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      parts.push(text2.slice(lastIndex, start));
    }
    parts.push(
      /* @__PURE__ */ jsx("span", { className: "highlight-search", children: text2.slice(start, end) }, `h-${i}-${start}-${end}`)
    );
    lastIndex = end;
    i += 1;
  }
  if (lastIndex < text2.length) {
    parts.push(text2.slice(lastIndex));
  }
  return /* @__PURE__ */ jsx(Fragment, { children: parts });
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
var ISelect = forwardRef(function ISelectInner(props, ref) {
  const {
    placeholder = "",
    emptyState = {},
    disabled = false,
    loading = false,
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
  const hostRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const rafRef = useRef(0);
  const scrollParentsRef = useRef([]);
  const listeningScrollParentsRef = useRef(false);
  const [rawOptions, setRawOptions] = useState(() => options ?? []);
  const [filteredOptions, setFilteredOptions] = useState(
    () => options ?? []
  );
  const isControlled = value !== void 0;
  const [modelValue, setModelValue] = useState(
    () => isControlled ? value ?? null : defaultValue ?? null
  );
  const [displayText, setDisplayText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [panelHidden, setPanelHidden] = useState(false);
  const wantsOpenRef = useRef(false);
  const openSeqRef = useRef(0);
  const unhideTimerRef = useRef(null);
  const filterInput$ = useMemo(
    () => new Subject(),
    []
  );
  const filterSubRef = useRef(null);
  const optionsSubRef = useRef(null);
  const filterRevisionRef = useRef(0);
  const editingRef = useRef(false);
  const pendingFilterRef = useRef(
    null
  );
  const filterHandlerRef = useRef(() => {
  });
  const cancelPendingFilter = useCallback(() => {
    filterRevisionRef.current += 1;
    pendingFilterRef.current = null;
    editingRef.current = false;
  }, []);
  useEffect(() => {
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
  const focus = useCallback(() => {
    var _a, _b;
    if (disabled) return;
    (_b = (_a = inputRef.current) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
  }, [disabled]);
  useImperativeHandle(
    ref,
    () => ({
      focus
    }),
    [focus]
  );
  useLayoutEffect(() => {
    if (!isControlled) return;
    cancelPendingFilter();
    setModelValue(value ?? null);
    setDisplayText(resolveDisplayText(value ?? null));
    setFilterText("");
  }, [isControlled, value, cancelPendingFilter]);
  useLayoutEffect(() => {
    if (disabled) {
      cancelPendingFilter();
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  }, [disabled, cancelPendingFilter]);
  useEffect(() => {
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
        },
        complete: () => {
          setIsLoading(false);
        }
      });
      return () => {
        var _a2;
        (_a2 = optionsSubRef.current) == null ? void 0 : _a2.unsubscribe();
        optionsSubRef.current = null;
      };
    }
    setIsLoading(false);
    setRawOptions(options ?? []);
    return void 0;
  }, [options$, options]);
  useEffect(() => {
    var _a;
    (_a = filterSubRef.current) == null ? void 0 : _a.unsubscribe();
    filterSubRef.current = filterInput$.pipe(debounceTime(filterDelay)).subscribe(({ text: text2, revision }) => {
      if (revision !== filterRevisionRef.current) return;
      pendingFilterRef.current = null;
      filterHandlerRef.current(text2);
    });
    if (pendingFilterRef.current) filterInput$.next(pendingFilterRef.current);
    return () => {
      var _a2;
      (_a2 = filterSubRef.current) == null ? void 0 : _a2.unsubscribe();
      filterSubRef.current = null;
    };
  }, [filterInput$, filterDelay]);
  const panelPositionClass2 = useMemo(
    () => normalizePanelClass(panelPosition),
    [panelPosition]
  );
  const effectiveFilterText = filterText && filterText.trim().length >= filterMinLength ? filterText : "";
  const hasNoResults = isOpen && !!effectiveFilterText && filteredOptions.length === 0;
  const emptyStateConfig = typeof emptyState === "string" ? { empty: emptyState } : emptyState;
  const emptyStateText = rawOptions.length === 0 ? emptyStateConfig.empty ?? "No options available" : emptyStateConfig.notFound ?? "No results found";
  const hasPanel = isOpen && !disabled && (filteredOptions.length > 0 || !(loading || isLoading));
  const applyFilter = (force, nextFilterText) => {
    if (!isOpen && !force) return;
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
  useEffect(() => {
    if (editingRef.current) {
      applyFilter(isOpen, filterText);
      return;
    }
    if (!isOpen) {
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText("");
      setHighlightIndex(-1);
      setFilteredOptions(rawOptions);
      return;
    }
    setDisplayText(resolveDisplayText(modelValue));
    applyFilter(true, filterText);
  }, [modelValue, rawOptions, filterPredicate, filterMinLength, displayWith]);
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
  useLayoutEffect(() => {
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
    if (!hasPanel) {
      openSeqRef.current += 1;
      setPanelHidden(false);
      removeScrollParentListeners();
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
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
  }, [isOpen, hasPanel]);
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!hasPanel) return;
    scheduleReposition();
  }, [
    isOpen,
    panelPosition,
    matchTriggerWidth,
    panelOffset,
    filteredOptions.length,
    emptyStateText,
    hasPanel
  ]);
  useEffect(() => {
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
    cancelPendingFilter();
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
    setFilterText(val);
    if (!isOpen) {
      openDropdown(val);
    } else {
      applyFilter(true, val);
      scheduleReposition();
    }
  };
  useLayoutEffect(() => {
    filterHandlerRef.current = handleInputText;
  });
  const onHostInput = (e) => {
    if (disabled) return;
    const v = e.currentTarget.value ?? "";
    editingRef.current = true;
    setDisplayText(v);
    const pending = { text: v, revision: ++filterRevisionRef.current };
    pendingFilterRef.current = pending;
    filterInput$.next(pending);
  };
  const toggleDropdown = (event) => {
    if (disabled) return;
    if (!isOpen) {
      openDropdown();
    } else if (hasNoResults) {
      cancelPendingFilter();
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
    cancelPendingFilter();
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
        cancelPendingFilter();
        if (isOpen) {
          event.preventDefault();
          closeDropdown();
        }
        break;
    }
  };
  useEffect(() => {
    const onDocClick = (e) => {
      if (!isOpen && !editingRef.current) return;
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
  const appendAddon = loading || isLoading ? { type: "loading", visible: true } : {
    type: "button",
    disabled,
    icon: isOpen ? "angle-up" : "angle-down",
    visible: true,
    variant: "primary",
    onClick: () => toggleDropdown()
  };
  const optionsNode = hasPanel ? /* @__PURE__ */ jsxs(
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
      children: [
        filteredOptions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "i-options__empty", role: "status", children: emptyStateText }) : null,
        filteredOptions.map((row, idx) => /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsx("div", { className: "i-option-label", children: optionRenderer ? optionRenderer(row) : highlightParts(resolveDisplayText(row), effectiveFilterText) }),
              isRowSelected(row) ? /* @__PURE__ */ jsx("span", { className: "i-option-check", children: /* @__PURE__ */ jsx(IIcon, { icon: "check" }) }) : null
            ]
          },
          (row == null ? void 0 : row.id) ?? `${idx}-${String(row)}`
        ))
      ]
    }
  ) : null;
  return /* @__PURE__ */ jsxs(
    "i-select",
    {
      ...hostProps,
      class: className,
      "aria-disabled": disabled ? "true" : void 0,
      ref: (el) => {
        hostRef.current = el;
      },
      onKeyDown: onHostKeyDown,
      children: [
        /* @__PURE__ */ jsx(
          IInput,
          {
            inputRef,
            append: appendAddon,
            invalid: invalid || hasNoResults,
            placeholder,
            readonly: disabled,
            disabled,
            value: displayText,
            onInput: onHostInput
          }
        ),
        portalToBody ? optionsNode ? createPortal(optionsNode, document.body) : null : optionsNode
      ]
    }
  );
});
var IFCSelect = forwardRef(function IFCSelectInner(props, ref) {
  const {
    label = "",
    placeholder = "",
    emptyState = {},
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
    loading = false,
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
  const innerSelectRef = useRef(null);
  const focusInnerSelect = useCallback(() => {
    var _a;
    if (!disabled) (_a = innerSelectRef.current) == null ? void 0 : _a.focus();
  }, [disabled]);
  useImperativeHandle(
    ref,
    () => ({
      focus: focusInnerSelect
    }),
    [focusInnerSelect]
  );
  const controlInvalid = useMemo(() => {
    const hasErr = !!errors && Object.keys(errors).length > 0;
    if (!hasErr) return false;
    if (submitted !== void 0) return !!submitted;
    return !!touched || !!dirty;
  }, [errors, submitted, touched, dirty]);
  const required = useMemo(
    () => isControlRequired({ errors: errors ?? void 0, errorMessage }),
    [errors, errorMessage]
  );
  const resolvedErrorText = useMemo(
    () => resolveControlErrorMessage({
      errors: errors ?? void 0,
      label,
      errorMessage
    }),
    [errors, label, errorMessage]
  );
  return /* @__PURE__ */ jsxs("i-fc-select", { ...hostProps, class: className, children: [
    label ? /* @__PURE__ */ jsxs("label", { className: "i-fc-select__label", onClick: focusInnerSelect, children: [
      label,
      " :",
      required ? /* @__PURE__ */ jsx("span", { className: "i-fc-select__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(
      ISelect,
      {
        ref: (api) => {
          innerSelectRef.current = api ?? null;
        },
        disabled,
        loading,
        emptyState,
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
    controlInvalid && resolvedErrorText ? /* @__PURE__ */ jsx("div", { className: "i-fc-select__error", children: resolvedErrorText }) : null
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
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
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
  const chunks = (format || "dd/MM/yyyy").match(/yyyy|MM|dd|./g) ?? [];
  const fields = chunks.filter((chunk) => /^(yyyy|MM|dd)$/.test(chunk));
  if (fields.length !== 3 || new Set(fields).size !== 3) return null;
  const pattern = chunks.map(
    (chunk) => /^(yyyy|MM|dd)$/.test(chunk) ? `(\\d{${chunk.length}})` : chunk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  ).join("");
  const match = new RegExp(`^${pattern}$`).exec(value);
  if (!match) return null;
  const parts = Object.fromEntries(
    fields.map((field, index) => [field, Number(match[index + 1])])
  );
  const year = parts["yyyy"];
  const month = parts["MM"];
  const day = parts["dd"];
  if (!year || !month || !day || month > 12) return null;
  const date = /* @__PURE__ */ new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}
function formatDateLocal(date, format) {
  const month = date.getMonth() + 1;
  const year = String(date.getFullYear());
  const shortMonth = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const longMonth = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
  return (format || "dd/MM/yyyy").replace(
    /MMMM|MMM|MM|M|dd|d|yyyyy|yyyy|yyy|yy|y/g,
    (token) => {
      if (token === "MMMM") return longMonth;
      if (token === "MMM") return shortMonth;
      if (token === "MM") return String(month).padStart(2, "0");
      if (token === "M") return String(month);
      if (token === "dd") return String(date.getDate()).padStart(2, "0");
      if (token === "d") return String(date.getDate());
      if (token === "yy") return year.slice(-2).padStart(2, "0");
      return year.padStart(token.length, "0");
    }
  );
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
    displayFormat,
    panelPosition = "bottom left",
    portalToBody = true,
    matchTriggerWidth = true,
    panelOffset = 6,
    value = null,
    onChanged = noop,
    className,
    ...rest
  } = props;
  const hostRef = useRef(null);
  const panelRef = useRef(null);
  const inputElRef = useRef(null);
  const rafRef = useRef(0);
  const scrollParentsRef = useRef([]);
  const listeningScrollParentsRef = useRef(false);
  const [modelValue, setModelValue] = useState(null);
  const modelValueRef = useRef(null);
  const [displayText, setDisplayText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [years, setYears] = useState([]);
  const [panelHidden, setPanelHidden] = useState(false);
  const wantsOpenRef = useRef(false);
  const openSeqRef = useRef(0);
  const unhideTimerRef = useRef(null);
  const isEditingRef = useRef(false);
  const lastEmittedKeyRef = useRef(null);
  const pendingExternalRef = useRef(void 0);
  const weeks = useMemo(
    () => buildCalendar(viewYear, viewMonth, modelValue),
    [viewYear, viewMonth, modelValue]
  );
  const monthSelected = useMemo(
    () => MONTHS.find((m) => m.value === viewMonth) ?? null,
    [viewMonth]
  );
  const dateMask = useMemo(
    () => ({ type: "date", format }),
    [format]
  );
  useEffect(() => {
    return () => {
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
    };
  }, []);
  const refreshInnerInputRef = useCallback(() => {
    var _a;
    const host = hostRef.current;
    const el = (_a = host == null ? void 0 : host.querySelector) == null ? void 0 : _a.call(
      host,
      "i-input input"
    );
    if (el) inputElRef.current = el;
  }, []);
  const getPanelEl = () => panelRef.current;
  const getAnchorEl = useCallback(() => {
    const host = hostRef.current;
    if (!host) return null;
    const iInput = host.querySelector("i-input");
    return iInput ?? host;
  }, []);
  useEffect(() => {
    const next = normalizeToDate(value, format);
    const nextKey = dateKey(next);
    if (isEditingRef.current) {
      if (nextKey === lastEmittedKeyRef.current) {
        modelValueRef.current = next;
        setModelValue(next);
        return;
      }
      pendingExternalRef.current = next;
      return;
    }
    modelValueRef.current = next;
    setModelValue(next);
    setDisplayText(next ? formatDateLocal(next, displayFormat || format) : "");
    const base = next ?? startOfDay(/* @__PURE__ */ new Date());
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYears((prev) => ensureYearRange(base.getFullYear(), prev));
  }, [value, format, displayFormat]);
  useEffect(() => {
    if (!viewYear) return;
    setYears((p) => ensureYearRange(viewYear, p));
  }, [viewYear]);
  const syncFromInnerInputSafely = useCallback(() => {
    refreshInnerInputRef();
    const input = inputElRef.current;
    if (!input) return;
    const raw = (input.value ?? "").trim();
    if (!raw) return;
    const parsed = parseInputDate(raw, format);
    if (!parsed) return;
    modelValueRef.current = parsed;
    setModelValue(parsed);
    setDisplayText(formatDateLocal(parsed, format));
  }, [format, refreshInnerInputRef]);
  const initViewFromModel = useCallback(() => {
    let base;
    if (modelValue) base = startOfDay(modelValue);
    else if (displayText)
      base = parseInputDate(displayText, format) ?? startOfDay(/* @__PURE__ */ new Date());
    else base = startOfDay(/* @__PURE__ */ new Date());
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYears((p) => ensureYearRange(base.getFullYear(), p));
  }, [displayText, format, modelValue]);
  const repositionPanelNow = useCallback(() => {
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
  const scheduleReposition = useCallback(
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
  const addScrollParentListeners = useCallback(() => {
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
  const removeScrollParentListeners = useCallback(() => {
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
  const openPanel = useCallback(() => {
    if (disabled) return;
    if (isOpen) return;
    setIsOpen(true);
  }, [disabled, isOpen]);
  const closePanel = useCallback(
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
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
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
  const appendAddon = useMemo(
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
  const handleInput = useCallback(
    (raw) => {
      setDisplayText(raw);
      const trimmed = raw.trim();
      const parsed = trimmed ? parseInputDate(trimmed, format) : null;
      modelValueRef.current = parsed;
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
  const selectDay = useCallback(
    (day) => {
      var _a;
      if (disabled) return;
      const selected = startOfDay(day.date);
      modelValueRef.current = selected;
      setModelValue(selected);
      setDisplayText(formatDateLocal(selected, displayFormat || format));
      pendingExternalRef.current = void 0;
      isEditingRef.current = false;
      lastEmittedKeyRef.current = dateKey(selected);
      onChanged(selected);
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setYears((p) => ensureYearRange(selected.getFullYear(), p));
      closePanel();
      (_a = inputElRef.current) == null ? void 0 : _a.blur();
    },
    [closePanel, disabled, displayFormat, format, onChanged]
  );
  const prevMonth = useCallback(() => {
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
  const nextMonth = useCallback(() => {
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
  const onMonthChange = useCallback(
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
  const onYearChange = useCallback(
    (change) => {
      const year = change.value;
      if (typeof year !== "number") return;
      setViewYear(year);
      setYears((p) => ensureYearRange(year, p));
      if (wantsOpenRef.current) scheduleReposition();
    },
    [scheduleReposition]
  );
  const onHostInput = (event) => {
    const target = event.target;
    const dateInput = inputElRef.current;
    if (!dateInput) return;
    if (target !== dateInput) return;
    handleInput(dateInput.value ?? "");
  };
  useEffect(() => {
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
  useEffect(() => {
    return () => {
      closePanel(true);
    };
  }, [closePanel]);
  const panelNode = /* @__PURE__ */ jsxs(
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
        /* @__PURE__ */ jsxs("div", { className: "i-datepicker-header", children: [
          /* @__PURE__ */ jsx(IButton, { icon: "prev", size: "xs", onClick: prevMonth }),
          /* @__PURE__ */ jsx(
            ISelect,
            {
              className: "i-date-picker-month-select",
              options: MONTHS,
              value: monthSelected,
              onOptionSelected: onMonthChange
            }
          ),
          /* @__PURE__ */ jsx(
            ISelect,
            {
              className: "i-date-picker-year-select",
              options: years,
              value: viewYear,
              onOptionSelected: onYearChange
            }
          ),
          /* @__PURE__ */ jsx(IButton, { icon: "next", size: "xs", onClick: nextMonth })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "i-datepicker-weekdays", children: WEEKDAYS.map((w) => /* @__PURE__ */ jsx("small", { children: w }, w)) }),
        /* @__PURE__ */ jsx("div", { className: "i-datepicker-weeks", children: weeks.map((week, wi) => /* @__PURE__ */ jsx("div", { className: "i-datepicker-week", children: week.map((d) => /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs(
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
      onInput: onHostInput,
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          IInput,
          {
            append: appendAddon,
            autoDefault: false,
            mask: dateMask,
            invalid,
            placeholder,
            readonly: disabled,
            value: disabled && modelValue ? formatDateLocal(modelValue, displayFormat || format) : displayText,
            onFocus: () => {
              isEditingRef.current = true;
              if (modelValueRef.current) {
                setDisplayText(formatDateLocal(modelValueRef.current, format));
              }
            },
            onBlur: () => {
              var _a;
              isEditingRef.current = false;
              const pending = pendingExternalRef.current;
              pendingExternalRef.current = void 0;
              const next = pending !== void 0 ? pending : modelValueRef.current;
              if (pending !== void 0) {
                modelValueRef.current = pending;
                setModelValue(pending);
              }
              setDisplayText(
                next ? formatDateLocal(next, displayFormat || format) : pending !== void 0 ? "" : ((_a = inputElRef.current) == null ? void 0 : _a.value) ?? ""
              );
            },
            onInput: () => {
            }
          }
        ),
        /* @__PURE__ */ jsx("span", { style: { display: "none" } }),
        portalToBody && isOpen ? createPortal(panelNode, document.body) : panelNode
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
    displayFormat,
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
  const hostRef = useRef(null);
  const resolvedErrorText = useMemo(() => {
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
  return /* @__PURE__ */ jsxs(
    "i-fc-datepicker",
    {
      ref: (el) => {
        hostRef.current = el;
      },
      class: className,
      ...rest,
      children: [
        label ? /* @__PURE__ */ jsxs(
          "label",
          {
            className: "i-fc-datepicker__label",
            onClick: focusInnerDatepicker,
            children: [
              label,
              " :",
              " ",
              required ? /* @__PURE__ */ jsx("span", { className: "i-fc-datepicker__required", children: "*" }) : null
            ]
          }
        ) : null,
        /* @__PURE__ */ jsx(
          IDatepicker,
          {
            disabled,
            format,
            displayFormat,
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
        invalid && resolvedErrorText ? /* @__PURE__ */ jsx("div", { className: "i-fc-datepicker__error", children: resolvedErrorText }) : null
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
  const textareaRef = useRef(null);
  const handleHostClick = useCallback(() => {
    var _a;
    if (!disabled) {
      (_a = textareaRef.current) == null ? void 0 : _a.focus();
    }
  }, [disabled]);
  return /* @__PURE__ */ jsx("i-textarea", { class: className, onClick: handleHostClick, children: /* @__PURE__ */ jsx(
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
  const resolvedErrorText = useMemo(() => {
    if (!invalid) return null;
    return resolveErrorMessage2(label || "This field", errorKey, errorMessage) ?? `${label || "This field"} is invalid`;
  }, [invalid, label, errorKey, errorMessage]);
  const hostRef = useRef(null);
  const focusInnerTextarea = useCallback(() => {
    if (disabled) return;
    const host = hostRef.current;
    if (!host) return;
    const textarea = host.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
    }
  }, [disabled]);
  return /* @__PURE__ */ jsxs("i-fc-textarea", { ...hostProps, ref: hostRef, children: [
    label ? /* @__PURE__ */ jsxs("label", { className: "i-fc-textarea__label", onClick: focusInnerTextarea, children: [
      label,
      " :",
      " ",
      required ? /* @__PURE__ */ jsx("span", { className: "i-fc-textarea__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(
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
    invalid && resolvedErrorText ? /* @__PURE__ */ jsx("div", { className: "i-fc-textarea__error", children: resolvedErrorText }) : null
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
var IDialogContext = createContext(null);
var IDialogInstanceContext = createContext(null);
function useIDialog() {
  const ctx = useContext(IDialogContext);
  if (!ctx)
    throw new Error("useIDialog() must be used inside <IDialogProvider>.");
  return ctx;
}
function useIDialogData() {
  const ctx = useContext(IDialogInstanceContext);
  return (ctx == null ? void 0 : ctx.data) ?? void 0;
}
function useIDialogRef() {
  const ctx = useContext(IDialogInstanceContext);
  if (!(ctx == null ? void 0 : ctx.dialogRef)) {
    throw new Error("useDialogRef() must be used inside a dialog component.");
  }
  return ctx.dialogRef;
}
function useOptionalIDialogRef() {
  const ctx = useContext(IDialogInstanceContext);
  return (ctx == null ? void 0 : ctx.dialogRef) ?? null;
}
function IDialogProvider(props) {
  const { children: children2 } = props;
  const [dialogs, setDialogs] = useState([]);
  const open = useCallback((component, config = {}) => {
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
  const closeById = useCallback(
    (id, result) => {
      const inst = dialogs.find((d) => d.id === id);
      inst == null ? void 0 : inst.ref.close(result);
    },
    [dialogs]
  );
  const closeAll = useCallback(() => {
    dialogs.forEach((d) => d.ref.close(void 0));
  }, [dialogs]);
  const api = useMemo(
    () => ({ dialogs, open, closeById, closeAll }),
    [dialogs, open, closeById, closeAll]
  );
  return /* @__PURE__ */ jsx(IDialogContext.Provider, { value: api, children: children2 });
}
function IDialogContainer({
  instance,
  config = {},
  isTopMost = true,
  onClose,
  children: children2,
  className,
  ...rest
}) {
  const { width, height, disableClose, backdropClose = true } = (instance == null ? void 0 : instance.config) ?? config;
  const requestClose = useCallback(() => {
    if (instance) instance.ref.close(void 0);
    else onClose == null ? void 0 : onClose();
  }, [instance, onClose]);
  const onEsc = useCallback(
    (e) => {
      if (!isTopMost || e.key !== "Escape" || disableClose) return;
      requestClose();
    },
    [isTopMost, disableClose, requestClose]
  );
  useEffect(() => {
    document.addEventListener("keydown", onEsc, true);
    return () => document.removeEventListener("keydown", onEsc, true);
  }, [onEsc]);
  const onBackdropClick = () => {
    if (!isTopMost || disableClose || !backdropClose) return;
    requestClose();
  };
  const panelStyles = {
    width: width || void 0,
    height: height || void 0
  };
  const Comp = instance == null ? void 0 : instance.component;
  return /* @__PURE__ */ jsxs("i-dialog-container", { class: className, role: "dialog", "aria-modal": "true", ...rest, children: [
    /* @__PURE__ */ jsx("div", { className: "i-dialog-backdrop", onClick: onBackdropClick }),
    /* @__PURE__ */ jsx("div", { className: "i-dialog-wrapper", children: /* @__PURE__ */ jsx("div", { className: "i-dialog-panel", style: panelStyles, children: instance && Comp ? /* @__PURE__ */ jsx(
      IDialogInstanceContext.Provider,
      {
        value: { data: instance.config.data, dialogRef: instance.ref },
        children: /* @__PURE__ */ jsx(Comp, {})
      }
    ) : children2 }) })
  ] });
}
function IDialogOutlet() {
  const { dialogs } = useIDialog();
  return /* @__PURE__ */ jsx("i-dialog-outlet", { children: dialogs.map((dialog, idx) => {
    const last = idx === dialogs.length - 1;
    return /* @__PURE__ */ jsx(
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
  const { result, children: children2, className } = props;
  const ref = useIDialogRef();
  if (!children2) return null;
  return React9.cloneElement(children2, {
    className: [(_a = children2.props) == null ? void 0 : _a.className, className].filter(Boolean).join(" "),
    onClick: (e) => {
      var _a2, _b;
      (_b = (_a2 = children2.props) == null ? void 0 : _a2.onClick) == null ? void 0 : _b.call(_a2, e);
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
    children: children2,
    className,
    ...rest
  } = props;
  const dialogRef = useOptionalIDialogRef();
  const normalized = useMemo(() => normalizeActions(actions), [actions]);
  const saveAction = normalized.find((a) => a.type === "save");
  const okAction = normalized.find((a) => a.type === "ok");
  const confirmAction = normalized.find((a) => a.type === "confirm");
  const cancelAction = normalized.find((a) => a.type === "cancel");
  const customActions = normalized.filter(
    (a) => a.type === "custom"
  );
  const hasActionsBlock = (actions ?? []).length > 0;
  const hasBuiltInActions = !!(okAction || confirmAction || saveAction || cancelAction);
  return /* @__PURE__ */ jsxs("i-dialog", { class: className, ...rest, children: [
    title ? /* @__PURE__ */ jsx("h4", { className: "i-dialog-title", children: title }) : null,
    /* @__PURE__ */ jsx("div", { className: "i-dialog-content", children: children2 }),
    hasActionsBlock ? /* @__PURE__ */ jsxs("div", { className: "i-dialog-actions", children: [
      customActions.length > 0 ? customActions.map((a, idx) => /* @__PURE__ */ jsx(
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
      hasBuiltInActions && customActions.length > 0 ? /* @__PURE__ */ jsx("span", { className: "flex-fill" }) : null,
      okAction ? /* @__PURE__ */ jsx(
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
      confirmAction ? /* @__PURE__ */ jsx(
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
      saveAction ? /* @__PURE__ */ jsx(
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
      cancelAction ? /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx("i-alert", { children: /* @__PURE__ */ jsxs(
    IDialog,
    {
      className: alertClass,
      actions: [{ type: "ok", className: "w-full" }],
      onOk: () => dialog.close(true),
      children: [
        data.type === "information" ? /* @__PURE__ */ jsx(IIcon, { icon: "info", size: "3xl" }) : null,
        data.type === "success" ? /* @__PURE__ */ jsx(IIcon, { icon: "check-circle", size: "3xl" }) : null,
        data.type === "warning" ? /* @__PURE__ */ jsx(IIcon, { icon: "exclamation", size: "3xl" }) : null,
        data.type === "danger" ? /* @__PURE__ */ jsx(IIcon, { icon: "x-circle", size: "3xl" }) : null,
        /* @__PURE__ */ jsx("h4", { children: data.title }),
        /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: data.description } })
      ]
    }
  ) });
}
function useIAlert() {
  const dialog = useIDialog();
  const show = useCallback(
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
  return useMemo(
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
  const [reason, setReason] = useState("");
  const [invalid, setInvalid] = useState(false);
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
  return /* @__PURE__ */ jsx("i-confirm", { children: /* @__PURE__ */ jsxs(
    IDialog,
    {
      className: confirmClass,
      actions: [
        { type: "confirm", className: "w-104" },
        { type: "cancel", className: "w-104" }
      ],
      onConfirm: submit,
      children: [
        data.type === "information" ? /* @__PURE__ */ jsx(IIcon, { icon: "info", size: "3xl" }) : null,
        data.type === "success" ? /* @__PURE__ */ jsx(IIcon, { icon: "check-circle", size: "3xl" }) : null,
        data.type === "warning" ? /* @__PURE__ */ jsx(IIcon, { icon: "exclamation", size: "3xl" }) : null,
        data.type === "danger" ? /* @__PURE__ */ jsx(IIcon, { icon: "x-circle", size: "3xl" }) : null,
        /* @__PURE__ */ jsx("h4", { children: data.title }),
        /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: data.description } }),
        data.reason ? /* @__PURE__ */ jsxs(
          "form",
          {
            className: "mt-xs",
            onSubmit: (e) => {
              e.preventDefault();
              submit();
            },
            children: [
              /* @__PURE__ */ jsx(
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
              /* @__PURE__ */ jsx("button", { className: "hidden", type: "submit", children: "Submit" })
            ]
          }
        ) : null
      ]
    }
  ) });
}
function useIConfirm() {
  const dialog = useIDialog();
  const show = useCallback(
    async (data) => {
      const ref = dialog.open(IConfirm, {
        width: "",
        data
      });
      return ref.afterClosed();
    },
    [dialog]
  );
  return useMemo(
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
function useOptionalIConfirm() {
  const dialog = useContext(IDialogContext);
  const show = useCallback(
    async (data) => {
      if (!dialog) return false;
      const ref = dialog.open(IConfirm, {
        width: "",
        data
      });
      return ref.afterClosed();
    },
    [dialog]
  );
  const api = useMemo(
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
  if (!dialog) return null;
  return api;
}

// src/components/empty-state/empty-state-presets.ts
var I_EMPTY_STATE_PRESETS = {
  empty: {
    title: "No data available.",
    description: "",
    icon: "fa-solid fa-folder-open"
  },
  search: {
    title: "No data matches your search.",
    description: "Try a different keyword.",
    icon: "fa-solid fa-magnifying-glass"
  },
  filter: {
    title: "No data matches the selected filters.",
    description: "Adjust or clear the filters.",
    icon: "fa-solid fa-filter"
  },
  "search-filter": {
    title: "No data matches your search and selected filters.",
    description: "Try a different keyword or clear the filters.",
    icon: "fa-solid fa-filter"
  },
  prerequisite: {
    title: "Additional information is required.",
    description: "",
    icon: "fa-solid fa-circle-info"
  }
};
function IEmptyState({
  kind = "empty",
  title,
  description,
  icon,
  density = "default",
  children: children2,
  className,
  ...rest
}) {
  const preset = I_EMPTY_STATE_PRESETS[kind];
  return /* @__PURE__ */ jsxs(
    "i-empty-state",
    {
      ...rest,
      class: ["i-empty-state", className].filter(Boolean).join(" "),
      role: "status",
      "aria-live": "polite",
      "data-empty-state-kind": kind,
      density,
      children: [
        /* @__PURE__ */ jsx(IIcon, { icon: icon || preset.icon, size: "lg", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("p", { className: "i-empty-state__title", children: title || preset.title }),
        description || preset.description ? /* @__PURE__ */ jsx("p", { className: "i-empty-state__description", children: description || preset.description }) : null,
        children2
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
  return /* @__PURE__ */ jsx("i-section", { class: className, ...rest });
}
function ISectionHeader(props) {
  const { children: children2, className, ...rest } = props;
  return /* @__PURE__ */ jsx("i-section-header", { class: className, ...rest, children: /* @__PURE__ */ jsx("h4", { children: children2 }) });
}
function ISectionSubHeader(props) {
  const { children: children2, className, ...rest } = props;
  return /* @__PURE__ */ jsx("i-section-sub-header", { class: className, ...rest, children: /* @__PURE__ */ jsx("h6", { children: children2 }) });
}
function ISectionFilter(props) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsx("i-section-filter", { class: className, ...rest });
}
function ISectionBody(props) {
  const { className, layout = "auto", ...rest } = props;
  return /* @__PURE__ */ jsx(
    "i-section-body",
    {
      class: ["i-surface-content", className].filter(Boolean).join(" "),
      "data-layout": layout,
      ...rest
    }
  );
}
function ISectionFooter(props) {
  const { className, ...rest } = props;
  return /* @__PURE__ */ jsx("i-section-footer", { class: className, ...rest });
}
function ISectionTab(_props) {
  return null;
}
function DefaultHeader(props) {
  const { title, badgeEnabled, badgeValue } = props;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { className: "i-section-tab-title", children: title }),
    badgeEnabled ? /* @__PURE__ */ jsx(
      "span",
      {
        className: [
          "i-section-tab-badge",
          badgeValue !== null ? "has-number" : null
        ].filter(Boolean).join(" "),
        children: badgeValue !== null ? /* @__PURE__ */ jsx("span", { className: "i-section-tab-badge-number", children: badgeValue }) : null
      }
    ) : null
  ] });
}
function normalizeTab(node, index) {
  if (!React9.isValidElement(node)) return null;
  if (node.type !== ISectionTab) return null;
  const props = node.props;
  const title = String(props.title ?? "");
  const opened = parseOpened(props.opened);
  const parsed = parseBadge(props.badge);
  const headerNode = props.header !== void 0 && props.header !== null ? props.header : /* @__PURE__ */ jsx(
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
    contentClassName: props.contentClassName ?? props.className ?? "",
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
    children: children2,
    className,
    ...rest
  } = props;
  const tabs = useMemo(() => {
    const arr = React9.Children.toArray(children2);
    return arr.map((n, i) => normalizeTab(n, i)).filter(Boolean);
  }, [children2]);
  const openedIndex = useMemo(() => tabs.findIndex((t) => t.opened), [tabs]);
  const contentHeightPx = useMemo(() => parseTabsHeight(height), [height]);
  const chevronWidth = CHEVRON_WIDTH_BY_SIZE[chevronSize];
  const isFixedHeight = contentHeightPx !== null;
  const hasValidControlledIndex = selectedIndex !== null && selectedIndex !== void 0 && isValidIndex(selectedIndex, tabs.length);
  const computeNextIndex = useCallback(() => {
    if (hasValidControlledIndex) return selectedIndex;
    if (openedIndex >= 0 && isValidIndex(openedIndex, tabs.length))
      return openedIndex;
    return 0;
  }, [hasValidControlledIndex, selectedIndex, openedIndex, tabs.length]);
  const [activeIndex, setActiveIndex] = useState(
    () => computeNextIndex()
  );
  const scrollContainerRef = useRef(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  useEffect(() => {
    setActiveIndex(computeNextIndex());
  }, [computeNextIndex]);
  const activeTab = tabs[activeIndex] ?? null;
  const setActive = useCallback(
    (index, emit) => {
      if (!isValidIndex(index, tabs.length)) return;
      setActiveIndex(index);
      if (emit) {
        onSelectedIndexChange == null ? void 0 : onSelectedIndexChange(index);
      }
    },
    [onSelectedIndexChange, tabs.length]
  );
  const checkOverflow = useCallback(() => {
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
  useEffect(() => {
    checkOverflow();
    const container = scrollContainerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return void 0;
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);
    return () => observer.disconnect();
  }, [checkOverflow, tabs]);
  useEffect(() => {
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
  const activateFromKeyboard = useCallback(
    (event, index) => {
      var _a, _b;
      const lastIndex = tabs.length - 1;
      let nextIndex = null;
      if (event.key === "ArrowLeft")
        nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === "ArrowRight")
        nextIndex = index === lastIndex ? 0 : index + 1;
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
  const scrollBy = useCallback((left) => {
    const container = scrollContainerRef.current;
    if (typeof (container == null ? void 0 : container.scrollBy) === "function") {
      container.scrollBy({ left, behavior: "smooth" });
    }
  }, []);
  return /* @__PURE__ */ jsxs(
    "i-section-tabs",
    {
      class: [styleVariant === "bar" ? "i-section-tabs--bar" : null, className].filter(Boolean).join(" "),
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: [
              "i-section-tabs-headers",
              sticky ? "i-section-tabs-headers--sticky" : null,
              headerClass
            ].filter(Boolean).join(" "),
            role: "tablist",
            style: sticky ? {
              "--i-section-tabs-sticky-top": stickyTopOffset
            } : void 0,
            children: [
              scrollable ? /* @__PURE__ */ jsx(
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
                  children: /* @__PURE__ */ jsx(IIcon, { icon: "prev", size: chevronSize })
                }
              ) : null,
              /* @__PURE__ */ jsx(
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
                    return /* @__PURE__ */ jsx(
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
              scrollable ? /* @__PURE__ */ jsx(
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
                  children: /* @__PURE__ */ jsx(IIcon, { icon: "next", size: chevronSize })
                }
              ) : null
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: [
              "i-section-tabs-content",
              activeTab == null ? void 0 : activeTab.contentClassName,
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

// src/components/error-page/error-page.types.ts
var I_ERROR_PAGE_PRESETS = {
  "not-found": {
    title: "Page Not Found",
    description: "Sorry, the page you are looking for does not exist.",
    icon: "fa-solid fa-bug",
    code: "404"
  },
  unauthorized: {
    title: "Unauthorized Access",
    description: "Sorry, you do not have access to this page.",
    icon: "fa-solid fa-ban",
    code: "401"
  },
  forbidden: {
    title: "Unauthorized Access",
    description: "You do not have access to this page. Please contact your administrator.",
    icon: "fa-solid fa-user-lock",
    code: "403"
  },
  "server-error": {
    title: "Something Went Wrong",
    description: "We could not complete your request. Please try again.",
    icon: "fa-solid fa-triangle-exclamation",
    code: "500"
  },
  "service-unavailable": {
    title: "Service Unavailable",
    description: "The service is temporarily unavailable. Please try again later.",
    icon: "fa-solid fa-server",
    code: "503"
  },
  timeout: {
    title: "Request Timed Out",
    description: "The request took too long to complete. Please try again.",
    icon: "fa-solid fa-clock",
    code: ""
  },
  "application-access-denied": {
    title: "Unauthorized Access",
    description: "Sorry, your account does not have the required access or role assigned for this application.",
    icon: "fa-solid fa-user-lock",
    code: ""
  },
  custom: {
    title: "Unable to Display This Page",
    description: "Please try again or contact your administrator.",
    icon: "fa-solid fa-circle-exclamation",
    code: ""
  }
};
var I_ERROR_PAGE_ACTIONS = {
  home: {
    label: "Back to Home",
    icon: "fa-solid fa-house",
    variant: "primary"
  },
  logout: {
    label: "Logout",
    icon: "fa-solid fa-right-from-bracket",
    variant: "danger"
  },
  retry: { label: "Retry", icon: "sync", variant: "primary" }
};
var I_ERROR_PAGE_SUPPORT_EMAIL = "it.helpdesk@paramountenterprise.co.id";
function IErrorPage({
  kind = "not-found",
  mode = "contained",
  title,
  description,
  icon,
  code,
  supportEmail = I_ERROR_PAGE_SUPPORT_EMAIL,
  actions = [],
  onAction,
  children: children2,
  customActions,
  className,
  ...rest
}) {
  const preset = I_ERROR_PAGE_PRESETS[kind];
  const resolved = {
    title: title ?? preset.title,
    description: description ?? preset.description,
    icon: icon ?? preset.icon,
    code: code ?? preset.code
  };
  const content = /* @__PURE__ */ jsxs("div", { className: "i-error-page__content text-center", children: [
    resolved.icon || resolved.code ? /* @__PURE__ */ jsxs("div", { className: "i-error-page__visual", children: [
      resolved.icon ? /* @__PURE__ */ jsx(IIcon, { icon: resolved.icon, size: "4xl", "aria-hidden": "true" }) : null,
      resolved.code ? /* @__PURE__ */ jsx("span", { className: "i-error-page__code font-bold leading-none", children: resolved.code }) : null
    ] }) : null,
    resolved.title ? /* @__PURE__ */ jsx("h1", { className: "m-0 text-3xl font-normal", children: resolved.title }) : null,
    /* @__PURE__ */ jsxs("div", { className: "i-error-page__message text-md text-subtle leading-relaxed", children: [
      resolved.description ? /* @__PURE__ */ jsx("p", { className: "m-0 text-subtle leading-relaxed", children: resolved.description }) : null,
      /* @__PURE__ */ jsx("div", { className: "i-error-page__extra", children: children2 }),
      supportEmail ? /* @__PURE__ */ jsxs("p", { className: "m-0 text-subtle leading-relaxed", children: [
        kind === "application-access-denied" ? "Please contact the IT Administrator to register your access:" : "For assistance, please contact:",
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "i-error-page__support text-primary font-medium underline",
            href: `mailto:${supportEmail}`,
            children: supportEmail
          }
        )
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "i-error-page__actions", children: [
      actions.map((action, index) => /* @__PURE__ */ jsx(
        IButton,
        {
          type: "button",
          icon: I_ERROR_PAGE_ACTIONS[action].icon,
          variant: I_ERROR_PAGE_ACTIONS[action].variant,
          onClick: () => onAction == null ? void 0 : onAction(action),
          children: I_ERROR_PAGE_ACTIONS[action].label
        },
        `${action}-${index}`
      )),
      customActions
    ] })
  ] });
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: [
        "i-error-page",
        kind === "not-found" ? "i-error-page--not-found" : "",
        mode === "fullpage" ? "i-error-page--fullpage" : "",
        className
      ].filter(Boolean).join(" "),
      ...rest,
      children: mode === "contained" ? /* @__PURE__ */ jsx(ISection, { className: "i-error-page__section", children: /* @__PURE__ */ jsx(ISectionBody, { className: "i-error-page__body", children: content }) }) : /* @__PURE__ */ jsx("div", { className: "i-error-page__body", children: content })
    }
  );
}
function IPaginator(props) {
  const { length, pageIndex, pageSize, pageSizeOptions, onPageChange } = props;
  const maxVisiblePages = 6;
  const pageCount = Math.max(1, Math.ceil(length / pageSize));
  const pageItems = useMemo(() => {
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
  return /* @__PURE__ */ jsx("i-paginator", { class: "i-paginator", children: /* @__PURE__ */ jsxs("div", { className: "i-paginator flex align-center gap-md flex-fill", children: [
    pageSizeOptions.map((size) => /* @__PURE__ */ jsx(
      IButton,
      {
        size: "sm",
        disabled: pageSize === size,
        onClick: () => changePageSize(size),
        children: size
      },
      size
    )),
    /* @__PURE__ */ jsx("span", { className: "flex-fill" }),
    /* @__PURE__ */ jsxs("p", { children: [
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
    pageCount > 1 ? /* @__PURE__ */ jsx("div", { className: "i-paginator-pages flex align-center gap-xs", children: pageItems.map((item) => {
      if (item.type === "ellipsis") {
        return /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: "i-paginator-ellipsis",
            children: "..."
          },
          item.key
        );
      }
      return /* @__PURE__ */ jsx(
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
  _filteredLength = 0;
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
  get filteredLength() {
    var _a;
    return this._delegatesPage() ? ((_a = this._serverSide) == null ? void 0 : _a.totalRowCount) ?? 0 : this._filteredLength;
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
      if ((options == null ? void 0 : options.total) !== void 0)
        this._serverSide.totalRowCount = options.total;
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
    const children2 = Array.isArray(rawChildren) ? rawChildren : [];
    const filteredChildren = this._filterRecursiveArray(children2, filter);
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
    this._filteredLength = data.length;
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
      this._pageIndex = Math.min(
        this._pageIndex,
        Math.max(0, Math.ceil(data.length / this._pageSize) - 1)
      );
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
  const {
    checked,
    indeterminate,
    disabled = false,
    onChange,
    className,
    stopRowClick
  } = props;
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return /* @__PURE__ */ jsx(
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
function defaultHighlightSearch(text2, rawTerm) {
  const term = typeof rawTerm === "string" ? rawTerm.trim() : String(rawTerm ?? "").trim();
  if (!text2 || !term) return text2 ?? "";
  const value = String(text2);
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
      /* @__PURE__ */ jsx("span", { className: "highlight-search", children: value.slice(start, end) }, `h-${i}-${start}-${end}`)
    );
    lastIndex = end;
    i += 1;
  }
  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }
  return /* @__PURE__ */ jsx(Fragment, { children: parts });
}
function renderCellDef(def, row, ctx) {
  if (!def) return null;
  return def.length >= 2 ? def(row, ctx) : def(row);
}
function IGridInner(props, ref) {
  const {
    dataSource,
    emptyState = {},
    renderEmptyState,
    className,
    style,
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
    children: children2,
    highlightSearch,
    trackBy
  } = props;
  const idRef = useRef(Math.random().toString(36).slice(2));
  const selectionColumnWidth = 32;
  const numberColumnWidth = 60;
  const expandColumnWidth = 32;
  const defaultColumnWidth = 200;
  const numberColumn = useMemo(
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
  const [renderedData, setRenderedData] = useState([]);
  const [currentFilterText, setCurrentFilterText] = useState("");
  const [sortStates, setSortStates] = useState([]);
  const columnWidthsRef = useRef(/* @__PURE__ */ new Map());
  const columnWidthKeysRef = useRef(/* @__PURE__ */ new WeakMap());
  const [, setTick] = useState(0);
  const [selectionSet, setSelectionSet] = useState(/* @__PURE__ */ new Set());
  const [expandedSet, setExpandedSet] = useState(/* @__PURE__ */ new Set());
  const selectionSetRef = useRef(selectionSet);
  useEffect(() => {
    selectionSetRef.current = selectionSet;
  }, [selectionSet]);
  useEffect(() => {
    if (!(dataSource instanceof IGridDataSource)) return void 0;
    const unsubscribers = [
      onServerSortChange ? dataSource.subscribeServerSort(onServerSortChange) : void 0,
      onServerPageChange ? dataSource.subscribeServerPage(onServerPageChange) : void 0,
      onServerFilterChange ? dataSource.subscribeServerFilter(onServerFilterChange) : void 0
    ].filter((unsubscribe) => !!unsubscribe);
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [
    dataSource,
    onServerFilterChange,
    onServerPageChange,
    onServerSortChange
  ]);
  const treeMetaRef = useRef(/* @__PURE__ */ new Map());
  const treeRootsRef = useRef([]);
  const { headerItems, columns, expandableRowDef } = useMemo(() => {
    var _a;
    const all = Children.toArray(children2).filter(Boolean);
    let expandable = null;
    const parseColumnEl = (el, key) => {
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
        minWidth: p.minWidth,
        headerDef: p.headerDef,
        cellDef: p.cellDef,
        isAuto: false
      };
      columnWidthKeysRef.current.set(
        col,
        JSON.stringify([key, kind, col.fieldName, col.width])
      );
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
        const kids = Children.toArray(gp.children).filter(
          Boolean
        );
        const gCols = [];
        for (const kid of kids) {
          const c2 = parseColumnEl(kid, JSON.stringify([node.key, kid.key]));
          if (c2) gCols.push(c2);
        }
        header.push({
          kind: "group",
          title: gp.title ?? "",
          columns: gCols
        });
        continue;
      }
      const c = parseColumnEl(node, JSON.stringify([node.key]));
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
  }, [children2]);
  const hasExpandableRow = !!(expandableRowDef == null ? void 0 : expandableRowDef.render);
  const treeEnabled = tree !== null && tree !== false;
  const treeChildrenKey = useMemo(() => {
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
  const rawRows = useMemo(() => {
    if (dataSource instanceof IGridDataSource) return dataSource.data ?? [];
    if (Array.isArray(dataSource)) return dataSource;
    return [];
  }, [dataSource]);
  const autoColumns = useMemo(() => {
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
  const effectiveHeaderItems = useMemo(() => {
    if (headerItems.length) return headerItems;
    return autoColumns.map((c) => ({ kind: "col", col: c }));
  }, [headerItems, autoColumns]);
  const effectiveColumns = useMemo(() => {
    if (columns.length) return columns;
    return autoColumns;
  }, [columns, autoColumns]);
  const getColumnWidthKey = (col) => columnWidthKeysRef.current.get(col) ?? col;
  const getColumnMinWidth = (col) => col.minWidth ?? (col.width === "fill" ? 150 : null);
  const getColumnWidth = (col) => {
    const minWidth = getColumnMinWidth(col) ?? 0;
    const override = columnWidthsRef.current.get(getColumnWidthKey(col));
    if (typeof override === "number") return Math.max(override, minWidth);
    if (typeof col.width === "number") return Math.max(col.width, minWidth);
    if (col.width === "fill") return null;
    return Math.max(defaultColumnWidth, minWidth);
  };
  const getColumnFlex = (col) => {
    const px = getColumnWidth(col);
    if (px !== null) return `0 0 ${px}px`;
    return "1 1 0%";
  };
  const setColumnWidth = (col, width) => {
    columnWidthsRef.current.set(
      getColumnWidthKey(col),
      Math.max(width, getColumnMinWidth(col) ?? 0)
    );
    setTick((n) => n + 1);
  };
  useEffect(() => {
    const map = columnWidthsRef.current;
    for (const col of effectiveColumns) {
      const key = getColumnWidthKey(col);
      if (!map.has(key)) {
        const px = getColumnWidth(col);
        if (px !== null) map.set(key, px);
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
  useLayoutEffect(() => {
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
        const children3 = getChildren(row);
        const hasChildrenFlag = children3.length > 0;
        const expanded = shouldRowStartExpanded(level, hasChildrenFlag);
        if (parent === null) treeRootsRef.current.push(row);
        treeMetaRef.current.set(row, {
          level,
          parent,
          hasChildren: hasChildrenFlag,
          expanded
        });
        children3.forEach((c) => visit(c, level + 1, row));
      };
      (roots || []).forEach((r) => visit(r, 0, null));
    };
    const rebuildTreeRenderedWith = (getChildren) => {
      const out = [];
      const appendVisible = (row) => {
        out.push(row);
        const meta = treeMetaRef.current.get(row);
        if (!(meta == null ? void 0 : meta.expanded)) return;
        const children3 = getChildren(row);
        for (const child of children3) appendVisible(child);
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
      const children3 = getTreeChildren(r);
      for (const child of children3) {
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
    const next = new Set(
      rows.filter((row) => validRows.has(row) && isRowSelectable(row))
    );
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
  useImperativeHandle(ref, () => ({
    setSelected,
    getSelected: () => Array.from(selectionSetRef.current)
  }));
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
      const children3 = getTreeChildren(row);
      for (const child of children3) appendVisible(child);
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
  const sortStatesRef = useRef([]);
  useEffect(() => {
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
  const totalLength = dataSource instanceof IGridDataSource ? dataSource.filteredLength : renderedData.length;
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
      children: children3,
      className: className2,
      resizable,
      disableSortClick,
      auto,
      sticky
    } = p;
    const isResizingRef = useRef(false);
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
        setColumnWidth(col, startWidth + delta);
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
    return /* @__PURE__ */ jsxs(
      "i-grid-header-cell",
      {
        class: [
          "i-grid-header-cell",
          className2,
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
          minWidth: fixedWidth ?? (col ? getColumnMinWidth(col) ?? void 0 : void 0),
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
          /* @__PURE__ */ jsx("span", { className: "i-grid-header-cell__content", truncatedtooltip: "", children: children3 }),
          showIcon ? /* @__PURE__ */ jsx("span", { className: "i-grid-header-cell__icon", children: /* @__PURE__ */ jsx(
            IIcon,
            {
              size: "sm",
              icon: direction === "asc" ? "sort-asc" : "sort-dsc"
            }
          ) }) : null,
          /* @__PURE__ */ jsx(
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
    const { col, fixedWidth, children: children3, className: className2, onClickStop, auto, sticky } = p;
    const computedFrozen = !!col && isColumnFrozen(col);
    const computedLeft = computedFrozen && col ? getColumnStickyLeft(col) : null;
    const computedZ = computedFrozen && col ? getFrozenColumnZ(col) : null;
    const stickyEnabled = (sticky == null ? void 0 : sticky.sticky) ?? computedFrozen;
    const frozenClass = (sticky == null ? void 0 : sticky.addFrozenClass) ?? computedFrozen;
    const stickyLeft = stickyEnabled ? (sticky == null ? void 0 : sticky.stickyLeft) ?? computedLeft : null;
    const zIndex = stickyEnabled ? (sticky == null ? void 0 : sticky.zIndex) ?? computedZ : null;
    const flex = typeof fixedWidth === "number" ? `0 0 ${fixedWidth}px` : col ? getColumnFlex(col) : "1 1 0";
    return /* @__PURE__ */ jsx(
      "i-grid-cell",
      {
        class: [
          "i-grid-cell",
          className2,
          frozenClass ? "i-grid-cell--frozen" : null,
          auto ? "i-grid-cell--auto" : null
        ].filter(Boolean).join(" "),
        role: "cell",
        style: {
          flex,
          minWidth: fixedWidth ?? (col ? getColumnMinWidth(col) ?? void 0 : void 0),
          position: stickyEnabled ? "sticky" : void 0,
          left: stickyEnabled ? stickyLeft ?? void 0 : void 0,
          zIndex: stickyEnabled && typeof zIndex === "number" ? zIndex : void 0
          // ✅ only if explicitly passed
        },
        onClick: (e) => {
          if (onClickStop) e.stopPropagation();
        },
        children: children3
      }
    );
  };
  const highlightSearchFn = useMemo(
    () => highlightSearch ?? defaultHighlightSearch,
    [highlightSearch]
  );
  const resolvedEmptyState = {
    ...emptyState,
    kind: emptyState.kind ?? (currentFilterText ? "search" : "empty")
  };
  const showGridChrome = renderedData.length > 0 || ["search", "filter", "search-filter"].includes(resolvedEmptyState.kind);
  return /* @__PURE__ */ jsxs(
    "i-grid",
    {
      class: ["i-grid", className].filter(Boolean).join(" "),
      style,
      role: showGridChrome ? "table" : void 0,
      "data-i-surface": "flush",
      children: [
        /* @__PURE__ */ jsxs("i-grid-viewport", { class: "i-grid-viewport", children: [
          effectiveHeaderItems.length && showGridChrome ? /* @__PURE__ */ jsxs("i-grid-header-row", { class: "i-grid-header-row", children: [
            !treeEnabled && hasExpandableRow && !((expandableRowDef == null ? void 0 : expandableRowDef.expandSingle) ?? (expandableRowDef == null ? void 0 : expandableRowDef.iRowDefExpandSingle)) ? /* @__PURE__ */ jsx(
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
                children: /* @__PURE__ */ jsx("span", { className: "i-grid-header-cell__content", children: /* @__PURE__ */ jsx(
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
            !treeEnabled && selectionMode ? /* @__PURE__ */ jsx(
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
                children: /* @__PURE__ */ jsx("span", { className: "i-grid-header-cell__content", children: selectionMode === "multiple" ? /* @__PURE__ */ jsx(
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
            showNumberColumnEffective ? /* @__PURE__ */ jsx(
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
                  return /* @__PURE__ */ jsx(
                    HeaderCell,
                    {
                      col,
                      resizable: col.resizable,
                      auto: !!col.isAuto,
                      children: /* @__PURE__ */ jsxs("span", { className: "i-grid-tree-head", children: [
                        /* @__PURE__ */ jsx(
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
                        selectionMode === "multiple" ? /* @__PURE__ */ jsx(
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
                        /* @__PURE__ */ jsx("span", { className: "i-grid-tree-head__title", children: col.title || col.fieldName })
                      ] })
                    },
                    `h-${idx}`
                  );
                }
                if (col.headerDef) {
                  return /* @__PURE__ */ jsx(React9.Fragment, { children: col.headerDef(col) }, `h-${idx}`);
                }
                return /* @__PURE__ */ jsx(
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
              return /* @__PURE__ */ jsxs(
                "i-grid-header-cell-group",
                {
                  class: "i-grid-header-cell-group",
                  children: [
                    /* @__PURE__ */ jsx(HeaderCell, { disableSortClick: true, children: item.title }),
                    /* @__PURE__ */ jsx("i-grid-header-cell-group-columns", { class: "i-grid-header-cell-group-columns", children: item.columns.map((col, cIdx) => {
                      if (col.headerDef) {
                        return /* @__PURE__ */ jsx(React9.Fragment, { children: col.headerDef(col) }, `gc-${cIdx}`);
                      }
                      return /* @__PURE__ */ jsx(
                        HeaderCell,
                        {
                          col,
                          resizable: col.resizable,
                          auto: !!col.isAuto,
                          children: col.title || col.fieldName
                        },
                        `gc-${cIdx}`
                      );
                    }) })
                  ]
                },
                `g-${idx}`
              );
            })
          ] }) : null,
          renderedData.map((row, rowIndex) => {
            const key = props.rowKey ? props.rowKey(row, rowIndex) : trackBy ? trackBy(row, rowIndex) : rowIndex;
            return /* @__PURE__ */ jsxs(React9.Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "i-grid-row",
                {
                  class: [
                    "i-grid-row",
                    selectionMode ? "i-grid-selection-row" : null
                  ].filter(Boolean).join(" "),
                  onClick: () => onRowClick == null ? void 0 : onRowClick(row),
                  children: [
                    !treeEnabled && hasExpandableRow ? /* @__PURE__ */ jsx(
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
                        children: /* @__PURE__ */ jsx("span", { className: "i-grid-expand-cell__content", children: /* @__PURE__ */ jsx(
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
                    !treeEnabled && selectionMode ? /* @__PURE__ */ jsx(
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
                        children: isSelectionHidden(row) ? /* @__PURE__ */ jsx(
                          "span",
                          {
                            "aria-hidden": "true",
                            className: "i-grid-selection-spacer"
                          }
                        ) : selectionMode === "multiple" ? /* @__PURE__ */ jsx(
                          IndeterminateCheckbox,
                          {
                            checked: getRowChecked(row),
                            indeterminate: getRowIndeterminate(row),
                            disabled: isSelectionDisabled(row),
                            onChange: () => onRowSelectionToggle(row),
                            stopRowClick: true
                          }
                        ) : /* @__PURE__ */ jsx(
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
                    showNumberColumnEffective ? /* @__PURE__ */ jsx(
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
                        children: /* @__PURE__ */ jsx("span", { className: "i-grid-cell__content", children: getRowNumber(rowIndex) })
                      }
                    ) : null,
                    effectiveColumns.map((col, colIndex) => {
                      if (treeEnabled && isTreeHostColumn(col)) {
                        return /* @__PURE__ */ jsx(
                          Cell,
                          {
                            col,
                            auto: !!col.isAuto,
                            children: /* @__PURE__ */ jsxs("span", { className: "i-grid-tree-inline", children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: "i-grid-tree-indent",
                                  style: { width: getTreeIndentPx(row) }
                                }
                              ),
                              hasChildren(row) ? /* @__PURE__ */ jsx(
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
                              ) : /* @__PURE__ */ jsx("span", { className: "i-grid-tree-spacer" }),
                              isSelectionHidden(row) ? /* @__PURE__ */ jsx(
                                "span",
                                {
                                  "aria-hidden": "true",
                                  className: "i-grid-tree-selection-spacer"
                                }
                              ) : selectionMode === "multiple" ? /* @__PURE__ */ jsx(
                                IndeterminateCheckbox,
                                {
                                  className: "i-grid-tree-checkbox",
                                  checked: getRowChecked(row),
                                  indeterminate: getRowIndeterminate(row),
                                  disabled: isSelectionDisabled(row),
                                  onChange: () => onRowSelectionToggle(row),
                                  stopRowClick: true
                                }
                              ) : selectionMode === "single" ? /* @__PURE__ */ jsx(
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
                              }) : /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: "i-grid-tree-text",
                                  truncatedtooltip: "",
                                  children: col.fieldName ? highlightSearchFn(
                                    String(
                                      (row == null ? void 0 : row[col.fieldName]) ?? ""
                                    ),
                                    currentFilterText
                                  ) : ""
                                }
                              )
                            ] })
                          },
                          `c-${rowIndex}-${colIndex}`
                        );
                      }
                      return /* @__PURE__ */ jsx(
                        Cell,
                        {
                          col,
                          auto: !!col.isAuto,
                          children: col.cellDef ? renderCellDef(col.cellDef, row, {
                            row,
                            index: rowIndex,
                            column: col
                          }) : /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: "i-grid-cell__content",
                              truncatedtooltip: "",
                              children: col.fieldName ? highlightSearchFn(
                                String(
                                  (row == null ? void 0 : row[col.fieldName]) ?? ""
                                ),
                                currentFilterText
                              ) : ""
                            }
                          )
                        },
                        `c-${rowIndex}-${colIndex}`
                      );
                    })
                  ]
                }
              ),
              hasExpandableRow && isRowExpanded(row) ? /* @__PURE__ */ jsx("i-grid-expandable-row", { class: "i-grid-expandable-row flex", children: expandableRowDef.render(row, { row, index: rowIndex }) }) : null
            ] }, `r-${key}`);
          }),
          !renderedData.length ? /* @__PURE__ */ jsx(
            "div",
            {
              className: "i-grid-empty",
              "data-empty-density": resolvedEmptyState.density ?? "default",
              "data-page-sized": hasPagination && showGridChrome ? "" : void 0,
              role: showGridChrome ? "row" : void 0,
              style: {
                "--i-grid-empty-rows": hasPagination && showGridChrome ? pageSize : 0
              },
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "i-grid-empty__cell",
                  role: showGridChrome ? "cell" : void 0,
                  "aria-colspan": showGridChrome ? Math.max(
                    1,
                    effectiveColumns.length + (showNumberColumnEffective ? 1 : 0) + (!treeEnabled && selectionMode ? 1 : 0) + (!treeEnabled && hasExpandableRow ? 1 : 0)
                  ) : void 0,
                  children: renderEmptyState ? renderEmptyState(resolvedEmptyState) : /* @__PURE__ */ jsx(IEmptyState, { ...resolvedEmptyState })
                }
              )
            }
          ) : null
        ] }),
        hasPagination && showGridChrome ? /* @__PURE__ */ jsx("div", { className: "i-grid-footer", children: /* @__PURE__ */ jsx(
          IPaginator,
          {
            length: totalLength,
            pageIndex,
            pageSize,
            pageSizeOptions,
            onPageChange
          }
        ) }) : null
      ]
    }
  );
}
var IGrid = forwardRef(IGridInner);

// src/components/highlight-search/highlight-search-parts.ts
function highlightSearchParts(value, search) {
  const text2 = String(value ?? "");
  if (!search || !text2) return [{ text: text2, matched: false }];
  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const result = [];
  let offset = 0;
  for (const match of text2.matchAll(regex)) {
    const index = match.index;
    if (index > offset)
      result.push({ text: text2.slice(offset, index), matched: false });
    result.push({ text: match[0], matched: true });
    offset = index + match[0].length;
  }
  if (offset < text2.length)
    result.push({ text: text2.slice(offset), matched: false });
  return result;
}
function IHighlightSearch({
  value,
  search = ""
}) {
  return /* @__PURE__ */ jsx("i-highlight-search", { class: "i-highlight-search", children: highlightSearchParts(value, search).map(
    (part, index) => part.matched ? /* @__PURE__ */ jsx("span", { className: "highlight-search", children: part.text }, index) : /* @__PURE__ */ jsx(Fragment$1, { children: part.text }, index)
  ) });
}
var IAuthContext = createContext(null);
function useIAuthContext() {
  const ctx = useContext(IAuthContext);
  if (!ctx) {
    throw new Error(
      "useIAuthContext() must be used under <IAuthProvider> \u2014 wrap your app root with it (and provide an auth config)."
    );
  }
  return ctx;
}
function useISession() {
  const ctx = useIAuthContext();
  useSyncExternalStore(ctx.session.subscribe, ctx.session.getVersion);
  return ctx.session;
}
function useIApi() {
  return useIAuthContext().api;
}
function useIAuth() {
  return useIAuthContext().auth;
}
function useICsrf() {
  return useIAuthContext().csrf;
}
function useISessionExpired() {
  const ctx = useIAuthContext();
  useSyncExternalStore(
    ctx.sessionExpired.subscribe,
    ctx.sessionExpired.getVersion
  );
  return ctx.sessionExpired;
}
function useIUserMenuStore() {
  const ctx = useIAuthContext();
  useSyncExternalStore(
    ctx.userMenuStore.subscribe,
    ctx.userMenuStore.getVersion
  );
  return ctx.userMenuStore;
}
function useIImpersonation() {
  const { impersonation } = useIAuthContext();
  if (!impersonation)
    throw new Error(
      "Impersonation UI requires a runtime created by createIRuntime()."
    );
  useSyncExternalStore(impersonation.subscribe, impersonation.getVersion);
  return impersonation;
}
function INotificationBell({
  unreadCount = 0,
  expanded = false,
  onToggleRequested
}) {
  return /* @__PURE__ */ jsxs("i-notification-bell", { children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        className: "i-clickable",
        role: "button",
        tabIndex: 0,
        "aria-label": `Notifications, ${unreadCount} unread`,
        "aria-expanded": expanded,
        "aria-haspopup": "dialog",
        title: "Notifications",
        onClick: onToggleRequested,
        onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggleRequested == null ? void 0 : onToggleRequested();
          }
        },
        children: /* @__PURE__ */ jsx(
          IIcon,
          {
            icon: "fa-solid fa-bell",
            size: "lg",
            className: "text-gray-600",
            "aria-hidden": "true"
          }
        )
      }
    ),
    unreadCount > 0 && /* @__PURE__ */ jsx(
      "span",
      {
        className: "notification-badge flex align-center justify-center bg-primary text-white radius-full text-xs",
        "aria-hidden": "true",
        children: unreadCount > 99 ? "99+" : unreadCount
      }
    )
  ] });
}
function NotificationError({
  message,
  title,
  retryLoading = false,
  retryDisabled = false,
  onRetry
}) {
  return message ? /* @__PURE__ */ jsx("i-notification-error", { children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col align-center justify-center gap-xs px-md py-lg text-center text-subtle",
      role: "alert",
      children: [
        /* @__PURE__ */ jsx(
          IIcon,
          {
            icon: "fa-solid fa-circle-exclamation",
            size: "lg",
            "aria-hidden": "true"
          }
        ),
        title && /* @__PURE__ */ jsx("p", { className: "m-0", children: title }),
        /* @__PURE__ */ jsx("p", { className: "m-0 text-sm text-danger", children: message }),
        /* @__PURE__ */ jsx(
          IButton,
          {
            type: "button",
            variant: "primary",
            icon: "sync",
            size: "sm",
            disabled: retryDisabled,
            loading: retryLoading,
            onClick: () => !retryLoading && !retryDisabled && (onRetry == null ? void 0 : onRetry()),
            children: "Retry"
          }
        )
      ]
    }
  ) }) : null;
}

// src/components/notification/notification-presentation.ts
function truncateNotificationText(value) {
  return value.length > 50 ? `${value.slice(0, 50)}...` : value;
}
function notificationDate(value, now = /* @__PURE__ */ new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = (input) => Date.UTC(input.getFullYear(), input.getMonth(), input.getDate());
  const age = (day(now) - day(date)) / 864e5;
  if (age <= 0) return "Today";
  if (age === 1) return "Yesterday";
  if (age < 7) return `${age} days ago`;
  if (age === 7) return "Last week";
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  return `${date.getDate()} ${month} ${date.getFullYear()}`;
}
function INotificationItem({
  item,
  busy = false,
  onOpenRequested
}) {
  return /* @__PURE__ */ jsx("i-notification-item", { children: /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      className: "notification-item flex align-center gap-md w-full p-lg border-none bg-transparent text-left",
      disabled: busy,
      "aria-busy": busy,
      "aria-label": `Read notification: ${item.title}, ${item.groupCount} notifications`,
      onClick: () => onOpenRequested == null ? void 0 : onOpenRequested(item),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "group-count flex align-center justify-center shrink-0 bg-primary text-white radius-full text-sm font-semibold",
            "aria-hidden": "true",
            children: item.groupCount
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "flex flex-fill align-start justify-between gap-md min-w-0", children: [
          /* @__PURE__ */ jsxs("span", { className: "notification-copy flex flex-col gap-xs flex-fill min-w-0", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "text-md font-semibold text-gray-700",
                title: item.title,
                children: truncateNotificationText(item.title)
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", title: item.description, children: truncateNotificationText(item.description) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-subtle", children: item.moduleName })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex flex-col align-end gap-xs shrink-0 text-right", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-subtle", title: item.latestDate, children: notificationDate(item.latestDate) }),
            !item.isDismissable && /* @__PURE__ */ jsx("span", { className: "text-sm text-warning", children: "Important" })
          ] })
        ] })
      ]
    }
  ) });
}
function INotificationDrawer({
  items = [],
  unreadCount = 0,
  loading = false,
  hasLoaded = false,
  loadingMore = false,
  readingId = null,
  hasMore = false,
  error = null,
  loadMoreError = null,
  actionError = null,
  onCloseRequested,
  onOpenAllRequested,
  onItemOpened,
  onMoreRequested,
  onRetryRequested,
  onReadRetryRequested
}) {
  const refreshLabel = hasLoaded ? "Refreshing notifications..." : "Loading notifications...";
  return /* @__PURE__ */ jsxs("i-notification-drawer", { children: [
    /* @__PURE__ */ jsxs("header", { className: "border-b", children: [
      /* @__PURE__ */ jsxs("div", { className: "notification-header-main flex align-center justify-between gap-sm px-lg", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl leading-snug font-semibold m-0 truncate", children: "Notifications" }),
        /* @__PURE__ */ jsxs("div", { className: "flex align-center gap-xs shrink-0", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "i-clickable notification-icon-action border-none text-gray-600",
              "aria-label": "Open all notifications in a new tab",
              title: "Open All Notifications",
              onClick: onOpenAllRequested,
              children: /* @__PURE__ */ jsx(
                IIcon,
                {
                  icon: "fa-solid fa-arrow-up-right-from-square",
                  "aria-hidden": "true"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "i-clickable notification-icon-action border-none text-gray-600",
              "aria-label": "Close notifications",
              title: "Close notifications",
              onClick: onCloseRequested,
              children: /* @__PURE__ */ jsx(IIcon, { icon: "fa-solid fa-xmark", "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "notification-header-summary flex align-center gap-sm px-lg text-sm", children: [
        /* @__PURE__ */ jsxs("p", { className: "m-0 truncate", "aria-live": "polite", children: [
          "You have ",
          unreadCount,
          " unread notifications"
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "notification-refresh-status flex align-center justify-center shrink-0",
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            title: loading ? refreshLabel : void 0,
            children: loading && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(ILoading, { label: "", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { className: "notification-refresh-label", children: refreshLabel })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "notification-scroll",
        "aria-busy": loading,
        onScroll: (event) => {
          const target = event.currentTarget;
          if (!loading && !loadingMore && readingId === null && !loadMoreError && !error && hasMore && target.scrollTop + target.clientHeight >= target.scrollHeight * 0.8)
            onMoreRequested == null ? void 0 : onMoreRequested();
        },
        children: [
          loading && !hasLoaded && items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "notification-initial-space", "aria-hidden": "true" }) : error && items.length === 0 ? /* @__PURE__ */ jsx(NotificationError, { message: error, onRetry: onRetryRequested }) : items.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-2xl text-center text-subtle", role: "status", children: "No new notifications" }) : /* @__PURE__ */ jsx(
            "ul",
            {
              className: "list-none m-0 p-0",
              "aria-label": "Unread notification groups",
              children: items.map((item) => /* @__PURE__ */ jsx("li", { className: "border-b border-subtle", children: /* @__PURE__ */ jsx(
                INotificationItem,
                {
                  item,
                  busy: readingId !== null,
                  onOpenRequested: onItemOpened
                }
              ) }, item.notificationId))
            }
          ),
          error && items.length > 0 && /* @__PURE__ */ jsx(
            NotificationError,
            {
              message: error,
              retryLoading: loading,
              onRetry: onRetryRequested
            }
          ),
          actionError && /* @__PURE__ */ jsx(
            NotificationError,
            {
              message: actionError,
              title: "Failed to mark notification as read.",
              retryLoading: readingId !== null,
              onRetry: onReadRetryRequested
            }
          ),
          loadingMore ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-lg", role: "status", children: /* @__PURE__ */ jsx(ILoading, { label: "Loading more notifications..." }) }) : loadMoreError ? /* @__PURE__ */ jsx(
            NotificationError,
            {
              message: loadMoreError,
              onRetry: onMoreRequested
            }
          ) : hasMore ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-md", children: /* @__PURE__ */ jsx(
            IButton,
            {
              type: "button",
              size: "sm",
              disabled: loading || readingId !== null,
              onClick: onMoreRequested,
              children: "Load more"
            }
          ) }) : null
        ]
      }
    )
  ] });
}

// src/components/notification/notification-modal.ts
var panels = [];
var locks = /* @__PURE__ */ new WeakMap();
function lockScroll(doc) {
  var _a;
  let lock = locks.get(doc);
  if (!lock) {
    lock = {
      count: 0,
      bodyOverflow: doc.body.style.overflow,
      rootOverflow: doc.documentElement.style.overflow,
      paddingRight: doc.body.style.paddingRight
    };
    locks.set(doc, lock);
    const scrollbar = (((_a = doc.defaultView) == null ? void 0 : _a.innerWidth) ?? 0) - doc.documentElement.clientWidth;
    if (scrollbar > 0)
      doc.body.style.paddingRight = `${parseFloat(getComputedStyle(doc.body).paddingRight || "0") + scrollbar}px`;
    doc.body.style.overflow = "hidden";
    doc.documentElement.style.overflow = "hidden";
  }
  lock.count++;
  return () => {
    if (--lock.count) return;
    doc.body.style.overflow = lock.bodyOverflow;
    doc.documentElement.style.overflow = lock.rootOverflow;
    doc.body.style.paddingRight = lock.paddingRight;
    locks.delete(doc);
  };
}
function focusables(panel) {
  return Array.from(
    panel.querySelectorAll(
      "button, a[href], input, select, textarea, [tabindex]"
    )
  ).filter(
    (element) => element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest("[hidden], [inert], [data-notification-focus-guard]") && getComputedStyle(element).display !== "none" && getComputedStyle(element).visibility !== "hidden"
  );
}
function mountNotificationModal(panel) {
  const doc = panel.ownerDocument;
  const previous = doc.activeElement;
  const container = panel.closest("i-dialog-container");
  const isTop = () => panels.at(-1) === panel && !Array.from(doc.querySelectorAll('[role="dialog"]')).some(
    (other) => other !== container && !other.contains(container) && !other.closest("[hidden], [inert]") && getComputedStyle(other).display !== "none" && getComputedStyle(other).visibility !== "hidden" && (Number.parseInt(getComputedStyle(other).zIndex, 10) || 1050) >= (Number.parseInt(getComputedStyle(container).zIndex, 10) || 1e3)
  );
  const focusEdge = (last = false) => {
    if (!isTop()) return;
    const elements = focusables(panel);
    (last ? elements.at(-1) ?? panel : elements[0] ?? panel).focus({
      preventScroll: true
    });
  };
  panels.push(panel);
  const unlock = lockScroll(doc);
  const keydown = (event) => {
    if (!isTop() || event.key !== "Tab") return;
    const elements = focusables(panel);
    if (!elements.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && (doc.activeElement === first || doc.activeElement === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (doc.activeElement === last || !panel.contains(doc.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };
  const focusin = (event) => {
    if (isTop() && !panel.contains(event.target)) focusEdge();
  };
  doc.addEventListener("keydown", keydown, true);
  doc.addEventListener("focusin", focusin, true);
  focusEdge();
  let destroyed = false;
  return {
    isTop,
    focusEdge,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      const wasTop = isTop();
      panels.splice(panels.indexOf(panel), 1);
      doc.removeEventListener("keydown", keydown, true);
      doc.removeEventListener("focusin", focusin, true);
      unlock();
      if (wasTop && (previous == null ? void 0 : previous.isConnected))
        previous.focus({ preventScroll: true });
    }
  };
}

// src/components/notification/notification-transition.ts
function waitForNotificationExit(panel, exited) {
  const style = getComputedStyle(panel);
  const milliseconds = (value) => (parseFloat(value) || 0) * (value.trim().endsWith("ms") ? 1 : 1e3);
  const durations = style.transitionDuration.split(",").map(milliseconds);
  const delays = style.transitionDelay.split(",").map(milliseconds);
  const duration = Math.max(
    0,
    ...durations.map((value, i) => value + delays[i % delays.length])
  );
  let cancelled = false;
  let timer;
  const cancel = () => {
    cancelled = true;
    clearTimeout(timer);
    panel.removeEventListener("transitionend", ended);
  };
  const finish = () => {
    if (cancelled) return;
    cancel();
    exited();
  };
  const ended = (event) => {
    if (event.target === panel && event.propertyName === "transform") finish();
  };
  panel.addEventListener("transitionend", ended);
  if (duration > 0) timer = setTimeout(finish, duration + 50);
  else queueMicrotask(finish);
  return cancel;
}
function NotificationOverlay({
  children: children2,
  open,
  onExited,
  onClose
}) {
  const regionRef = useRef(null);
  const modalRef = useRef(null);
  const exitedRef = useRef(onExited);
  useLayoutEffect(() => {
    exitedRef.current = onExited;
  });
  useLayoutEffect(() => {
    const modal = mountNotificationModal(regionRef.current);
    modalRef.current = modal;
    return () => {
      modal.destroy();
      modalRef.current = null;
    };
  }, []);
  useLayoutEffect(() => {
    if (open) return;
    const panel = regionRef.current.closest(".i-dialog-panel");
    return waitForNotificationExit(panel, () => exitedRef.current());
  }, [open]);
  return createPortal(
    /* @__PURE__ */ jsx(
      IDialogContainer,
      {
        className: `i-notification-overlay${open ? "" : " i-notification-closing"}`,
        "aria-label": "Notifications",
        config: { width: "min(400px, 100vw)", height: "100dvh" },
        onClose: () => {
          var _a;
          if (open && ((_a = modalRef.current) == null ? void 0 : _a.isTop())) onClose();
        },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "i-notification-focus-region",
            tabIndex: -1,
            ref: regionRef,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "i-notification-focus-guard",
                  "data-notification-focus-guard": "true",
                  tabIndex: 0,
                  "aria-hidden": "true",
                  onFocus: () => {
                    var _a;
                    return (_a = modalRef.current) == null ? void 0 : _a.focusEdge(true);
                  }
                }
              ),
              children2,
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "i-notification-focus-guard",
                  "data-notification-focus-guard": "true",
                  tabIndex: 0,
                  "aria-hidden": "true",
                  onFocus: () => {
                    var _a;
                    return (_a = modalRef.current) == null ? void 0 : _a.focusEdge();
                  }
                }
              )
            ]
          }
        )
      }
    ),
    document.body
  );
}
var defaultSnackbarScope = {};
var SnackbarContext = createContext(null);

// src/components/snackbar/snackbar-runtime.ts
var regions = /* @__PURE__ */ new WeakMap();
var limits = /* @__PURE__ */ new WeakMap();
var sequence = 0;
function nextSnackbarId() {
  return `i-snackbar-${++sequence}`;
}
function position(options) {
  return options.position ?? "bottom-right";
}
function acquireRegion(doc, value) {
  let map = regions.get(doc);
  if (!map) regions.set(doc, map = /* @__PURE__ */ new Map());
  let region = map.get(value);
  if (!region) {
    const selector = `[data-i-snackbar-viewport="${value}"]`;
    const element = doc.querySelector(selector) ?? doc.createElement("div");
    element.classList.add("i-snackbar-viewport");
    element.setAttribute("data-i-snackbar-viewport", value);
    if (!element.isConnected) doc.body.appendChild(element);
    region = { element, entries: [], position: value };
    map.set(value, region);
  }
  return region;
}
function arrange(region) {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of region.entries) {
    const scope = entry.options.scope;
    const count = counts.get(scope) ?? 0;
    const visible = count < (limits.get(scope) ?? Infinity);
    if (visible) counts.set(scope, count + 1);
    entry.setVisible(visible);
  }
}
function place(region, element) {
  if (region.position.startsWith("top-")) {
    region.element.prepend(element);
  } else {
    region.element.appendChild(element);
  }
}
function revealNewest(region) {
  const scroll = () => {
    if (!region.element.isConnected || !region.entries.some((entry) => entry.interactive))
      return;
    region.element.scrollTop = region.position.startsWith("top-") ? 0 : region.element.scrollHeight;
  };
  const view = region.element.ownerDocument.defaultView;
  const schedule = () => {
    if (!(view == null ? void 0 : view.requestAnimationFrame)) {
      scroll();
      return;
    }
    if (region.scrollFrame !== void 0) return;
    region.scrollFrame = view.requestAnimationFrame(() => {
      region.scrollFrame = void 0;
      scroll();
    });
  };
  schedule();
  clearTimeout(region.scrollTimer);
  region.scrollTimer = setTimeout(() => {
    region.scrollTimer = void 0;
    schedule();
  }, 200);
}
var SnackbarMount = class {
  element;
  options;
  doc;
  request;
  dismissed;
  region;
  timer;
  exitTimer;
  remaining = 0;
  duration = 5e3;
  started = 0;
  visible = false;
  hovering = false;
  focused = false;
  requested = false;
  closing = false;
  destroyed = false;
  constructor(element, options, request, dismissed) {
    this.element = element;
    this.doc = element.ownerDocument;
    this.options = options;
    this.request = request;
    this.dismissed = dismissed;
    this.region = acquireRegion(this.doc, position(options));
    this.element.classList.add("i-snackbar");
    this.element.addEventListener("mouseenter", this.enter);
    this.element.addEventListener("mouseleave", this.leave);
    this.element.addEventListener("focusin", this.focusIn);
    this.element.addEventListener("focusout", this.focusOut);
    this.element.addEventListener("keydown", this.keydown);
    this.doc.addEventListener("visibilitychange", this.visibility);
    this.region.entries.push(this);
    place(this.region, element);
    this.update(options, true);
  }
  update(options, reset = false) {
    if (this.destroyed) return;
    this.pauseClock();
    const oldPosition = position(this.options);
    this.options = options;
    const limit = options.maxVisible;
    limits.set(
      options.scope,
      Number.isInteger(limit) && limit > 0 ? limit : Infinity
    );
    this.element.dataset["snackbarId"] = options.id;
    this.element.style.setProperty(
      "--i-snackbar-max-width",
      options.maxWidth ?? "400px"
    );
    if (oldPosition !== position(options)) {
      const focused = this.element.contains(this.doc.activeElement) ? this.doc.activeElement : null;
      this.detach();
      this.region = acquireRegion(this.doc, position(options));
      this.region.entries.push(this);
      place(this.region, this.element);
      focused == null ? void 0 : focused.focus({ preventScroll: true });
    }
    if (reset) {
      clearTimeout(this.exitTimer);
      this.exitTimer = void 0;
      this.element.classList.remove("i-snackbar--closing");
      this.closing = false;
      this.requested = false;
      const duration = options.durationMs ?? 5e3;
      this.duration = Number.isFinite(duration) && duration > 0 ? duration : 0;
      this.remaining = this.duration;
    }
    arrange(this.region);
    if (this.visible && (reset || oldPosition !== position(options)))
      revealNewest(this.region);
    this.resumeClock();
  }
  setVisible(value) {
    this.pauseClock();
    const appeared = value && !this.visible;
    this.visible = value;
    this.element.hidden = !value;
    if (appeared) revealNewest(this.region);
    this.resumeClock();
  }
  requestDismiss(reason) {
    if (this.destroyed || this.closing || this.requested) return;
    this.pauseClock();
    this.requested = true;
    this.request(reason);
  }
  get interactive() {
    return this.visible && !this.destroyed && !this.closing && !this.requested;
  }
  close(reason) {
    var _a, _b;
    if (this.destroyed || this.closing) return;
    this.closing = true;
    this.pauseClock();
    this.element.classList.add("i-snackbar--closing");
    const reduceMotion = (_b = (_a = this.doc.defaultView) == null ? void 0 : _a.matchMedia) == null ? void 0 : _b.call(
      _a,
      "(prefers-reduced-motion: reduce)"
    ).matches;
    this.exitTimer = setTimeout(
      () => {
        this.destroy();
        this.dismissed(reason);
      },
      this.visible && !reduceMotion ? 180 : 0
    );
  }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.timer);
    clearTimeout(this.exitTimer);
    this.element.removeEventListener("mouseenter", this.enter);
    this.element.removeEventListener("mouseleave", this.leave);
    this.element.removeEventListener("focusin", this.focusIn);
    this.element.removeEventListener("focusout", this.focusOut);
    this.element.removeEventListener("keydown", this.keydown);
    this.doc.removeEventListener("visibilitychange", this.visibility);
    this.element.remove();
    this.detach();
  }
  detach() {
    var _a, _b, _c;
    this.region.entries = this.region.entries.filter((entry) => entry !== this);
    arrange(this.region);
    if (!this.region.entries.length) {
      clearTimeout(this.region.scrollTimer);
      this.region.scrollTimer = void 0;
      if (this.region.scrollFrame !== void 0) {
        (_b = (_a = this.doc.defaultView) == null ? void 0 : _a.cancelAnimationFrame) == null ? void 0 : _b.call(_a, this.region.scrollFrame);
        this.region.scrollFrame = void 0;
      }
      if (!this.region.element.childElementCount) this.region.element.remove();
      (_c = regions.get(this.doc)) == null ? void 0 : _c.delete(this.region.position);
    }
  }
  pauseClock() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.timer = void 0;
      this.remaining = Math.max(
        0,
        this.remaining - (Date.now() - this.started)
      );
    }
  }
  resumeClock() {
    if (this.destroyed || this.closing || this.requested || !this.visible || this.hovering && this.options.pauseOnHover !== false || this.focused && this.options.pauseOnFocus !== false || this.doc.visibilityState === "hidden" && this.options.pauseOnHidden !== false || this.duration <= 0 || this.timer !== void 0)
      return;
    this.started = Date.now();
    this.timer = setTimeout(() => {
      this.timer = void 0;
      this.remaining = 0;
      this.requestDismiss("timeout");
    }, this.remaining);
  }
  enter = () => {
    this.pauseClock();
    this.hovering = true;
    this.resumeClock();
  };
  leave = () => {
    this.pauseClock();
    this.hovering = false;
    this.resumeClock();
  };
  focusIn = () => {
    this.pauseClock();
    this.focused = true;
    this.resumeClock();
  };
  focusOut = (event) => {
    if (event.relatedTarget && this.element.contains(event.relatedTarget))
      return;
    this.pauseClock();
    this.focused = false;
    this.resumeClock();
  };
  visibility = () => {
    this.pauseClock();
    this.resumeClock();
  };
  keydown = (event) => {
    if (event.key !== "Escape" || event.defaultPrevented || this.options.dismissOnEscape === false || !this.element.contains(this.doc.activeElement))
      return;
    event.preventDefault();
    event.stopPropagation();
    this.requestDismiss("escape");
  };
};
function ISnackbar({
  id,
  message,
  title,
  children: children2,
  resetKey,
  open,
  defaultOpen = true,
  variant = "neutral",
  position: position2 = "bottom-right",
  durationMs = 5e3,
  prefixIcon,
  suffixIcon,
  closable = true,
  closeLabel = "Close",
  actionLabel,
  actionDisabled = false,
  actionLoading = false,
  dismissOnAction = true,
  dismissOnEscape = true,
  pauseOnHover = true,
  pauseOnFocus = true,
  pauseOnHidden = true,
  maxWidth = "400px",
  onOpenChange,
  onAction,
  onAfterDismissed
}) {
  const context = useContext(SnackbarContext);
  const [generatedId] = useState(nextSnackbarId);
  const [container] = useState(
    () => typeof document === "undefined" ? null : document.createElement("i-snackbar")
  );
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const mount = useRef(null);
  const pendingReason = useRef("programmatic");
  const previous = useRef({ message, title, durationMs, resetKey });
  const callbacks = useRef({ onOpenChange, onAfterDismissed, open });
  callbacks.current = { onOpenChange, onAfterDismissed, open };
  const resetChanged = !Object.is(previous.current.resetKey, resetKey);
  const active = open ?? (resetChanged ? true : internalOpen);
  const wasActive = useRef(active);
  const hasChildren = Children.toArray(children2).some(
    (child) => typeof child === "string" ? !!child.trim() : child !== null && typeof child !== "boolean"
  );
  const hasContent = !!(message == null ? void 0 : message.trim()) || !!(title == null ? void 0 : title.trim()) || hasChildren;
  useLayoutEffect(
    () => () => {
      var _a;
      (_a = mount.current) == null ? void 0 : _a.destroy();
      mount.current = null;
    },
    []
  );
  useLayoutEffect(() => {
    var _a;
    const reset = resetChanged || !wasActive.current && active || previous.current.message !== message || previous.current.title !== title || previous.current.durationMs !== durationMs;
    previous.current = { message, title, durationMs, resetKey };
    wasActive.current = active;
    if (resetChanged) pendingReason.current = "programmatic";
    if (resetChanged && open === void 0) setInternalOpen(true);
    if (!container) return;
    if (!active || !hasContent) {
      (_a = mount.current) == null ? void 0 : _a.close(pendingReason.current);
      return;
    }
    const options = {
      id: id ?? generatedId,
      scope: (context == null ? void 0 : context.scope) ?? defaultSnackbarScope,
      maxVisible: context == null ? void 0 : context.maxVisible,
      position: position2,
      durationMs,
      closable,
      dismissOnEscape,
      pauseOnHover,
      pauseOnFocus,
      pauseOnHidden,
      maxWidth
    };
    if (mount.current) {
      mount.current.update(options, reset);
      return;
    }
    const handle = new SnackbarMount(
      container,
      options,
      (reason) => {
        var _a2, _b;
        pendingReason.current = reason;
        if (callbacks.current.open === void 0) setInternalOpen(false);
        (_b = (_a2 = callbacks.current).onOpenChange) == null ? void 0 : _b.call(_a2, false);
      },
      (reason) => {
        var _a2, _b;
        if (mount.current === handle) mount.current = null;
        (_b = (_a2 = callbacks.current).onAfterDismissed) == null ? void 0 : _b.call(_a2, reason);
      }
    );
    mount.current = handle;
  }, [
    active,
    closable,
    container,
    context,
    dismissOnEscape,
    durationMs,
    generatedId,
    hasContent,
    id,
    maxWidth,
    message,
    open,
    pauseOnFocus,
    pauseOnHidden,
    pauseOnHover,
    position2,
    resetChanged,
    resetKey,
    title
  ]);
  if (!container) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      IBanner,
      {
        open: true,
        variant,
        prefixIcon,
        suffixIcon,
        closable,
        closeLabel,
        "aria-live": variant === "danger" ? "assertive" : "polite",
        "aria-atomic": "true",
        onClose: () => {
          var _a;
          return (_a = mount.current) == null ? void 0 : _a.requestDismiss("close");
        },
        children: /* @__PURE__ */ jsxs("div", { className: "i-snackbar__layout", children: [
          /* @__PURE__ */ jsxs("div", { className: "i-snackbar__copy", children: [
            (title == null ? void 0 : title.trim()) && /* @__PURE__ */ jsx("div", { className: "i-snackbar__title", children: title }),
            (message == null ? void 0 : message.trim()) && /* @__PURE__ */ jsx("div", { className: "i-snackbar__message", children: message }),
            /* @__PURE__ */ jsx("div", { className: "i-snackbar__content", children: children2 })
          ] }),
          actionLabel && /* @__PURE__ */ jsx(
            IButton,
            {
              type: "button",
              size: "sm",
              disabled: actionDisabled,
              loading: actionLoading,
              onClick: () => {
                var _a, _b;
                if (actionDisabled || actionLoading || !((_a = mount.current) == null ? void 0 : _a.interactive))
                  return;
                onAction == null ? void 0 : onAction();
                if (dismissOnAction) (_b = mount.current) == null ? void 0 : _b.requestDismiss("action");
              },
              children: actionLabel
            }
          )
        ] })
      }
    ),
    container
  );
}
var ISnackbarRef = class {
  id;
  result;
  resolve;
  close;
  constructor(id, close) {
    this.id = id;
    this.close = close;
    this.result = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  dismiss() {
    this.close();
  }
  afterDismissed() {
    return this.result;
  }
  complete(reason) {
    this.resolve(reason);
  }
};
function ISnackbarProvider({
  children: children2,
  maxVisible
}) {
  const [entries, setEntries] = useState([]);
  const instances = useRef(/* @__PURE__ */ new Map());
  const [scope] = useState(() => ({}));
  const api = useMemo(() => {
    const refresh = () => setEntries([...instances.current.values()]);
    const api2 = {
      show(message, options = {}) {
        var _a;
        const id = options.id ?? nextSnackbarId();
        const existing = instances.current.get(id);
        if (existing) {
          api2.update(id, { ...options, message });
          return existing.ref;
        }
        const ref = new ISnackbarRef(id, () => api2.dismiss(id));
        if (typeof document === "undefined" || !message.trim() && !((_a = options.title) == null ? void 0 : _a.trim())) {
          ref.complete("programmatic");
          return ref;
        }
        instances.current.set(id, {
          ref,
          message,
          options: { ...options, id },
          revision: 0,
          open: true
        });
        refresh();
        return ref;
      },
      update(id, changes) {
        const existing = instances.current.get(id);
        if (!existing) return;
        instances.current.set(id, {
          ...existing,
          message: changes.message ?? existing.message,
          options: { ...existing.options, ...changes },
          revision: existing.revision + 1,
          open: true
        });
        refresh();
      },
      dismiss(id) {
        const existing = instances.current.get(id);
        if (!existing) return;
        instances.current.set(id, { ...existing, open: false });
        refresh();
      },
      dismissAll() {
        for (const id of instances.current.keys()) api2.dismiss(id);
      }
    };
    return api2;
  }, []);
  useEffect(
    () => () => {
      for (const entry of instances.current.values())
        entry.ref.complete("programmatic");
      instances.current.clear();
    },
    []
  );
  const value = useMemo(
    () => ({ api, scope, maxVisible }),
    [api, scope, maxVisible]
  );
  return /* @__PURE__ */ jsxs(SnackbarContext.Provider, { value, children: [
    children2,
    entries.map((entry) => /* @__PURE__ */ jsx(
      ISnackbar,
      {
        ...entry.options,
        message: entry.message,
        resetKey: entry.revision,
        open: entry.open,
        onOpenChange: () => api.dismiss(entry.ref.id),
        onAction: () => {
          var _a, _b, _c;
          return (_c = (_a = instances.current.get(entry.ref.id)) == null ? void 0 : (_b = _a.options).onAction) == null ? void 0 : _c.call(_b);
        },
        onAfterDismissed: (reason) => {
          var _a;
          if (((_a = instances.current.get(entry.ref.id)) == null ? void 0 : _a.ref) !== entry.ref) return;
          instances.current.delete(entry.ref.id);
          setEntries([...instances.current.values()]);
          entry.ref.complete(reason);
        }
      },
      entry.ref.id
    ))
  ] });
}
function useISnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("useISnackbar requires ISnackbarProvider.");
  return context.api;
}
function INotificationSnackbar({
  message,
  options,
  onDismissRequested,
  onOpenRequested
}) {
  var _a;
  return /* @__PURE__ */ jsx("i-notification-snackbar", { children: /* @__PURE__ */ jsx(
    ISnackbar,
    {
      ...options,
      id: (options == null ? void 0 : options.id) ?? "notification-summary",
      variant: "info",
      resetKey: message.key,
      prefixIcon: (options == null ? void 0 : options.prefixIcon) ?? ((_a = message.item) == null ? void 0 : _a.icon) ?? "fa-solid fa-bell",
      closeLabel: (options == null ? void 0 : options.closeLabel) ?? "Dismiss notification",
      onAfterDismissed: onDismissRequested,
      children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "i-snackbar__content-action snackbar-content",
          onClick: onOpenRequested,
          children: [
            message.moduleName && /* @__PURE__ */ jsx("span", { className: "block font-semibold", children: message.moduleName }),
            /* @__PURE__ */ jsx("span", { children: message.title }),
            (message.newCount ?? 0) > 1 && /* @__PURE__ */ jsxs("span", { className: "block", children: [
              "and ",
              message.newCount - 1,
              " other new",
              " ",
              message.newCount === 2 ? "notification" : "notifications"
            ] })
          ]
        }
      )
    }
  ) });
}
function INotification({ state, onAction }) {
  const [retained, setRetained] = useState((state == null ? void 0 : state.open) ?? false);
  useLayoutEffect(() => {
    if (state == null ? void 0 : state.open) setRetained(true);
    else if (!state) setRetained(false);
  }, [state]);
  if (!state) return null;
  return /* @__PURE__ */ jsxs("i-notification", { children: [
    /* @__PURE__ */ jsx(
      INotificationBell,
      {
        unreadCount: state.unreadCount,
        expanded: state.open,
        onToggleRequested: () => onAction == null ? void 0 : onAction({ type: "toggle" })
      }
    ),
    (state.open || retained) && typeof document !== "undefined" && /* @__PURE__ */ jsx(
      NotificationOverlay,
      {
        open: state.open ?? false,
        onExited: () => setRetained(false),
        onClose: () => onAction == null ? void 0 : onAction({ type: "close" }),
        children: /* @__PURE__ */ jsx(
          INotificationDrawer,
          {
            ...state,
            onCloseRequested: () => onAction == null ? void 0 : onAction({ type: "close" }),
            onOpenAllRequested: () => onAction == null ? void 0 : onAction({ type: "open-all" }),
            onItemOpened: (item) => onAction == null ? void 0 : onAction({ type: "open-item", item }),
            onMoreRequested: () => onAction == null ? void 0 : onAction({ type: "load-more" }),
            onRetryRequested: () => onAction == null ? void 0 : onAction({ type: "retry" }),
            onReadRetryRequested: () => onAction == null ? void 0 : onAction({ type: "retry-read" })
          }
        )
      }
    ),
    state.snackbar && /* @__PURE__ */ jsx(
      INotificationSnackbar,
      {
        message: state.snackbar,
        options: state.snackbarOptions,
        onDismissRequested: () => onAction == null ? void 0 : onAction({ type: "dismiss-snackbar" }),
        onOpenRequested: () => onAction == null ? void 0 : onAction({ type: "open-drawer" })
      }
    )
  ] });
}
var IHostApiContext = createContext(null);
function IHostApiProvider(props) {
  return /* @__PURE__ */ jsx(IHostApiContext.Provider, { value: props.hostApi, children: props.children });
}
function useHostApi() {
  const api = useContext(IHostApiContext);
  if (!api)
    throw new Error(
      "useHostApi() must be used under <IHostApiProvider hostApi={...} />"
    );
  return api;
}
function useHostApiOptional() {
  return useContext(IHostApiContext);
}
var EMPTY_METADATA = { title: null, breadcrumbs: null };
var IHostUiContext = createContext(null);
function IHostUiProvider(props) {
  const [route, setRouteMetadata] = useState(EMPTY_METADATA);
  const [remote, setRemoteRouteMetadata] = useState(EMPTY_METADATA);
  const [titleOverride, setTitle] = useState(null);
  const [breadcrumbsOverride, setBreadcrumbs] = useState(null);
  const setRemoteTitle = useCallback((title) => {
    setRemoteRouteMetadata((current) => ({ ...current, title }));
  }, []);
  const setRemoteBreadcrumbs = useCallback(
    (breadcrumbs) => {
      setRemoteRouteMetadata((current) => ({ ...current, breadcrumbs }));
    },
    []
  );
  const clearRemote = useCallback(
    () => setRemoteRouteMetadata(EMPTY_METADATA),
    []
  );
  const clear = useCallback(() => {
    setTitle(null);
    setBreadcrumbs(null);
    clearRemote();
  }, [clearRemote]);
  const value = useMemo(() => {
    const denied = route.denied || remote.denied;
    return {
      title: titleOverride || (denied ? "Unauthorized Access" : remote.title || route.title),
      breadcrumbs: breadcrumbsOverride ?? (denied ? [{ label: "Unauthorized Access" }] : route.breadcrumbs || remote.breadcrumbs ? [...route.breadcrumbs ?? [], ...remote.breadcrumbs ?? []] : null),
      setTitle,
      setBreadcrumbs,
      setRemoteTitle,
      setRemoteBreadcrumbs,
      clearRemote,
      clear,
      setRouteMetadata,
      setRemoteRouteMetadata
    };
  }, [
    route,
    remote,
    titleOverride,
    breadcrumbsOverride,
    setRemoteTitle,
    setRemoteBreadcrumbs,
    clearRemote,
    clear
  ]);
  return /* @__PURE__ */ jsx(IHostUiContext.Provider, { value, children: props.children });
}
function useHostUi() {
  const ctx = useContext(IHostUiContext);
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
function collectMenuChain(menus, targetKey) {
  for (const menu of menus ?? []) {
    if (String(getMenuKey(menu)) === targetKey) {
      return [menu];
    }
    const childChain = collectMenuChain(getMenuChildren(menu), targetKey);
    if (childChain) {
      return [menu, ...childChain];
    }
  }
  return null;
}
function buildFavoritePathMap(menus, favorites) {
  const pathByKey = {};
  for (const favorite of favorites ?? []) {
    const key = getMenuKey(favorite);
    if (key === null) continue;
    const keyString = String(key);
    const chain = collectMenuChain(menus, keyString);
    if (!chain) {
      pathByKey[keyString] = void 0;
      continue;
    }
    const ancestorLabels = chain.slice(0, -1).map((node) => getMenuLabel(node)).filter((label) => label.length > 0);
    pathByKey[keyString] = ancestorLabels.join(" > ");
  }
  return pathByKey;
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
  if (menu == null ? void 0 : menu.openIn)
    return menu.openIn === "NEW_TAB" || menu.openIn === "NEW_WINDOW";
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
  const children2 = getMenuChildren(menu);
  const normalized = {
    ...menu,
    menuName: getMenuLabel(menu),
    menuTypeId: 3,
    parentId: 0,
    sequence: Number(menu.sequence) || 0,
    level,
    child: children2.map((child) => normalizeMenu(child, level + 1)),
    children: void 0,
    name: void 0,
    type: menu.type === "group" ? "group" : void 0
  };
  return normalized;
}
function normalizeMenuTree(menus) {
  return (menus ?? []).map((menu) => normalizeMenu(menu, 0));
}
function findBreadcrumbMenuChain(menus, path, baseHref = "/-/") {
  const normalize = (value) => {
    let clean = value.split(/[?#]/)[0].replace(/\/+/g, "/");
    const base = baseHref.replace(/\/+$|^\/+/g, "");
    clean = clean.replace(/^\/+|\/+$/g, "");
    if (base && (clean === base || clean.startsWith(base + "/"))) {
      clean = clean.slice(base.length).replace(/^\/+/, "");
    }
    return clean;
  };
  const target = normalize(path);
  let best = [];
  let bestLength = 0;
  const visit = (nodes, parents) => {
    for (const menu of nodes) {
      const chain = [...parents, menu];
      const route = getMenuRoute(menu);
      if (route && !isHttpRoute(route) && !route.startsWith("//")) {
        const candidate = normalize(route);
        if (candidate && (target === candidate || target.startsWith(candidate + "/")) && candidate.length > bestLength) {
          best = chain;
          bestLength = candidate.length;
        }
      }
      visit(getMenuChildren(menu), chain);
    }
  };
  visit(menus, []);
  return best;
}

// src/components/host/host.constants.ts
var MENU_ICON_FALLBACK = "fa-brands fa-microsoft";
var DEFAULT_PERSONAL_PROFILE_URL = "https://account-dev.paramountenterprise.co.id/personal-profile";
var SIDEBAR_FAVORITES_GROUP_ID = "favorites";

// src/components/host/menu/menu.utils.ts
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
function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

// src/components/host/router-breadcrumbs.ts
function toRouterUrl(url, baseHref) {
  const base = baseHref.replace(/\/+$/, "");
  if (!base || !url.startsWith("/") || url.startsWith("//")) return url;
  if (url === base || url.startsWith(base + "?") || url.startsWith(base + "#")) {
    return "/" + url.slice(base.length);
  }
  return url.startsWith(base + "/") ? url.slice(base.length) : url;
}
function buildRouteMetadata(chain, menus, baseHref) {
  var _a;
  const host = [];
  const remote = [];
  let mount;
  let title = null;
  for (const match of chain) {
    const route = match.route;
    if (route.redirectTo) continue;
    if (route.title) title = route.title;
    const label = route.breadcrumb === false ? null : route.breadcrumb ?? route.title;
    const items = mount ? remote : host;
    if (label && ((_a = items.at(-1)) == null ? void 0 : _a.label) !== label) {
      items.push({
        label,
        url: route.remoteMount ? match.mountUrl : match.url
      });
    }
    if (route.remoteMount) mount = match;
  }
  let hostTrail = host;
  if (mount) {
    const explicit = mount.route.hostBreadcrumbs;
    const menuChain = findBreadcrumbMenuChain(menus, mount.mountUrl, baseHref);
    if (explicit == null ? void 0 : explicit.length) hostTrail = explicit;
    else if (menuChain.length) {
      hostTrail = menuChain.map((menu) => ({
        label: getMenuLabel(menu),
        url: getMenuRoute(menu) ?? void 0
      })).filter((item) => !!item.label);
    }
  }
  const breadcrumbs = [...hostTrail, ...remote];
  return { title, breadcrumbs: breadcrumbs.length ? breadcrumbs : null };
}
function normalizeCrumbs(items) {
  if (!(items == null ? void 0 : items.length)) return [];
  return items.filter((x) => !!(x == null ? void 0 : x.label));
}
function isInternalAppUrl(url) {
  return url.startsWith("/") && !url.startsWith("//") && !isHttpRoute(url);
}
function BreadcrumbLink(props) {
  const url = props.item.url;
  const internal = isInternalAppUrl(url);
  const href = useHref(internal ? toRouterUrl(url, props.baseHref) : "/");
  return /* @__PURE__ */ jsx(
    "a",
    {
      className: "ih-content-breadcrumb ih-content-breadcrumb__link",
      href: internal ? href : url,
      onClick: (event) => props.onClick(event, url),
      children: props.item.label
    }
  );
}
function IHContent(props) {
  const nav = useNavigate();
  const baseHref = useHref("/");
  const { onNavigate, loading, onLoadingChange } = props;
  useEffect(() => {
    onLoadingChange == null ? void 0 : onLoadingChange(loading ?? false);
  }, [loading, onLoadingChange]);
  const crumbs = useMemo(
    () => normalizeCrumbs(props.breadcrumbs),
    [props.breadcrumbs]
  );
  const title = props.title ?? (crumbs.length ? crumbs[crumbs.length - 1].label : null);
  const [sidebarVisibility, setSidebarVisibility] = useState(
    props.defaultSidebarVisible ?? true
  );
  const toggleSidebar = useCallback(() => {
    setSidebarVisibility((prev) => {
      var _a;
      const next = !prev;
      (_a = props.onSidebarToggled) == null ? void 0 : _a.call(props, next);
      return next;
    });
  }, [props]);
  const go = useCallback(
    (url) => {
      if (onNavigate) return onNavigate(url);
      nav(toRouterUrl(url, baseHref));
    },
    [nav, onNavigate, baseHref]
  );
  const onCrumbClick = useCallback(
    (e, url) => {
      if (!isPlainLeftClick(e)) return;
      if (isInternalAppUrl(url)) {
        e.preventDefault();
        go(url);
      }
    },
    [go]
  );
  return /* @__PURE__ */ jsxs("ih-content", { children: [
    /* @__PURE__ */ jsxs("div", { className: "ih-content-header", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "i-clickable",
          "aria-label": sidebarVisibility ? "Collapse sidebar" : "Expand sidebar",
          onClick: toggleSidebar,
          children: /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: `ih-sidebar-toggle-icon ih-sidebar-toggle-icon--${sidebarVisibility ? "left" : "right"}`
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("h1", { children: title || "Insight" }),
      props.notification && /* @__PURE__ */ jsx("div", { className: "ih-content-header-actions", children: /* @__PURE__ */ jsx(
        INotification,
        {
          state: props.notification,
          onAction: props.onNotificationAction
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ih-content-breadcrumbs", children: crumbs.length ? crumbs.map((b, idx) => {
      const first = idx === 0;
      const last = idx === crumbs.length - 1;
      const clickable = !first && !last && !!b.url;
      return /* @__PURE__ */ jsxs(React9.Fragment, { children: [
        clickable ? /* @__PURE__ */ jsx(
          BreadcrumbLink,
          {
            item: b,
            baseHref,
            onClick: onCrumbClick
          }
        ) : /* @__PURE__ */ jsx(
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
        !last ? /* @__PURE__ */ jsx("span", { className: "ih-content-breadcrumb ih-content-breadcrumb__separator", children: ">" }) : null
      ] }, `${b.label}-${idx}`);
    }) : /* @__PURE__ */ jsx("span", { className: "ih-content-breadcrumb ih-content-breadcrumb__first", children: "Home" }) }),
    /* @__PURE__ */ jsx("div", { className: "ih-content-body scroll scroll-y", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function IHContentLayout(props) {
  const ui = useHostUi();
  const hostApi = useHostApiOptional();
  const session = useISession();
  const store = useIUserMenuStore();
  return /* @__PURE__ */ jsx(
    IHContent,
    {
      notification: props.notification,
      onNotificationAction: props.onNotificationAction,
      title: ui.title,
      breadcrumbs: ui.breadcrumbs,
      loading: session.initializing || store.initializing,
      onLoadingChange: props.onLoadingChange,
      onNavigate: hostApi ? (url) => void hostApi.navigate(url) : void 0
    }
  );
}

// src/components/host/sidebar/sidebar-menu-state.ts
var STATE_KEY = /* @__PURE__ */ Symbol("sidebarMenuStateKey");
var ACTIVE_KEY = /* @__PURE__ */ Symbol("sidebarMenuActive");
var ACTIVE_MENU_SCROLL_OFFSET = 16;
function getSidebarMenuKey(menu) {
  return menu == null ? void 0 : menu[STATE_KEY];
}
function isSidebarMenuActive(menu) {
  return (menu == null ? void 0 : menu[ACTIVE_KEY]) === true;
}
function createFavoritesMenu(favorites) {
  return favorites.length ? [
    {
      id: "favorites",
      name: "Favorites",
      type: "group",
      icon: "fa-solid fa-star",
      children: favorites
    }
  ] : [];
}
function children(menu) {
  return menu.children ?? menu.child ?? [];
}
function stateKey(menu, scope, path) {
  if (scope === "favorites" && path === "0") return "favorites:group";
  if (menu.id !== void 0 && menu.id !== null)
    return `${scope}:id:${menu.id}`;
  if (menu.menuId !== void 0 && menu.menuId !== null)
    return `${scope}:menuId:${menu.menuId}`;
  return `${scope}:path:${path}`;
}
function persistentKey(key) {
  return key === "favorites:group" || /^(main|favorites):(id|menuId):.+$/.test(key);
}
function normalizePath(value, baseHref) {
  let path = "/" + value.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
  path = path.replace(/\/{2,}/g, "/");
  const base = "/" + baseHref.replace(/^\/+|\/+$/g, "");
  if (base !== "/" && (path === base || path.startsWith(base + "/"))) {
    path = path.slice(base.length) || "/";
  }
  return path;
}
function isRouteLeaf(menu) {
  return menu.type !== "group" && Number(menu.menuTypeId) !== 2 && (!children(menu).length || menu.visibility === "no-child");
}
function findRouteChain(nodes, target, baseHref) {
  let best = [];
  let length = -1;
  const visit = (items, ancestors) => {
    var _a;
    for (const menu of items) {
      const chain = [...ancestors, menu];
      const route = (_a = menu.route) == null ? void 0 : _a.trim();
      if (isRouteLeaf(menu) && route && !/^(?:[a-z][a-z\d+.-]*:|\/\/|[?#])/i.test(route)) {
        const candidate = normalizePath(route, baseHref);
        if ((target === candidate || candidate !== "/" && target.startsWith(candidate + "/")) && candidate.length > length) {
          best = chain;
          length = candidate.length;
        }
      }
      visit(children(menu), chain);
    }
  };
  visit(nodes, []);
  return best;
}
function resolveSidebarActiveMenu(menus, favorites, path, baseHref = "/") {
  const target = normalizePath(path, baseHref);
  let chain = findRouteChain(menus, target, baseHref);
  if (!chain.length) chain = findRouteChain(favorites, target, baseHref);
  return chain[chain.length - 1];
}
var SidebarMenuState = class {
  storageKey;
  storage;
  choices = /* @__PURE__ */ new Map();
  savedChoices = /* @__PURE__ */ new Map();
  rootKeys = /* @__PURE__ */ new Set();
  forcedExpanded = /* @__PURE__ */ new Set();
  initialPath;
  baseHref = "/";
  canceled = false;
  target;
  scrolled = false;
  interacted = false;
  constructor(key, storage = () => window.localStorage) {
    this.storage = storage;
    this.configureStorage(key);
  }
  configureStorage(key) {
    if (key === this.storageKey) return false;
    this.storageKey = key;
    this.choices = /* @__PURE__ */ new Map();
    this.savedChoices = /* @__PURE__ */ new Map();
    if (key === null) return true;
    try {
      const raw = JSON.parse(this.storage().getItem(key) ?? "null");
      if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1 || !("expanded" in raw) || !raw.expanded || typeof raw.expanded !== "object" || Array.isArray(raw.expanded))
        return true;
      for (const [id, expanded] of Object.entries(raw.expanded)) {
        if (persistentKey(id) && typeof expanded === "boolean")
          this.savedChoices.set(id, expanded);
      }
    } catch {
    }
    return true;
  }
  project(menus, scope = "main", activeMenu) {
    const activeId = (activeMenu == null ? void 0 : activeMenu.id) ?? (activeMenu == null ? void 0 : activeMenu.menuId);
    const visit = (nodes, prefix) => nodes.map((menu, index) => {
      const path = prefix ? `${prefix}.${index}` : String(index);
      const key = stateKey(menu, scope, path);
      const copy = {
        ...menu,
        [STATE_KEY]: key,
        [ACTIVE_KEY]: isRouteLeaf(menu) && (menu === activeMenu || activeId !== void 0 && activeId !== null && (menu.id ?? menu.menuId) === activeId)
      };
      if (menu.children !== void 0)
        copy.children = visit(menu.children, path);
      if (menu.child !== void 0) copy.child = visit(menu.child, path);
      const group = menu.type === "group" || Number(menu.menuTypeId) === 2 || children(menu).length > 0;
      if (group && menu.visibility !== "no-child") {
        const root = prefix === "";
        if (root && persistentKey(key)) this.rootKeys.add(key);
        else this.rootKeys.delete(key);
        const expanded = this.forcedExpanded.has(key) ? true : this.choices.get(key) ?? (root ? this.savedChoices.get(key) : false);
        if (expanded !== void 0)
          copy.visibility = expanded ? "expanded" : "collapsed";
      }
      return copy;
    });
    return visit(menus, "");
  }
  setExpanded({ menu, expanded }) {
    var _a;
    const key = getSidebarMenuKey(menu);
    if (!key || menu.visibility === "no-child") return;
    this.interacted = true;
    this.choices.set(key, expanded);
    this.forcedExpanded.delete(key);
    if (!expanded && ((_a = this.target) == null ? void 0 : _a.ancestors.includes(key))) this.scrolled = true;
    if (this.storageKey === null || this.storageKey === void 0) return;
    try {
      const stored = Object.fromEntries(
        [...this.rootKeys].map((id) => [id, this.choices.get(id) ?? this.savedChoices.get(id)]).filter(([, value]) => typeof value === "boolean")
      );
      this.storage().setItem(
        this.storageKey,
        JSON.stringify({ version: 1, expanded: stored })
      );
    } catch {
    }
  }
  observeLocation(path, baseHref = "/") {
    const normalized = normalizePath(path, baseHref);
    if (this.initialPath !== void 0 && this.initialPath !== normalized)
      this.canceled = true;
    this.initialPath ??= normalized;
    this.baseHref = baseHref;
  }
  get hasLocation() {
    return this.initialPath !== void 0;
  }
  restore(menus, favorites = []) {
    var _a;
    if (this.initialPath === void 0 || this.canceled || this.target && (this.target.scope === "main" || this.interacted))
      return false;
    let chain = findRouteChain(
      this.project(menus),
      this.initialPath,
      this.baseHref
    );
    let scope = "main";
    if (!chain.length) {
      if (this.target) return false;
      chain = findRouteChain(
        this.project(favorites, "favorites"),
        this.initialPath,
        this.baseHref
      );
      scope = "favorites";
    }
    if (!chain.length) return false;
    const key = getSidebarMenuKey(chain[chain.length - 1]);
    const ancestors = chain.slice(0, -1).map((menu) => getSidebarMenuKey(menu));
    for (const ancestor of ((_a = this.target) == null ? void 0 : _a.ancestors) ?? [])
      this.forcedExpanded.delete(ancestor);
    this.target = { key, ancestors, scope };
    this.scrolled = false;
    for (const ancestor of ancestors) this.forcedExpanded.add(ancestor);
    return true;
  }
  scrollToActive(host, visible) {
    if (!visible || this.canceled || !this.target || this.scrolled) return;
    const body = host.querySelector(".ih-sidebar-body");
    const row = [
      ...host.querySelectorAll("a[data-sidebar-menu-key]")
    ].find(
      (element) => element.getAttribute("data-sidebar-menu-key") === this.target.key
    );
    if (!body || !row || row.closest("ul.collapsed")) return;
    const viewport = body.getBoundingClientRect();
    const bounds = row.getBoundingClientRect();
    if (!viewport.height || !bounds.height) return;
    body.scrollTop = Math.max(
      0,
      body.scrollTop + bounds.top - viewport.top - ACTIVE_MENU_SCROLL_OFFSET
    );
    this.scrolled = true;
  }
};
function escapeHtml2(input) {
  return (input ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function highlightSearchHtml(text2, rawTerm) {
  const term = (rawTerm ?? "").trim();
  if (!term) return escapeHtml2(text2 ?? "");
  const safeText = text2 ?? "";
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
var Highlighted = memo(function Highlighted2(props) {
  const { text: text2, term, as = "span" } = props;
  const html = useMemo(() => highlightSearchHtml(text2, term), [text2, term]);
  const Tag = as;
  return /* @__PURE__ */ jsx(Tag, { dangerouslySetInnerHTML: { __html: html } });
});
var IHMenu = memo(function IHMenu2(props) {
  const {
    menu,
    filter,
    selectedMenuId,
    onToggleGroup,
    onExpansionChange,
    collapsible,
    favoriteMode,
    dragEnabled,
    depth = 0,
    showApplication = false,
    pathByKey,
    onFavoriteToggle
  } = props;
  const navigate = useNavigate();
  const menuItemRef = useRef(null);
  const menuKey = useMemo(() => getMenuKey(menu), [menu]);
  const menuLabel = useMemo(() => getMenuLabel(menu), [menu]);
  const menuRoute = useMemo(() => getMenuRoute(menu), [menu]);
  const hasChild = useMemo(() => hasMenuChildren(menu), [menu]);
  const menuChildren = useMemo(() => getMenuChildren(menu), [menu]);
  const isModuleNode = useMemo(() => isModuleMenu(menu), [menu]);
  const isGroupNodeValue = useMemo(() => isGroupNode(menu), [menu]);
  const isLeaf = useMemo(() => isLeafItem(menu), [menu]);
  const isFavoritesGroup = menuKey === SIDEBAR_FAVORITES_GROUP_ID;
  const isNewTab = isNewTabMenu(menu);
  const isReload = isReloadMenu(menu);
  const isSpa = isSpaMenu(menu);
  const isActive = isSidebarMenuActive(menu);
  const menuIsFavorite = !!(menu == null ? void 0 : menu.isFavorite);
  const confirm = useOptionalIConfirm();
  const favoriteSubtitle = useMemo(() => {
    var _a;
    if (!showApplication) return null;
    const keyString = menuKey != null ? String(menuKey) : null;
    const stored = keyString && pathByKey ? pathByKey[keyString] : void 0;
    return stored !== void 0 ? stored : ((_a = menu == null ? void 0 : menu.application) == null ? void 0 : _a.name) ?? null;
  }, [showApplication, menuKey, pathByKey, menu]);
  const iconClass = useMemo(() => resolveMenuIcon(menu == null ? void 0 : menu.icon), [menu]);
  const isGroupExpanded = useMemo(() => {
    if (!collapsible) return true;
    return (menu == null ? void 0 : menu.visibility) !== "collapsed";
  }, [collapsible, menu == null ? void 0 : menu.visibility]);
  const href = useMemo(() => {
    if (!menuRoute) return "#";
    return appendMenuFilterToUrl(menuRoute, filter);
  }, [menuRoute, filter]);
  const isSelected = useMemo(() => {
    if (!menu) return false;
    const matchesId = menuKey !== null && menuKey === selectedMenuId;
    if (!matchesId) return false;
    return isLeaf;
  }, [menu, menuKey, selectedMenuId, isLeaf]);
  const leafStateClass = `${isSelected ? " is-selected" : ""}${isActive ? " is-active" : ""}`;
  useLayoutEffect(() => {
    if (isSelected && menuItemRef.current) {
      menuItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [isSelected]);
  const clickGroup = useCallback(() => {
    if (!menu) return;
    if (menu.visibility === "no-child") return;
    if (onExpansionChange) {
      onExpansionChange({ menu, expanded: menu.visibility === "collapsed" });
      return;
    }
    if (menuKey === null) return;
    if (menu.visibility !== "no-child") onToggleGroup(menuKey);
  }, [menu, menuKey, onToggleGroup, onExpansionChange]);
  const renderIndent = () => {
    const indentLevel = Math.max(0, depth - 1);
    if (!indentLevel) return null;
    return Array.from({ length: indentLevel }).map((_, i) => /* @__PURE__ */ jsx("span", { className: `ih-menu-indent indent-${depth}` }, i));
  };
  const onLeafClick = useCallback(
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
  const onToggleFavorite = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (menuKey === null) return;
      const toFavorite = !menuIsFavorite;
      if (!toFavorite && confirm) {
        const menuName = getMenuLabel(menu) || "this menu";
        const ok = await confirm.warning(
          "Remove from Favorites",
          `Remove <strong>${menuName}</strong> from your favorites?`
        );
        if (!ok) return;
      }
      onFavoriteToggle == null ? void 0 : onFavoriteToggle({ id: menuKey, isFavorite: toFavorite });
    },
    [menuKey, menuIsFavorite, onFavoriteToggle, confirm, menu]
  );
  if (!menu) return null;
  const menuDragProps = {
    "data-sidebar-menu-key": getSidebarMenuKey(menu),
    "data-menu-id": dragEnabled && menuKey != null ? String(menuKey) : void 0
  };
  const renderLeafInner = () => /* @__PURE__ */ jsxs(Fragment, { children: [
    renderIndent(),
    /* @__PURE__ */ jsx("i", { className: iconClass }),
    /* @__PURE__ */ jsxs(
      "span",
      {
        title: menuLabel,
        className: [
          "ih-menu-label",
          showApplication ? "ih-menu-label--compact" : ""
        ].filter(Boolean).join(" "),
        children: [
          /* @__PURE__ */ jsx("h6", { children: /* @__PURE__ */ jsx(Highlighted, { text: menuLabel, term: filter }) }),
          favoriteSubtitle ? /* @__PURE__ */ jsx("small", { className: "ih-menu-application", children: favoriteSubtitle }) : null
        ]
      }
    ),
    favoriteMode && onFavoriteToggle ? /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx("ih-menu", { "data-ih-menu": true, children: /* @__PURE__ */ jsxs(
    "li",
    {
      className: [
        isModuleNode ? "is-module" : "",
        isModuleNode ? menu.visibility ?? "" : ""
      ].filter(Boolean).join(" "),
      children: [
        isModuleNode ? /* @__PURE__ */ jsxs(
          "small",
          {
            className: [
              "ih-menu-module",
              collapsible && hasChild ? "ih-menu-module--collapsible" : ""
            ].filter(Boolean).join(" "),
            onClick: collapsible && hasChild ? clickGroup : void 0,
            children: [
              /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(Highlighted, { text: menuLabel, term: filter }) }),
              collapsible && hasChild ? /* @__PURE__ */ jsx(
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
        ) : isGroupNodeValue ? /* @__PURE__ */ jsxs(
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
              depth > 0 || isFavoritesGroup ? /* @__PURE__ */ jsx("i", { className: iconClass }) : null,
              /* @__PURE__ */ jsx("h6", { children: /* @__PURE__ */ jsx(Highlighted, { text: menuLabel, term: filter }) }),
              collapsible ? /* @__PURE__ */ jsx(
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
        ) : /* @__PURE__ */ jsx(Fragment, { children: isNewTab && menuRoute ? /* @__PURE__ */ jsx(
          "a",
          {
            className: `is-new-tab${leafStateClass}`,
            "aria-current": isActive ? "page" : void 0,
            rel: "noopener noreferrer",
            target: "_blank",
            href,
            ...menuDragProps,
            children: renderLeafInner()
          }
        ) : isReload && menuRoute ? /* @__PURE__ */ jsx(
          "a",
          {
            className: `is-reload${leafStateClass}`,
            "aria-current": isActive ? "page" : void 0,
            target: "_self",
            href,
            ...menuDragProps,
            children: renderLeafInner()
          }
        ) : isSpa && menuRoute ? /* @__PURE__ */ jsx(
          "a",
          {
            ref: (el) => {
              menuItemRef.current = el;
            },
            className: `is-spa${leafStateClass}`,
            "aria-current": isActive ? "page" : void 0,
            href,
            onClick: onLeafClick,
            ...menuDragProps,
            children: renderLeafInner()
          }
        ) : null }),
        hasChild ? /* @__PURE__ */ jsx(
          "ul",
          {
            className: (isGroupNodeValue || isModuleNode) && collapsible ? isGroupExpanded ? "expanded" : "collapsed" : "",
            children: menuChildren.map((m) => /* @__PURE__ */ jsx(
              IHMenu2,
              {
                menu: m,
                filter,
                selectedMenuId,
                onToggleGroup,
                onExpansionChange,
                collapsible,
                favoriteMode,
                dragEnabled,
                pathByKey,
                showApplication,
                depth: depth + 1,
                onFavoriteToggle
              },
              getSidebarMenuKey(m) ?? String(getMenuKey(m))
            ))
          }
        ) : null
      ]
    }
  ) });
});
function HostApiBridge(props) {
  const navigate = useNavigate();
  const baseHref = useHref("/");
  const {
    setTitle,
    setBreadcrumbs,
    setRemoteTitle,
    setRemoteBreadcrumbs,
    clearRemote,
    setRouteMetadata
  } = useHostUi();
  const hostApi = useMemo(
    () => ({
      state: props.state,
      navigate: (url) => navigate(toRouterUrl(url, baseHref)),
      setTitle,
      setBreadcrumbs,
      setRemoteTitle,
      setRemoteBreadcrumbs,
      clearRemote,
      setRouteMetadata
    }),
    [
      props.state,
      navigate,
      baseHref,
      setTitle,
      setBreadcrumbs,
      setRemoteTitle,
      setRemoteBreadcrumbs,
      clearRemote,
      setRouteMetadata
    ]
  );
  return /* @__PURE__ */ jsx(IHostApiProvider, { hostApi, children: props.children });
}
function HostShell(props) {
  return /* @__PURE__ */ jsx(IHostUiProvider, { children: /* @__PURE__ */ jsx(HostApiBridge, { state: props.state, children: props.children }) });
}
var FavoritesSection = memo(function FavoritesSection2({
  favorites,
  menus,
  collapsible,
  onFavoriteToggle,
  onFavoriteReorder,
  stateGroup,
  onExpansionChange
}) {
  const [favoritesCollapsed, setFavoritesCollapsed] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState(favorites);
  const [dragOver, setDragOver] = useState(false);
  const listRef = useRef(null);
  const itemsRef = useRef(favorites);
  const dragRef = useRef(null);
  const dragHandlersRef = useRef(null);
  useEffect(() => {
    itemsRef.current = favorites;
    setFavoriteItems(favorites);
  }, [favorites]);
  const pathByKey = useMemo(
    () => buildFavoritePathMap(menus, favoriteItems),
    [menus, favoriteItems]
  );
  const group = useMemo(() => {
    if (!(favoriteItems == null ? void 0 : favoriteItems.length)) return null;
    if (stateGroup)
      return { ...stateGroup, child: favoriteItems, children: void 0 };
    const node = {
      id: SIDEBAR_FAVORITES_GROUP_ID,
      name: "Favorites",
      type: "group",
      icon: "fa-solid fa-star",
      visibility: favoritesCollapsed ? "collapsed" : "expanded",
      children: favoriteItems
    };
    return normalizeMenuTree([node])[0] ?? null;
  }, [favoriteItems, favoritesCollapsed, stateGroup]);
  const computeDropIndex = useCallback((clientY) => {
    const host = listRef.current;
    if (!host) return 0;
    const leaves = Array.from(
      host.querySelectorAll(".ih-sidebar-favorites [data-menu-id]")
    ).filter(
      (el) => el.getAttribute("data-menu-id") !== SIDEBAR_FAVORITES_GROUP_ID
    );
    for (let i = 0; i < leaves.length; i++) {
      const rect = leaves[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return leaves.length;
  }, []);
  const reorderLive = useCallback((menuId, targetIndex) => {
    const items = itemsRef.current;
    const sourceIndex = items.findIndex(
      (menu) => String(getMenuKey(menu)) === menuId
    );
    if (sourceIndex === -1) return;
    const insertAt = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    if (insertAt === sourceIndex) return;
    const reordered = [...items];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(insertAt, 0, moved);
    itemsRef.current = reordered;
    setFavoriteItems(reordered);
  }, []);
  const cleanupDrag = useCallback(() => {
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
  const startDrag = useCallback(
    (event) => {
      const target = event.target;
      const leaf = target.closest(
        ".ih-sidebar-favorites [data-menu-id]"
      );
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
          const menuIds = reordered.map((menu) => getMenuKey(menu)).filter(
            (key) => key !== null && key !== void 0
          );
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
  const onToggleGroup = useCallback(
    () => setFavoritesCollapsed((value) => !value),
    []
  );
  if (!group) return null;
  return /* @__PURE__ */ jsx(
    "ul",
    {
      ref: listRef,
      className: ["ih-sidebar-favorites", dragOver ? "is-drag-over" : ""].filter(Boolean).join(" "),
      onMouseDown: startDrag,
      children: /* @__PURE__ */ jsx(
        IHMenu,
        {
          menu: group,
          filter: "",
          selectedMenuId: null,
          onToggleGroup,
          onExpansionChange,
          collapsible,
          favoriteMode: true,
          pathByKey,
          onFavoriteToggle,
          dragEnabled: true,
          showApplication: true
        }
      )
    }
  );
});

// src/components/host/sidebar/sidebar-resize.ts
var SidebarResizeController = class {
  host;
  handle;
  committed;
  document;
  view;
  defaultWidth;
  originalWidth;
  originalPriority;
  options;
  initialized = false;
  loadedStorageKey;
  width;
  renderedWidth = null;
  resizeFrame = null;
  pendingWidth = null;
  drag = null;
  constructor(host, handle, options, committed) {
    this.host = host;
    this.handle = handle;
    this.committed = committed;
    this.document = host.ownerDocument;
    this.view = this.document.defaultView;
    this.originalWidth = host.style.getPropertyValue("--i-sidebar-width");
    this.originalPriority = host.style.getPropertyPriority("--i-sidebar-width");
    this.host.classList.add("is-width-initializing");
    this.defaultWidth = this.readDefaultWidth();
    this.width = this.defaultWidth;
    this.options = this.normalize(options);
    this.handle.addEventListener("pointerdown", this.onPointerDown);
    this.handle.addEventListener("keydown", this.onKeyDown);
    this.configure(options);
    this.host.classList.remove("is-width-initializing");
  }
  configure(options) {
    const initialWidth = !this.initialized;
    const next = this.normalize(options);
    const keyChanged = next.widthStorageKey !== this.options.widthStorageKey;
    const boundsChanged = next.minWidth !== this.options.minWidth || next.maxWidth !== this.options.maxWidth;
    if (!next.resizable || !next.visible || keyChanged || boundsChanged) this.cancel();
    this.options = next;
    if (next.resizable && (!this.initialized || next.widthStorageKey !== this.loadedStorageKey)) {
      this.initialized = true;
      this.loadedStorageKey = next.widthStorageKey;
      this.width = this.readStoredWidth() ?? this.defaultWidth;
    }
    if (this.initialized) this.render(this.width, initialWidth);
    else this.publish();
  }
  destroy() {
    this.cancel();
    this.handle.removeEventListener("pointerdown", this.onPointerDown);
    this.handle.removeEventListener("keydown", this.onKeyDown);
    if (this.originalWidth) {
      this.host.style.setProperty("--i-sidebar-width", this.originalWidth, this.originalPriority);
    } else {
      this.host.style.removeProperty("--i-sidebar-width");
    }
  }
  normalize(options) {
    const minWidth = Number.isFinite(options.minWidth) && options.minWidth > 0 ? options.minWidth : 220;
    const maxWidth = Number.isFinite(options.maxWidth) && options.maxWidth > 0 ? options.maxWidth : 480;
    return { ...options, minWidth, maxWidth: Math.max(minWidth, maxWidth) };
  }
  readDefaultWidth() {
    const probe = this.document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;width:var(--i-sidebar-width,260px);height:0;padding:0;border:0;";
    this.host.appendChild(probe);
    const resolved = this.view.getComputedStyle(probe).width;
    const token = this.view.getComputedStyle(this.host).getPropertyValue("--i-sidebar-width").trim();
    probe.remove();
    const value = /^\d+(\.\d+)?px$/.test(resolved) ? parseFloat(resolved) : /^\d+(\.\d+)?px$/.test(token) ? parseFloat(token) : 260;
    return value > 0 ? value : 260;
  }
  readStoredWidth() {
    if (this.options.widthStorageKey === null) return null;
    try {
      const raw = this.view.localStorage.getItem(this.options.widthStorageKey);
      if (raw === null || !raw.trim()) return null;
      const width = Number(raw);
      return Number.isFinite(width) && width > 0 ? width : null;
    } catch {
      return null;
    }
  }
  clamp(width) {
    return Math.min(this.options.maxWidth, Math.max(this.options.minWidth, width));
  }
  render(width, immediate = false) {
    this.width = this.clamp(width);
    if (immediate) this.host.classList.add("is-width-initializing");
    if (this.renderedWidth !== this.width) {
      this.host.style.setProperty("--i-sidebar-width", `${this.width}px`);
      this.renderedWidth = this.width;
    }
    if (immediate) {
      this.host.getBoundingClientRect();
      this.host.classList.remove("is-width-initializing");
    }
    this.publish();
  }
  publish() {
    for (const [name, value] of [
      ["aria-valuenow", this.width],
      ["aria-valuemin", this.options.minWidth],
      ["aria-valuemax", this.options.maxWidth]
    ]) {
      const text2 = String(value);
      if (this.handle.getAttribute(name) !== text2) this.handle.setAttribute(name, text2);
    }
  }
  commit(previousWidth) {
    if (this.width === previousWidth) return;
    if (this.options.widthStorageKey !== null) {
      try {
        this.view.localStorage.setItem(this.options.widthStorageKey, String(this.width));
      } catch {
      }
    }
    this.committed(this.width);
  }
  onPointerDown = (event) => {
    if (!this.options.resizable || !this.options.visible || this.drag || !event.isPrimary || event.button !== 0)
      return;
    event.preventDefault();
    this.handle.focus();
    this.drag = { pointerId: event.pointerId, x: event.clientX, width: this.width };
    this.host.classList.add("is-resizing");
    this.document.documentElement.classList.add("ih-sidebar-resizing");
    this.document.addEventListener("pointermove", this.onPointerMove);
    this.document.addEventListener("pointerup", this.onPointerUp);
    this.document.addEventListener("pointercancel", this.onPointerCancel);
    this.document.addEventListener("keydown", this.onDragKeyDown, true);
    this.handle.addEventListener("lostpointercapture", this.onPointerCancel);
    this.view.addEventListener("blur", this.onBlur);
    try {
      this.handle.setPointerCapture(event.pointerId);
    } catch {
    }
  };
  onPointerMove = (event) => {
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    let width = this.clamp(this.drag.width + event.clientX - this.drag.x);
    if (this.defaultWidth >= this.options.minWidth && this.defaultWidth <= this.options.maxWidth && Math.abs(width - this.defaultWidth) <= 12) {
      width = this.defaultWidth;
    }
    this.pendingWidth = width;
    if (this.resizeFrame === null) {
      this.resizeFrame = this.view.requestAnimationFrame(() => {
        this.resizeFrame = null;
        this.flushPendingWidth();
      });
    }
  };
  onPointerUp = (event) => {
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    const previousWidth = this.drag.width;
    this.flushPendingWidth(true);
    this.cleanupDrag();
    this.commit(previousWidth);
  };
  onPointerCancel = (event) => {
    var _a;
    if (((_a = this.drag) == null ? void 0 : _a.pointerId) === event.pointerId) this.cancel();
  };
  onBlur = () => this.cancel();
  onDragKeyDown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    this.cancel();
  };
  onKeyDown = (event) => {
    if (!this.options.resizable || !this.options.visible || this.drag) return;
    let width = this.width;
    const step = event.shiftKey ? 50 : 10;
    switch (event.key) {
      case "ArrowLeft":
        width -= step;
        break;
      case "ArrowRight":
        width += step;
        break;
      case "Home":
        width = this.options.minWidth;
        break;
      case "End":
        width = this.options.maxWidth;
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const previousWidth = this.width;
    this.render(width);
    this.commit(previousWidth);
  };
  cancel() {
    if (!this.drag) return;
    const width = this.drag.width;
    this.cleanupDrag();
    this.render(width, width !== this.width);
  }
  cleanupDrag() {
    var _a;
    if (this.resizeFrame !== null) this.view.cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = null;
    this.pendingWidth = null;
    const pointerId = (_a = this.drag) == null ? void 0 : _a.pointerId;
    this.drag = null;
    this.document.removeEventListener("pointermove", this.onPointerMove);
    this.document.removeEventListener("pointerup", this.onPointerUp);
    this.document.removeEventListener("pointercancel", this.onPointerCancel);
    this.document.removeEventListener("keydown", this.onDragKeyDown, true);
    this.handle.removeEventListener("lostpointercapture", this.onPointerCancel);
    this.view.removeEventListener("blur", this.onBlur);
    this.host.classList.remove("is-resizing");
    if (!this.document.querySelector("ih-sidebar.is-resizing")) {
      this.document.documentElement.classList.remove("ih-sidebar-resizing");
    }
    if (pointerId !== void 0) {
      try {
        if (this.handle.hasPointerCapture(pointerId)) this.handle.releasePointerCapture(pointerId);
      } catch {
      }
    }
  }
  flushPendingWidth(immediate = false) {
    if (this.resizeFrame !== null) this.view.cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = null;
    const width = this.pendingWidth;
    this.pendingWidth = null;
    if (width !== null) this.render(width, immediate && width !== this.width);
  }
};

// src/components/host/sidebar/sidebar.utils.ts
var SidebarSearchState = class {
  term = "";
  expanded = /* @__PURE__ */ new Map();
  constructor(term = "") {
    this.setTerm(term);
  }
  setTerm(value) {
    const term = value.trim();
    if (term === this.term) return false;
    this.term = term;
    this.expanded.clear();
    return true;
  }
  setExpanded({ menu, expanded }) {
    const key = getSidebarMenuKey(menu);
    if (!this.term || !(key == null ? void 0 : key.startsWith("main:")) || menu.visibility === "no-child")
      return false;
    this.expanded.set(key, expanded);
    return true;
  }
  filter(menus) {
    return filterMenuTree(menus, this.term, this.expanded);
  }
};
function filterMenuTree(menus, rawTerm, expanded = /* @__PURE__ */ new Map()) {
  const term = (rawTerm ?? "").trim().toLowerCase();
  if (!term) return menus;
  const filtered = [];
  for (const menu of menus) {
    const result = filterMenuBranch(menu, term, expanded);
    if (result) filtered.push(result);
  }
  return filtered;
}
function filterMenuBranch(menu, term, expanded, includeBranch = false) {
  const name = getMenuLabel(menu).toLowerCase();
  const selfMatches = includeBranch || name.includes(term);
  const originalChildren = getMenuChildren(menu);
  const filteredChildren = [];
  for (const child of originalChildren) {
    const childResult = filterMenuBranch(child, term, expanded, selfMatches);
    if (childResult) filteredChildren.push(childResult);
  }
  const childMatches = filteredChildren.length > 0;
  if (!selfMatches && !childMatches) return null;
  const cloned = {
    ...menu,
    child: filteredChildren,
    children: void 0
  };
  if (originalChildren.length && menu.visibility !== "no-child") {
    const key = getSidebarMenuKey(menu);
    cloned.visibility = key && expanded.get(key) === false ? "collapsed" : "expanded";
  }
  return cloned;
}
function flattenNavigableMenus(menus, collapsible = false) {
  const result = [];
  const visit = (menu) => {
    const children2 = getMenuChildren(menu);
    const hasChildren = children2.length > 0;
    const isLeaf = menu.type !== "group" && Number(menu.menuTypeId) === 3 && (!hasChildren || menu.visibility === "no-child");
    if (isLeaf) result.push(menu);
    if (collapsible && menu.visibility === "collapsed") return;
    for (const c of children2) visit(c);
  };
  for (const m of menus) visit(m);
  return result;
}
var EMPTY_FAVORITES = [];
var ignoreToggleGroup = () => void 0;
function IHSidebar(props) {
  const {
    user,
    menus,
    visible = true,
    resizable = true,
    minWidth = 220,
    maxWidth = 480,
    widthStorageKey = "insight.sidebar.width",
    menuStateStorageKey = "insight.sidebar.menu-state",
    onWidthChange,
    impersonating = false,
    footerText = "Insight Local",
    collapsible = false,
    favoriteMode = false,
    favorites = EMPTY_FAVORITES,
    personalProfileUrl,
    onFavoriteToggle,
    onFavoriteReorder
  } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const baseHref = useHref("/");
  const auth = useContext(IAuthContext);
  const headerRef = useRef(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const resizeController = useRef(null);
  const onWidthChangeRef = useRef(onWidthChange);
  const initialResizeOptions = useRef({
    resizable,
    visible,
    minWidth,
    maxWidth,
    widthStorageKey
  });
  useLayoutEffect(() => {
    const controller = new SidebarResizeController(
      sidebarRef.current,
      resizeHandleRef.current,
      initialResizeOptions.current,
      (width) => {
        var _a;
        return (_a = onWidthChangeRef.current) == null ? void 0 : _a.call(onWidthChangeRef, width);
      }
    );
    resizeController.current = controller;
    return () => {
      controller.destroy();
      resizeController.current = null;
    };
  }, []);
  useLayoutEffect(() => {
    var _a;
    onWidthChangeRef.current = onWidthChange;
    (_a = resizeController.current) == null ? void 0 : _a.configure({
      resizable,
      visible,
      minWidth,
      maxWidth,
      widthStorageKey
    });
  }, [resizable, visible, minWidth, maxWidth, widthStorageKey, onWidthChange]);
  const profileUrl = (personalProfileUrl ?? "").trim() || DEFAULT_PERSONAL_PROFILE_URL;
  useEffect(() => {
    if (!accountMenuOpen) return;
    const onPointerDown = (e) => {
      var _a;
      const target = e.target;
      if (target && ((_a = headerRef.current) == null ? void 0 : _a.contains(target))) return;
      setAccountMenuOpen(false);
    };
    const onKeyDown = (e) => {
      var _a;
      const header = headerRef.current;
      if (e.key === "Escape") {
        setAccountMenuOpen(false);
        (_a = header == null ? void 0 : header.querySelector(".ih-user-chip")) == null ? void 0 : _a.focus();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (!(header == null ? void 0 : header.contains(e.target))) return;
      const items = Array.from(
        header.querySelectorAll(".ih-user-dropdown-item")
      );
      if (!items.length) return;
      e.preventDefault();
      const current = items.indexOf(document.activeElement);
      const next = current < 0 ? e.key === "ArrowDown" ? 0 : items.length - 1 : (current + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next].focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountMenuOpen]);
  const onLogoutClick = useCallback(() => {
    var _a, _b;
    setAccountMenuOpen(false);
    if (!auth) return;
    const signinUrl = (_b = (_a = auth.config) == null ? void 0 : _a.signinUrl) == null ? void 0 : _b.trim();
    const target = signinUrl && signinUrl.length > 0 ? signinUrl : "/";
    void auth.session.logout().then(() => {
      window.location.href = target;
    });
  }, [auth]);
  const initialFilter = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return sp.get("menu-filter") ?? "";
  }, [location.search]);
  const [filterInput, setFilterInput] = useState(initialFilter);
  const filterInputRef = useRef(initialFilter);
  const filterTimer = useRef(null);
  const [searchState] = useState(() => new SidebarSearchState(initialFilter));
  const [menuFilter, setMenuFilter] = useState(initialFilter.trim());
  const [searchRevision, refreshSearch] = useReducer(
    (value) => value + 1,
    0
  );
  const locationRef = useRef(location);
  const [keyboardNavActive, setKeyboardNavActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(
    null
  );
  const [menuState] = useState(() => new SidebarMenuState(menuStateStorageKey));
  const [menuRevision, refreshMenus] = useReducer(
    (value) => value + 1,
    0
  );
  const sourceMenus = useMemo(() => normalizeMenuTree(menus), [menus]);
  const sourceFavorites = useMemo(
    () => createFavoritesMenu(normalizeMenuTree(favorites)),
    [favorites]
  );
  const activeMenu = useMemo(
    () => resolveSidebarActiveMenu(
      sourceMenus,
      favoriteMode ? sourceFavorites : [],
      location.pathname,
      baseHref
    ),
    [sourceMenus, sourceFavorites, favoriteMode, location.pathname, baseHref]
  );
  const menuSnapshot = useMemo(
    () => ({
      revision: menuRevision,
      menus: menuState.project(sourceMenus, "main", activeMenu),
      favoriteGroup: menuState.project(
        sourceFavorites,
        "favorites",
        activeMenu
      )[0]
    }),
    [menuState, sourceMenus, sourceFavorites, menuRevision, activeMenu]
  );
  const { menus: menuTree, favoriteGroup } = menuSnapshot;
  useLayoutEffect(() => {
    if (menuState.configureStorage(menuStateStorageKey)) refreshMenus();
  }, [menuState, menuStateStorageKey]);
  useLayoutEffect(() => {
    if (menuState.hasLocation)
      menuState.observeLocation(location.pathname, baseHref);
  }, [menuState, location.pathname, baseHref]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      menuState.observeLocation(location.pathname, baseHref);
      if (menuState.restore(sourceMenus, favoriteMode ? sourceFavorites : []))
        refreshMenus();
    });
    return () => cancelAnimationFrame(frame);
  }, [
    menuState,
    sourceMenus,
    sourceFavorites,
    favoriteMode,
    location.pathname,
    baseHref
  ]);
  const searchSnapshot = useMemo(
    () => ({
      term: menuFilter,
      revision: searchRevision,
      menus: searchState.filter(menuTree)
    }),
    [searchState, menuTree, menuFilter, searchRevision]
  );
  const filteredMenus = searchSnapshot.menus;
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (sidebarRef.current)
        menuState.scrollToActive(sidebarRef.current, visible);
    });
    return () => cancelAnimationFrame(frame);
  }, [
    menuState,
    filteredMenus,
    favoriteGroup,
    visible,
    menuRevision,
    location.pathname
  ]);
  const navigableMenus = useMemo(
    () => flattenNavigableMenus(filteredMenus, collapsible),
    [filteredMenus, collapsible]
  );
  const cancelFilter = useCallback(() => {
    if (filterTimer.current !== null) clearTimeout(filterTimer.current);
    filterTimer.current = null;
  }, []);
  useEffect(() => cancelFilter, [cancelFilter]);
  useLayoutEffect(() => {
    const previous = locationRef.current;
    locationRef.current = location;
    const term = new URLSearchParams(location.search).get("menu-filter") ?? "";
    if (previous.pathname === location.pathname && term.trim() === searchState.term)
      return;
    cancelFilter();
    filterInputRef.current = term;
    setFilterInput(term);
    searchState.setTerm(term);
    setMenuFilter(term.trim());
    setKeyboardNavActive(false);
    setSelectedIndex(null);
    setSelectedMenuId(null);
  }, [location, cancelFilter, searchState]);
  const updateUrl = useCallback(
    (nextFilter) => {
      const current = locationRef.current;
      const sp = new URLSearchParams(current.search);
      const f = nextFilter.trim();
      if ((sp.get("menu-filter") ?? "") === f && (f || !sp.has("menu-filter")))
        return;
      if (f) sp.set("menu-filter", f);
      else sp.delete("menu-filter");
      navigate(
        {
          pathname: current.pathname,
          search: sp.toString() ? `?${sp.toString()}` : "",
          hash: current.hash
        },
        { replace: true }
      );
    },
    [navigate]
  );
  useEffect(() => {
    if (!menuFilter || !navigableMenus.some((menu) => getMenuKey(menu) === selectedMenuId)) {
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
    } else {
      setSelectedIndex(
        navigableMenus.findIndex((menu) => getMenuKey(menu) === selectedMenuId)
      );
    }
  }, [navigableMenus, menuFilter, selectedMenuId]);
  const applyFilter = useCallback(
    (next) => {
      cancelFilter();
      if (searchState.setTerm(next)) setMenuFilter(searchState.term);
      updateUrl(searchState.term);
    },
    [cancelFilter, searchState, updateUrl]
  );
  const onFilterChange = useCallback(
    (next) => {
      filterInputRef.current = next;
      setFilterInput(next);
      setKeyboardNavActive(false);
      setSelectedIndex(null);
      setSelectedMenuId(null);
      cancelFilter();
      if (next.trim() !== searchState.term) {
        filterTimer.current = setTimeout(() => applyFilter(next), 200);
      }
    },
    [applyFilter, cancelFilter, searchState]
  );
  const navigateToMenu = useCallback(
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
  const onSearchKeyDown = useCallback(
    (event) => {
      if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
      const pending = filterInputRef.current.trim() !== searchState.term;
      if (pending) applyFilter(filterInputRef.current);
      const items = pending ? flattenNavigableMenus(searchState.filter(menuTree), collapsible) : navigableMenus;
      if (!items.length || !searchState.term) return;
      if (event.key === "Enter") {
        if (pending || !keyboardNavActive || selectedIndex === null) return;
        event.preventDefault();
        if (items[selectedIndex]) navigateToMenu(items[selectedIndex]);
        return;
      }
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next = pending || !keyboardNavActive || selectedIndex === null ? delta > 0 ? 0 : items.length - 1 : (selectedIndex + delta + items.length) % items.length;
      setKeyboardNavActive(true);
      setSelectedIndex(next);
      setSelectedMenuId(getMenuKey(items[next]));
    },
    [
      applyFilter,
      searchState,
      menuTree,
      collapsible,
      navigableMenus,
      keyboardNavActive,
      selectedIndex,
      navigateToMenu
    ]
  );
  const onExpansionChange = useCallback(
    (event) => {
      if (searchState.setExpanded(event)) {
        refreshSearch();
        return;
      }
      menuState.setExpanded(event);
      refreshMenus();
    },
    [menuState, searchState]
  );
  return /* @__PURE__ */ jsxs(
    "ih-sidebar",
    {
      ref: sidebarRef,
      class: [!visible ? "hidden" : "", resizable ? "is-resizable" : ""].filter(Boolean).join(" ") || void 0,
      children: [
        /* @__PURE__ */ jsx("div", { className: "ih-sidebar-header", ref: headerRef, children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "ih-user-chip",
              "aria-haspopup": "menu",
              "aria-expanded": accountMenuOpen,
              onClick: () => setAccountMenuOpen((open) => !open),
              children: [
                /* @__PURE__ */ jsx("span", { className: "user-image", children: /* @__PURE__ */ jsx(
                  IAvatar,
                  {
                    alt: user.fullName,
                    size: 28,
                    src: user.userImagePath
                  }
                ) }),
                /* @__PURE__ */ jsxs("span", { className: "user-info", children: [
                  /* @__PURE__ */ jsx("small", { className: "text-subtle", children: user.employeeCode }),
                  /* @__PURE__ */ jsxs("h6", { children: [
                    impersonating ? "Acting As: " : "",
                    user.fullName
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "i",
                  {
                    className: `ih-user-caret ${accountMenuOpen ? "fas fa-angle-up" : "fas fa-angle-down"}`
                  }
                )
              ]
            }
          ),
          accountMenuOpen ? /* @__PURE__ */ jsxs("div", { className: "ih-user-dropdown i-options", role: "menu", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                className: "ih-user-dropdown-item i-option",
                role: "menuitem",
                href: profileUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: () => setAccountMenuOpen(false),
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-user fa-fw" }),
                  /* @__PURE__ */ jsx("span", { className: "i-option-label", children: "Personal Profile" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "ih-user-dropdown-item i-option",
                role: "menuitem",
                onClick: onLogoutClick,
                children: [
                  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-right-from-bracket fa-fw" }),
                  /* @__PURE__ */ jsx("span", { className: "i-option-label", children: "Logout" })
                ]
              }
            )
          ] }) : null
        ] }) : null }),
        /* @__PURE__ */ jsx("div", { className: "ih-sidebar-search", children: /* @__PURE__ */ jsx(
          "input",
          {
            placeholder: "Search Menu..",
            className: "form-control",
            value: filterInput,
            onChange: (e) => onFilterChange(e.target.value),
            onKeyDown: onSearchKeyDown
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "ih-sidebar-body scroll scroll-y", children: [
          favoriteMode ? /* @__PURE__ */ jsx(
            FavoritesSection,
            {
              favorites: (favoriteGroup == null ? void 0 : favoriteGroup.children) ?? EMPTY_FAVORITES,
              stateGroup: favoriteGroup,
              onExpansionChange,
              menus: menuTree,
              collapsible,
              onFavoriteToggle,
              onFavoriteReorder
            }
          ) : null,
          /* @__PURE__ */ jsx("ul", { children: filteredMenus.map((m) => /* @__PURE__ */ jsx(
            IHMenu,
            {
              menu: m,
              filter: menuFilter,
              selectedMenuId,
              onToggleGroup: ignoreToggleGroup,
              onExpansionChange,
              collapsible,
              favoriteMode,
              onFavoriteToggle
            },
            getSidebarMenuKey(m) ?? String(getMenuKey(m))
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ih-sidebar-footer", children: /* @__PURE__ */ jsx("small", { children: footerText }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: resizeHandleRef,
            className: "ih-sidebar-resize-handle",
            role: "separator",
            "aria-label": "Resize sidebar",
            "aria-orientation": "vertical",
            tabIndex: resizable && visible ? 0 : -1,
            hidden: !resizable || !visible
          }
        )
      ]
    }
  );
}
var IRouteAccessContext = createContext(null);
function normalizePath2(path) {
  if (path == null) return "";
  return path;
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
      // Metadata stays on the parent for nested breadcrumbs.
      title: void 0,
      breadcrumb: void 0,
      redirectTo: void 0,
      element: r.element,
      loadComponent: r.loadComponent
    };
    const parent = {
      ...r,
      element: /* @__PURE__ */ jsx(Outlet, {}),
      loadComponent: void 0,
      children: hasExplicitIndex ? expandedChildren : [implicitIndex, ...expandedChildren]
    };
    return parent;
  });
  return walk(routes);
}
function metadataRoutes(routes) {
  return routes.map(
    (route) => route.index || route.redirectTo && !route.path ? { index: true, handle: route } : {
      path: route.path || void 0,
      handle: route,
      children: route.children ? metadataRoutes(route.children) : void 0
    }
  );
}
var EMPTY_MENUS = [];
var NOOP_SUBSCRIBE = () => () => {
};
var ZERO_VERSION = () => 0;
function makeElement(r) {
  var _a;
  if (r.redirectTo) return /* @__PURE__ */ jsx(Navigate, { to: r.redirectTo, replace: true });
  if (r.element) return r.element;
  if (r.loadComponent) {
    const C = lazy(async () => {
      const comp = await r.loadComponent();
      return { default: comp };
    });
    return /* @__PURE__ */ jsx(C, {});
  }
  if ((_a = r.children) == null ? void 0 : _a.length) return /* @__PURE__ */ jsx(Outlet, {});
  return null;
}
function renderRouteTree(routes) {
  return routes.map((r, idx) => {
    var _a, _b;
    const element = makeElement(r);
    const isIndexLike = r.index === true || r.path === "" || r.path == null;
    if (isIndexLike) {
      if (r.redirectTo) {
        return /* @__PURE__ */ jsx(Route, { index: true, element }, `redir-${idx}`);
      }
      if (r.index) {
        return /* @__PURE__ */ jsx(Route, { index: true, element }, `idx-${idx}`);
      }
      return /* @__PURE__ */ jsx(Route, { element, children: ((_a = r.children) == null ? void 0 : _a.length) ? renderRouteTree(r.children) : null }, `layout-${idx}`);
    }
    const path = normalizePath2(r.path) || void 0;
    return /* @__PURE__ */ jsx(Route, { path, element, children: ((_b = r.children) == null ? void 0 : _b.length) ? renderRouteTree(r.children) : null }, `${path ?? "root"}-${idx}`);
  });
}
function IRouter(props) {
  var _a;
  const {
    routes,
    loading = /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading\u2026" }),
    notFound = /* @__PURE__ */ jsx(IErrorPage, { kind: "not-found" })
  } = props;
  const hostApi = useHostApiOptional();
  const location = useLocation();
  const baseHref = useHref("/");
  const routeBase = ((_a = useContext(UNSAFE_RouteContext).matches.at(-1)) == null ? void 0 : _a.pathnameBase) ?? "/";
  const auth = useContext(IAuthContext);
  const store = auth == null ? void 0 : auth.userMenuStore;
  useSyncExternalStore(
    (store == null ? void 0 : store.subscribe) ?? NOOP_SUBSCRIBE,
    (store == null ? void 0 : store.getVersion) ?? ZERO_VERSION,
    (store == null ? void 0 : store.getVersion) ?? ZERO_VERSION
  );
  const menus = props.menus ?? (store == null ? void 0 : store.menus) ?? EMPTY_MENUS;
  const [deniedOwners, setDeniedOwners] = useState(
    () => /* @__PURE__ */ new Set()
  );
  const reportAccess = useCallback((owner, denied2) => {
    setDeniedOwners((current) => {
      if (current.has(owner) === denied2) return current;
      const next = new Set(current);
      if (denied2) next.add(owner);
      else next.delete(owner);
      return next;
    });
  }, []);
  const denied = deniedOwners.size > 0;
  const expandedRoutes = useMemo(
    () => expandImplicitIndexRoutes(routes),
    [routes]
  );
  const routeElements = useMemo(
    () => renderRouteTree(expandedRoutes),
    [expandedRoutes]
  );
  const matchingRoutes = useMemo(
    () => metadataRoutes(expandedRoutes),
    [expandedRoutes]
  );
  const lastTitleRef = useRef(null);
  const lastCrumbsKeyRef = useRef("");
  useEffect(() => {
    if (!hostApi) return;
    const chain = (matchRoutes(matchingRoutes, location.pathname, routeBase) ?? []).map((match) => ({
      route: match.route.handle,
      url: routeBase.replace(/\/+$/, "") + match.pathname || "/",
      mountUrl: routeBase.replace(/\/+$/, "") + match.pathnameBase || "/"
    }));
    const metadata = buildRouteMetadata(chain, menus, baseHref);
    if (hostApi.setRouteMetadata) {
      hostApi.setRouteMetadata({ ...metadata, denied });
      return;
    }
    const crumbs = denied ? [{ label: "Unauthorized Access", url: void 0 }] : (metadata.breadcrumbs ?? []).map(
      (crumb, index, all) => index === all.length - 1 ? { ...crumb, url: void 0 } : crumb
    );
    const crumbsKey = JSON.stringify(crumbs);
    const nextTitle = denied ? "Unauthorized Access" : metadata.title;
    if (lastTitleRef.current !== nextTitle) {
      lastTitleRef.current = nextTitle;
      hostApi.setTitle(nextTitle);
    }
    if (lastCrumbsKeyRef.current !== crumbsKey) {
      lastCrumbsKeyRef.current = crumbsKey;
      hostApi.setBreadcrumbs(crumbs.length ? crumbs : null);
    }
  }, [
    hostApi,
    location.pathname,
    matchingRoutes,
    menus,
    baseHref,
    routeBase,
    denied
  ]);
  return /* @__PURE__ */ jsx(IRouteAccessContext.Provider, { value: reportAccess, children: /* @__PURE__ */ jsx(Suspense, { fallback: loading, children: /* @__PURE__ */ jsxs(Routes, { children: [
    routeElements,
    /* @__PURE__ */ jsx(Route, { path: "*", element: notFound })
  ] }) }) });
}
function useRemoteHostApi() {
  const hostApi = useHostApi();
  const {
    setRemoteTitle,
    setRemoteBreadcrumbs,
    setRemoteRouteMetadata,
    clearRemote
  } = useHostUi();
  const active = useRef(true);
  useLayoutEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      clearRemote();
    };
  }, [clearRemote]);
  return useMemo(() => {
    const setTitle = (title) => {
      if (active.current) setRemoteTitle(title);
    };
    const setBreadcrumbs = (items) => {
      if (active.current) setRemoteBreadcrumbs(items);
    };
    return {
      state: hostApi.state,
      navigate: hostApi.navigate,
      setTitle,
      setBreadcrumbs,
      setRemoteTitle: setTitle,
      setRemoteBreadcrumbs: setBreadcrumbs,
      setRouteMetadata: (metadata) => {
        if (active.current) setRemoteRouteMetadata(metadata);
      },
      clearRemote: () => {
        if (active.current) clearRemote();
      }
    };
  }, [
    hostApi.navigate,
    hostApi.state,
    setRemoteTitle,
    setRemoteBreadcrumbs,
    setRemoteRouteMetadata,
    clearRemote
  ]);
}

// src/components/image-cropper/image-cropper-engine.ts
function computeCropRect(naturalWidth, naturalHeight, zoom, panX, panY, stage) {
  if (naturalWidth <= 0 || naturalHeight <= 0 || stage <= 0 || zoom < 1)
    return null;
  const scale = Math.max(stage / naturalWidth, stage / naturalHeight) * zoom;
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const x = Math.min(Math.max(panX, -(width - stage) / 2), (width - stage) / 2);
  const y = Math.min(
    Math.max(panY, -(height - stage) / 2),
    (height - stage) / 2
  );
  const srcW = stage / scale;
  const srcH = stage / scale;
  return {
    srcX: Math.min(
      Math.max(((width - stage) / 2 - x) / scale, 0),
      Math.max(0, naturalWidth - srcW)
    ),
    srcY: Math.min(
      Math.max(((height - stage) / 2 - y) / scale, 0),
      Math.max(0, naturalHeight - srcH)
    ),
    srcW,
    srcH
  };
}
var ImageCropperEngine = class {
  image = null;
  zoom = 1;
  panX = 0;
  panY = 0;
  size = 240;
  minZoom = 1;
  maxZoom = 3;
  version = 0;
  async load(src) {
    const version = ++this.version;
    this.image = null;
    this.zoom = this.minZoom;
    this.panX = 0;
    this.panY = 0;
    if (!src) return false;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (version !== this.version) {
          resolve(false);
          return;
        }
        if (!image.naturalWidth || !image.naturalHeight) {
          reject(new Error("Unable to load image."));
          return;
        }
        this.image = image;
        this.clampPan();
        resolve(true);
      };
      image.onerror = () => {
        if (version !== this.version) {
          resolve(false);
          return;
        }
        reject(new Error("Unable to load image."));
      };
      image.src = src;
    });
  }
  configure(size, minZoom, maxZoom) {
    this.size = Number.isFinite(size) && size > 0 ? size : 240;
    this.minZoom = Number.isFinite(minZoom) ? Math.max(1, minZoom) : 1;
    this.maxZoom = Number.isFinite(maxZoom) ? Math.max(this.minZoom, maxZoom) : Math.max(this.minZoom, 3);
    this.setZoom(this.zoom);
  }
  setZoom(value) {
    if (!Number.isFinite(value)) return;
    this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, value));
    this.clampPan();
  }
  panBy(x, y) {
    this.panX += x;
    this.panY += y;
    this.clampPan();
  }
  clampPan() {
    const image = this.image;
    if (!image) return;
    const scale = Math.max(
      this.size / image.naturalWidth,
      this.size / image.naturalHeight
    ) * this.zoom;
    const x = Math.max(0, (image.naturalWidth * scale - this.size) / 2);
    const y = Math.max(0, (image.naturalHeight * scale - this.size) / 2);
    this.panX = Math.min(x, Math.max(-x, this.panX));
    this.panY = Math.min(y, Math.max(-y, this.panY));
  }
  get imageStyle() {
    const image = this.image;
    if (!image) return null;
    const scale = Math.max(
      this.size / image.naturalWidth,
      this.size / image.naturalHeight
    ) * this.zoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${(this.size - width) / 2 + this.panX}px`,
      top: `${(this.size - height) / 2 + this.panY}px`
    };
  }
  async exportImage(options = {}) {
    const image = this.image;
    const version = this.version;
    if (!image) throw new Error("Load an image before exporting.");
    const rect = computeCropRect(
      image.naturalWidth,
      image.naturalHeight,
      this.zoom,
      this.panX,
      this.panY,
      this.size
    );
    if (!rect) throw new Error("Unable to crop image.");
    const size = Math.max(1, Math.floor(Math.min(rect.srcW, rect.srcH)));
    const canvas = image.ownerDocument.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create image canvas.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      rect.srcX,
      rect.srcY,
      rect.srcW,
      rect.srcH,
      0,
      0,
      size,
      size
    );
    const blob = await new Promise(
      (resolve, reject) => canvas.toBlob(
        (value) => value ? resolve(value) : reject(new Error("Unable to export image.")),
        options.mimeType ?? "image/png",
        options.quality ?? 1
      )
    );
    if (version !== this.version)
      throw new DOMException("The image source changed.", "AbortError");
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unable to read exported image."));
      reader.onerror = () => reject(new Error("Unable to read exported image."));
      reader.onabort = () => reject(new DOMException("Image export was aborted.", "AbortError"));
      reader.readAsDataURL(blob);
    });
    if (version !== this.version)
      throw new DOMException("The image source changed.", "AbortError");
    return { blob, dataUrl, mimeType: blob.type, width: size, height: size };
  }
  dispose() {
    ++this.version;
    this.image = null;
  }
};
var IImageCropper = forwardRef(function IImageCropper2({
  src,
  disabled = false,
  viewportSize = 240,
  shape = "square",
  minZoom = 1,
  maxZoom = 3,
  alt = "Image crop preview",
  zoomLabel = "Zoom",
  panLabel = "Reposition image using arrow keys or drag",
  onReady,
  onError,
  className,
  ...rest
}, ref) {
  const [engine] = useState(() => new ImageCropperEngine());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, render] = useState(0);
  const pointer = useRef(null);
  const mounted = useRef(false);
  const callbacks = useRef({ onReady, onError });
  useLayoutEffect(() => {
    callbacks.current = { onReady, onError };
  }, [onReady, onError]);
  useLayoutEffect(() => {
    engine.configure(viewportSize, minZoom, maxZoom);
    render((value) => value + 1);
  }, [engine, viewportSize, minZoom, maxZoom]);
  useEffect(() => {
    let active = true;
    mounted.current = true;
    setReady(false);
    setLoading(Boolean(src));
    pointer.current = null;
    void engine.load(src).then((loaded) => {
      var _a, _b;
      if (active) {
        setReady(loaded);
        if (loaded) (_b = (_a = callbacks.current).onReady) == null ? void 0 : _b.call(_a);
      }
    }).catch((error) => {
      var _a, _b;
      if (active) (_b = (_a = callbacks.current).onError) == null ? void 0 : _b.call(_a, error);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      mounted.current = false;
      engine.dispose();
    };
  }, [engine, src]);
  useImperativeHandle(
    ref,
    () => ({
      exportImage: async (options) => {
        var _a, _b;
        try {
          return await engine.exportImage(options);
        } catch (error) {
          if (mounted.current && !(error instanceof DOMException && error.name === "AbortError")) {
            (_b = (_a = callbacks.current).onError) == null ? void 0 : _b.call(
              _a,
              error instanceof Error ? error : new Error("Unable to export image.")
            );
          }
          throw error;
        }
      }
    }),
    [engine]
  );
  return /* @__PURE__ */ jsxs(
    "i-image-cropper",
    {
      ...rest,
      class: ["i-image-cropper", className].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: [
              "i-image-cropper__stage",
              shape === "circle" ? "i-image-cropper__stage--circle" : ""
            ].join(" "),
            style: { width: engine.size, height: engine.size },
            tabIndex: disabled || !ready ? -1 : 0,
            role: "group",
            "aria-label": panLabel,
            "aria-disabled": disabled,
            "aria-busy": loading,
            onPointerDown: (event) => {
              var _a, _b;
              if (disabled || !ready || event.button !== 0) return;
              event.preventDefault();
              pointer.current = {
                x: event.clientX,
                y: event.clientY,
                id: event.pointerId
              };
              (_b = (_a = event.currentTarget).setPointerCapture) == null ? void 0 : _b.call(_a, event.pointerId);
            },
            onPointerMove: (event) => {
              const point = pointer.current;
              if (disabled || !point || event.pointerId !== point.id) return;
              engine.panBy(event.clientX - point.x, event.clientY - point.y);
              point.x = event.clientX;
              point.y = event.clientY;
              render((value) => value + 1);
            },
            onPointerUp: () => {
              pointer.current = null;
            },
            onPointerCancel: () => {
              pointer.current = null;
            },
            onLostPointerCapture: () => {
              pointer.current = null;
            },
            onKeyDown: (event) => {
              if (disabled || !ready) return;
              const moves = {
                ArrowLeft: [-5, 0],
                ArrowRight: [5, 0],
                ArrowUp: [0, -5],
                ArrowDown: [0, 5]
              };
              const move = moves[event.key];
              if (move) {
                event.preventDefault();
                engine.panBy(...move);
                render((value) => value + 1);
              }
            },
            children: [
              ready && src ? /* @__PURE__ */ jsx(
                "img",
                {
                  className: "i-image-cropper__image",
                  src,
                  alt,
                  draggable: false,
                  style: engine.imageStyle ?? void 0
                }
              ) : null,
              /* @__PURE__ */ jsx("span", { className: "i-image-cropper__ring", "aria-hidden": "true" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("label", { className: "i-image-cropper__zoom", children: [
          /* @__PURE__ */ jsx("span", { children: zoomLabel }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: engine.minZoom,
              max: engine.maxZoom,
              step: "0.05",
              value: engine.zoom,
              disabled: disabled || !ready,
              onChange: (event) => {
                if (!disabled && ready) {
                  engine.setZoom(Number(event.target.value));
                  render((value) => value + 1);
                }
              }
            }
          )
        ] })
      ]
    }
  );
});
function ILoadError({
  message,
  title = "",
  density = "default",
  contentClass = "",
  contentStyle = {},
  retryDisabled = false,
  retryLoading = false,
  onRetry,
  className,
  ...rest
}) {
  if (!(message == null ? void 0 : message.trim())) return null;
  return /* @__PURE__ */ jsx(
    "i-load-error",
    {
      ...rest,
      class: ["i-load-error", className].filter(Boolean).join(" "),
      density,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: ["i-load-error__content", contentClass].filter(Boolean).join(" "),
          style: contentStyle,
          role: "alert",
          children: [
            /* @__PURE__ */ jsx(
              IIcon,
              {
                icon: "fa-solid fa-circle-exclamation",
                size: density === "inline" ? "sm" : "lg",
                "aria-hidden": "true"
              }
            ),
            title ? /* @__PURE__ */ jsx("p", { children: title }) : null,
            /* @__PURE__ */ jsx("p", { className: "i-load-error__message", children: message }),
            /* @__PURE__ */ jsx(
              IButton,
              {
                type: "button",
                variant: "primary",
                icon: "sync",
                size: density === "inline" ? "xs" : density === "compact" ? "sm" : "md",
                disabled: retryDisabled,
                loading: retryLoading,
                onClick: () => {
                  if (!retryDisabled && !retryLoading) onRetry == null ? void 0 : onRetry();
                },
                children: "Retry"
              }
            )
          ]
        }
      )
    }
  );
}
function ILoadingRegion({
  loading = false,
  error = null,
  label = "Loading...",
  contextKey = null,
  initialMinHeight = "var(--i-state-min-height, min(40vh, 240px))",
  height,
  containerClass = "",
  contentClass = "flex flex-col",
  layout = "auto",
  children: children2,
  className,
  style,
  ...rest
}) {
  const content = useRef(null);
  const [completed, setCompleted] = useState({ hasLoaded: false, context: null });
  const [measuredHeight, setMeasuredHeight] = useState(0);
  useLayoutEffect(() => {
    var _a;
    const element = content.current;
    if (!element) return;
    element.toggleAttribute("inert", loading);
    if (loading) {
      const size = element.getBoundingClientRect().height;
      if (size > 0) setMeasuredHeight(size);
      return;
    }
    if (!error)
      setCompleted(
        (previous) => previous.hasLoaded && previous.context === contextKey ? previous : { hasLoaded: true, context: contextKey }
      );
    const Observer = (_a = element.ownerDocument.defaultView) == null ? void 0 : _a.ResizeObserver;
    if (!Observer) return;
    const observer = new Observer((entries) => {
      var _a2;
      const size = ((_a2 = entries[0]) == null ? void 0 : _a2.contentRect.height) ?? 0;
      setMeasuredHeight((previous) => previous === size ? previous : size);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading, error, contextKey]);
  return /* @__PURE__ */ jsx(
    "i-loading-region",
    {
      ...rest,
      class: ["i-loading-region", className].filter(Boolean).join(" "),
      "data-i-surface": "delegate",
      layout,
      style: {
        ...style,
        "--i-region-state-min-height": initialMinHeight
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          "data-i-loading-container": true,
          className: ["i-loading-region__container", containerClass].join(" "),
          "data-layout": layout,
          style: {
            height: height ?? void 0,
            minHeight: loading ? completed.hasLoaded && measuredHeight > 0 ? `${measuredHeight}px` : initialMinHeight : void 0
          },
          "aria-busy": loading,
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                ref: content,
                "data-layout": layout,
                "data-i-loading-content": true,
                className: [
                  "i-loading-region__content i-surface-content",
                  contentClass
                ].join(" "),
                style: {
                  opacity: loading ? 0.45 : void 0,
                  visibility: loading && completed.hasLoaded && completed.context !== contextKey ? "hidden" : void 0
                },
                children: typeof children2 === "function" ? children2({ hasLoaded: completed.hasLoaded }) : children2
              }
            ),
            loading ? /* @__PURE__ */ jsx("div", { className: "i-loading-region__overlay", children: /* @__PURE__ */ jsx("div", { className: "i-loading-region__indicator", children: /* @__PURE__ */ jsx(ILoading, { label }) }) }) : null
          ]
        }
      )
    }
  );
}
function IPill({
  icon,
  size = "md",
  variant = "default",
  disabled = false,
  closable = false,
  className,
  children: children2,
  onClick,
  onClose,
  ...rest
}) {
  const handleHostClick = useCallback(
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
  const handleClose = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onClose == null ? void 0 : onClose(e);
    },
    [disabled, onClose]
  );
  return /* @__PURE__ */ jsxs(
    "i-pill",
    {
      class: ["i-pill", className].filter(Boolean).join(" "),
      size,
      variant,
      "aria-disabled": disabled ? "true" : void 0,
      onClick: handleHostClick,
      ...rest,
      children: [
        icon ? /* @__PURE__ */ jsx(IIcon, { icon, size }) : null,
        /* @__PURE__ */ jsx("span", { className: "i-pill__content", children: children2 }),
        closable ? /* @__PURE__ */ jsx(
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
function useIHState(namespace, key, fallback) {
  var _a;
  const api = (_a = useHostApiOptional()) == null ? void 0 : _a.state;
  if (!api) throw new Error("useIHState requires hostApi.state.");
  useSyncExternalStore(api.subscribe, api.getVersion, api.getVersion);
  const set = useCallback((value) => api.set(namespace, key, value), [api, namespace, key]);
  const update = useCallback(
    (updater) => api.update(namespace, key, fallback, updater),
    [api, namespace, key, fallback]
  );
  const reset = useCallback(() => api.remove(namespace, key), [api, namespace, key]);
  return {
    value: api.get(namespace, key, fallback),
    set,
    update,
    reset,
    error: api.getError(namespace)
  };
}
var EMPTY = Object.freeze({
  companyId: null,
  projectKey: null,
  menuCode: null,
  companyStatus: "idle",
  projectStatus: "idle",
  error: null,
  revision: 0
});
var noSubscribe = () => () => void 0;
var emptySnapshot = () => EMPTY;
function useIHSelection() {
  var _a, _b;
  const controller = (_b = (_a = useHostApiOptional()) == null ? void 0 : _a.state) == null ? void 0 : _b.selection;
  const value = useSyncExternalStore(
    (controller == null ? void 0 : controller.subscribe) ?? noSubscribe,
    (controller == null ? void 0 : controller.getSnapshot) ?? emptySnapshot,
    (controller == null ? void 0 : controller.getSnapshot) ?? emptySnapshot
  );
  return { controller, value };
}
function filterCompany(row, term) {
  const query = term.toLowerCase();
  return row.name.toLowerCase().includes(query) || row.code.toLowerCase().includes(query);
}
var ISelectCompany = forwardRef(
  function ISelectCompany2({
    menuCode,
    stateScope = "auto",
    loading = false,
    value,
    defaultValue = null,
    onChange,
    onChanged,
    onOptionSelected,
    displayWith = "name",
    filterPredicate = filterCompany,
    className,
    ...selectProps
  }, ref) {
    const store = useIUserMenuStore();
    const version = store.getVersion();
    const { controller, value: selection } = useIHSelection();
    const hosted = !!controller && stateScope !== "local";
    const effectiveMenu = (menuCode == null ? void 0 : menuCode.trim()) || (hosted ? selection.menuCode : null);
    const menuActive = !hosted || !!selection.menuCode && effectiveMenu === selection.menuCode;
    const companyLoading = loading || store.authorizationsLoading || hosted && (!store.initialized || store.initializing || !menuActive);
    const lastNotified = useRef(void 0);
    const [internalValue, setInternalValue] = useState(
      defaultValue
    );
    const controlled = value !== void 0;
    const modelValue = controlled ? value : internalValue;
    const options = useMemo(() => {
      const companies = [...store.companies];
      const code = effectiveMenu;
      if (!code || !menuActive) return [];
      const allowed = new Set(store.menuCompanies[code] ?? []);
      return companies.filter((company) => allowed.has(company.code));
    }, [store, version, effectiveMenu, menuActive]);
    const selectedCompany = hosted ? options.find((company) => company.id === selection.companyId) ?? null : options.find((company) => company.id === (modelValue == null ? void 0 : modelValue.id)) ?? modelValue ?? null;
    useEffect(() => {
      if (!hosted || !controller || !menuActive) return;
      const error = store.loadErrors.authorizations;
      controller.validateCompanies(
        effectiveMenu,
        options.map((company) => company.id),
        companyLoading ? "loading" : error ? "error" : "ready",
        error ? "Unable to load company access." : null
      );
    }, [hosted, controller, effectiveMenu, menuActive, options, companyLoading, store, version, selection.revision]);
    useEffect(() => {
      if (!hosted || lastNotified.current === selectedCompany) return;
      lastNotified.current = selectedCompany;
      const change = { value: selectedCompany, label: (selectedCompany == null ? void 0 : selectedCompany.name) ?? "" };
      onChange == null ? void 0 : onChange(change);
      onChanged == null ? void 0 : onChanged(change);
    }, [hosted, selectedCompany, onChange, onChanged]);
    const handleChange = (change) => {
      var _a;
      if (hosted && (companyLoading || !menuActive || !(controller == null ? void 0 : controller.setCompany(((_a = change.value) == null ? void 0 : _a.id) ?? null)))) return;
      lastNotified.current = change.value;
      if (!controlled) setInternalValue(change.value);
      onChange == null ? void 0 : onChange(change);
      onChanged == null ? void 0 : onChanged(change);
      onOptionSelected == null ? void 0 : onOptionSelected(change);
    };
    return /* @__PURE__ */ jsx("i-select-company", { class: className, children: /* @__PURE__ */ jsx(
      ISelect,
      {
        ...selectProps,
        ref,
        loading: companyLoading,
        disabled: selectProps.disabled || hosted && companyLoading,
        displayWith,
        filterPredicate,
        options,
        value: selectedCompany,
        onChange: handleChange
      }
    ) });
  }
);
var IFCSelectCompany = forwardRef(function IFCSelectCompany2({
  label = "",
  menuCode,
  stateScope,
  loading,
  placeholder,
  emptyState,
  displayWith,
  filterDelay,
  filterMinLength,
  filterPredicate,
  panelPosition,
  panelOffset,
  portalToBody,
  matchTriggerWidth,
  renderOption,
  iSelectOption,
  value,
  defaultValue,
  onChange,
  onChanged,
  onOptionSelected,
  errors = null,
  errorMessage,
  submitted,
  touched,
  dirty,
  disabled = false,
  invalid = false,
  className,
  ...hostProps
}, ref) {
  const innerSelectRef = useRef(null);
  const focus = useCallback(() => {
    var _a;
    if (!disabled) (_a = innerSelectRef.current) == null ? void 0 : _a.focus();
  }, [disabled]);
  useImperativeHandle(ref, () => ({ focus }), [focus]);
  const controlInvalid = !!errors && Object.keys(errors).length > 0 && (submitted !== void 0 ? !!submitted : !!touched || !!dirty);
  const required = isControlRequired({
    errors: errors ?? void 0,
    errorMessage
  });
  const errorText = resolveControlErrorMessage({
    errors: errors ?? void 0,
    label,
    errorMessage
  });
  return /* @__PURE__ */ jsxs("i-fc-select-company", { ...hostProps, class: className, children: [
    label ? /* @__PURE__ */ jsxs("label", { className: "i-fc-select__label", onClick: focus, children: [
      label,
      " :",
      required ? /* @__PURE__ */ jsx("span", { className: "i-fc-select__required", children: "*" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(
      ISelectCompany,
      {
        ref: innerSelectRef,
        menuCode,
        stateScope,
        loading,
        placeholder,
        emptyState,
        displayWith,
        filterDelay,
        filterMinLength,
        filterPredicate,
        panelPosition,
        panelOffset,
        portalToBody,
        matchTriggerWidth,
        renderOption,
        iSelectOption,
        value,
        defaultValue,
        disabled,
        invalid: invalid || controlInvalid,
        onChange,
        onChanged,
        onOptionSelected
      }
    ),
    controlInvalid && errorText ? /* @__PURE__ */ jsx("div", { className: "i-fc-select__error", children: errorText }) : null
  ] });
});
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
    children: children2,
    className,
    ...rest
  } = props;
  const inputRef = useRef(null);
  const isControlled = checked != null;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const currentChecked = isControlled ? !!checked : uncontrolledChecked;
  const hostClassName = useMemo(() => {
    return [
      "i-toggle",
      currentChecked ? "i-toggle__active" : null,
      disabled ? "i-toggle__disabled" : null,
      labelPosition === "left" ? "i-toggle__label-left" : null,
      className ?? null
    ].filter(Boolean).join(" ");
  }, [currentChecked, disabled, labelPosition, className]);
  const sizeStyle = useMemo(() => {
    if (size === "md") return void 0;
    const designToken = `var(--i-size-${size})`;
    return {
      "--i-toggle-height": designToken,
      "--i-toggle-width": `calc(${designToken} * 1.75)`,
      "--i-toggle-handle-size": `calc(${designToken} - (var(--i-toggle-padding) * 2))`
    };
  }, [size]);
  const emitChange = useCallback(
    (next) => {
      if (!isControlled) setUncontrolledChecked(next);
      onChange == null ? void 0 : onChange(next);
    },
    [isControlled, onChange]
  );
  const handleNativeChange = useCallback(
    (e) => {
      if (disabled) return;
      emitChange(!!e.target.checked);
    },
    [disabled, emitChange]
  );
  const handleBlur = useCallback(() => {
    onTouched == null ? void 0 : onTouched();
  }, [onTouched]);
  const handleHostClick = useCallback(
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
  return /* @__PURE__ */ jsxs(
    "i-toggle",
    {
      ...rest,
      class: hostClassName,
      size,
      style: sizeStyle,
      onClick: handleHostClick,
      children: [
        /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx("span", { className: "i-toggle__thumb" }),
        /* @__PURE__ */ jsx("span", { className: "i-toggle__label", children: children2 })
      ]
    }
  );
}

// src/components/api/api-error.ts
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var readString = (value, key) => {
  const candidate = value[key];
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : void 0;
};
var readNumber2 = (value, key) => {
  const candidate = value[key];
  return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : void 0;
};
function normalizeApiError(error) {
  const transport = isRecord2(error) ? error : {};
  const nestedBody = isRecord2(transport.error) ? transport.error : void 0;
  const body = nestedBody ?? transport;
  return {
    ...body,
    status: readNumber2(transport, "status") ?? readNumber2(body, "status"),
    errorCode: readString(body, "errorCode") ?? readString(body, "code") ?? readString(transport, "errorCode") ?? readString(transport, "code"),
    code: readString(body, "code") ?? readString(transport, "code"),
    message: readString(body, "message") ?? readString(body, "Message"),
    revision: readNumber2(body, "revision") ?? readNumber2(transport, "revision"),
    detail: readString(body, "detail"),
    title: readString(body, "title"),
    retryAfter: readNumber2(body, "retryAfter") ?? readNumber2(transport, "retryAfter")
  };
}
function formatApiFieldErrors(error) {
  const fields = error.errors ?? error.ModelState;
  if (!isRecord2(fields)) return void 0;
  const parts = Object.entries(fields).flatMap(([field, value]) => {
    const messages = (Array.isArray(value) ? value : [value]).filter(
      (item) => typeof item === "string" && item.trim().length > 0
    );
    return messages.length ? [`${field.replace(/^model\./i, "")}: ${messages.join(", ")}`] : [];
  });
  return parts.length ? parts.join("; ") : void 0;
}
function resolveApiErrorDisplayMessage(error, localFallback, catalogResolver, formatter) {
  const normalized = normalizeApiError(error);
  try {
    const formatted = formatter == null ? void 0 : formatter(normalized);
    if (formatted == null ? void 0 : formatted.trim()) return formatted;
  } catch {
  }
  const validation = formatApiFieldErrors(normalized);
  if (validation) return validation;
  if (normalized.message) return normalized.message;
  if (catalogResolver && normalized.errorCode) {
    try {
      const catalogMessage = catalogResolver(
        normalized.errorCode,
        normalized.revision,
        normalized
      );
      if (catalogMessage == null ? void 0 : catalogMessage.trim()) return catalogMessage;
    } catch {
    }
  }
  return normalized.detail ?? normalized.title ?? localFallback;
}

// src/components/environments/environment.ts
var environment = {
  production: false,
  releaseStage: "development",
  appName: "Insight UI",
  version: "1.0.2",
  api: {
    identity: "",
    user: "https://account-dev.paramountenterprise.co.id/api/v1/users",
    configuration: "https://account-dev.paramountenterprise.co.id/api/v1",
    application: "https://account-dev.paramountenterprise.co.id/api/v1/applications"
  },
  signinUrl: "",
  tokenLifespan: {
    accessTokenSeconds: 3600,
    refreshTokenSeconds: 7200,
    ssoSessionMaxSeconds: 54e3
  },
  csrfTokenMaxAgeSeconds: 7170
};

// src/components/auth/auth-config.ts
function getDefaultIAuthEndpoints() {
  return {
    csrf: "/auth/csrf",
    impersonationEnd: "/auth/impersonation/end",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    exchange: "/auth/exchange"
  };
}
function getDefaultIAuthConfig() {
  return {
    api: {
      identity: "",
      // no default identity host - the consumer app supplies its own
      user: environment.api.user,
      configuration: environment.api.configuration,
      application: environment.api.application
    },
    signinUrl: "",
    // no default sign-in page - the consumer app supplies its own
    callbackPath: "/auth/callback",
    allowedReturnOrigins: [window.location.origin],
    tokenLifespan: { ...environment.tokenLifespan },
    csrfTokenMaxAgeSeconds: environment.csrfTokenMaxAgeSeconds,
    endpoints: { ...getDefaultIAuthEndpoints() },
    apiKey: environment.apiKey,
    appId: environment.appId,
    unauthorizedHandling: "dialog"
  };
}
function resolveIAuthConfig(overrides) {
  const defaults = getDefaultIAuthConfig();
  return {
    ...defaults,
    ...overrides,
    api: { ...defaults.api, ...overrides == null ? void 0 : overrides.api },
    tokenLifespan: { ...defaults.tokenLifespan, ...overrides == null ? void 0 : overrides.tokenLifespan },
    endpoints: { ...defaults.endpoints, ...overrides == null ? void 0 : overrides.endpoints }
  };
}
function requireIdentityHost(config) {
  if (!config.api.identity) {
    throw new Error(
      `[@insight/ui-react] api.identity is not configured. Point it at this app's own auth host/BFF (e.g. <IAuthProvider config={{ api: { identity: "https://<your-app>/api" }, signinUrl: "..." }} />).`
    );
  }
  return config.api.identity;
}
function getAuthEndpointPath(config, key) {
  var _a;
  return ((_a = config.endpoints) == null ? void 0 : _a[key]) ?? getDefaultIAuthEndpoints()[key] ?? "";
}
function getAuthEndpointUrl(config, key) {
  return `${requireIdentityHost(config)}${getAuthEndpointPath(config, key)}`;
}
function validateIAuthConfig(config) {
  if (!config.api.identity) {
    throw new Error(
      "[@insight/ui-react] IAuthProvider requires api.identity - the base URL of this app's own auth host/BFF. The library no longer defaults to a shared identity provider."
    );
  }
  if (!config.signinUrl) {
    throw new Error(
      "[@insight/ui-react] IAuthProvider requires signinUrl - the full URL of this app's sign-in page / BFF login route."
    );
  }
}

// src/components/session-expired/session-expired.ts
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
    case "IMPERSONATION_SESSION_INVALID":
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
var ISessionExpiredService = class {
  visibleValue = false;
  returnUrlValue = "/";
  reasonValue = void 0;
  errorCodeValue = null;
  detailValue = null;
  messageValue = null;
  apiErrorValue = null;
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
  get message() {
    return this.messageValue;
  }
  get apiError() {
    return this.apiErrorValue;
  }
  show(returnUrl, reason, errorCode, detail, message, apiError) {
    this.returnUrlValue = returnUrl || "/";
    this.reasonValue = reason;
    this.errorCodeValue = errorCode ?? null;
    this.detailValue = detail ?? null;
    this.messageValue = message ?? null;
    this.apiErrorValue = apiError ?? null;
    this.visibleValue = true;
    this.notify();
  }
  dispose() {
    this.visibleValue = false;
    this.apiErrorValue = null;
    this.listeners.clear();
  }
  hide() {
    this.visibleValue = false;
    this.notify();
  }
};
var sessionExpiredService = new ISessionExpiredService();

// src/components/api/request-scope.ts
function requestCancellation(kind) {
  return normalizeApiError({
    status: 0,
    name: kind === "timeout" ? "TimeoutError" : "AbortError",
    errorCode: kind === "timeout" ? "REQUEST_TIMEOUT" : "REQUEST_ABORTED",
    message: kind === "timeout" ? "Request timed out" : "Request aborted"
  });
}
function createRequestScope(timeoutMs = 6e4, signals = []) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("timeoutMs must be a positive finite number.");
  }
  const controller = new AbortController();
  const abort = () => controller.abort(requestCancellation("abort"));
  const timer = setTimeout(
    () => controller.abort(requestCancellation("timeout")),
    timeoutMs
  );
  for (const signal of signals) {
    if (signal == null ? void 0 : signal.aborted) abort();
    else signal == null ? void 0 : signal.addEventListener("abort", abort, { once: true });
  }
  return {
    signal: controller.signal,
    dispose() {
      clearTimeout(timer);
      signals.forEach((signal) => signal == null ? void 0 : signal.removeEventListener("abort", abort));
    }
  };
}
function waitForRequest(promise, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      signal.removeEventListener("abort", abort);
      reject(signal.reason ?? requestCancellation("abort"));
    };
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}

// src/components/api/api.client.ts
async function normalizeFetchError(res, body) {
  const value = res.headers.get("Retry-After");
  const retryAfter = (value == null ? void 0 : value.trim()) ? Number(value) : NaN;
  const fields = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  return normalizeApiError({
    status: res.status,
    error: {
      ...fields,
      detail: fields.detail ?? (Object.keys(fields).length ? void 0 : res.statusText || "Request failed"),
      retryAfter: typeof fields.retryAfter === "number" ? fields.retryAfter : Number.isFinite(retryAfter) ? retryAfter : void 0
    }
  });
}
async function readJson(res) {
  const text2 = await res.text();
  if (!text2) return void 0;
  try {
    return JSON.parse(text2);
  } catch {
    return text2;
  }
}
async function sendRequest(baseUrl, path, csrf, options) {
  const method = options.method ?? "GET";
  const hasBody = options.body !== void 0 && method !== "GET";
  const form = typeof FormData !== "undefined" && options.body instanceof FormData;
  const binary = typeof Blob !== "undefined" && options.body instanceof Blob || options.body instanceof ArrayBuffer || ArrayBuffer.isView(options.body);
  const headers = new Headers({
    Accept: "application/json",
    ...options.headers
  });
  if (form) headers.delete("Content-Type");
  else if (hasBody && !binary && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const csrfToken = csrf == null ? void 0 : csrf.getToken();
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  const res = await fetch(buildUrl2(baseUrl, path, options.params), {
    method,
    credentials: "include",
    headers,
    signal: options.signal,
    body: hasBody ? form || binary ? options.body : JSON.stringify(options.body) : void 0
  });
  if (!res.ok) throw await normalizeFetchError(res, await readJson(res));
  switch (options.responseType) {
    case "response":
      return res;
    case "blob":
      return res.blob();
    case "arraybuffer":
      return res.arrayBuffer();
    case "text":
      return res.text();
    default:
      return readJson(res);
  }
}
async function rawRequest(baseUrl, path, csrf, options = {}) {
  const scope = createRequestScope(options.timeoutMs, [options.signal]);
  try {
    scope.signal.throwIfAborted();
    return await waitForRequest(
      sendRequest(baseUrl, path, csrf, { ...options, signal: scope.signal }),
      scope.signal
    );
  } catch (error) {
    if (scope.signal.aborted) throw scope.signal.reason;
    if (typeof (error == null ? void 0 : error.status) === "number") throw error;
    throw normalizeApiError({
      status: 0,
      errorCode: "NETWORK_ERROR",
      message: "Network error"
    });
  } finally {
    scope.dispose();
  }
}
function buildUrl2(baseUrl, path, params) {
  let url = `${baseUrl}${path}`;
  if (params) {
    const query = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== void 0).map(([key, value]) => [key, String(value)])
    ).toString();
    if (query) url += `${url.includes("?") ? "&" : "?"}${query}`;
  }
  return url;
}
function createApiClient(deps) {
  const base = requireIdentityHost(deps.config);
  const isAuthPath = (url) => [
    "csrf",
    "refresh",
    "login",
    "logout",
    "exchange",
    "impersonationEnd"
  ].some((key) => url.split("?")[0] === getAuthEndpointUrl(deps.config, key));
  const requireSession = () => {
    var _a, _b;
    if ((_b = (_a = deps.session).isLoggedOut) == null ? void 0 : _b.call(_a))
      throw normalizeApiError({
        status: 401,
        errorCode: "AUTH_NO_SESSION",
        message: "Authentication required."
      });
  };
  async function doRequest(path, method, body, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    (_a = deps.assertActive) == null ? void 0 : _a.call(deps);
    const baseUrl = options.apiUrl ?? base;
    const skipAuth = options.skipBearer === true || isAuthPath(buildUrl2(baseUrl, path));
    if (!skipAuth) requireSession();
    const scope = createRequestScope(options.timeoutMs, [
      options.signal,
      deps.signal,
      skipAuth ? void 0 : (_c = (_b = deps.session).getRequestSignal) == null ? void 0 : _c.call(_b)
    ]);
    let expiryReported = false;
    try {
      scope.signal.throwIfAborted();
      if (!skipAuth && deps.initialize)
        await waitForRequest(deps.initialize(), scope.signal);
      (_d = deps.assertActive) == null ? void 0 : _d.call(deps);
      if (!skipAuth) requireSession();
      const headers = new Headers(options.headers);
      const explicitAuthorization = headers.has("Authorization");
      if (deps.config.apiKey) headers.set("Api-Key", deps.config.apiKey);
      const token = deps.session.getAccessToken();
      if (!skipAuth && token && !explicitAuthorization)
        headers.set("Authorization", `Bearer ${token}`);
      const send = () => waitForRequest(
        sendRequest(baseUrl, path, deps.csrf, {
          ...options,
          method,
          body,
          headers: Object.fromEntries(headers.entries()),
          signal: scope.signal
        }),
        scope.signal
      );
      try {
        return await send();
      } catch (error) {
        if (!scope.signal.aborted && (error == null ? void 0 : error.status) === 401 && (extractProblemDetailsErrorCode(error) === "IMPERSONATION_SESSION_INVALID" || buildUrl2(baseUrl, path).split("?")[0] === getAuthEndpointUrl(deps.config, "impersonationEnd"))) {
          expiryReported = true;
          (_e = deps.onSessionExpired) == null ? void 0 : _e.call(deps, error);
          throw error;
        }
        if (skipAuth || (error == null ? void 0 : error.status) !== 401 || scope.signal.aborted)
          throw error;
      }
      let refreshed;
      try {
        refreshed = await waitForRequest(
          deps.session.refreshToken(),
          scope.signal
        );
      } catch (error) {
        if (!scope.signal.aborted && (error == null ? void 0 : error.name) !== "AbortError" && (error == null ? void 0 : error.name) !== "TimeoutError") {
          expiryReported = true;
          (_f = deps.onSessionExpired) == null ? void 0 : _f.call(deps, error);
        }
        throw error;
      }
      if (!explicitAuthorization)
        headers.set("Authorization", `Bearer ${refreshed}`);
      try {
        return await send();
      } catch (error) {
        if (!scope.signal.aborted && (error == null ? void 0 : error.status) === 401) {
          expiryReported = true;
          (_g = deps.onSessionExpired) == null ? void 0 : _g.call(deps, error);
        }
        throw error;
      }
    } catch (error) {
      if (scope.signal.aborted && !expiryReported) throw scope.signal.reason;
      if (typeof (error == null ? void 0 : error.status) === "number") throw error;
      throw normalizeApiError({
        status: 0,
        errorCode: "NETWORK_ERROR",
        message: "Network error"
      });
    } finally {
      scope.dispose();
    }
  }
  return {
    get: ((path, options) => doRequest(path, "GET", void 0, options)),
    post: ((path, body, options) => doRequest(path, "POST", body, options)),
    put: ((path, body, options) => doRequest(path, "PUT", body, options)),
    patch: ((path, body, options) => doRequest(path, "PATCH", body, options)),
    delete: ((path, options) => doRequest(path, "DELETE", options == null ? void 0 : options.body, options))
  };
}

// src/components/api/error-codes.ts
var USER_APPLICATION_MAPPING_NOT_FOUND = "USER_APPLICATION_MAPPING_NOT_FOUND";

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

// src/components/auth/auth.ts
var MAX_LOGIN_ATTEMPTS = 5;
var LOCKOUT_DURATION_MS = 1 * 60 * 1e3;
var IDLE_RESET_MS = 12 * 60 * 60 * 1e3;
var LOCK_STORAGE_KEY = "iam.mock.login_lockout";
var IAuthService = class {
  config;
  csrf;
  signal;
  constructor(config, csrf, signal) {
    this.config = config;
    this.csrf = csrf;
    this.signal = signal;
  }
  request(path, options) {
    const scope = createRequestScope(options.timeoutMs, [
      this.signal,
      options.signal
    ]);
    return rawRequest(this.identityUrl, path, this.csrf, {
      ...options,
      signal: scope.signal
    }).finally(() => scope.dispose());
  }
  get identityUrl() {
    return requireIdentityHost(this.config);
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
      const res = await this.request(
        getAuthEndpointPath(this.config, "login"),
        {
          method: "POST",
          body: {
            username,
            password,
            recaptchaToken,
            isChallengeResponse: isChallengeResponse ?? false
          }
        }
      );
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
  endImpersonation(signal) {
    return this.request(getAuthEndpointPath(this.config, "impersonationEnd"), {
      method: "POST",
      body: {},
      signal
    });
  }
  /** Silently refresh the access token via the HttpOnly session cookie. */
  refresh(options = {}) {
    return this.request(
      getAuthEndpointPath(this.config, "refresh"),
      {
        method: "POST",
        body: {},
        ...options
      }
    );
  }
  /** Clear the server-side session and expire the HttpOnly session cookie. */
  async logout(refreshToken) {
    await this.request(
      getAuthEndpointPath(this.config, "logout"),
      {
        method: "POST",
        body: { refreshToken }
      }
    );
  }
  /** Exchange a short-lived `at=` auth token for a full session (cross-app handoff). */
  exchangeAuthToken(authToken) {
    return this.request(
      getAuthEndpointPath(this.config, "exchange"),
      {
        method: "POST",
        body: {},
        headers: { Authorization: authToken }
      }
    );
  }
  /** Verify the MFA TOTP code during a login challenge. */
  verifyMfaChallenge(mfaSessionId, totpCode) {
    return this.request("/auth/mfa/verify", {
      method: "POST",
      body: { mfaSessionId, totpCode }
    });
  }
  /** Verify the TOTP code during first-time MFA enrollment (forced at login). */
  verifyMfaEnroll(mfaSessionId, totpCode) {
    return this.request("/auth/mfa/enroll/verify", {
      method: "POST",
      body: { mfaSessionId, totpCode }
    });
  }
  /** Self-service MFA — check enrollment status (`GET /profile/mfa`). */
  selfServiceGetStatus() {
    return this.request("/profile/mfa", { method: "GET" });
  }
  /** Self-service MFA — initiate enrollment to get the QR & session id (`POST /profile/mfa/enroll`). */
  selfServiceEnrollInitiate() {
    return this.request("/profile/mfa/enroll", { method: "POST", body: {} });
  }
  /** Self-service MFA — verify OTP and complete enrollment (`POST /profile/mfa/enroll/verify`). */
  async selfServiceEnrollVerify(enrollmentSessionId, totpCode) {
    await this.request("/profile/mfa/enroll/verify", {
      method: "POST",
      body: { enrollmentSessionId, totpCode }
    });
  }
  /** Self-service reset (un-enroll) MFA for the current user — requires password (`DELETE /profile/mfa`). */
  async selfServiceResetMfa(userSub, password) {
    await this.request("/profile/mfa", {
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
    return this.request("/auth/change-password", {
      method: "POST",
      body: { newPassword, confirmPassword },
      headers: { Authorization: `Bearer ${changePasswordToken}` }
    });
  }
  /** Request a password-reset link via email or WhatsApp (`POST /auth/forgot-password`). */
  forgotPassword(identifier, mode) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: { identifier, method: mode }
    });
  }
  /** Validate a reset token before showing the reset form (`GET /auth/reset-password/validate`). */
  validateResetToken(token) {
    return this.request(
      "/auth/reset-password/validate",
      {
        method: "GET",
        params: { token }
      }
    );
  }
  /** Submit a new password using the reset token (`POST /auth/reset-password`). */
  resetPassword(token, newPassword, confirmPassword) {
    return this.request("/auth/reset-password", {
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
    sessionStorage.setItem(
      `${LOCK_STORAGE_KEY}_${username}`,
      JSON.stringify(data)
    );
  }
  resetLockout(username) {
    sessionStorage.removeItem(`${LOCK_STORAGE_KEY}_${username}`);
  }
};

// src/components/auth/session-return-url.ts
function getSessionReturnUrl(path = window.location.pathname + window.location.search + window.location.hash) {
  const hashIndex = path.indexOf("#");
  if (hashIndex >= 0) {
    const fragment = path.slice(hashIndex + 1);
    if (new URLSearchParams(fragment).has("at")) {
      const remaining = fragment.split("&").filter((part) => !new URLSearchParams(part).has("at")).join("&");
      path = path.slice(0, hashIndex) + (remaining ? `#${remaining}` : "");
    }
  }
  return path.startsWith("/") ? path : `/${path}`;
}
function toRouterReturnUrl(returnUrl, basename, origin = window.location.origin) {
  if (returnUrl.startsWith("//") || !returnUrl.startsWith("/") && !/^https?:\/\//i.test(returnUrl))
    return "/";
  try {
    const target = new URL(returnUrl, origin);
    if (target.origin !== origin) return "/";
    const basePath = new URL(basename, origin).pathname.replace(/\/$/, "");
    const pathname = target.pathname === basePath ? "/" : basePath && target.pathname.startsWith(`${basePath}/`) ? target.pathname.slice(basePath.length) : target.pathname;
    return getSessionReturnUrl(pathname + target.search + target.hash);
  } catch {
    return "/";
  }
}

// src/components/auth/auth-callback.tsx
function extractAccessTokenFromHash(hash) {
  const current = hash ?? window.location.hash;
  if (!current || current.length < 2) {
    return null;
  }
  const params = new URLSearchParams(current.substring(1));
  return params.get("at");
}
function IAuthCallback() {
  const { config, session, sessionExpired } = useIAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const handled = useRef(false);
  const basename = useHref("/");
  const rawReturnUrl = new URLSearchParams(location.search).get("returnUrl") || "/";
  const sanitized = sanitizeReturnUrl(
    rawReturnUrl,
    config.allowedReturnOrigins
  );
  const isExternal = sanitized.isExternal && new URL(sanitized.returnUrl).origin !== window.location.origin;
  const returnUrl = isExternal ? sanitized.returnUrl : toRouterReturnUrl(sanitized.returnUrl, basename);
  const callbackPath = toRouterReturnUrl(
    config.callbackPath ?? "/auth/callback",
    basename
  ).split(/[?#]/)[0].replace(/\/+$/, "");
  const destinationPath = returnUrl.split(/[?#]/)[0].replace(/\/+$/, "");
  const safeReturnUrl = !isExternal && (destinationPath === callbackPath || destinationPath.startsWith(`${callbackPath}/`)) ? "/" : returnUrl;
  const destinationHref = useHref(isExternal ? "/" : safeReturnUrl);
  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const accessToken = extractAccessTokenFromHash(location.hash);
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    if (!accessToken && !session.isAuth()) {
      sessionExpired.show(
        isExternal ? safeReturnUrl : getSessionReturnUrl(destinationHref),
        "TOKEN_EXPIRED",
        "AUTH_NO_SESSION"
      );
      return;
    }
    if (accessToken) session.setAccessToken(accessToken);
    if (isExternal) {
      window.location.href = safeReturnUrl;
    } else {
      void navigate(safeReturnUrl, { replace: true });
    }
  }, [
    session,
    sessionExpired,
    navigate,
    location.hash,
    isExternal,
    safeReturnUrl,
    destinationHref
  ]);
  return null;
}

// src/components/csrf/csrf.ts
var ICsrfService = class {
  token = null;
  tokenFetchedAt = null;
  inFlight = null;
  controller = new AbortController();
  disposed = false;
  config;
  signal;
  constructor(config, signal) {
    this.config = config;
    this.signal = signal;
  }
  getToken() {
    return this.isTokenExpired() ? null : this.token;
  }
  isTokenExpired() {
    return this.tokenFetchedAt !== null && Date.now() - this.tokenFetchedAt >= (this.config.csrfTokenMaxAgeSeconds ?? 7170) * 1e3;
  }
  /** Share the current token bootstrap and retain tokens only for this application. */
  ensureToken() {
    var _a, _b;
    if (this.disposed)
      return Promise.reject(new Error("CSRF service is disposed."));
    if ((_a = this.signal) == null ? void 0 : _a.aborted) return Promise.reject(this.signal.reason);
    if (this.inFlight) return this.inFlight;
    const controller = this.controller;
    const abort = () => controller.abort();
    (_b = this.signal) == null ? void 0 : _b.addEventListener("abort", abort, { once: true });
    const pending = rawRequest(
      getAuthEndpointUrl(this.config, "csrf"),
      "",
      null,
      {
        signal: controller.signal
      }
    ).then((body) => {
      if (controller.signal.aborted || this.controller !== controller) return;
      this.token = (body == null ? void 0 : body.csrfToken) ?? null;
      this.tokenFetchedAt = Date.now();
    }).finally(() => {
      var _a2;
      (_a2 = this.signal) == null ? void 0 : _a2.removeEventListener("abort", abort);
      if (this.inFlight === pending) this.inFlight = null;
    });
    this.inFlight = pending;
    return pending;
  }
  clear() {
    this.controller.abort();
    this.controller = new AbortController();
    this.inFlight = null;
    this.token = null;
    this.tokenFetchedAt = null;
  }
  dispose() {
    this.clear();
    this.disposed = true;
  }
};

// src/components/impersonation/impersonation-utils.ts
var IMPERSONATION_INFORMATION = "To end only this session (the grant stays active), log out normally from the application. The End Impersonate Session button ends the session and revokes the grant.";
var IMPERSONATION_CONFIRMATION = "End this impersonation session and revoke your impersonation grant? You will be signed out and cannot start another session with this grant.";
var COUNTDOWN_THRESHOLD_MS = 24 * 60 * 60 * 1e3;
var MAX_TIMER_DELAY_MS = 2147483647;
function readImpersonationClaims(token) {
  try {
    const segment = token == null ? void 0 : token.split(".")[1];
    if (!segment) return {};
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
      (c) => c.charCodeAt(0)
    );
    const value = JSON.parse(new TextDecoder().decode(bytes));
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
function record(value) {
  return value && typeof value === "object" ? value : {};
}
function text(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readImpersonationActor(token) {
  const sub = text(record(readImpersonationClaims(token)["act"])["sub"]);
  return sub ? { sub } : null;
}
function impersonationContextKey(token) {
  if (!token) return "";
  const claims = readImpersonationClaims(token);
  return JSON.stringify([
    claims["sub"] ?? "",
    record(claims["act"])["sub"] ?? "",
    claims["sid"] ?? "",
    claims["imp_grant_id"] ?? ""
  ]);
}
function actorDisplayNameFromToken(token) {
  if (!readImpersonationActor(token)) return "-";
  const act = record(readImpersonationClaims(token)["act"]);
  return text(act["name"]) ?? text(act["preferred_username"]) ?? text(act["sub"]) ?? "-";
}
function normalizeImpersonationStatus(value, source) {
  const data = record(value);
  if (source === "bff") {
    const actor = record(data["actor"]);
    const grant = record(data["impersonation"]);
    return {
      mode: text(actor["sub"]) && text(grant["grantId"]) ? "IMPERSONATING" : "NONE",
      actorName: text(actor["name"]),
      subjectName: text(record(data["user"])["name"]),
      grantId: text(grant["grantId"]),
      endAt: text(grant["endAt"])
    };
  }
  return {
    mode: data["mode"] === "IMPERSONATING" ? "IMPERSONATING" : data["mode"] === "HAS_ACTIVE_GRANT" ? "HAS_ACTIVE_GRANT" : "NONE",
    actorName: text(record(data["impersonatingUser"])["fullName"]),
    subjectName: text(record(data["impersonatedUser"])["fullName"]),
    occupation: text(record(data["impersonatedUser"])["jabatan"]),
    grantId: text(data["grantId"]),
    endDate: text(data["endDate"]),
    endAt: text(data["endAt"])
  };
}
function resolveGrantEnd(endAt, endDate) {
  for (const value of [
    endAt,
    endDate ? endDate.slice(0, 10) + "T23:59:59.999+07:00" : null
  ]) {
    if (!value) continue;
    const time = new Date(value).getTime();
    if (Number.isFinite(time)) return time;
  }
  return null;
}
function grantEndLabel(status) {
  var _a;
  let day = (_a = status == null ? void 0 : status.endDate) == null ? void 0 : _a.slice(0, 10);
  if (!day && (status == null ? void 0 : status.endAt)) {
    const instant = new Date(status.endAt).getTime();
    if (Number.isFinite(instant))
      day = new Date(instant + 7 * 60 * 60 * 1e3).toISOString().slice(0, 10);
  }
  if (!day) return "-";
  const date = /* @__PURE__ */ new Date(day + "T00:00:00");
  if (!Number.isFinite(date.getTime())) return "-";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return String(date.getDate()).padStart(2, "0") + " " + months[date.getMonth()] + " " + date.getFullYear();
}
function formatCountdown(remainingMs) {
  const seconds = Math.max(0, Math.floor(remainingMs / 1e3));
  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds % 3600 / 60),
    seconds % 60
  ].map((n) => String(n).padStart(2, "0")).join(":");
}
function resolveImpersonationRedirect(result, identity, signinUrl) {
  try {
    if (result == null ? void 0 : result.redirectTo) {
      const host = new URL(identity, window.location.origin);
      const target = new URL(result.redirectTo, host.origin);
      if (["http:", "https:"].includes(target.protocol) && target.origin === host.origin && !target.username && !target.password)
        return target.href;
    }
  } catch {
  }
  return signinUrl;
}
function isImpersonationCsrfError(error) {
  const data = record(error);
  const body = record(data["error"]);
  const code = text(data["errorCode"]) ?? text(data["code"]) ?? text(body["errorCode"]) ?? text(body["code"]);
  const message = text(data["message"]) ?? text(body["message"]) ?? text(data["detail"]) ?? "";
  return data["status"] === 403 && (((code == null ? void 0 : code.toUpperCase().includes("CSRF")) ?? false) || /csrf/i.test(message));
}

// src/components/impersonation/impersonation-state.ts
var IImpersonationStateService = class {
  value = null;
  key = "";
  version = 0;
  requestVersion = 0;
  disposed = false;
  pending = null;
  controller = null;
  listeners = /* @__PURE__ */ new Set();
  unsubscribe;
  config;
  session;
  api;
  constructor(config, session, api) {
    this.config = config;
    this.session = session;
    this.api = api;
    this.key = impersonationContextKey(session.getAccessToken());
    this.unsubscribe = session.subscribe(() => {
      const key = impersonationContextKey(session.getAccessToken());
      if (key !== this.key) {
        this.key = key;
        this.clear();
      }
    });
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = () => this.version;
  get status() {
    return this.value;
  }
  actor() {
    return this.session.actor();
  }
  isImpersonating() {
    return this.session.isImpersonating();
  }
  clear() {
    var _a;
    this.requestVersion++;
    (_a = this.controller) == null ? void 0 : _a.abort();
    this.controller = null;
    this.pending = null;
    this.value = null;
    this.version++;
    this.listeners.forEach((listener) => listener());
  }
  loadStatus() {
    var _a;
    if (this.disposed) return Promise.reject(requestCancellation("abort"));
    if (!this.isImpersonating()) return Promise.resolve({ mode: "NONE" });
    if (this.value) return Promise.resolve(this.value);
    if (this.pending) return this.pending;
    const version = this.requestVersion;
    const key = this.key;
    const controller = this.controller = new AbortController();
    const source = ((_a = this.config.impersonation) == null ? void 0 : _a.source) ?? "iam-user";
    const base = source === "bff" ? this.config.api.identity : this.config.api["user"];
    if (!base)
      return Promise.reject(
        new Error("Impersonation status requires api.user.")
      );
    const result = this.api.get(source === "bff" ? "/auth/me" : "/me/impersonation", {
      apiUrl: base,
      signal: controller.signal
    }).then((value) => {
      if (this.disposed || version !== this.requestVersion || key !== impersonationContextKey(this.session.getAccessToken()))
        throw requestCancellation("abort");
      this.value = normalizeImpersonationStatus(value, source);
      this.version++;
      this.listeners.forEach((listener) => listener());
      return this.value;
    }).catch((error) => {
      if (this.disposed || version !== this.requestVersion || key !== impersonationContextKey(this.session.getAccessToken()))
        throw requestCancellation("abort");
      throw error;
    }).finally(() => {
      if (this.pending === result) {
        this.pending = null;
        this.controller = null;
      }
    });
    this.pending = result;
    return result;
  }
  dispose() {
    this.disposed = true;
    this.unsubscribe();
    this.clear();
    this.listeners.clear();
  }
};

// src/components/storage/storage.ts
var IStorageService = class {
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
var storageService = new IStorageService();

// src/components/session/session.ts
function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + (4 - base64.length % 4) % 4,
      "="
    );
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
var ISessionService = class {
  config;
  authService;
  csrf;
  sessionExpiredService;
  // Attached by IAuthProvider after the store is constructed (the store needs
  // the session, so a back-reference is set once both exist). Optional because
  // standalone session usage (e.g. tests) has no store.
  userMenuStore = null;
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
  generation = 0;
  refreshController = null;
  requestController = new AbortController();
  loggedOut = false;
  disposed = false;
  version = 0;
  listeners = /* @__PURE__ */ new Set();
  constructor(config, authService, csrf, sessionExpiredService2) {
    this.config = config;
    this.authService = authService;
    this.csrf = csrf;
    this.sessionExpiredService = sessionExpiredService2;
  }
  /** Attach the user-menu store so logout() also drops its cached data. */
  setUserMenuStore(store) {
    this.userMenuStore = store;
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = () => this.version;
  endingImpersonation = null;
  actor() {
    return readImpersonationActor(this.accessToken);
  }
  isImpersonating() {
    return this.actor() !== null;
  }
  endImpersonation() {
    this.assertActive();
    if (this.endingImpersonation) return this.endingImpersonation;
    const generation = this.generation;
    const current = () => !this.disposed && generation === this.generation;
    const signal = this.getRequestSignal();
    const work = async () => {
      try {
        if (!this.csrf.getToken()) await this.csrf.ensureToken();
        let response;
        try {
          response = await this.authService.endImpersonation(signal);
        } catch (error) {
          if (!current() || !isImpersonationCsrfError(error)) throw error;
          await this.csrf.ensureToken();
          response = await this.authService.endImpersonation(signal);
        }
        if (!current()) throw requestCancellation("abort");
        this.loggedOut = true;
        this.clearSession();
        sessionStorage.removeItem(this.storageKey("session.active"));
        new IStorageService().clear();
        return response ?? {};
      } catch (error) {
        if (current() && (error == null ? void 0 : error.status) === 401) {
          this.clearSession();
          if (this.config.onUnauthorized) this.config.onUnauthorized(error);
          else if ((this.config.unauthorizedHandling ?? "dialog") === "dialog") {
            const apiError = normalizeApiError(error);
            const code = extractProblemDetailsErrorCode(apiError);
            this.sessionExpiredService.show(
              getSessionReturnUrl(),
              toSessionExpiredReason(code),
              code,
              apiError.detail,
              apiError.message,
              apiError
            );
          } else
            window.location.href = buildExternalSigninUrl(
              this.config,
              getSessionReturnUrl()
            );
        }
        throw error;
      }
    };
    const result = work().finally(() => {
      if (this.endingImpersonation === result) this.endingImpersonation = null;
    });
    this.endingImpersonation = result;
    return result;
  }
  isLoggedOut = () => this.loggedOut;
  getRequestSignal = () => this.requestController.signal;
  /** Metadata belongs to an application; access tokens remain in memory. */
  storageKey(name) {
    var _a;
    const scope = JSON.stringify([
      ((_a = this.config.api) == null ? void 0 : _a.identity) ?? "",
      this.config.appId ?? ""
    ]);
    return `iam.${encodeURIComponent(scope)}.${name}`;
  }
  invalidatePendingSession() {
    var _a;
    this.generation++;
    this.endingImpersonation = null;
    (_a = this.refreshController) == null ? void 0 : _a.abort(requestCancellation("abort"));
    this.refreshController = null;
    this.refreshInFlight = null;
    this.requestController.abort(requestCancellation("abort"));
    this.requestController = new AbortController();
  }
  assertActive() {
    if (this.disposed) throw new Error("Session service is disposed.");
  }
  dispose() {
    if (this.disposed) return;
    this.clearSession();
    this.disposed = true;
    this.requestController.abort(requestCancellation("abort"));
    this.listeners.clear();
  }
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
    sessionStorage.setItem(this.storageKey("changePasswordToken"), token);
  }
  getChangePasswordToken() {
    if (this.changePasswordTokenValue) {
      return this.changePasswordTokenValue;
    }
    const stored = sessionStorage.getItem(
      this.storageKey("changePasswordToken")
    );
    if (stored) {
      this.changePasswordTokenValue = stored;
      return stored;
    }
    return null;
  }
  clearChangePasswordToken() {
    var _a;
    this.changePasswordTokenValue = null;
    this.initializingValue = false;
    (_a = this.userMenuStore) == null ? void 0 : _a.reset();
    sessionStorage.removeItem(this.storageKey("changePasswordToken"));
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
    var _a;
    this.assertActive();
    this.invalidatePendingSession();
    this.loggedOut = false;
    if (this.accessToken && impersonationContextKey(this.accessToken) !== impersonationContextKey(accessToken))
      (_a = this.userMenuStore) == null ? void 0 : _a.reset();
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
    this.assertActive();
    this.invalidatePendingSession();
    this.loggedOut = false;
    this.writeSession(accessToken, expiresIn, user, refreshToken);
  }
  writeSession(accessToken, expiresIn, user, refreshToken) {
    var _a, _b;
    if (((_a = this.currentUser) == null ? void 0 : _a.sub) && this.currentUser.sub !== user.sub || this.accessToken && impersonationContextKey(this.accessToken) !== impersonationContextKey(accessToken)) {
      (_b = this.userMenuStore) == null ? void 0 : _b.reset();
    }
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
    sessionStorage.setItem(this.storageKey("session.active"), "true");
    this.lastVerifiedAt = Date.now();
    this.initializingValue = false;
    this.notify();
  }
  clearSession() {
    var _a;
    this.invalidatePendingSession();
    this.accessToken = null;
    this._refreshToken = null;
    this.expiresAt = null;
    this.currentUser = null;
    this.passwordExpired = false;
    this.sessionStartedAt = null;
    this.changePasswordTokenValue = null;
    this.initializingValue = false;
    (_a = this.userMenuStore) == null ? void 0 : _a.reset();
    sessionStorage.removeItem(this.storageKey("changePasswordToken"));
    this.notify();
  }
  /**
   * Clears the client-side session AND invalidates the server-side session by
   * revoking the refresh token. Resolves after the server logout call finishes
   * (or fails — failures are swallowed so the user is never stuck on a logout
   * page).
   */
  async logout() {
    this.assertActive();
    const refreshToken = this._refreshToken ?? void 0;
    this.loggedOut = true;
    this.clearSession();
    sessionStorage.removeItem(this.storageKey("session.active"));
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
    this.assertActive();
    if (this.loggedOut)
      return Promise.reject(
        normalizeApiError({
          status: 401,
          errorCode: "AUTH_NO_SESSION",
          message: "Authentication required."
        })
      );
    if (this.refreshInFlight) return this.refreshInFlight;
    const generation = this.generation;
    const controller = new AbortController();
    this.refreshController = controller;
    const timer = setTimeout(
      () => controller.abort(requestCancellation("timeout")),
      3e4
    );
    const pending = waitForRequest(
      this.authService.refresh({ signal: controller.signal }),
      controller.signal
    ).then((res) => {
      if (generation !== this.generation || this.disposed || this.loggedOut)
        throw requestCancellation("abort");
      this.writeSession(
        res.accessToken,
        res.expiresIn,
        this.currentUser ?? decodeUser(res.accessToken),
        res.refreshToken
      );
      return res.accessToken;
    }).finally(() => {
      clearTimeout(timer);
      if (this.refreshInFlight === pending) this.refreshInFlight = null;
      if (this.refreshController === controller)
        this.refreshController = null;
    });
    this.refreshInFlight = pending;
    return pending;
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
    this.assertActive();
    if (this.restoreInFlight) return this.restoreInFlight;
    const pathname = window.location.pathname ?? "";
    const returnUrl = getSessionReturnUrl();
    const isSigninPage = /^\/auth\/signin$|^\/signin$/i.test(pathname);
    const isOtherAuthPage = /^\/auth(\/|$)|^\/forgot-password|^\/reset-password/i.test(pathname) && !isSigninPage;
    if (isOtherAuthPage || this.accessToken || this.loggedOut) {
      this.initializingValue = false;
      this.notify();
      this.restoreInFlight = Promise.resolve({});
      return this.restoreInFlight;
    }
    const generation = this.generation;
    const refresh = this.refreshToken();
    this.restoreInFlight = refresh.then(() => ({})).catch((err) => {
      if (generation !== this.generation || this.disposed || this.loggedOut)
        return {};
      const rawErrorCode = extractProblemDetailsErrorCode(err);
      const reason = toSessionExpiredReason(rawErrorCode);
      const wasActive = sessionStorage.getItem(this.storageKey("session.active")) === "true";
      const isAuthPage = /^\/auth(\/|$)|^\/signin$|^\/logout$/i.test(
        pathname
      );
      if (wasActive && !isAuthPage && isSessionExpiredError(err)) {
        const apiError = normalizeApiError(err);
        this.sessionExpiredService.show(
          returnUrl,
          reason ?? "TOKEN_EXPIRED",
          rawErrorCode,
          apiError.detail,
          apiError.message,
          apiError
        );
      }
      return { reason };
    }).finally(() => {
      if (!this.disposed) {
        this.initializingValue = false;
        this.notify();
      }
    });
    return this.restoreInFlight;
  }
  readExpiresInFromToken(token) {
    const decoded = decodeJwtPayload(token);
    if (!decoded || typeof decoded["exp"] !== "number") {
      return null;
    }
    return Math.max(
      0,
      decoded["exp"] - Math.floor(Date.now() / 1e3)
    );
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
      if (isLeafItem(node) && node.menuCode) {
        codes.add(node.menuCode);
      }
      walk(getMenuChildren(node));
    }
  };
  walk(menus);
  return [...codes];
}
function normalizeRoutePath(route) {
  return route.trim().replace(/^\/+/g, "").replace(/\/+$/g, "");
}
function collectLeafRoutes(menus) {
  const routes = /* @__PURE__ */ new Set();
  const walk = (nodes) => {
    for (const node of nodes) {
      if (isLeafItem(node)) {
        const route = getMenuRoute(node);
        if (route) {
          routes.add(route);
        }
      }
      walk(getMenuChildren(node));
    }
  };
  walk(menus);
  return [...routes];
}
function hasAnyRoute(menus, path) {
  const normalized = normalizeRoutePath(path);
  return collectLeafRoutes(menus).some((route) => normalizeRoutePath(route) === normalized);
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
function collectAuthorizationScope(items) {
  const seenCompanyIds = /* @__PURE__ */ new Set();
  const companyCodes = /* @__PURE__ */ new Set();
  const companies = [];
  const menuCompanySets = /* @__PURE__ */ new Map();
  for (const item of items) {
    const codes = menuCompanySets.get(item.menuCode) ?? /* @__PURE__ */ new Set();
    menuCompanySets.set(item.menuCode, codes);
    for (const company of item.companies) {
      codes.add(company.code);
      companyCodes.add(company.code);
      if (!seenCompanyIds.has(company.id)) {
        seenCompanyIds.add(company.id);
        companies.push({ ...company });
      }
    }
  }
  const compare = new Intl.Collator("id", { sensitivity: "base" }).compare;
  companies.sort((a, b) => compare(a.name, b.name) || compare(a.code, b.code) || compare(a.id, b.id));
  const menuCompanies = {};
  for (const [code, codes] of menuCompanySets) menuCompanies[code] = [...codes];
  return { companies, companyCodes: [...companyCodes], menuCompanies };
}

// src/components/store/user-menu.ts
var IUserMenuStore = class {
  currentUserService;
  menuService;
  session;
  config;
  currentUserValue = null;
  rawCurrentUserValue = null;
  menusValue = [];
  favoritesValue = [];
  rolesValue = [];
  authorizationsValue = [];
  authorizationsLoadingValue = false;
  authorizationRequest = 0;
  initializingValue = false;
  initializedValue = false;
  loadErrorValue = null;
  loadErrorsValue = {
    user: null,
    menus: null,
    favorites: null,
    authorizations: null
  };
  /** Identity (`sub`) whose data is currently cached — invalidated on user switch. */
  loadedUserSub = null;
  loadedApplicationId = null;
  version = 0;
  listeners = /* @__PURE__ */ new Set();
  generation = 0;
  disposed = false;
  constructor(currentUserService, menuService, session, config) {
    this.currentUserService = currentUserService;
    this.menuService = menuService;
    this.session = session;
    this.config = config;
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = () => this.version;
  checkGeneration(generation) {
    if (this.disposed || generation !== this.generation)
      throw requestCancellation("abort");
  }
  dispose() {
    this.reset();
    this.disposed = true;
    this.listeners.clear();
  }
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
  /** Raw effective authorization entries returned by iam-user-api. */
  get authorizations() {
    return this.authorizationsValue;
  }
  /** True while the authorization branch is being refreshed. */
  get authorizationsLoading() {
    return this.authorizationsLoadingValue;
  }
  /** Deduplicated item/function codes from effective authorizations. */
  get menuCodes() {
    return [...new Set(this.authorizationsValue.map((item) => item.menuCode))];
  }
  /** Deduplicated companies from the effective authorization entries. */
  get companies() {
    return collectAuthorizationScope(this.authorizationsValue).companies;
  }
  /** Deduplicated company codes from the effective authorization entries. */
  get companyCodes() {
    return collectAuthorizationScope(this.authorizationsValue).companyCodes;
  }
  /** Company codes grouped by menu code. */
  get menuCompanies() {
    return collectAuthorizationScope(this.authorizationsValue).menuCompanies;
  }
  /** Immutable authorization snapshot used by permission predicates. */
  get authorizationSource() {
    const scope = collectAuthorizationScope(this.authorizationsValue);
    return {
      menuCodes: this.menuCodes,
      roles: this.rolesValue,
      ...scope
    };
  }
  /** True while the cold-start `load()` is in flight. */
  get initializing() {
    return this.initializingValue;
  }
  /** True after the most recent load has settled, including partial failures. */
  get initialized() {
    return this.initializedValue;
  }
  /** First error encountered during `load()`, if any (e.g. `menus: ...`). */
  get loadError() {
    return this.loadErrorValue;
  }
  /** Normalized per-branch errors from the last `load()` — mirrors the service API error contract. */
  get loadErrors() {
    return { ...this.loadErrorsValue };
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
   * Cold-start: fetch user + menus + favorites + authorizations concurrently. A
   * failure in one branch does not block the others; `initializing` clears once
   * all settle. Resolves when the load settles, so callers can await it (e.g.
   * to navigate to `defaultRoute` after login).
   */
  async load(applicationId) {
    var _a;
    this.checkGeneration(this.generation);
    if (this.initializingValue) {
      await this.waitUntilSettled();
      return;
    }
    const sessionSub = ((_a = this.session.getUser()) == null ? void 0 : _a.sub) ?? null;
    const applicationKey = (applicationId == null ? void 0 : applicationId.trim()) || null;
    if (sessionSub !== this.loadedUserSub || this.initializedValue && applicationKey !== this.loadedApplicationId) {
      this.clearData();
    }
    this.loadedUserSub = sessionSub;
    this.loadedApplicationId = applicationKey;
    this.initializingValue = true;
    this.initializedValue = false;
    this.loadErrorValue = null;
    this.loadErrorsValue = {
      user: null,
      menus: null,
      favorites: null,
      authorizations: null
    };
    this.rolesValue = this.session.getRoles();
    this.clearAuthorizationData();
    this.notify();
    const generation = this.generation;
    const record2 = (source, err) => {
      if (generation === this.generation && !this.disposed)
        this.recordError(source, err);
    };
    await Promise.all([
      this.loadUserInternal().catch((err) => record2("user", err)),
      this.loadMenusInternal(applicationId).catch(
        (err) => record2("menus", err)
      ),
      this.loadFavoritesInternal(applicationId).catch(
        (err) => record2("favorites", err)
      ),
      this.loadAuthorizationsInternal(applicationId).catch(
        (err) => record2("authorizations", err)
      )
    ]);
    if (generation !== this.generation || this.disposed) return;
    this.initializingValue = false;
    this.initializedValue = true;
    this.notify();
  }
  /**
   * Clears every cached user/menu/favorite value and error state, and forgets
   * the identity they belonged to. Call on logout / session clear so no stale
   * data survives into the next login.
   */
  reset() {
    this.clearData();
    this.loadedUserSub = null;
    this.loadedApplicationId = null;
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
  /** Checks whether the navigation tree contains any matching leaf menu. */
  hasNavigableMenu(code) {
    return hasAnyMenuCode(this.menusValue, code);
  }
  /** Checks effective item/function authorization codes (ANY match). */
  hasMenuCode(code) {
    const granted = this.menuCodes;
    return (Array.isArray(code) ? code : [code]).some(
      (item) => granted.includes(item)
    );
  }
  /**
   * Route-membership check: can the user open `path`? True when any granted
   * leaf menu route equals it (slash-normalized).
   */
  hasRoute(path) {
    return hasAnyRoute(this.menusValue, path);
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
    const generation = this.generation;
    this.checkGeneration(generation);
    const previousMenus = this.menusValue;
    this.menusValue = this.applyMenuFavorite(previousMenus, menuId, isFavorite);
    this.notify();
    const call = isFavorite ? this.menuService.addFavorite(menuId) : this.menuService.removeFavorite(menuId);
    try {
      await call;
      this.checkGeneration(generation);
      await this.reloadFavorites();
    } catch (err) {
      this.checkGeneration(generation);
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
    const generation = this.generation;
    this.checkGeneration(generation);
    const previous = this.favoritesValue;
    this.favoritesValue = this.applyFavoriteReorder(previous, menuIds);
    this.notify();
    try {
      await this.menuService.reorderFavorites(menuIds);
    } catch (err) {
      this.checkGeneration(generation);
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
   * (`applicationId`) or the configured application when omitted. Returns the
   * mapped `IMenu[]`.
   */
  async loadMenus(applicationId) {
    const generation = this.generation;
    this.checkGeneration(generation);
    const nodes = await this.menuService.getEffectiveMenus(applicationId);
    this.checkGeneration(generation);
    const mapped = toIMenus(nodes);
    this.menusValue = mapped;
    this.notify();
    return mapped;
  }
  /** Loads favorites into `favorites` — optionally for a single application. Returns the mapped `IMenu[]`. */
  async loadFavorites(applicationId) {
    const generation = this.generation;
    this.checkGeneration(generation);
    const items = await this.menuService.getFavorites(
      applicationId
    );
    this.checkGeneration(generation);
    const mapped = items.map(toIMenuFavorite);
    this.favoritesValue = mapped;
    this.notify();
    return mapped;
  }
  /** Loads effective item/function authorizations and their company scope. */
  async loadAuthorizations(applicationId) {
    const generation = this.generation;
    this.checkGeneration(generation);
    const request = ++this.authorizationRequest;
    this.authorizationsLoadingValue = true;
    this.loadErrorsValue = { ...this.loadErrorsValue, authorizations: null };
    this.clearAuthorizationData();
    this.notify();
    try {
      const items = await this.menuService.getAuthorizations(
        applicationId
      );
      this.checkGeneration(generation);
      if (request !== this.authorizationRequest) throw requestCancellation("abort");
      this.applyAuthorizations(items);
      return this.authorizationsValue;
    } catch (error) {
      this.checkGeneration(generation);
      if (request === this.authorizationRequest) {
        this.clearAuthorizationData();
        this.loadErrorsValue = { ...this.loadErrorsValue, authorizations: normalizeApiError(error) };
      }
      throw error;
    } finally {
      if (generation === this.generation && request === this.authorizationRequest) {
        this.authorizationsLoadingValue = false;
        this.notify();
      }
    }
  }
  applyAuthorizations(items) {
    const authorizations = items.map((item) => ({
      ...item,
      companies: item.companies.map((company) => ({ ...company }))
    }));
    this.authorizationsValue = authorizations;
  }
  /** Returns a new menu tree with the matching node's `isFavorite` flipped (star icon). */
  applyMenuFavorite(menus, menuId, isFavorite) {
    return menus.map((menu) => {
      var _a, _b;
      if (getMenuKey(menu) === menuId) {
        return { ...menu, isFavorite };
      }
      if ((_a = menu.children) == null ? void 0 : _a.length) {
        return {
          ...menu,
          children: this.applyMenuFavorite(menu.children, menuId, isFavorite)
        };
      }
      if ((_b = menu.child) == null ? void 0 : _b.length) {
        return {
          ...menu,
          child: this.applyMenuFavorite(menu.child, menuId, isFavorite)
        };
      }
      return menu;
    });
  }
  applyFavoriteReorder(favorites, menuIds) {
    const byId = new Map(
      favorites.map((favorite) => [String(getMenuKey(favorite)), favorite])
    );
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
    const generation = this.generation;
    const raw = await this.currentUserService.getCurrentUser();
    this.checkGeneration(generation);
    this.rawCurrentUserValue = raw;
    this.currentUserValue = mapToSidebarUser(raw);
    this.notify();
  }
  async loadMenusInternal(applicationId) {
    await this.loadMenus(applicationId);
  }
  async loadFavoritesInternal(applicationId) {
    await this.loadFavorites(applicationId);
  }
  async loadAuthorizationsInternal(applicationId) {
    await this.loadAuthorizations(applicationId);
  }
  clearData() {
    this.generation++;
    this.authorizationRequest++;
    this.authorizationsLoadingValue = false;
    this.initializingValue = false;
    this.currentUserValue = null;
    this.rawCurrentUserValue = null;
    this.menusValue = [];
    this.favoritesValue = [];
    this.rolesValue = [];
    this.clearAuthorizationData();
    this.initializedValue = false;
    this.loadErrorValue = null;
    this.loadErrorsValue = {
      user: null,
      menus: null,
      favorites: null,
      authorizations: null
    };
    this.notify();
  }
  clearAuthorizationData() {
    this.authorizationsValue = [];
  }
  recordError(source, err) {
    var _a, _b;
    const message = resolveApiErrorDisplayMessage(
      err,
      "Failed to load",
      (_a = this.config) == null ? void 0 : _a.errorCatalogResolver,
      (_b = this.config) == null ? void 0 : _b.errorDisplayFormatter
    );
    this.loadErrorsValue = {
      ...this.loadErrorsValue,
      [source]: normalizeApiError(err)
    };
    this.loadErrorValue = `${source}: ${message}`;
    console.error(`[@insight/ui][STORE] load "${source}" failed`, err);
    this.notify();
  }
};

// src/components/user/user-menu.ts
var IUserMenuService = class {
  config;
  api;
  constructor(config, api) {
    this.config = config;
    this.api = api;
  }
  get baseUrl() {
    return this.config.api["user"] ?? environment.api.user;
  }
  resolveApplicationId(applicationId) {
    var _a;
    const id = (_a = applicationId ?? this.config.appId) == null ? void 0 : _a.trim();
    if (!id) {
      throw new Error(
        "[@insight/ui] applicationId is required to load current-user application data."
      );
    }
    return id;
  }
  applicationPath(applicationId, suffix) {
    return `/me/applications/${encodeURIComponent(applicationId)}/${suffix}`;
  }
  /** GET `{api.user}/me/applications/:applicationId/menus` - effective navigation tree. */
  async getEffectiveMenus(applicationId) {
    const id = this.resolveApplicationId(applicationId);
    const response = await this.api.get(
      this.applicationPath(id, "menus"),
      { apiUrl: this.baseUrl }
    );
    return response.data;
  }
  /** GET `{api.user}/me/applications/:applicationId/menus/favorites` - effective favorites. */
  async getFavorites(applicationId) {
    const id = this.resolveApplicationId(applicationId);
    const response = await this.api.get(
      this.applicationPath(id, "menus/favorites"),
      { apiUrl: this.baseUrl }
    );
    return response.data;
  }
  /**
   * GET `{api.user}/me/applications/:applicationId/authorizations` - the complete set of
   * effective authorizations (menu items + functions) for the current user,
   * already reduced to `allowed` entries by the backend.
   *
   * The backend REQUIRES `applicationId`, so it falls back to `config.appId`
   * and fails loudly when neither is configured (fail-closed: the caller's
   * permission list simply stays empty).
   */
  async getAuthorizations(applicationId) {
    const id = this.resolveApplicationId(applicationId);
    const response = await this.api.get(
      this.applicationPath(id, "authorizations"),
      { apiUrl: this.baseUrl }
    );
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

// src/components/user/current-user.ts
var ICurrentUserService = class {
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

// src/components/auth/runtime.ts
function createIRuntime(overrides) {
  const config = resolveIAuthConfig(overrides);
  validateIAuthConfig(config);
  const controller = new AbortController();
  const csrf = new ICsrfService(config, controller.signal);
  const auth = new IAuthService(config, csrf, controller.signal);
  const sessionExpired = new ISessionExpiredService();
  const session = new ISessionService(config, auth, csrf, sessionExpired);
  let status = "idle";
  let initialization = null;
  let handledExpiry = false;
  const assertActive = () => {
    if (status === "disposed") throw new Error("Runtime is disposed.");
  };
  const initialize = () => {
    assertActive();
    if (!initialization) {
      status = "initializing";
      initialization = session.tryRestoreSession().then(() => {
        if (status !== "disposed") status = "ready";
      });
    }
    return initialization;
  };
  const api = createApiClient({
    config,
    csrf,
    session,
    initialize,
    assertActive,
    signal: controller.signal,
    onSessionExpired(error) {
      if (status === "disposed" || session.isLoggedOut() || handledExpiry)
        return;
      handledExpiry = true;
      session.clearSession();
      if (config.onUnauthorized) {
        config.onUnauthorized(error);
        return;
      }
      const apiError = normalizeApiError(error);
      const errorCode = extractProblemDetailsErrorCode(apiError);
      const reason = toSessionExpiredReason(errorCode);
      const targetPath = getSessionReturnUrl();
      if ((config.unauthorizedHandling ?? "dialog") === "dialog") {
        sessionExpired.show(
          targetPath,
          reason,
          errorCode,
          apiError.detail,
          apiError.message,
          apiError
        );
      } else {
        window.location.href = buildExternalSigninUrl(config, targetPath);
      }
    }
  });
  const impersonation = new IImpersonationStateService(config, session, api);
  const currentUserService = new ICurrentUserService(config, api);
  const userMenuService = new IUserMenuService(config, api);
  const userMenuStore = new IUserMenuStore(
    currentUserService,
    userMenuService,
    session,
    config
  );
  session.setUserMenuStore(userMenuStore);
  const unsubscribe = session.subscribe(() => {
    if (session.getAccessToken()) {
      handledExpiry = false;
      sessionExpired.hide();
    } else if (session.isLoggedOut()) sessionExpired.hide();
  });
  return {
    config,
    csrf,
    auth,
    session,
    sessionExpired,
    api,
    userMenuStore,
    impersonation,
    get status() {
      return status;
    },
    get ready() {
      return status === "ready";
    },
    initialize,
    dispose() {
      if (status === "disposed") return;
      status = "disposed";
      controller.abort();
      unsubscribe();
      impersonation.dispose();
      session.dispose();
      csrf.dispose();
      userMenuStore.dispose();
      sessionExpired.dispose();
    }
  };
}
function IAuthProvider(props) {
  if (props.runtime && props.config)
    throw new Error("Provide either runtime or config, not both.");
  const [owned] = useState(
    () => props.runtime ? null : createIRuntime(props.config ?? {})
  );
  const runtime = props.runtime ?? owned;
  const [lease] = useState(() => ({ generation: 0 }));
  if (runtime.status === "disposed") throw new Error("Runtime is disposed.");
  useEffect(() => {
    lease.generation++;
    void runtime.initialize();
    return () => {
      const generation = ++lease.generation;
      if (owned)
        queueMicrotask(() => {
          if (lease.generation === generation) owned.dispose();
        });
    };
  }, [runtime, owned, lease]);
  return /* @__PURE__ */ jsx(IAuthContext.Provider, { value: runtime, children: props.children });
}
function IRequireAuth({
  children: children2,
  loading
}) {
  const session = useISession();
  const { config } = useIAuthContext();
  const sessionExpired = useISessionExpired();
  const location = useLocation();
  const targetPath = getSessionReturnUrl(useHref(location));
  const isInitializing = session.initializing;
  const isAuth = session.isAuth();
  const overlayVisible = sessionExpired.visible;
  useEffect(() => {
    if (overlayVisible) return;
    if (isInitializing) return;
    if (isAuth) return;
    window.location.href = buildExternalSigninUrl(config, targetPath);
  }, [overlayVisible, isInitializing, isAuth, config, targetPath]);
  if (overlayVisible) {
    return null;
  }
  if (isInitializing) {
    return loading ?? /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading session..." });
  }
  if (!isAuth) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: children2 });
}
function IRouteAccessDenied() {
  const reportAccess = useContext(IRouteAccessContext);
  const owner = useId();
  useLayoutEffect(() => {
    reportAccess == null ? void 0 : reportAccess(owner, true);
    return () => reportAccess == null ? void 0 : reportAccess(owner, false);
  }, [reportAccess, owner]);
  return /* @__PURE__ */ jsx(IErrorPage, { kind: "forbidden", role: "alert" });
}
var UNAUTHORIZED_ACCESS_PATH = "/unauthorized-access";
function IRequireAccess({
  value,
  source = "menuCode",
  loading,
  children: children2
}) {
  const session = useISession();
  const store = useIUserMenuStore();
  const sessionExpired = useISessionExpired();
  const isInitializing = session.initializing;
  const isAuth = session.isAuth();
  const accessSettled = store.initialized;
  const overlayVisible = sessionExpired.visible;
  const [accessLoading, setAccessLoading] = useState(
    () => source === "menuCode" && !store.initializing && !accessSettled
  );
  useEffect(() => {
    if (source !== "menuCode" || !isAuth || isInitializing || overlayVisible) {
      return;
    }
    if (store.initializing) {
      return;
    }
    if (accessSettled) {
      return;
    }
    setAccessLoading(true);
    void store.load().finally(() => setAccessLoading(false));
  }, [source, isAuth, isInitializing, overlayVisible, store, accessSettled]);
  if (overlayVisible) {
    return null;
  }
  if (isInitializing) {
    return loading ?? /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading session..." });
  }
  if (!isAuth) {
    return null;
  }
  if (source === "menuCode" && (store.initializing || !accessSettled || accessLoading)) {
    return loading ?? /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading access..." });
  }
  const allowed = source === "role" ? session.hasRole(value) : store.hasMenuCode(value);
  if (!allowed) {
    return /* @__PURE__ */ jsx(IRouteAccessDenied, {});
  }
  return /* @__PURE__ */ jsx(Fragment, { children: children2 });
}
function IRequireRouteAccess({
  menuCode,
  resolveMenuCode,
  missingMenuCode = "allow",
  loading,
  children: children2
}) {
  var _a;
  const session = useISession();
  const store = useIUserMenuStore();
  const sessionExpired = useISessionExpired();
  const location = useLocation();
  const isInitializing = session.initializing;
  const isAuth = session.isAuth();
  const accessSettled = store.initialized;
  const overlayVisible = sessionExpired.visible;
  const [accessLoading, setAccessLoading] = useState(
    () => !store.initializing && !accessSettled
  );
  useEffect(() => {
    if (!isAuth || isInitializing || overlayVisible) {
      return;
    }
    if (store.initializing) {
      return;
    }
    if (accessSettled) {
      return;
    }
    setAccessLoading(true);
    void store.load().finally(() => setAccessLoading(false));
  }, [isAuth, isInitializing, overlayVisible, store, accessSettled]);
  if (overlayVisible) {
    return null;
  }
  if (isInitializing) {
    return loading ?? /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading session..." });
  }
  if (!isAuth) {
    return null;
  }
  if (!accessSettled && (store.initializing || accessLoading)) {
    return loading ?? /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading access..." });
  }
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const resolvedMenuCode = (_a = menuCode ?? (resolveMenuCode == null ? void 0 : resolveMenuCode(path, store))) == null ? void 0 : _a.trim();
  if (!resolvedMenuCode) {
    console.warn(
      `[@insight/ui] No menu code mapping found for route "${path}".`
    );
    return missingMenuCode === "allow" ? /* @__PURE__ */ jsx(Fragment, { children: children2 }) : /* @__PURE__ */ jsx(IRouteAccessDenied, {});
  }
  if (!store.hasMenuCode(resolvedMenuCode)) {
    return /* @__PURE__ */ jsx(IRouteAccessDenied, {});
  }
  return /* @__PURE__ */ jsx(Fragment, { children: children2 });
}
function IHImpersonationBanner() {
  var _a, _b;
  const { config } = useIAuthContext();
  const session = useISession();
  const state = useIImpersonation();
  const store = useIUserMenuStore();
  const alerts = useIAlert();
  const confirm = useIConfirm();
  const context = impersonationContextKey(session.getAccessToken());
  const status = state.status;
  const visible = session.isImpersonating() && (!status || status.mode === "IMPERSONATING");
  const [ending, setEnding] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const active = useRef(false);
  const pending = useRef(false);
  const infoPending = useRef(false);
  const currentContext = useRef(context);
  currentContext.current = context;
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    pending.current = false;
    setConfirming(false);
    setEnding(false);
    setError("");
    if (session.isImpersonating())
      void state.loadStatus().catch(() => {
      });
  }, [context, session, state]);
  useEffect(() => {
    const end = resolveGrantEnd(status == null ? void 0 : status.endAt, status == null ? void 0 : status.endDate);
    let timer;
    const tick = () => {
      if (end === null || !visible) {
        setCountdown(null);
        return;
      }
      const remaining = Math.max(0, end - Date.now());
      setCountdown(
        remaining < COUNTDOWN_THRESHOLD_MS ? formatCountdown(remaining) : null
      );
      if (remaining > 0)
        timer = setTimeout(
          tick,
          remaining >= COUNTDOWN_THRESHOLD_MS ? Math.min(
            remaining - COUNTDOWN_THRESHOLD_MS + 1,
            MAX_TIMER_DELAY_MS
          ) : Math.min(1e3, remaining)
        );
    };
    tick();
    return () => clearTimeout(timer);
  }, [status == null ? void 0 : status.endAt, status == null ? void 0 : status.endDate, visible]);
  if (!visible) return null;
  const occupation = (status == null ? void 0 : status.occupation) || ((_a = store.rawCurrentUser) == null ? void 0 : _a.occupationName);
  const onInfo = async () => {
    var _a2;
    if (infoPending.current) return;
    infoPending.current = true;
    try {
      await alerts.information(
        "About Impersonation Sessions",
        ((_a2 = config.impersonation) == null ? void 0 : _a2.informationText) ?? IMPERSONATION_INFORMATION
      );
    } finally {
      infoPending.current = false;
    }
  };
  const onEnd = async () => {
    if (pending.current) return;
    pending.current = true;
    setConfirming(true);
    const key = context;
    try {
      const confirmed = await confirm.danger(
        "End Impersonate Session",
        IMPERSONATION_CONFIRMATION
      );
      if (!active.current || key !== currentContext.current || !confirmed)
        return;
      setConfirming(false);
      setEnding(true);
      setError("");
      const result = await session.endImpersonation();
      if (active.current && !session.getAccessToken())
        window.location.assign(
          resolveImpersonationRedirect(
            result,
            config.api.identity,
            config.signinUrl
          )
        );
    } catch (error2) {
      if (active.current && key === currentContext.current)
        setError(
          resolveApiErrorDisplayMessage(
            error2,
            "Failed to end the impersonation session. Please try again.",
            config.errorCatalogResolver,
            config.errorDisplayFormatter
          )
        );
    } finally {
      if (key === currentContext.current) {
        pending.current = false;
        if (active.current) {
          setConfirming(false);
          setEnding(false);
        }
      }
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "ih-impersonation-banner", children: /* @__PURE__ */ jsxs(
    "section",
    {
      className: "i-banner i-banner-warning px-lg py-sm",
      "aria-label": "Impersonation session",
      "data-testid": "impersonation-banner",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap align-center gap-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "i-banner-details flex flex-wrap align-center gap-sm flex-fill text-md", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Signed In As:\xA0" }),
              /* @__PURE__ */ jsx("span", { "data-testid": "banner-actor", children: (status == null ? void 0 : status.actorName) || actorDisplayNameFromToken(session.getAccessToken()) })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Acting As:\xA0" }),
              /* @__PURE__ */ jsxs("span", { "data-testid": "banner-subject", children: [
                (status == null ? void 0 : status.subjectName) || ((_b = session.getUser()) == null ? void 0 : _b.name) || "-",
                occupation ? " (" + occupation + ")" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Grant ends:\xA0" }),
              /* @__PURE__ */ jsx("span", { "data-testid": "banner-end-date", children: grantEndLabel(status) })
            ] }),
            countdown !== null && /* @__PURE__ */ jsxs("span", { role: "timer", "aria-live": "off", children: [
              /* @__PURE__ */ jsx("strong", { children: "Time remaining:\xA0" }),
              /* @__PURE__ */ jsx("span", { "data-testid": "banner-countdown", children: countdown })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap align-center gap-sm shrink-0", children: [
            /* @__PURE__ */ jsx(
              IButton,
              {
                icon: "fa-solid fa-info",
                size: "sm",
                "aria-label": "About impersonation sessions",
                "data-testid": "impersonation-info",
                disabled: ending || confirming,
                onClick: () => {
                  void onInfo();
                }
              }
            ),
            /* @__PURE__ */ jsx(
              IButton,
              {
                variant: "danger",
                icon: "fa-solid fa-right-from-bracket",
                size: "sm",
                "data-testid": "end-impersonation",
                disabled: ending || confirming,
                loading: ending,
                onClick: () => {
                  void onEnd();
                },
                children: "End Impersonate Session"
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsx("p", { className: "mt-sm text-red-900 leading-snug", role: "alert", children: error })
      ]
    }
  ) });
}
function evaluatePermission(value, source) {
  if (!value) return false;
  if (typeof value === "function") {
    try {
      return value(source);
    } catch {
      console.error("[@insight/ui] Permission predicate failed.");
      return false;
    }
  }
  const codes = Array.isArray(value) ? value : [value];
  return codes.some((code) => source.menuCodes.includes(code));
}
function usePermission(value) {
  const store = useIUserMenuStore();
  if (store.initializing || !store.initialized) return false;
  return evaluatePermission(value, store.authorizationSource);
}
function IHasMn({
  value,
  children: children2
}) {
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  if (store.initializing || !store.initialized) return null;
  return allowed ? /* @__PURE__ */ jsx(Fragment, { children: children2 }) : null;
}
function INotHasMn({
  value,
  children: children2
}) {
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  if (store.initializing || !store.initialized) return null;
  return allowed ? null : /* @__PURE__ */ jsx(Fragment, { children: children2 });
}
function IHasMnRoute({
  value,
  children: children2
}) {
  const session = useISession();
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  const reportAccess = useContext(IRouteAccessContext);
  const owner = useId();
  const authenticated = session.isAuth();
  const ready = !session.initializing && authenticated && store.initialized && !store.initializing;
  useEffect(() => {
    if (!session.initializing && authenticated && !store.initialized && !store.initializing) {
      void store.load();
    }
  }, [
    session.initializing,
    authenticated,
    store,
    store.initialized,
    store.initializing
  ]);
  useLayoutEffect(() => {
    reportAccess == null ? void 0 : reportAccess(owner, ready && !allowed);
    return () => reportAccess == null ? void 0 : reportAccess(owner, false);
  }, [reportAccess, owner, ready, allowed]);
  if (!ready) {
    return /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading access..." });
  }
  if (!allowed) {
    return /* @__PURE__ */ jsx(IErrorPage, { kind: "forbidden", role: "alert" });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: children2 });
}
function hasMn(value, content) {
  if (typeof content === "function") {
    const Page = lazy(async () => ({ default: await content() }));
    const GuardedPage = () => /* @__PURE__ */ jsx(IHasMnRoute, { value, children: /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx(ILoading, { mode: "container", label: "Loading page..." }),
        children: /* @__PURE__ */ jsx(Page, {})
      }
    ) });
    return async () => GuardedPage;
  }
  return createElement(IHasMnRoute, { value, children: content });
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
function ISessionExpiredDialog() {
  const sessionExpired = useISessionExpired();
  const { config } = useIAuthContext();
  if (!sessionExpired.visible) {
    return null;
  }
  const reason = sessionExpired.reason;
  const message = resolveApiErrorDisplayMessage(
    sessionExpired.apiError ?? {
      errorCode: sessionExpired.errorCode ?? void 0,
      message: sessionExpired.message ?? void 0,
      detail: sessionExpired.detail ?? void 0
    },
    MESSAGES[reason ?? "default"],
    config.errorCatalogResolver,
    config.errorDisplayFormatter
  );
  const iconClass = reason === "SESSION_REPLACED" ? "fa-solid fa-right-from-bracket" : "fa-solid fa-clock";
  const onConfirm = () => {
    const returnUrl = sessionExpired.returnUrl;
    sessionExpired.hide();
    window.location.href = buildExternalSigninUrl(config, returnUrl);
  };
  return /* @__PURE__ */ jsx(
    IDialogContainer,
    {
      config: { width: "380px", disableClose: true, backdropClose: false },
      "aria-label": TITLES[reason ?? "default"],
      style: { zIndex: 9999 },
      children: /* @__PURE__ */ jsx(
        IDialog,
        {
          actions: [
            { type: "custom", label: "Log in again", className: "w-full" }
          ],
          onCustomAction: onConfirm,
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col align-center text-center gap-lg", children: [
            /* @__PURE__ */ jsx(IIcon, { className: "text-warning", icon: iconClass, size: "xl" }),
            /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: TITLES[reason ?? "default"] }),
            /* @__PURE__ */ jsx("p", { className: "m-0 text-md leading-normal text-subtle", children: message })
          ] })
        }
      )
    }
  );
}

// src/components/state/state-core.ts
function browserAdapter(kind) {
  return {
    getItem: (key) => window[kind].getItem(key),
    setItem: (key, value) => window[kind].setItem(key, value),
    removeItem: (key) => window[kind].removeItem(key)
  };
}
function snapshot(value) {
  const seen = /* @__PURE__ */ new Set();
  const check = (item) => {
    if (item === null || typeof item === "string" || typeof item === "boolean") return;
    if (typeof item === "number" && Number.isFinite(item)) return;
    if (typeof item !== "object" || seen.has(item))
      throw new Error("IHState requires JSON-compatible values.");
    if (!Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) {
      throw new Error("IHState requires plain JSON objects.");
    }
    seen.add(item);
    for (const child of Object.values(item)) check(child);
    seen.delete(item);
  };
  check(value);
  const freeze = (item) => {
    if (item !== null && typeof item === "object") {
      Object.values(item).forEach(freeze);
      Object.freeze(item);
    }
  };
  const copy = JSON.parse(JSON.stringify(value));
  freeze(copy);
  return copy;
}
var IHStateOwner = class {
  namespaces = /* @__PURE__ */ new Map();
  adapters = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  version = 0;
  identity = null;
  identified = false;
  selection;
  prefix;
  constructor(prefix = "insight.state", adapters = {}) {
    this.prefix = prefix;
    this.adapters.set("session", browserAdapter("sessionStorage"));
    this.adapters.set("local", browserAdapter("localStorage"));
    for (const [name, adapter] of Object.entries(adapters)) {
      if (["temporary", "session", "local"].includes(name))
        throw new Error(`Reserved storage: ${name}`);
      this.adapters.set(name, adapter);
    }
    this.selection = new IHSelection(this);
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getVersion = () => this.version;
  registerNamespace(namespace, options) {
    if (!namespace.trim()) throw new Error("A state namespace is required.");
    const existing = this.namespaces.get(namespace);
    if (existing) {
      if ((options == null ? void 0 : options.storage) && existing.storage !== options.storage)
        throw new Error(`Conflicting storage for ${namespace}.`);
      return;
    }
    const storage = (options == null ? void 0 : options.storage) ?? "session";
    if (storage !== "temporary" && !this.adapters.has(storage))
      throw new Error(`Unknown state storage: ${storage}`);
    this.namespaces.set(namespace, {
      storage,
      values: /* @__PURE__ */ Object.create(null),
      hydrated: false,
      error: null
    });
  }
  entry(namespace) {
    this.registerNamespace(namespace);
    const entry = this.namespaces.get(namespace);
    if (!entry.hydrated && this.identity) {
      entry.hydrated = true;
      if (entry.storage !== "temporary") {
        try {
          const raw = this.adapters.get(entry.storage).getItem(this.storageKey(namespace));
          if (raw !== null) {
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
              throw new Error("Invalid namespace snapshot.");
            entry.values = snapshot(parsed);
          }
        } catch (error) {
          this.recordError(namespace, entry, "read", error);
        }
      }
    }
    return entry;
  }
  get(namespace, key, fallback) {
    const values = this.entry(namespace).values;
    return Object.hasOwn(values, key) ? values[key] : fallback;
  }
  set(namespace, key, value) {
    if (!this.identity)
      throw new Error("IHState requires an authenticated identity before writing.");
    const entry = this.entry(namespace);
    entry.values = { ...entry.values, [key]: snapshot(value) };
    this.persist(namespace, entry);
    this.emit();
  }
  update(namespace, key, fallback, update) {
    this.set(namespace, key, update(this.get(namespace, key, fallback)));
  }
  remove(namespace, key) {
    const entry = this.entry(namespace);
    const values = { ...entry.values };
    delete values[key];
    entry.values = values;
    this.persist(namespace, entry);
    this.emit();
  }
  clearNamespace(namespace) {
    const entry = this.entry(namespace);
    entry.values = /* @__PURE__ */ Object.create(null);
    entry.error = null;
    if (this.identity && entry.storage !== "temporary") {
      try {
        this.adapters.get(entry.storage).removeItem(this.storageKey(namespace));
      } catch (error) {
        this.recordError(namespace, entry, "remove", error);
      }
    }
    this.emit();
  }
  getError(namespace) {
    return this.entry(namespace).error;
  }
  /** Cold starts restore the same identity; identity transitions discard both contexts. */
  setIdentity(identity) {
    if (this.identified && identity === this.identity) return;
    const marker = `${this.prefix}:identity`;
    let previous = this.identity;
    try {
      previous ??= this.adapters.get("session").getItem(marker);
    } catch {
    }
    for (const entry of this.namespaces.values()) {
      entry.values = /* @__PURE__ */ Object.create(null);
      entry.hydrated = false;
      entry.error = null;
    }
    if (previous !== identity) {
      if (previous) this.purge(previous);
      if (identity && previous) this.purge(identity);
    }
    this.identity = identity;
    this.identified = true;
    try {
      if (identity) this.adapters.get("session").setItem(marker, identity);
      else this.adapters.get("session").removeItem(marker);
    } catch {
    }
    this.selection.activateMenu(null);
    this.emit();
  }
  storageKey(namespace, identity = this.identity) {
    return `${this.prefix}:${encodeURIComponent(identity ?? "")}:${encodeURIComponent(namespace)}`;
  }
  indexKey(identity) {
    return `${this.prefix}:[index]:${encodeURIComponent(identity ?? "")}`;
  }
  persist(namespace, entry) {
    entry.error = null;
    if (!this.identity || entry.storage === "temporary") return;
    try {
      const adapter = this.adapters.get(entry.storage);
      const key = this.storageKey(namespace);
      const indexKey = this.indexKey(this.identity);
      const index = this.readIndex(adapter, indexKey);
      if (!index.includes(key)) adapter.setItem(indexKey, JSON.stringify([...index, key]));
      adapter.setItem(key, JSON.stringify(entry.values));
    } catch (error) {
      this.recordError(namespace, entry, "write", error);
    }
  }
  readIndex(adapter, key) {
    const raw = adapter.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  }
  purge(identity) {
    for (const [name, adapter] of this.adapters) {
      const indexKey = this.indexKey(identity);
      const known = [...this.namespaces].filter(([, entry]) => entry.storage === name).map(([namespace]) => this.storageKey(namespace, identity));
      try {
        const keys = /* @__PURE__ */ new Set([...this.readIndex(adapter, indexKey), ...known]);
        const scopePrefix = this.storageKey("", identity);
        for (const key of keys) if (key.startsWith(scopePrefix)) adapter.removeItem(key);
        adapter.removeItem(indexKey);
      } catch (error) {
        for (const [namespace, entry] of this.namespaces) {
          if (entry.storage === name) this.recordError(namespace, entry, "remove", error);
        }
      }
    }
  }
  recordError(namespace, entry, operation, error) {
    entry.error = {
      namespace,
      operation,
      message: error instanceof Error ? error.message : String(error)
    };
  }
  emit() {
    this.version++;
    for (const listener of [...this.listeners]) listener();
  }
};
var SELECTION_NAMESPACE = "shared.selection";
var EMPTY_SELECTION = Object.freeze({ companyId: null, projectKey: null });
var IHSelection = class {
  value = Object.freeze({
    ...EMPTY_SELECTION,
    menuCode: null,
    companyStatus: "idle",
    projectStatus: "idle",
    error: null,
    revision: 0
  });
  listeners = /* @__PURE__ */ new Set();
  request = 0;
  companies = /* @__PURE__ */ new Set();
  projects = /* @__PURE__ */ new Set();
  state;
  constructor(state) {
    this.state = state;
    state.registerNamespace(SELECTION_NAMESPACE, { storage: "session" });
    state.subscribe(() => this.sync());
  }
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getSnapshot = () => {
    this.sync();
    return this.value;
  };
  sync() {
    const candidate = this.state.get(SELECTION_NAMESPACE, "active", EMPTY_SELECTION);
    const companyId = typeof (candidate == null ? void 0 : candidate.companyId) === "string" ? candidate.companyId : null;
    const projectKey = companyId && typeof (candidate == null ? void 0 : candidate.projectKey) === "string" ? candidate.projectKey : null;
    if (companyId !== this.value.companyId || projectKey !== this.value.projectKey) {
      const companyChanged = companyId !== this.value.companyId;
      this.publish({
        companyId,
        projectKey,
        companyStatus: companyChanged ? "loading" : this.value.companyStatus,
        projectStatus: "loading",
        error: null,
        revision: this.value.revision + (companyChanged ? 1 : 0)
      });
    }
  }
  activateMenu(menuCode) {
    this.companies.clear();
    this.projects.clear();
    this.request++;
    this.publish({
      menuCode,
      companyStatus: "loading",
      projectStatus: "loading",
      error: null,
      revision: this.value.revision + 1
    });
  }
  validateCompanies(menuCode, ids, status, error = null) {
    this.sync();
    if (!menuCode || this.value.menuCode && menuCode !== this.value.menuCode) return;
    if (status !== "ready") {
      this.companies.clear();
      this.publish({
        companyStatus: status,
        projectStatus: "loading",
        error,
        revision: this.value.revision + (this.value.companyStatus === "ready" ? 1 : 0)
      });
      return;
    }
    this.companies = new Set(ids);
    if (this.value.companyId && !this.companies.has(this.value.companyId)) this.write(null, null);
    this.publish({
      companyStatus: "ready",
      ...this.value.companyId ? {} : { projectStatus: "idle" },
      error: this.value.projectStatus === "error" ? this.value.error : null
    });
  }
  setCompany(companyId) {
    if (this.value.companyStatus !== "ready" || companyId && !this.companies.has(companyId))
      return false;
    if (companyId === this.value.companyId) return true;
    this.projects.clear();
    this.write(companyId, companyId ? this.value.projectKey : null);
    this.publish({
      companyStatus: "ready",
      projectStatus: companyId ? "loading" : "idle",
      error: null
    });
    return true;
  }
  beginProjects() {
    this.sync();
    this.projects.clear();
    this.publish({ projectStatus: "loading", error: null });
    return {
      revision: this.value.revision,
      request: ++this.request,
      companyId: this.value.companyId
    };
  }
  resolveProjects(token, keys) {
    if (!this.current(token)) return false;
    this.projects = new Set(keys);
    if (this.value.projectKey && !this.projects.has(this.value.projectKey)) {
      this.write(this.value.companyId, null);
      this.publish({ companyStatus: "ready" });
    }
    this.publish({ projectStatus: "ready", error: null });
    return true;
  }
  rejectProjects(token, message) {
    if (!this.current(token)) return false;
    this.publish({ projectStatus: "error", error: message });
    return true;
  }
  setProject(projectKey) {
    if (this.value.companyStatus !== "ready" || this.value.projectStatus !== "ready" || !this.value.companyId || projectKey && !this.projects.has(projectKey))
      return false;
    this.write(this.value.companyId, projectKey);
    this.publish({ companyStatus: "ready", projectStatus: "ready", error: null });
    return true;
  }
  current(token) {
    this.sync();
    return token.revision === this.value.revision && token.request === this.request && token.companyId !== null && token.companyId === this.value.companyId && this.value.companyStatus === "ready";
  }
  write(companyId, projectKey) {
    this.state.set(SELECTION_NAMESPACE, "active", { companyId, projectKey });
  }
  publish(patch) {
    if (Object.entries(patch).every(
      ([key, value]) => this.value[key] === value
    ))
      return;
    this.value = Object.freeze({ ...this.value, ...patch });
    for (const listener of [...this.listeners]) listener();
  }
};

export { COUNTDOWN_THRESHOLD_MS, DEFAULT_ERROR_FACTORIES, DEFAULT_PERSONAL_PROFILE_URL, HostShell, IActionPlaceholder, IAlert, IAuthCallback, IAuthContext, IAuthProvider, IAuthService, IAvatar, IBanner, IButton, ICard, ICardBody, ICardFooter, ICardImage, ICodeViewer, IConfirm, ICsrfService, ICurrentUserService, IDatepicker, IDialog, IDialogClose, IDialogContainer, IDialogOutlet, IDialogProvider, IDialogRef, IEmptyState, IErrorPage, IFCDatepicker, IFCInput, IFCSelect, IFCSelectCompany, IFCTextArea, IGrid, IGridColumn, IGridColumnGroup, IGridCustomColumn, IGridDataSource, IGridExpandableRow, IHContent, IHContentLayout, IHImpersonationBanner, IHMenu, IHSelection, IHSidebar, IHStateOwner, IHasMn, IHasMnRoute, IHighlightSearch, IHostApiProvider, IHostUiProvider, IIcon, IImageCropper, IImpersonationStateService, IInput, IInputAddon, ILoadError, ILoading, ILoadingRegion, IMPERSONATION_CONFIRMATION, IMPERSONATION_INFORMATION, INotHasMn, INotification, INotificationBell, INotificationDrawer, INotificationItem, INotificationSnackbar, IPaginator, IPill, IRequireAccess, IRequireAuth, IRequireRouteAccess, IRouter, ISection, ISectionBody, ISectionFilter, ISectionFooter, ISectionHeader, ISectionSubHeader, ISectionTab, ISectionTabs, ISelect, ISelectCompany, ISessionExpiredDialog, ISessionExpiredService, ISessionService, ISnackbar, ISnackbarProvider, ISnackbarRef, IStorageService, ITextArea, IToggle, IUserMenuService, IUserMenuStore, I_EMPTY_STATE_PRESETS, I_ERROR_PAGE_ACTIONS, I_ERROR_PAGE_PRESETS, I_ERROR_PAGE_SUPPORT_EMAIL, I_ICON_NAMES, I_ICON_SIZES, MAX_TIMER_DELAY_MS, UNAUTHORIZED_ACCESS_PATH, USER_APPLICATION_MAPPING_NOT_FOUND, actorDisplayNameFromToken, asMinMaxLengthError, buildExternalSigninUrl, buildFavoritePathMap, buildUrl2 as buildUrl, collectAuthorizationScope, collectLeafRoutes, collectMenuChain, collectMenuCodes, createApiClient, createIRuntime, decodeJwtPayload, decodeUser, environment, evaluatePermission, extractAccessTokenFromHash, extractProblemDetailsErrorCode, findBreadcrumbMenuChain, findFirstLeafRoute, findMenuNameById, formatApiFieldErrors, formatCountdown, getAuthEndpointPath, getAuthEndpointUrl, getDefaultIAuthConfig, getDefaultIAuthEndpoints, getMenuChildren, getMenuKey, getMenuLabel, getMenuRoute, grantEndLabel, hasAnyMenuCode, hasAnyRoute, hasMenuChildren, hasMn, hasNumber, highlightSearchParts, impersonationContextKey, interpolate, isControlRequired, isGroupNode, isHttpRoute, isImpersonationCsrfError, isLeafItem, isModuleMenu, isNewTabMenu, isRecord, isReloadMenu, isSessionExpiredError, isSpaMenu, mapToSidebarUser, normalizeApiError, normalizeFetchError, normalizeImpersonationStatus, normalizeMenuTree, normalizeRoutePath, notificationDate, rawRequest, readImpersonationActor, readImpersonationClaims, readNumber, requireIdentityHost, resolveApiErrorDisplayMessage, resolveControlErrorMessage, resolveGrantEnd, resolveIAuthConfig, resolveImpersonationRedirect, sanitizeReturnUrl, sessionExpiredService, storageService, toIMenu, toIMenuFavorite, toIMenus, toSessionExpiredReason, truncateNotificationText, useHostApi, useHostApiOptional, useHostUi, useIAlert, useIApi, useIAuth, useIAuthContext, useIConfirm, useICsrf, useIDialog, useIDialogData, useIDialogRef, useIHSelection, useIHState, useIImpersonation, useISession, useISessionExpired, useISnackbar, useIUserMenuStore, useInputMask, useOptionalIConfirm, usePermission, useRemoteHostApi, validateIAuthConfig };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map