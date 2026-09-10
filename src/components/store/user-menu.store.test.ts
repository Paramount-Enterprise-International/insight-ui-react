import { describe, expect, it, vi } from 'vitest';

import type { ISessionService } from '../session/session.service';
import type { ICurrentUserService } from '../user/current-user.service';
import type { IEffectiveAuthorizationDto } from '../user/user.types';
import type { IUserMenuService } from '../user/user-menu.service';
import { IUserMenuStore } from './user-menu.store';

/** Effective authorizations returned by the `/me/authorizations` branch. */
const AUTHORIZATIONS: IEffectiveAuthorizationDto[] = [
  { menuCode: 'dashboard', menuId: 'm1', type: 'item', companies: [] },
  { menuCode: 'report.export', menuId: 'm2', type: 'function', companies: [] },
];

/** Minimal object-mother for the store's constructor dependencies. */
function createStore() {
  const userSvc = {
    getCurrentUser: vi.fn(async () => ({ userId: 'u1', username: 'jdoe' })),
  } as unknown as ICurrentUserService;
  const menuSvc = {
    getEffectiveMenus: vi.fn(async () => []),
    getFavorites: vi.fn(async () => []),
    getAuthorizations: vi.fn(async () => AUTHORIZATIONS),
  } as unknown as IUserMenuService;
  const session = {
    getRoles: vi.fn(() => []),
    getUser: vi.fn(() => ({ sub: 'sub-a' })),
  } as unknown as ISessionService;
  const store = new IUserMenuStore(userSvc, menuSvc, session);
  return { store, userSvc, menuSvc, session };
}

describe('IUserMenuStore — load error capture', () => {
  it('keeps loadErrors null on a successful load', async () => {
    const { store } = createStore();
    await store.load();

    expect(store.loadErrors).toEqual({
      user: null,
      menus: null,
      favorites: null,
      permissions: null,
    });
    expect(store.loadError).toBeNull();
    expect(store.initializing).toBe(false);
  });

  it('records the normalized menus error (errorCode + revision) and real message when /me/menus fails', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn> }
    ).getEffectiveMenus.mockRejectedValueOnce({
      status: 404,
      errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND',
      message: 'The requested user application assignment was not found.',
      revision: 1,
    });

    await store.load();

    expect(store.initializing).toBe(false);
    expect(store.loadErrors.menus?.errorCode).toBe('USER_APPLICATION_MAPPING_NOT_FOUND');
    expect(store.loadErrors.menus?.status).toBe(404);
    expect(store.loadErrors.menus?.revision).toBe(1);
    expect(store.loadError).toBe('menus: The requested user application assignment was not found.');
    // Non-failed branches stay clean.
    expect(store.loadErrors.user).toBeNull();
    expect(store.loadErrors.favorites).toBeNull();
  });

  it('records per-branch errors for user and favorites independently of menus', async () => {
    const { store, userSvc, menuSvc } = createStore();
    (
      userSvc as unknown as { getCurrentUser: ReturnType<typeof vi.fn> }
    ).getCurrentUser.mockRejectedValueOnce({ status: 500, message: 'user exploded' });
    (
      menuSvc as unknown as { getFavorites: ReturnType<typeof vi.fn> }
    ).getFavorites.mockRejectedValueOnce({ status: 500, message: 'favorites exploded' });

    await store.load();

    expect(store.loadErrors.user?.status).toBe(500);
    expect(store.loadErrors.favorites?.message).toBe('favorites exploded');
    // Menus branch succeeded → no error.
    expect(store.loadErrors.menus).toBeNull();
  });

  it('clears loadErrors on a subsequent successful load', async () => {
    const { store, menuSvc } = createStore();
    const menusSpy = (menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn> }).getEffectiveMenus;

    menusSpy.mockRejectedValueOnce({ status: 404, errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND' });
    await store.load();
    expect(store.loadErrors.menus).not.toBeNull();

    menusSpy.mockResolvedValueOnce([]);
    await store.load();
    expect(store.loadErrors.menus).toBeNull();
    expect(store.loadError).toBeNull();
  });

  it('drops the previous user\'s menus when load() runs for a different user and menus fail', async () => {
    const { store, menuSvc, session } = createStore();
    const sessionSpy = session as unknown as { getUser: ReturnType<typeof vi.fn> };
    const menusSpy = (menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn> }).getEffectiveMenus;

    // User A loads menus fine.
    menusSpy.mockResolvedValue([{ id: 'm1', name: 'Dashboard', type: 'item', menuCode: 'dashboard', route: '/dashboard' }]);
    await store.load();
    expect(store.menus.length).toBe(1);

    // Switch to user B (different `sub`): menus endpoint errors (e.g. no
    // application mapping) → stale user A menus must NOT remain visible.
    sessionSpy.getUser.mockReturnValue({ sub: 'sub-b' });
    menusSpy.mockRejectedValueOnce({
      status: 404,
      errorCode: 'USER_APPLICATION_MAPPING_NOT_FOUND',
      message: 'The requested user application assignment was not found.',
      revision: 1,
    });

    await store.load();

    expect(store.menus.length).toBe(0);
    expect(store.loadErrors.menus?.errorCode).toBe('USER_APPLICATION_MAPPING_NOT_FOUND');
  });

  it('keeps cached menus across a same-user reload', async () => {
    const { store, menuSvc } = createStore();
    const menusSpy = (menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn> }).getEffectiveMenus;
    menusSpy.mockResolvedValue([{ id: 'm1', name: 'Dashboard', type: 'item', menuCode: 'dashboard', route: '/dashboard' }]);

    await store.load();
    expect(store.menus.length).toBe(1);

    // Same user re-loads (same `sub`) — menus stay until the refetch replaces them.
    await store.load();
    expect(store.menus.length).toBe(1);
  });

  it('reset() clears all cached data and forgets the identity', async () => {
    const { store, menuSvc } = createStore();
    const menusSpy = (menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn> }).getEffectiveMenus;
    menusSpy.mockResolvedValue([{ id: 'm1', name: 'Dashboard', type: 'item', menuCode: 'dashboard', route: '/dashboard' }]);

    await store.load();
    expect(store.menus.length).toBe(1);

    store.reset();

    expect(store.menus.length).toBe(0);
    expect(store.favorites.length).toBe(0);
    expect(store.currentUser).toBeNull();
    expect(store.rawCurrentUser).toBeNull();
    expect(store.roles).toEqual([]);
    expect(store.loadErrors).toEqual({
      user: null,
      menus: null,
      favorites: null,
      permissions: null,
    });
  });
});

