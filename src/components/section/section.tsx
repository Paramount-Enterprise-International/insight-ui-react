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

/* =========================
 * Helpers (match Angular)
 * ========================= */

function isTruthyAttr(v: any): boolean {
  if (v === null || v === undefined) return false;
  const s = String(v).trim().toLowerCase();
  if (s === 'false' || s === '0' || s === 'null' || s === 'undefined')
    return false;
  return true;
}

function parseOpened(v: any): boolean {
  if (v === null || v === undefined) return false;
  return `${v}` !== 'false';
}

function parseBadge(v: any): { enabled: boolean; value: number | null } {
  if (!isTruthyAttr(v)) return { enabled: false, value: null };

  const raw = String(v).trim();
  if (raw === '' || raw.toLowerCase() === 'true')
    return { enabled: true, value: null };

  const n = Number(raw);
  if (Number.isFinite(n) && Number.isInteger(n) && n >= 0) {
    return { enabled: true, value: n };
  }

  return { enabled: true, value: null };
}

function parseTabsHeight(v: any): number | null {
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

function isValidIndex(index: any, len: number): index is number {
  return Number.isInteger(index) && index >= 0 && index < len;
}

/* =========================
 * Shell Components
 * ========================= */

export function ISection(props: React.HTMLAttributes<HTMLElement>) {
  return <i-section {...props} />;
}

export function ISectionHeader(props: React.HTMLAttributes<HTMLElement>) {
  const { children, ...rest } = props;

  return (
    <i-section-header {...rest}>
      <h4>{children}</h4>
    </i-section-header>
  );
}

export function ISectionSubHeader(props: React.HTMLAttributes<HTMLElement>) {
  const { children, ...rest } = props;

  return (
    <i-section-sub-header {...rest}>
      <h6>{children}</h6>
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

/* =========================
 * ISectionTab
 * ========================= */

export type ISectionTabProps = {
  title?: string;
  opened?: boolean;
  badge?: ISectionTabBadge;

  header?: React.ReactNode;
  children?: React.ReactNode;
};

export function ISectionTab(_props: ISectionTabProps) {
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

function DefaultHeader(props: {
  title: string;
  badgeEnabled: boolean;
  badgeValue: number | null;
}) {
  const { title, badgeEnabled, badgeValue } = props;

  return (
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
}

function normalizeTab(
  node: React.ReactNode,
  index: number
): NormalizedTab | null {
  if (!React.isValidElement(node)) return null;
  if ((node.type as any) !== ISectionTab) return null;

  const props = node.props as ISectionTabProps;

  const title = String(props.title ?? '');
  const opened = parseOpened(props.opened);

  const parsed = parseBadge(props.badge);

  const headerNode =
    props.header !== undefined && props.header !== null ? (
      props.header
    ) : (
      <DefaultHeader
        title={title}
        badgeEnabled={parsed.enabled}
        badgeValue={parsed.value}
      />
    );

  return {
    key: (node.key as string) ?? `tab-${index}`,
    title,
    opened,
    badgeEnabled: parsed.enabled,
    badgeValue: parsed.value,
    headerNode,
    contentNode: props.children ?? null,
  };
}

/* =========================
 * ISectionTabs
 * ========================= */

export type ISectionTabsProps = React.HTMLAttributes<HTMLElement> & {
  selectedIndex?: number | null;
  onSelectedIndexChange?: (index: number) => void;
  height?: ISectionTabsHeight;
  children?: React.ReactNode;
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

  const contentHeightPx = useMemo(() => parseTabsHeight(height), [height]);

  const isFixedHeight = contentHeightPx !== null;

  const hasValidControlledIndex =
    selectedIndex !== null &&
    selectedIndex !== undefined &&
    isValidIndex(selectedIndex, tabs.length);

  const computeNextIndex = useCallback((): number => {
    if (hasValidControlledIndex) return selectedIndex as number;
    if (openedIndex >= 0 && isValidIndex(openedIndex, tabs.length))
      return openedIndex;
    return 0;
  }, [hasValidControlledIndex, selectedIndex, openedIndex, tabs.length]);

  const [activeIndex, setActiveIndex] = useState<number>(() =>
    computeNextIndex()
  );

  useEffect(() => {
    setActiveIndex(computeNextIndex());
  }, [computeNextIndex]);

  const activeTab = tabs[activeIndex] ?? null;

  const setActive = useCallback(
    (index: number, emit: boolean) => {
      if (!isValidIndex(index, tabs.length)) return;

      setActiveIndex(index);

      if (emit) {
        onSelectedIndexChange?.(index);
      }
    },
    [onSelectedIndexChange, tabs.length]
  );

  return (
    <i-section-tabs className={className} {...rest}>
      <div className="i-section-tabs-headers" role="tablist">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

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
              onClick={() => setActive(index, true)}>
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
