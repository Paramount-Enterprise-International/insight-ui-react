import React, { useCallback, useMemo, useRef } from 'react';
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
 * ITextArea
 * ========================= */

export type ITextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'defaultValue' | 'onChange' | 'readOnly'
> & {
  value?: string; // Angular allows null; React uses empty string as default
  invalid?: boolean;

  disabled?: boolean;
  readonly?: boolean;

  rows?: number;
  placeholder?: string;

  onChange?: (value: string) => void;
};

export function ITextArea(props: ITextAreaProps) {
  const {
    value = '',
    invalid = false,

    disabled = false,
    readonly = false,

    rows = 3,
    placeholder = '',

    onChange,
    ...rest
  } = props;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Angular parity: click anywhere on <i-textarea> focuses the inner textarea
  const handleHostClick = useCallback(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  return (
    <i-textarea onClick={handleHostClick}>
      <textarea
        {...rest}
        ref={textareaRef}
        aria-invalid={invalid ? 'true' : undefined}
        disabled={disabled}
        readOnly={readonly}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
      />
    </i-textarea>
  );
}

/* =========================
 * IFCTextArea
 * ========================= */

export type IFCTextAreaProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange'
> & {
  // UI inputs (match Angular)
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  rows?: number;
  errorMessage?: IFormControlErrorMessage;

  // Value (React-controlled)
  value?: string;
  onChange?: (value: string) => void;

  /**
   * React-only adapters (Angular derives these from NgControl/FormGroupDirective):
   * Keep optional so React users can integrate with any form lib.
   */
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;

  /** maps to errorMessage[errorKey]; Angular resolves by control error keys */
  errorKey?: string;
};

export function IFCTextArea(props: IFCTextAreaProps) {
  const {
    label = '',
    placeholder = '',
    readonly = false,
    rows = 3,
    errorMessage,

    value = '',
    onChange,

    disabled = false,
    invalid = false,
    required = false,

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

      <ITextArea
        placeholder={placeholder}
        readonly={readonly}
        rows={rows}
        value={value}
        invalid={invalid}
        disabled={disabled}
        onChange={(v) => onChange?.(v)}
      />

      {invalid && resolvedErrorText ? (
        <div className="i-fc-textarea__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-textarea>
  );
}
