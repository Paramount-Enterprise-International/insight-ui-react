import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { useIUserMenuStore } from '../auth/insight-auth-context';
import {
  ISelect,
  type ISelectChange,
  type ISelectHandle,
  type ISelectProps,
} from '../select';
import { useIHSelection } from '../state/state';
import type { IMenuCompanyDto } from '../user/user.types';

export type ISelectCompanyProps = Omit<
  ISelectProps<IMenuCompanyDto>,
  'options' | 'options$' | 'defaultValue'
> & {
  menuCode?: string | null;
  stateScope?: 'auto' | 'local';
  defaultValue?: IMenuCompanyDto | null;
};

function filterCompany(row: IMenuCompanyDto, term: string): boolean {
  const query = term.toLowerCase();
  return (
    row.name.toLowerCase().includes(query) ||
    row.code.toLowerCase().includes(query)
  );
}

export const ISelectCompany = forwardRef<ISelectHandle, ISelectCompanyProps>(
  function ISelectCompany(
    {
      menuCode,
      stateScope = 'auto',
      loading = false,
      value,
      defaultValue = null,
      onChange,
      onChanged,
      onOptionSelected,
      displayWith = 'name',
      filterPredicate = filterCompany,
      className,
      ...selectProps
    },
    ref
  ) {
    const store = useIUserMenuStore();
    const version = store.getVersion();
    const { controller, value: selection } = useIHSelection();
    const hosted = !!controller && stateScope !== 'local';
    const effectiveMenu = menuCode?.trim() || (hosted ? selection.menuCode : null);
    const menuActive = !hosted || (!!selection.menuCode && effectiveMenu === selection.menuCode);
    const companyLoading = loading || store.authorizationsLoading || (hosted && (!store.initialized || store.initializing || !menuActive));
    const lastNotified = useRef<IMenuCompanyDto | null | undefined>(undefined);
    const [internalValue, setInternalValue] = useState<IMenuCompanyDto | null>(
      defaultValue
    );
    const controlled = value !== undefined;
    const modelValue = controlled ? value : internalValue;

    const options = useMemo(() => {
      const companies = [...store.companies];
      const code = effectiveMenu;
      if (!code || !menuActive) return [];

      const allowed = new Set(store.menuCompanies[code] ?? []);
      return companies.filter((company) => allowed.has(company.code));
      // The store mutates in place; its version invalidates the derived options.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, version, effectiveMenu, menuActive]);

    const selectedCompany = hosted
      ? options.find((company) => company.id === selection.companyId) ?? null
      : options.find((company) => company.id === modelValue?.id) ?? modelValue ?? null;

    useEffect(() => {
      if (!hosted || !controller || !menuActive) return;
      const error = store.loadErrors.authorizations;
      controller.validateCompanies(effectiveMenu, options.map((company) => company.id),
        companyLoading ? 'loading' : error ? 'error' : 'ready', error ? 'Unable to load company access.' : null);
    }, [hosted, controller, effectiveMenu, menuActive, options, companyLoading, store, version, selection.revision]);

    useEffect(() => {
      if (!hosted || lastNotified.current === selectedCompany) return;
      lastNotified.current = selectedCompany;
      const change = { value: selectedCompany, label: selectedCompany?.name ?? '' };
      onChange?.(change);
      onChanged?.(change);
    }, [hosted, selectedCompany, onChange, onChanged]);

    const handleChange = (change: ISelectChange<IMenuCompanyDto>) => {
      if (hosted && (companyLoading || !menuActive || !controller?.setCompany(change.value?.id ?? null))) return;
      lastNotified.current = change.value;
      if (!controlled) setInternalValue(change.value);
      onChange?.(change);
      onChanged?.(change);
      onOptionSelected?.(change);
    };

    return (
      <i-select-company class={className}>
        <ISelect<IMenuCompanyDto>
          {...selectProps}
          ref={ref}
          loading={companyLoading}
          disabled={selectProps.disabled || (hosted && companyLoading)}
          displayWith={displayWith}
          filterPredicate={filterPredicate}
          options={options}
          value={selectedCompany}
          onChange={handleChange}
        />
      </i-select-company>
    );
  }
);
