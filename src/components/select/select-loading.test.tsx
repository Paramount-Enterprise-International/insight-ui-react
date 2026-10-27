import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IFCSelect, ISelect } from './select';

describe('select loading inputs', () => {
  afterEach(cleanup);

  it('combines explicit and observable loading and unsubscribes on unmount', () => {
    const rows = new Subject<string[]>();
    const view = render(<ISelect options$={rows} loading={false} />);
    expect(view.container.querySelector('i-loading')).not.toBeNull();
    view.rerender(<ISelect options$={rows} loading />);
    act(() => rows.next([]));
    expect(view.container.querySelector('i-loading')).not.toBeNull();
    view.rerender(<ISelect options$={rows} loading={false} />);
    expect(view.container.querySelector('i-loading')).toBeNull();
    view.unmount();
    expect(rows.observed).toBe(false);
  });

  it('forwards loading and disabled through the form-control variant', () => {
    const view = render(<IFCSelect label="Project" loading disabled />);
    expect(view.container.querySelector('i-loading')).not.toBeNull();
    expect(view.container.querySelector('input')?.readOnly).toBe(true);
    expect(view.container.querySelector('input')?.disabled).toBe(true);
  });
});

for (const Select of [ISelect, IFCSelect]) {
  describe(`${Select === ISelect ? 'ISelect' : 'IFCSelect'} native disabled state`, () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) =>
        window.setTimeout(() => cb(performance.now()), 0)
      );
      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => window.clearTimeout(id));
    });
    afterEach(() => {
      cleanup();
      vi.runOnlyPendingTimers();
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    for (const options of [[], ['Project A']]) {
      it(`disables the input and trigger and closes an open panel with ${options.length} options`, () => {
        const changed = vi.fn();
        const view = render(<Select options={options} onChanged={changed} />);
        const input = view.container.querySelector('input')!;
        const button = () => view.container.querySelector('button')!;
        fireEvent.click(button());
        expect(document.querySelector('i-options')).not.toBeNull();
        view.rerender(<Select options={options} disabled onChanged={changed} />);
        expect(input.disabled).toBe(true);
        expect(button().disabled).toBe(true);
        expect(view.container.querySelector('i-select')?.getAttribute('aria-disabled')).toBe('true');
        expect(document.querySelector('i-options')).toBeNull();
        fireEvent.click(button());
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        act(() => vi.advanceTimersByTime(50));
        expect(document.querySelector('i-options')).toBeNull();
        expect(changed).not.toHaveBeenCalled();
        view.rerender(<Select options={options} onChanged={changed} />);
        expect(input.disabled).toBe(false);
        expect(button().disabled).toBe(false);
        expect(document.querySelector('i-options')).toBeNull();
        fireEvent.click(button());
        expect(document.querySelector('i-options')).not.toBeNull();
      });
    }
  });
}
