import { useCallback, useSyncExternalStore } from 'react';
import { useHostApiOptional } from '../host/host-api.context';
import type { IHSelectionSnapshot } from './state-core';

/** Hosted state access never creates another owner in the remote. */
export function useIHState<T>(namespace: string, key: string, fallback: T) {
  const api = useHostApiOptional()?.state;
  if (!api) throw new Error('useIHState requires hostApi.state.');
  useSyncExternalStore(api.subscribe, api.getVersion, api.getVersion);
  const set = useCallback((value: T) => api.set(namespace, key, value), [api, namespace, key]);
  const update = useCallback(
    (updater: (value: T) => T) => api.update(namespace, key, fallback, updater),
    [api, namespace, key, fallback],
  );
  const reset = useCallback(() => api.remove(namespace, key), [api, namespace, key]);
  return {
    value: api.get(namespace, key, fallback),
    set,
    update,
    reset,
    error: api.getError(namespace),
  };
}

const EMPTY: IHSelectionSnapshot = Object.freeze({
  companyId: null,
  projectKey: null,
  menuCode: null,
  companyStatus: 'idle',
  projectStatus: 'idle',
  error: null,
  revision: 0,
});
const noSubscribe = (): (() => void) => () => undefined;
const emptySnapshot = (): IHSelectionSnapshot => EMPTY;

/** Optional access lets ordinary components retain standalone behavior. */
export function useIHSelection() {
  const controller = useHostApiOptional()?.state?.selection;
  const value = useSyncExternalStore(
    controller?.subscribe ?? noSubscribe,
    controller?.getSnapshot ?? emptySnapshot,
    controller?.getSnapshot ?? emptySnapshot,
  );
  return { controller, value };
}
