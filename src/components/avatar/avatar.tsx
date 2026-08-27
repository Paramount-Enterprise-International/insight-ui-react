import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { IIcon, type IIconSize } from '../icon';

const SIZE_PRESETS: Record<IIconSize, number> = {
  '3xs': 12,
  '2xs': 16,
  xs: 20,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
  '3xl': 160,
  '4xl': 200,
};

export type IAvatarShape = 'circle' | 'square' | 'rounded-square';
export type IAvatarSize = number | IIconSize;

export type IAvatarProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> & {
  /** Primary image URL. Falls back to `fallbackSrc`, then the user icon. */
  src?: string | null;
  alt?: string;
  size?: IAvatarSize;
  shape?: IAvatarShape;
  fallbackSrc?: string | null;
};

function resolveIconSize(size: number): IIconSize {
  if (size <= 24) return 'sm';
  if (size <= 40) return 'md';
  if (size <= 64) return 'lg';
  if (size <= 96) return 'xl';
  if (size <= 128) return '2xl';
  if (size <= 160) return '3xl';
  return '4xl';
}

function resolvePixelSize(size: IAvatarSize): number {
  return typeof size === 'number' ? size : SIZE_PRESETS[size];
}

export function IAvatar(props: IAvatarProps) {
  const {
    src,
    alt = '',
    size = 40,
    shape = 'circle',
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
  const iconSize = typeof size === 'string' ? size : resolveIconSize(size);
  const hostStyle = useMemo<CSSProperties>(
    () => ({ width: pixelSize, height: pixelSize, ...style }),
    [pixelSize, style]
  );
  const imageSource = !hasSourceError && src ? src : undefined;
  const fallbackImageSource = !imageSource && !hasFallbackError && fallbackSrc
    ? fallbackSrc
    : undefined;

  return (
    <i-avatar
      {...rest}
      class={['i-avatar', className].filter(Boolean).join(' ')}
      data-shape={shape}
      style={hostStyle}>
      {imageSource ? (
        <img alt={alt} src={imageSource} onError={() => setHasSourceError(true)} />
      ) : fallbackImageSource ? (
        <img
          alt={alt}
          src={fallbackImageSource}
          onError={() => setHasFallbackError(true)}
        />
      ) : (
        <IIcon aria-label="User avatar" icon="user" size={iconSize} />
      )}
    </i-avatar>
  );
}