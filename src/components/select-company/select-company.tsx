import { forwardRef, useMemo, useState } from 'react';

import { useIUserMenuStore } from '../auth/insight-auth-context';
import {
  ISelect,
  type ISelectChange,
  type ISelectHandle,
  type ISelectProps,
} from '../select';
import type { IMenuCompanyDto } from '../user/user.types';

export type ISelectCompanyProps = Omit<
  ISelectProps<IMenuCompanyDto>,
  'options' | 'options$' | 'defaultValue'
> & {
  menuCode?: string | null;
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
    const [internalValue, setInternalValue] = useState<IMenuCompanyDto | null>(
      defaultValue
    );
    const controlled = value !== undefined;
    const modelValue = controlled ? value : internalValue;

    const options = useMemo(() => {
      const companies = [...store.companies];
      const code = menuCode?.trim();
      if (!code) return companies;

      const allowed = new Set(store.menuCompanies[code] ?? []);
      return companies.filter((company) => allowed.has(company.code));
      // The store mutates in place; its version invalidates the derived options.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, version, menuCode]);

    const selectedCompany =
      options.find((company) => company.id === modelValue?.id) ??
      modelValue ??
      null;

    const handleChange = (change: ISelectChange<IMenuCompanyDto>) => {
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
