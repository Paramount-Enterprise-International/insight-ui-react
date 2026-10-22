import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ILoadError } from './load-error';
describe('ILoadError', () => {
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
