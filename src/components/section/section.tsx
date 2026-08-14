// section.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IIcon, type IIconSize } from '../icon';

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

function isTruthyAttr(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  const s = String(v).trim().toLowerCase();
  if (s === 'false' || s === '0' || s === 'null' || s === 'undefined')
    return false;
  return true;
}

function parseOpened(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  return `${v}` !== 'false';
}

function parseBadge(v: unknown): { enabled: boolean; value: number | null } {
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

function parseTabsHeight(v: unknown): number | null {
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

function isValidIndex(index: unknown, len: number): index is number {
  return (
    typeof index === 'number' &&
    Number.isInteger(index) &&
    index >= 0 &&
    index < len
  );
}

/* =========================
 * Shell Components
 * ========================= */

export function ISection(props: React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <i-section class={className} {...rest} />;
}

export function ISectionHeader(props: React.HTMLAttributes<HTMLElement>) {
  const { children, className, ...rest } = props;

  return (
    <i-section-header class={className} {...rest}>
      <h4>{children}</h4>
    </i-section-header>
  );
}

export function ISectionSubHeader(props: React.HTMLAttributes<HTMLElement>) {
  const { children, className, ...rest } = props;

  return (
    <i-section-sub-header class={className} {...rest}>
      <h6>{children}</h6>
    </i-section-sub-header>
  );
}

export function ISectionFilter(props: React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <i-section-filter class={className} {...rest} />;
}

export function ISectionBody(props: React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <i-section-body class={className} {...rest} />;
}

export function ISectionFooter(props: React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <i-section-footer class={className} {...rest} />;
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
  void _props;
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
  if ((node.type as unknown) !== ISectionTab) return null;

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
  sticky?: boolean;
  stickyTopOffset?: string;
  scrollable?: boolean;
  chevronSize?: Extract<IIconSize, 'sm' | 'md' | 'lg' | 'xl'>;
  tabMinHeight?: string;
  headerClass?: string;
  tabClass?: string;
  styleVariant?: 'default' | 'bar';
  children?: React.ReactNode;
};

export function ISectionTabs(props: ISectionTabsProps) {
  const {
    selectedIndex = null,
    onSelectedIndexChange,
    height = 'wrap',
    sticky = false,
    stickyTopOffset = '-16px',
    scrollable = false,
    chevronSize = 'lg',
    tabMinHeight = '',
    headerClass = '',
    tabClass = '',
    styleVariant = 'default',
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);

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
    if (!container || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);
    return () => observer.disconnect();
  }, [checkOverflow, tabs]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !scrollable) return;

    const activeHeader = container.querySelector<HTMLElement>(
      '.i-section-tabs-header.active'
    );
    if (typeof activeHeader?.scrollIntoView === 'function') {
      activeHeader.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
    checkOverflow();
  }, [activeIndex, checkOverflow, scrollable]);

  const activateFromKeyboard = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const lastIndex = tabs.length - 1;
      let nextIndex: number | null = null;

      if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = lastIndex;
      if (nextIndex === null) return;

      event.preventDefault();
      setActive(nextIndex, true);

      const headers = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '.i-section-tabs-header'
      );
      headers?.[nextIndex]?.focus();
    },
    [setActive, tabs.length]
  );

  const scrollBy = useCallback(
    (left: number) => {
      const container = scrollContainerRef.current;
      if (typeof container?.scrollBy === 'function') {
        container.scrollBy({ left, behavior: 'smooth' });
      }
    },
    []
  );

  return (
    <i-section-tabs
      class={[
        styleVariant === 'bar' ? 'i-section-tabs--bar' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}>
      <div
        className={[
          'i-section-tabs-headers',
          sticky ? 'i-section-tabs-headers--sticky' : null,
          headerClass,
        ]
          .filter(Boolean)
          .join(' ')}
        role="tablist"
        style={
          sticky
            ? { '--i-section-tabs-sticky-top': stickyTopOffset } as React.CSSProperties
            : undefined
        }>
        {scrollable ? (
          <button
            aria-label="Scroll tabs left"
            className={[
              'i-section-tabs-chevron',
              'i-section-tabs-chevron--left',
              !showLeftChevron ? 'hidden' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            onClick={() => scrollBy(-200)}>
            <IIcon icon="prev" size={chevronSize} />
          </button>
        ) : null}

        <div
          ref={scrollContainerRef}
          className={[
            'i-section-tabs-scroll',
            scrollable ? 'i-section-tabs-scroll--scrollable' : null,
          ]
            .filter(Boolean)
            .join(' ')}
          onScroll={checkOverflow}>
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={tab.key}
                className={[
                  'i-section-tabs-header',
                  isActive ? 'active' : null,
                  tabClass,
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="tab"
                type="button"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                style={tabMinHeight ? { minHeight: tabMinHeight } : undefined}
                onClick={() => setActive(index, true)}
                onKeyDown={(event) => activateFromKeyboard(event, index)}>
                {tab.headerNode}
              </button>
            );
          })}
        </div>

        {scrollable ? (
          <button
            aria-label="Scroll tabs right"
            className={[
              'i-section-tabs-chevron',
              'i-section-tabs-chevron--right',
              !showRightChevron ? 'hidden' : null,
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            onClick={() => scrollBy(200)}>
            <IIcon icon="next" size={chevronSize} />
          </button>
        ) : null}
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
