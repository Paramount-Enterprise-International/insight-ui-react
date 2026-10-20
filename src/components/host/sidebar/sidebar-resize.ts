export type SidebarResizeOptions = {
  resizable: boolean;
  visible: boolean;
  minWidth: number;
  maxWidth: number;
  widthStorageKey: string | null;
};

export type SidebarResizeState = {
  width: number;
  minWidth: number;
  maxWidth: number;
};

/** Framework-independent sidebar interaction; kept identical in both libraries. */
export class SidebarResizeController {
  private readonly host: HTMLElement;
  private readonly handle: HTMLElement;
  private readonly changed: (state: SidebarResizeState) => void;
  private readonly committed: (width: number) => void;
  private readonly document: Document;
  private readonly view: Window;
  private readonly defaultWidth: number;
  private readonly originalWidth: string;
  private readonly originalPriority: string;
  private options: SidebarResizeOptions;
  private initialized = false;
  private loadedStorageKey: string | null | undefined;
  private width: number;
  private drag: { pointerId: number; x: number; width: number } | null = null;

  constructor(
    host: HTMLElement,
    handle: HTMLElement,
    options: SidebarResizeOptions,
    changed: (state: SidebarResizeState) => void,
    committed: (width: number) => void,
  ) {
    this.host = host;
    this.handle = handle;
    this.changed = changed;
    this.committed = committed;
    this.document = host.ownerDocument;
    this.view = this.document.defaultView!;
    this.originalWidth = host.style.getPropertyValue('--i-sidebar-width');
    this.originalPriority = host.style.getPropertyPriority('--i-sidebar-width');
    this.host.classList.add('is-width-initializing');
    this.defaultWidth = this.readDefaultWidth();
    this.width = this.defaultWidth;
    this.options = this.normalize(options);
    this.handle.addEventListener('pointerdown', this.onPointerDown);
    this.handle.addEventListener('keydown', this.onKeyDown);
    this.configure(options);
    this.host.classList.remove('is-width-initializing');
  }

  configure(options: SidebarResizeOptions): void {
    const initialWidth = !this.initialized;
    const next = this.normalize(options);
    const keyChanged = next.widthStorageKey !== this.options.widthStorageKey;
    const boundsChanged =
      next.minWidth !== this.options.minWidth || next.maxWidth !== this.options.maxWidth;
    if (!next.resizable || !next.visible || keyChanged || boundsChanged) this.cancel();
    this.options = next;
    if (next.resizable && (!this.initialized || next.widthStorageKey !== this.loadedStorageKey)) {
      this.initialized = true;
      this.loadedStorageKey = next.widthStorageKey;
      this.width = this.readStoredWidth() ?? this.defaultWidth;
    }
    if (this.initialized) this.render(this.width, initialWidth);
    else this.publish();
  }

  destroy(): void {
    this.cancel();
    this.handle.removeEventListener('pointerdown', this.onPointerDown);
    this.handle.removeEventListener('keydown', this.onKeyDown);
    if (this.originalWidth) {
      this.host.style.setProperty('--i-sidebar-width', this.originalWidth, this.originalPriority);
    } else {
      this.host.style.removeProperty('--i-sidebar-width');
    }
  }

  private normalize(options: SidebarResizeOptions): SidebarResizeOptions {
    const minWidth =
      Number.isFinite(options.minWidth) && options.minWidth > 0 ? options.minWidth : 220;
    const maxWidth =
      Number.isFinite(options.maxWidth) && options.maxWidth > 0 ? options.maxWidth : 480;
    return { ...options, minWidth, maxWidth: Math.max(minWidth, maxWidth) };
  }

  private readDefaultWidth(): number {
    const probe = this.document.createElement('div');
    probe.style.cssText =
      'position:absolute;visibility:hidden;pointer-events:none;' +
      'width:var(--i-sidebar-width,260px);height:0;padding:0;border:0;';
    this.host.appendChild(probe);
    const resolved = this.view.getComputedStyle(probe).width;
    const token = this.view
      .getComputedStyle(this.host)
      .getPropertyValue('--i-sidebar-width')
      .trim();
    probe.remove();
    const value = /^\d+(\.\d+)?px$/.test(resolved)
      ? parseFloat(resolved)
      : /^\d+(\.\d+)?px$/.test(token)
        ? parseFloat(token)
        : 260;
    return value > 0 ? value : 260;
  }

