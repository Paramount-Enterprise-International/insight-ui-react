import React, { useMemo } from 'react';
import type { IFormControlErrorMessage } from '../shared';

function resolveErrorMessage(
  label: string,
  errorKey: string,
  errorMessage?: IFormControlErrorMessage
): string | null {
  const tpl = errorMessage?.[errorKey];
  if (!tpl) return null;
  return tpl.replaceAll('{label}', label || 'This field');
}

/* =========================
 * ITextarea
 * ========================= */

export type ITextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange'
> & {
  value?: string; // ✅ no null
  invalid?: boolean;

  onChange?: (value: string) => void;
};

export function ITextarea(props: ITextareaProps) {
  const {
    value = '',
    invalid = false,
    disabled = false,
    readOnly = false,
    rows = 3,
    placeholder = '',
    onChange,
    ...rest
  } = props;

  return (
    <i-textarea>
      <textarea
        {...rest}
        aria-invalid={invalid ? 'true' : undefined}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
      />
    </i-textarea>
  );
}

/* =========================
 * IFCTextarea
 * ========================= */

export type IFCTextareaProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange'
> & {
  label?: string;
  placeholder?: string;

  value?: string; // ✅ no null
  onChange?: (value: string) => void;

  disabled?: boolean;
  readonly?: boolean;
  rows?: number;

  required?: boolean;
  invalid?: boolean;

  errorMessage?: IFormControlErrorMessage;
  errorKey?: string;
};

export function IFCTextarea(props: IFCTextareaProps) {
  const {
    label = '',
    placeholder = '',
    value = '',
    onChange,

    disabled = false,
    readonly = false,
    rows = 3,

    required = false,
    invalid = false,

    errorMessage,
    errorKey = 'required',

    ...hostProps
  } = props;

  const resolvedErrorText = useMemo(() => {
    if (!invalid) return null;
    return (
      resolveErrorMessage(label || 'This field', errorKey, errorMessage) ??
      `${label || 'This field'} is invalid`
    );
  }, [invalid, label, errorKey, errorMessage]);

  return (
    <i-fc-textarea {...hostProps}>
      {label ? (
        <label className="i-fc-textarea__label">
          {label} :{' '}
          {required ? <span className="i-fc-textarea__required">*</span> : null}
        </label>
      ) : null}

      <ITextarea
        placeholder={placeholder}
        value={value}
        invalid={invalid}
        disabled={disabled}
        readOnly={readonly}
        rows={rows}
        onChange={(v) => onChange?.(v)}
      />

      {invalid && resolvedErrorText ? (
        <div className="i-fc-textarea__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-textarea>
  );
}
