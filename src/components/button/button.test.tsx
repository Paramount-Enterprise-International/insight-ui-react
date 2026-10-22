import { fireEvent, render } from '@testing-library/react';
import { IButton } from './button';

describe('IButton', () => {
  it('renders host and inner button', () => {
    const { container } = render(<IButton>Save</IButton>);
    expect(container.querySelector('i-button')).toBeTruthy();
    expect(container.querySelector('i-button .i-button-inner')).toBeTruthy();
  });
});

describe('IButton placeholder', () => {
  for (const size of ['3xs', '2xs', 'xs', 'sm', 'md', 'lg'] as const)
    it(`uses caller size ${size}`, () => {
      const clicked = vi.fn();
      const { container, rerender } = render(
        <IButton
          placeholder
          size={size}
          icon="edit"
          loading
          href="https://example.com"
          onClick={clicked}>
          Hidden
        </IButton>
      );
      expect(container.querySelector('button,a,i-icon,i-loading')).toBeNull();
      expect(container.textContent).toBe('');
      expect(
        (container.querySelector('i-action-placeholder') as HTMLElement).style
          .height
      ).toBe(`var(--i-size-${size})`);
      fireEvent.click(container.firstElementChild!);
      expect(clicked).not.toHaveBeenCalled();
      rerender(
        <IButton placeholder={false} size={size} href="https://example.com">
          Open
        </IButton>
      );
      expect(container.querySelector('a')?.getAttribute('href')).toBe(
        'https://example.com'
      );
    });
});
