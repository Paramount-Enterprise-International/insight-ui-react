// input.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { IButton, type IButtonVariant } from '../button';
import { IIcon, type IIconInput } from '../icon';
import { ILoading } from '../loading';

/* =========================================
 * Types: addons
 * ========================================= */

export type IInputAddonKind = 'icon' | 'text' | 'button' | 'link' | 'loading';

export type IInputAddonType = {
  type: IInputAddonKind;
};

export type IInputAddonLoading = {
  type: 'loading';
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonIcon = {
  type: 'icon';
  icon: IIconInput;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonText = {
  type: 'text';
  text: string;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonButton = {
  type: 'button';
  icon?: IIconInput;
  text?: string;
  variant?: IButtonVariant;
  onClick?: () => void;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonLink = {
  type: 'link';
  icon?: IIconInput;
  text: string;
  href: string;
  target?: string;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddons =
  | IInputAddonIcon
  | IInputAddonText
  | IInputAddonButton
  | IInputAddonLink
  | IInputAddonLoading;

/* =========================================
 * Types: mask
 * ========================================= */

export type IInputMaskType =
  | 'date'
  | 'integer'
  | 'number'
  | 'currency'
  | 'time';

export type IInputMask = {
  type: IInputMaskType;
  format?: string;
};

export type UseInputMaskOptions = {
  enableDefault?: boolean;
};

/**
 * React counterpart for Angular IInputMaskDirective:
 * - attaches listeners to the native <input/>
 * - formats and constrains value based on the mask
 *
 * NOTE: this is intentionally “best effort parity”.
 */
export function useInputMask(
  inputRef: React.RefObject<HTMLInputElement | null>,
  mask: IInputMask | undefined,
  opts: UseInputMaskOptions = {}
) {
  const defaultAppliedRef = useRef(false);
  const enableDefault = opts.enableDefault ?? true;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    // No mask => nothing to do
    if (!mask) return;

    const type = mask.type;

    // -------------------------------------
    // Helpers
    // -------------------------------------
    const emitNativeInput = () => {
      // Bubble a native "input" event so any listener on <i-input> can catch it
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const setValue = (v: string) => {
      el.value = v;
      emitNativeInput();
    };

    const digitsOnly = (s: string) => s.replace(/[^\d]/g, '');

    // -------------------------------------
    // Default application (date/time)
    // -------------------------------------
    if (enableDefault && !defaultAppliedRef.current) {
      if (type === 'date') {
        // best effort: do NOT auto-fill unless empty
        if (!el.value) {
          // leave empty to avoid surprising autofill
        }
        defaultAppliedRef.current = true;
      }
      if (type === 'time') {
        if (!el.value) {
          // leave empty
        }
        defaultAppliedRef.current = true;
      }
    }

    // -------------------------------------
    // Input constraint (best effort)
    // -------------------------------------
    const onBeforeInput = (e: InputEvent) => {
      // prevent non-digit chars for integer/number/currency/time/date (we sanitize anyway)
      // keep it permissive and sanitize on input
      void e;
    };

    const onInput = () => {
      const raw = el.value ?? '';

      if (type === 'integer') {
        const v = digitsOnly(raw);
        if (v !== raw) setValue(v);
        return;
      }

      if (type === 'number' || type === 'currency') {
        // allow digits and one dot, sanitize others
        const cleaned = raw
          .replace(/[^\d.]/g, '')
          .replace(/^(\d*\.?\d*).*$/, '$1'); // keep first dot only
        if (cleaned !== raw) setValue(cleaned);
        return;
      }

      if (type === 'date') {
        // minimal: digits + separators, no heavy formatting here
        const cleaned = raw.replace(/[^\d/-]/g, '');
        if (cleaned !== raw) setValue(cleaned);
        return;
      }

      if (type === 'time') {
        const cleaned = raw.replace(/[^\d:]/g, '');
        if (cleaned !== raw) setValue(cleaned);
        return;
      }
    };

    el.addEventListener('beforeinput', onBeforeInput as any);
    el.addEventListener('input', onInput);

    return () => {
      el.removeEventListener('beforeinput', onBeforeInput as any);
      el.removeEventListener('input', onInput);
    };
  }, [inputRef, mask, enableDefault]);
}

/* =========================================
 * IInputAddon (render)
 * ========================================= */

export type IInputAddonProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> & {
  addon: IInputAddons | undefined;
};

export function IInputAddon(props: IInputAddonProps) {
  const { addon, className, ...rest } = props;

  // Match Angular: render nothing when no addon or visible === false
  if (!addon || addon.visible === false) {
    return null;
  }

  return (
    <i-input-addon className={className} kind={addon.type} {...rest}>
      {addon.type === 'button' ? (
        <IButton
          size="xs"
          type="button"
          icon={addon.icon}
          variant={addon.variant ?? 'primary'}
          onClick={() => addon.onClick?.()}>
          {addon.text ?? null}
        </IButton>
      ) : addon.type === 'icon' ? (
        <IIcon icon={addon.icon} size="sm" />
      ) : addon.type === 'link' ? (
        <a
          href={addon.href}
          target={addon.target ?? undefined}
          rel="noopener noreferrer">
          {addon.icon ? <IIcon icon={addon.icon} size="sm" /> : null}
          {addon.text}
        </a>
      ) : addon.type === 'loading' ? (
        <ILoading />
      ) : (
        <span>{addon.text}</span>
      )}
    </i-input-addon>
  );
}

/* =========================================
 * IInput (Angular parity)
 * ========================================= */

export type IInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children' | 'value' | 'defaultValue' | 'readOnly'
> & {
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  invalid?: boolean;
  disabled?: boolean;

  mask?: IInputMask;

  prepend?: IInputAddons | IInputAddons[];
  append?: IInputAddons | IInputAddons[] | IInputAddonLoading;

  value?: string | null;

  /**
   * ✅ expose inner input ref (ViewChild vibe)
   * Must be MutableRefObject because we assign .current
   */
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

function normalizeArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/**
 * ✅ forwardRef supported:
 * <IInput ref={...} />
 * ✅ inputRef supported:
 * <IInput inputRef={...} />
 *
 * Both point to the INNER <input>
 */
export const IInput = React.forwardRef<HTMLInputElement, IInputProps>(
  function IInput(props, forwardedRef) {
    const {
      type = 'text',
      placeholder = '',
      autocomplete,
      readonly = false,
      invalid = false,
      disabled = false,
      mask,
      prepend,
      append,
      value,
      className,
      onInput,
      onBlur,
      inputRef,
      ...rest
    } = props;

    const innerRef = useRef<HTMLInputElement | null>(null);

    // Mask parity
    useInputMask(innerRef, mask);

    const prepends = useMemo(() => normalizeArray(prepend), [prepend]);
    const appends = useMemo(() => normalizeArray(append as any), [append]);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (inputRef) {
        inputRef.current = node;
      }

      if (!forwardedRef) return;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else forwardedRef.current = node;
    };

    // Click anywhere on <i-input> focuses inner input, except clicks on addons
    const handleHostClick: React.MouseEventHandler<HTMLElement> = (e) => {
      if (disabled) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest?.('i-input-addon')) return;

      innerRef.current?.focus();
    };

    return (
      <i-input className={className} onClick={handleHostClick}>
        {prepends.map((a, idx) => (
          <IInputAddon key={`prepend-${idx}`} addon={a} />
        ))}

        <input
          {...rest}
          ref={setRefs}
          aria-invalid={invalid ? 'true' : undefined}
          autoComplete={autocomplete ?? undefined}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readonly}
          type={type}
          value={value ?? ''}
          onInput={onInput}
          onBlur={onBlur}
        />

        {appends.map((a: any, idx: number) => (
          <IInputAddon key={`append-${idx}`} addon={a} />
        ))}
      </i-input>
    );
  }
);

/* =========================================
 * IFCInput (React wrapper)
 * ========================================= */

export type IFCInputProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> & {
  label?: string;

  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  type?: string;

  mask?: IInputMask;

  prepend?: IInputProps['prepend'];
  append?: IInputProps['append'];

  value?: string | null;

  /**
   * In Angular, invalid/error are derived from NgControl.
   * In React, you supply them (works with any form lib).
   */
  invalid?: boolean;
  errorMessage?: string | null;

  disabled?: boolean;
  required?: boolean;

  onInput?: React.FormEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  children?: React.ReactNode;
};

export function IFCInput(props: IFCInputProps) {
  const {
    label = '',
    placeholder = '',
    autocomplete,
    readonly = false,
    type = 'text',
    mask,
    prepend,
    append,
    value,
    invalid = false,
    errorMessage = null,
    disabled = false,
    required = false,
    onInput,
    onBlur,
    children,
    className,
    ...hostProps
  } = props;

  // ✅ focus target for label click
  const innerRef = useRef<HTMLInputElement | null>(null);

  const focusInnerInput = () => {
    if (!disabled) {
      innerRef.current?.focus();
    }
  };

  return (
    <i-fc-input className={className} {...hostProps}>
      {label ? (
        <label className="i-fc-input__label" onClick={focusInnerInput}>
          {label} :{' '}
          {required ? <span className="i-fc-input__required">*</span> : null}
        </label>
      ) : null}

      <IInput
        inputRef={innerRef}
        placeholder={placeholder}
        autocomplete={autocomplete}
        readonly={readonly}
        type={type}
        mask={mask}
        prepend={prepend}
        append={append}
        value={value ?? ''}
        invalid={invalid}
        disabled={disabled}
        onInput={onInput}
        onBlur={onBlur}
      />

      {invalid && errorMessage ? (
        <div className="i-fc-input__error">{errorMessage}</div>
      ) : null}

      {children}
    </i-fc-input>
  );
}
