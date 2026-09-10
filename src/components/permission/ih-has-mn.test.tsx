import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';

import {
  IAuthContext,
  type IAuthContext as IAuthContextValue,
} from '../auth/insight-auth-context';
import type { ISessionService } from '../session/session.service';
import type { IUserMenuStore } from '../store/user-menu.store';
import { IUserMenuStore as UserMenuStore } from '../store/user-menu.store';
import type { ICurrentUserService } from '../user/current-user.service';
import type { IUserMenuService } from '../user/user-menu.service';
import { IHasMn, INotHasMn } from './use-permission';

/** Code-aware store stub — mirrors the Angular `has-mn` directive spec behaviour. */
function makeStore({
  initializing = false,
  granted = [],
}: {
  initializing?: boolean;
  granted?: string[];
} = {}): IUserMenuStore {
  return {
    initializing,
    hasPermission: (code: string | string[]): boolean =>
      Array.isArray(code)
        ? code.some((item) => granted.includes(item))
        : granted.includes(code),
  } as unknown as IUserMenuStore;
}

function renderGated(store: IUserMenuStore) {
  const ctx = { userMenuStore: store } as unknown as IAuthContextValue;

  return render(
    <IAuthContext.Provider value={ctx}>
      <IHasMn value={{ source: 'permission', value: 'report.export' }}>
        <div>perm-export</div>
      </IHasMn>
      <INotHasMn value={{ source: 'permission', value: 'report.delete' }}>
        <div>not-delete</div>
      </INotHasMn>
    </IAuthContext.Provider>,
  );
}

describe('IHasMn / INotHasMn — permission source', () => {
  it('renders the has-branch and the inverse branch for a granted code', () => {
    renderGated(makeStore({ granted: ['report.export'] }));

    expect(screen.queryByText('perm-export')).toBeTruthy();
    // `report.delete` is NOT granted, so its not-has branch renders.
    expect(screen.queryByText('not-delete')).toBeTruthy();
  });

  it('hides both branches while the store is initializing (init gate)', () => {
    renderGated(makeStore({ initializing: true, granted: ['report.export'] }));

    expect(screen.queryByText('perm-export')).toBeNull();
    expect(screen.queryByText('not-delete')).toBeNull();
  });

  it('stays fail-closed when the permission list is empty', () => {
    renderGated(makeStore({ granted: [] }));

    expect(screen.queryByText('perm-export')).toBeNull();
    expect(screen.queryByText('not-delete')).toBeTruthy();
  });

  it('reacts when permissions are hydrated by load() after the initial render', async () => {
    const store = new UserMenuStore(
      {
        getCurrentUser: async () => ({ userId: 'u1', username: 'jdoe' }),
      } as unknown as ICurrentUserService,
      {
        getEffectiveMenus: async () => [],
        getFavorites: async () => [],
        getAuthorizations: async () => [
          { menuCode: 'report.export', menuId: 'm2', type: 'function', companies: [] },
        ],
      } as unknown as IUserMenuService,
      {
        getRoles: () => [],
        getUser: () => ({ sub: 'sub-a' }),
      } as unknown as ISessionService,
    );

    const ctx = { userMenuStore: store } as unknown as IAuthContextValue;
    render(
      <IAuthContext.Provider value={ctx}>
        <IHasMn value={{ source: 'permission', value: 'report.export' }}>
          <div>perm-export</div>
        </IHasMn>
      </IAuthContext.Provider>,
    );

    // Cold start: nothing granted yet (fail-closed).
    expect(screen.queryByText('perm-export')).toBeNull();

    await act(async () => {
      await store.load();
    });

    expect(store.permissions).toEqual(['report.export']);
    expect(screen.queryByText('perm-export')).toBeTruthy();
  });
});
