import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IHImpersonationBanner } from './impersonation-banner';
const mocks = vi.hoisted(() => ({
  session: {} as Record<string, unknown>,
  state: {} as Record<string, unknown>,
  information: vi.fn(),
  danger: vi.fn(),
}));
vi.mock('../auth/insight-auth-context', () => ({
  useIAuthContext: () => ({
    config: { api: { identity: 'https://bff.test/api' }, signinUrl: '/signin' },
  }),
  useISession: () => mocks.session,
  useIImpersonation: () => mocks.state,
  useIUserMenuStore: () => ({ rawCurrentUser: null }),
}));
vi.mock('../dialog/dialog', () => ({
  useIAlert: () => ({ information: mocks.information }),
  useIConfirm: () => ({ danger: mocks.danger }),
}));
beforeEach(() => {
  const token =
    'e30.' +
    btoa(
      JSON.stringify({ sub: 'b', act: { sub: 'a', name: 'Actor fallback' } })
    ) +
    '.sig';
  mocks.session = {
    getAccessToken: () => token,
    getUser: () => ({ name: 'Subject fallback' }),
    isImpersonating: () => true,
    endImpersonation: vi
      .fn()
      .mockRejectedValue({ status: 503, message: 'Unavailable' }),
  };
  mocks.state = {
    status: {
      mode: 'IMPERSONATING',
      actorName: 'Actor',
      subjectName: 'Subject',
      endAt: new Date(Date.now() + 3600_000).toISOString(),
    },
    loadStatus: vi.fn().mockResolvedValue({}),
  };
  mocks.information.mockResolvedValue(true);
  mocks.danger.mockResolvedValue(false);
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});
describe('IHImpersonationBanner', () => {
  it('renders a named banner and opens native information', async () => {
    render(
      <StrictMode>
        <IHImpersonationBanner />
      </StrictMode>
    );
    expect(
      screen.getByRole('region', { name: 'Impersonation session' })
    ).toBeTruthy();
    expect(screen.getByTestId('banner-actor').textContent).toBe('Actor');
    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: 'About impersonation sessions' })
      )
    );
    expect(mocks.information).toHaveBeenCalledOnce();
  });
  it('does not end when confirmation is cancelled', async () => {
    render(<IHImpersonationBanner />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: /End Impersonate Session/ })
      )
    );
    expect(mocks.session['endImpersonation']).not.toHaveBeenCalled();
  });
  it('shows a retryable submission error and preserves the banner', async () => {
    mocks.danger.mockResolvedValue(true);
    render(<IHImpersonationBanner />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole('button', { name: /End Impersonate Session/ })
      )
    );
    expect(screen.getByRole('alert').textContent).toContain('Unavailable');
    expect(
      screen.getByRole('region', { name: 'Impersonation session' })
    ).toBeTruthy();
  });
  it('keeps token fallback during a failed status load and cleans countdown timers', () => {
    vi.useFakeTimers();
    mocks.state['status'] = null;
    (mocks.state['loadStatus'] as ReturnType<typeof vi.fn>).mockRejectedValue({
      status: 503,
    });
    const view = render(<IHImpersonationBanner />);
    expect(screen.getByTestId('banner-actor').textContent).toBe(
      'Actor fallback'
    );
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
