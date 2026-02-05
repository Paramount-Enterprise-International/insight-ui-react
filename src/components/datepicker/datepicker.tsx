/* datepicker.tsx */
/**
 * IDatepicker (React)
 * Version: 1.5.5
 *
 * Fixes (1.5.5):
 * - Fix portaled panel stuck hidden (visibility:hidden) by adding open-cycle + failsafe unhide.
 * - Make panel visibility/pointerEvents always explicit (no conditional style merge).
 *
 * (All your existing "smart controlled" fixes preserved.)
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { IButton } from '../button';
import { IInput, type IInputAddonButton, type IInputMask } from '../input';
import { ISelect, type ISelectChange } from '../select';
import type { IFormControlErrorMessage } from '../shared/form.types';

/* =========================================
 * Types (match Angular)
 * ========================================= */

export type IDatepickerPanelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

type IMonthOption = { value: number; label: string };

type IDatepickerDay = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type IDatepickerProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange' | 'children'
> & {
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;

  format?: string;
  panelPosition?: IDatepickerPanelPosition;

  portalToBody?: boolean;
  matchTriggerWidth?: boolean;
  panelOffset?: number;

  /** Angular parity: accepts Date | string | null */
  value?: Date | string | null;

  /** Angular parity event name */
  onChanged?: (value: Date | null) => void;
};

export type IFCDatepickerProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange' | 'children'
> & {
  label?: string;
  placeholder?: string;
  format?: string;
  panelPosition?: IDatepickerPanelPosition;

  portalToBody?: boolean;
  matchTriggerWidth?: boolean;
  panelOffset?: number;

  value?: Date | string | null;
  onChange?: (v: Date | null) => void;

  disabled?: boolean;

  /** React-side validation flags */
  required?: boolean;
  invalid?: boolean;

  errorMessage?: IFormControlErrorMessage;
  errorKey?: string; // default 'required'
};

/* =========================================
 * Constants (match Angular)
 * ========================================= */

const MONTHS: IMonthOption[] = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function noop(): void {
  /**/
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateKey(d: Date | null): string | null {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseInputDate(value: string, format: string): Date | null {
  if (!value) return null;

  const fmt = format || 'yyyy-MM-dd';
  const parts = value.match(/\d+/g);
  if (!parts || parts.length < 3) return null;

  const tokens = fmt.match(/(yyyy|MM|dd)/g) || ['yyyy', 'MM', 'dd'];

  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;

  tokens.forEach((t, idx) => {
    const p = parts[idx];
    if (!p) return;

    const n = Number(p);
    if (t === 'yyyy') year = n;
    else if (t === 'MM') month = n;
    else if (t === 'dd') day = n;
  });

  if (!year || !month || !day) return null;

  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }

  return startOfDay(d);
}

function formatDateLocal(date: Date, format: string): string {
  const fmt = format || 'yyyy-MM-dd';

  const yyyy = String(date.getFullYear());
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return fmt.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd);
}

function normalizeToDate(
  value: Date | string | null | undefined,
  format: string
): Date | null {
  if (value instanceof Date) return startOfDay(value);
  if (typeof value === 'string' && value.trim())
    return parseInputDate(value.trim(), format);
  return null;
}

function panelPositionClass(pos: IDatepickerPanelPosition | undefined): string {
  const value = (pos || 'bottom left').trim();
  const normalized = value.replace(/\s+/g, '-');
  return `i-datepicker-panel--${normalized}`;
}

function ensureYearRange(focusYear: number, currentYears: number[]): number[] {
  if (
    !currentYears.length ||
    focusYear < currentYears[0] ||
    focusYear > currentYears[currentYears.length - 1]
  ) {
    const start = focusYear - 50;
    const end = focusYear + 10;
    const arr: number[] = [];
    for (let y = start; y <= end; y++) arr.push(y);
    return arr;
  }
  return currentYears;
}

