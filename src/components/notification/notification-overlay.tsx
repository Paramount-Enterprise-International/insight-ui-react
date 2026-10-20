import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IDialogContainer } from '../dialog';
import {
  mountNotificationModal,
  type NotificationModal,
} from './notification-modal';
import { waitForNotificationExit } from './notification-transition';

/** Uses the Insight dialog surface with a notification-specific modal lifecycle. */
export function NotificationOverlay({
  children,
  open,
  onExited,
  onClose,
}: {
  children: ReactNode;
  open: boolean;
  onExited: () => void;
  onClose: () => void;
}) {
  const regionRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<NotificationModal | null>(null);
  const exitedRef = useRef(onExited);
  useLayoutEffect(() => {
    exitedRef.current = onExited;
  });
  useLayoutEffect(() => {
    const modal = mountNotificationModal(regionRef.current!);
    modalRef.current = modal;
    return () => {
      modal.destroy();
      modalRef.current = null;
    };
  }, []);
  useLayoutEffect(() => {
    if (open) return;
    const panel = regionRef.current!.closest<HTMLElement>('.i-dialog-panel')!;
    return waitForNotificationExit(panel, () => exitedRef.current());
  }, [open]);
  return createPortal(
    <IDialogContainer
      className={`i-notification-overlay${open ? '' : ' i-notification-closing'}`}
      aria-label="Notifications"
      config={{ width: 'min(400px, 100vw)', height: '100dvh' }}
      onClose={() => {
        if (open && modalRef.current?.isTop()) onClose();
      }}>
      <div
        className="i-notification-focus-region"
        tabIndex={-1}
        ref={regionRef}>
        <span
          className="i-notification-focus-guard"
          data-notification-focus-guard="true"
          tabIndex={0}
          aria-hidden="true"
          onFocus={() => modalRef.current?.focusEdge(true)}
        />
        {children}
        <span
          className="i-notification-focus-guard"
          data-notification-focus-guard="true"
          tabIndex={0}
          aria-hidden="true"
          onFocus={() => modalRef.current?.focusEdge()}
        />
      </div>
    </IDialogContainer>,
    document.body
  );
}
