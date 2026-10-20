import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { Profiler, StrictMode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { IHSidebar, type IHSidebarProps } from './sidebar';

const storageKey = 'insight.sidebar.width';
const menus: IHSidebarProps['menus'] = [
  {
    id: 'docs',
    name: 'Docs',
    type: 'group',
    children: [
      { id: 'page', name: 'Resize Guide', type: 'item', route: '/guide' },
    ],
  },
];

function sidebar(props: Partial<IHSidebarProps> = {}) {
  return (
    <StrictMode>
      <MemoryRouter>
        <IHSidebar menus={menus} menuStateStorageKey={null} {...props} />
      </MemoryRouter>
    </StrictMode>
  );
}

function pointer(target: EventTarget, type: string, x: number): void {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
  });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    isPrimary: { value: true },
  });
  act(() => {
    target.dispatchEvent(event);
  });
}

describe('IHSidebar resize integration', () => {
  let saved: string | null;
  let frames: Map<number, FrameRequestCallback>;

  function flushFrames(): void {
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => {
      for (const callback of callbacks) callback(0);
    });
  }

  beforeEach(() => {
    frames = new Map();
    let frameId = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id);
    });
    saved = localStorage.getItem(storageKey);
    localStorage.removeItem(storageKey);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    if (saved === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, saved);
  });

  it('exposes a focusable vertical separator and commits once in StrictMode', () => {
    const changed = vi.fn();
    const { getByRole, container } = render(
      sidebar({ onWidthChange: changed })
    );
    const handle = getByRole('separator', { name: 'Resize sidebar' });
    expect(handle).toHaveAttribute('tabindex', '0');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-valuemin', '220');
    expect(handle).toHaveAttribute('aria-valuemax', '480');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(handle).toHaveAttribute('aria-valuenow', '270');
    expect(
      container
        .querySelector<HTMLElement>('ih-sidebar')
        ?.style.getPropertyValue('--i-sidebar-width')
    ).toBe('270px');
    expect(changed).toHaveBeenCalledExactlyOnceWith(270);
    expect(localStorage.getItem(storageKey)).toBe('270');
  });

  it('keeps menu search, collapse, favorites and the account dropdown usable after resizing', () => {
    const favoriteToggle = vi.fn();
    const { getByRole, getByPlaceholderText, container } = render(
      sidebar({
        collapsible: true,
        favoriteMode: true,
        onFavoriteToggle: favoriteToggle,
        user: {
          employeeCode: 'EMP-1',
          fullName: 'Sidebar User',
          userImagePath: '',
        },
      })
    );
    fireEvent.keyDown(getByRole('separator'), { key: 'End' });
    fireEvent.click(container.querySelector('.ih-user-chip')!);
    expect(getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(getByRole('menu'), { key: 'Escape' });
    fireEvent.click(container.querySelector('.ih-menu-chevron')!);
    expect(container.querySelector('ul.collapsed')).toBeTruthy();
    fireEvent.click(container.querySelector('.ih-menu-chevron')!);
    expect(container.querySelector('ul.expanded')).toBeTruthy();
    fireEvent.click(container.querySelector('.ih-menu-favorite')!);
    expect(favoriteToggle).toHaveBeenCalledExactlyOnceWith({ id: 'page', isFavorite: true });
    fireEvent.change(getByPlaceholderText('Search Menu..'), {
      target: { value: 'Resize' },
    });
    expect(container.querySelector('a.is-spa')?.textContent).toContain(
      'Resize Guide'
    );
    fireEvent.change(getByPlaceholderText('Search Menu..'), {
      target: { value: '' },
    });
    expect(getByRole('separator')).toHaveAttribute('aria-valuenow', '480');
  });

  it('cancels drag on hide, retains width on show and applies new bounds and callbacks', () => {
    const changed = vi.fn();
    const nextChanged = vi.fn();
    const { getByRole, rerender, container } = render(
      sidebar({ onWidthChange: changed })
    );
    const handle = getByRole('separator');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    pointer(handle, 'pointerdown', 0);
    pointer(document, 'pointermove', 80);
    flushFrames();
    expect(handle).toHaveAttribute('aria-valuenow', '350');
    rerender(sidebar({ visible: false, onWidthChange: changed }));
    expect(handle).not.toBeVisible();
    expect(handle).toHaveAttribute('tabindex', '-1');
    expect(container.querySelector('ih-sidebar')).toHaveClass('hidden');
    rerender(
      sidebar({ onWidthChange: nextChanged, minWidth: 250, maxWidth: 400 })
    );
    expect(handle).toHaveAttribute('aria-valuenow', '270');
    expect(handle).toHaveAttribute('aria-valuemin', '250');
    expect(handle).toHaveAttribute('aria-valuemax', '400');
    fireEvent.keyDown(handle, { key: 'End' });
    expect(nextChanged).toHaveBeenCalledExactlyOnceWith(400);
    expect(changed).toHaveBeenCalledExactlyOnceWith(270);
  });

  it('resizes a large menu tree live without rendering React during pointer movement', () => {
    const largeMenus: IHSidebarProps['menus'] = [{
      id: 'root', name: 'Root', type: 'group', children: [{
        id: 'nested', name: 'Nested', type: 'group',
        children: Array.from({ length: 1000 }, (_, index) => ({
          id: `page-${index}`, name: `Long menu label ${index}`, type: 'item' as const,
          route: `/page-${index}`,
        })),
      }],
    }];
    const rendered = vi.fn();
    const changed = vi.fn();
    const { getByRole, container } = render(
      <Profiler id="sidebar" onRender={rendered}>
        {sidebar({ menus: largeMenus, onWidthChange: changed })}
      </Profiler>
    );
    flushFrames();
    flushFrames();
    const handle = getByRole('separator');
    const host = container.querySelector<HTMLElement>('ih-sidebar')!;
    pointer(handle, 'pointerdown', 0);
    rendered.mockClear();
    pointer(document, 'pointermove', 40);
    pointer(document, 'pointermove', 100);
    flushFrames();
    expect(handle).toHaveAttribute('aria-valuenow', '360');
    expect(host.style.getPropertyValue('--i-sidebar-width')).toBe('360px');
    expect(container.querySelectorAll('.ih-menu-indent')).toHaveLength(1000);
    expect(rendered).not.toHaveBeenCalled();
    expect(changed).not.toHaveBeenCalled();
    pointer(document, 'pointermove', 120);
    pointer(document, 'pointerup', 120);
    expect(handle).toHaveAttribute('aria-valuenow', '380');
    expect(changed).toHaveBeenCalledExactlyOnceWith(380);
    expect(rendered).not.toHaveBeenCalled();
  });

  it('removes the resize gutter class and cancels pending movement when disabled', () => {
    const changed = vi.fn();
    const { getByRole, rerender, container } = render(sidebar({ onWidthChange: changed }));
    const handle = getByRole('separator');
    expect(container.querySelector('ih-sidebar')).toHaveClass('is-resizable');
    pointer(handle, 'pointerdown', 0);
    pointer(document, 'pointermove', 100);
    rerender(sidebar({ resizable: false, onWidthChange: changed }));
    flushFrames();
    expect(container.querySelector('ih-sidebar')).not.toHaveClass('is-resizable');
    expect(handle).not.toBeVisible();
    expect(handle).toHaveAttribute('aria-valuenow', '260');
    expect(changed).not.toHaveBeenCalled();
  });

  it('disables interaction and cleans an active drag on unmount', () => {
    localStorage.setItem(storageKey, '400');
    const changed = vi.fn();
    const { container, rerender, unmount } = render(
      sidebar({ resizable: false, onWidthChange: changed })
    );
    const handle = container.querySelector<HTMLElement>(
      '.ih-sidebar-resize-handle'
    )!;
    expect(handle).not.toBeVisible();
    expect(container.querySelector('ih-sidebar')).not.toHaveClass('is-resizable');
    expect(
      container
        .querySelector<HTMLElement>('ih-sidebar')
        ?.style.getPropertyValue('--i-sidebar-width')
    ).toBe('');
    fireEvent.keyDown(handle, { key: 'End' });
    expect(changed).not.toHaveBeenCalled();
    rerender(sidebar({ onWidthChange: changed }));
    expect(handle).toHaveAttribute('aria-valuenow', '400');
    expect(container.querySelector('ih-sidebar')).toHaveClass('is-resizable');
    pointer(handle, 'pointerdown', 0);
    pointer(document, 'pointermove', 40);
    unmount();
    flushFrames();
    expect(document.documentElement).not.toHaveClass('ih-sidebar-resizing');
    pointer(document, 'pointerup', 40);
    expect(localStorage.getItem(storageKey)).toBe('400');
    expect(changed).not.toHaveBeenCalled();
  });
});
