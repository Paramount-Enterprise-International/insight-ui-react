/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';

import { useIUserMenuStore } from '../auth/insight-auth-context';
import type { IAuthorizationSource } from '../user/user.types';
import { usePermissionMapState, type IPermissionMap } from './permission-map';

/** Source selector retained for the separate IRequireAccess API. */
export type IPermissionSource = 'menuCode' | 'role';

/** Flexible permission check against the current authorization snapshot. */
export type IPermissionPredicate = (source: IAuthorizationSource) => boolean;

/** Menu-code shorthand or a compound authorization predicate. */
export type IPermissionInput =
  | string
  | readonly string[]
  | IPermissionPredicate;

/** Evaluates permission input without exposing mutable store state. */
export function evaluatePermission(
  value: IPermissionInput | null | undefined,
  source: IAuthorizationSource,
  mapping: IPermissionMap = {}
): boolean {
  if (!value) return false;

  if (typeof value === 'function') {
    try {
      return value(source);
    } catch {
      console.error('[@insight/ui] Permission predicate failed.');
      return false;
    }
  }

  const codes: readonly string[] = typeof value === 'string' ? [value] : value;
  return codes.some((code) => {
    const mapped = Object.prototype.hasOwnProperty.call(mapping, code)
      ? mapping[code]
      : code;
    if (typeof mapped === 'boolean') return mapped;
    const candidates = typeof mapped === 'string' ? [mapped] : mapped;
    return candidates.some((candidate) => source.menuCodes.includes(candidate));
  });
}

/** Reactively checks a menu shorthand or compound authorization predicate. */
export function usePermission(
  value: IPermissionInput | null | undefined
): boolean {
  const store = useIUserMenuStore();
  const permissionMap = usePermissionMapState();
  if (
    store.initializing ||
    !store.initialized ||
    (permissionMap && permissionMap.status !== 'ready')
  )
    return false;
  return evaluatePermission(
    value,
    store.authorizationSource,
    permissionMap?.mapping ?? {}
  );
}

/** Renders children only when the supplied permission input allows access. */
export function IHasMn({
  value,
  children,
}: {
  value: IPermissionInput;
  children: ReactNode;
}): ReactNode {
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  const permissionMap = usePermissionMapState();
  if (
    store.initializing ||
    !store.initialized ||
    (permissionMap && permissionMap.status !== 'ready')
  )
    return null;
  return allowed ? <>{children}</> : null;
}

/** Renders children only when the supplied permission input denies access. */
export function INotHasMn({
  value,
  children,
}: {
  value: IPermissionInput;
  children: ReactNode;
}): ReactNode {
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  const permissionMap = usePermissionMapState();
  if (
    store.initializing ||
    !store.initialized ||
    (permissionMap && permissionMap.status !== 'ready')
  )
    return null;
  return allowed ? null : <>{children}</>;
}
