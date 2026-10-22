import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IBanner } from './banner';
describe('IBanner', () => {
  it('hides empty content and renders message text literally', () => {
    const { container, rerender } = render(<IBanner message="  " />);
    expect(container.querySelector('i-banner')).toBeNull();
    rerender(<IBanner message="<strong>Blocked</strong>" />);
    expect(container.querySelector('strong')).toBeNull();
    expect(container.textContent).toContain('<strong>Blocked</strong>');
  });
  it('renders interactive children without a message', () => {
    const action = vi.fn();
    render(
      <IBanner>
        <button onClick={action}>Child action</button>
      </IBanner>
    );
    fireEvent.click(screen.getByText('Child action'));
    expect(action).toHaveBeenCalledOnce();
  });
  for (const variant of [
    'neutral',
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ] as const)
    it(`exposes ${variant} semantics`, () => {
      const { container } = render(
        <IBanner variant={variant} message="Notice" />
      );
      expect(container.querySelector('i-banner')?.getAttribute('variant')).toBe(
        variant
      );
      expect(container.querySelector('i-banner')?.getAttribute('role')).toBe(
        variant === 'danger' ? 'alert' : 'status'
      );
    });
  it('supports prefix, suffix and an independent close button', () => {
    const { container, rerender } = render(<IBanner message="Notice" />);
    expect(container.querySelector('.i-banner__close')).toBeNull();
    rerender(
      <IBanner message="Notice" prefixIcon="info" suffixIcon="sync" closable />
    );
    expect(container.querySelectorAll('.i-banner__icon').length).toBe(2);
    expect(screen.getByLabelText('Close').getAttribute('type')).toBe('button');
  });
  it('closes uncontrolled content and does not reopen when it changes', () => {
    const change = vi.fn(),
      close = vi.fn();
    const { container, rerender } = render(
      <IBanner
        closable
        message="Notice"
        onOpenChange={change}
        onClose={close}
      />
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(container.querySelector('i-banner')).toBeNull();
    expect(change).toHaveBeenCalledWith(false);
    expect(close).toHaveBeenCalledOnce();
    rerender(<IBanner closable message="New notice" />);
    expect(container.querySelector('i-banner')).toBeNull();
  });
  it('supports controlled visibility and reopening', () => {
    const change = vi.fn();
    const { container, rerender } = render(
      <IBanner open closable message="Notice" onOpenChange={change} />
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(change).toHaveBeenCalledWith(false);
    expect(container.querySelector('i-banner')).not.toBeNull();
    rerender(<IBanner open={false} message="Notice" />);
    expect(container.querySelector('i-banner')).toBeNull();
    rerender(<IBanner open message="Notice" />);
    expect(container.querySelector('i-banner')).not.toBeNull();
  });
});
