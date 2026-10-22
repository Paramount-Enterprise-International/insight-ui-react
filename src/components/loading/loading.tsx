// loading.tsx
import type { HTMLAttributes } from 'react';

export type ILoadingMode = 'inline' | 'container' | 'fullpage';

export type ILoadingProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  label?: string;
  light?: boolean;
  mode?: ILoadingMode;
};

export function ILoading(props: ILoadingProps) {
  const {
    label = 'Loading..',
    light = false,
    mode = 'inline',
    ...rest
  } = props;
  const page = mode !== 'inline';

  return (
    <i-loading
      mode={mode}
      light={light ? 'true' : undefined}
      role={page ? 'status' : undefined}
      aria-live={page ? 'polite' : undefined}
      {...rest}>
      <div
        className={`spinner-border spinner-border-sm${light ? ' light' : ''}`}
        role={page ? undefined : 'status'}
        aria-hidden={page ? 'true' : undefined}></div>
      {label}
      {page && !label ? <span className="sr-only">Loading...</span> : null}
    </i-loading>
  );
}
