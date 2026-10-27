import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';

import {
  IAuthContext,
  type IAuthContext as AuthContextValue,
} from '../auth/insight-auth-context';
import type { ISelectHandle } from '../select';
import type { ISessionService } from '../session/session';
import { IUserMenuStore } from '../store/user-menu';
import type { ICurrentUserService } from '../user/current-user';
import type { IUserMenuService } from '../user/user-menu';
import type {
  IEffectiveAuthorizationDto,
  IMenuCompanyDto,
} from '../user/user.types';
import {
  IFCSelectCompany,
  type IFCSelectCompanyProps,
} from './fc-select-company';
import { ISelectCompany, type ISelectCompanyProps } from './select-company';
import { IHStateOwner } from '../state/state-core';
import { IHostApiProvider } from '../host/host-api.context';

const jakarta: IMenuCompanyDto = { id: 'c1', code: 'JKT', name: 'Jakarta' };
const bandung: IMenuCompanyDto = { id: 'c2', code: 'BDG', name: 'Bandung' };

function authorizations(company = jakarta): IEffectiveAuthorizationDto[] {
  return [
    { menuCode: 'sales', menuId: 'm1', type: 'item', companies: [company] },
    {
      menuCode: 'report',
      menuId: 'm2',
      type: 'function',
      companies: [company, bandung],
    },
  ];
}

function mount(props: IFCSelectCompanyProps = {}, wrapped = false, state?: IHStateOwner) {
  const getAuthorizations =
    vi.fn<() => Promise<IEffectiveAuthorizationDto[]>>();
  const store = new IUserMenuStore(
    {} as ICurrentUserService,
    { getAuthorizations } as unknown as IUserMenuService,
    {} as ISessionService
  );
  const context = { userMenuStore: store } as unknown as AuthContextValue;
  const ref = createRef<ISelectHandle>();
  const Select = wrapped ? IFCSelectCompany : ISelectCompany;
  const tree = (next: IFCSelectCompanyProps) => (
    <IHostApiProvider hostApi={{ state, navigate: () => undefined, setTitle: () => undefined, setBreadcrumbs: () => undefined }}>
    <IAuthContext.Provider value={context}>
      <Select ref={ref} portalToBody={false} {...next} />
    </IAuthContext.Provider>
    </IHostApiProvider>
  );
  const view = render(tree(props));
  return {
    ...view,
    ref,
    store,
    getAuthorizations,
    input: () => view.container.querySelector('input')!,
    open: () =>
      fireEvent.keyDown(view.container.querySelector('input')!, {
        key: 'ArrowDown',
      }),
    labels: () =>
      Array.from(view.container.querySelectorAll('.i-option-label')).map(
        (element) => element.textContent?.trim()
      ),
    update: (next: IFCSelectCompanyProps) => view.rerender(tree(next)),
    hydrate: async (data = authorizations()) => {
      getAuthorizations.mockResolvedValueOnce(data);
      await act(async () => {
        await store.loadAuthorizations();
      });
    },
  };
}

