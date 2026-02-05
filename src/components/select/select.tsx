/* select.tsx */
/**
 * ISelect + IFCSelect (React)
 * Version: 2.2.3
 *
 * Changes (2.2.3):
 * - Fix portaled panel stuck hidden (visibility:hidden) by adding open-cycle + failsafe unhide.
 * - Rename event: onChanged -> onChange (React-y)
 *
 * Notes:
 * - options panel renders as <i-options>
 * - portal-to-body supported (default true)
 * - fixed positioning + matchTriggerWidth supported
 * - flicker fix (hide until first reposition)
 * - exposes ref focus() for IFCSelect label click parity
 * - IFCSelect uses shared resolveControlErrorMessage/isControlRequired from shared/form
 */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from 'react';
import { createPortal } from 'react-dom';
import type { Observable } from 'rxjs';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IIcon } from '../icon';
import {
  IInput,
  type IInputAddonButton,
  type IInputAddonLoading,
} from '../input';

// ✅ use your shared form helpers/types
import type { IErrors, IFormControlErrorMessage } from '../shared';
import { isControlRequired, resolveControlErrorMessage } from '../shared/';

/* =========================================
 * Shared Types
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

export type ISelectHandle = {
  focus: () => void;
};

/* =========================================
 * ISelect Props
 * ========================================= */

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

  /** portal panel to body to avoid overflow clipping (default true) */
  portalToBody?: boolean;

  /** gap between trigger and panel (px) */
  panelOffset?: number;

  /** match dropdown width to control width (default true) */
  matchTriggerWidth?: boolean;

  /** Array options */
  options?: T[] | null;

  /** Observable options */
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
   * NOTE: keep API allowing null, but we won't pass null into DOM props.
   */
  defaultValue?: T | null;

  /**
   * Event parity (Angular outputs)
   */
  onChange?: (change: ISelectChange<T>) => void;
  onOptionSelected?: (change: ISelectChange<T>) => void;
};

/* =========================================
 * IFCSelect Types
 * ========================================= */

export type IFCSelectHandle = {
  focus: () => void;
};

