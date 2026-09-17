import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IButton } from '../button/button';
import { IErrorPage } from './error-page';
import { I_ERROR_PAGE_PRESETS, type IErrorPageKind } from './error-page.types';

describe('IErrorPage', () => {
  it('defaults to a contained 404 with Paramount support and no actions', () => {
    const { container } = render(<IErrorPage />);
    expect(container.querySelector('i-section i-section-body')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeTruthy();
    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      'mailto:it.helpdesk@paramountenterprise.co.id',
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it.each(Object.keys(I_ERROR_PAGE_PRESETS) as IErrorPageKind[])(
    'renders the %s preset',
    (kind) => {
      const { container } = render(<IErrorPage kind={kind} />);
      const preset = I_ERROR_PAGE_PRESETS[kind];
      expect(container.querySelector('.i-error-page--not-found') !== null).toBe(kind === 'not-found');
      expect(screen.getByRole('heading', { name: preset.title })).toBeTruthy();
      expect(screen.getByText(preset.description)).toBeTruthy();
      expect(container.querySelector('i-icon i')?.className).toContain(preset.icon);
      expect(container.querySelector('.i-error-page__code')?.textContent ?? '').toBe(preset.code);
    },
  );

  it('switches to fullpage without rendering a section and switches back', () => {
    const { container, rerender } = render(<IErrorPage />);
    rerender(<IErrorPage mode="fullpage" />);
    expect(container.querySelector('.i-error-page--fullpage')).not.toBeNull();
    expect(container.querySelector('i-section')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeTruthy();
    rerender(<IErrorPage mode="contained" />);
    expect(container.querySelector('.i-error-page--fullpage')).toBeNull();
    expect(container.querySelectorAll('i-section').length).toBe(1);
  });

  it('overrides content independently and honors empty overrides', () => {
    const { container, rerender } = render(
      <IErrorPage
        title="Custom title"
        description="Custom description"
        icon="fa-solid fa-house"
        code="CUSTOM"
        supportEmail="support@example.com"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Custom title' })).toBeTruthy();
    expect(screen.getByText('Custom description')).toBeTruthy();
    expect(container.querySelector('i-icon i')?.className).toContain('fa-house');
    expect(screen.getByText('CUSTOM')).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('href')).toBe('mailto:support@example.com');
    rerender(<IErrorPage title="" description="" icon="" code="" supportEmail="" />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
    expect(container.querySelector('.i-error-page__visual')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('emits enabled actions without navigating or changing the content', () => {
    const onAction = vi.fn();
    const { container } = render(
      <IErrorPage actions={['home', 'logout', 'retry']} onAction={onAction} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back to Home' }));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onAction.mock.calls).toEqual([['home'], ['logout'], ['retry']]);
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeTruthy();
    expect(container.querySelector('i-button[variant="danger"]')).not.toBeNull();
  });

  it('preserves custom content, actions, and host attributes in both modes', () => {
    const onClick = vi.fn();
    const page = (mode: 'contained' | 'fullpage') => (
      <IErrorPage
        mode={mode}
        role="alert"
        className="consumer-class"
        customActions={<IButton onClick={onClick}>Contact Administrator</IButton>}
      >
        <p>Additional guidance</p>
      </IErrorPage>
    );
    const { container, rerender } = render(page('contained'));
    expect(screen.getByRole('alert')).toHaveClass('consumer-class');
    expect(container.querySelector('.i-error-page__extra')?.textContent).toBe(
      'Additional guidance',
    );
    rerender(page('fullpage'));
    expect(container.querySelector('i-section')).toBeNull();
    expect(screen.getByText('Additional guidance')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Contact Administrator' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
