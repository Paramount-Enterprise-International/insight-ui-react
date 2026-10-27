import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { Profiler } from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import type { IMenu } from '../host-api.types';
import { IHSidebar } from './sidebar';
import { SidebarMenuState } from './sidebar-menu-state';
import { SidebarSearchState } from './sidebar.utils';

const storageKey = 'insight.sidebar.menu-state';
const menus: IMenu[] = [
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
          { id: 'page', name: 'Active page', type: 'item', route: '/page' },
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

function Content() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="url">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
      <button onClick={() => navigate('/other')}>Navigate</button>
      <button onClick={() => navigate(-1)}>Back</button>
    </>
  );
}

function view(nodes = menus, path = '/unknown', onRender = vi.fn()) {
  return (
    <MemoryRouter initialEntries={['/previous', path]}>
      <Profiler id="content" onRender={onRender}>
        <Content />
      </Profiler>
      <IHSidebar menus={nodes} collapsible resizable={false} />
    </MemoryRouter>
  );
}

function group(container: HTMLElement, name: string): HTMLElement {
  return [...container.querySelectorAll<HTMLElement>('.ih-menu-group')].find(
    (row) => row.querySelector('h6')?.textContent === name
  )!;
}

function isCollapsed(container: HTMLElement, name: string): boolean {
  return group(container, name).nextElementSibling!.classList.contains(
    'collapsed'
  );
}

function advance(ms = 200) {
  act(() => vi.advanceTimersByTime(ms));
}

describe('IHSidebar search input', () => {
  let saved: string | null;
  beforeEach(() => {
    saved = localStorage.getItem(storageKey);
    localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, expanded: { 'main:id:root': false } })
    );
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(0);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    if (!HTMLElement.prototype.scrollIntoView)
      HTMLElement.prototype.scrollIntoView = () => {};
    vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(
      () => {}
    );
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (saved === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, saved);
  });

  it('applies only the final term after 200 ms without rendering content or projecting menus per keystroke', () => {
    const filtered = vi.spyOn(SidebarSearchState.prototype, 'filter');
    const projected = vi.spyOn(SidebarMenuState.prototype, 'project');
    const rendered = vi.fn();
    const largeMenus = Array.from({ length: 200 }, (_, i) => ({
      id: `group-${i}`,
      name: `Group ${i}`,
      type: 'group' as const,
      children: [
        {
          id: `page-${i}`,
          name: `Page ${i}`,
          type: 'item' as const,
          route: `/page-${i}`,
        },
      ],
    }));
    const { getByPlaceholderText, getByTestId } = render(
      view(largeMenus, '/unknown?tab=edit#details', rendered)
    );
    filtered.mockClear();
    projected.mockClear();
    rendered.mockClear();
    const search = getByPlaceholderText('Search Menu..');
    for (const value of ['p', 'pa', 'page'])
      fireEvent.change(search, { target: { value } });
    expect(search).toHaveValue('page');
    expect(filtered).not.toHaveBeenCalled();
    expect(projected).not.toHaveBeenCalled();
    expect(rendered).not.toHaveBeenCalled();
    advance(199);
    expect(filtered).not.toHaveBeenCalled();
    advance(1);
    expect(filtered).toHaveBeenCalledTimes(1);
    expect(projected).not.toHaveBeenCalled();
    expect(rendered).toHaveBeenCalledTimes(1);
    expect(getByTestId('url')).toHaveTextContent(
      '/unknown?tab=edit&menu-filter=page#details'
    );
  });

  it('applies URL filters immediately, skips equal trimmed terms and replaces history when clearing', () => {
    const filtered = vi.spyOn(SidebarSearchState.prototype, 'filter');
    const { container, getByPlaceholderText, getByTestId, getByText } = render(
      view(menus, '/unknown?menu-filter=Page&tab=edit#details')
    );
    expect(isCollapsed(container, 'Nested')).toBe(false);
    filtered.mockClear();
    const search = getByPlaceholderText('Search Menu..');
    fireEvent.change(search, { target: { value: ' Page ' } });
    advance();
    expect(filtered).not.toHaveBeenCalled();
    fireEvent.change(search, { target: { value: '' } });
    advance();
    expect(getByTestId('url')).toHaveTextContent('/unknown?tab=edit#details');
    fireEvent.click(getByText('Back'));
    expect(getByTestId('url')).toHaveTextContent('/previous');
  });

  it('preserves temporary collapse across hydration, skips hidden results and restores normal state', () => {
    const before = localStorage.getItem(storageKey);
    const original = structuredClone(menus);
    const { container, getByPlaceholderText, rerender } = render(
      view(menus, '/unknown?menu-filter=page')
    );
    const search = getByPlaceholderText('Search Menu..');
    fireEvent.click(group(container, 'Nested'));
    expect(isCollapsed(container, 'Nested')).toBe(true);
    rerender(view(structuredClone(menus), '/unknown?menu-filter=page'));
    expect(isCollapsed(container, 'Nested')).toBe(true);
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(
      container
        .querySelector('a.is-selected')
        ?.getAttribute('data-sidebar-menu-key')
    ).toBe('main:id:other-page');
    fireEvent.click(group(container, 'Other'));
    expect(container.querySelector('a.is-selected')).toBeNull();
    fireEvent.click(group(container, 'Root'));
    expect(isCollapsed(container, 'Root')).toBe(true);
    fireEvent.change(search, { target: { value: 'Root' } });
    advance();
    expect(isCollapsed(container, 'Root')).toBe(false);
    expect(isCollapsed(container, 'Nested')).toBe(false);
    fireEvent.change(search, { target: { value: '' } });
    advance();
    expect(isCollapsed(container, 'Root')).toBe(true);
    expect(isCollapsed(container, 'Nested')).toBe(true);
    expect(localStorage.getItem(storageKey)).toBe(before);
    expect(menus).toEqual(original);
  });

  it('flushes pending input before keyboard actions without activating a stale selection', () => {
    const { container, getByPlaceholderText, getByTestId } = render(
      view(menus, '/unknown?menu-filter=page')
    );
    const search = getByPlaceholderText('Search Menu..');
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    expect(container.querySelector('a.is-selected')).not.toBeNull();
    fireEvent.change(search, { target: { value: 'Other' } });
    expect(container.querySelector('a.is-selected')).toBeNull();
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(getByTestId('url')).toHaveTextContent('/unknown?menu-filter=Other');
    expect(container.querySelector('a.is-selected')).toBeNull();
    fireEvent.keyDown(search, { key: 'ArrowUp' });
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(getByTestId('url')).toHaveTextContent('/other?menu-filter=Other');
  });

  it('cancels pending input on navigation and unmount', () => {
    const filtered = vi.spyOn(SidebarSearchState.prototype, 'filter');
    const { getByPlaceholderText, getByText, getByTestId, unmount } =
      render(view());
    const search = getByPlaceholderText('Search Menu..');
    fireEvent.change(search, { target: { value: 'Page' } });
    fireEvent.click(getByText('Navigate'));
    filtered.mockClear();
    advance();
    expect(search).toHaveValue('');
    expect(getByTestId('url')).toHaveTextContent('/other');
    expect(getByTestId('url')).not.toHaveTextContent('menu-filter');
    expect(filtered).not.toHaveBeenCalled();
    fireEvent.change(search, { target: { value: 'Page' } });
    unmount();
    advance();
    expect(filtered).not.toHaveBeenCalled();
  });
});
