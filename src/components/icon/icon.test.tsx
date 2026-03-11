import { render } from '@testing-library/react';
import { IIcon } from './icon';

describe('IIcon', () => {
  it('renders host and inner icon', () => {
    const { container } = render(<IIcon icon="add" />);

    const host = container.querySelector('i-icon');
    const inner = container.querySelector('i-icon i');

    expect(host).toBeTruthy();
    expect(inner).toBeTruthy();
    expect(inner).toHaveClass('fa-plus');
  });
});
