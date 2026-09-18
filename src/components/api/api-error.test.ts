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
        {
          errorCode: 'USER_NOT_FOUND',
          message: 'Backend message',
          detail: 'Legacy detail',
        },
        'Local fallback',
        catalogResolver
      )
    ).toBe('Backend message');
    expect(catalogResolver).not.toHaveBeenCalled();

    expect(
      resolveApiErrorDisplayMessage(
        { errorCode: 'USER_NOT_FOUND', revision: 4 },
        'Local fallback',
        catalogResolver
      )
    ).toBe('Catalog message');
    expect(catalogResolver).toHaveBeenCalledWith(
      'USER_NOT_FOUND',
      4,
      expect.any(Object)
    );
    expect(
      resolveApiErrorDisplayMessage(
        { detail: 'Legacy detail' },
        'Local fallback'
      )
    ).toBe('Legacy detail');
    expect(resolveApiErrorDisplayMessage({}, 'Local fallback')).toBe(
      'Local fallback'
    );
  });

  it('does not treat a transport status message as a backend message', () => {
    const catalogResolver = vi.fn(() => 'Catalog message');
    const error = {
      error: { errorCode: 'AUTH_SESSION_REVOKED', detail: 'Legacy detail' },
      message: 'Unauthorized',
      status: 401,
    };

    expect(
      resolveApiErrorDisplayMessage(error, 'Local fallback', catalogResolver)
    ).toBe('Catalog message');
  });
});

describe('generic backend display formatting', () => {
  it('formats common messages and field validation without losing metadata', () => {
    const body = {
      Message: 'Validation failed',
      ModelState: {
        'model.Name': ['Required', 'Too long'],
        'model.Code': ['Invalid'],
      },
      traceId: 'trace',
    };
    expect(normalizeApiError({ error: body, status: 400 })).toMatchObject({
      message: 'Validation failed',
      ModelState: body.ModelState,
      traceId: 'trace',
    });
    expect(resolveApiErrorDisplayMessage({ error: body }, 'Fallback')).toBe(
      'Name: Required, Too long; Code: Invalid'
    );
    expect(
      resolveApiErrorDisplayMessage(
        { errors: { Name: ['Required'], Empty: [], Invalid: 42 } },
        'Fallback'
      )
    ).toBe('Name: Required');
    expect(
      resolveApiErrorDisplayMessage({ Message: 'Backend message' }, 'Fallback')
    ).toBe('Backend message');
  });

  it('supports application formatting with safe default fallbacks', () => {
    const body = { message: 'Backend message', detail: 'Detail' };
    expect(
      resolveApiErrorDisplayMessage(
        body,
        'Fallback',
        undefined,
        () => 'Custom message'
      )
    ).toBe('Custom message');
    expect(
      resolveApiErrorDisplayMessage(body, 'Fallback', undefined, () => ' ')
    ).toBe('Backend message');
    expect(
      resolveApiErrorDisplayMessage(body, 'Fallback', undefined, () => {
        throw new Error('failed');
      })
    ).toBe('Backend message');
    expect(
      resolveApiErrorDisplayMessage({ errors: { Name: [] } }, 'Fallback')
    ).toBe('Fallback');
  });
});
describe('canonical backend errors', () => {
  it('preserves status and message while formatting only display text', () => {
    const backend = {
      status: 400,
      message: 'Canonical backend message',
      Message: 'Alternate message',
      errors: { Name: ['Required'] },
      traceId: 'trace',
    };
    const normalized = normalizeApiError({
      status: 400,
      error: backend,
      message: 'Transport message',
    });
    expect(normalized.status).toBe(400);
    expect(normalized.message).toBe('Canonical backend message');
    expect(normalized['traceId']).toBe('trace');
    expect(
      resolveApiErrorDisplayMessage(
        normalized,
        'Fallback',
        undefined,
        () => 'Friendly display'
      )
    ).toBe('Friendly display');
    expect(normalized.status).toBe(400);
    expect(normalized.message).toBe('Canonical backend message');
    expect(backend.message).toBe('Canonical backend message');
  });
});
