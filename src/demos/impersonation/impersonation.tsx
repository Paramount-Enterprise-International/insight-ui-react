import { useEffect, useState } from 'react';
import {
  createIRuntime,
  IAuthProvider,
  IHImpersonationBanner,
  IInfoNotice,
  type IApiClient,
} from '../../components';
export function ImpersonationDemo() {
  const [fixture] = useState(() => {
    const runtime = createIRuntime({
      api: { identity: window.location.origin + '/api' },
      signinUrl: '/signin',
    });
    const token =
      'e30.' +
      btoa(
        JSON.stringify({
          sub: 'b',
          name: 'Nina Kartika',
          act: { sub: 'a' },
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      ) +
      '.sig';
    runtime.auth.refresh = async () => ({
      accessToken: token,
      expiresIn: 3600,
    });
    runtime.api.get = (async () => ({
      mode: 'IMPERSONATING',
      impersonatingUser: { fullName: 'Sri Mulyani' },
      impersonatedUser: {
        fullName: 'Nina Kartika',
        jabatan: 'Approval Manager',
      },
      endAt: new Date(Date.now() + 90 * 60_000).toISOString(),
    })) as unknown as IApiClient['get'];
    runtime.csrf.getToken = () => 'fixture';
    runtime.auth.endImpersonation = async () => {
      throw {
        status: 503,
        message: 'Preview only. The session has not been changed.',
      };
    };
    return { runtime, generation: 0 };
  });
  useEffect(() => {
    fixture.generation++;
    return () => {
      const generation = ++fixture.generation;
      queueMicrotask(() => {
        if (fixture.generation === generation) fixture.runtime.dispose();
      });
    };
  }, [fixture]);
  return (
    <IAuthProvider runtime={fixture.runtime}>
      <div className="flex flex-col gap-lg w-full">
        <h1>Impersonation</h1>
        <p>
          Local fixture. End Session demonstrates the retryable error state.
        </p>
        <IHImpersonationBanner />
        <IInfoNotice
          title="Not available."
          message="This action cannot be performed during an impersonation session."
        />
      </div>
    </IAuthProvider>
  );
}
