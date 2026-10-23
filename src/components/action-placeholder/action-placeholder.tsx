import type { IButtonSize } from '../button';
export interface IActionPlaceholderProps {
  size?: IButtonSize;
  className?: string;
}
export function IActionPlaceholder({
  size = 'md',
  className,
}: IActionPlaceholderProps) {
  return (
    <i-action-placeholder
      class={['i-action-placeholder', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        width: `max(var(--i-size-${size}), calc(var(--i-icon-${size}) + 2 * var(--i-padding-${size})))`,
        height: `var(--i-size-${size})`,
      }}
    />
  );
}
