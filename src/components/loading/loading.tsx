// loading.tsx
import type { HTMLAttributes } from 'react';

export type ILoadingProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  label?: string;
  light?: boolean;
};

export function ILoading(props: ILoadingProps) {
  const { label = 'Loading..', light = false, ...rest } = props;

  return (
    <i-loading light={light ? 'true' : undefined} {...rest}>
      <div
        className={`spinner-border spinner-border-sm${light ? ' light' : ''}`}
        role="status"></div>
      {label}
    </i-loading>
  );
}
