// host-ui.context.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { IBreadcrumbItem } from './host-api.types';

export type IHostUiState = {
  title: string | null;
  breadcrumbs: IBreadcrumbItem[] | null;
  setTitle: (title: string | null) => void;
  setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
};

const IHostUiContext = createContext<IHostUiState | null>(null);

export function IHostUiProvider(props: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumbItem[] | null>(
    null
  );

  const value = useMemo<IHostUiState>(
    () => ({ title, breadcrumbs, setTitle, setBreadcrumbs }),
    [title, breadcrumbs]
  );

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
