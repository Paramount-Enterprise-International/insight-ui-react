import { describe, expect, it, vi } from 'vitest';

import type { ISessionService } from '../session/session';
import type { ICurrentUserService } from '../user/current-user';
import type { IEffectiveAuthorizationDto } from '../user/user.types';
import type { IUserMenuService } from '../user/user-menu';
import { IUserMenuStore } from './user-menu';

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
      authorizations: null,
    });
    expect(store.loadError).toBeNull();
    expect(store.initializing).toBe(false);
    expect(store.initialized).toBe(true);
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

  it('drops cached authorization data when load() switches application', async () => {
    const { store, menuSvc } = createStore();
    const menusSpy = (menuSvc as unknown as {
      getEffectiveMenus: ReturnType<typeof vi.fn>;
    }).getEffectiveMenus;
    const authorizationsSpy = (menuSvc as unknown as {
      getAuthorizations: ReturnType<typeof vi.fn>;
    }).getAuthorizations;

    await store.load('app-a');
    expect(store.menuCodes).toEqual(['dashboard', 'report.export']);

    menusSpy.mockRejectedValueOnce({ status: 404, message: 'application unavailable' });
    authorizationsSpy.mockResolvedValueOnce([]);
    await store.load('app-b');

    expect(menusSpy).toHaveBeenLastCalledWith('app-b');
    expect(authorizationsSpy).toHaveBeenLastCalledWith('app-b');
    expect(store.menus).toEqual([]);
    expect(store.menuCodes).toEqual([]);
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
    expect(store.initialized).toBe(false);
    expect(store.loadErrors).toEqual({
      user: null,
      menus: null,
      favorites: null,
      authorizations: null,
    });
  });
});

