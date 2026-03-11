import React from 'react';
import { render } from '@testing-library/react';
import { IButton } from './button';

describe('IButton', () => {
  it('renders host and inner button', () => {
    const { container } = render(<IButton>Save</IButton>);

    expect(container.querySelector('i-button')).toBeTruthy();
    expect(container.querySelector('i-button .i-button-inner')).toBeTruthy();
  });
});
