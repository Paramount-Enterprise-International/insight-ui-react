import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IButton } from '../button';
import { IInput, type IInputAddonButton, type IInputMask } from '../input';
import { ISelect, type ISelectChange } from '../select';
import type { IFormControlErrorMessage } from '../shared/form.types';

/* =========================================
 * Types (match Angular)
 * ========================================= */

export type IDatepickerPanelPosition =
  | 'bottom left'
  | 'bottom right'
  | 'top left'
  | 'top right';

type IMonthOption = { value: number; label: string };

type IDatepickerDay = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type IDatepickerProps = React.HTMLAttributes<HTMLElement> & {
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  format?: string;
  panelPosition?: IDatepickerPanelPosition;

  /** Angular parity: accepts Date | string | null */
  value?: Date | string | null;

  /** Angular parity event name */
  onChanged?: (value: Date | null) => void;
};

export type IFCDatepickerProps = React.HTMLAttributes<HTMLElement> & {
  label?: string;
  placeholder?: string;
  format?: string;
  panelPosition?: IDatepickerPanelPosition;

  value?: Date | string | null;
  onChanged?: (v: Date | null) => void;

  disabled?: boolean;

  /** React-style validation (Angular derives from forms) */
  required?: boolean;
  invalid?: boolean;

  /** Angular-like template map */
  errorMessage?: IFormControlErrorMessage;

  /** which key to render when invalid (default: 'required') */
  errorKey?: string;
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

function noop(): void {}

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
  if (typeof value === 'string' && value.trim()) {
    return parseInputDate(value.trim(), format);
  }
  return null;
}

function panelPositionClass(
  panelPosition: IDatepickerPanelPosition | undefined
): string {
  const value = (panelPosition || 'bottom left').trim();
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
      const date = new Date(current);
      const inCurrentMonth = date.getMonth() === viewMonth;

      row.push({
        date,
        inCurrentMonth,
        isToday: isSameDate(date, today),
        isSelected: selectedDay ? isSameDate(date, selectedDay) : false,
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
    value = null,
    onChanged = noop,
    className,
    ...rest
  } = props;

  const hostRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [modelValue, setModelValue] = useState<Date | null>(null);
  const [displayText, setDisplayText] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [years, setYears] = useState<number[]>([]);

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

  // Cache the real <input> inside <i-input> (Angular queries DOM too)
  const refreshInputRef = useCallback(() => {
    const host = hostRef.current;
    const input = host?.querySelector?.(
      'i-input input'
    ) as HTMLInputElement | null;
    if (input) inputRef.current = input;
  }, []);

  // writeValue parity
  useEffect(() => {
    const next = normalizeToDate(value, format);

    setModelValue(next);
    setDisplayText(next ? formatDateLocal(next, format) : '');

    const baseDate =
      next ?? parseInputDate(displayText, format) ?? startOfDay(new Date());

    setViewYear(baseDate.getFullYear());
    setViewMonth(baseDate.getMonth());
    setYears((prev) => ensureYearRange(baseDate.getFullYear(), prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format]);

  // ngOnInit parity: default to today visually
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

  // Ensure we can focus input after mount and whenever popup toggles
  useEffect(() => {
    refreshInputRef();
  }, [refreshInputRef, isOpen, displayText]);

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

  const toggleOpen = useCallback(() => {
    if (disabled) return;

    setIsOpen((prev) => {
      const next = !prev;

      if (next) {
        refreshInputRef();

        const inputVal = inputRef.current?.value ?? '';
        if (inputVal) {
          const parsed = parseInputDate(inputVal, format);
          if (parsed) {
            setModelValue(parsed);
            setDisplayText(formatDateLocal(parsed, format));
          }
        }

        initViewFromModel();
      }

      return next;
    });
  }, [disabled, format, initViewFromModel, refreshInputRef]);

  const appendAddon: IInputAddonButton = useMemo(
    () => ({
      type: 'button',
      icon: 'calendar',
      visible: true,
      variant: 'primary',
      onClick: (): void => {
        toggleOpen();
        refreshInputRef();
        inputRef.current?.focus();
      },
    }),
    [refreshInputRef, toggleOpen]
  );

  const handleInput = useCallback(
    (raw: string) => {
      setDisplayText(raw);

      const parsed = parseInputDate(raw, format);
      setModelValue(parsed);

      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
        setYears((p) => ensureYearRange(parsed.getFullYear(), p));
      }

      onChanged(parsed);
    },
    [format, onChanged]
  );

  // outside click close
  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const host = hostRef.current;
      if (host && target && !host.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isOpen]);

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

  const onMonthChange = useCallback((change: ISelectChange<any>) => {
    const row = change?.value;
    if (!row) return;

    const month =
      typeof row === 'object' && row && 'value' in row
        ? (row as IMonthOption).value
        : row;

    if (typeof month !== 'number') return;
    if (month < 0 || month > 11) return;

    setViewMonth(month);
  }, []);

  const onYearChange = useCallback((change: ISelectChange<number>) => {
    const year = change.value;
    if (typeof year !== 'number') return;

    setViewYear(year);
    setYears((p) => ensureYearRange(year, p));
  }, []);

  const selectDay = useCallback(
    (day: IDatepickerDay) => {
      if (disabled) return;

      const selected = startOfDay(day.date);

      setModelValue(selected);
      setDisplayText(formatDateLocal(selected, format));

      onChanged(selected);

      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setYears((p) => ensureYearRange(selected.getFullYear(), p));

      setIsOpen(false);
    },
    [disabled, format, onChanged]
  );

  useEffect(() => {
    setYears((p) =>
      ensureYearRange(viewYear || startOfDay(new Date()).getFullYear(), p)
    );
  }, [viewYear]);

  return (
    <i-datepicker
      ref={(el) => {
        hostRef.current = el as any;
        refreshInputRef();
      }}
      className={className}
      {...rest}>
      <IInput
        append={appendAddon}
        mask={dateMask}
        invalid={invalid}
        placeholder={placeholder}
        readonly={disabled}
        value={displayText}
        onInput={(e) =>
          handleInput((e.currentTarget as HTMLInputElement).value ?? '')
        }
        onBlur={() => {
          // Angular calls onTouched; no external callback here (parity is fine)
        }}
      />

      {isOpen ? (
        <div
          className={[
            'i-datepicker-panel',
            panelPositionClass(panelPosition),
          ].join(' ')}>
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
        </div>
      ) : null}
    </i-datepicker>
  );
}

/* =========================================
 * IFCDatepicker
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
    value = null,
    onChanged = noop,
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
    input?.focus();
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
      />

      {invalid && resolvedErrorText ? (
        <div className="i-fc-datepicker__error">{resolvedErrorText}</div>
      ) : null}
    </i-fc-datepicker>
  );
}
