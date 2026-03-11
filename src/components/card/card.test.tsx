import React from 'react';
import { render } from '@testing-library/react';
import { ICard } from './card';

describe('ICard', () => {
  it('renders host and inner anchor', () => {
    const { container } = render(<ICard href="https://example.com">Card</ICard>);

    expect(container.querySelector('i-card')).toBeTruthy();
    expect(container.querySelector('i-card > a.i-card')).toBeTruthy();
  });
});
