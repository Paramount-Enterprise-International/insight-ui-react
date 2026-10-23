import { render, screen } from '@testing-library/react';
import { ILoading } from './loading';

describe('ILoading', () => {
  it('renders host and label', () => {
    const { container } = render(<ILoading label="Loading.." />);

    expect(container.querySelector('i-loading')).toBeTruthy();
    expect(screen.getByText('Loading..')).toBeTruthy();
    expect(container.querySelector('i-loading')?.getAttribute('mode')).toBe(
      'inline'
    );
    expect(screen.getByRole('status').getAttribute('aria-live')).toBeNull();
  });

  it.each(['container', 'fullpage'] as const)(
    'announces %s loading with its visible label',
    (mode) => {
      render(<ILoading mode={mode} label="Loading page..." light />);
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('Loading page...');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveAttribute('light', 'true');
      expect(status.querySelector('.spinner-border-sm')).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    }
  );

  it('keeps a page status accessible when the visible label is empty', () => {
    render(<ILoading mode="container" label="" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });
});
