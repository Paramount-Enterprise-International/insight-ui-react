import type {
  ISnackbarDismissReason,
  ISnackbarPosition,
  SnackbarRuntimeOptions,
} from './snackbar.types';

type Region = {
  element: HTMLElement;
  entries: SnackbarMount[];
  position: ISnackbarPosition;
  scrollFrame?: number;
  scrollTimer?: ReturnType<typeof setTimeout>;
};
const regions = new WeakMap<Document, Map<ISnackbarPosition, Region>>();
const limits = new WeakMap<object, number>();
let sequence = 0;

export function nextSnackbarId(): string {
  return `i-snackbar-${++sequence}`;
}

function position(options: SnackbarRuntimeOptions): ISnackbarPosition {
  return options.position ?? 'bottom-right';
}

function acquireRegion(doc: Document, value: ISnackbarPosition): Region {
  let map = regions.get(doc);
  if (!map) regions.set(doc, (map = new Map()));
  let region = map.get(value);
  if (!region) {
    const selector = `[data-i-snackbar-viewport="${value}"]`;
    const element =
      doc.querySelector<HTMLElement>(selector) ?? doc.createElement('div');
    element.classList.add('i-snackbar-viewport');
    element.setAttribute('data-i-snackbar-viewport', value);
    if (!element.isConnected) doc.body.appendChild(element);
    region = { element, entries: [], position: value };
    map.set(value, region);
  }
  return region;
}

function arrange(region: Region): void {
  const counts = new Map<object, number>();
  for (const entry of region.entries) {
    const scope = entry.options.scope;
    const count = counts.get(scope) ?? 0;
    const visible = count < (limits.get(scope) ?? Infinity);
    if (visible) counts.set(scope, count + 1);
    entry.setVisible(visible);
  }
}

function place(region: Region, element: HTMLElement): void {
  if (region.position.startsWith('top-')) {
    region.element.prepend(element);
  } else {
    region.element.appendChild(element);
  }
}

function revealNewest(region: Region): void {
  const scroll = (): void => {
    if (
      !region.element.isConnected ||
      !region.entries.some((entry) => entry.interactive)
    )
      return;
    region.element.scrollTop = region.position.startsWith('top-')
      ? 0
      : region.element.scrollHeight;
  };
  const view = region.element.ownerDocument.defaultView;
  const schedule = (): void => {
    if (!view?.requestAnimationFrame) {
      scroll();
      return;
    }
    if (region.scrollFrame !== undefined) return;
    region.scrollFrame = view.requestAnimationFrame(() => {
      region.scrollFrame = undefined;
      scroll();
    });
  };
  schedule();
  clearTimeout(region.scrollTimer);
  // Recheck the edge after the entrance animation and the latest burst settle.
  region.scrollTimer = setTimeout(() => {
    region.scrollTimer = undefined;
    schedule();
  }, 200);
}

/** Owns one portal's queue admission, remaining duration, and dismiss transition. */
export class SnackbarMount {
  readonly element: HTMLElement;
  options: SnackbarRuntimeOptions;
  private readonly doc: Document;
  private readonly request: (reason: ISnackbarDismissReason) => void;
  private readonly dismissed: (reason: ISnackbarDismissReason) => void;
  private region: Region;
  private timer?: ReturnType<typeof setTimeout>;
  private exitTimer?: ReturnType<typeof setTimeout>;
  private remaining = 0;
  private duration = 5000;
  private started = 0;
  private visible = false;
  private hovering = false;
  private focused = false;
  private requested = false;
  private closing = false;
  private destroyed = false;

  constructor(
    element: HTMLElement,
    options: SnackbarRuntimeOptions,
    request: (reason: ISnackbarDismissReason) => void,
    dismissed: (reason: ISnackbarDismissReason) => void
  ) {
    this.element = element;
    this.doc = element.ownerDocument;
    this.options = options;
    this.request = request;
    this.dismissed = dismissed;
    this.region = acquireRegion(this.doc, position(options));
    this.element.classList.add('i-snackbar');
    this.element.addEventListener('mouseenter', this.enter);
    this.element.addEventListener('mouseleave', this.leave);
    this.element.addEventListener('focusin', this.focusIn);
    this.element.addEventListener('focusout', this.focusOut);
    this.element.addEventListener('keydown', this.keydown);
    this.doc.addEventListener('visibilitychange', this.visibility);
    this.region.entries.push(this);
    place(this.region, element);
    this.update(options, true);
  }

