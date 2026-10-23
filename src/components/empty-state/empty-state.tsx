import type { HTMLAttributes, ReactNode } from 'react';
import { IIcon } from '../icon';
import { I_EMPTY_STATE_PRESETS } from './empty-state-presets';
export type IEmptyStateKind =
  | 'empty'
  | 'search'
  | 'filter'
  | 'search-filter'
  | 'prerequisite';
export type IEmptyStateDensity = 'default' | 'compact';
export interface IEmptyStateConfig {
  kind?: IEmptyStateKind;
  title?: string;
  description?: string;
  icon?: string;
  density?: IEmptyStateDensity;
}
export interface IEmptyStateProps
  extends IEmptyStateConfig, Omit<HTMLAttributes<HTMLElement>, 'title'> {
  children?: ReactNode;
}
export function IEmptyState({
  kind = 'empty',
  title,
  description,
  icon,
  density = 'default',
  children,
  className,
  ...rest
}: IEmptyStateProps) {
  const preset = I_EMPTY_STATE_PRESETS[kind];
  return (
    <i-empty-state
      {...rest}
      class={['i-empty-state', className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
      data-empty-state-kind={kind}
      density={density}>
      <IIcon icon={icon || preset.icon} size="lg" aria-hidden="true" />
      <p className="i-empty-state__title">{title || preset.title}</p>
      {description || preset.description ? (
        <p className="i-empty-state__description">
          {description || preset.description}
        </p>
      ) : null}
      {children}
    </i-empty-state>
  );
}
