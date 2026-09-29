import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { Subject } from 'rxjs';
import { IFCSelect, ISelect } from './select';

function mockRect(rect: Partial<DOMRect>): DOMRect {
  return {
    bottom: rect.bottom ?? 0,
    height: rect.height ?? 0,
    left: rect.left ?? 0,
    right: rect.right ?? 0,
    top: rect.top ?? 0,
    width: rect.width ?? 0,
    x: rect.x ?? rect.left ?? 0,
    y: rect.y ?? rect.top ?? 0,
    toJSON: () => ({}),
  } as DOMRect;
}

async function flushPositioning() {
  await act(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 10));
  });
}

describe('IFCSelect', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 768,
    });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) =>
      window.setTimeout(() => cb(performance.now()), 0)
    );
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) =>
      window.clearTimeout(id)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders host and inner select', () => {
    const { container } = render(
      <IFCSelect
        label="Pick"
        options={['A', 'B']}
        value={null}
        onChange={() => {}}
        portalToBody={false}
      />
    );

    expect(container.querySelector('i-fc-select')).toBeTruthy();
    expect(container.querySelector('i-select')).toBeTruthy();
  });

  it('opens a content-sized portaled panel with very long option text', async () => {
    const { container } = render(<ISelect options={['A'.repeat(500), 'B']} />);

    const host = container.querySelector('i-select') as HTMLElement;
    const input = container.querySelector('i-input') as HTMLElement;

    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 52,
        height: 32,
        left: 12,
        right: 232,
        top: 20,
        width: 220,
        x: 12,
        y: 20,
      })
    );

    fireEvent.keyDown(host, { key: 'ArrowDown' });

    const panel = document.body.querySelector('i-options') as HTMLElement;
    expect(panel).toBeTruthy();

    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 172,
        height: 120,
        left: 12,
        right: 232,
        top: 52,
        width: 220,
        x: 12,
        y: 52,
      })
    );

    await flushPositioning();

    expect(panel.classList.contains('i-options--portaled')).toBe(true);
    expect(panel.style.position).toBe('fixed');
    expect(panel.style.width).toBe('max-content');
    expect(panel.style.minWidth).toBe('220px');
    expect(panel.style.overflowX).toBe('clip');
    expect(panel.style.overflowY).toBe('auto');
    expect(Number.parseFloat(panel.style.maxWidth)).toBeLessThanOrEqual(
      window.innerWidth - 16
    );
  });

  it('keeps exact trigger width when matchTriggerWidth is enabled', async () => {
    const { container } = render(
      <ISelect matchTriggerWidth options={['A'.repeat(500), 'B']} />
    );

    const host = container.querySelector('i-select') as HTMLElement;
    const input = container.querySelector('i-input') as HTMLElement;

    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 52,
        height: 32,
        left: 12,
        right: 232,
        top: 20,
        width: 220,
        x: 12,
        y: 20,
      })
    );

    fireEvent.keyDown(host, { key: 'ArrowDown' });

    const panel = document.body.querySelector('i-options') as HTMLElement;
    expect(panel).toBeTruthy();

    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 172,
        height: 120,
        left: 12,
        right: 232,
        top: 52,
        width: 220,
        x: 12,
        y: 52,
      })
    );

    await flushPositioning();

    expect(panel.style.width).toBe('220px');
    expect(panel.style.minWidth).toBe('220px');
    expect(panel.style.overflowX).toBe('clip');
    expect(panel.style.overflowY).toBe('auto');
  });
});

