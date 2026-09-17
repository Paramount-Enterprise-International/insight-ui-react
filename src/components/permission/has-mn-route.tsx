/* eslint-disable react-refresh/only-export-components */
import {
  createElement,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  type ReactElement,
  type ReactNode,
} from 'react';

import { useISession, useIUserMenuStore } from '../auth/insight-auth-context';
import type { ILoadComponent } from '../host/router.types';
import { IIcon } from '../icon/icon';
import { ILoading } from '../loading/loading';
import { ISection, ISectionBody, ISectionHeader } from '../section/section';
import { IRouteAccessContext } from './route-access-context';
import { usePermission, type IPermissionInput } from './use-permission';

/** Keeps denied route content inside the current shell and URL. */
export function IHasMnRoute({ value, children }: {
  value: IPermissionInput;
  children: ReactNode;
}): ReactElement {
  const session = useISession();
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  const reportAccess = useContext(IRouteAccessContext);
  const owner = useId();
  const authenticated = session.isAuth();
  const ready = !session.initializing && authenticated &&
    store.initialized && !store.initializing;

  useEffect(() => {
    if (!session.initializing && authenticated && !store.initialized && !store.initializing) {
      void store.load();
    }
  }, [session.initializing, authenticated, store, store.initialized, store.initializing]);

  useLayoutEffect(() => {
    reportAccess?.(owner, ready && !allowed);
    return () => reportAccess?.(owner, false);
  }, [reportAccess, owner, ready, allowed]);

  if (!ready) {
    return <ILoading label="Loading access..." aria-live="polite" />;
  }
  if (!allowed) {
    return (
      <ISection role="alert">
        <ISectionHeader>
          <IIcon icon="fa-solid fa-user-lock" /> Unauthorized Access
        </ISectionHeader>
        <ISectionBody>
          <p className="text-subtle">You do not have access to this page. Please contact your administrator.</p>
        </ISectionBody>
      </ISection>
    );
  }
  return <>{children}</>;
}

/** Wraps an eager element or lazy route loader with reactive menu authorization. */
export function hasMn(value: IPermissionInput, element: ReactNode): ReactElement;
export function hasMn(value: IPermissionInput, loader: ILoadComponent): ILoadComponent;
export function hasMn(
  value: IPermissionInput,
  content: ReactNode | ILoadComponent,
): ReactElement | ILoadComponent {
  if (typeof content === 'function') {
    const Page = lazy(async () => ({ default: await content() }));
    const GuardedPage = () => (
      <IHasMnRoute value={value}>
        <Suspense fallback={<ILoading label="Loading page..." aria-live="polite" />}>
          <Page />
        </Suspense>
      </IHasMnRoute>
    );
    return async () => GuardedPage;
  }
  return createElement(IHasMnRoute, { value, children: content });
}
