import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IHostApiProvider } from '../host-api.context';
import type { IHostApi } from '../host-api.types';
import { IHostUiProvider, useHostUi } from '../host-ui.context';

function HostApiBridge(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setTitle, setBreadcrumbs } = useHostUi();

  const hostApi = useMemo<IHostApi>(
    () => ({
      navigate: (url) => navigate(url),
      setTitle,
      setBreadcrumbs,
    }),
    [navigate, setTitle, setBreadcrumbs]
  );

  return (
    <IHostApiProvider hostApi={hostApi}>{props.children}</IHostApiProvider>
  );
}

export function HostShell(props: { children: React.ReactNode }) {
  return (
    <IHostUiProvider>
      <HostApiBridge>{props.children}</HostApiBridge>
    </IHostUiProvider>
  );
}
