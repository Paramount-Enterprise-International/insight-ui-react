import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ISnackbar } from './snackbar';
import {
  ISnackbarProvider,
  useISnackbar,
  type ISnackbarApi,
} from './snackbar-provider';
import type { ISnackbarPosition } from './snackbar.types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const positions: ISnackbarPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];
const card = (id: string): HTMLElement =>
  document.querySelector(`[data-snackbar-id="${id}"]`)!;
const advance = (ms: number): void => {
  act(() => vi.advanceTimersByTime(ms));
};

describe('ISnackbar', () => {
  it.each(positions)(
    'scrolls to the latest rendered content at %s without changing focus',
    (position) => {
      let frame: FrameRequestCallback | undefined;
      const schedule = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((callback) => {
          frame = callback;
          return 7;
        });
      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      const stack = (message: string | null) => (
        <>
          <ISnackbar
            id="older"
            message="Older"
            position={position}
            durationMs={0}
          />
          {message !== null && (
            <ISnackbar
              id="newest"
              message={message}
              position={position}
              durationMs={0}
            />
          )}
        </>
      );
      const { rerender, unmount } = render(stack(null));
      const viewport = card('older').parentElement!;
      let height = 300;
      Object.defineProperties(viewport, {
        scrollHeight: { configurable: true, get: () => height },
        scrollTop: { configurable: true, writable: true, value: 80 },
      });
      rerender(stack('Newest'));
      height = 900;
      expect(viewport.scrollTop).toBe(80);
      expect(schedule).toHaveBeenCalledTimes(1);
      frame!(0);
      expect(viewport.scrollTop).toBe(position.startsWith('top-') ? 0 : 900);
      rerender(stack('Updated notification summary'));
      height = 1400;
      frame!(16);
      expect(viewport.scrollTop).toBe(position.startsWith('top-') ? 0 : 1400);
      expect(document.activeElement).toBe(trigger);
      unmount();
      trigger.remove();
    }
  );

  it.each(positions)(
    'portals literal text into %s without taking focus',
    (position) => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      const { container, unmount } = render(
        <ISnackbar
          id="position"
          position={position}
          message="<b>literal</b>"
          durationMs={0}
        />
      );
      expect(container.querySelector('i-snackbar')).toBeNull();
      expect(
        card('position').parentElement?.getAttribute('data-i-snackbar-viewport')
      ).toBe(position);
      expect(card('position').querySelector('b')).toBeNull();
      expect(card('position').textContent).toContain('<b>literal</b>');
      expect(document.activeElement).toBe(trigger);
      unmount();
      trigger.remove();
      expect(document.querySelector('[data-i-snackbar-viewport]')).toBeNull();
    }
  );

  it.each([
    'neutral',
    'primary',
    'info',
    'success',
    'warning',
    'danger',
  ] as const)(
    'uses the banner %s theme and one live announcement',
    (variant) => {
      render(
        <ISnackbar
          id="theme"
          variant={variant}
          durationMs={0}
          title="Title"
          prefixIcon="info"
          suffixIcon="sync">
          <strong>Content</strong>
        </ISnackbar>
      );
      const surface = card('theme').querySelector('i-banner')!;
      expect(surface.getAttribute('variant')).toBe(variant);
      expect(surface.getAttribute('role')).toBe(
        variant === 'danger' ? 'alert' : 'status'
      );
      expect(surface.getAttribute('aria-live')).toBe(
        variant === 'danger' ? 'assertive' : 'polite'
      );
      expect(card('theme').querySelectorAll('[aria-live]')).toHaveLength(1);
      expect(surface.querySelector('strong')?.textContent).toBe('Content');
    }
  );

  it('keeps empty content hidden and respects defaultOpen', () => {
    render(
      <>
        <ISnackbar message="  " />
        <ISnackbar message="Closed" defaultOpen={false} />
      </>
    );
    expect(document.querySelector('[data-i-snackbar-viewport]')).toBeNull();
  });

  it('pauses for overlapping hover, focus and hidden-tab reasons and resumes remaining time', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(
      <ISnackbar
        id="timer"
        message="Timer"
        durationMs={1000}
        onAfterDismissed={done}
      />
    );
    advance(400);
    fireEvent.mouseEnter(card('timer'));
    card('timer').querySelector<HTMLButtonElement>('button')!.focus();
    advance(2000);
    fireEvent.mouseLeave(card('timer'));
    advance(2000);
    expect(done).not.toHaveBeenCalled();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    card('timer').querySelector<HTMLButtonElement>('button')!.blur();
    advance(2000);
    vi.restoreAllMocks();
    fireEvent(document, new Event('visibilitychange'));
    advance(599);
    expect(card('timer')).toBeTruthy();
    advance(1);
    expect(done).not.toHaveBeenCalled();
    advance(180);
    expect(done).toHaveBeenCalledExactlyOnceWith('timeout');
    expect(card('timer')).toBeNull();
  });

  it('can disable automatic pauses', () => {
    vi.useFakeTimers();
    render(
      <ISnackbar
        id="unpaused"
        message="Timer"
        durationMs={100}
        pauseOnHover={false}
        pauseOnFocus={false}
        pauseOnHidden={false}
      />
    );
    fireEvent.mouseEnter(card('unpaused'));
    card('unpaused').querySelector<HTMLButtonElement>('button')!.focus();
    advance(100);
    expect(card('unpaused')).toHaveClass('i-snackbar--closing');
    advance(180);
    expect(card('unpaused')).toBeNull();
  });

  it('keeps persistent messages, blocks disabled actions and only handles focused Escape', () => {
    vi.useFakeTimers();
    const action = vi.fn(),
      done = vi.fn();
    const { rerender } = render(
      <ISnackbar
        id="persistent"
        message="Saved"
        durationMs={0}
        actionLabel="Undo"
        actionDisabled
        onAction={action}
        onAfterDismissed={done}
      />
    );
    advance(60_000);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(action).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(done).not.toHaveBeenCalled();
    rerender(
      <ISnackbar
        id="persistent"
        message="Saved"
        durationMs={0}
        actionLabel="Undo"
        dismissOnAction={false}
        onAction={action}
        onAfterDismissed={done}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(action).toHaveBeenCalledOnce();
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    fireEvent.keyDown(close, { key: 'Escape' });
    advance(180);
    expect(done).toHaveBeenCalledExactlyOnceWith('escape');
  });

  it('reports an action dismissal once and keeps unrelated IDs visible', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(
      <>
        <ISnackbar
          id="action"
          message="Saved"
          actionLabel="Undo"
          durationMs={0}
          onAfterDismissed={done}
        />
        <ISnackbar id="other" message="Another message" durationMs={0} />
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    advance(180);
    expect(done).toHaveBeenCalledExactlyOnceWith('action');
    expect(card('other')).toBeTruthy();
  });

  it('honors controlled visibility and can reopen during an exit transition', () => {
    vi.useFakeTimers();
    const request = vi.fn(),
      done = vi.fn();
    const { rerender } = render(
      <ISnackbar
        id="controlled"
        message="Controlled"
        open
        durationMs={100}
        onOpenChange={request}
        onAfterDismissed={done}
      />
    );
    advance(100);
    expect(request).toHaveBeenCalledExactlyOnceWith(false);
    expect(card('controlled')).toBeTruthy();
    rerender(
      <ISnackbar
        id="controlled"
        message="Controlled"
        open={false}
        durationMs={100}
        onAfterDismissed={done}
      />
    );
    advance(50);
    rerender(
      <ISnackbar
        id="controlled"
        message="Controlled"
        open
        durationMs={0}
        onAfterDismissed={done}
      />
    );
    advance(1000);
    expect(card('controlled')).toBeTruthy();
    expect(done).not.toHaveBeenCalled();
  });

  it('keeps one portal in StrictMode and disposes all scheduled work on unmount', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <ISnackbar id="strict" message="Strict" onAfterDismissed={done} />
      </StrictMode>
    );
    expect(
      document.querySelectorAll('[data-snackbar-id="strict"]')
    ).toHaveLength(1);
    unmount();
    advance(10_000);
    expect(done).not.toHaveBeenCalled();
    expect(document.querySelector('[data-i-snackbar-viewport]')).toBeNull();
  });

  it('does not access the DOM during server rendering', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(renderToString(<ISnackbar message="Server" />)).toBe('');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('ISnackbarProvider and useISnackbar', () => {
  let api: ISnackbarApi;
  function Consumer() {
    api = useISnackbar();
    return null;
  }

  it('rechecks the bottom 200 ms after the latest six-theme burst and cleans up the delay', () => {
    vi.useFakeTimers();
    let frame: FrameRequestCallback | undefined;
    const schedule = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frame = callback;
        return 7;
      });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const { unmount } = render(
      <ISnackbarProvider>
        <Consumer />
      </ISnackbarProvider>
    );
    const variants = [
      'neutral',
      'primary',
      'success',
      'info',
      'warning',
      'danger',
    ] as const;
    const burst = (offset: number): void => {
      act(() =>
        variants.forEach((variant, index) =>
          api.show(variant, {
            id: `theme-${offset + index}`,
            variant,
            durationMs: 0,
          })
        )
      );
    };
    burst(0);
    const viewport = card('theme-0').parentElement!;
    let height = 300;
    Object.defineProperties(viewport, {
      scrollHeight: { configurable: true, get: () => height },
      scrollTop: { configurable: true, writable: true, value: 0 },
    });
    frame!(0);
    advance(100);
    burst(6);
    height = 600;
    frame!(100);
    height = 1400;
    advance(199);
    expect(schedule).toHaveBeenCalledTimes(2);
    expect(viewport.scrollTop).toBe(600);
    advance(1);
    expect(schedule).toHaveBeenCalledTimes(3);
    frame!(300);
    expect(viewport.scrollTop).toBe(1400);
    burst(12);
    unmount();
    const calls = schedule.mock.calls.length;
    advance(1000);
    expect(schedule).toHaveBeenCalledTimes(calls);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('only schedules a queued reveal on admission and cancels it on unmount', () => {
    vi.useFakeTimers();
    let frame: FrameRequestCallback | undefined;
    const schedule = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frame = callback;
        return 7;
      });
    const cancel = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});
    const { unmount } = render(
      <ISnackbarProvider maxVisible={1}>
        <Consumer />
      </ISnackbarProvider>
    );
    act(() => {
      api.show('First', { id: 'first', durationMs: 0 });
      api.show('Queued', { id: 'queued', durationMs: 0 });
    });
    frame!(0);
    act(() => api.update('queued', { message: 'Still waiting' }));
    expect(schedule).toHaveBeenCalledTimes(1);
    act(() => api.dismiss('first'));
    advance(180);
    expect(card('queued').hidden).toBe(false);
    expect(schedule).toHaveBeenCalledTimes(2);
    unmount();
    expect(cancel).toHaveBeenCalledWith(7);
  });

  it('reopens an ID updated during its exit without resolving its ref early', () => {
    vi.useFakeTimers();
    render(
      <ISnackbarProvider>
        <Consumer />
      </ISnackbarProvider>
    );
    act(() => api.show('Initial', { id: 'reopen', durationMs: 0 }));
    act(() => api.dismiss('reopen'));
    advance(50);
    act(() => api.show('Reopened', { id: 'reopen', durationMs: 0 }));
    advance(1000);
    expect(card('reopen').textContent).toContain('Reopened');
    act(() => api.dismissAll());
    advance(180);
  });

  it('updates the same ID, moves positions, and dismisses only the selected entry', async () => {
    vi.useFakeTimers();
    render(
      <ISnackbarProvider>
        <Consumer />
      </ISnackbarProvider>
    );
    let first!: ReturnType<ISnackbarApi['show']>;
    act(() => {
      first = api.show('First', { id: 'first', durationMs: 0 });
      api.show('Other', { id: 'other', durationMs: 0 });
    });
    act(() =>
      expect(
        api.show('Updated', {
          id: 'first',
          position: 'top-center',
          durationMs: 0,
        })
      ).toBe(first)
    );
    expect(
      document.querySelectorAll('[data-snackbar-id="first"]')
    ).toHaveLength(1);
    expect(card('first').textContent).toContain('Updated');
    expect(
      card('first').parentElement?.getAttribute('data-i-snackbar-viewport')
    ).toBe('top-center');
    act(() => first.dismiss());
    advance(180);
    expect(await first.afterDismissed()).toBe('programmatic');
    expect(card('other')).toBeTruthy();
    act(() => api.dismissAll());
    advance(180);
    expect(document.querySelector('[data-i-snackbar-viewport]')).toBeNull();
  });

  it('queues FIFO per position and only starts a queued timer when admitted', () => {
    vi.useFakeTimers();
    function App() {
      const [limit, setLimit] = useState<number | undefined>(1);
      return (
        <ISnackbarProvider maxVisible={limit}>
          <button onClick={() => setLimit(undefined)}>Unlimited</button>
          <Consumer />
        </ISnackbarProvider>
      );
    }
    render(<App />);
    act(() => {
      api.show('First', { id: 'first', durationMs: 0 });
      api.show('Queued', { id: 'queued', durationMs: 1000 });
      api.show('Other position', {
        id: 'top',
        position: 'top-right',
        durationMs: 0,
      });
    });
    expect(card('queued').hidden).toBe(true);
    expect(card('top').hidden).toBe(false);
    advance(5000);
    expect(card('queued')).toBeTruthy();
    act(() => api.dismiss('first'));
    advance(180);
    expect(card('queued').hidden).toBe(false);
    advance(999);
    expect(card('queued')).toBeTruthy();
    advance(1);
    expect(card('queued')).toHaveClass('i-snackbar--closing');
    advance(180);
    expect(card('queued')).toBeNull();
    act(() => {
      api.show('A', { id: 'a', durationMs: 0 });
      api.show('B', { id: 'b', durationMs: 0 });
    });
    expect(card('b').hidden).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Unlimited' }));
    expect(card('b').hidden).toBe(false);
  });

  it('preserves the vertical DOM order, with newest nearest the chosen edge', () => {
    render(
      <ISnackbarProvider>
        <Consumer />
      </ISnackbarProvider>
    );
    act(() => {
      api.show('Older top', { id: 't1', position: 'top-left', durationMs: 0 });
      api.show('Newer top', { id: 't2', position: 'top-left', durationMs: 0 });
      api.show('Older bottom', { id: 'b1', durationMs: 0 });
      api.show('Newer bottom', { id: 'b2', durationMs: 0 });
    });
    expect(card('t1').parentElement!.firstElementChild).toBe(card('t2'));
    expect(card('b1').parentElement!.lastElementChild).toBe(card('b2'));
  });
});
