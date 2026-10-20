/** Notification modal behavior shared by the framework-specific overlay views. */
const panels: HTMLElement[] = [];
const locks = new WeakMap<
  Document,
  {
    count: number;
    bodyOverflow: string;
    rootOverflow: string;
    paddingRight: string;
  }
>();

function lockScroll(doc: Document): () => void {
  let lock = locks.get(doc);
  if (!lock) {
    lock = {
      count: 0,
      bodyOverflow: doc.body.style.overflow,
      rootOverflow: doc.documentElement.style.overflow,
      paddingRight: doc.body.style.paddingRight,
    };
    locks.set(doc, lock);
    const scrollbar =
      (doc.defaultView?.innerWidth ?? 0) - doc.documentElement.clientWidth;
    if (scrollbar > 0)
      doc.body.style.paddingRight = `${parseFloat(getComputedStyle(doc.body).paddingRight || '0') + scrollbar}px`;
    doc.body.style.overflow = 'hidden';
    doc.documentElement.style.overflow = 'hidden';
  }
  lock.count++;
  return () => {
    if (--lock.count) return;
    doc.body.style.overflow = lock.bodyOverflow;
    doc.documentElement.style.overflow = lock.rootOverflow;
    doc.body.style.paddingRight = lock.paddingRight;
    locks.delete(doc);
  };
}

function focusables(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]'
    )
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      !element.closest('[hidden], [inert], [data-notification-focus-guard]') &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden'
  );
}

export type NotificationModal = {
  isTop: () => boolean;
  focusEdge: (last?: boolean) => void;
  destroy: () => void;
};

/** Mount once per open drawer. Existing Insight dialogs retain their higher layer. */
export function mountNotificationModal(panel: HTMLElement): NotificationModal {
  const doc = panel.ownerDocument;
  const previous = doc.activeElement as HTMLElement | null;
  const container = panel.closest('i-dialog-container')!;
  const isTop = (): boolean =>
    panels.at(-1) === panel &&
    !Array.from(doc.querySelectorAll<HTMLElement>('[role="dialog"]')).some(
      (other) =>
        other !== container &&
        !other.contains(container) &&
        !other.closest('[hidden], [inert]') &&
        getComputedStyle(other).display !== 'none' &&
        getComputedStyle(other).visibility !== 'hidden' &&
        (Number.parseInt(getComputedStyle(other).zIndex, 10) || 1050) >=
          (Number.parseInt(getComputedStyle(container).zIndex, 10) || 1000)
    );
  const focusEdge = (last = false): void => {
    if (!isTop()) return;
    const elements = focusables(panel);
    (last ? (elements.at(-1) ?? panel) : (elements[0] ?? panel)).focus({
      preventScroll: true,
    });
  };
  panels.push(panel);
  const unlock = lockScroll(doc);
  const keydown = (event: KeyboardEvent): void => {
    if (!isTop() || event.key !== 'Tab') return;
    const elements = focusables(panel);
    if (!elements.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (
      event.shiftKey &&
      (doc.activeElement === first || doc.activeElement === panel)
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (doc.activeElement === last || !panel.contains(doc.activeElement))
    ) {
      event.preventDefault();
      first.focus();
    }
  };
  const focusin = (event: FocusEvent): void => {
    if (isTop() && !panel.contains(event.target as Node)) focusEdge();
  };
  doc.addEventListener('keydown', keydown, true);
  doc.addEventListener('focusin', focusin, true);
  focusEdge();
  let destroyed = false;
  return {
    isTop,
    focusEdge,
    destroy: (): void => {
      if (destroyed) return;
      destroyed = true;
      const wasTop = isTop();
      panels.splice(panels.indexOf(panel), 1);
      doc.removeEventListener('keydown', keydown, true);
      doc.removeEventListener('focusin', focusin, true);
      unlock();
      if (wasTop && previous?.isConnected)
        previous.focus({ preventScroll: true });
    },
  };
}
