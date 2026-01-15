import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IButton } from '../button';
import {
  IInput,
  type IInputAddonButton,
  type IInputAddons,
  type IInputMask,
} from '../input';
import { ISelect, type ISelectChange } from '../select';
import type { IFormControlErrorMessage } from '../shared/form.types';

// -----------------------------
// Types
// -----------------------------

type IDatepickerDay = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

type IMonthOption = { value: number; label: string };

export type IDatepickerPanelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

export type IDatepickerProps = React.HTMLAttributes<HTMLElement> & {
  placeholder?: string;
  disabled?: boolean;

  /** purely visual invalid state */
  invalid?: boolean;

  /** display / parse format: supports yyyy, MM, dd */
  format?: string;

  panelPosition?: IDatepickerPanelPosition;

  /** Date model */
  value?: Date | null;

  /** React callback */
  onChange?: (value: Date | null) => void;

  /** optional open state changes */
  onOpenChange?: (open: boolean) => void;
};

// -----------------------------
// Utils
// -----------------------------

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateByFormat(date: Date, fmt: string): string {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return (fmt || 'dd/MM/yyyy')
    .replace(/yyyy/g, yyyy)
    .replace(/MM/g, MM)
    .replace(/dd/g, dd);
}

/**
 * Lightweight parser that maps numeric parts into yyyy/MM/dd tokens order.
 * (Works well with dd/MM/yyyy, yyyy-MM-dd, etc.)
 */
function parseInputDate(value: string, fmt: string): Date | null {
  if (!value) return null;

  const format = fmt || 'yyyy-MM-dd';

  const parts = value.match(/\d+/g);
  if (!parts || parts.length < 3) return null;

  const tokens = format.match(/(yyyy|MM|dd)/g) || ['yyyy', 'MM', 'dd'];

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

  // keep your semantics: 0 or undefined => invalid
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return startOfDay(date);
}

function panelPositionClass(
  panelPosition: IDatepickerPanelPosition | undefined
): string {
  const value = (panelPosition || 'bottom left').trim();
  const normalized = value.replace(/\s+/g, '-');
  return `i-datepicker-panel--${normalized}`;
}

// -----------------------------
// Constants
// -----------------------------

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

// -----------------------------
// Component
// -----------------------------

