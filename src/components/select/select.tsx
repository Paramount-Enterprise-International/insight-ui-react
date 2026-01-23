// select.tsx (React)
// ISelect - React parity for Angular ISelect (single-select only)
// - opens on typing even if collapsed
// - toggle behavior:
//    - closed -> open
//    - open + no results -> clear filter & show all (keep open)
//    - open + has results -> close & restore selected display text
//
// NOTE: multi-select intentionally removed for now.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Observable } from 'rxjs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IIcon } from '../icon';
import {
  IInput,
  type IInputAddonButton,
  type IInputAddonLoading,
} from '../input';

/* =========================================
 * Types
 * ========================================= */

export type ISelectChange<T = any> = {
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

export type ISelectProps<T = any> = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onChange'
> & {
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;

  /** debounce delay (ms) */
  filterDelay?: number;

  panelPosition?: ISelectPanelPosition;

  /** provide list directly */
  options?: T[] | null;

  /** or provide as observable */
  options$?: Observable<T[]> | null;

  /**
   * Label resolver:
   * - function: (row) => label
   * - string: key path (supports "a.b.c")
   */
  displayWith?: ((row: T | null) => string) | string;

  /**
   * Filter predicate:
   * Default = JSON stringify contains (case-insensitive)
   */
  filterPredicate?: (row: T, term: string) => boolean;

  /**
   * Optional option renderer (like Angular iSelectOption template)
   */
  renderOption?: (row: T) => React.ReactNode;

  /**
   * Selected value (controlled)
   */
  value?: T | null;

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: T | null;

  /**
   * Event parity (Angular outputs)
   */
  onChanged?: (change: ISelectChange<T>) => void;
  onOptionSelected?: (change: ISelectChange<T>) => void;
};

/* =========================================
 * Helpers
 * ========================================= */

function normalizePanelClass(pos: ISelectPanelPosition | undefined): string {
  const value = (pos || 'bottom left').trim();
  const normalized = value.replace(/\s+/g, '-');
  return `i-options--${normalized}`;
}

function defaultFilterPredicate(row: any, term: string) {
  const haystack = JSON.stringify(row).toLowerCase();
  return haystack.includes(term);
}

function resolveByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let v: any = obj;
  for (const p of parts) {
    if (v === null || v === undefined) return null;
    v = v[p];
  }
  return v;
}

function highlightParts(text: string, term: string): React.ReactNode {
  const t = (term ?? '').trim();
  if (!t) return text;

  const lower = text.toLowerCase();
  const q = t.toLowerCase();

  const idx = lower.indexOf(q);
  if (idx < 0) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + t.length);
  const after = text.slice(idx + t.length);

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}

/* =========================================
 * ISelect
 * ========================================= */

