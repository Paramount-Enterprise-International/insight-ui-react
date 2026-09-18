import { useEffect, useState, type ReactNode } from 'react';
import type { IAuthConfigOverrides } from './auth-config';
import { IAuthContext } from './insight-auth-context';
import { createIRuntime, type IRuntime } from './runtime';

export type IAuthProviderProps = {
  children: ReactNode;
} & (
  | { runtime: IRuntime; config?: never }
  | { config?: IAuthConfigOverrides; runtime?: never }
);

/** Provide an external application runtime or own a runtime for the legacy config setup. */
export function IAuthProvider(props: IAuthProviderProps) {
  if (props.runtime && props.config)
    throw new Error('Provide either runtime or config, not both.');
  const [owned] = useState(() =>
    props.runtime ? null : createIRuntime(props.config ?? {})
  );
  const runtime = props.runtime ?? owned!;
  const [lease] = useState(() => ({ generation: 0 }));
  if (runtime.status === 'disposed') throw new Error('Runtime is disposed.');
  useEffect(() => {
    lease.generation++;
    void runtime.initialize();
    return () => {
      const generation = ++lease.generation;
      if (owned)
        queueMicrotask(() => {
          if (lease.generation === generation) owned.dispose();
        });
    };
  }, [runtime, owned, lease]);
  return (
    <IAuthContext.Provider value={runtime}>
      {props.children}
    </IAuthContext.Provider>
  );
}
