import { fireEvent, render, screen } from '@testing-library/react';
import { IFCDatepicker, IDatepicker } from './datepicker';

function typeDate(input: HTMLElement, digits: string) {
  for (const digit of digits) fireEvent.keyDown(input, { key: digit });
}

describe('IFCDatepicker', () => {
  it('renders host and inner datepicker', () => {
    const { container } = render(
      <IFCDatepicker
        label="Date"
        value={null}
        onChange={() => {}}
        portalToBody={false}
      />
    );

    expect(container.querySelector('i-fc-datepicker')).toBeTruthy();
    expect(container.querySelector('i-datepicker')).toBeTruthy();
  });

  it('keeps an optional null date empty instead of auto-filling today', () => {
    render(<IDatepicker portalToBody={false} value={null} />);

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('preserves an explicit date value', () => {
    render(
      <IDatepicker
        format="dd/MM/yyyy"
        portalToBody={false}
        value={new Date(2026, 6, 14)}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('14/07/2026');
  });

  it('parses an external string with the input format', () => {
    render(
      <IDatepicker
        displayFormat="dd MMM yyyy"
        format="MM-dd-yyyy"
        portalToBody={false}
        value="07-14-2026"
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('14 Jul 2026');
  });

  it('marks the host as disabled when disabled', () => {
    const { container } = render(
      <IDatepicker disabled portalToBody={false} value={null} />
    );

    expect(container.querySelector('i-datepicker')).toHaveClass(
      'i-datepicker--disabled'
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('keeps partial input and emits a date only when all segments are valid', () => {
    const onChanged = vi.fn();
    render(<IDatepicker portalToBody={false} value={null} onChanged={onChanged} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    typeDate(input, '31122');
    expect(input).toHaveValue('31/12/2');
    expect(onChanged).toHaveBeenLastCalledWith(null);

    typeDate(input, '026');
    expect(input).toHaveValue('31/12/2026');
    expect(onChanged).toHaveBeenLastCalledWith(new Date(2026, 11, 31));
  });

  it('uses format order and separator for numeric input', () => {
    const onChanged = vi.fn();
    render(
      <IDatepicker
        format="yyyy-MM-dd"
        portalToBody={false}
        value={null}
        onChanged={onChanged}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    typeDate(input, '20261231');
    expect(input).toHaveValue('2026-12-31');
    expect(onChanged).toHaveBeenLastCalledWith(new Date(2026, 11, 31));
  });

  it('pads a short segment when its separator is typed', () => {
    render(<IDatepicker portalToBody={false} value={null} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: '3' });
    fireEvent.keyDown(input, { key: '/' });
    expect(input).toHaveValue('03/');
    expect(input.selectionStart).toBe(3);
  });

  it('advances through a month-first format with its separator', () => {
    const onChanged = vi.fn();
    render(
      <IDatepicker
        format="MM-dd-yyyy"
        portalToBody={false}
        value={null}
        onChanged={onChanged}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: '7' });
    fireEvent.keyDown(input, { key: '-' });
    typeDate(input, '142026');
    expect(input).toHaveValue('07-14-2026');
    expect(onChanged).toHaveBeenLastCalledWith(new Date(2026, 6, 14));
  });

  it('preserves an invalid date after blur', () => {
    const onChanged = vi.fn();
    render(<IDatepicker portalToBody={false} value={null} onChanged={onChanged} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    typeDate(input, '31022026');
    fireEvent.blur(input);
    expect(input).toHaveValue('31/02/2026');
    expect(onChanged).toHaveBeenLastCalledWith(null);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('31/02/2026');
  });

  it('accepts a leap day', () => {
    const onChanged = vi.fn();
    render(<IDatepicker portalToBody={false} value={null} onChanged={onChanged} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    typeDate(input, '29022024');
    expect(onChanged).toHaveBeenLastCalledWith(new Date(2024, 1, 29));
  });

  it('shows displayFormat outside editing and forwards it through the wrapper', () => {
    const { rerender } = render(
      <IFCDatepicker
        displayFormat="dd MMM yyyy"
        format="dd/MM/yyyy"
        value={new Date(2026, 6, 14)}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('14 Jul 2026');
    fireEvent.focus(input);
    expect(input).toHaveValue('14/07/2026');
    rerender(
      <IFCDatepicker
        disabled
        displayFormat="dd MMM yyyy"
        format="dd/MM/yyyy"
        value={new Date(2026, 6, 14)}
      />
    );
    expect(input).toHaveValue('14 Jul 2026');
    fireEvent.blur(input);
    expect(input).toHaveValue('14 Jul 2026');

    rerender(
      <IFCDatepicker
        disabled
        displayFormat="dd MMMM yyyy"
        format="dd/MM/yyyy"
        value={new Date(2026, 6, 14)}
      />
    );
    expect(input).toHaveValue('14 July 2026');
  });

  it('shows displayFormat after selecting a calendar day', () => {
    const onChanged = vi.fn();
    const { container } = render(
      <IDatepicker
        displayFormat="dd MMM yyyy"
        portalToBody={false}
        value={new Date(2026, 6, 14)}
        onChanged={onChanged}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.click(container.querySelector('i-input-addon button')!);
    const day = Array.from(
      container.querySelectorAll('.i-datepicker-day.current-month')
    ).find((element) => element.textContent?.trim() === '15');
    fireEvent.click(day!);
    expect(input).toHaveValue('15 Jul 2026');
    expect(onChanged).toHaveBeenLastCalledWith(new Date(2026, 6, 15));
  });

  it('applies a new external value after editing finishes', () => {
    const { rerender } = render(
      <IDatepicker
        displayFormat="dd MMM yyyy"
        value={new Date(2026, 6, 14)}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '15/07/2' } });

    rerender(
      <IDatepicker
        displayFormat="dd MMM yyyy"
        value={new Date(2026, 7, 20)}
      />
    );
    expect(input).toHaveValue('15/07/2');

    fireEvent.blur(input);
    expect(input).toHaveValue('20 Aug 2026');
  });
});
