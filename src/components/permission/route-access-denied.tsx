import { useContext, useId, useLayoutEffect } from 'react';

import { IErrorPage } from '../error-page/error-page';
import { IRouteAccessContext } from './route-access-context';

/** Displays route denial in place and restores host metadata when it unmounts. */
export function IRouteAccessDenied() {
  const reportAccess = useContext(IRouteAccessContext);
  const owner = useId();
  useLayoutEffect(() => {
    reportAccess?.(owner, true);
    return () => reportAccess?.(owner, false);
  }, [reportAccess, owner]);
  return <IErrorPage kind="forbidden" role="alert" />;
}
