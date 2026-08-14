import { render, screen } from '@testing-library/react';
import { IFCInput, IInput } from './input';

describe('IFCInput', () => {
  it('renders host and input', () => {
    const { container } = render(
      <IFCInput label="Name" value="" onInput={() => {}} />
    );

    expect(container.querySelector('i-fc-input')).toBeTruthy();
    expect(container.querySelector('i-input input')).toBeTruthy();
  });

  it('keeps standalone date-mask defaults enabled by default', () => {
    render(
      <IInput mask={{ type: 'date', format: 'dd/MM/yyyy' }} onChange={() => {}} />
    );

    expect(screen.getByRole('textbox')).not.toHaveValue('');
  });

  it('does not apply a date-mask default when autoDefault is disabled', () => {
    render(
      <IInput
        autoDefault={false}
        mask={{ type: 'date', format: 'dd/MM/yyyy' }}
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
