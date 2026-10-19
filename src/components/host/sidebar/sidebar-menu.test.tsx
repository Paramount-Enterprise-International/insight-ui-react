import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { vi } from 'vitest';
import { IHSidebar, type IHSidebarProps } from './sidebar';

const key = 'insight.sidebar.menu-state';
const menus: IHSidebarProps['menus'] = [
  {
    id: 'root',
    name: 'Root',
    type: 'group',
    children: [
      {
        id: 'nested',
        name: 'Nested',
        type: 'group',
        children: [
          { id: 'active', name: 'Active page', type: 'item', route: '/people' },
        ],
      },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    type: 'group',
    children: [
      { id: 'other-page', name: 'Other page', type: 'item', route: '/other' },
    ],
  },
];
const favorite = menus[0].children![0].children![0];

function Tools() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <button onClick={() => navigate('/other')}>Navigate</button>
      <button onClick={() => navigate(-1)}>Back</button>
      <output data-testid="location">
        {location.pathname}
        {location.search}
      </output>
    </>
  );
}

function view(
  props: Partial<IHSidebarProps> = {},
  path = '/people/123',
  redirect = false
) {
  return (
    <StrictMode>
      <MemoryRouter basename="/-/" initialEntries={['/-' + path]}>
        {redirect ? (
          <Routes>
            <Route path="start" element={<Navigate to="/people" replace />} />
            <Route path="*" element={<Tools />} />
          </Routes>
        ) : (
          <Tools />
        )}
        <IHSidebar menus={menus} collapsible resizable={false} {...props} />
      </MemoryRouter>
    </StrictMode>
  );
}

function header(container: HTMLElement, name: string): HTMLElement {
  return [...container.querySelectorAll<HTMLElement>('.ih-menu-group')].find(
    (element) => element.querySelector('h6')?.textContent === name
  )!;
}

function collapsed(container: HTMLElement, name: string): boolean {
  return header(container, name)
    .parentElement!.querySelector('ul')!
    .classList.contains('collapsed');
}

