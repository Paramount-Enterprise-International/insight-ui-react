/* eslint-disable react-refresh/only-export-components */
import {
  createElement,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { USER_APPLICATION_MAPPING_NOT_FOUND } from '../api/error-codes';
import { useISession, useIUserMenuStore } from '../auth/insight-auth-context';
import { IErrorPage } from '../error-page/error-page';
import type { ILoadComponent } from '../host/router.types';
import { ILoadError } from '../load-error/load-error';
import { ILoading } from '../loading/loading';
import { usePermissionMapState } from './permission-map';
import { IRouteAccessContext } from './route-access-context';
import { usePermission, type IPermissionInput } from './use-permission';

/** Keeps denied route content inside the current shell and URL. */
export function IHasMnRoute({
  value,
  children,
}: {
  value: IPermissionInput;
  children: ReactNode;
}): ReactElement {
  const session = useISession();
  const store = useIUserMenuStore();
  const allowed = usePermission(value);
  const permissionMap = usePermissionMapState();
  const reportAccess = useContext(IRouteAccessContext);
  const owner = useId();
  const retrying = useRef(false);
  const errors = store.loadErrors;
  const loadFailed = [errors.menus, errors.authorizations].some(
    (error) => !!error && error.errorCode !== USER_APPLICATION_MAPPING_NOT_FOUND
  );
  const authenticated = session.isAuth();
  const ready =
    !session.initializing &&
    authenticated &&
    store.initialized &&
    !store.initializing &&
    permissionMap?.status !== 'loading';

  useEffect(() => {
    if (
      !session.initializing &&
      authenticated &&
      !store.initialized &&
      !store.initializing
    ) {
      void store.load();
    }
  }, [
    session.initializing,
    authenticated,
    store,
    store.initialized,
    store.initializing,
  ]);

  useLayoutEffect(() => {
    reportAccess?.(owner, ready && !allowed && !loadFailed);
    return () => reportAccess?.(owner, false);
  }, [reportAccess, owner, ready, allowed, loadFailed]);

  const retry = () => {
    if (retrying.current || store.initializing) return;
    retrying.current = true;
    void store
      .load()
      .catch(() => undefined)
      .finally(() => {
        retrying.current = false;
      });
  };

  if (!ready) {
    return <ILoading mode="container" label="Loading access..." />;
  }
  if (loadFailed) {
    return (
      <ILoadError
        message="Failed to load your access rights. Please try again."
        title="Failed to load access."
        onRetry={retry}
      />
    );
  }
  if (!allowed) {
    return <IErrorPage kind="forbidden" role="alert" />;
  }
  return <>{children}</>;
}

/** Wraps an eager element or lazy route loader with reactive menu authorization. */
export function hasMn(
  value: IPermissionInput,
  element: ReactNode
): ReactElement;
export function hasMn(
  value: IPermissionInput,
  loader: ILoadComponent
): ILoadComponent;
export function hasMn(
  value: IPermissionInput,
  content: ReactNode | ILoadComponent
): ReactElement | ILoadComponent {
  if (typeof content === 'function') {
    const Page = lazy(async () => ({ default: await content() }));
    const GuardedPage = () => (
      <IHasMnRoute value={value}>
        <Suspense
          fallback={<ILoading mode="container" label="Loading page..." />}>
          <Page />
        </Suspense>
      </IHasMnRoute>
    );
    return async () => GuardedPage;
  }
  return createElement(IHasMnRoute, { value, children: content });
}
