import { render } from '@testing-library/react';
import { IFCSelect } from './select';

describe('IFCSelect', () => {
  it('renders host and inner select', () => {
    const { container } = render(
      <IFCSelect
        label="Pick"
        options={['A', 'B']}
        value={null}
        onChange={() => {}}
        portalToBody={false}
      />
    );

    expect(container.querySelector('i-fc-select')).toBeTruthy();
    expect(container.querySelector('i-select')).toBeTruthy();
  });
});
