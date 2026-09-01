import { describe, expect, it, vi } from 'vitest';

import { normalizeApiError, resolveApiErrorDisplayMessage } from './api-error';

describe('API error helpers', () => {
  it('normalizes the current backend contract and preserves extensions', () => {
    const normalized = normalizeApiError({
      error: {
        errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND',
        message: 'The requested assignment was not found.',
        revision: 3,
        traceId: 'trace-123',
      },
      status: 404,
      message: 'HTTP transport message',
    });

    expect(normalized).toMatchObject({
      errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND',
      message: 'The requested assignment was not found.',
      revision: 3,
      status: 404,
      traceId: 'trace-123',
    });
  });

  it('uses backend message before catalog, then legacy and local fallbacks', () => {
    const catalogResolver = vi.fn(() => 'Catalog message');

    expect(
      resolveApiErrorDisplayMessage(
        { errorCode: 'USER_NOT_FOUND', message: 'Backend message', detail: 'Legacy detail' },
        'Local fallback',
        catalogResolver,
      ),
    ).toBe('Backend message');
    expect(catalogResolver).not.toHaveBeenCalled();

    expect(resolveApiErrorDisplayMessage({ errorCode: 'USER_NOT_FOUND', revision: 4 }, 'Local fallback', catalogResolver)).toBe(
      'Catalog message',
    );
    expect(catalogResolver).toHaveBeenCalledWith('USER_NOT_FOUND', 4, expect.any(Object));
    expect(resolveApiErrorDisplayMessage({ detail: 'Legacy detail' }, 'Local fallback')).toBe('Legacy detail');
    expect(resolveApiErrorDisplayMessage({}, 'Local fallback')).toBe('Local fallback');
  });

  it('does not treat a transport status message as a backend message', () => {
    const catalogResolver = vi.fn(() => 'Catalog message');
    const error = {
      error: { errorCode: 'AUTH_SESSION_REVOKED', detail: 'Legacy detail' },
      message: 'Unauthorized',
      status: 401,
    };

    expect(resolveApiErrorDisplayMessage(error, 'Local fallback', catalogResolver)).toBe('Catalog message');
  });
});
