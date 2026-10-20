import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IDialogContainer } from '../dialog';
import { INotification } from './notification';
import { INotificationBell } from './notification-bell';
import { INotificationDrawer } from './notification-drawer';
import { INotificationItem } from './notification-item';
import {
  notificationDate,
  truncateNotificationText,
} from './notification-presentation';
import { INotificationSnackbar } from './notification-snackbar';
import type {
  INotificationEntry,
  INotificationState,
} from './notification.types';

const item: INotificationEntry = {
  notificationId: 'one',
  moduleId: 'IAM',
  moduleName: 'Account',
  title: 'A'.repeat(60),
  description: 'B'.repeat(60),
  link: null,
  isDismissable: false,
  groupCount: 8,
  latestDate: '2026-10-19T07:00:00Z',
};
afterEach(cleanup);

describe('Notification presentation parity', () => {
  it('hides absent state and the zero badge, then shows 99 and caps 100 with accessible actual counts', () => {
    const { container, rerender } = render(<INotification />);
    expect(container.querySelector('i-notification-bell')).toBeNull();
    rerender(<INotificationBell />);
    expect(container.querySelector('.notification-badge')).toBeNull();
    rerender(<INotificationBell unreadCount={99} />);
    expect(container.querySelector('.notification-badge')?.textContent).toBe(
      '99'
    );
    const toggle = vi.fn();
    rerender(
      <INotificationBell unreadCount={100} onToggleRequested={toggle} />
    );
    expect(container.querySelector('.notification-badge')?.textContent).toBe(
      '99+'
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Notifications, 100 unread' })
    );
    expect(toggle).toHaveBeenCalledOnce();
    expect(container.querySelector('i-icon')?.getAttribute('size')).toBe('lg');
  });

  it('renders Important, all group counts, title/description/module order and full text titles', () => {
    const opened = vi.fn();
    const { container, rerender } = render(
      <INotificationItem item={item} onOpenRequested={opened} />
    );
    expect(screen.getByText('Important')).toBeTruthy();
    expect(screen.getByTitle(item.title).textContent).toBe(
      'A'.repeat(50) + '...'
    );
    const copy = container.querySelector('.notification-copy')!;
    expect(Array.from(copy.children).map((node) => node.textContent)).toEqual([
      'A'.repeat(50) + '...',
      'B'.repeat(50) + '...',
      'Account',
    ]);
    expect(container.querySelector('i-icon')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(opened).toHaveBeenCalledWith(item);
    rerender(
      <INotificationItem
        item={{ ...item, groupCount: 1, isDismissable: true }}
        busy
      />
    );
    expect(container.querySelector('.group-count')?.textContent).toBe('1');
    expect(screen.queryByText('Important')).toBeNull();
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(
      true
    );
  });

  it('formats dates in the browser calendar and truncates only after 50 characters', () => {
    const now = new Date(2026, 9, 19, 12);
    for (const [day, expected] of [
      [19, 'Today'],
      [18, 'Yesterday'],
      [17, '2 days ago'],
      [12, 'Last week'],
      [1, '1 Oct 2026'],
    ] as const)
      expect(notificationDate(new Date(2026, 9, day).toISOString(), now)).toBe(
        expected
      );
    expect(notificationDate('invalid', now)).toBe('-');
    expect(truncateNotificationText('A'.repeat(50))).toBe('A'.repeat(50));
  });

  it('retains interactive rows and scroll while refreshing inline, and gates infinite scroll', () => {
    const opened = vi.fn();
    const more = vi.fn();
    const props = {
      items: [item],
      hasLoaded: true,
      hasMore: true,
      onItemOpened: opened,
      onMoreRequested: more,
    };
    const { container, rerender } = render(<INotificationDrawer {...props} />);
    const row = container.querySelector('i-notification-item');
    const scroll = container.querySelector<HTMLElement>(
      '.notification-scroll'
    )!;
    scroll.scrollTop = 120;
    Object.defineProperties(scroll, {
      clientHeight: { value: 20 },
      scrollHeight: { value: 100 },
    });
    rerender(<INotificationDrawer {...props} loading />);
    expect(container.querySelector('i-notification-item')).toBe(row);
    expect(scroll.scrollTop).toBe(120);
    const status = container.querySelector('.notification-refresh-status')!;
    expect(status.parentElement).toBe(
      container.querySelector('header p')?.parentElement
    );
    expect(status.textContent).toContain('Refreshing notifications...');
    fireEvent.click(row!.querySelector('button')!);
    expect(opened).toHaveBeenCalledWith(item);
    fireEvent.scroll(scroll);
    expect(more).not.toHaveBeenCalled();
    rerender(<INotificationDrawer {...props} />);
    expect(status.textContent).toBe('');
    fireEvent.scroll(scroll);
    expect(more).toHaveBeenCalledOnce();
    rerender(<INotificationDrawer {...props} loadMoreError="Unavailable" />);
    fireEvent.scroll(scroll);
    expect(more).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: /Retry/ }));
    expect(more).toHaveBeenCalledTimes(2);
    expect(container.querySelector('i-notification-item')).toBe(row);
  });

  it('distinguishes initial loading, refreshed empty state, error recovery and retained read errors', () => {
    const retry = vi.fn();
    const readRetry = vi.fn();
    const { container, rerender } = render(<INotificationDrawer loading />);
    expect(container.textContent).toContain('Loading notifications...');
    expect(screen.queryByText('No new notifications')).toBeNull();
    rerender(<INotificationDrawer hasLoaded />);
    const empty = screen.getByText('No new notifications');
    rerender(<INotificationDrawer hasLoaded loading />);
    expect(screen.getByText('No new notifications')).toBe(empty);
    expect(container.textContent).toContain('Refreshing notifications...');
    rerender(
      <INotificationDrawer error="Unavailable" onRetryRequested={retry} />
    );
    expect(screen.queryByText('No new notifications')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Retry/ }));
    expect(retry).toHaveBeenCalledOnce();
    rerender(
      <INotificationDrawer
        items={[item]}
        actionError="Read failed"
        onReadRetryRequested={readRetry}
      />
    );
    expect(container.querySelector('i-notification-item')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Retry/ }));
    expect(readRetry).toHaveBeenCalledOnce();
  });

  it('renders snackbar copy as text and delegates item, dismissal and generic messages', () => {
    const open = vi.fn();
    const dismiss = vi.fn();
    const { container, rerender } = render(
      <INotificationSnackbar
        message={{
          key: 1,
          title: '<b>Action</b>',
          moduleName: 'Account',
          item,
        }}
        onOpenRequested={open}
        onDismissRequested={dismiss}
      />
    );
    expect(container.querySelector('b')).toBeNull();
    fireEvent.click(container.querySelector('.snackbar-content')!);
    expect(open).toHaveBeenCalledOnce();
    fireEvent.click(
      screen.getByRole('button', { name: 'Dismiss notification' })
    );
    expect(dismiss).toHaveBeenCalledOnce();
    rerender(
      <INotificationSnackbar message={{ key: 2, title: 'New notifications' }} />
    );
    expect(container.querySelector('.snackbar-content')).toBeNull();
  });
});

