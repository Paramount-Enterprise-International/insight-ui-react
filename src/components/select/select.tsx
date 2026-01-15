import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { IIcon } from '../icon';
import {
  IInput,
  type IInputAddonButton,
  type IInputAddonLoading,
} from '../input';
import type { IFormControlErrorMessage } from '../shared';

export type ISelectChange<T> = {
  value: T | null;
  label: string;
};

export type ISelectPanelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

export type ISelectProps<T> = {
  // host props (we’ll spread these onto <i-select>)
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;

  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;

  filterDelay?: number;
  panelPosition?: ISelectPanelPosition;

  options?: T[] | null;

  /** React-friendly replacement for options$ */
  loading?: boolean;

  displayWith?: ((row: T | null) => string) | string | undefined;
  filterPredicate?: (row: T, term: string) => boolean;

  value?: T | null;
  onChange?: (value: T | null) => void;

  onChanged?: (change: ISelectChange<T>) => void;
  onOptionSelected?: (change: ISelectChange<T>) => void;

  /** React replacement for <ng-template iSelectOption> */
  renderOption?: (row: T) => ReactNode;

  /** if true, highlight matches in default label rendering */
  highlightSearch?: boolean;
};

export type ISelectRef = {
  focus: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  clear: () => void;
};

function escapeHtml(s: string): string {
  return (s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function highlightHtml(label: string, term: string): string {
  const t = (term ?? '').trim();
  if (!t) return escapeHtml(label);

  const safeLabel = escapeHtml(label);
  const safeTerm = escapeHtml(t);

  const idx = safeLabel.toLowerCase().indexOf(safeTerm.toLowerCase());
  if (idx < 0) return safeLabel;

  const before = safeLabel.slice(0, idx);
  const mid = safeLabel.slice(idx, idx + safeTerm.length);
  const after = safeLabel.slice(idx + safeTerm.length);

  return `${before}<mark>${mid}</mark>${after}`;
}

function panelPositionClass(
  panelPosition: ISelectPanelPosition | undefined
): string {
  const value = (panelPosition || 'bottom left').trim();
  const normalized = value.replace(/\s+/g, '-');
  return `i-options--${normalized}`;
}

function getByPath(obj: unknown, path: string): unknown {
  const segs = (path ?? '').split('.').filter(Boolean);
  let v: unknown = obj;

  for (const s of segs) {
    if (v === null || v === undefined) return null;
    if (typeof v !== 'object') return null;
    v = (v as Record<string, unknown>)[s];
  }
  return v;
}

/**
 * Resolve display label – mirrors Angular behavior:
 * 1) displayWith function (explicit)
 * 2) displayWith string path
 * 3) auto-mapping for object row: use 2nd property (or 1st)
 * 4) primitive row + options contain objects: match by 1st prop then label by 2nd prop
 * 5) fallback: String(row)
 */
function resolveDisplayText<T>(
  row: T | null,
  rawOptions: T[],
  displayWith: ((row: T | null) => string) | string | undefined,
  displayWithExplicit: boolean
): string {
  if (row === null) return '';

  // CASE 1: explicit function
  if (typeof displayWith === 'function' && displayWithExplicit) {
    return displayWith(row);
  }

  // CASE 2: string path
  if (typeof displayWith === 'string') {
    const v = getByPath(row as unknown, displayWith);
    return v !== null && v !== undefined ? String(v) : '';
  }

  // CASE 3A: auto object mapping
  if (!displayWithExplicit && row !== null && typeof row === 'object') {
    const entries = Object.entries(row as Record<string, unknown>);
    if (!entries.length) return '';
    const labelEntry = entries[1] ?? entries[0];
    const labelValue = labelEntry?.[1];
    return labelValue !== null && labelValue !== undefined
      ? String(labelValue)
      : '';
  }

  // CASE 3B: auto mapping primitive value against object options
  if (!displayWithExplicit && (row === null || typeof row !== 'object')) {
    const primitive = row as unknown;

    const match = rawOptions.find((opt) => {
      if (opt === null || typeof opt !== 'object') return false;
      const entries = Object.entries(opt as Record<string, unknown>);
      if (!entries.length) return false;
      const valueEntry = entries[0]; // first prop = "value"
      return valueEntry?.[1] === primitive;
    });

    if (match) {
      const entries = Object.entries(match as Record<string, unknown>);
      const labelEntry = entries[1] ?? entries[0];
      const labelValue = labelEntry?.[1];
      return labelValue !== null && labelValue !== undefined
        ? String(labelValue)
        : String(primitive);
    }
  }

  // CASE 4: fallback function (implicit)
  if (typeof displayWith === 'function') {
    return displayWith(row);
  }

  return String(row as unknown);
}

function computeFiltered<T>(
  isOpen: boolean,
  filterText: string,
  rawOptions: T[],
  filterPredicate: (row: T, term: string) => boolean
): T[] {
  if (!isOpen) return [];
  const term = (filterText || '').toLowerCase();
  if (!term) return [...rawOptions];
  return rawOptions.filter((row) => filterPredicate(row, term));
}

export const ISelect = forwardRef(function ISelectInner<T = unknown>(
  props: ISelectProps<T>,
  ref: React.Ref<ISelectRef>
) {
  const {
    placeholder = '',
    disabled = false,
    invalid = false,
    filterDelay = 200,
    panelPosition = 'bottom left',

    options = null,
    loading = false,

    displayWith,
    filterPredicate = (row: T, term: string) =>
      JSON.stringify(row).toLowerCase().includes(term),

    value = null,
    onChange,
    onChanged,
    onOptionSelected,

    renderOption,
    highlightSearch = true,

    ...hostProps
  } = props;

  const hostRef = useRef<HTMLElement | null>(null);
  const inputElRef = useRef<HTMLInputElement | null>(null);
  const optionsListRef = useRef<HTMLDivElement | null>(null);

  const [rawOptions, setRawOptions] = useState<T[]>(() => options ?? []);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const [modelValue, setModelValue] = useState<T | null>(value ?? null);
  const [pendingModelValue, setPendingModelValue] = useState<T | null>(null);

  const [displayText, setDisplayText] = useState('');
  const [filterText, setFilterText] = useState('');

  // local "typing" loading (Angular used Subject+debounceTime)
  const [typingLoading, setTypingLoading] = useState(false);
  const isLoading = !!loading || typingLoading;

  // track whether displayWith was explicitly set
  const displayWithExplicit = useMemo(
    () => displayWith !== undefined && displayWith !== null,
    [displayWith]
  );

  // sync external options prop
  useEffect(() => {
    setRawOptions(options ?? []);
  }, [options]);

  // sync external value (FIX: include deps you read)
  useEffect(() => {
    const v = value ?? null;
    setModelValue(v);

    // If options are not ready, mimic pendingModelValue behavior
    if (!rawOptions.length) {
      setPendingModelValue(v);
      setDisplayText(
        resolveDisplayText(v, rawOptions, displayWith, displayWithExplicit)
      );
      return;
    }

    // otherwise model->view sync effect will handle
  }, [value, rawOptions.length, displayWith, displayWithExplicit]);

  // sync model -> view when options / displayWith changes
  useEffect(() => {
    const optionsArr = rawOptions;

    const valueToUse =
      modelValue !== null && modelValue !== undefined
        ? modelValue
        : pendingModelValue;

    if (!optionsArr.length) {
      setDisplayText(
        resolveDisplayText(
          valueToUse ?? null,
          optionsArr,
          displayWith,
          displayWithExplicit
        )
      );
      return;
    }

    if (valueToUse === null || valueToUse === undefined) {
      setDisplayText('');
      setPendingModelValue(null);
    } else {
      const found = optionsArr.find((row) => row === valueToUse) ?? null;
      const row = found ?? valueToUse;

      if (found) setModelValue(found);

      setDisplayText(
        resolveDisplayText(row, optionsArr, displayWith, displayWithExplicit)
      );
      setPendingModelValue(null);
    }

    if (!isOpen) {
      setFilterText('');
      setHighlightIndex(-1);
    }
  }, [
    rawOptions,
    displayWith,
    displayWithExplicit,
    modelValue,
    pendingModelValue,
    isOpen,
  ]);

  const filteredOptions = useMemo(() => {
    return computeFiltered(isOpen, filterText, rawOptions, filterPredicate);
  }, [isOpen, filterText, rawOptions, filterPredicate]);

  const hasOptions = filteredOptions.length > 0;
  const hasNoResults = isOpen && !!filterText && filteredOptions.length === 0;
  const hasOptionsList = isOpen && hasOptions;

  const scrollHighlightedIntoView = () => {
    setTimeout(() => {
      if (!isOpen) return;
      const list = optionsListRef.current;
      if (!list) return;
      if (highlightIndex < 0) return;

      const items = list.querySelectorAll('.i-option');
      const el = items[highlightIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    });
  };

  const setActiveIndex = (idx: number) => {
    if (idx < 0 || idx >= filteredOptions.length) setHighlightIndex(-1);
    else setHighlightIndex(idx);
  };

  const focus = () => {
    if (disabled) return;
    inputElRef.current?.focus();
  };

  const openDropdown = () => {
    if (disabled) return;
    if (isOpen) return;

    setIsOpen(true);

    // compute highlight immediately from *current* state
    setTimeout(() => {
      const list = computeFiltered(
        true,
        filterText,
        rawOptions,
        filterPredicate
      );
      const len = list.length;

      if (len === 0) {
        setHighlightIndex(-1);
        return;
      }

      if (modelValue !== null) {
        const idx = list.indexOf(modelValue as T);
        if (idx >= 0) {
          setHighlightIndex(idx);
          scrollHighlightedIntoView();
          return;
        }
      }

      setHighlightIndex(0);
      scrollHighlightedIntoView();
    }, 0);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  /** Angular behavior:
   *  - if closed → open
   *  - if open and hasNoResults → clear filter & show all (keep open)
   *  - if open and NOT hasNoResults → close & restore model text
   */
  const toggleDropdown = (ev?: React.MouseEvent) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (disabled) return;

    const filteredNow = computeFiltered(
      isOpen,
      filterText,
      rawOptions,
      filterPredicate
    );
    const noResultsNow = isOpen && !!filterText && filteredNow.length === 0;

    if (!isOpen) {
      openDropdown();
    } else if (noResultsNow) {
      setDisplayText('');
      setFilterText('');
      // keep open
    } else {
      const restored = resolveDisplayText(
        modelValue,
        rawOptions,
        displayWith,
        displayWithExplicit
      );
      setDisplayText(restored);
      setFilterText('');
      closeDropdown();
    }

    focus();
  };

  const clearSelection = (ev?: React.MouseEvent) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    setModelValue(null);
    setDisplayText('');
    setFilterText('');

    onChange?.(null);

    const payload: ISelectChange<T> = { value: null, label: '' };
    onChanged?.(payload);
    onOptionSelected?.(payload);
  };

  const selectRow = (row: T) => {
    const label = resolveDisplayText(
      row,
      rawOptions,
      displayWith,
      displayWithExplicit
    );

    setModelValue(row);
    setDisplayText(label);
    setFilterText('');

    onChange?.(row);

    const payload: ISelectChange<T> = { value: row, label };
    onChanged?.(payload);
    onOptionSelected?.(payload);

    closeDropdown();
  };

  // debounce typing like Angular Subject+debounceTime
  const debounceTimerRef = useRef<number | null>(null);

  const onInputText = (val: string) => {
    setTypingLoading(true);

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(
      () => {
        setDisplayText(val);
        setFilterText(val);
        setTypingLoading(false);

        if (!isOpen) openDropdown();
      },
      Math.max(0, filterDelay)
    );
  };

  // cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // keyboard behavior
  const moveHighlight = (delta: number) => {
    const len = filteredOptions.length;
    if (!len) {
      setHighlightIndex(-1);
      return;
    }

    setHighlightIndex((prev) => {
      let index = prev;
      if (index === -1) index = 0;
      else index = (index + delta + len) % len;

      setTimeout(scrollHighlightedIntoView);
      return index;
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const optionsArr = filteredOptions;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) openDropdown();
        else if (optionsArr.length) moveHighlight(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) openDropdown();
        else if (optionsArr.length) moveHighlight(-1);
        break;

      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (highlightIndex >= 0 && highlightIndex < optionsArr.length) {
          selectRow(optionsArr[highlightIndex]);
        }
        break;

      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          closeDropdown();
        }
        break;
    }
  };

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      const host = hostRef.current;
      if (!host) return;

      if (target && !host.contains(target)) {
        closeDropdown();
      }
    };

    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    focus,
    open: openDropdown,
    close: closeDropdown,
    toggle: () => toggleDropdown(),
    clear: () => clearSelection(),
  }));

  const appendAddon: IInputAddonButton | IInputAddonLoading = useMemo(() => {
    if (isLoading) {
      return { type: 'loading', visible: true };
    }

    return {
      type: 'button',
      icon: isOpen ? 'angle-up' : 'angle-down',
      onClick: () => toggleDropdown(),
      variant: 'primary',
      visible: true,
    };
  }, [isLoading, isOpen]);

  return (
    <i-select
      {...hostProps}
      ref={(el) => {
        hostRef.current = el as unknown as HTMLElement;
      }}
      onKeyDown={onKeyDown}>
      <IInput
        append={appendAddon}
        invalid={invalid || hasNoResults}
        placeholder={placeholder}
        readonly={disabled}
        value={displayText}
        inputRef={inputElRef}
        onInput={(e) => onInputText((e.target as HTMLInputElement).value)}
      />

      {hasOptionsList ? (
        <div
          className={[
            'i-options',
            'scroll',
            'scroll-y',
            panelPositionClass(panelPosition),
          ].join(' ')}
          ref={optionsListRef}>
          {filteredOptions.map((row, idx) => {
            const isSelected = modelValue === row;
            const label = resolveDisplayText(
              row,
              rawOptions,
              displayWith,
              displayWithExplicit
            );

            return (
              <div
                key={(row as any)?.id ?? `${idx}-${label}`}
                className={[
                  'i-option',
                  highlightIndex === idx ? 'active' : null,
                  isSelected ? 'selected' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  // mousedown so it selects before blur closes things
                  e.preventDefault();
                  e.stopPropagation();
                  selectRow(row);
                }}>
                {renderOption ? (
                  <div className="i-option-label">{renderOption(row)}</div>
                ) : (
                  <div
                    className="i-option-label"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearch
                        ? highlightHtml(label, filterText)
                        : escapeHtml(label),
                    }}
                  />
                )}

                {isSelected ? (
                  <span className="i-option-check">
                    <IIcon icon="check" />
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </i-select>
  );
}) as <T = unknown>(
  props: ISelectProps<T> & { ref?: React.Ref<ISelectRef> }
) => JSX.Element;

function resolveErrorMessage(
  label: string,
  errorKey: string,
  errorMessage?: IFormControlErrorMessage
): string | null {
  const tpl = errorMessage?.[errorKey];
  if (!tpl) return null;
  return tpl.replaceAll('{label}', label || 'This field');
}

export type IFCSelectProps<T = any> = React.HTMLAttributes<HTMLElement> & {
  label?: string;
  placeholder?: string;

  options?: T[] | null;

  displayWith?: ((row: T | null) => string) | string | undefined;
  filterDelay?: number;
  filterPredicate?: (row: T, term: string) => boolean;

  panelPosition?: ISelectPanelPosition;

  value?: T | null;
  onChange?: (v: T | null) => void;

  onChanged?: (change: ISelectChange<T>) => void;
  onOptionSelected?: (change: ISelectChange<T>) => void;

  renderOption?: (row: T) => React.ReactNode;

  disabled?: boolean;

  /** React validation */
  required?: boolean;
  invalid?: boolean;

  /** Angular-like template map */
  errorMessage?: IFormControlErrorMessage;

  /** which key to render when invalid (default: 'required') */
  errorKey?: string;
};

export function IFCSelect<T = any>(props: IFCSelectProps<T>) {
  const {
    label = '',
    placeholder = '',

    options = null,

    displayWith,
    filterDelay = 200,
    filterPredicate,

    panelPosition = 'bottom left',

    value = null,
    onChange,
    onChanged,
    onOptionSelected,

    renderOption,

    disabled = false,

    required = false,
    invalid = false,
    errorMessage,
    errorKey = 'required',

    children, // (kept for API compatibility; not used)
    ...hostProps
  } = props;

  const resolvedErrorText = useMemo(() => {
    if (!invalid) return null;
    return (
      resolveErrorMessage(label || 'This field', errorKey, errorMessage) ??
      `${label || 'This field'} is invalid`
    );
  }, [invalid, label, errorKey, errorMessage]);

  return (
    <i-fc-select {...hostProps}>
      {label ? (
        <label className="i-fc-select__label">
          {label} :{' '}
          {required ? <span className="i-fc-select__required">*</span> : null}
        </label>
      ) : null}

      <ISelect<T>
        disabled={disabled}
        displayWith={displayWith}
        filterDelay={filterDelay}
        filterPredicate={filterPredicate}
        invalid={invalid}
        options={options}
        panelPosition={panelPosition}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onChanged={onChanged}
        onOptionSelected={onOptionSelected}
        renderOption={renderOption}
      />

      {invalid && resolvedErrorText ? (
        <div className="i-fc-select__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-select>
  );
}