export function IDatepicker(props: IDatepickerProps) {
  const {
    placeholder = '',
    disabled = false,
    invalid = false,
    format = 'dd/MM/yyyy',
    panelPosition = 'bottom left',
    value = null,
    onChange,
    onOpenChange,
    ...hostProps
  } = props;

  const hostRef = useRef<HTMLElement | null>(null);
  const inputElRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  // input text shown to user (controlled by typing OR external value)
  const [displayText, setDisplayText] = useState<string>(() =>
    value ? formatDateByFormat(startOfDay(value), format) : ''
  );

  // calendar view (month/year)
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewYear, setViewYear] = useState<number>(() =>
    value ? value.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    value ? value.getMonth() : today.getMonth()
  );

  const [years, setYears] = useState<number[]>(() => {
    const focusYear = value ? value.getFullYear() : today.getFullYear();
    const start = focusYear - 50;
    const end = focusYear + 10;
    const arr: number[] = [];
    for (let y = start; y <= end; y++) arr.push(y);
    return arr;
  });

  const ensureYearRange = useCallback((focusYear: number) => {
    setYears((prev) => {
      if (
        prev.length &&
        focusYear >= prev[0] &&
        focusYear <= prev[prev.length - 1]
      ) {
        return prev;
      }
      const start = focusYear - 50;
      const end = focusYear + 10;
      const arr: number[] = [];
      for (let y = start; y <= end; y++) arr.push(y);
      return arr;
    });
  }, []);

  const updateViewFromDate = useCallback(
    (d: Date) => {
      const sd = startOfDay(d);
      const y = sd.getFullYear();
      const m = sd.getMonth();
      setViewYear(y);
      setViewMonth(m);
      ensureYearRange(y);
    },
    [ensureYearRange]
  );

  // sync display + view from external value changes
  useEffect(() => {
    if (value) {
      const d = startOfDay(value);
      setDisplayText(formatDateByFormat(d, format));
      updateViewFromDate(d);
    } else {
      // keep input empty when controlled value is null
      setDisplayText('');
      updateViewFromDate(today);
    }
  }, [value, format, updateViewFromDate, today]);

  // ✅ Keep Angular ngOnInit-like behavior:
  // If empty on mount, show today visually (but DO NOT call onChange)
  useEffect(() => {
    if (!value && !displayText) {
      setDisplayText(formatDateByFormat(today, format));
      updateViewFromDate(today);
    }
    // run once (Angular-ish)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weeks: IDatepickerDay[][] = useMemo(() => {
    const year = viewYear;
    const month = viewMonth;

    const firstOfMonth = new Date(year, month, 1);
    const startDay = (firstOfMonth.getDay() + 6) % 7; // Monday=0
    const startDate = new Date(year, month, 1 - startDay);

    const selected = value ? startOfDay(value) : null;

    const out: IDatepickerDay[][] = [];
    const cur = new Date(startDate);

    for (let w = 0; w < 6; w++) {
      const row: IDatepickerDay[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(cur);
        row.push({
          date,
          inCurrentMonth: date.getMonth() === month,
          isToday: isSameDate(date, today),
          isSelected: selected ? isSameDate(date, selected) : false,
        });
        cur.setDate(cur.getDate() + 1);
      }
      out.push(row);
    }

    return out;
  }, [viewYear, viewMonth, value, today]);

  const monthSelected = useMemo(
    () => MONTHS.find((m) => m.value === viewMonth) ?? null,
    [viewMonth]
  );

  const mask: IInputMask = useMemo(() => ({ type: 'date', format }), [format]);

  const focusInput = useCallback(() => {
    inputElRef.current?.focus();
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      setIsOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const toggleOpen = useCallback(() => {
    if (disabled) return;

    if (!isOpen) {
      // when opening, sync calendar from current typed text
      if (displayText) {
        const parsed = parseInputDate(displayText, format);
        updateViewFromDate(parsed ?? today);
      } else if (value) {
        updateViewFromDate(startOfDay(value));
      } else {
        updateViewFromDate(today);
      }
    }

    setOpen(!isOpen);
  }, [
    disabled,
    isOpen,
    displayText,
    format,
    value,
    setOpen,
    updateViewFromDate,
    today,
  ]);

  const handleTypedInput = useCallback(
    (raw: string) => {
      setDisplayText(raw);

      const parsed = parseInputDate(raw, format);
      if (parsed) {
        updateViewFromDate(parsed);
        onChange?.(parsed);
      } else {
        onChange?.(null);
      }
    },
    [format, onChange, updateViewFromDate]
  );

  const selectDay = useCallback(
    (day: IDatepickerDay) => {
      if (disabled) return;

      const selected = startOfDay(day.date);
      setDisplayText(formatDateByFormat(selected, format));
      onChange?.(selected);

      updateViewFromDate(selected);
      setOpen(false);
    },
    [disabled, format, onChange, setOpen, updateViewFromDate]
  );

  const prevMonth = useCallback(() => {
    let y = viewYear;
    let m = viewMonth;

    if (m === 0) {
      m = 11;
      y = y - 1;
    } else {
      m = m - 1;
    }

    setViewYear(y);
    setViewMonth(m);
    ensureYearRange(y);
  }, [viewYear, viewMonth, ensureYearRange]);

  const nextMonth = useCallback(() => {
    let y = viewYear;
    let m = viewMonth;

    if (m === 11) {
      m = 0;
      y = y + 1;
    } else {
      m = m + 1;
    }

    setViewYear(y);
    setViewMonth(m);
    ensureYearRange(y);
  }, [viewYear, viewMonth, ensureYearRange]);

  const onMonthChange = useCallback((change: ISelectChange<IMonthOption>) => {
    const row = change.value;
    if (!row) return;

    const month = row.value;
    if (!Number.isInteger(month) || month < 0 || month > 11) return;

    setViewMonth(month);
  }, []);

  const onYearChange = useCallback(
    (change: ISelectChange<number>) => {
      const year = change.value;
      if (year === null) return; // ✅ important
      if (!Number.isInteger(year)) return;

      setViewYear(year);
      ensureYearRange(year);
    },
    [ensureYearRange]
  );

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      const host = hostRef.current;
      if (!host) return;

      if (target && !host.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [isOpen, setOpen]);

  const appendAddon: IInputAddonButton = useMemo(
    () => ({
      type: 'button',
      icon: 'calendar',
      visible: true,
      variant: 'primary',
      onClick: () => {
        toggleOpen();
        focusInput();
      },
    }),
    [toggleOpen, focusInput]
  );

  const append: IInputAddons = appendAddon;

  return (
    <i-datepicker
      {...hostProps}
      ref={(el) => {
        hostRef.current = el as unknown as HTMLElement;
      }}>
      <IInput
        append={append}
        mask={mask}
        invalid={invalid}
        placeholder={placeholder}
        readonly={disabled}
        value={displayText}
        inputRef={inputElRef}
        onInput={(e) => handleTypedInput((e.target as HTMLInputElement).value)}
      />

      {isOpen ? (
        <div
          className={[
            'i-datepicker-panel',
            panelPositionClass(panelPosition),
          ].join(' ')}>
          <div className="i-datepicker-header">
            <IButton icon="prev" size="xs" onClick={prevMonth} />

            <ISelect<IMonthOption>
              className="i-date-picker-month-select"
              options={MONTHS}
              value={monthSelected}
              onOptionSelected={onMonthChange}
            />

            <ISelect<number>
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
              <div key={wi} className="i-datepicker-week">
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
        </div>
      ) : null}
    </i-datepicker>
  );
}

// -----------------------------
// FC wrapper (same pattern as fc-select)
// -----------------------------

function resolveErrorMessage(
  label: string,
  errorKey: string,
  errorMessage?: IFormControlErrorMessage
): string | null {
  const tpl = errorMessage?.[errorKey];
  if (!tpl) return null;
  return tpl.replaceAll('{label}', label || 'This field');
}

export type IFCDatepickerProps = React.HTMLAttributes<HTMLElement> & {
  label?: string;
  placeholder?: string;
  format?: string;
  panelPosition?: IDatepickerPanelPosition;

  value?: Date | null;
  onChange?: (v: Date | null) => void;

  disabled?: boolean;

  /** React-style validation */
  required?: boolean;
  invalid?: boolean;

  /** Angular-like template map (same as fc-select) */
  errorMessage?: IFormControlErrorMessage;

  /** which key to render when invalid (default: 'required') */
  errorKey?: string;
};

export function IFCDatepicker(props: IFCDatepickerProps) {
  const {
    label = '',
    placeholder = '',
    format = 'dd/MM/yyyy',
    panelPosition = 'bottom left',
    value = null,
    onChange,
    disabled = false,

    required = false,
    invalid = false,
    errorMessage,
    errorKey = 'required',

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
    <i-fc-datepicker {...hostProps}>
      {label ? (
        <label className="i-fc-datepicker__label">
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
        onChange={onChange}
      />

      {invalid && resolvedErrorText ? (
        <div className="i-fc-datepicker__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-datepicker>
  );
}
