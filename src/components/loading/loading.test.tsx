import React from 'react';
import { render, screen } from '@testing-library/react';
import { ILoading } from './loading';

describe('ILoading', () => {
  it('renders host and label', () => {
    const { container } = render(<ILoading label="Loading.." />);

    expect(container.querySelector('i-loading')).toBeTruthy();
    expect(screen.getByText('Loading..')).toBeTruthy();
  });
});
