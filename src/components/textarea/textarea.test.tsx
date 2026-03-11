import { render } from '@testing-library/react';
import { IFCTextArea } from './textarea';

describe('IFCTextArea', () => {
  it('renders host and inner textarea', () => {
    const { container } = render(
      <IFCTextArea label="Notes" value="" onChange={() => {}} />
    );

    expect(container.querySelector('i-fc-textarea')).toBeTruthy();
    expect(container.querySelector('i-textarea')).toBeTruthy();
    expect(
      container.querySelector('label.i-fc-textarea__label')?.textContent
    ).toContain('Notes');
  });
});
