import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ILoading } from '../loading';
export type ISurfaceLayout = 'auto' | 'padded' | 'flush';
export interface ILoadingRegionProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'children'
> {
  loading?: boolean;
  error?: unknown;
  label?: string;
  contextKey?: unknown;
  initialMinHeight?: string;
  height?: string | null;
  containerClass?: string;
  contentClass?: string;
  layout?: ISurfaceLayout;
  children?: ReactNode | ((state: { hasLoaded: boolean }) => ReactNode);
}
export function ILoadingRegion({
  loading = false,
  error = null,
  label = 'Loading...',
  contextKey = null,
  initialMinHeight = 'var(--i-state-min-height, min(40vh, 240px))',
  height,
  containerClass = '',
  contentClass = 'flex flex-col',
  layout = 'auto',
  children,
  className,
  style,
  ...rest
}: ILoadingRegionProps) {
  const content = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState<{
    hasLoaded: boolean;
    context: unknown;
  }>({ hasLoaded: false, context: null });
  const [measuredHeight, setMeasuredHeight] = useState(0);
  useLayoutEffect(() => {
    const element = content.current;
    if (!element) return;
    element.toggleAttribute('inert', loading);
    if (loading) {
      const size = element.getBoundingClientRect().height;
      if (size > 0) setMeasuredHeight(size);
      return;
    }
    if (!error)
      setCompleted((previous) =>
        previous.hasLoaded && previous.context === contextKey
          ? previous
          : { hasLoaded: true, context: contextKey }
      );
    const Observer = element.ownerDocument.defaultView?.ResizeObserver;
    if (!Observer) return;
    const observer = new Observer((entries) => {
      const size = entries[0]?.contentRect.height ?? 0;
      setMeasuredHeight((previous) => (previous === size ? previous : size));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading, error, contextKey]);
  return (
    <i-loading-region
      {...rest}
      class={['i-loading-region', className].filter(Boolean).join(' ')}
      data-i-surface="delegate"
      layout={layout}
      style={
        {
          ...style,
          '--i-region-state-min-height': initialMinHeight,
        } as CSSProperties
      }>
      <div
        data-i-loading-container
        className={['i-loading-region__container', containerClass].join(' ')}
        data-layout={layout}
        style={{
          height: height ?? undefined,
          minHeight: loading
            ? completed.hasLoaded && measuredHeight > 0
              ? `${measuredHeight}px`
              : initialMinHeight
            : undefined,
        }}
        aria-busy={loading}>
        <div
          ref={content}
          data-layout={layout}
          data-i-loading-content
          className={[
            'i-loading-region__content i-surface-content',
            contentClass,
          ].join(' ')}
          style={{
            opacity: loading ? 0.45 : undefined,
            visibility:
              loading && completed.hasLoaded && completed.context !== contextKey
                ? 'hidden'
                : undefined,
          }}>
          {typeof children === 'function'
            ? children({ hasLoaded: completed.hasLoaded })
            : children}
        </div>
        {loading ? (
          <div className="i-loading-region__overlay">
            <div className="i-loading-region__indicator">
              <ILoading label={label} />
            </div>
          </div>
        ) : null}
      </div>
    </i-loading-region>
  );
}
