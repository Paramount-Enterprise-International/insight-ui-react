import { act, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { describe, expect, it, vi } from 'vitest';
import {
  IAuthContext,
  type IAuthContext as AuthContextValue,
} from '../auth/insight-auth-context';
import type { IUserMenuStore } from '../store/user-menu';
import {
  IMenuPermissionMappingProvider,
  validatePermissionMap,
  type IPermissionMap,
  type IPermissionMapConfig,
} from './permission-map';
import {
  evaluatePermission,
  IHasMn,
  INotHasMn,
  usePermission,
} from './use-permission';

const source = {
  menuCodes: ['export.code', 'direct.code'],
  roles: [],
  companyCodes: [],
  companies: [],
  menuCompanies: {},
};
function auth(children: ReactNode, initialized = true) {
  const store = {
    subscribe: () => () => undefined,
    getVersion: () => 0,
    initialized,
    initializing: false,
    authorizationSource: source,
  } as unknown as IUserMenuStore;
  return (
    <IAuthContext.Provider
      value={{ userMenuStore: store } as unknown as AuthContextValue}>
      {children}
    </IAuthContext.Provider>
  );
}
function Gates() {
  const allowed = usePermission('alias');
  return (
    <>
      <output>{String(allowed)}</output>
      <IHasMn value="alias">
        <span>allowed</span>
      </IHasMn>
      <INotHasMn value="alias">
        <span>denied</span>
      </INotHasMn>
      <IHasMn value="direct.code">
        <span>direct</span>
      </IHasMn>
    </>
  );
}
const mapped = (mapping: IPermissionMapConfig, children = <Gates />) =>
  auth(
    <IMenuPermissionMappingProvider mapping={mapping}>
      {children}
    </IMenuPermissionMappingProvider>
  );
function deferred() {
  let resolve!: (mapping: IPermissionMap) => void;
  const promise = new Promise<IPermissionMap>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('remote-local permission mapping', () => {
  it('matches Angular ANY, boolean override, missing-key fallback and predicate semantics', () => {
    const mapping = {
      alias: ['missing', 'export.code'],
      denied: false,
      allowed: true,
      empty: [],
      override: 'missing',
    };
    expect(evaluatePermission('alias', source, mapping)).toBe(true);
    expect(evaluatePermission('direct.code', source, mapping)).toBe(true);
    expect(evaluatePermission(['missing', 'alias'], source, mapping)).toBe(
      true
    );
    expect(evaluatePermission('denied', source, mapping)).toBe(false);
    expect(evaluatePermission('allowed', source, mapping)).toBe(true);
    expect(evaluatePermission('empty', source, mapping)).toBe(false);
    expect(
      evaluatePermission('export.code', source, { 'export.code': false })
    ).toBe(false);
    expect(
      evaluatePermission('export.code', source, { 'export.code': 'missing' })
    ).toBe(false);
    expect(
      evaluatePermission(
        (s) => s.menuCodes.includes('export.code'),
        source,
        mapping
      )
    ).toBe(true);
    expect(evaluatePermission('toString', source, mapping)).toBe(false);
  });

  it('validates untrusted shapes and snapshots mutable input without prototype-key inheritance', () => {
    for (const value of [
      null,
      [],
      'bad',
      { '': true },
      { a: 42 },
      { a: [''] },
      { a: [true] },
      { a: null },
    ])
      expect(() => validatePermissionMap(value)).toThrow();
    const value = { alias: ['export.code'] };
    const result = validatePermissionMap(value);
    value.alias.push('changed');
    expect(result.alias).toEqual(['export.code']);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.alias)).toBe(true);
    const own = validatePermissionMap(JSON.parse('{"__proto__":true}'));
    expect(evaluatePermission('__proto__', source, own)).toBe(true);
  });

  it('keeps both branches and direct fallback hidden until runtime JSON finishes loading', async () => {
    const pending = deferred();
    const loader = vi.fn(() => pending.promise);
    const view = render(mapped(loader));
    expect(screen.queryByText('allowed')).toBeNull();
    expect(screen.queryByText('denied')).toBeNull();
    expect(screen.queryByText('direct')).toBeNull();
    expect(screen.getByText('false')).toBeTruthy();
    await act(async () => pending.resolve({ alias: ['export.code'] }));
    expect(screen.getByText('allowed')).toBeTruthy();
    expect(screen.queryByText('denied')).toBeNull();
    expect(screen.getByText('direct')).toBeTruthy();
    view.rerender(mapped(loader));
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('supports empty JSON mappings and false aliases without losing direct fallback', async () => {
    render(mapped(async () => ({})));
    expect(await screen.findByText('direct')).toBeTruthy();
    expect(screen.getByText('denied')).toBeTruthy();
  });

  it('fails closed for rejected loaders, thrown loaders, malformed JSON and invalid mapping values', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      const loaders: Array<() => Promise<IPermissionMap>> = [
        () => Promise.reject(new Error('HTTP 404')),
        () => {
          throw new Error('network failure');
        },
        async () => JSON.parse('<html>not json'),
        async () => JSON.parse('{"alias":42}'),
      ];
      for (const loader of loaders) {
        const previous = error.mock.calls.length;
        const view = render(mapped(loader));
        await waitFor(() =>
          expect(error.mock.calls.length).toBeGreaterThan(previous)
        );
        expect(screen.queryByText('allowed')).toBeNull();
        expect(screen.queryByText('denied')).toBeNull();
        expect(screen.queryByText('direct')).toBeNull();
        view.unmount();
      }
    } finally {
      error.mockRestore();
    }
  });

  it('isolates simultaneous remotes and nested mappings without modifying the authorization store', async () => {
    const before = structuredClone(source);
    render(
      auth(
        <>
          <IMenuPermissionMappingProvider
            mapping={async () => ({ alias: true })}>
            <IHasMn value="alias">
              <span>remote-a</span>
            </IHasMn>
            <IMenuPermissionMappingProvider
              mapping={async () => ({ alias: false })}>
              <IHasMn value="alias">
                <span>nested-allowed</span>
              </IHasMn>
              <INotHasMn value="alias">
                <span>nested-denied</span>
              </INotHasMn>
            </IMenuPermissionMappingProvider>
          </IMenuPermissionMappingProvider>
          <IMenuPermissionMappingProvider
            mapping={async () => ({ alias: false })}>
            <INotHasMn value="alias">
              <span>remote-b</span>
            </INotHasMn>
          </IMenuPermissionMappingProvider>
          <IHasMn value="alias">
            <span>outside-provider</span>
          </IHasMn>
        </>
      )
    );
    expect(await screen.findByText('remote-a')).toBeTruthy();
    expect(await screen.findByText('remote-b')).toBeTruthy();
    expect(await screen.findByText('nested-denied')).toBeTruthy();
    expect(screen.queryByText('nested-allowed')).toBeNull();
    expect(screen.queryByText('outside-provider')).toBeNull();
    expect(source).toEqual(before);
  });

  it('hides stale grants immediately when the loader changes and ignores late results', async () => {
    const first = deferred(),
      second = deferred();
    const loadFirst = () => first.promise,
      loadSecond = () => second.promise;
    const view = render(mapped(loadFirst));
    view.rerender(mapped(loadSecond));
    await act(async () => first.resolve({ alias: true }));
    expect(screen.queryByText('allowed')).toBeNull();
    expect(screen.queryByText('denied')).toBeNull();
    await act(async () => second.resolve({ alias: false }));
    expect(screen.getByText('denied')).toBeTruthy();
    view.rerender(mapped(loadFirst));
    expect(screen.queryByText('denied')).toBeNull();
    await waitFor(() => expect(screen.getByText('allowed')).toBeTruthy());
  });

  it('does not bypass authorization initialization even with a true mapping', () => {
    render(
      auth(
        <IMenuPermissionMappingProvider mapping={{ alias: true }}>
          <Gates />
        </IMenuPermissionMappingProvider>,
        false
      )
    );
    expect(screen.queryByText('allowed')).toBeNull();
    expect(screen.queryByText('denied')).toBeNull();
  });

  it('starts a stable runtime loader once under StrictMode and ignores unmounted resolutions', async () => {
    const pending = deferred();
    const loader = vi.fn(() => pending.promise);
    const view = render(<StrictMode>{mapped(loader)}</StrictMode>);
    await waitFor(() => expect(loader).toHaveBeenCalledTimes(1));
    view.unmount();
    await act(async () => pending.resolve({ alias: true }));
    expect(loader).toHaveBeenCalledTimes(1);
  });
});

it('portaled dialogs inherit their remote mapping without a global store override', async () => {
  render(
    mapped(
      async () => ({ alias: true }),
      createPortal(
        <IHasMn value="alias">
          <span>dialog-action</span>
        </IHasMn>,
        document.body
      )
    )
  );
  expect(await screen.findByText('dialog-action')).toBeTruthy();
});

it('a previously granted mapping cannot leak while a replacement loader is pending', async () => {
  const first = vi.fn(async () => ({ alias: true }));
  const pending = deferred();
  const second = () => pending.promise;
  const view = render(mapped(first));
  expect(await screen.findByText('allowed')).toBeTruthy();
  view.rerender(mapped(second));
  expect(screen.queryByText('allowed')).toBeNull();
  expect(screen.queryByText('denied')).toBeNull();
  view.rerender(mapped(first));
  expect(screen.queryByText('allowed')).toBeNull();
  await waitFor(() => expect(screen.getByText('allowed')).toBeTruthy());
  await act(async () => pending.resolve({ alias: false }));
  expect(screen.getByText('allowed')).toBeTruthy();
  expect(screen.queryByText('denied')).toBeNull();
});
