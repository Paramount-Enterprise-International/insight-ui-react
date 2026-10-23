import { describe, expect, it, vi } from 'vitest';
import { IHStateOwner, type IHStateAdapter } from './state-core';

function adapter(): IHStateAdapter {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

function owner(prefix = 'state-test') {
  const state = new IHStateOwner(prefix);
  state.setIdentity('user-a');
  return state;
}

describe('IHStateOwner', () => {
  it('keeps session values independent across tab storage areas, including refresh', () => {
    const firstTab = adapter();
    const secondTab = adapter();
    const storage = vi.spyOn(window, 'sessionStorage', 'get');
    try {
      storage.mockReturnValue(firstTab as Storage);
      const first = owner('tab-test');
      first.set('filters', 'company', 'a');
      storage.mockReturnValue(secondTab as Storage);
      const second = owner('tab-test');
      expect(second.get('filters', 'company', null)).toBeNull();
      second.set('filters', 'company', 'b');
      storage.mockReturnValue(firstTab as Storage);
      expect(owner('tab-test').get('filters', 'company', null)).toBe('a');
      storage.mockReturnValue(secondTab as Storage);
      expect(owner('tab-test').get('filters', 'company', null)).toBe('b');
    } finally {
      storage.mockRestore();
    }
  });
  it('restores session by default but discards temporary state on refresh', () => {
    sessionStorage.clear();
    const first = owner();
    first.registerNamespace('scratch', { storage: 'temporary' });
    first.set('filters', 'query', 'hello');
    first.set('scratch', 'query', 'draft');
    const second = owner();
    second.registerNamespace('scratch', { storage: 'temporary' });
    expect(second.get('filters', 'query', '')).toBe('hello');
    expect(second.get('scratch', 'query', '')).toBe('');
    expect(() => second.registerNamespace('filters', { storage: 'local' })).toThrow();
  });

  it('supports local and custom adapters, updates, removal and subscriptions', () => {
    sessionStorage.clear();
    const custom = adapter();
    const state = new IHStateOwner('custom-test', { custom });
    state.setIdentity('user-a');
    state.registerNamespace('custom-data', { storage: 'custom' });
    state.registerNamespace('preferences', { storage: 'local' });
    let notifications = 0;
    const unsubscribe = state.subscribe(() => notifications++);
    state.update('custom-data', 'count', 0, (count) => count + 1);
    state.set('preferences', 'size', 5);
    unsubscribe();
    state.remove('preferences', 'size');
    expect(notifications).toBe(2);
    const restored = new IHStateOwner('custom-test', { custom });
    restored.setIdentity('user-a');
    restored.registerNamespace('custom-data', { storage: 'custom' });
    expect(restored.get('custom-data', 'count', 0)).toBe(1);
    state.clearNamespace('custom-data');
    expect(state.get('custom-data', 'count', 0)).toBe(0);
  });

  it('keeps active values and exposes persistence errors without changing storage', () => {
    const denied: IHStateAdapter = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    };
    const state = new IHStateOwner('denied-test', { denied });
    state.setIdentity('a');
    state.registerNamespace('restricted', { storage: 'denied' });
    expect(state.get('restricted', 'x', 0)).toBe(0);
    expect(state.getError('restricted')?.operation).toBe('read');
    state.set('restricted', 'x', 9);
    expect(state.get('restricted', 'x', 0)).toBe(9);
    expect(state.getError('restricted')?.operation).toBe('write');
    expect(() => state.set('restricted', 'x', new Date())).toThrow();
  });

  it('ignores corrupt JSON and clears unloaded namespaces across identity transitions', () => {
    sessionStorage.clear();
    const first = owner('identity-test');
    first.set('unloaded', 'secret', 1);
    sessionStorage.setItem('identity-test:user-a:broken', '{');
    expect(first.get('broken', 'x', null)).toBeNull();
    expect(first.getError('broken')?.operation).toBe('read');
    const second = owner('identity-test');
    second.setIdentity('actor-as-user');
    second.setIdentity('user-a');
    expect(second.get('unloaded', 'secret', null)).toBeNull();
    second.set('unloaded', 'secret', 2);
    second.setIdentity(null);
    second.setIdentity('user-a');
    expect(second.get('unloaded', 'secret', null)).toBeNull();
  });

  it('does not mutate caller objects or allow snapshots to be changed in place', () => {
    const state = owner('immutable-test');
    const input = { nested: { value: 1 } };
    state.set('data', 'value', input);
    input.nested.value = 2;
    expect(state.get('data', 'value', input).nested.value).toBe(1);
    expect(() => {
      state.get('data', 'value', input).nested.value = 3;
    }).toThrow();
  });
});

