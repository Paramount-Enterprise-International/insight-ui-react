import {
  Children,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { IBanner } from '../banner';
import { IButton } from '../button';
import { defaultSnackbarScope, SnackbarContext } from './snackbar-context';
import { nextSnackbarId, SnackbarMount } from './snackbar-runtime';
import type {
  ISnackbarDismissReason,
  ISnackbarOptions,
} from './snackbar.types';

export interface ISnackbarProps extends Omit<ISnackbarOptions, 'onAction'> {
  message?: string | null;
  children?: ReactNode;
  resetKey?: unknown;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: () => void;
  onAfterDismissed?: (reason: ISnackbarDismissReason) => void;
}

export function ISnackbar({
  id,
  message,
  title,
  children,
  resetKey,
  open,
  defaultOpen = true,
  variant = 'neutral',
  position = 'bottom-right',
  durationMs = 5000,
  prefixIcon,
  suffixIcon,
  closable = true,
  closeLabel = 'Close',
  actionLabel,
  actionDisabled = false,
  actionLoading = false,
  dismissOnAction = true,
  dismissOnEscape = true,
  pauseOnHover = true,
  pauseOnFocus = true,
  pauseOnHidden = true,
  maxWidth = '400px',
  onOpenChange,
  onAction,
  onAfterDismissed,
}: ISnackbarProps) {
  const context = useContext(SnackbarContext);
  const [generatedId] = useState(nextSnackbarId);
  const [container] = useState(() =>
    typeof document === 'undefined'
      ? null
      : document.createElement('i-snackbar')
  );
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const mount = useRef<SnackbarMount | null>(null);
  const pendingReason = useRef<ISnackbarDismissReason>('programmatic');
  const previous = useRef({ message, title, durationMs, resetKey });
  const callbacks = useRef({ onOpenChange, onAfterDismissed, open });
  callbacks.current = { onOpenChange, onAfterDismissed, open };
  const resetChanged = !Object.is(previous.current.resetKey, resetKey);
  const active = open ?? (resetChanged ? true : internalOpen);
  const wasActive = useRef(active);
  const hasChildren = Children.toArray(children).some((child) =>
    typeof child === 'string'
      ? !!child.trim()
      : child !== null && typeof child !== 'boolean'
  );
  const hasContent = !!message?.trim() || !!title?.trim() || hasChildren;

  useLayoutEffect(
    () => () => {
      mount.current?.destroy();
      mount.current = null;
    },
    []
  );

  useLayoutEffect(() => {
    const reset =
      resetChanged ||
      (!wasActive.current && active) ||
      previous.current.message !== message ||
      previous.current.title !== title ||
      previous.current.durationMs !== durationMs;
    previous.current = { message, title, durationMs, resetKey };
    wasActive.current = active;
    if (resetChanged) pendingReason.current = 'programmatic';
    if (resetChanged && open === undefined) setInternalOpen(true);
    if (!container) return;
    if (!active || !hasContent) {
      mount.current?.close(pendingReason.current);
      return;
    }
    const options = {
      id: id ?? generatedId,
      scope: context?.scope ?? defaultSnackbarScope,
      maxVisible: context?.maxVisible,
      position,
      durationMs,
      closable,
      dismissOnEscape,
      pauseOnHover,
      pauseOnFocus,
      pauseOnHidden,
      maxWidth,
    };
    if (mount.current) {
      mount.current.update(options, reset);
      return;
    }
    const handle = new SnackbarMount(
      container,
      options,
      (reason) => {
        pendingReason.current = reason;
        if (callbacks.current.open === undefined) setInternalOpen(false);
        callbacks.current.onOpenChange?.(false);
      },
      (reason) => {
        if (mount.current === handle) mount.current = null;
        callbacks.current.onAfterDismissed?.(reason);
      }
    );
    mount.current = handle;
  }, [
    active,
    closable,
    container,
    context,
    dismissOnEscape,
    durationMs,
    generatedId,
    hasContent,
    id,
    maxWidth,
    message,
    open,
    pauseOnFocus,
    pauseOnHidden,
    pauseOnHover,
    position,
    resetChanged,
    resetKey,
    title,
  ]);

  if (!container) return null;
  return createPortal(
    <IBanner
      open
      variant={variant}
      prefixIcon={prefixIcon}
      suffixIcon={suffixIcon}
      closable={closable}
      closeLabel={closeLabel}
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
      aria-atomic="true"
      onClose={() => mount.current?.requestDismiss('close')}>
      <div className="i-snackbar__layout">
        <div className="i-snackbar__copy">
          {title?.trim() && <div className="i-snackbar__title">{title}</div>}
          {message?.trim() && (
            <div className="i-snackbar__message">{message}</div>
          )}
          <div className="i-snackbar__content">{children}</div>
        </div>
        {actionLabel && (
          <IButton
            type="button"
            size="sm"
            disabled={actionDisabled}
            loading={actionLoading}
            onClick={() => {
              if (
                actionDisabled ||
                actionLoading ||
                !mount.current?.interactive
              )
                return;
              onAction?.();
              if (dismissOnAction) mount.current?.requestDismiss('action');
            }}>
            {actionLabel}
          </IButton>
        )}
      </div>
    </IBanner>,
    container
  );
}