  private readStoredWidth(): number | null {
    if (this.options.widthStorageKey === null) return null;
    try {
      const raw = this.view.localStorage.getItem(this.options.widthStorageKey);
      if (raw === null || !raw.trim()) return null;
      const width = Number(raw);
      return Number.isFinite(width) && width > 0 ? width : null;
    } catch {
      return null;
    }
  }

  private clamp(width: number): number {
    return Math.min(this.options.maxWidth, Math.max(this.options.minWidth, width));
  }

  private render(width: number, immediate = false): void {
    this.width = this.clamp(width);
    if (immediate) this.host.classList.add('is-width-initializing');
    this.host.style.setProperty('--i-sidebar-width', `${this.width}px`);
    if (immediate) {
      // Resolve the initial width before restoring hide/show transitions.
      this.host.getBoundingClientRect();
      this.host.classList.remove('is-width-initializing');
    }
    this.publish();
  }

  private publish(): void {
    this.changed({
      width: this.width,
      minWidth: this.options.minWidth,
      maxWidth: this.options.maxWidth,
    });
  }

  private commit(previousWidth: number): void {
    if (this.width === previousWidth) return;
    if (this.options.widthStorageKey !== null) {
      try {
        this.view.localStorage.setItem(this.options.widthStorageKey, String(this.width));
      } catch {
        // Keep resizing available when storage is blocked or full.
      }
    }
    this.committed(this.width);
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (
      !this.options.resizable ||
      !this.options.visible ||
      this.drag ||
      !event.isPrimary ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    this.handle.focus();
    this.drag = { pointerId: event.pointerId, x: event.clientX, width: this.width };
    this.host.classList.add('is-resizing');
    this.document.documentElement.classList.add('ih-sidebar-resizing');
    this.document.addEventListener('pointermove', this.onPointerMove);
    this.document.addEventListener('pointerup', this.onPointerUp);
    this.document.addEventListener('pointercancel', this.onPointerCancel);
    this.document.addEventListener('keydown', this.onDragKeyDown, true);
    this.handle.addEventListener('lostpointercapture', this.onPointerCancel);
    this.view.addEventListener('blur', this.onBlur);
    try {
      this.handle.setPointerCapture(event.pointerId);
    } catch {
      // Document listeners also support environments without pointer capture.
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    let width = this.clamp(this.drag.width + event.clientX - this.drag.x);
    if (
      this.defaultWidth >= this.options.minWidth &&
      this.defaultWidth <= this.options.maxWidth &&
      Math.abs(width - this.defaultWidth) <= 12
    ) {
      width = this.defaultWidth;
    }
    this.render(width);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.drag || this.drag.pointerId !== event.pointerId) return;
    const previousWidth = this.drag.width;
    this.cleanupDrag();
    this.commit(previousWidth);
  };

  private readonly onPointerCancel = (event: PointerEvent): void => {
    if (this.drag?.pointerId === event.pointerId) this.cancel();
  };

  private readonly onBlur = (): void => this.cancel();

  private readonly onDragKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.cancel();
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!this.options.resizable || !this.options.visible || this.drag) return;
    let width = this.width;
    const step = event.shiftKey ? 50 : 10;
    switch (event.key) {
      case 'ArrowLeft':
        width -= step;
        break;
      case 'ArrowRight':
        width += step;
        break;
      case 'Home':
        width = this.options.minWidth;
        break;
      case 'End':
        width = this.options.maxWidth;
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const previousWidth = this.width;
    this.render(width);
    this.commit(previousWidth);
  };

  private cancel(): void {
    if (!this.drag) return;
    const width = this.drag.width;
    this.cleanupDrag();
    this.render(width);
  }

  private cleanupDrag(): void {
    const pointerId = this.drag?.pointerId;
    this.drag = null;
    this.document.removeEventListener('pointermove', this.onPointerMove);
    this.document.removeEventListener('pointerup', this.onPointerUp);
    this.document.removeEventListener('pointercancel', this.onPointerCancel);
    this.document.removeEventListener('keydown', this.onDragKeyDown, true);
    this.handle.removeEventListener('lostpointercapture', this.onPointerCancel);
    this.view.removeEventListener('blur', this.onBlur);
    this.host.classList.remove('is-resizing');
    if (!this.document.querySelector('ih-sidebar.is-resizing')) {
      this.document.documentElement.classList.remove('ih-sidebar-resizing');
    }
    if (pointerId !== undefined) {
      try {
        if (this.handle.hasPointerCapture(pointerId)) this.handle.releasePointerCapture(pointerId);
      } catch {
        // The browser may already have released capture after cancellation.
      }
    }
  }
}
