import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  IAuthProvider,
  IDialogOutlet,
  IDialogProvider,
  ISessionExpiredDialog,
  ISessionService,
  useIAuthContext,
} from '..';

function ConsumerContent() {
  const { sessionExpired } = useIAuthContext();
  return (
    <>
      <button onClick={() => sessionExpired.show('/home', 'TOKEN_EXPIRED')}>Expire session</button>
      <button onClick={() => sessionExpired.hide()}>Clear session</button>
      <ISessionExpiredDialog />
    </>
  );
}

describe('legacy consumer compatibility', () => {
  beforeEach(() => {
    vi.spyOn(ISessionService.prototype, 'tryRestoreSession').mockResolvedValue({});
  });
  afterEach(() => vi.restoreAllMocks());

  it.each([false, true])(
    'retains the existing auth setup with a dialog host: %s',
    (withDialogHost) => {
      const content = withDialogHost ? (
        <IDialogProvider><ConsumerContent /><IDialogOutlet /></IDialogProvider>
      ) : <ConsumerContent />;
      const { container } = render(
        <IAuthProvider config={{
          api: { identity: 'https://consumer.example.test/api' },
          signinUrl: 'https://consumer.example.test/signin',
        }}>
          {content}
        </IAuthProvider>,
      );
      expect(screen.queryByRole('dialog')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Expire session' }));
      expect(screen.getAllByRole('dialog', { name: 'Session Expired' })).toHaveLength(1);
      expect(screen.getByRole('button', { name: 'Log in again' })).toBeTruthy();
      fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByRole('dialog', { name: 'Session Expired' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Clear session' }));
      expect(screen.queryByRole('dialog')).toBeNull();
    },
  );
});