describe('shared company/project selection', () => {
  it('changes context revision for same-menu navigation without restarting on project selection', () => {
    sessionStorage.clear();
    const { selection } = owner('revision-test');
    selection.activateMenu('sales');
    selection.validateCompanies('sales', ['a'], 'ready');
    selection.setCompany('a');
    selection.resolveProjects(selection.beginProjects(), ['p']);
    const revision = selection.getSnapshot().revision;
    selection.setProject('p');
    expect(selection.getSnapshot().revision).toBe(revision);
    selection.resolveProjects(selection.beginProjects(), []);
    expect(selection.getSnapshot().revision).toBe(revision);
    expect(selection.getSnapshot().projectKey).toBeNull();
    selection.activateMenu('sales');
    expect(selection.getSnapshot().revision).toBeGreaterThan(revision);
  });
  it('retains matching projects across companies and rejects late responses', () => {
    sessionStorage.clear();
    const { selection } = owner('selection-test');
    selection.activateMenu('sales');
    selection.validateCompanies('sales', ['a', 'b', 'c'], 'ready');
    expect(selection.setCompany('a')).toBe(true);
    selection.resolveProjects(selection.beginProjects(), ['shared']);
    selection.setProject('shared');
    selection.setCompany('b');
    const old = selection.beginProjects();
    selection.setCompany('c');
    const current = selection.beginProjects();
    expect(selection.resolveProjects(old, [])).toBe(false);
    expect(selection.resolveProjects(current, ['shared'])).toBe(true);
    expect(selection.getSnapshot()).toMatchObject({
      companyId: 'c',
      projectKey: 'shared',
      projectStatus: 'ready',
    });
  });

  it('preserves candidates on loading/error and resets only after successful validation', () => {
    sessionStorage.clear();
    const state = owner('validation-test');
    const selection = state.selection;
    selection.activateMenu('sales');
    selection.validateCompanies('sales', ['a'], 'ready');
    selection.setCompany('a');
    selection.resolveProjects(selection.beginProjects(), ['p']);
    selection.setProject('p');
    selection.activateMenu(null);
    expect(selection.getSnapshot()).toMatchObject({ companyId: 'a', projectKey: 'p' });
    selection.activateMenu('report');
    selection.validateCompanies('report', [], 'loading');
    selection.validateCompanies('report', [], 'error', 'offline');
    expect(selection.getSnapshot().companyId).toBe('a');
    selection.validateCompanies('report', ['a'], 'ready');
    const failed = selection.beginProjects();
    selection.rejectProjects(failed, 'offline');
    expect(selection.getSnapshot().projectKey).toBe('p');
    selection.resolveProjects(selection.beginProjects(), []);
    expect(selection.getSnapshot().projectKey).toBeNull();
    selection.validateCompanies('report', [], 'ready');
    expect(selection.getSnapshot().companyId).toBeNull();
  });

  it('restores only candidates after refresh and cannot use previous menu validation', () => {
    sessionStorage.clear();
    const first = owner('restore-test');
    first.selection.activateMenu('sales');
    first.selection.validateCompanies('sales', ['a'], 'ready');
    first.selection.setCompany('a');
    const oldRequest = first.selection.beginProjects();
    first.selection.activateMenu('report');
    expect(first.selection.resolveProjects(oldRequest, ['p'])).toBe(false);
    const restored = owner('restore-test');
    expect(restored.selection.getSnapshot()).toMatchObject({
      companyId: 'a',
      companyStatus: 'loading',
    });
    expect(restored.selection.setProject('p')).toBe(false);
    restored.selection.activateMenu('report');
    restored.selection.validateCompanies('sales', ['a'], 'ready');
    expect(restored.selection.setCompany('a')).toBe(false);
  });
});
