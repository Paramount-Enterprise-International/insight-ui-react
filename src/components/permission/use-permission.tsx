/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';

import { useUserMenuStore } from '../auth/insight-auth-context';

/** Permission source selector used by `usePermission` / `<HasMn>` / `<NotHasMn>`. */
export type IInsightPermissionSource = 'menu' | 'role' | 'permission';

/** Object form: inline source + value. */
export type IInsightPermission = {
  source: IInsightPermissionSource;
  value: string | string[];
};

/**
 * Accepted input for the permission checks:
 * - a plain `string | string[]` → menu-mode check (default), or
 * - an object `{ source, value }` to select the source explicitly.
 */
export type IInsightPermissionInput = string | string[] | IInsightPermission;

/** Resolves an input into a concrete `{ source, codes }` pair (or `null`). */
export function resolvePermission(
  value: IInsightPermissionInput | null,
): { source: IInsightPermissionSource; codes: string | string[] } | null {
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
 * `ihHasMn` / `ihNotHasMn` directives. Reads the `UserMenuStore` reactively,
 * so gated UI renders only once the store has data (menus or roles).
 *
 * ```tsx
 * const canView = usePermission('sales:report');
 * const canAdmin = usePermission({ source: 'role', value: 'iam-admin' });
 * const canExport = usePermission({ source: 'permission', value: 'report.export' });
 * ```
 */
export function usePermission(value: IInsightPermissionInput | null | undefined): boolean {
  const store = useUserMenuStore();
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
export function HasMn({
  value,
  children,
}: {
  value: IInsightPermissionInput;
  children: ReactNode;
}): ReactNode {
  const store = useUserMenuStore();
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
export function NotHasMn({
  value,
  children,
}: {
  value: IInsightPermissionInput;
  children: ReactNode;
}): ReactNode {
  const store = useUserMenuStore();
  const allowed = usePermission(value);
  if (store.initializing) {
    return null;
  }
  return allowed ? null : <>{children}</>;
}
