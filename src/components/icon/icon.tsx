// icon.tsx
import type React from 'react';
import { I_ICON_NAMES, I_ICON_SIZES } from './icon.constants';

export type IIconName = keyof typeof I_ICON_NAMES;
export type IIconSize = keyof typeof I_ICON_SIZES;

/**
 * ✅ Autocomplete for aliases (IIconName),
 * ✅ Still allow ANY string (raw FA classes, custom classes, etc.)
 */
export type IIconInput = IIconName | (string & {});

export type IIconProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  icon: IIconInput;
  size?: IIconSize;
};

export function IIcon(props: IIconProps) {
  const { icon, size = 'md', className, ...rest } = props;

  const iconSizeClass = I_ICON_SIZES[size] ?? I_ICON_SIZES.md;

  // If icon is a known alias, map it. Otherwise treat it as raw class string.
  const baseClass =
    (I_ICON_NAMES as Record<string, string>)[icon] ?? String(icon);

  const innerClass = `${baseClass} ${iconSizeClass}`.trim();

  return (
    <i-icon className={className} size={size} {...rest}>
      <i className={innerClass} />
    </i-icon>
  );
}
