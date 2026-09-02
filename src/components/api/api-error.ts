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
export type ApiErrorCatalogResolver = (
  errorCode: string,
  revision: number | undefined,
  error: INormalizedApiError,
) => string | null | undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readString = (value: Record<string, unknown>, key: string): string | undefined => {
  const candidate = value[key];
  return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : undefined;
};

const readNumber = (value: Record<string, unknown>, key: string): number | undefined => {
  const candidate = value[key];
  return typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : undefined;
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
    message: readString(body, 'message'),
    revision: readNumber(body, 'revision') ?? readNumber(transport, 'revision'),
    detail: readString(body, 'detail'),
    title: readString(body, 'title'),
    retryAfter: readNumber(body, 'retryAfter') ?? readNumber(transport, 'retryAfter'),
  };
}

/** Resolve display text as backend message, catalog, legacy detail/title, then local fallback. */
export function resolveApiErrorDisplayMessage(
  error: unknown,
  localFallback: string,
  catalogResolver?: ApiErrorCatalogResolver,
): string {
  const normalized = normalizeApiError(error);
  if (normalized.message) return normalized.message;

  if (catalogResolver && normalized.errorCode) {
    try {
      const catalogMessage = catalogResolver(normalized.errorCode, normalized.revision, normalized);
      if (catalogMessage?.trim()) return catalogMessage;
    } catch {
      // Catalog lookup is optional; failures safely fall through to legacy/local copy.
    }
  }

  return normalized.detail ?? normalized.title ?? localFallback;
}
