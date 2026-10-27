import { createContext } from 'react';
import type { ISnackbarApi } from './snackbar-provider';

export const defaultSnackbarScope = {};
export const SnackbarContext = createContext<{
  scope: object;
  maxVisible?: number;
  api: ISnackbarApi;
} | null>(null);