function buildCalendar(
  viewYear: number,
  viewMonth: number,
  selected: Date | null
): IDatepickerDay[][] {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);

  // Monday = 0 (Angular: (getDay()+6)%7)
  const startDay = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(viewYear, viewMonth, 1 - startDay);

  const weeks: IDatepickerDay[][] = [];
  const current = new Date(startDate);

  const today = startOfDay(new Date());
  const selectedDay = selected ? startOfDay(selected) : null;

  for (let w = 0; w < 6; w++) {
    const row: IDatepickerDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(current);
      const inCurrentMonth = d.getMonth() === viewMonth;

      row.push({
        date: d,
        inCurrentMonth,
        isToday: isSameDate(d, today),
        isSelected: selectedDay ? isSameDate(d, selectedDay) : false,
      });

      current.setDate(current.getDate() + 1);
    }
    weeks.push(row);
  }

  return weeks;
}

/* =========================================
 * IDatepicker
 * ========================================= */

export function IDatepicker(props: IDatepickerProps) {
  const {
    placeholder = '',
    disabled = false,
    invalid = false,

    format = 'dd/MM/yyyy',
    panelPosition = 'bottom left',

    portalToBody = true,
    matchTriggerWidth = true,
    panelOffset = 6,

    value = null,
    onChanged = noop,

    className,
    ...rest
  } = props;

  const hostRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const inputElRef = useRef<HTMLInputElement | null>(null);

  const rafRef = useRef<number>(0);
  const listeningGlobalRef = useRef(false);

  const [modelValue, setModelValue] = useState<Date | null>(null);
  const [displayText, setDisplayText] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [years, setYears] = useState<number[]>([]);

  // flicker guard: hide panel until positioned
  const [panelHidden, setPanelHidden] = useState(false);
  const wantsOpenRef = useRef(false);

  // ✅ open-cycle + failsafe unhide (same as ISelect fix)
  const openSeqRef = useRef(0);
  const unhideTimerRef = useRef<number | null>(null);

  // ✅ smart controlled echo suppression
  const isEditingRef = useRef(false);
  const lastEmittedKeyRef = useRef<string | null>(null);

  const weeks = useMemo(
    () => buildCalendar(viewYear, viewMonth, modelValue),
    [viewYear, viewMonth, modelValue]
  );

  const monthSelected = useMemo(
    () => MONTHS.find((m) => m.value === viewMonth) ?? null,
    [viewMonth]
  );

  const dateMask: IInputMask = useMemo(
    () => ({ type: 'date', format }),
    [format]
  );

  // cleanup timers
  useEffect(() => {
    return () => {
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }
    };
  }, []);

  // -------- DOM helpers --------
  const refreshInnerInputRef = useCallback(() => {
    const host = hostRef.current;
    const el = host?.querySelector?.(
      'i-input input'
    ) as HTMLInputElement | null;
    if (el) inputElRef.current = el;
  }, []);

  const getPanelEl = () => panelRef.current;

  const getAnchorRect = (): DOMRect | null => {
    const host = hostRef.current;
    if (!host) return null;

    const iInput = host.querySelector('i-input') as HTMLElement | null;
    if (iInput?.getBoundingClientRect) return iInput.getBoundingClientRect();

    return (host as any).getBoundingClientRect?.() ?? null;
  };

  // -------- writeValue parity (SMART) --------
  useEffect(() => {
    const next = normalizeToDate(value, format);
    const nextKey = dateKey(next);

    // ✅ ignore "echo" while user is typing
    if (isEditingRef.current && nextKey === lastEmittedKeyRef.current) {
      setModelValue(next);
      return;
    }

    setModelValue(next);
    setDisplayText(next ? formatDateLocal(next, format) : '');

    const base = next ?? startOfDay(new Date());
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYears((prev) => ensureYearRange(base.getFullYear(), prev));
  }, [value, format]);

  // ngOnInit parity: default visual today (only if truly blank on mount)
  useEffect(() => {
    if (!modelValue && !displayText) {
      const today = startOfDay(new Date());
      setModelValue(today);
      setDisplayText(formatDateLocal(today, format));
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
      setYears((p) => ensureYearRange(today.getFullYear(), p));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!viewYear) return;
    setYears((p) => ensureYearRange(viewYear, p));
  }, [viewYear]);

  // -------- input safety sync --------
  const syncFromInnerInputSafely = useCallback(() => {
    refreshInnerInputRef();
    const input = inputElRef.current;
    if (!input) return;

    const raw = (input.value ?? '').trim();
    if (!raw) return; // never wipe
    const parsed = parseInputDate(raw, format);
    if (!parsed) return; // partial typing shouldn't wipe

    setModelValue(parsed);
    setDisplayText(formatDateLocal(parsed, format));
  }, [format, refreshInnerInputRef]);

  const initViewFromModel = useCallback(() => {
    let base: Date;

    if (modelValue) base = startOfDay(modelValue);
    else if (displayText)
      base = parseInputDate(displayText, format) ?? startOfDay(new Date());
    else base = startOfDay(new Date());

    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setYears((p) => ensureYearRange(base.getFullYear(), p));
  }, [displayText, format, modelValue]);

  // -------- positioning / portal --------
  const repositionPanelNow = useCallback(() => {
    if (!wantsOpenRef.current) return;

    const panel = getPanelEl();
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

      const maxH = Math.max(120, vh - top - gap);
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

      const maxH = Math.max(120, vh - top - gap);
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

    const maxH = Math.max(120, side === 'bottom' ? spaceBelow : spaceAbove);
    panel.style.maxHeight = `${Math.floor(maxH)}px`;

    const top =
      side === 'bottom'
        ? rect.bottom + panelOffset
        : rect.top - panelRect.height - panelOffset;

    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }, [matchTriggerWidth, panelOffset, panelPosition]);

  const scheduleReposition = useCallback(
    (after?: () => void) => {
      if (!wantsOpenRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        repositionPanelNow();
        after?.();
      });
    },
    [repositionPanelNow]
  );

  const addGlobalListeners = useCallback(() => {
    if (listeningGlobalRef.current) return;

    const onAnyScroll = () => scheduleReposition();
    const onResize = () => scheduleReposition();

    window.addEventListener('scroll', onAnyScroll, true);
    document.addEventListener('scroll', onAnyScroll, true);
    window.addEventListener('resize', onResize, true);

    (addGlobalListeners as any)._rm = () => {
      window.removeEventListener('scroll', onAnyScroll, true);
      document.removeEventListener('scroll', onAnyScroll, true);
      window.removeEventListener('resize', onResize, true);
    };

    listeningGlobalRef.current = true;
  }, [scheduleReposition]);

  const removeGlobalListeners = useCallback(() => {
    if (!listeningGlobalRef.current) return;

    const rm = (addGlobalListeners as any)._rm as undefined | (() => void);
    if (rm) rm();
    delete (addGlobalListeners as any)._rm;

    listeningGlobalRef.current = false;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, [addGlobalListeners]);

  const openPanel = useCallback(() => {
    if (disabled) return;
    if (isOpen) return;
    setIsOpen(true);
  }, [disabled, isOpen]);

  const closePanel = useCallback(
    (skipCleanupStyles = false) => {
      wantsOpenRef.current = false;
      setIsOpen(false);

      // clear open-cycle timers
      if (unhideTimerRef.current) {
        window.clearTimeout(unhideTimerRef.current);
        unhideTimerRef.current = null;
      }

      removeGlobalListeners();

      const panel = getPanelEl();
      if (panel && !skipCleanupStyles) {
        panel.style.position = '';
        panel.style.zIndex = '';
        panel.style.left = '';
        panel.style.top = '';
        panel.style.width = '';
        panel.style.maxHeight = '';
        panel.style.overflowY = '';
        panel.style.boxSizing = '';
        panel.style.visibility = '';
        panel.style.pointerEvents = '';
        panel.classList.remove('i-datepicker-panel--portaled');
      }

      setPanelHidden(false);
    },
    [removeGlobalListeners]
  );

  // ✅ open-cycle: hide → reposition → show, with failsafe unhide
  useLayoutEffect(() => {
    if (!isOpen) return;

    wantsOpenRef.current = true;
    const seq = ++openSeqRef.current;

    refreshInnerInputRef();
    setPanelHidden(true);

    const panel = getPanelEl();
    if (panel && portalToBody)
      panel.classList.add('i-datepicker-panel--portaled');

    addGlobalListeners();

    scheduleReposition(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    });

    // ✅ failsafe: always unhide next tick if still open
    if (unhideTimerRef.current) window.clearTimeout(unhideTimerRef.current);
    unhideTimerRef.current = window.setTimeout(() => {
      if (!wantsOpenRef.current) return;
      if (seq !== openSeqRef.current) return;
      setPanelHidden(false);
    }, 0);

    return () => {
      // mark this open-cycle invalid
      // (closePanel also clears timers + resets state)
      wantsOpenRef.current = false;
    };
  }, [
    addGlobalListeners,
    isOpen,
    portalToBody,
    refreshInnerInputRef,
    scheduleReposition,
  ]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    scheduleReposition();
  }, [
    isOpen,
    scheduleReposition,
    viewMonth,
    viewYear,
    panelPosition,
    matchTriggerWidth,
    panelOffset,
  ]);

  // -------- events --------
  const appendAddon: IInputAddonButton = useMemo(
    () => ({
      type: 'button',
      icon: 'calendar',
      visible: true,
      variant: 'primary',
      onClick: () => {
        if (disabled) return;

        if (!isOpen) {
          syncFromInnerInputSafely();
          initViewFromModel();
          openPanel();
        } else {
          closePanel();
        }

        refreshInnerInputRef();
        inputElRef.current?.focus?.();
      },
    }),
    [
      closePanel,
      disabled,
      initViewFromModel,
      isOpen,
      openPanel,
      refreshInnerInputRef,
      syncFromInnerInputSafely,
    ]
  );

  const handleInput = useCallback(
    (raw: string) => {
      setDisplayText(raw);

      const trimmed = raw.trim();

      // allow clear
      if (!trimmed) {
        setModelValue(null);
        lastEmittedKeyRef.current = null;
        onChanged(null);

        if (isOpen) scheduleReposition();
        return;
      }

      const parsed = parseInputDate(trimmed, format);

      // partial/invalid typing should NOT wipe external value
      if (!parsed) {
        if (isOpen) scheduleReposition();
        return;
      }

      setModelValue(parsed);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
      setYears((p) => ensureYearRange(parsed.getFullYear(), p));

      lastEmittedKeyRef.current = dateKey(parsed);
      onChanged(parsed);

      if (isOpen) scheduleReposition();
    },
    [format, isOpen, onChanged, scheduleReposition]
  );

  const selectDay = useCallback(
    (day: IDatepickerDay) => {
      if (disabled) return;

      const selected = startOfDay(day.date);

      setModelValue(selected);
      setDisplayText(formatDateLocal(selected, format));

      lastEmittedKeyRef.current = dateKey(selected);
      onChanged(selected);

      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setYears((p) => ensureYearRange(selected.getFullYear(), p));

      closePanel();
    },
    [closePanel, disabled, format, onChanged]
  );

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => {
          const ny = y - 1;
          setYears((p) => ensureYearRange(ny, p));
          return ny;
        });
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => {
          const ny = y + 1;
          setYears((p) => ensureYearRange(ny, p));
          return ny;
        });
        return 0;
      }
      return m + 1;
    });
  }, []);

  const onMonthChange = useCallback(
    (change: ISelectChange<any>) => {
      const row = change?.value;
      if (!row) return;

      const month =
        typeof row === 'object' && row && 'value' in row
          ? (row as IMonthOption).value
          : row;

      if (typeof month !== 'number' || month < 0 || month > 11) return;
      setViewMonth(month);

      if (wantsOpenRef.current) scheduleReposition();
    },
    [scheduleReposition]
  );

  const onYearChange = useCallback(
    (change: ISelectChange<number>) => {
      const year = change.value;
      if (typeof year !== 'number') return;

      setViewYear(year);
      setYears((p) => ensureYearRange(year, p));

      if (wantsOpenRef.current) scheduleReposition();
    },
    [scheduleReposition]
  );

  // input events bubble (month/year ISelect inner inputs)
  const onHostInputCapture: React.FormEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement | null;
    const dateInput = inputElRef.current;
    if (!dateInput) return;

    if (target !== dateInput) return;
    handleInput(dateInput.value ?? '');
  };

  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (event: MouseEvent) => {
      if (!wantsOpenRef.current) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const host = hostRef.current;
      const panel = panelRef.current;

      const insideHost = !!host && host.contains(target);
      const insidePanel = !!panel && panel.contains(target);

      if (insideHost || insidePanel) return;

      closePanel();
    };

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [closePanel, isOpen]);

  useEffect(() => {
    return () => {
      closePanel(true);
    };
  }, [closePanel]);

  const panelNode = (
    <i-datepicker-panel
      ref={(el) => {
        panelRef.current = el as any;
      }}
      className={[
        'i-datepicker-panel',
        panelPositionClass(panelPosition),
        portalToBody ? 'i-datepicker-panel--portaled' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        display: isOpen ? '' : 'none',
        visibility: panelHidden ? 'hidden' : 'visible',
        pointerEvents: panelHidden ? 'none' : 'auto',
      }}>
      <div className="i-datepicker-header">
        <IButton icon="prev" size="xs" onClick={prevMonth} />

        <ISelect
          className="i-date-picker-month-select"
          options={MONTHS}
          value={monthSelected}
          onOptionSelected={onMonthChange}
        />

        <ISelect
          className="i-date-picker-year-select"
          options={years}
          value={viewYear}
          onOptionSelected={onYearChange}
        />

        <IButton icon="next" size="xs" onClick={nextMonth} />
      </div>

      <div className="i-datepicker-weekdays">
        {WEEKDAYS.map((w) => (
          <small key={w}>{w}</small>
        ))}
      </div>

      <div className="i-datepicker-weeks">
        {weeks.map((week, wi) => (
          <div className="i-datepicker-week" key={`w-${wi}`}>
            {week.map((d) => (
              <div
                key={d.date.getTime()}
                className={[
                  'i-datepicker-day',
                  d.inCurrentMonth ? 'current-month' : null,
                  d.isSelected ? 'selected' : null,
                  d.isToday && !d.isSelected ? 'today' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => selectDay(d)}>
                {d.date.getDate()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </i-datepicker-panel>
  );

  return (
    <i-datepicker
      ref={(el) => {
        hostRef.current = el as any;
        refreshInnerInputRef();
      }}
      className={className}
      onInput={onHostInputCapture as any}
      {...rest}>
      <IInput
        append={appendAddon}
        mask={dateMask}
        invalid={invalid}
        placeholder={placeholder}
        readonly={disabled}
        value={displayText}
        onFocus={() => {
          isEditingRef.current = true;
        }}
        onBlur={() => {
          isEditingRef.current = false;
        }}
        onInput={() => {
          /* handled via host capture + target check */
        }}
      />

      {portalToBody ? createPortal(panelNode, document.body) : panelNode}
    </i-datepicker>
  );
}

/* =========================================
 * IFCDatepicker (React)
 * ========================================= */

function resolveErrorMessage(
  label: string,
  errorKey: string,
  errorMessage?: IFormControlErrorMessage
): string | null {
  const tpl = errorMessage?.[errorKey];
  if (!tpl) return null;
  return tpl.replaceAll('{label}', label || 'This field');
}

export function IFCDatepicker(props: IFCDatepickerProps) {
  const {
    label = '',
    placeholder = '',
    format = 'dd/MM/yyyy',
    panelPosition = 'bottom left',

    portalToBody = true,
    matchTriggerWidth = true,
    panelOffset = 6,

    value = null,
    onChange: onChanged = noop,

    disabled = false,

    required = false,
    invalid = false,

    errorMessage,
    errorKey = 'required',

    className,
    ...rest
  } = props;

  const hostRef = useRef<HTMLElement | null>(null);

  const resolvedErrorText = useMemo(() => {
    if (!invalid) return null;

    return (
      resolveErrorMessage(label || 'This field', errorKey, errorMessage) ??
      `${label || 'This field'} is invalid`
    );
  }, [invalid, label, errorKey, errorMessage]);

  const focusInnerDatepicker = () => {
    if (disabled) return;

    const input = hostRef.current?.querySelector?.(
      'i-datepicker i-input input'
    ) as HTMLInputElement | null;

    input?.focus?.();
  };

  return (
    <i-fc-datepicker
      ref={(el) => {
        hostRef.current = el as any;
      }}
      className={className}
      {...rest}>
      {label ? (
        <label
          className="i-fc-datepicker__label"
          onClick={focusInnerDatepicker}>
          {label} :{' '}
          {required ? (
            <span className="i-fc-datepicker__required">*</span>
          ) : null}
        </label>
      ) : null}

      <IDatepicker
        disabled={disabled}
        format={format}
        invalid={invalid}
        panelPosition={panelPosition}
        placeholder={placeholder}
        value={value}
        onChanged={onChanged}
        portalToBody={portalToBody}
        matchTriggerWidth={matchTriggerWidth}
        panelOffset={panelOffset}
      />

      {invalid && resolvedErrorText ? (
        <div className="i-fc-datepicker__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-datepicker>
  );
}
