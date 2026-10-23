import React, { useMemo } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { IHostApiProvider } from '../host-api.context';
import type { IHostApi } from '../host-api.types';
import { IHostUiProvider, useHostUi } from '../host-ui.context';
import { toRouterUrl } from '../router-breadcrumbs';
import type { IHStateApi } from '../../state/state-core';

function HostApiBridge(props: { children: React.ReactNode; state?: IHStateApi }) {
  const navigate = useNavigate();
  const baseHref = useHref('/');
  const {
    setTitle,
    setBreadcrumbs,
    setRemoteTitle,
    setRemoteBreadcrumbs,
    clearRemote,
    setRouteMetadata,
  } = useHostUi();

  const hostApi = useMemo<IHostApi>(
    () => ({
      state: props.state,
      navigate: (url) => navigate(toRouterUrl(url, baseHref)),
      setTitle,
      setBreadcrumbs,
      setRemoteTitle,
      setRemoteBreadcrumbs,
      clearRemote,
      setRouteMetadata,
    }),
    [
      props.state,
      navigate,
      baseHref,
      setTitle,
      setBreadcrumbs,
      setRemoteTitle,
      setRemoteBreadcrumbs,
      clearRemote,
      setRouteMetadata,
    ]
  );

  return (
    <IHostApiProvider hostApi={hostApi}>{props.children}</IHostApiProvider>
  );
}

export function HostShell(props: { children: React.ReactNode; state?: IHStateApi }) {
  return (
    <IHostUiProvider>
      <HostApiBridge state={props.state}>{props.children}</HostApiBridge>
    </IHostUiProvider>
  );
}
