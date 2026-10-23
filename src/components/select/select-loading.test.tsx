import { act, cleanup, render } from '@testing-library/react';
import { Subject } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
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
  });
});
