// host-api.context.tsx
import React, { createContext, useContext } from 'react';
import type { IHostApi } from './host-api.types';

const IHostApiContext = createContext<IHostApi | null>(null);

export function IHostApiProvider(props: {
  hostApi: IHostApi;
  children: React.ReactNode;
}) {
  return (
    <IHostApiContext.Provider value={props.hostApi}>
      {props.children}
    </IHostApiContext.Provider>
  );
}

export function useHostApi(): IHostApi {
  const api = useContext(IHostApiContext);
  if (!api)
    throw new Error(
      'useHostApi() must be used under <IHostApiProvider hostApi={...} />'
    );
  return api;
}
