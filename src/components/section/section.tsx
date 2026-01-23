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

  const s = String(v).trim().toLowerCase();

  if (s === '' || s === 'true') return { enabled: true, value: null };

  const n = Number(s);
  if (!Number.isNaN(n)) return { enabled: true, value: n };

  return { enabled: true, value: null };
}

function parseTabsHeight(v: any): number | null {
  if (v === null || v === undefined) return null;

  const s = String(v).trim().toLowerCase();

  if (s === '' || s === 'wrap' || s === 'auto') return null;

  if (s.endsWith('px')) {
    const n = Number(s.slice(0, -2).trim());
    return Number.isNaN(n) ? null : n;
  }

  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function clampIndex(index: number, len: number): number {
  if (len <= 0) return 0;
  if (index < 0) return 0;
  if (index >= len) return len - 1;
  return index;
}

// -----------------------------
// ISection (shell components)
// -----------------------------

export function ISection(props: React.HTMLAttributes<HTMLElement>) {
  return <i-section {...props} />;
}

export function ISectionHeader(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <i-section-header {...props}>
      <h4>{props.children}</h4>
    </i-section-header>
  );
}

export function ISectionSubHeader(props: React.HTMLAttributes<HTMLElement>) {
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
// ISectionTab (declarative)
// -----------------------------

export type ISectionTabProps = {
  title?: string;
  opened?: boolean;
  badge?: ISectionTabBadge;
  header?: React.ReactNode;
  children?: React.ReactNode;
};

export function ISectionTab(_props: ISectionTabProps) {
  // not rendered directly; consumed by ISectionTabs
  return null;
}

type NormalizedTab = {
  key: string;
  title: string;
  opened: boolean;
  badgeEnabled: boolean;
  badgeValue: number | null;
  headerNode: React.ReactNode;
  contentNode: React.ReactNode;
};

function normalizeTab(
  node: React.ReactNode,
  index: number
): NormalizedTab | null {
  if (!React.isValidElement(node)) return null;

  // Must be <ISectionTab .../>
  if ((node.type as any) !== ISectionTab) return null;

  const props = node.props as ISectionTabProps;

  const title = String(props.title ?? '');
  const opened = !!props.opened;

  const parsed = parseBadge(props.badge);
  const badgeEnabled = parsed.enabled;
  const badgeValue = parsed.value;

  const headerNode = props.header ?? null;
  const contentNode = props.children ?? null;

  return {
    key: `tab-${index}`,
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
    height = 'wrap',
    children,
    className,
    ...rest
  } = props;

  const tabs = useMemo(() => {
    const arr = React.Children.toArray(children);
    return arr
      .map((n, i) => normalizeTab(n, i))
      .filter(Boolean) as NormalizedTab[];
  }, [children]);

  const openedIndex = useMemo(() => tabs.findIndex((t) => t.opened), [tabs]);

  const isControlled = selectedIndex !== null && selectedIndex !== undefined;

  const initialIndex = useMemo(() => {
    if (isControlled) return clampIndex(selectedIndex as number, tabs.length);
    if (openedIndex >= 0) return clampIndex(openedIndex, tabs.length);
    return 0;
  }, [isControlled, openedIndex, selectedIndex, tabs.length]);

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    // sync on children change or controlled index change
    const next = isControlled
      ? clampIndex(selectedIndex as number, tabs.length)
      : openedIndex >= 0
        ? clampIndex(openedIndex, tabs.length)
        : 0;

    setActiveIndex(next);
  }, [isControlled, selectedIndex, openedIndex, tabs.length]);

  const contentHeightPx = useMemo(() => parseTabsHeight(height), [height]);
  const isFixedHeight = contentHeightPx !== null;

  const activeTab = tabs[activeIndex] ?? null;

  const selectIndex = useCallback(
    (index: number, emit: boolean) => {
      const next = clampIndex(index, tabs.length);
      setActiveIndex(next);

      if (emit) {
        onSelectedIndexChange?.(index);
      }
    },
    [onSelectedIndexChange, tabs.length]
  );

  return (
    <i-section-tabs className={className} {...rest}>
      <div className="i-section-tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            type="button"
            className={[
              'i-section-tab',
              index === activeIndex ? 'opened' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => selectIndex(index, true)}>
            <span className="i-section-tab-title">{tab.title}</span>

            {tab.badgeEnabled ? (
              <span className="i-section-tab-badge">
                {tab.badgeValue !== null ? tab.badgeValue : null}
              </span>
            ) : null}

            {tab.headerNode}
          </button>
        ))}
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