describe('IUserMenuStore — permissions', () => {
  it('hasPermission matches ANY granted code; empty list is denied', () => {
    const { store } = createStore();

    expect(store.permissions).toEqual([]);
    expect(store.hasPermission('report.export')).toBe(false);
    expect(store.hasPermission(['report.export', 'nope'])).toBe(false);

    store.setPermissions(['report.export', 'audit.read']);
    expect(store.permissions).toEqual(['report.export', 'audit.read']);
    expect(store.hasPermission('report.export')).toBe(true);
    expect(store.hasPermission(['nope', 'audit.read'])).toBe(true);
    expect(store.hasPermission(['nope', 'other'])).toBe(false);
  });

  it('reset() clears granted permissions', () => {
    const { store } = createStore();
    store.setPermissions(['report.export']);
    expect(store.hasPermission('report.export')).toBe(true);

    store.reset();

    expect(store.permissions).toEqual([]);
    expect(store.hasPermission('report.export')).toBe(false);
  });

  it('load() hydrates permissions from the effective authorizations menuCode list', async () => {
    const { store, menuSvc } = createStore();
    const authSpy = (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> })
      .getAuthorizations;

    await store.load();

    expect(authSpy).toHaveBeenCalled();
    expect(store.permissions).toEqual(['dashboard', 'report.export']);
    expect(store.hasPermission('report.export')).toBe(true);
    expect(store.hasPermission(['nope', 'dashboard'])).toBe(true);
    expect(store.hasPermission('nope')).toBe(false);
  });

  it('load() deduplicates repeated menu codes', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockResolvedValueOnce([
      { menuCode: 'report.export', menuId: 'm2', type: 'function', companies: [] },
      { menuCode: 'report.export', menuId: 'm3', type: 'function', companies: [] },
    ]);

    await store.load();

    expect(store.permissions).toEqual(['report.export']);
  });

  it('load() yields an empty permission list for an empty response (fail-closed)', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockResolvedValueOnce([]);

    await store.load();

    expect(store.permissions).toEqual([]);
    expect(store.hasPermission('report.export')).toBe(false);
    expect(store.loadErrors.permissions).toBeNull();
  });

  it('records an authorizations error without losing the other branches', async () => {
    const { store, menuSvc } = createStore();
    const menusSpy = (menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn> })
      .getEffectiveMenus;
    menusSpy.mockResolvedValueOnce([
      { id: 'm1', name: 'Dashboard', type: 'item', menuCode: 'dashboard', route: '/dashboard' },
    ]);
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockRejectedValueOnce({ status: 500, message: 'authorizations exploded' });

    await store.load();

    expect(store.loadErrors.permissions?.status).toBe(500);
    expect(store.loadErrors.permissions?.message).toBe('authorizations exploded');
    // The other branches still succeed.
    expect(store.menus.length).toBe(1);
    expect(store.currentUser).not.toBeNull();
    expect(store.loadErrors.menus).toBeNull();
    // Fail-closed: nothing is granted.
    expect(store.permissions).toEqual([]);
    expect(store.hasPermission('report.export')).toBe(false);
  });

  it("drops the previous user's permissions when load() runs for a different user", async () => {
    const { store, menuSvc, session } = createStore();
    const sessionSpy = session as unknown as { getUser: ReturnType<typeof vi.fn> };
    const authSpy = (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> })
      .getAuthorizations;

    await store.load();
    expect(store.permissions).toEqual(['dashboard', 'report.export']);

    sessionSpy.getUser.mockReturnValue({ sub: 'sub-b' });
    authSpy.mockResolvedValueOnce([]);

    await store.load();

    expect(store.permissions).toEqual([]);
    expect(store.hasPermission('report.export')).toBe(false);
  });

  it('setPermissions deduplicates the supplied codes', () => {
    const { store } = createStore();

    store.setPermissions(['a', 'b', 'a']);

    expect(store.permissions).toEqual(['a', 'b']);
    expect(store.hasPermission('a')).toBe(true);
    expect(store.hasPermission(['nope', 'b'])).toBe(true);
    expect(store.hasPermission(['nope', 'other'])).toBe(false);
  });

  it('reset() clears a recorded permissions error too', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockRejectedValueOnce({ status: 500, message: 'boom' });

    await store.load();
    expect(store.loadErrors.permissions).not.toBeNull();

    store.reset();

    expect(store.loadErrors.permissions).toBeNull();
    expect(store.permissions).toEqual([]);
  });
});
