import { act, fireEvent, render, screen } from '@testing-library/react';
import { useSyncExternalStore } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDefaultIAuthConfig } from '../auth/auth-config';
import { buildExternalSigninUrl } from '../auth/build-signin-redirect-url';
import { ISessionExpiredService } from './session-expired';
import { ISessionExpiredDialog } from './session-expired-dialog';

const service = new ISessionExpiredService();
const catalogResolver = vi.fn();
const config = { ...getDefaultIAuthConfig(), errorCatalogResolver: catalogResolver };

vi.mock('../auth/insight-auth-context', () => ({
  useIAuthContext: () => ({ config }),
  useISessionExpired: () => {
    useSyncExternalStore(service.subscribe, service.getVersion);
    return service;
  },
}));
vi.mock('../auth/build-signin-redirect-url', () => ({
  buildExternalSigninUrl: vi.fn(() => '#signin'),
}));

describe('ISessionExpiredDialog', () => {
  beforeEach(() => {
    service.hide();
    catalogResolver.mockReset();
    vi.mocked(buildExternalSigninUrl).mockClear();
  });

  it('renders nothing while hidden without requiring a dialog provider', () => {
    render(<ISessionExpiredDialog />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it.each([
    ['TOKEN_EXPIRED', 'Session Expired', 'fa-clock'],
    ['SESSION_REVOKED', 'Session Ended', 'fa-clock'],
    ['SESSION_REPLACED', 'Signed Out Remotely', 'fa-right-from-bracket'],
  ] as const)('uses the %s title and icon in a standard dialog', (reason, title, icon) => {
    service.show('/home', reason);
    const { container } = render(<ISessionExpiredDialog />);
    expect(screen.getByRole('dialog', { name: title })).toHaveAttribute('aria-modal', 'true');
    expect(container.querySelector('i-dialog .i-dialog-title')).toBeNull();
    expect(container.querySelector('i-dialog .i-dialog-content h4')?.textContent).toBe(title);
    expect(container.querySelector('i-icon i')?.classList.contains(icon)).toBe(true);
    expect(container.querySelector('i-icon i')?.classList.contains('i-icon-2xl')).toBe(true);
    expect(screen.getByRole('button', { name: 'Log in again' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
  });

  it('ignores backdrop and Escape, then hides when the service is cleared', () => {
    service.show('/home', 'TOKEN_EXPIRED');
    const { container } = render(<ISessionExpiredDialog />);
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(service.visible).toBe(true);
    expect(screen.getByRole('dialog')).toBeTruthy();
    act(() => service.hide());
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps backend, catalog, legacy detail, and reason fallback message precedence', () => {
    catalogResolver.mockReturnValue('Catalog session message');
    service.show('/home', 'SESSION_REVOKED', 'AUTH_SESSION_REVOKED', 'Legacy detail', 'Backend session message');
    render(<ISessionExpiredDialog />);
    expect(screen.getByText('Backend session message')).toBeTruthy();
    expect(catalogResolver).not.toHaveBeenCalled();
    act(() => service.show('/home', 'SESSION_REVOKED', undefined, 'Legacy detail', undefined,
      { errorCode: 'AUTH_SESSION_REVOKED', revision: 5, detail: 'Legacy detail' }));
    expect(screen.getByText('Catalog session message')).toBeTruthy();
    expect(catalogResolver).toHaveBeenCalledWith('AUTH_SESSION_REVOKED', 5, expect.any(Object));
    catalogResolver.mockReturnValue(undefined);
    act(() => service.show('/home', 'SESSION_REVOKED', 'AUTH_SESSION_REVOKED', 'Legacy detail'));
    expect(screen.getByText('Legacy detail')).toBeTruthy();
    act(() => service.show('/home', 'TOKEN_EXPIRED'));
    expect(screen.getByText('Your session has expired. Please log in again to continue.')).toBeTruthy();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it('uses the latest return URL for SSO and clears the dialog on confirmation', () => {
    service.show('/home', 'TOKEN_EXPIRED');
    render(<ISessionExpiredDialog />);
    act(() => service.show('/another-page', 'SESSION_REPLACED'));
    fireEvent.click(screen.getByRole('button', { name: 'Log in again' }));
    expect(buildExternalSigninUrl).toHaveBeenCalledWith(config, '/another-page');
    expect(service.visible).toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(window.location.hash).toBe('#signin');
  });
});