describe.each([ISelect, IFCSelect])('%s search', (Select) => {
  const cities = ['jakarta', 'bandung', 'surabaya'];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) =>
      window.setTimeout(() => cb(performance.now()), 16)
    );
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) =>
      window.clearTimeout(id)
    );
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const advance = (ms = 200) => act(() => vi.advanceTimersByTime(ms));
  const labels = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('.i-option-label'), (el) => el.textContent);
  const type = (input: HTMLInputElement, text: string) =>
    fireEvent.input(input, { target: { value: text } });

  it('captures every character immediately and filters the complete first query', () => {
    const changed = vi.fn();
    const { container } = render(
      <Select options={cities} portalToBody={false} onChange={changed} />
    );
    const input = container.querySelector('input')!;
    input.focus();
    for (let length = 1; length <= 'jakarta'.length; length++) {
      type(input, 'jakarta'.slice(0, length));
      expect(input.value).toBe('jakarta'.slice(0, length));
      expect(document.activeElement).toBe(input);
      expect(container.querySelector('i-loading')).toBeNull();
      advance(30);
    }
    expect(labels(container)).toEqual([]);
    advance();
    expect(input.value).toBe('jakarta');
    expect(labels(container)).toEqual(['jakarta']);
    expect(changed).not.toHaveBeenCalled();
  });

  it('supports paused typing, backspace, clearing, paste and empty results', () => {
    const { container } = render(<Select options={cities} portalToBody={false} />);
    const input = container.querySelector('input')!;
    for (const [query, expected] of [
      ['ja', ['jakarta']],
      ['jak', ['jakarta']],
      ['j', ['jakarta']],
      ['', cities],
      ['bandung', ['bandung']],
      ['missing', []],
    ] as const) {
      type(input, query);
      expect(input.value).toBe(query);
      advance();
      expect(labels(container)).toEqual(expected);
    }
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('uses current options and predicate without resetting a pending query', () => {
    const { container, rerender } = render(
      <Select options={cities} portalToBody={false} />
    );
    const input = container.querySelector('input')!;
    type(input, 'ja');
    advance();
    type(input, 'jakarta');
    advance(50);
    const rows = ['jakarta', 'jakarta barat', 'bandung'];
    rerender(
      <Select options={rows} filterPredicate={(row, term) => row === term} portalToBody={false} />
    );
    expect(input.value).toBe('jakarta');
    expect(labels(container)).toEqual([]);
    advance(150);
    expect(labels(container)).toEqual(['jakarta']);
  });

  it.each(['escape', 'outside', 'select', 'reset', 'value', 'disabled'])(
    'invalidates a pending query after %s', (action) => {
      const changed = vi.fn();
      const props = { options: cities, portalToBody: false, onChange: changed, value: null };
      const { container, rerender } = render(<Select {...props} />);
      const input = container.querySelector('input')!;
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      if (action === 'reset') {
        type(input, 'missing');
        advance();
      }
      type(input, 'ja');
      if (action === 'escape') fireEvent.keyDown(input, { key: 'Escape' });
      if (action === 'outside') fireEvent.click(document.body);
      if (action === 'select') fireEvent.mouseDown(container.querySelector('.i-option')!);
      if (action === 'reset') fireEvent.click(container.querySelector('i-input-addon button')!);
      if (action === 'value') rerender(<Select {...props} value="bandung" />);
      if (action === 'disabled') {
        rerender(<Select {...props} disabled />);
        rerender(<Select {...props} disabled={false} />);
      }
      const displayed = input.value;
      const results = labels(container);
      advance(500);
      expect(input.value).toBe(displayed);
      expect(labels(container)).toEqual(results);
      if (action === 'select') {
        expect(input.value).toBe('jakarta');
        expect(changed).toHaveBeenCalledTimes(1);
      } else expect(changed).not.toHaveBeenCalled();
    }
  );

  it.each(['escape', 'outside'])('cancels first-query debounce on %s', (action) => {
    const { container } = render(<Select options={cities} portalToBody={false} />);
    const input = container.querySelector('input')!;
    type(input, 'ja');
    if (action === 'escape') fireEvent.keyDown(input, { key: 'Escape' });
    else fireEvent.click(document.body);
    advance(500);
    expect(labels(container)).toEqual([]);
  });

  it('honors a custom delay including a delay update during typing', () => {
    const { container, rerender } = render(
      <Select options={cities} filterDelay={400} portalToBody={false} />
    );
    const input = container.querySelector('input')!;
    type(input, 'ja');
    advance(200);
    expect(labels(container)).toEqual([]);
    rerender(<Select options={cities} filterDelay={100} portalToBody={false} />);
    advance(99);
    expect(labels(container)).toEqual([]);
    advance(1);
    expect(labels(container)).toEqual(['jakarta']);
  });

  it.each(['next', 'error', 'complete', 'detach'])(
    'keeps data loading independent of typing until %s', (finish) => {
      const source = new Subject<string[]>();
      const { container, rerender } = render(
        <Select options$={source} portalToBody={false} />
      );
      const input = container.querySelector('input')!;
      type(input, 'ja');
      advance();
      expect(container.querySelector('i-loading')).toBeTruthy();
      if (finish === 'next') act(() => source.next(cities));
      if (finish === 'error') act(() => source.error(new Error('failed')));
      if (finish === 'complete') act(() => source.complete());
      if (finish === 'detach') rerender(<Select options={cities} portalToBody={false} />);
      expect(container.querySelector('i-loading')).toBeNull();
      expect(input.value).toBe('ja');
      if (finish === 'next' || finish === 'detach') expect(labels(container)).toEqual(['jakarta']);
    }
  );

  it('preserves a pending query when asynchronous options arrive', () => {
    const source = new Subject<string[]>();
    const { container } = render(<Select options$={source} portalToBody={false} />);
    const input = container.querySelector('input')!;
    type(input, 'jakarta');
    advance(100);
    act(() => source.next(cities));
    expect(input.value).toBe('jakarta');
    advance(100);
    expect(labels(container)).toEqual(['jakarta']);
  });

  it('unsubscribes pending filters and data on unmount', () => {
    const source = new Subject<string[]>();
    const { container, unmount } = render(<Select options$={source} portalToBody={false} />);
    type(container.querySelector('input')!, 'ja');
    unmount();
    expect(source.observed).toBe(false);
    advance(500);
    expect(document.querySelector('i-options')).toBeNull();
  });
});
