/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';

import { useIUserMenuStore } from '../auth/insight-auth-context';

/** Permission source selector used by `usePermission` / `<IHasMn>` / `<INotHasMn>`. */
export type IPermissionSource = 'menu' | 'role' | 'permission';

/** Object form: inline source + value. */
export type IPermission = {
  source: IPermissionSource;
  value: string | string[];
};

/**
 * Accepted input for the permission checks:
 * - a plain `string | string[]` → menu-mode check (default), or
 * - an object `{ source, value }` to select the source explicitly.
 */
export type IPermissionInput = string | string[] | IPermission;

/** Resolves an input into a concrete `{ source, codes }` pair (or `null`). */
export function resolvePermission(
  value: IPermissionInput | null,
): { source: IPermissionSource; codes: string | string[] } | null {
  if (!value) {
    return null;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return { source: value.source, codes: value.value };
  }
  return { source: 'menu', codes: value };
}

/**
 * ASYNC-AWARE permission check hook — the React analog of the Angular
 * `ihHasMn` / `ihNotHasMn` directives. Reads the `IUserMenuStore` reactively,
 * so gated UI renders only once the store has data (menus or roles).
 *
 * ```tsx
 * const canView = usePermission('sales:report');
 * const canAdmin = usePermission({ source: 'role', value: 'iam-admin' });
 * const canExport = usePermission({ source: 'permission', value: 'report.export' });
 * ```
 */
export function usePermission(value: IPermissionInput | null | undefined): boolean {
  const store = useIUserMenuStore();
  const resolved = resolvePermission(value ?? null);
  if (!resolved) {
    return false;
  }
  if (resolved.source === 'role') {
    return store.hasRole(resolved.codes);
  }
  if (resolved.source === 'permission') {
    return store.hasPermission(resolved.codes);
  }
  return store.hasMenu(resolved.codes);
}

/**
 * Renders `children` only when the current user has the given permission
 * (menu code by default, or `{ source: 'role', value }`). Renders nothing
 * while the user-menu store is initializing (permission not yet known).
 */
export function IHasMn({
  value,
  children,
}: {
  value: IPermissionInput;
  children: ReactNode;
}): ReactNode {
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  if (store.initializing) {
    return null;
  }
  return allowed ? <>{children}</> : null;
}

/**
 * Renders `children` only when the current user does NOT have the given
 * permission. Renders nothing while the user-menu store is initializing
 * (permission not yet known) so a not-yet-loaded grant never flashes a denied
 * element.
 */
export function INotHasMn({
  value,
  children,
}: {
  value: IPermissionInput;
  children: ReactNode;
}): ReactNode {
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  if (store.initializing) {
    return null;
  }
  return allowed ? null : <>{children}</>;
}
