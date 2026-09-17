import { createContext } from 'react';

/** Lets route gates override router metadata without competing with navigation updates. */
export const IRouteAccessContext = createContext<
  ((owner: string, denied: boolean) => void) | null
>(null);