export type IFCSelectProps<T = any> = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children' | 'onChange'
> & {
  label?: string;
  placeholder?: string;

  options?: T[] | null;
  options$?: Observable<T[]> | null;

  displayWith?: ((row: T | null) => string) | string;
  filterDelay?: number;
  filterPredicate?: (row: T, term: string) => boolean;

  panelPosition?: ISelectPanelPosition;

  /** Angular-like error hooks */
  errors?: IErrors | null;
  errorMessage?: IFormControlErrorMessage;

  /**
   * Angular parity:
   * If submitted is provided, invalid display is gated by submitted.
   * Otherwise invalid display is gated by dirty/touched.
   */
  submitted?: boolean;
  touched?: boolean;
  dirty?: boolean;

  disabled?: boolean;

  /** controlled */
  value?: T | null;

  /** uncontrolled */
  defaultValue?: T | null;

  /** Event parity */
  onChange?: (change: ISelectChange<T>) => void;
  onOptionSelected?: (change: ISelectChange<T>) => void;

  /** pass-through */
  renderOption?: (row: T) => React.ReactNode;
  portalToBody?: boolean;
  panelOffset?: number;
  matchTriggerWidth?: boolean;

  /**
   * Force invalid (non-form usage)
   * Note: IFCSelect already computes invalid from errors + submitted/touched/dirty.
   * This is additive (OR).
   */
  invalid?: boolean;
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

export const ISelect = forwardRef(function ISelectInner<T = any>(
  props: ISelectProps<T>,
  ref: React.ForwardedRef<ISelectHandle>
) {
  const {
    placeholder = '',
    disabled = false,
    invalid = false,

    filterDelay = 200,
    panelPosition = 'bottom left',

    portalToBody = true,
    panelOffset = 6,
    matchTriggerWidth = true,

    options = null,
    options$ = null,

    displayWith,
    filterPredicate = defaultFilterPredicate,
    renderOption,

    value,
    defaultValue = null,

    onChange,
    onOptionSelected,

    className,
    ...hostProps
  } = props;

  // DOM
  const hostRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  // positioning raf
  const rafRef = useRef<number>(0);

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

  // ✅ flicker control: hide panel until first reposition completes
  const [panelHidden, setPanelHidden] = useState<boolean>(false);
  const wantsOpenRef = useRef<boolean>(false);

  // ✅ open-cycle + failsafe unhide
  const openSeqRef = useRef(0);
  const unhideTimerRef = useRef<number | null>(null);

  // Rx filter debounce (parity with Angular)
  const filterInput$ = useMemo(() => new Subject<string>(), []);
  const filterSubRef = useRef<Subscription | null>(null);
  const optionsSubRef = useRef<Subscription | null>(null);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
    };
  }, []);

  // ---------- displayWith logic ----------
  const displayWithIsExplicit =
    displayWith !== undefined && displayWith !== null;

  const resolveDisplayText = (row: T | null): string => {
    if (row === null || row === undefined) return '';

    if (typeof displayWith === 'function' && displayWithIsExplicit) {
      return displayWith(row);
    }

    if (typeof displayWith === 'string') {
      const v = resolveByPath(row as any, displayWith);
      return v === null || v === undefined ? '' : String(v);
    }

    if (!displayWithIsExplicit && typeof row === 'object') {
      const entries = Object.entries(row as any);
      if (!entries.length) return '';
      const labelEntry = entries[1] ?? entries[0];
      const labelValue = labelEntry?.[1];
      return labelValue === null || labelValue === undefined
        ? ''
        : String(labelValue);
    }

    return String(row as any);
  };

  // ---------- imperative API ----------
  const focus = () => {
    if (disabled) return;
    inputRef.current?.focus?.();
  };

  useImperativeHandle(
    ref,
    () => ({
      focus,
    }),
    [disabled]
  );

  // ---------- sync model from props ----------
  useEffect(() => {
    if (!isControlled) return;
    setModelValue(value ?? null);
  }, [isControlled, value]);

  // ---------- subscribe options$ ----------
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterInput$, filterDelay]);

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

  // ---------- sync view text from model/options ----------
  useEffect(() => {
    if (!isOpen) {
      setDisplayText(resolveDisplayText(modelValue));
      setFilterText('');
      setHighlightIndex(-1);
      setFilteredOptions(rawOptions);
      return;
    }

    applyFilter(true, filterText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelValue, rawOptions, isOpen]);

  // ---------- positioning ----------
  const getAnchorRect = (): DOMRect | null => {
    const host = hostRef.current;
    if (!host) return null;

    const iInput = host.querySelector('i-input') as HTMLElement | null;
    if (iInput?.getBoundingClientRect) return iInput.getBoundingClientRect();

    if ((host as any).getBoundingClientRect)
      return host.getBoundingClientRect();

    const input = host.querySelector(
      'i-input input'
    ) as HTMLInputElement | null;
    return input?.getBoundingClientRect?.() ?? null;
  };

  const repositionPanelNow = () => {
    if (!wantsOpenRef.current) return;

    const panel = panelRef.current;
    const rect = getAnchorRect();
    if (!panel || !rect) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 8;

    const pos = (panelPosition || 'bottom left').trim().toLowerCase();

    panel.style.position = 'fixed';
    panel.style.zIndex = '2000';
    panel.style.boxSizing = 'border-box';
    panel.style.overflowY = 'auto';

    if (matchTriggerWidth) {
      panel.style.width = `${Math.round(rect.width)}px`;
    } else {
      panel.style.width = '';
    }

    const panelRect = panel.getBoundingClientRect();

    const wantTop = pos.startsWith('top');
    const wantBottom =
      pos.startsWith('bottom') ||
      (!pos.startsWith('top') &&
        !pos.startsWith('left') &&
        !pos.startsWith('right'));

    const wantLeft = pos.includes('left') || pos === 'left';
    const wantRight = pos.includes('right') || pos === 'right';
    const alignRight = wantRight && !wantLeft;

    let left = alignRight ? rect.right - panelRect.width : rect.left;
    const maxLeft = Math.max(gap, vw - panelRect.width - gap);
    left = Math.min(Math.max(gap, left), maxLeft);

    if (pos === 'left') {
      left = rect.left - panelRect.width - panelOffset;
      left = Math.min(Math.max(gap, left), maxLeft);

      const top = Math.min(
        Math.max(gap, rect.top),
        Math.max(gap, vh - panelRect.height - gap)
      );

      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top)}px`;

      const maxH = Math.max(60, vh - top - gap);
      panel.style.maxHeight = `${Math.floor(maxH)}px`;
      return;
    }

    if (pos === 'right') {
      left = rect.right + panelOffset;
      left = Math.min(Math.max(gap, left), maxLeft);

      const top = Math.min(
        Math.max(gap, rect.top),
        Math.max(gap, vh - panelRect.height - gap)
      );

      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top)}px`;

      const maxH = Math.max(60, vh - top - gap);
      panel.style.maxHeight = `${Math.floor(maxH)}px`;
      return;
    }

    const spaceBelow = vh - rect.bottom - panelOffset - gap;
    const spaceAbove = rect.top - panelOffset - gap;

    let side: 'top' | 'bottom' = wantTop && !wantBottom ? 'top' : 'bottom';

    if (
      side === 'bottom' &&
      panelRect.height > spaceBelow &&
      spaceAbove > spaceBelow
    ) {
      side = 'top';
    } else if (
      side === 'top' &&
      panelRect.height > spaceAbove &&
      spaceBelow > spaceAbove
    ) {
      side = 'bottom';
    }

    const maxH = Math.max(60, side === 'bottom' ? spaceBelow : spaceAbove);
    panel.style.maxHeight = `${Math.floor(maxH)}px`;

    const top =
      side === 'bottom'
        ? rect.bottom + panelOffset
        : rect.top - panelRect.height - panelOffset;

    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  };

  const scheduleReposition = (after?: () => void) => {
    if (!wantsOpenRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      repositionPanelNow();
      after?.();
    });
  };

  // ✅ Initial open: hide, position, show (with failsafe)
  useLayoutEffect(() => {
    // close
    if (!isOpen) {
      wantsOpenRef.current = false;
      setPanelHidden(false);

      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
      return;
    }

    // open
    wantsOpenRef.current = true;

    if (!hasOptionsList) {
      setPanelHidden(false);
      return;
    }

    const seq = ++openSeqRef.current;

    setPanelHidden(true);

    scheduleReposition(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    });

    // ✅ failsafe: always unhide on next tick if still open
    if (unhideTimerRef.current) window.clearTimeout(unhideTimerRef.current);
    unhideTimerRef.current = window.setTimeout(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasOptionsList]);

  // reposition on changes while open
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!hasOptionsList) return;
    scheduleReposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    panelPosition,
    matchTriggerWidth,
    panelOffset,
    filteredOptions.length,
  ]);

  // reposition on scroll/resize (capture=true catches nested scrolling)
  useEffect(() => {
    if (!isOpen) return;

    const onAnyScroll = () => scheduleReposition();
    const onResize = () => scheduleReposition();

    window.addEventListener('scroll', onAnyScroll, true);
    document.addEventListener('scroll', onAnyScroll, true);
    window.addEventListener('resize', onResize, true);

    return () => {
      window.removeEventListener('scroll', onAnyScroll, true);
      document.removeEventListener('scroll', onAnyScroll, true);
      window.removeEventListener('resize', onResize, true);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ---------- open/close ----------
  const scrollHighlightedIntoView = () => {
    setTimeout(() => {
      if (!isOpen) return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = panel.querySelectorAll('.i-option');
      const el = items[highlightIndex] as HTMLElement | undefined;
      el?.scrollIntoView?.({ block: 'nearest' });
    });
  };

  const openDropdown = () => {
    if (disabled) return;
    if (isOpen) return;

    setIsOpen(true);

    const term = filterText.toLowerCase().trim();
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

    if (next.length === 0) {
      setHighlightIndex(-1);
      return;
    }

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

    // also clear hidden + any pending unhide timer
    setPanelHidden(false);
    if (unhideTimerRef.current) {
      window.clearTimeout(unhideTimerRef.current);
      unhideTimerRef.current = null;
    }

    const panel = panelRef.current;
    if (panel) {
      panel.style.position = '';
      panel.style.zIndex = '';
      panel.style.left = '';
      panel.style.top = '';
      panel.style.width = '';
      panel.style.maxHeight = '';
      panel.style.overflowY = '';
      panel.style.boxSizing = '';
      panel.classList.remove('i-options--portaled');
    }
  };

  // ---------- input behavior ----------
  const handleInputText = (val: string) => {
    setDisplayText(val);
    setFilterText(val);

    if (!isOpen) {
      setIsOpen(true);
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

  // ---------- toggle behavior ----------
  const toggleDropdown = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (disabled) return;

    if (!isOpen) {
      openDropdown();
    } else if (hasNoResults) {
      setDisplayText('');
      setFilterText('');
      applyFilter(true, '');
      scheduleReposition();
    } else {
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
    onChange?.(payload);
    onOptionSelected?.(payload);
  };

  const selectRow = (row: T) => {
    if (disabled) return;

    if (!isControlled) setModelValue(row);

    const label = resolveDisplayText(row);
    setDisplayText(label);
    setFilterText('');
    applyFilter(true, '');
    emitChange(row);

    closeDropdown();
  };

  const isRowSelected = (row: T) => modelValue === row;

  const setActiveIndex = (idx: number) => {
    if (idx < 0 || idx >= filteredOptions.length) setHighlightIndex(-1);
    else setHighlightIndex(idx);
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
          setDisplayText(resolveDisplayText(modelValue));
          setFilterText('');
          closeDropdown();
        }
        break;
    }
  };

  // ---------- outside click (host + panel) ----------
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isOpen) return;

      const target = e.target as Node | null;
      if (!target) return;

      const host = hostRef.current;
      const panel = panelRef.current;

      const insideHost = !!host && host.contains(target);
      const insidePanel = !!panel && panel.contains(target);

      if (!insideHost && !insidePanel) {
        setDisplayText(resolveDisplayText(modelValue));
        setFilterText('');
        closeDropdown();
      }
    };

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, modelValue]);

  // ---------- append addon ----------
  const appendAddon: IInputAddonButton | IInputAddonLoading = useMemo(() => {
    if (isLoading) return { type: 'loading', visible: true };

    return {
      type: 'button',
      icon: isOpen ? 'angle-up' : 'angle-down',
      visible: true,
      variant: 'primary',
      onClick: () => toggleDropdown(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isOpen]);

  // ---------- render options (as <i-options>) ----------
  const optionsNode = hasOptionsList ? (
    <i-options
      ref={(el) => {
        panelRef.current = el as any;

        if (panelRef.current) {
          if (portalToBody)
            panelRef.current.classList.add('i-options--portaled');
          else panelRef.current.classList.remove('i-options--portaled');
        }
      }}
      className={`i-options scroll scroll-y ${panelPositionClass}${
        portalToBody ? ' i-options--portaled' : ''
      }`}
      style={{
        visibility: panelHidden ? 'hidden' : 'visible',
        pointerEvents: panelHidden ? 'none' : 'auto',
      }}>
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
            e.preventDefault();
            e.stopPropagation();
            selectRow(row);
          }}>
          <div className="i-option-label">
            {renderOption ? (
              renderOption(row)
            ) : (
              <span>{highlightParts(resolveDisplayText(row), filterText)}</span>
            )}
          </div>

          {isRowSelected(row) ? (
            <span className="i-option-check">
              <IIcon icon="check" />
            </span>
          ) : null}
        </div>
      ))}
    </i-options>
  ) : null;

  return (
    <i-select
      {...hostProps}
      className={className as any}
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

      {portalToBody
        ? optionsNode
          ? createPortal(optionsNode, document.body)
          : null
        : optionsNode}
    </i-select>
  );
}) as <T = any>(
  props: ISelectProps<T> & { ref?: React.Ref<ISelectHandle> }
) => JSX.Element;

