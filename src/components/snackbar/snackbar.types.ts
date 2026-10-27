import type { IBannerVariant } from '../banner';

export type ISnackbarPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ISnackbarDismissReason =
  | 'timeout'
  | 'close'
  | 'action'
  | 'escape'
  | 'programmatic';

export interface ISnackbarOptions {
  id?: string;
  title?: string;
  variant?: IBannerVariant;
  position?: ISnackbarPosition;
  durationMs?: number;
  prefixIcon?: string;
  suffixIcon?: string;
  closable?: boolean;
  closeLabel?: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  dismissOnAction?: boolean;
  dismissOnEscape?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  pauseOnHidden?: boolean;
  maxWidth?: string;
  onAction?: () => void;
}

export type ISnackbarChanges = Partial<Omit<ISnackbarOptions, 'id'>> & {
  message?: string;
};
export type ISnackbarDefaults = { maxVisible?: number };

export type SnackbarRuntimeOptions = ISnackbarOptions & {
  id: string;
  scope: object;
  maxVisible?: number;
};
