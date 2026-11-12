/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** Remote-local aliases mapped to ANY menu codes or explicit boolean UI overrides. */
export type IPermissionMap = Readonly<
  Record<string, boolean | string | readonly string[]>
>;
export type IPermissionMapConfig =
  | IPermissionMap
  | (() => Promise<IPermissionMap>);
export type IPermissionMapState =
  | { status: 'loading' | 'error'; mapping: null }
  | { status: 'ready'; mapping: IPermissionMap };

const PermissionMapContext = createContext<IPermissionMapState | null>(null);

/** Validate runtime JSON and take an immutable snapshot of its own entries. */
export function validatePermissionMap(value: unknown): IPermissionMap {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Permission mapping must be a JSON object.');
  const entries = Object.entries(value).map(([key, codes]) => {
    if (!key.trim())
      throw new Error('Permission mapping keys must be non-empty strings.');
    if (typeof codes === 'boolean') return [key, codes];
    if (typeof codes !== 'string' && !Array.isArray(codes))
      throw new Error(
        'Permission mappings must contain booleans, strings or arrays of strings.'
      );
    const list: unknown[] = Array.isArray(codes) ? codes : [codes];
    if (list.some((code) => typeof code !== 'string' || !code.trim()))
      throw new Error('Mapped menu codes must be non-empty strings.');
    return [key, Array.isArray(codes) ? Object.freeze([...codes]) : codes];
  });
  return Object.freeze(Object.fromEntries(entries)) as IPermissionMap;
}

/** Scope one runtime mapping to a remote subtree, never to the shared authorization store. */
export function IMenuPermissionMappingProvider({
  mapping,
  children,
}: {
  mapping: IPermissionMapConfig;
  children: ReactNode;
}): ReactNode {
  const initial = useMemo<IPermissionMapState>(() => {
    if (typeof mapping === 'function')
      return { status: 'loading', mapping: null };
    try {
      return { status: 'ready', mapping: validatePermissionMap(mapping) };
    } catch {
      console.error('[@insight/ui-react] Invalid permission mapping.');
      return { status: 'error', mapping: null };
    }
  }, [mapping]);
  const [loaded, setLoaded] = useState<{
    initial: IPermissionMapState;
    state: IPermissionMapState;
  } | null>(null);
  const state =
    typeof mapping === 'function' && loaded?.initial === initial
      ? loaded.state
      : initial;

  useEffect(() => {
    if (typeof mapping !== 'function') return;
    let active = true;
    void Promise.resolve()
      .then(() => (active ? mapping() : undefined))
      .then((value) => {
        if (!active) return;
        setLoaded({
          initial,
          state: { status: 'ready', mapping: validatePermissionMap(value) },
        });
      })
      .catch(() => {
        if (!active) return;
        console.error('[@insight/ui-react] Unable to load permission mapping.');
        setLoaded({
          initial,
          state: { status: 'error', mapping: null },
        });
      });
    return () => {
      active = false;
    };
  }, [mapping, initial]);

  return (
    <PermissionMapContext.Provider value={state}>
      {children}
    </PermissionMapContext.Provider>
  );
}

/** @internal Shared by the UI gates and route boundary. */
export function usePermissionMapState(): IPermissionMapState | null {
  return useContext(PermissionMapContext);
}