describe('IHSidebar menu persistence and restoration', () => {
  let saved: string | null;
  let activeRowTop: number;
  beforeEach(() => {
    activeRowTop = 900;
    saved = localStorage.getItem(key);
    localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        expanded: {
          'main:id:root': false,
          'main:id:nested': false,
          'main:id:other': false,
          'favorites:group': false,
        },
      })
    );
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        if (this.classList.contains('ih-sidebar-body'))
          return new DOMRect(0, 100, 200, 200);
        if (this.getAttribute('data-sidebar-menu-key')?.endsWith(':active'))
          return new DOMRect(0, activeRowTop, 180, 30);
        return new DOMRect(0, 100, 100, 30);
      }
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
    if (saved === null) localStorage.removeItem(key);
    else localStorage.setItem(key, saved);
    localStorage.removeItem('sidebar-menu-custom-test');
  });

  it('restores active ancestors and scrolls once without selecting or focusing the row', async () => {
    const before = localStorage.getItem(key);
    const { container, getByPlaceholderText } = render(view());
    const search = getByPlaceholderText('Search Menu..');
    search.focus();
    await waitFor(() =>
      expect(container.querySelector('.ih-sidebar-body')!.scrollTop).toBe(784)
    );
    expect(collapsed(container, 'Root')).toBe(false);
    expect(collapsed(container, 'Nested')).toBe(false);
    expect(collapsed(container, 'Other')).toBe(true);
    expect(document.activeElement).toBe(search);
    expect(container.querySelector('.is-selected')).toBeNull();
    expect(localStorage.getItem(key)).toBe(before);
    expect(menus[0].visibility).toBeUndefined();
  });

  it('restores an already visible active row 16px below the top after refresh', async () => {
    activeRowTop = 180;
    const { container } = render(view());
    await waitFor(() =>
      expect(container.querySelector('.ih-sidebar-body')!.scrollTop).toBe(64)
    );
  });

  it('persists nested choices through remount, new references and empty hydration', async () => {
    const first = render(view({}, '/unknown'));
    fireEvent.click(header(first.container, 'Root'));
    fireEvent.click(header(first.container, 'Nested'));
    expect(collapsed(first.container, 'Nested')).toBe(false);
    first.rerender(view({ menus: [] }, '/unknown'));
    first.rerender(view({ menus: structuredClone(menus) }, '/unknown'));
    expect(collapsed(first.container, 'Nested')).toBe(false);
    first.unmount();
    const second = render(view({}, '/unknown'));
    expect(collapsed(second.container, 'Root')).toBe(false);
    expect(collapsed(second.container, 'Nested')).toBe(false);
  });

  it('allows manual collapse after restoration and does not reopen on navigation or Back', async () => {
    const { container, getByText, rerender } = render(view());
    await waitFor(() => expect(collapsed(container, 'Root')).toBe(false));
    fireEvent.click(header(container, 'Root'));
    rerender(view({ menus: structuredClone(menus) }));
    expect(collapsed(container, 'Root')).toBe(true);
    fireEvent.click(getByText('Navigate'));
    await waitFor(() => expect(collapsed(container, 'Other')).toBe(true));
    fireEvent.click(getByText('Back'));
    expect(collapsed(container, 'Root')).toBe(true);
  });

  it('preserves a hiding search filter and reveals the active menu only after clearing it', async () => {
    const { container, getByPlaceholderText, getByTestId } = render(
      view({}, '/people?menu-filter=Other&tab=edit')
    );
    const search = getByPlaceholderText('Search Menu..');
    await waitFor(() => expect(search).toHaveValue('Other'));
    expect(
      container.querySelector('a[data-sidebar-menu-key="main:id:active"]')
    ).toBeNull();
    expect(container.querySelector('.ih-sidebar-body')!.scrollTop).toBe(0);
    expect(getByTestId('location')).toHaveTextContent('menu-filter=Other');
    search.focus();
    fireEvent.change(search, { target: { value: '' } });
    await waitFor(() =>
      expect(
        container.querySelector('.ih-sidebar-body')!.scrollTop
      ).toBeGreaterThan(0)
    );
    expect(document.activeElement).toBe(search);
    expect(getByTestId('location')).toHaveTextContent('tab=edit');
    expect(collapsed(container, 'Root')).toBe(false);
  });

  it('waits for visibility and then keeps subsequent user scroll positions', async () => {
    const { container, rerender } = render(view({ visible: false }));
    await waitFor(() => expect(collapsed(container, 'Root')).toBe(false));
    const body = container.querySelector<HTMLElement>('.ih-sidebar-body')!;
    expect(body.scrollTop).toBe(0);
    rerender(view({ visible: true }));
    await waitFor(() => expect(body.scrollTop).toBeGreaterThan(0));
    body.scrollTop = 0;
    rerender(view({ menus: structuredClone(menus), visible: true }));
    expect(body.scrollTop).toBe(0);
  });

  it('waits for asynchronous menus and cancels a pending restore after navigating away', async () => {
    const first = render(view({ menus: [] }));
    first.rerender(view());
    await waitFor(() => expect(collapsed(first.container, 'Root')).toBe(false));
    first.unmount();
    const second = render(view({ menus: [] }));
    await act(async () => {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      );
    });
    fireEvent.click(second.getByText('Navigate'));
    await waitFor(() =>
      expect(second.getByTestId('location')).toHaveTextContent('/other')
    );
    second.rerender(view());
    await waitFor(() => expect(collapsed(second.container, 'Root')).toBe(true));
    expect(collapsed(second.container, 'Other')).toBe(true);
  });

  it('persists Favorites separately, prefers the main tree and falls back to Favorites', async () => {
    const first = render(view({ favoriteMode: true, favorites: [favorite] }));
    await waitFor(() => expect(collapsed(first.container, 'Root')).toBe(false));
    expect(collapsed(first.container, 'Favorites')).toBe(true);
    fireEvent.click(header(first.container, 'Favorites'));
    expect(
      JSON.parse(localStorage.getItem(key)!).expanded['favorites:group']
    ).toBe(true);
    first.unmount();
    const second = render(
      view({ menus: [], favoriteMode: true, favorites: [favorite] })
    );
    await waitFor(() =>
      expect(
        second.container.querySelector('.ih-sidebar-body')!.scrollTop
      ).toBeGreaterThan(0)
    );
    expect(collapsed(second.container, 'Favorites')).toBe(false);
  });

  it('uses custom/null storage keys and applies a changed storage key', () => {
    const { container, rerender } = render(
      view({ menuStateStorageKey: null }, '/unknown')
    );
    expect(collapsed(container, 'Root')).toBe(false);
    fireEvent.click(header(container, 'Root'));
    expect(collapsed(container, 'Root')).toBe(true);
    expect(
      JSON.parse(localStorage.getItem(key)!).expanded['main:id:root']
    ).toBe(false);
    rerender(
      view({ menuStateStorageKey: 'sidebar-menu-custom-test' }, '/unknown')
    );
    expect(collapsed(container, 'Root')).toBe(false);
    fireEvent.click(header(container, 'Root'));
    expect(
      JSON.parse(localStorage.getItem('sidebar-menu-custom-test')!).expanded[
        'main:id:root'
      ]
    ).toBe(false);
  });

  it('restores the destination of an initial redirect', async () => {
    const { container, getByTestId } = render(view({}, '/start', true));
    await waitFor(() =>
      expect(getByTestId('location')).toHaveTextContent('/people')
    );
    await waitFor(() => expect(collapsed(container, 'Root')).toBe(false));
    expect(container.querySelector('.is-selected')).toBeNull();
  });

  it('cancels pending restoration frames on unmount, including StrictMode replay', () => {
    const pending = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      pending.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frame) => {
      pending.delete(frame);
    });
    const { unmount } = render(view({ menus: [] }));
    expect(pending.size).toBeGreaterThan(0);
    unmount();
    expect(pending.size).toBe(0);
  });
});
