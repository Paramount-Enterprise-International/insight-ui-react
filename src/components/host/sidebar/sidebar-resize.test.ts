import {
  SidebarResizeController,
  type SidebarResizeOptions,
  type SidebarResizeState,
} from './sidebar-resize';

const defaults: SidebarResizeOptions = {
  resizable: true,
  visible: true,
  minWidth: 220,
  maxWidth: 480,
  widthStorageKey: 'insight.sidebar.width',
};

function pointer(target: EventTarget, type: string, x = 0, id = 1, primary = true): void {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, button: 0 });
  Object.defineProperties(event, {
    pointerId: { value: id },
    isPrimary: { value: primary },
  });
  target.dispatchEvent(event);
}

function key(target: EventTarget, name: string, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: name,
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

describe('Sidebar resize interaction parity', () => {
  let host: HTMLElement;
  let handle: HTMLElement;
  let controller: SidebarResizeController;
  let state: SidebarResizeState;
  let commits: number[];
  let storageDescriptor: PropertyDescriptor | undefined;
  let savedPreference: string | null;
  let savedOther: string | null;
  let captures: Set<number>;

  function mount(options: Partial<SidebarResizeOptions> = {}, cssWidth = '260px'): void {
    host = document.createElement('ih-sidebar');
    host.style.setProperty('--i-sidebar-width', cssWidth);
    handle = document.createElement('div');
    handle.tabIndex = 0;
    host.appendChild(handle);
    document.body.appendChild(host);
    captures = new Set();
    handle.setPointerCapture = (id: number): void => {
      captures.add(id);
    };
    handle.hasPointerCapture = (id: number): boolean => captures.has(id);
    handle.releasePointerCapture = (id: number): void => {
      captures.delete(id);
    };
    controller = new SidebarResizeController(
      host,
      handle,
      { ...defaults, ...options },
      (value) => {
        state = value;
      },
      (value) => {
        commits.push(value);
      },
    );
  }

  beforeEach(() => {
    storageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    savedPreference = localStorage.getItem(defaults.widthStorageKey!);
    savedOther = localStorage.getItem('sidebar-resize-test');
    localStorage.removeItem(defaults.widthStorageKey!);
    localStorage.removeItem('sidebar-resize-test');
    commits = [];
  });

  afterEach(() => {
    controller?.destroy();
    host?.remove();
    if (storageDescriptor) Object.defineProperty(window, 'localStorage', storageDescriptor);
    for (const [name, value] of [
      [defaults.widthStorageKey!, savedPreference],
      ['sidebar-resize-test', savedOther],
    ]) {
      if (value === null) localStorage.removeItem(name!);
      else localStorage.setItem(name!, value!);
    }
  });

  it('uses the CSS width and never changes the root token', () => {
    const rootWidth = document.documentElement.style.getPropertyValue('--i-sidebar-width');
    mount({}, '300px');
    expect(state.width).toBe(300);
    key(handle, 'ArrowRight');
    expect(host.style.getPropertyValue('--i-sidebar-width')).toBe('310px');
    expect(document.documentElement.style.getPropertyValue('--i-sidebar-width')).toBe(rootWidth);
    expect(commits).toEqual([310]);
  });

  it('ignores saved width while initially disabled and loads it on enable', () => {
    localStorage.setItem(defaults.widthStorageKey!, '400');
    mount({ resizable: false }, '280px');
    key(handle, 'End');
    pointer(handle, 'pointerdown');
    expect(host.style.getPropertyValue('--i-sidebar-width')).toBe('280px');
    expect(captures.size).toBe(0);
    controller.configure(defaults);
    expect(state.width).toBe(400);
    expect(commits).toEqual([]);
  });

  it('snaps within 12px of the CSS default and leaves the snap zone freely', () => {
    mount({}, '300px');
    pointer(handle, 'pointerdown', 500);
    expect(captures.has(1)).toBe(true);
    pointer(document, 'pointermove', 488);
    expect(state.width).toBe(300);
    pointer(document, 'pointermove', 487);
    expect(state.width).toBe(287);
    pointer(document, 'pointermove', 512);
    expect(state.width).toBe(300);
    pointer(document, 'pointermove', 513);
    expect(state.width).toBe(313);
    expect(localStorage.getItem(defaults.widthStorageKey!)).toBeNull();
    expect(commits).toEqual([]);
    pointer(document, 'pointerup', 513);
    expect(localStorage.getItem(defaults.widthStorageKey!)).toBe('313');
    expect(commits).toEqual([313]);
    expect(captures.size).toBe(0);
    expect(document.documentElement.classList.contains('ih-sidebar-resizing')).toBe(false);
  });

  it('clamps pointer movement and never snaps to a default outside the configured bounds', () => {
    mount({ minWidth: 300, maxWidth: 400 }, '290px');
    pointer(handle, 'pointerdown', 0);
    pointer(document, 'pointermove', 1000);
    expect(state.width).toBe(400);
    pointer(document, 'pointermove', -1000);
    expect(state.width).toBe(300);
    pointer(document, 'pointerup');
    expect(commits).toEqual([]);
  });

  it('supports keyboard steps, bounds and ordinary Tab without pointer snapping', () => {
    mount();
    expect(key(handle, 'ArrowRight').defaultPrevented).toBe(true);
    expect(state.width).toBe(270);
    key(handle, 'ArrowLeft', true);
    expect(state.width).toBe(220);
    key(handle, 'End');
    expect(state.width).toBe(480);
    key(handle, 'ArrowRight');
    key(handle, 'Home');
    expect(state.width).toBe(220);
    expect(commits).toEqual([270, 220, 480, 220]);
    expect(key(handle, 'Tab').defaultPrevented).toBe(false);
  });

  it('restores a committed preference after remount', () => {
    mount();
    key(handle, 'End');
    controller.destroy();
    host.remove();
    mount();
    expect(state.width).toBe(480);
    expect(commits).toEqual([480]);
  });

  it('loads a custom key, clamps saved values and switches keys without emitting', () => {
    localStorage.setItem('sidebar-resize-test', '999');
    mount({ widthStorageKey: 'sidebar-resize-test' });
    expect(state.width).toBe(480);
    key(handle, 'ArrowLeft');
    expect(localStorage.getItem('sidebar-resize-test')).toBe('470');
    expect(localStorage.getItem(defaults.widthStorageKey!)).toBeNull();
    localStorage.setItem(defaults.widthStorageKey!, '330');
    controller.configure(defaults);
    expect(state.width).toBe(330);
    expect(commits).toEqual([470]);
  });

  for (const raw of ['bad', '', ' ', 'NaN', 'Infinity', '-20', '0']) {
    it(`ignores an invalid saved preference: ${JSON.stringify(raw)}`, () => {
      localStorage.setItem(defaults.widthStorageKey!, raw);
      mount();
      expect(state.width).toBe(260);
    });
  }

  it('keeps null-key preferences in memory only', () => {
    localStorage.setItem(defaults.widthStorageKey!, '400');
    mount({ widthStorageKey: null });
    expect(state.width).toBe(260);
    key(handle, 'End');
    expect(localStorage.getItem(defaults.widthStorageKey!)).toBe('400');
    expect(commits).toEqual([480]);
  });

  it('loads a key changed while disabled when resizing is re-enabled', () => {
    mount();
    key(handle, 'End');
    localStorage.setItem('sidebar-resize-test', '320');
    controller.configure({ ...defaults, resizable: false, widthStorageKey: 'sidebar-resize-test' });
    expect(state.width).toBe(480);
    controller.configure({ ...defaults, widthStorageKey: 'sidebar-resize-test' });
    expect(state.width).toBe(320);
    expect(commits).toEqual([480]);
  });

  it('remains interactive when localStorage access throws', () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: (): Storage => {
        throw new Error('Storage blocked');
      },
    });
    mount();
    key(handle, 'End');
    expect(state.width).toBe(480);
    expect(commits).toEqual([480]);
  });

  it('still commits when the storage quota is exceeded', () => {
    const storage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (name: string): string | null => storage.getItem(name),
        setItem: (): void => {
          throw new Error('Quota exceeded');
        },
      },
    });
    mount();
    key(handle, 'End');
    expect(commits).toEqual([480]);
  });

  for (const reason of [
    'pointercancel',
    'lostpointercapture',
    'Escape',
    'blur',
    'hidden',
    'disabled',
    'destroy',
  ]) {
    it(`restores the previous width without saving on ${reason}`, () => {
      mount();
      pointer(handle, 'pointerdown', 0);
      pointer(document, 'pointermove', 100);
      expect(state.width).toBe(360);
      if (reason === 'Escape') key(document, 'Escape');
      else if (reason === 'blur') window.dispatchEvent(new Event('blur'));
      else if (reason === 'hidden') controller.configure({ ...defaults, visible: false });
      else if (reason === 'disabled') controller.configure({ ...defaults, resizable: false });
      else if (reason === 'destroy') controller.destroy();
      else pointer(reason === 'lostpointercapture' ? handle : document, reason);
      expect(host.style.getPropertyValue('--i-sidebar-width')).toBe('260px');
      expect(commits).toEqual([]);
      expect(localStorage.getItem(defaults.widthStorageKey!)).toBeNull();
      expect(captures.size).toBe(0);
      expect(host.classList.contains('is-resizing')).toBe(false);
      expect(document.documentElement.classList.contains('ih-sidebar-resizing')).toBe(false);
      pointer(document, 'pointermove', 200);
      pointer(document, 'pointerup', 200);
      expect(commits).toEqual([]);
    });
  }

  it('preserves committed width across hide/show and clamps updates to the bounds', () => {
    mount();
    key(handle, 'End');
    controller.configure({ ...defaults, visible: false });
    key(handle, 'Home');
    expect(state.width).toBe(480);
    controller.configure(defaults);
    expect(state.width).toBe(480);
    controller.configure({ ...defaults, maxWidth: 350 });
    expect(state.width).toBe(350);
    expect(commits).toEqual([480]);
  });

  it('ignores secondary pointers and pointer events belonging to another drag', () => {
    mount();
    pointer(handle, 'pointerdown', 0, 2, false);
    expect(captures.size).toBe(0);
    pointer(handle, 'pointerdown', 0);
    pointer(document, 'pointermove', 100, 2);
    pointer(document, 'pointercancel', 100, 2);
    pointer(document, 'pointerup', 100, 2);
    expect(state.width).toBe(260);
    expect(captures.has(1)).toBe(true);
  });

  it('isolates instance widths and restores their original inline styles', () => {
    mount();
    const otherHost = document.createElement('ih-sidebar');
    const otherHandle = document.createElement('div');
    otherHost.appendChild(otherHandle);
    document.body.appendChild(otherHost);
    const other = new SidebarResizeController(
      otherHost,
      otherHandle,
      { ...defaults, widthStorageKey: null },
      () => undefined,
      () => undefined,
    );
    try {
      key(handle, 'End');
      expect(otherHost.style.getPropertyValue('--i-sidebar-width')).toBe('260px');
      controller.destroy();
      expect(host.style.getPropertyValue('--i-sidebar-width')).toBe('260px');
      other.destroy();
      expect(otherHost.style.getPropertyValue('--i-sidebar-width')).toBe('');
    } finally {
      other.destroy();
      otherHost.remove();
    }
  });
});
