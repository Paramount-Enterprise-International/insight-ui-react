import { render } from '@testing-library/react';
import { IPill } from './pill';

describe('IPill', () => {
  it('renders host and content', () => {
    const { container } = render(<IPill>Tag</IPill>);

    expect(container.querySelector('i-pill')).toBeTruthy();
    expect(container.querySelector('.i-pill__content')).toHaveTextContent('Tag');
  });
});
