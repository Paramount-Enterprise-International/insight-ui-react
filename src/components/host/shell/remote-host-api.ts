import { useLayoutEffect, useMemo, useRef } from 'react';
import { useHostApi } from '../host-api.context';
import type { IHostApi } from '../host-api.types';
import { useHostUi } from '../host-ui.context';

/** Creates a bridge for one active remote without replacing host metadata. */
export function useRemoteHostApi(): IHostApi {
  const hostApi = useHostApi();
  const {
    setRemoteTitle,
    setRemoteBreadcrumbs,
    setRemoteRouteMetadata,
    clearRemote,
  } = useHostUi();
  const active = useRef(true);
  useLayoutEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      clearRemote();
    };
  }, [clearRemote]);
  return useMemo(() => {
    const setTitle: IHostApi['setTitle'] = (title) => {
      if (active.current) setRemoteTitle(title);
    };
    const setBreadcrumbs: IHostApi['setBreadcrumbs'] = (items) => {
      if (active.current) setRemoteBreadcrumbs(items);
    };
    return {
      navigate: hostApi.navigate,
      setTitle,
      setBreadcrumbs,
      setRemoteTitle: setTitle,
      setRemoteBreadcrumbs: setBreadcrumbs,
      setRouteMetadata: (metadata) => {
        if (active.current) setRemoteRouteMetadata(metadata);
      },
      clearRemote: () => {
        if (active.current) clearRemote();
      },
    };
  }, [
    hostApi.navigate,
    setRemoteTitle,
    setRemoteBreadcrumbs,
    setRemoteRouteMetadata,
    clearRemote,
  ]);
}
