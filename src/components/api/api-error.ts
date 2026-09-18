/** Normalized current and legacy backend error fields with extension metadata. */
export type INormalizedApiError = {
  status?: number;
  errorCode?: string;
  code?: string;
  message?: string;
  revision?: number;
  detail?: string;
  title?: string;
  retryAfter?: number;
  [key: string]: unknown;
};

/** Optional synchronous catalog lookup supplied by the consumer application. */
export type IApiErrorCatalogResolver = (
  errorCode: string,
  revision: number | undefined,
  error: INormalizedApiError
) => string | null | undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readString = (
  value: Record<string, unknown>,
  key: string
): string | undefined => {
  const candidate = value[key];
  return typeof candidate === 'string' && candidate.trim().length > 0
    ? candidate
    : undefined;
};

const readNumber = (
  value: Record<string, unknown>,
  key: string
): number | undefined => {
  const candidate = value[key];
  return typeof candidate === 'number' && Number.isFinite(candidate)
    ? candidate
    : undefined;
};

/** Normalize current catalog errors, legacy Problem Details, and raw transport errors. */
export function normalizeApiError(error: unknown): INormalizedApiError {
  const transport = isRecord(error) ? error : {};
  const nestedBody = isRecord(transport.error) ? transport.error : undefined;
  const body = nestedBody ?? transport;

  return {
    ...body,
    status: readNumber(transport, 'status') ?? readNumber(body, 'status'),
    errorCode:
      readString(body, 'errorCode') ??
      readString(body, 'code') ??
      readString(transport, 'errorCode') ??
      readString(transport, 'code'),
    code: readString(body, 'code') ?? readString(transport, 'code'),
    message: readString(body, 'message') ?? readString(body, 'Message'),
    revision: readNumber(body, 'revision') ?? readNumber(transport, 'revision'),
    detail: readString(body, 'detail'),
    title: readString(body, 'title'),
    retryAfter:
      readNumber(body, 'retryAfter') ?? readNumber(transport, 'retryAfter'),
  };
}

/** Optional application-owned formatting of a normalized backend error. */
export type IApiErrorDisplayFormatter = (
  error: INormalizedApiError
) => string | null | undefined;

/** Format common field-validation dictionaries without changing the error payload. */
export function formatApiFieldErrors(
  error: INormalizedApiError
): string | undefined {
  const fields = error.errors ?? error.ModelState;
  if (!isRecord(fields)) return undefined;
  const parts = Object.entries(fields).flatMap(([field, value]) => {
    const messages = (Array.isArray(value) ? value : [value]).filter(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0
    );
    return messages.length
      ? [`${field.replace(/^model\./i, '')}: ${messages.join(', ')}`]
      : [];
  });
  return parts.length ? parts.join('; ') : undefined;
}

/** Resolve display text without changing the canonical backend error fields. */
export function resolveApiErrorDisplayMessage(
  error: unknown,
  localFallback: string,
  catalogResolver?: IApiErrorCatalogResolver,
  formatter?: IApiErrorDisplayFormatter
): string {
  const normalized = normalizeApiError(error);
  try {
    const formatted = formatter?.(normalized);
    if (formatted?.trim()) return formatted;
  } catch {
    // Optional formatters fall back to the default display behavior.
  }
  const validation = formatApiFieldErrors(normalized);
  if (validation) return validation;
  if (normalized.message) return normalized.message;

  if (catalogResolver && normalized.errorCode) {
    try {
      const catalogMessage = catalogResolver(
        normalized.errorCode,
        normalized.revision,
        normalized
      );
      if (catalogMessage?.trim()) return catalogMessage;
    } catch {
      // Catalog lookup is optional; failures safely fall through to legacy/local copy.
    }
  }

  return normalized.detail ?? normalized.title ?? localFallback;
}
