import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import type { IFCSelectProps, ISelectHandle } from '../select';
import { isControlRequired, resolveControlErrorMessage } from '../shared';
import type { IMenuCompanyDto } from '../user/user.types';
import { ISelectCompany } from './select-company';

export type IFCSelectCompanyProps = Omit<
  IFCSelectProps<IMenuCompanyDto>,
  'options' | 'options$' | 'defaultValue'
> & {
  menuCode?: string | null;
  stateScope?: 'auto' | 'local';
  defaultValue?: IMenuCompanyDto | null;
};

export const IFCSelectCompany = forwardRef<
  ISelectHandle,
  IFCSelectCompanyProps
>(function IFCSelectCompany(
  {
    label = '',
    menuCode,
    stateScope,
    loading,
    placeholder,
    displayWith,
    filterDelay,
    filterMinLength,
    filterPredicate,
    panelPosition,
    panelOffset,
    portalToBody,
    matchTriggerWidth,
    renderOption,
    iSelectOption,
    value,
    defaultValue,
    onChange,
    onChanged,
    onOptionSelected,
    errors = null,
    errorMessage,
    submitted,
    touched,
    dirty,
    disabled = false,
    invalid = false,
    className,
    ...hostProps
  },
  ref
) {
  const innerSelectRef = useRef<ISelectHandle>(null);
  const focus = useCallback(() => {
    if (!disabled) innerSelectRef.current?.focus();
  }, [disabled]);
  useImperativeHandle(ref, () => ({ focus }), [focus]);

  const controlInvalid =
    !!errors &&
    Object.keys(errors).length > 0 &&
    (submitted !== undefined ? !!submitted : !!touched || !!dirty);
  const required = isControlRequired({
    errors: errors ?? undefined,
    errorMessage,
  });
  const errorText = resolveControlErrorMessage({
    errors: errors ?? undefined,
    label,
    errorMessage,
  });

  return (
    <i-fc-select-company {...hostProps} class={className}>
      {label ? (
        <label className="i-fc-select__label" onClick={focus}>
          {label} :
          {required ? <span className="i-fc-select__required">*</span> : null}
        </label>
      ) : null}
      <ISelectCompany
        ref={innerSelectRef}
        menuCode={menuCode}
        stateScope={stateScope}
        loading={loading}
        placeholder={placeholder}
        displayWith={displayWith}
        filterDelay={filterDelay}
        filterMinLength={filterMinLength}
        filterPredicate={filterPredicate}
        panelPosition={panelPosition}
        panelOffset={panelOffset}
        portalToBody={portalToBody}
        matchTriggerWidth={matchTriggerWidth}
        renderOption={renderOption}
        iSelectOption={iSelectOption}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        invalid={invalid || controlInvalid}
        onChange={onChange}
        onChanged={onChanged}
        onOptionSelected={onOptionSelected}
      />
      {controlInvalid && errorText ? (
        <div className="i-fc-select__error">{errorText}</div>
      ) : null}
    </i-fc-select-company>
  );
});
