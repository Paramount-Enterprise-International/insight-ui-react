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

export type IErrorPageProps = HTMLAttributes<HTMLDivElement> & {
  kind?: IErrorPageKind;
  mode?: IErrorPageMode;
  description?: string;
  icon?: string;
  code?: string;
  supportEmail?: string;
  actions?: readonly IErrorPageAction[];
  onAction?: (action: IErrorPageAction) => void;
  customActions?: ReactNode;
};

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
      {resolved.title ? <h1 className="m-0 text-3xl font-normal">{resolved.title}</h1> : null}
      <div className="i-error-page__message text-md text-subtle leading-relaxed">
        {resolved.description ? (
          <p className="m-0 text-subtle leading-relaxed">{resolved.description}</p>
        ) : null}
        <div className="i-error-page__extra">{children}</div>
        {supportEmail ? (
          <p className="m-0 text-subtle leading-relaxed">
            {kind === 'application-access-denied'
              ? 'Please contact the IT Administrator to register your access:'
              : 'For assistance, please contact:'}
            <a
              className="i-error-page__support text-primary font-medium underline"
              href={`mailto:${supportEmail}`}
            >
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
            onClick={() => onAction?.(action)}
          >
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
      {...rest}
    >
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
