import type { IErrorContext, IErrors, IFormControlErrorMessage } from './form.types';

type MinMaxLengthError = { requiredLength: number; actualLength: number };

// ---------- type guards ----------
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function hasNumber(
  obj: Record<string, unknown>,
  key: string
): obj is Record<string, unknown> & Record<string, number> {
  return typeof obj[key] === 'number';
}

function asMinMaxLengthError(err: unknown): MinMaxLengthError | null {
  if (!isRecord(err)) return null;
  if (!hasNumber(err, 'requiredLength')) return null;
  if (!hasNumber(err, 'actualLength')) return null;
  return { requiredLength: err.requiredLength, actualLength: err.actualLength };
}

function readNumber(err: unknown, key: 'min' | 'max'): number | null {
  if (!isRecord(err)) return null;
  const v = err[key];
  return typeof v === 'number' ? v : null;
}

// ---------- defaults ----------
const DEFAULT_ERROR_FACTORIES: Record<string, (ctx: IErrorContext) => string> = {
  required: ({ label }) => `${label || 'This field'} is required.`,
  requiredTrue: ({ label }) => `Please confirm ${label || 'this field'}.`,

  minlength: ({ label, error }) => {
    const e = asMinMaxLengthError(error);
    if (!e) return `${label || 'This field'} is too short.`;
    return `${label || 'This field'} must be at least ${e.requiredLength} characters (currently ${e.actualLength}).`;
  },

  maxlength: ({ label, error }) => {
    const e = asMinMaxLengthError(error);
    if (!e) return `${label || 'This field'} is too long.`;
    return `${label || 'This field'} must be at most ${e.requiredLength} characters (currently ${e.actualLength}).`;
  },

  pattern: ({ label }) => `${label || 'This field'} format is invalid.`,
  email: ({ label }) => `Please enter a valid ${label || 'email'}.`,

  min: ({ label, error }) => {
    const min = readNumber(error, 'min');
    return min === null
      ? `${label || 'This field'} is too small.`
      : `${label || 'This field'} must be ≥ ${min}.`;
  },

  max: ({ label, error }) => {
    const max = readNumber(error, 'max');
    return max === null
      ? `${label || 'This field'} is too large.`
      : `${label || 'This field'} must be ≤ ${max}.`;
  },
};

export type ResolveControlErrorMessageArgs = {
  errors: IErrors | null | undefined;
  label?: string;
  errorMessage?: IFormControlErrorMessage;
  extraFactories?: Record<string, (ctx: IErrorContext) => string>;
  control?: unknown;
};

export function resolveControlErrorMessage({
  errors,
  label,
  errorMessage,
  extraFactories = {},
  control,
}: ResolveControlErrorMessageArgs): string | null {
  if (!errors) return null;

  const keys = Object.keys(errors);
  if (keys.length === 0) return null;

  const key = keys[0];
  const err = errors[key];
  const trimmedLabel = (label || '').trim();

  const ctx: IErrorContext = {
    label: trimmedLabel,
    error: err,
    control,
  };

  // 1) custom template via errorMessage
  const customTpl = errorMessage?.[key];
  if (customTpl) {
    return interpolate(customTpl, ctx);
  }

  // 2) factory
  const factories = { ...DEFAULT_ERROR_FACTORIES, ...extraFactories };
  const factory = factories[key];
  if (factory) return factory(ctx);

  // 3) fallback
  return `${trimmedLabel || 'This field'} is invalid.`;
}

export function isControlRequired(args: {
  errors?: IErrors | null;
  errorMessage?: IFormControlErrorMessage;
}): boolean {
  const { errors, errorMessage } = args;
  const hasCustomRequired = !!errorMessage?.required;
  const hasRequiredError = !!errors?.required;
  return hasCustomRequired || hasRequiredError;
}

function interpolate(tpl: string, ctx: IErrorContext): string {
  const err = isRecord(ctx.error) ? ctx.error : {};

  const map: Record<string, unknown> = {
    label: ctx.label || 'This field',
    requiredLength: typeof err.requiredLength === 'number' ? err.requiredLength : undefined,
    actualLength: typeof err.actualLength === 'number' ? err.actualLength : undefined,
    min: typeof err.min === 'number' ? err.min : undefined,
    max: typeof err.max === 'number' ? err.max : undefined,
    ...err,
  };

  return tpl.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const v = map[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}