  update(options: SnackbarRuntimeOptions, reset = false): void {
    if (this.destroyed) return;
    this.pauseClock();
    const oldPosition = position(this.options);
    this.options = options;
    const limit = options.maxVisible;
    limits.set(
      options.scope,
      Number.isInteger(limit) && limit! > 0 ? limit! : Infinity
    );
    this.element.dataset['snackbarId'] = options.id;
    this.element.style.setProperty(
      '--i-snackbar-max-width',
      options.maxWidth ?? '400px'
    );
    if (oldPosition !== position(options)) {
      const focused = this.element.contains(this.doc.activeElement)
        ? (this.doc.activeElement as HTMLElement)
        : null;
      this.detach();
      this.region = acquireRegion(this.doc, position(options));
      this.region.entries.push(this);
      place(this.region, this.element);
      focused?.focus({ preventScroll: true });
    }
    if (reset) {
      clearTimeout(this.exitTimer);
      this.exitTimer = undefined;
      this.element.classList.remove('i-snackbar--closing');
      this.closing = false;
      this.requested = false;
      const duration = options.durationMs ?? 5000;
      this.duration = Number.isFinite(duration) && duration > 0 ? duration : 0;
      this.remaining = this.duration;
    }
    arrange(this.region);
    if (this.visible && (reset || oldPosition !== position(options)))
      revealNewest(this.region);
    this.resumeClock();
  }

  setVisible(value: boolean): void {
    this.pauseClock();
    const appeared = value && !this.visible;
    this.visible = value;
    this.element.hidden = !value;
    if (appeared) revealNewest(this.region);
    this.resumeClock();
  }

  requestDismiss(reason: ISnackbarDismissReason): void {
    if (this.destroyed || this.closing || this.requested) return;
    this.pauseClock();
    this.requested = true;
    this.request(reason);
  }

  get interactive(): boolean {
    return this.visible && !this.destroyed && !this.closing && !this.requested;
  }

  close(reason: ISnackbarDismissReason): void {
    if (this.destroyed || this.closing) return;
    this.closing = true;
    this.pauseClock();
    this.element.classList.add('i-snackbar--closing');
    const reduceMotion = this.doc.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    this.exitTimer = setTimeout(
      () => {
        this.destroy();
        this.dismissed(reason);
      },
      this.visible && !reduceMotion ? 180 : 0
    );
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.timer);
    clearTimeout(this.exitTimer);
    this.element.removeEventListener('mouseenter', this.enter);
    this.element.removeEventListener('mouseleave', this.leave);
    this.element.removeEventListener('focusin', this.focusIn);
    this.element.removeEventListener('focusout', this.focusOut);
    this.element.removeEventListener('keydown', this.keydown);
    this.doc.removeEventListener('visibilitychange', this.visibility);
    this.element.remove();
    this.detach();
  }

  private detach(): void {
    this.region.entries = this.region.entries.filter((entry) => entry !== this);
    arrange(this.region);
    if (!this.region.entries.length) {
      clearTimeout(this.region.scrollTimer);
      this.region.scrollTimer = undefined;
      if (this.region.scrollFrame !== undefined) {
        this.doc.defaultView?.cancelAnimationFrame?.(this.region.scrollFrame);
        this.region.scrollFrame = undefined;
      }
      if (!this.region.element.childElementCount) this.region.element.remove();
      regions.get(this.doc)?.delete(this.region.position);
    }
  }

  private pauseClock(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
      this.remaining = Math.max(
        0,
        this.remaining - (Date.now() - this.started)
      );
    }
  }

  private resumeClock(): void {
    if (
      this.destroyed ||
      this.closing ||
      this.requested ||
      !this.visible ||
      (this.hovering && this.options.pauseOnHover !== false) ||
      (this.focused && this.options.pauseOnFocus !== false) ||
      (this.doc.visibilityState === 'hidden' &&
        this.options.pauseOnHidden !== false) ||
      this.duration <= 0 ||
      this.timer !== undefined
    )
      return;
    this.started = Date.now();
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.remaining = 0;
      this.requestDismiss('timeout');
    }, this.remaining);
  }

  private readonly enter = (): void => {
    this.pauseClock();
    this.hovering = true;
    this.resumeClock();
  };
  private readonly leave = (): void => {
    this.pauseClock();
    this.hovering = false;
    this.resumeClock();
  };
  private readonly focusIn = (): void => {
    this.pauseClock();
    this.focused = true;
    this.resumeClock();
  };
  private readonly focusOut = (event: FocusEvent): void => {
    if (
      event.relatedTarget &&
      this.element.contains(event.relatedTarget as Node)
    )
      return;
    this.pauseClock();
    this.focused = false;
    this.resumeClock();
  };
  private readonly visibility = (): void => {
    this.pauseClock();
    this.resumeClock();
  };
  private readonly keydown = (event: KeyboardEvent): void => {
    if (
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      this.options.dismissOnEscape === false ||
      !this.element.contains(this.doc.activeElement)
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    this.requestDismiss('escape');
  };
}
