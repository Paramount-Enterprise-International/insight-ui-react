import React from 'react';
import { render } from '@testing-library/react';
import { IFCDatepicker } from './datepicker';

describe('IFCDatepicker', () => {
  it('renders host and inner datepicker', () => {
    const { container } = render(
      <IFCDatepicker
        label="Date"
        value={null}
        onChange={() => {}}
        portalToBody={false}
      />
    );

    expect(container.querySelector('i-fc-datepicker')).toBeTruthy();
    expect(container.querySelector('i-datepicker')).toBeTruthy();
  });
});