describe.each([false, true])('company select with wrapped=%s', (wrapped) => {
  const mountCompany = (props: ISelectCompanyProps = {}) =>
    mount(props, wrapped);
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('forwards string and object messages through company wrappers', async () => {
    const view = mountCompany({ emptyState: 'No companies', filterDelay: 0 });
    const message = () => view.container.querySelector('.i-options__empty')?.textContent;
    view.open();
    expect(message()).toBe('No companies');
    const props = { emptyState: { empty: 'Empty companies', notFound: 'Company not found' }, filterDelay: 0 };
    view.update(props);
    expect(message()).toBe('Empty companies');
    await view.hydrate();
    expect(message()).toBeUndefined();
    fireEvent.input(view.input(), { target: { value: 'missing' } });
    act(() => vi.advanceTimersByTime(1));
    expect(message()).toBe('Company not found');
    view.update({ ...props, loading: true });
    expect(message()).toBeUndefined();
    view.update(props);
    expect(message()).toBe('Company not found');
    act(() => view.store.reset());
    expect(message()).toBe('Empty companies');
  });

  it('reacts to hydration and reset without requesting data or selecting a company', async () => {
    const view = mountCompany();
    expect(view.getAuthorizations).not.toHaveBeenCalled();
    view.open();
    expect(view.labels()).toEqual([]);

    await view.hydrate();
    expect(view.labels()).toEqual(['Jakarta', 'Bandung']);
    expect(view.input().value).toBe('');
    expect(view.getAuthorizations).toHaveBeenCalledTimes(1);

    act(() => view.store.reset());
    expect(view.labels()).toEqual([]);
  });

  it('filters reactively by menu code and never falls back for unknown menus', async () => {
    const view = mountCompany();
    await view.hydrate();
    view.open();
    for (const [menuCode, expected] of [
      [null, ['Jakarta', 'Bandung']],
      ['   ', ['Jakarta', 'Bandung']],
      [' sales ', ['Jakarta']],
      ['unknown', []],
      ['report', ['Jakarta', 'Bandung']],
    ] as const) {
      view.update({ menuCode });
      expect(view.labels()).toEqual([...expected]);
    }
  });

  it('matches refreshed objects by id and retains an out-of-scope controlled value without events', async () => {
    const initial = { ...jakarta };
    const onChange = vi.fn();
    const onChanged = vi.fn();
    const onOptionSelected = vi.fn();
    const props = { value: initial, onChange, onChanged, onOptionSelected };
    const view = mountCompany(props);
    expect(view.input().value).toBe('Jakarta');
    await view.hydrate();
    view.open();
    expect(
      view.container.querySelector('.i-option.selected')?.textContent
    ).toContain('Jakarta');

    await view.hydrate(authorizations({ ...jakarta, name: 'Jakarta Updated' }));
    expect(view.input().value).toBe('Jakarta Updated');
    expect(
      view.container.querySelector('.i-option.selected')?.textContent
    ).toContain('Jakarta Updated');
    view.update({ ...props, menuCode: 'unknown' });
    expect(view.labels()).toEqual([]);
    expect(view.input().value).toBe('Jakarta');
    act(() => view.store.reset());
    expect(view.input().value).toBe('Jakarta');
    expect(initial.name).toBe('Jakarta');
    expect(onChange).not.toHaveBeenCalled();
    expect(onChanged).not.toHaveBeenCalled();
    expect(onOptionSelected).not.toHaveBeenCalled();

    view.update({ ...props, value: bandung });
    expect(view.input().value).toBe('Bandung');
    view.update({ ...props, value: null });
    expect(view.input().value).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('searches names and codes and supports display, filter, and render overrides', async () => {
    const view = mountCompany({ filterDelay: 0 });
    await view.hydrate();
    for (const query of ['jAk', 'jKt']) {
      fireEvent.input(view.input(), { target: { value: query } });
      act(() => vi.advanceTimersByTime(0));
      expect(view.labels()).toEqual(['Jakarta']);
    }
    view.update({
      filterDelay: 0,
      displayWith: 'code',
      filterPredicate: (row) => row.id === 'c2',
      renderOption: (row) => <strong>{row.code}</strong>,
    });
    expect(view.labels()).toEqual(['BDG']);
    expect(view.container.querySelector('.i-option strong')?.textContent).toBe(
      'BDG'
    );
    fireEvent.mouseDown(view.container.querySelector('.i-option')!);
    expect(view.input().value).toBe('BDG');
  });

  it('supports object default values and retains an uncontrolled selection across scope changes', async () => {
    const onChange = vi.fn();
    const onChanged = vi.fn();
    const onOptionSelected = vi.fn();
    const props = {
      defaultValue: { ...jakarta },
      onChange,
      onChanged,
      onOptionSelected,
    };
    const view = mountCompany(props);
    await view.hydrate();
    view.open();
    expect(
      view.container.querySelector('.i-option.selected')?.textContent
    ).toContain('Jakarta');
    fireEvent.mouseDown(view.container.querySelectorAll('.i-option')[1]);
    expect(view.input().value).toBe('Bandung');
    for (const callback of [onChange, onChanged, onOptionSelected]) {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        value: bandung,
        label: 'Bandung',
      });
    }
    view.update({ ...props, menuCode: 'sales' });
    expect(view.input().value).toBe('Bandung');
    view.open();
    expect(view.labels()).toEqual(['Jakarta']);
    expect(view.container.querySelector('.i-option.selected')).toBeNull();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('emits controlled selections once and follows consumer value updates', async () => {
    const onChange = vi.fn();
    const view = mountCompany({ value: jakarta, onChange });
    await view.hydrate();
    view.open();
    fireEvent.mouseDown(view.container.querySelectorAll('.i-option')[1]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ value: bandung, label: 'Bandung' });
    view.update({ value: bandung, onChange });
    view.update({ value: { ...jakarta }, onChange });
    expect(view.input().value).toBe('Jakarta');
  });

  it('delegates focus and respects the disabled prop', async () => {
    const view = mountCompany();
    await view.hydrate();
    act(() => view.ref.current?.focus());
    expect(document.activeElement).toBe(view.input());
    view.input().blur();
    view.update({ disabled: true });
    act(() => view.ref.current?.focus());
    expect(document.activeElement).not.toBe(view.input());
    expect(view.input().readOnly).toBe(true);
    view.open();
    expect(view.labels()).toEqual([]);
  });
});

describe('IFCSelectCompany validation', () => {
  afterEach(cleanup);

  it('matches select validation timing, custom errors, and label focus', () => {
    const props = {
      label: 'Company',
      errors: { required: true },
      portalToBody: false,
    };
    const view = mount(props, true);
    expect(view.container.querySelector('.i-fc-select__required')).toBeTruthy();
    expect(view.container.querySelector('.i-fc-select__error')).toBeNull();
    fireEvent.click(view.container.querySelector('label')!);
    expect(document.activeElement).toBe(view.input());

    view.update({ ...props, touched: true, submitted: false });
    expect(view.container.querySelector('.i-fc-select__error')).toBeNull();
    view.update({ ...props, touched: true });
    expect(
      view.container.querySelector('.i-fc-select__error')?.textContent
    ).toBe('Company is required.');
    view.update({
      ...props,
      submitted: true,
      errorMessage: { required: 'Choose a company.' },
    });
    expect(
      view.container.querySelector('.i-fc-select__error')?.textContent
    ).toBe('Choose a company.');
    view.update({ ...props, errors: null, submitted: true });
    expect(view.container.querySelector('.i-fc-select__error')).toBeNull();
  });
});


describe.each([false, true])('hosted company select with wrapped=%s', (wrapped) => {
  afterEach(cleanup);

  it('restores the host value, resets invalid menu selections, and keeps local fields independent', async () => {
    sessionStorage.clear();
    const state = new IHStateOwner('hosted-selector-test');
    state.setIdentity('user');
    state.selection.activateMenu('report');
    state.selection.validateCompanies('report', ['c1', 'c2'], 'ready');
    state.selection.setCompany('c2');
    const changed = vi.fn();
    const selected = vi.fn();
    const view = mount({ value: jakarta, onChanged: changed, onOptionSelected: selected }, wrapped, state);
    vi.spyOn(view.store, 'initialized', 'get').mockReturnValue(true);
    await view.hydrate();
    expect(view.input().value).toBe('Bandung');
    expect(state.selection.getSnapshot().companyId).toBe('c2');
    expect(selected).not.toHaveBeenCalled();
    expect(changed).toHaveBeenLastCalledWith(expect.objectContaining({ value: bandung }));
    act(() => state.selection.activateMenu('sales'));
    expect(state.selection.getSnapshot().companyId).toBeNull();
    expect(view.input().value).toBe('');
    expect(selected).not.toHaveBeenCalled();
    view.update({ stateScope: 'local', value: bandung });
    expect(view.input().value).toBe('Bandung');
    expect(state.selection.getSnapshot().companyId).toBeNull();
  });

  it('blocks interaction while authorization or explicit loading is pending', async () => {
    sessionStorage.clear();
    const state = new IHStateOwner('hosted-loading-test');
    state.setIdentity('user');
    state.selection.activateMenu('report');
    const view = mount({}, wrapped, state);
    await view.hydrate();
    expect(state.selection.getSnapshot().companyStatus).toBe('loading');
    view.open();
    expect(view.labels()).toEqual([]);
    vi.spyOn(view.store, 'initialized', 'get').mockReturnValue(true);
    view.update({ loading: true });
    expect(state.selection.getSnapshot().companyStatus).toBe('loading');
    view.update({ loading: false });
    expect(state.selection.getSnapshot().companyStatus).toBe('ready');
  });
});
