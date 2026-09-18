import { fireEvent, render, screen } from '@testing-library/react';
import { expectTypeOf } from 'vitest';
import { IFCInput, IInput, type IFCInputProps, type IInputProps } from './input';

describe('IFCInput', () => {
  it('uses inner input handler types and forwards the input element', () => {
    expectTypeOf<IFCInputProps['onInput']>().toEqualTypeOf<IInputProps['onInput']>();
    expectTypeOf<IFCInputProps['onBlur']>().toEqualTypeOf<IInputProps['onBlur']>();

    const targets: HTMLInputElement[] = [];
    const onInput: IInputProps['onInput'] = (event) => targets.push(event.currentTarget);
    const onBlur: IInputProps['onBlur'] = (event) => targets.push(event.currentTarget);
    render(<IFCInput label="Name" value="" onInput={onInput} onBlur={onBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.input(input, { target: { value: 'Name' } });
    fireEvent.blur(input);
    expect(targets).toEqual([input, input]);
  });

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
