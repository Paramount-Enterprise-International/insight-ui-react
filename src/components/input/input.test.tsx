import { render } from '@testing-library/react';
import { IFCInput } from './input';

describe('IFCInput', () => {
  it('renders host and input', () => {
    const { container } = render(
      <IFCInput label="Name" value="" onInput={() => {}} />
    );

    expect(container.querySelector('i-fc-input')).toBeTruthy();
    expect(container.querySelector('i-input input')).toBeTruthy();
  });
});