export function ISelect<T = any>(props: ISelectProps<T>) {
  const {
    placeholder = '',
    disabled = false,
    invalid = false,
    filterDelay = 200,
    panelPosition = 'bottom left',
    options = null,
    options$ = null,
    displayWith,
    filterPredicate = defaultFilterPredicate,
    renderOption,

    value,
    defaultValue = null,

    onChanged,
    onOptionSelected,

    className,
    ...hostProps
  } = props;

  // DOM
  const hostRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // options
  const [rawOptions, setRawOptions] = useState<T[]>(() => options ?? []);
  const [filteredOptions, setFilteredOptions] = useState<T[]>(
    () => options ?? []
  );

  // model
  const isControlled = value !== undefined;
  const [modelValue, setModelValue] = useState<T | null>(() =>
    isControlled ? (value ?? null) : (defaultValue ?? null)
  );

  // UI
  const [displayText, setDisplayText] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Rx filter debounce (parity with Angular)
  const filterInput$ = useMemo(() => new Subject<string>(), []);
  const filterSubRef = useRef<Subscription | null>(null);
  const optionsSubRef = useRef<Subscription | null>(null);

  // ---------- displayWith logic (parity-ish) ----------
  const displayWithIsExplicit =
    displayWith !== undefined && displayWith !== null;

  const resolveDisplayText = (row: T | null): string => {
    if (row === null || row === undefined) return '';

    // CASE 1: explicit function
    if (typeof displayWith === 'function' && displayWithIsExplicit) {
      return displayWith(row);
    }

    // CASE 2: explicit string key (path)
    if (typeof displayWith === 'string') {
      const v = resolveByPath(row as any, displayWith);
      return v === null || v === undefined ? '' : String(v);
    }

    // CASE 3A: auto-mapping when object
    if (!displayWithIsExplicit && typeof row === 'object') {
      const entries = Object.entries(row as any);
      if (!entries.length) return '';
      const labelEntry = entries[1] ?? entries[0];
      const labelValue = labelEntry?.[1];
      return labelValue === null || labelValue === undefined
        ? ''
        : String(labelValue);
    }

    // CASE 4: fallback
    return String(row as any);
  };

  // ---------- sync model from props ----------
  useEffect(() => {
    if (!isControlled) return;
    setModelValue(value ?? null);
  }, [isControlled, value]);

  // ---------- subscribe options$ ----------
  useEffect(() => {
    // direct options input always wins unless options$ is provided
    if (options$) {
      setIsLoading(true);

      optionsSubRef.current?.unsubscribe();
      optionsSubRef.current = options$.subscribe({
        next: (rows) => {
          setRawOptions(rows ?? []);
          setIsLoading(false);
        },
        error: () => {
          setIsLoading(false);
        },
      });

      return () => {
        optionsSubRef.current?.unsubscribe();
        optionsSubRef.current = null;
      };
    }

    setRawOptions(options ?? []);
    return undefined;
  }, [options$, options]);

  // ---------- debounce filter input ----------
  useEffect(() => {
    filterSubRef.current?.unsubscribe();
    filterSubRef.current = filterInput$
      .pipe(debounceTime(filterDelay))
      .subscribe((val) => {
        handleInputText(val);
        setIsLoading(false);
      });

    return () => {
      filterSubRef.current?.unsubscribe();
      filterSubRef.current = null;
    };
  }, [filterInput$, filterDelay]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- sync view text from model/options ----------
  useEffect(() => {
    // on init and when model/options change: keep displayText showing selected label (if closed)
    if (!isOpen) {
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText('');
      setHighlightIndex(-1);
    }
    // keep filteredOptions in sync when open
    if (isOpen) {
      applyFilter(true, filterText);
    } else {
      setFilteredOptions(rawOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelValue, rawOptions]);

  // ---------- derived ----------
  const panelPositionClass = useMemo(
    () => normalizePanelClass(panelPosition),
    [panelPosition]
  );

  const hasNoResults = isOpen && !!filterText && filteredOptions.length === 0;

  const hasOptionsList = isOpen && filteredOptions.length > 0;

  // ---------- filter ----------
  const applyFilter = (force: boolean, nextFilterText?: string) => {
    if (!isOpen && !force) return;

    const term = (nextFilterText ?? filterText ?? '').toLowerCase().trim();

    const next = !term
      ? [...rawOptions]
      : rawOptions.filter((row) => {
          try {
            return filterPredicate(row, term);
          } catch {
            return false;
          }
        });

    setFilteredOptions(next);

    setHighlightIndex((idx) => {
      if (next.length === 0) return -1;
      if (idx < 0) return -1;
      if (idx >= next.length) return -1;
      return idx;
    });
  };

  // ---------- open/close ----------
  const scrollHighlightedIntoView = () => {
    // defer until options rendered
    setTimeout(() => {
      if (!isOpen) return;
      const host = hostRef.current;
      if (!host) return;

      const list = host.querySelector('.i-options') as HTMLElement | null;
      if (!list) return;

      const items = list.querySelectorAll('.i-option');
      const el = items[highlightIndex] as HTMLElement | undefined;
      el?.scrollIntoView?.({ block: 'nearest' });
    });
  };

  const openDropdown = () => {
    if (disabled) return;
    if (isOpen) return;

    setIsOpen(true);

    // ensure filter applied
    const term = filterText;
    const next = !term
      ? [...rawOptions]
      : rawOptions.filter((row) =>
          filterPredicate(row, term.toLowerCase().trim())
        );

    setFilteredOptions(next);

    if (next.length === 0) {
      setHighlightIndex(-1);
      return;
    }

    // highlight selected row if present
    if (modelValue !== null && modelValue !== undefined) {
      const idx = next.indexOf(modelValue as T);
      if (idx >= 0) {
        setHighlightIndex(idx);
        scrollHighlightedIntoView();
        return;
      }
    }

    setHighlightIndex(0);
    scrollHighlightedIntoView();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const focus = () => {
    if (disabled) return;
    inputRef.current?.focus?.();
  };

  // ---------- input behavior ----------
  const handleInputText = (val: string) => {
    setDisplayText(val);
    setFilterText(val);

    // open if collapsed, and show filtered options
    if (!isOpen) {
      setIsOpen(true);
      // next tick after open: apply filter
      setTimeout(() => applyFilter(true, val), 0);
    } else {
      applyFilter(true, val);
    }
  };

  const onHostInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;
    const v = e.currentTarget.value ?? '';

    setIsLoading(true);
    filterInput$.next(v);
  };

  // ---------- toggle behavior (matches your Angular) ----------
  const toggleDropdown = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (disabled) return;

    if (!isOpen) {
      openDropdown();
    } else if (hasNoResults) {
      // open + no results -> clear filter & show all, keep open
      setDisplayText('');
      setFilterText('');
      applyFilter(true, '');
    } else {
      // open + has results -> close and restore selected display text
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText('');
      closeDropdown();
    }

    focus();
  };

  // ---------- selection ----------
  const emitChange = (row: T | null) => {
    const label = resolveDisplayText(row);
    const payload: ISelectChange<T> = { value: row, label };

    onChanged?.(payload);
    onOptionSelected?.(payload);
  };

  const selectRow = (row: T) => {
    if (disabled) return;

    if (!isControlled) {
      setModelValue(row);
    }
    // for controlled, still update display immediately
    setDisplayText(resolveDisplayText(row));
    setFilterText('');

    // keep options list fresh
    applyFilter(true, '');

    emitChange(row);
    closeDropdown();
  };

  const isRowSelected = (row: T) => modelValue === row;

  const setActiveIndex = (idx: number) => {
    if (idx < 0 || idx >= filteredOptions.length) {
      setHighlightIndex(-1);
    } else {
      setHighlightIndex(idx);
    }
  };

  const moveHighlight = (delta: number) => {
    const len = filteredOptions.length;
    if (!len) {
      setHighlightIndex(-1);
      return;
    }

    setHighlightIndex((prev) => {
      let next = prev;
      if (next === -1) next = 0;
      else next = (next + delta + len) % len;
      return next;
    });

    scrollHighlightedIntoView();
  };

  // ---------- keyboard ----------
  const onHostKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (disabled) return;

    const opts = filteredOptions;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) openDropdown();
        else if (opts.length) moveHighlight(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) openDropdown();
        else if (opts.length) moveHighlight(-1);
        break;

      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (highlightIndex >= 0 && highlightIndex < opts.length) {
          selectRow(opts[highlightIndex]);
        }
        break;

      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          // close and restore selected text (same as toggle close path)
          setDisplayText(resolveDisplayText(modelValue));
          setFilterText('');
          closeDropdown();
        }
        break;
    }
  };

  // ---------- outside click ----------
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isOpen) return;

      const target = e.target as Node | null;
      const host = hostRef.current;
      if (!host) return;

      if (target && !host.contains(target)) {
        // close and restore
        setDisplayText(resolveDisplayText(modelValue));
        setFilterText('');
        closeDropdown();
      }
    };

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, modelValue, rawOptions]);

  // ---------- append addon ----------
  const appendAddon: IInputAddonButton | IInputAddonLoading = useMemo(() => {
    if (isLoading) {
      return { type: 'loading', visible: true };
    }

    return {
      type: 'button',
      icon: isOpen ? 'angle-up' : 'angle-down',
      visible: true,
      variant: 'primary',
      onClick: () => toggleDropdown(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    isOpen,
    disabled,
    hasNoResults,
    modelValue,
    displayText,
    filterText,
  ]);

  return (
    <i-select
      {...hostProps}
      className={className}
      ref={(el) => {
        hostRef.current = el as any;
      }}
      onKeyDown={onHostKeyDown as any}>
      <IInput
        inputRef={inputRef}
        append={appendAddon}
        invalid={invalid || hasNoResults}
        placeholder={placeholder}
        readonly={disabled}
        value={displayText}
        onInput={onHostInput}
      />

      {hasOptionsList ? (
        <div className={`i-options scroll scroll-y ${panelPositionClass}`}>
          {filteredOptions.map((row, idx) => (
            <div
              key={(row as any)?.id ?? `${idx}-${String(row)}`}
              className={[
                'i-option',
                highlightIndex === idx ? 'active' : null,
                isRowSelected(row) ? 'selected' : null,
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => {
                // prevent blur (Angular uses mousedown too)
                e.preventDefault();
                e.stopPropagation();
                selectRow(row);
              }}>
              <div className="i-option-label">
                {renderOption ? (
                  renderOption(row)
                ) : (
                  <span>
                    {highlightParts(resolveDisplayText(row), filterText)}
                  </span>
                )}
              </div>

              {isRowSelected(row) ? (
                <span className="i-option-check">
                  <IIcon icon="check" />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </i-select>
  );
}
