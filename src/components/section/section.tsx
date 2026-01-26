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

function parseBadge(v: any): { enabled: boolean; value: number | null } {
  if (!isTruthyAttr(v)) return { enabled: false, value: null };

  const raw = String(v).trim();
  if (raw === '' || raw.toLowerCase() === 'true')
    return { enabled: true, value: null };

  const n = Number(raw);
  // Angular: finite integer >= 0, else dot
  if (Number.isFinite(n) && Number.isInteger(n) && n >= 0) {
    return { enabled: true, value: n };
  }

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

function isValidIndex(index: any, len: number): index is number {
  return Number.isInteger(index) && index >= 0 && index < len;
}

/* =========================
 * ISection (shell components)
 * ========================= */

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

/* =========================
 * ISectionTab (declarative)
 * ========================= */

export type ISectionTabProps = {
  title?: string;
  opened?: boolean;
  badge?: ISectionTabBadge;

  /**
   * If provided, overrides the default header (Angular parity:
   * <i-section-tab-header> replaces default header template).
   */
  header?: React.ReactNode;

  /** Content of the tab */
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

  /** Resolved header node: custom header OR default header template */
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

  // Must be <ISectionTab .../>
  if ((node.type as any) !== ISectionTab) return null;

  const props = node.props as ISectionTabProps;

  const title = String(props.title ?? '');
  const opened = !!props.opened;

  const parsed = parseBadge(props.badge);
  const badgeEnabled = parsed.enabled;
  const badgeValue = parsed.value;

  // Angular parity:
  // - header template overrides default header template
  const headerNode =
    props.header !== undefined && props.header !== null ? (
      props.header
    ) : (
      <DefaultHeader
        title={title}
        badgeEnabled={badgeEnabled}
        badgeValue={badgeValue}
      />
    );

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

/* =========================
 * ISectionTabs
 * ========================= */

export type ISectionTabsProps = React.HTMLAttributes<HTMLElement> & {
  /** optional controlled mode */
  selectedIndex?: number | null;

  /** ✅ on* prefix (Angular parity) */
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
  const contentHeightPx = useMemo(() => parseTabsHeight(height), [height]);
  const isFixedHeight = contentHeightPx !== null;

  // Angular parity:
  // "controlled" only if selectedIndex is valid for current tabs
  const hasValidControlledIndex = useMemo(
    () =>
      selectedIndex !== null &&
      selectedIndex !== undefined &&
      isValidIndex(selectedIndex, tabs.length),
    [selectedIndex, tabs.length]
  );

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
    // Sync when children change or selectedIndex changes.
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

  const activateByIndex = useCallback(
    (index: number) => {
      setActive(index, true);
    },
    [setActive]
  );

  return (
    <i-section-tabs className={className} {...rest}>
      {/* Angular DOM: .i-section-tabs-headers / .i-section-tabs-header */}
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
              onClick={() => activateByIndex(index)}>
              {/* Angular parity: render ONLY headerTpl */}
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
