// section.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export type ISectionTabBadge =
  | boolean
  | ''
  | number
  | string
  | null
  | undefined;

export type ISectionTabsHeight =
  | 'wrap'
  | 'auto'
  | number
  | string
  | null
  | undefined;

function isTruthyAttr(v: any): boolean {
  if (v === null || v === undefined) return false;
  const s = String(v).trim().toLowerCase();
  if (s === 'false' || s === '0' || s === 'null' || s === 'undefined')
    return false;
  return true;
}

function parseBadge(v: any): { enabled: boolean; value: number | null } {
  if (!isTruthyAttr(v)) return { enabled: false, value: null };

  const s = String(v).trim();
  if (s === '' || s.toLowerCase() === 'true')
    return { enabled: true, value: null };

  const n = Number(s);
  if (Number.isFinite(n) && Number.isInteger(n) && n >= 0)
    return { enabled: true, value: n };

  return { enabled: true, value: null };
}

function parseTabsHeight(v: any): number | null {
  // null => wrap (default)
  if (v === null || v === undefined) return null;

  const s = String(v).trim().toLowerCase();
  if (s === '' || s === 'wrap' || s === 'auto') return null;

  // allow "300", "300px"
  if (s.endsWith('px')) {
    const n = Number(s.slice(0, -2).trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// -----------------------------
// Simple wrappers (preserve tags)
// -----------------------------

export function ISection(props: React.HTMLAttributes<HTMLElement>) {
  return <i-section {...props} />;
}

export function ISectionHeader(props: React.HTMLAttributes<HTMLElement>) {
  // Angular wraps with <h4>…</h4>
  return (
    <i-section-header {...props}>
      <h4>{props.children}</h4>
    </i-section-header>
  );
}

export function ISectionSubHeader(props: React.HTMLAttributes<HTMLElement>) {
  // Angular wraps with <h6>…</h6>
  return (
    <i-section-sub-header {...props}>
      <h6>{props.children}</h6>
    </i-section-sub-header>
  );
}

export function ISectionFilter(props: React.HTMLAttributes<HTMLElement>) {
  return <i-section-filter {...props} />;
}

export function ISectionBody(props: React.HTMLAttributes<HTMLElement>) {
  return <i-section-body {...props} />;
}

export function ISectionFooter(props: React.HTMLAttributes<HTMLElement>) {
  return <i-section-footer {...props} />;
}

// -----------------------------
// Tabs building blocks
// -----------------------------

export type ISectionTabHeaderProps = { children?: React.ReactNode };
export function ISectionTabHeader(props: ISectionTabHeaderProps) {
  // marker component only (like Angular template)
  return <>{props.children}</>;
}
ISectionTabHeader.displayName = 'ISectionTabHeader';

export type ISectionTabContentProps = { children?: React.ReactNode };
export function ISectionTabContent(props: ISectionTabContentProps) {
  // marker component only (like Angular template)
  return <>{props.children}</>;
}
ISectionTabContent.displayName = 'ISectionTabContent';

export type ISectionTabProps = {
  title?: string;
  opened?: boolean;
  badge?: ISectionTabBadge;
  children?: React.ReactNode;

  /**
   * Optional: direct header/content (instead of using <ISectionTabHeader/> / <ISectionTabContent/>)
   */
  header?: React.ReactNode;
  content?: React.ReactNode;
};

export function ISectionTab(_props: ISectionTabProps) {
  // marker component only; ISectionTabs will read it
  return null;
}
ISectionTab.displayName = 'ISectionTab';

type ResolvedTab = {
  key: React.Key;
  title: string;
  opened: boolean;
  badgeEnabled: boolean;
  badgeValue: number | null;
  headerNode: React.ReactNode;
  contentNode: React.ReactNode;
};

function isElementOfType<P>(
  el: any,
  comp: React.JSXElementConstructor<P> | string
): el is React.ReactElement<P> {
  return React.isValidElement(el) && el.type === comp;
}

function resolveTab(
  tabEl: React.ReactElement<ISectionTabProps>,
  index: number
): ResolvedTab {
  const props = tabEl.props;
  const title = props.title ?? '';
  const opened = !!props.opened;

  const parsedBadge = parseBadge(props.badge);
  const badgeEnabled = parsedBadge.enabled;
  const badgeValue = parsedBadge.value;

  // Default header (Angular defaultHeaderTpl)
  const defaultHeader = (
    <>
      <span className="i-section-tab-title">{title}</span>
      {badgeEnabled ? (
        <span
          className={[
            'i-section-tab-badge',
            badgeValue !== null ? 'has-number' : null,
          ]
            .filter(Boolean)
            .join(' ')}>
          {badgeValue !== null ? (
            <span className="i-section-tab-badge-number">{badgeValue}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  // Default content (Angular defaultContentTpl)
  const defaultContent = <>{props.children}</>;

  // Support both "marker children" and direct props.header/props.content
  let headerNode: React.ReactNode = props.header ?? defaultHeader;
  let contentNode: React.ReactNode = props.content ?? defaultContent;

  // If children include <ISectionTabHeader/> or <ISectionTabContent/>, use those
  if (props.children) {
    const childrenArr = React.Children.toArray(props.children);

    const headerMarker = childrenArr.find((c) =>
      isElementOfType<ISectionTabHeaderProps>(c, ISectionTabHeader)
    ) as React.ReactElement<ISectionTabHeaderProps> | undefined;

    const contentMarker = childrenArr.find((c) =>
      isElementOfType<ISectionTabContentProps>(c, ISectionTabContent)
    ) as React.ReactElement<ISectionTabContentProps> | undefined;

    if (headerMarker) {
      headerNode = headerMarker.props.children ?? null;
    }

    if (contentMarker) {
      contentNode = contentMarker.props.children ?? null;
    }
  }

  return {
    key: tabEl.key ?? `tab-${index}`,
    title,
    opened,
    badgeEnabled,
    badgeValue,
    headerNode,
    contentNode,
  };
}

// -----------------------------
// ISectionTabs
// -----------------------------

export type ISectionTabsProps = React.HTMLAttributes<HTMLElement> & {
  selectedIndex?: number | null;
  onSelectedIndexChange?: (index: number) => void;

  /**
   * height:
   * - "wrap" / "auto" / null => wrap (default)
   * - 300 / "300" / "300px" => fixed px height + internal scroll
   */
  height?: ISectionTabsHeight;

  children?: React.ReactNode; // expects ISectionTab[]
};

export function ISectionTabs(props: ISectionTabsProps) {
  const {
    selectedIndex = null,
    onSelectedIndexChange,
    height,
    children,
    ...rest
  } = props;

  const tabs = useMemo(() => {
    const arr = React.Children.toArray(children).filter((c) =>
      isElementOfType(c, ISectionTab)
    ) as React.ReactElement<ISectionTabProps>[];

    return arr.map((t, i) => resolveTab(t, i));
  }, [children]);

  const isControlled = selectedIndex !== null && selectedIndex !== undefined;

  const initialIndex = useMemo(() => {
    if (
      isControlled &&
      Number.isInteger(selectedIndex) &&
      (selectedIndex as number) >= 0 &&
      (selectedIndex as number) < tabs.length
    ) {
      return selectedIndex as number;
    }

    const openedIndex = tabs.findIndex((t) => t.opened);
    return openedIndex >= 0 ? openedIndex : 0;
  }, [isControlled, selectedIndex, tabs]);

  const [uncontrolledIndex, setUncontrolledIndex] =
    useState<number>(initialIndex);

  // Keep uncontrolled index valid when tabs change
  useEffect(() => {
    if (isControlled) return;

    setUncontrolledIndex((prev) => {
      if (prev >= 0 && prev < tabs.length) return prev;
      return initialIndex;
    });
  }, [tabs.length, initialIndex, isControlled]);

  const activeIndexRaw = isControlled
    ? (selectedIndex as number)
    : uncontrolledIndex;

  // ✅ guard: keep active index in range (especially for controlled usage)
  const activeIndex =
    Number.isInteger(activeIndexRaw) &&
    activeIndexRaw >= 0 &&
    activeIndexRaw < tabs.length
      ? activeIndexRaw
      : tabs.length
        ? 0
        : -1;

  const activeTab = activeIndex >= 0 ? (tabs[activeIndex] ?? null) : null;

  const contentHeightPx = parseTabsHeight(height);
  const isFixedHeight = contentHeightPx !== null;

  const activate = useCallback(
    (idx: number) => {
      if (!Number.isInteger(idx) || idx < 0 || idx >= tabs.length) return;

      if (!isControlled) setUncontrolledIndex(idx);
      onSelectedIndexChange?.(idx);
    },
    [tabs.length, isControlled, onSelectedIndexChange]
  );

  return (
    <i-section-tabs {...rest}>
      <div className="i-section-tabs-headers" role="tablist">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIndex;

          return (
            <button
              key={tab.key}
              className={['i-section-tabs-header', isActive ? 'active' : null]
                .filter(Boolean)
                .join(' ')}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => activate(idx)}>
              {tab.headerNode}
            </button>
          );
        })}
      </div>

      <div
        className={[
          'i-section-tabs-content',
          isFixedHeight ? 'scroll' : null,
          isFixedHeight ? 'scroll-y' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        style={isFixedHeight ? { height: `${contentHeightPx}px` } : undefined}>
        {activeTab ? activeTab.contentNode : null}
      </div>
    </i-section-tabs>
  );
}
