import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { IButton } from '../button/button';
import { IIcon } from '../icon/icon';
import { ISection, ISectionBody } from '../section/section';
import {
  I_ERROR_PAGE_ACTIONS,
  I_ERROR_PAGE_PRESETS,
  I_ERROR_PAGE_SUPPORT_EMAIL,
  type IErrorPageAction,
  type IErrorPageKind,
  type IErrorPageMode,
} from './error-page.types';

/** Configuration and content accepted by the shared error-page component. */
export type IErrorPageProps = HTMLAttributes<HTMLDivElement> & {
  /** Selects the default title, description, icon, and status code. */
  kind?: IErrorPageKind;
  /** Selects a section-contained or viewport-filling presentation. */
  mode?: IErrorPageMode;
  /** Overrides the preset description. */
  description?: string;
  /** Overrides the preset icon class. */
  icon?: string;
  /** Overrides the preset status code. */
  code?: string;
  /** Support address to display, or an empty string to hide support contact. */
  supportEmail?: string;
  /** Built-in recovery buttons to render in the supplied order. */
  actions?: readonly IErrorPageAction[];
  /** Reports a built-in action without performing navigation. */
  onAction?: (action: IErrorPageAction) => void;
  /** Additional controls rendered after the built-in actions. */
  customActions?: ReactNode;
};

/** Renders a preset or consumer-defined error state with optional recovery actions. */
export function IErrorPage({
  kind = 'not-found',
  mode = 'contained',
  title,
  description,
  icon,
  code,
  supportEmail = I_ERROR_PAGE_SUPPORT_EMAIL,
  actions = [],
  onAction,
  children,
  customActions,
  className,
  ...rest
}: IErrorPageProps): ReactElement {
  const preset = I_ERROR_PAGE_PRESETS[kind];
  const resolved = {
    title: title ?? preset.title,
    description: description ?? preset.description,
    icon: icon ?? preset.icon,
    code: code ?? preset.code,
  };
  const content = (
    <div className="i-error-page__content text-center">
      {resolved.icon || resolved.code ? (
        <div className="i-error-page__visual">
          {resolved.icon ? (
            <IIcon icon={resolved.icon} size="4xl" aria-hidden="true" />
          ) : null}
          {resolved.code ? (
            <span className="i-error-page__code font-bold leading-none">
              {resolved.code}
            </span>
          ) : null}
        </div>
      ) : null}
      {resolved.title ? (
        <h1 className="m-0 text-3xl font-normal">{resolved.title}</h1>
      ) : null}
      <div className="i-error-page__message text-md text-subtle leading-relaxed">
        {resolved.description ? (
          <p className="m-0 text-subtle leading-relaxed">
            {resolved.description}
          </p>
        ) : null}
        <div className="i-error-page__extra">{children}</div>
        {supportEmail ? (
          <p className="m-0 text-subtle leading-relaxed">
            {kind === 'application-access-denied'
              ? 'Please contact the IT Administrator to register your access:'
              : 'For assistance, please contact:'}
            <a
              className="i-error-page__support text-primary font-medium underline"
              href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        ) : null}
      </div>
      <div className="i-error-page__actions">
        {actions.map((action, index) => (
          <IButton
            key={`${action}-${index}`}
            type="button"
            icon={I_ERROR_PAGE_ACTIONS[action].icon}
            variant={I_ERROR_PAGE_ACTIONS[action].variant}
            onClick={() => onAction?.(action)}>
            {I_ERROR_PAGE_ACTIONS[action].label}
          </IButton>
        ))}
        {customActions}
      </div>
    </div>
  );

  return (
    <div
      className={[
        'i-error-page',
        kind === 'not-found' ? 'i-error-page--not-found' : '',
        mode === 'fullpage' ? 'i-error-page--fullpage' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}>
      {mode === 'contained' ? (
        <ISection className="i-error-page__section">
          <ISectionBody className="i-error-page__body">{content}</ISectionBody>
        </ISection>
      ) : (
        <div className="i-error-page__body">{content}</div>
      )}
    </div>
  );
}
