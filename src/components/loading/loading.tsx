// loading.tsx
import type { HTMLAttributes } from 'react';

export type ILoadingProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  label?: string;
  light?: boolean;
};

export function ILoading(props: ILoadingProps) {
  const { label = 'Loading..', light = false, className, ...rest } = props;

  return (
    <i-loading className={className} light={light ? '' : undefined} {...rest}>
      <div
        className={[
          'spinner-border',
          'spinner-border-sm',
          light ? 'light' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        role="status"
      />
      {label ? ` ${label}` : null}
    </i-loading>
  );
}