/* =========================================
 * IFCSelect
 * ========================================= */

export const IFCSelect = forwardRef(function IFCSelectInner<T = any>(
  props: IFCSelectProps<T>,
  ref: React.ForwardedRef<IFCSelectHandle>
) {
  const {
    label = '',
    placeholder = '',

    options = null,
    options$ = null,

    displayWith,
    filterDelay = 200,
    filterPredicate,

    panelPosition = 'bottom left',

    errors = null,
    errorMessage,

    submitted,
    touched,
    dirty,

    disabled = false,

    value,
    defaultValue = null,

    onChange,
    onOptionSelected,

    renderOption,

    portalToBody = true,
    panelOffset = 6,
    matchTriggerWidth = true,

    invalid = false,

    className,
    ...hostProps
  } = props;

  const innerSelectRef = useRef<ISelectHandle | null>(null);

  const focusInnerSelect = () => {
    if (!disabled) innerSelectRef.current?.focus();
  };

  useImperativeHandle(
    ref,
    () => ({
      focus: focusInnerSelect,
    }),
    [disabled]
  );

  const controlInvalid = useMemo(() => {
    const hasErr = !!errors && Object.keys(errors).length > 0;
    if (!hasErr) return false;

    // Angular parity:
    // - if submitted is provided: show invalid only when submitted
    // - otherwise: show invalid when touched or dirty
    if (submitted !== undefined) return !!submitted;
    return !!touched || !!dirty;
  }, [errors, submitted, touched, dirty]);

  const required = useMemo(
    () => isControlRequired({ errors: errors ?? undefined, errorMessage }),
    [errors, errorMessage]
  );

  const resolvedErrorText = useMemo(
    () =>
      resolveControlErrorMessage({
        errors: errors ?? undefined,
        label,
        errorMessage,
      }),
    [errors, label, errorMessage]
  );

  return (
    <i-fc-select {...hostProps} className={className as any}>
      {label ? (
        <label className="i-fc-select__label" onClick={focusInnerSelect}>
          {label} :
          {required ? <span className="i-fc-select__required">*</span> : null}
        </label>
      ) : null}

      <ISelect<T>
        ref={(api) => {
          innerSelectRef.current = api ?? null;
        }}
        disabled={disabled}
        invalid={invalid || controlInvalid}
        placeholder={placeholder}
        options={options}
        options$={options$}
        displayWith={displayWith}
        filterDelay={filterDelay}
        filterPredicate={filterPredicate as any}
        panelPosition={panelPosition}
        portalToBody={portalToBody}
        panelOffset={panelOffset}
        matchTriggerWidth={matchTriggerWidth}
        renderOption={renderOption}
        value={value}
        // ✅ IMPORTANT: never pass null as defaultValue into JSX typing
        defaultValue={defaultValue ?? undefined}
        onChange={onChange}
        onOptionSelected={onOptionSelected}
      />

      {controlInvalid && resolvedErrorText ? (
        <div className="i-fc-select__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-select>
  );
}) as <T = any>(
  props: IFCSelectProps<T> & { ref?: React.Ref<IFCSelectHandle> }
) => JSX.Element;
