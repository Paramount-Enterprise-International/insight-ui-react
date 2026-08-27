import { render, screen } from '@testing-library/react';
import { IFCDatepicker, IDatepicker } from './datepicker';

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

  it('marks the host as disabled when disabled', () => {
    const { container } = render(
      <IDatepicker disabled portalToBody={false} value={null} />
    );

    expect(container.querySelector('i-datepicker')).toHaveClass(
      'i-datepicker--disabled'
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });
});
