import { render } from '@testing-library/react';
import { IToggle } from './toggle';

describe('IToggle', () => {
  it('renders host and input', () => {
    const { container } = render(<IToggle />);

    expect(container.querySelector('i-toggle')).toBeTruthy();
    expect(container.querySelector('i-toggle input[type="checkbox"]')).toBeTruthy();
  });
});
