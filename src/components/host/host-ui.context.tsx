/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { IBreadcrumbItem, IHostRouteMetadata } from './host-api.types';

export type IHostUiState = {
  title: string | null;
  breadcrumbs: IBreadcrumbItem[] | null;
  setTitle: (title: string | null) => void;
  setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
  setRemoteTitle: (title: string | null) => void;
  setRemoteBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
  clearRemote: () => void;
  clear: () => void;
  setRouteMetadata: (metadata: IHostRouteMetadata) => void;
  setRemoteRouteMetadata: (metadata: IHostRouteMetadata) => void;
};

const EMPTY_METADATA: IHostRouteMetadata = { title: null, breadcrumbs: null };
const IHostUiContext = createContext<IHostUiState | null>(null);

export function IHostUiProvider(props: { children: React.ReactNode }) {
  const [route, setRouteMetadata] = useState(EMPTY_METADATA);
  const [remote, setRemoteRouteMetadata] = useState(EMPTY_METADATA);
  const [titleOverride, setTitle] = useState<string | null>(null);
  const [breadcrumbsOverride, setBreadcrumbs] = useState<
    IBreadcrumbItem[] | null
  >(null);
  const setRemoteTitle = useCallback((title: string | null) => {
    setRemoteRouteMetadata((current) => ({ ...current, title }));
  }, []);
  const setRemoteBreadcrumbs = useCallback(
    (breadcrumbs: IBreadcrumbItem[] | null) => {
      setRemoteRouteMetadata((current) => ({ ...current, breadcrumbs }));
    },
    []
  );
  const clearRemote = useCallback(
    () => setRemoteRouteMetadata(EMPTY_METADATA),
    []
  );
  const clear = useCallback(() => {
    setTitle(null);
    setBreadcrumbs(null);
    clearRemote();
  }, [clearRemote]);

  const value = useMemo<IHostUiState>(() => {
    const denied = route.denied || remote.denied;
    return {
      title:
        titleOverride ||
        (denied ? 'Unauthorized Access' : remote.title || route.title),
      breadcrumbs:
        breadcrumbsOverride ??
        (denied
          ? [{ label: 'Unauthorized Access' }]
          : route.breadcrumbs || remote.breadcrumbs
            ? [...(route.breadcrumbs ?? []), ...(remote.breadcrumbs ?? [])]
            : null),
      setTitle,
      setBreadcrumbs,
      setRemoteTitle,
      setRemoteBreadcrumbs,
      clearRemote,
      clear,
      setRouteMetadata,
      setRemoteRouteMetadata,
    };
  }, [
    route,
    remote,
    titleOverride,
    breadcrumbsOverride,
    setRemoteTitle,
    setRemoteBreadcrumbs,
    clearRemote,
    clear,
  ]);

  return (
    <IHostUiContext.Provider value={value}>
      {props.children}
    </IHostUiContext.Provider>
  );
}

export function useHostUi(): IHostUiState {
  const ctx = useContext(IHostUiContext);
  if (!ctx)
    throw new Error('useHostUi() must be used under <IHostUiProvider />');
  return ctx;
}