describe('Notification modal parity', () => {
  function Controlled() {
    const [state, setState] = useState<INotificationState>({
      unreadCount: 4,
      items: [item],
    });
    return (
      <INotification
        state={state}
        onAction={(action) => {
          if (action.type === 'toggle')
            setState({ ...state, open: !state.open });
          if (action.type === 'close') setState({ ...state, open: false });
        }}
      />
    );
  }

  it('opens in a portal, traps Tab/Shift+Tab, redirects outside focus, closes on Escape and restores focus/scroll styles', async () => {
    const user = userEvent.setup();
    const overflow = document.body.style.overflow;
    const { container } = render(<Controlled />);
    const bell = screen.getByRole('button', {
      name: 'Notifications, 4 unread',
    });
    await act(async () => {
      await user.click(bell);
    });
    const modal = screen.getByRole('dialog', { name: 'Notifications' });
    expect(container.contains(modal)).toBe(false);
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    const first = screen.getByRole('button', {
      name: 'Open all notifications in a new tab',
    });
    expect(document.activeElement).toBe(first);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(
      modal.querySelector('i-notification-item button')
    );
    await user.tab();
    expect(document.activeElement).toBe(first);
    bell.focus();
    expect(document.activeElement).toBe(first);
    await act(async () => {
      await user.keyboard('{Escape}');
    });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(bell);
    expect(document.body.style.overflow).toBe(overflow);
  });

  it('closes on backdrop and cleans up on absent input and unmount, including StrictMode-safe controlled updates', async () => {
    const { rerender, unmount } = render(
      <StrictMode>
        <INotification state={{ unreadCount: 0, open: true }} />
      </StrictMode>
    );
    expect(screen.queryByRole('dialog')).toBeTruthy();
    rerender(<INotification state={null} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
    rerender(<Controlled />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Notifications, 4 unread' })
    );
    fireEvent.click(
      document.querySelector('.i-notification-overlay .i-dialog-backdrop')!
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    fireEvent.click(
      screen.getByRole('button', { name: 'Notifications, 4 unread' })
    );
    unmount();
    expect(document.querySelector('.i-notification-overlay')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('forwards open-all and nullable-link item action payloads without navigation', () => {
    const action = vi.fn();
    render(
      <INotification
        state={{ unreadCount: 8, open: true, items: [item] }}
        onAction={action}
      />
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Open all notifications in a new tab',
      })
    );
    expect(action).toHaveBeenCalledWith({ type: 'open-all' });
    fireEvent.click(document.querySelector('i-notification-item button')!);
    expect(action).toHaveBeenCalledWith({ type: 'open-item', item });
  });
  it('retains the modal and scroll lock through exit, cancels exit on reopen and restores focus after transition end', () => {
    const { rerender } = render(<INotification state={{ unreadCount: 1 }} />);
    const bell = screen.getByRole('button', {
      name: 'Notifications, 1 unread',
    });
    bell.focus();
    rerender(<INotification state={{ unreadCount: 1, open: true }} />);
    const modal = screen.getByRole('dialog');
    const panel = modal.querySelector<HTMLElement>('.i-dialog-panel')!;
    panel.style.transitionDuration = '240ms';
    const end = () => {
      const event = new Event('transitionend', { bubbles: true });
      Object.defineProperty(event, 'propertyName', { value: 'transform' });
      fireEvent(panel, event);
    };
    rerender(<INotification state={{ unreadCount: 1, open: false }} />);
    expect(modal.classList.contains('i-notification-closing')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<INotification state={{ unreadCount: 1, open: true }} />);
    end();
    expect(screen.getByRole('dialog')).toBe(modal);
    expect(modal.classList.contains('i-notification-closing')).toBe(false);
    rerender(<INotification state={{ unreadCount: 1, open: false }} />);
    end();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.activeElement).toBe(bell);
    rerender(<INotification state={{ unreadCount: 1, open: true }} />);
    document.querySelector<HTMLElement>(
      '.i-dialog-panel'
    )!.style.transitionDuration = '240ms';
    rerender(<INotification state={{ unreadCount: 1, open: false }} />);
    rerender(<INotification state={null} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
  it('yields keyboard and focus handling to a higher Insight dialog', () => {
    const action = vi.fn();
    const closeDialog = vi.fn();
    render(
      <>
        <INotification
          state={{ unreadCount: 1, open: true }}
          onAction={action}
        />
        <IDialogContainer aria-label="Confirmation" onClose={closeDialog}>
          <button>Confirm</button>
        </IDialogContainer>
      </>
    );
    const button = screen.getByRole('button', { name: 'Confirm' });
    button.focus();
    expect(document.activeElement).toBe(button);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(closeDialog).toHaveBeenCalledOnce();
    expect(action).not.toHaveBeenCalled();
  });
});
