import { render } from '@testing-library/react';
import { IFCTextArea, ITextArea } from './textarea';

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

  it('applies className to the i-textarea host', () => {
    const { container } = render(
      <ITextArea className="w-full" value={null} onChange={() => {}} />
    );

    expect(container.querySelector('i-textarea')?.classList.contains('w-full')).toBe(
      true
    );
    expect(container.querySelector('textarea')?.classList.contains('w-full')).toBe(
      false
    );
    expect(container.querySelector('textarea')).toHaveValue('');
  });
});
