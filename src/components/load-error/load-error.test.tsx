import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ILoadError } from './load-error';
describe('ILoadError', () => {
  it('updates content styling independently of host styling', () => {
    const { container, rerender } = render(
      <ILoadError message="Failed" className="custom-host" style={{ minHeight: '300px' }}
        contentClass="custom-content" contentStyle={{ padding: '24px', gap: '16px' }} />
    );
    const host = container.querySelector('i-load-error') as HTMLElement;
    const content = container.querySelector('[role="alert"]') as HTMLElement;
    expect(host.classList.contains('custom-host')).toBe(true);
    expect(host.style.minHeight).toBe('300px');
    expect(content.classList.contains('i-load-error__content')).toBe(true);
    expect(content.classList.contains('custom-content')).toBe(true);
    expect(content.style.padding).toBe('24px');
    expect(content.style.gap).toBe('16px');
    rerender(<ILoadError message="Failed" contentClass="updated-content" contentStyle={{ padding: '8px' }} />);
    expect(content.classList.contains('i-load-error__content')).toBe(true);
    expect(content.classList.contains('custom-content')).toBe(false);
    expect(content.classList.contains('updated-content')).toBe(true);
    expect(content.style.padding).toBe('8px');
    expect(content.style.gap).toBe('');
  });

  it('delegates Retry and blocks disabled/loading repeats', () => {
    const retry = vi.fn();
    const { container, rerender } = render(
      <ILoadError message="<b>Failed</b>" onRetry={retry} />
    );
    expect(container.querySelector('b')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(retry).toHaveBeenCalledOnce();
    rerender(<ILoadError message="Failed" retryDisabled onRetry={retry} />);
    fireEvent.click(screen.getByRole('button'));
    rerender(<ILoadError message="Failed" retryLoading onRetry={retry} />);
    fireEvent.click(screen.getByRole('button'));
    expect(retry).toHaveBeenCalledOnce();
    rerender(<ILoadError message="" />);
    expect(container.querySelector('i-load-error')).toBeNull();
  });
});
