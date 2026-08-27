import { render } from '@testing-library/react';
import { IToggle } from './toggle';

describe('IToggle', () => {
  it('renders host and input', () => {
    const { container } = render(<IToggle />);

    expect(container.querySelector('i-toggle')).toBeTruthy();
    expect(container.querySelector('i-toggle input[type="checkbox"]')).toBeTruthy();
  });

  it('keeps the default design-system sizing for md', () => {
    const { container } = render(<IToggle size="md" />);
    const toggle = container.querySelector('i-toggle');

    expect(toggle).toHaveAttribute('size', 'md');
    expect(toggle).not.toHaveStyle('--i-toggle-height: var(--i-size-md)');
  });

  it('maps non-default sizes to toggle CSS variables', () => {
    const { container } = render(<IToggle size="sm" />);
    const toggle = container.querySelector('i-toggle');

    expect(toggle).toHaveAttribute('size', 'sm');
    expect(toggle).toHaveStyle('--i-toggle-height: var(--i-size-sm)');
    expect(toggle).toHaveStyle(
      '--i-toggle-width: calc(var(--i-size-sm) * 1.75)'
    );
  });
});