describe('IUserMenuStore — permissions', () => {
  it('hasMenuCode matches ANY granted code; empty list is denied', async () => {
    const { store, menuSvc } = createStore();

    expect(store.menuCodes).toEqual([]);
    expect(store.hasMenuCode('report.export')).toBe(false);
    expect(store.hasMenuCode(['report.export', 'nope'])).toBe(false);

    (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }).getAuthorizations.mockResolvedValueOnce(['report.export', 'audit.read'].map((menuCode) => ({ menuCode, menuId: menuCode, type: 'function', companies: [] })));
    await store.load();
    expect(store.menuCodes).toEqual(['report.export', 'audit.read']);
    expect(store.hasMenuCode('report.export')).toBe(true);
    expect(store.hasMenuCode(['nope', 'audit.read'])).toBe(true);
    expect(store.hasMenuCode(['nope', 'other'])).toBe(false);
  });

  it('reset() clears granted codes', async () => {
    const { store, menuSvc } = createStore();
    (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }).getAuthorizations.mockResolvedValueOnce(['report.export'].map((menuCode) => ({ menuCode, menuId: menuCode, type: 'function', companies: [] })));
    await store.load();
    expect(store.hasMenuCode('report.export')).toBe(true);

    store.reset();

    expect(store.menuCodes).toEqual([]);
    expect(store.hasMenuCode('report.export')).toBe(false);
  });

  it('load() hydrates permissions from the effective authorizations menuCode list', async () => {
    const { store, menuSvc } = createStore();
    const authSpy = (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> })
      .getAuthorizations;

    await store.load();

    expect(authSpy).toHaveBeenCalled();
    expect(store.menuCodes).toEqual(['dashboard', 'report.export']);
    expect(store.hasMenuCode('report.export')).toBe(true);
    expect(store.hasMenuCode(['nope', 'dashboard'])).toBe(true);
    expect(store.hasMenuCode('nope')).toBe(false);
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

    expect(store.menuCodes).toEqual(['report.export']);
  });

  it('clears access before refetch and preserves navigation when authorization fails', async () => {
    const { store, menuSvc } = createStore();
    const service = menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn>; getAuthorizations: ReturnType<typeof vi.fn> };
    service.getEffectiveMenus.mockResolvedValue([{ id: 'dashboard', name: 'Dashboard', type: 'item', menuCode: 'dashboard', route: '/dashboard' }]);
    service.getAuthorizations.mockResolvedValueOnce([{ menuCode: 'report.export', menuId: 'export', type: 'function', companies: [{ id: 'c1', code: 'JKT', name: 'Jakarta' }] }]);
    await store.load();
    expect(store.hasMenuCode('report.export')).toBe(true);
    expect(store.companyCodes).toEqual(['JKT']);
    let reject!: (reason: unknown) => void;
    service.getAuthorizations.mockReturnValueOnce(new Promise((_, fail) => { reject = fail; }));
    const pending = store.load();
    expect(store.menuCodes).toEqual([]);
    expect(store.companies).toEqual([]);
    expect(store.menuCompanies).toEqual({});
    reject({ status: 500, message: 'refetch failed' });
    await pending;
    expect(store.hasMenuCode('dashboard')).toBe(false);
    expect(store.hasNavigableMenu('dashboard')).toBe(true);
    expect(store.loadErrors.authorizations?.status).toBe(500);
  });

  it('loadAuthorizations returns DTOs and never grants navigation-only codes', async () => {
    const { store, menuSvc } = createStore();
    const service = menuSvc as unknown as { getEffectiveMenus: ReturnType<typeof vi.fn>; getAuthorizations: ReturnType<typeof vi.fn> };
    service.getEffectiveMenus.mockResolvedValue([{ id: 'dashboard', name: 'Dashboard', type: 'item', menuCode: 'dashboard', route: '/dashboard' }]);
    service.getAuthorizations.mockResolvedValue([{ menuCode: 'example', menuId: 'example', type: 'function', companies: [] }]);
    await store.load();
    expect(store.hasMenuCode('dashboard')).toBe(false);
    expect(store.hasNavigableMenu('dashboard')).toBe(true);
    expect(store.hasMenuCode('example')).toBe(true);
    expect((await store.loadAuthorizations())[0].type).toBe('function');
  });

  it('exposes deduplicated companies and menu-company mappings', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockResolvedValueOnce([
      {
        menuCode: 'report.export',
        menuId: 'm2',
        type: 'function',
        companies: [{ id: 'c1', code: 'ecomindo', name: 'Ecomindo' }],
      },
      {
        menuCode: 'report.export',
        menuId: 'm2',
        type: 'function',
        companies: [{ id: 'c1', code: 'ecomindo', name: 'Duplicate' }],
      },
      {
        menuCode: 'report.read',
        menuId: 'm3',
        type: 'function',
        companies: [],
      },
    ]);

    await store.load();

    expect(store.authorizations).toHaveLength(3);
    expect(store.companies).toEqual([{ id: 'c1', code: 'ecomindo', name: 'Ecomindo' }]);
    expect(store.companyCodes).toEqual(['ecomindo']);
    expect(store.menuCompanies).toEqual({
      'report.export': ['ecomindo'],
      'report.read': [],
    });
    expect(store.authorizationSource.menuCodes).toEqual(['report.export', 'report.read']);
  });

  it('load() yields an empty permission list for an empty response (fail-closed)', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockResolvedValueOnce([]);

    await store.load();

    expect(store.menuCodes).toEqual([]);
    expect(store.authorizations).toEqual([]);
    expect(store.companies).toEqual([]);
    expect(store.companyCodes).toEqual([]);
    expect(store.menuCompanies).toEqual({});
    expect(store.hasMenuCode('report.export')).toBe(false);
    expect(store.loadErrors.authorizations).toBeNull();
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

    expect(store.loadErrors.authorizations?.status).toBe(500);
    expect(store.loadErrors.authorizations?.message).toBe('authorizations exploded');
    // The other branches still succeed.
    expect(store.menus.length).toBe(1);
    expect(store.currentUser).not.toBeNull();
    expect(store.loadErrors.menus).toBeNull();
    // Fail-closed: nothing is granted.
    expect(store.menuCodes).toEqual([]);
    expect(store.hasMenuCode('report.export')).toBe(false);
  });

  it("drops the previous user's permissions when load() runs for a different user", async () => {
    const { store, menuSvc, session } = createStore();
    const sessionSpy = session as unknown as { getUser: ReturnType<typeof vi.fn> };
    const authSpy = (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> })
      .getAuthorizations;

    await store.load();
    expect(store.menuCodes).toEqual(['dashboard', 'report.export']);

    sessionSpy.getUser.mockReturnValue({ sub: 'sub-b' });
    authSpy.mockResolvedValueOnce([]);

    await store.load();

    expect(store.menuCodes).toEqual([]);
    expect(store.hasMenuCode('report.export')).toBe(false);
  });

  it('authorizations deduplicate the granted codes', async () => {
    const { store, menuSvc } = createStore();

    (menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }).getAuthorizations.mockResolvedValueOnce(['a', 'b', 'a'].map((menuCode) => ({ menuCode, menuId: menuCode, type: 'function', companies: [] })));
    await store.load();

    expect(store.menuCodes).toEqual(['a', 'b']);
    expect(store.hasMenuCode('a')).toBe(true);
    expect(store.hasMenuCode(['nope', 'b'])).toBe(true);
    expect(store.hasMenuCode(['nope', 'other'])).toBe(false);
  });

  it('reset() clears a recorded permissions error too', async () => {
    const { store, menuSvc } = createStore();
    (
      menuSvc as unknown as { getAuthorizations: ReturnType<typeof vi.fn> }
    ).getAuthorizations.mockRejectedValueOnce({ status: 500, message: 'boom' });

    await store.load();
    expect(store.loadErrors.authorizations).not.toBeNull();

    store.reset();

    expect(store.loadErrors.authorizations).toBeNull();
    expect(store.menuCodes).toEqual([]);
  });
});

describe('store session lifecycle', () => {
  it('ignores every late load branch after reset', async () => {
    const { store, userSvc, menuSvc } = createStore();
    let finishUser!: (value: unknown) => void;
    let finishAuthorizations!: (value: unknown) => void;
    (userSvc.getCurrentUser as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise((done) => {
        finishUser = done;
      })
    );
    (menuSvc.getAuthorizations as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise((done) => {
        finishAuthorizations = done;
      })
    );
    const pending = store.load();
    store.reset();
    finishUser({ userId: 'old', username: 'old' });
    finishAuthorizations(AUTHORIZATIONS);
    await pending;
    expect(store.currentUser).toBeNull();
    expect(store.authorizations).toEqual([]);
    expect(store.menuCodes).toEqual([]);
    expect(store.initializing).toBe(false);
    expect(store.initialized).toBe(false);
    expect(store.loadError).toBeNull();
  });

  it('rejects direct stale authorization results after disposal', async () => {
    const { store, menuSvc } = createStore();
    let finish!: (value: unknown) => void;
    (menuSvc.getAuthorizations as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise((done) => {
        finish = done;
      })
    );
    const pending = store.loadAuthorizations();
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
    });
    store.dispose();
    finish(AUTHORIZATIONS);
    await assertion;
    expect(store.authorizations).toEqual([]);
    await expect(store.load()).rejects.toMatchObject({ name: 'AbortError' });
  });
});
