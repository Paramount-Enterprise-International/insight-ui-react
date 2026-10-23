import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react';
import {
  ImageCropperEngine,
  type IImageCropperExportOptions,
  type IImageCropperResult,
} from './image-cropper-engine';
export interface IImageCropperHandle {
  exportImage: (
    options?: IImageCropperExportOptions
  ) => Promise<IImageCropperResult>;
}
export interface IImageCropperProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onError'
> {
  src?: string | null;
  disabled?: boolean;
  viewportSize?: number;
  shape?: 'square' | 'circle';
  minZoom?: number;
  maxZoom?: number;
  alt?: string;
  zoomLabel?: string;
  panLabel?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}
export const IImageCropper = forwardRef<
  IImageCropperHandle,
  IImageCropperProps
>(function IImageCropper(
  {
    src,
    disabled = false,
    viewportSize = 240,
    shape = 'square',
    minZoom = 1,
    maxZoom = 3,
    alt = 'Image crop preview',
    zoomLabel = 'Zoom',
    panLabel = 'Reposition image using arrow keys or drag',
    onReady,
    onError,
    className,
    ...rest
  },
  ref
) {
  const [engine] = useState(() => new ImageCropperEngine());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, render] = useState(0);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
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
    void engine
      .load(src)
      .then((loaded) => {
        if (active) {
          setReady(loaded);
          if (loaded) callbacks.current.onReady?.();
        }
      })
      .catch((error: Error) => {
        if (active) callbacks.current.onError?.(error);
      })
      .finally(() => {
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
        try {
          return await engine.exportImage(options);
        } catch (error) {
          if (
            mounted.current &&
            !(error instanceof DOMException && error.name === 'AbortError')
          ) {
            callbacks.current.onError?.(
              error instanceof Error
                ? error
                : new Error('Unable to export image.')
            );
          }
          throw error;
        }
      },
    }),
    [engine]
  );
  return (
    <i-image-cropper
      {...rest}
      class={['i-image-cropper', className].filter(Boolean).join(' ')}>
      <div
        className={[
          'i-image-cropper__stage',
          shape === 'circle' ? 'i-image-cropper__stage--circle' : '',
        ].join(' ')}
        style={{ width: engine.size, height: engine.size }}
        tabIndex={disabled || !ready ? -1 : 0}
        role="group"
        aria-label={panLabel}
        aria-disabled={disabled}
        aria-busy={loading}
        onPointerDown={(event) => {
          if (disabled || !ready || event.button !== 0) return;
          event.preventDefault();
          pointer.current = {
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId,
          };
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          const point = pointer.current;
          if (disabled || !point || event.pointerId !== point.id) return;
          engine.panBy(event.clientX - point.x, event.clientY - point.y);
          point.x = event.clientX;
          point.y = event.clientY;
          render((value) => value + 1);
        }}
        onPointerUp={() => {
          pointer.current = null;
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
        onLostPointerCapture={() => {
          pointer.current = null;
        }}
        onKeyDown={(event) => {
          if (disabled || !ready) return;
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-5, 0],
            ArrowRight: [5, 0],
            ArrowUp: [0, -5],
            ArrowDown: [0, 5],
          };
          const move = moves[event.key];
          if (move) {
            event.preventDefault();
            engine.panBy(...move);
            render((value) => value + 1);
          }
        }}>
        {ready && src ? (
          <img
            className="i-image-cropper__image"
            src={src}
            alt={alt}
            draggable={false}
            style={engine.imageStyle ?? undefined}
          />
        ) : null}
        <span className="i-image-cropper__ring" aria-hidden="true" />
      </div>
      <label className="i-image-cropper__zoom">
        <span>{zoomLabel}</span>
        <input
          type="range"
          min={engine.minZoom}
          max={engine.maxZoom}
          step="0.05"
          value={engine.zoom}
          disabled={disabled || !ready}
          onChange={(event) => {
            if (!disabled && ready) {
              engine.setZoom(Number(event.target.value));
              render((value) => value + 1);
            }
          }}
        />
      </label>
    </i-image-cropper>
  );
});
