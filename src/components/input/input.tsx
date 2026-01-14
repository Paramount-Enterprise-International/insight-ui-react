// input.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IButton, type IButtonVariant } from '../button';
import { IIcon, type IIconInput } from '../icon';
import { ILoading } from '../loading';

/* =========================================
 * Types: addons
 * ========================================= */

export type IInputAddonKind = 'icon' | 'text' | 'button' | 'link' | 'loading';

export type IInputAddonType = {
  type: IInputAddonKind;
};

export type IInputAddonLoading = {
  type: 'loading';
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonIcon = {
  type: 'icon';
  icon: IIconInput;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonText = {
  type: 'text';
  text: string;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonButton = {
  type: 'button';
  icon: IIconInput;
  onClick?: () => void;
  visible?: boolean;
  variant?: IButtonVariant;
} & IInputAddonType;

export type IInputAddonLink = {
  type: 'link';
  icon: IIconInput;
  href?: string;
  visible?: boolean;
  variant?: IButtonVariant;
} & IInputAddonType;

export type IInputAddons =
  | IInputAddonLoading
  | IInputAddonIcon
  | IInputAddonText
  | IInputAddonButton
  | IInputAddonLink;

/* =========================================
 * IInputAddon
 * ========================================= */

export interface IInputAddonProps extends React.HTMLAttributes<HTMLElement> {
  addon: IInputAddons | undefined;
}

export function IInputAddon(props: IInputAddonProps) {
  const { addon, className, ...rest } = props;

  // Match Angular: render nothing when no addon or visible === false
  if (!addon || addon.visible === false) {
    return null;
  }

  return (
    <i-input-addon className={className} kind={addon.type} {...rest}>
      {addon.type === 'button' ? (
        <IButton
          size="xs"
          type="button"
          icon={addon.icon}
          variant={addon.variant ?? 'primary'}
          onClick={() => addon.onClick?.()}
        />
      ) : addon.type === 'link' ? (
        <a
          className="i-btn i-btn-xs"
          target="_blank"
          rel="noreferrer"
          // keep Angular-ish attr, but TS-safe
          {...({ variant: addon.variant ?? 'primary' } as any)}
          href={addon.href}>
          <IIcon size="xs" icon={addon.icon} />
        </a>
      ) : addon.type === 'icon' ? (
        <IIcon size="sm" icon={addon.icon} />
      ) : addon.type === 'loading' ? (
        <ILoading label="" />
      ) : (
        <span>{addon.text}</span>
      )}
    </i-input-addon>
  );
}

/* =========================================
 * Types: mask
 * ========================================= */

export type IInputMaskType =
  | 'date'
  | 'integer'
  | 'number'
  | 'currency'
  | 'time';

export type IInputMask = {
  type: IInputMaskType;
  format?: string;
};

type UseInputMaskOptions = {
  enableDefault?: boolean;
};

/* =========================================
 * useInputMask
 * ========================================= */

export function useInputMask(
  inputRef: React.RefObject<HTMLInputElement | null>,
  mask: IInputMask | undefined,
  opts: UseInputMaskOptions = {}
) {
  const defaultAppliedRef = useRef(false);
  const enableDefault = opts.enableDefault ?? true;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    // -----------------------------
    // Utils
    // -----------------------------
    const hasMask = () => !!mask && !el.readOnly && !el.disabled;

    const dispatchInputEvent = () => {
      const ev = new Event('input', { bubbles: true });
      el.dispatchEvent(ev);
    };

    const pad = (n: number, len: number) => String(n).padStart(len, '0');

    // Minimal token formatting: dd/MM/yyyy, yyyy-MM-dd, HH:mm, HH:mm:ss
    const formatDateSimple = (d: Date, format: string): string => {
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      return format
        .replace(/yyyy/g, pad(year, 4))
        .replace(/MM/g, pad(month, 2))
        .replace(/dd/g, pad(day, 2));
    };

    const formatTimeSimple = (d: Date, format: string): string => {
      const hour = d.getHours();
      const minute = d.getMinutes();
      const second = d.getSeconds();

      return format
        .replace(/HH/g, pad(hour, 2))
        .replace(/mm/g, pad(minute, 2))
        .replace(/ss/g, pad(second, 2));
    };

    const computeDefaultForMask = (): string | null => {
      if (!mask) return null;
      const now = new Date();

      if (mask.type === 'date') {
        const fmt = mask.format || 'dd/MM/yyyy';
        return formatDateSimple(now, fmt);
      }
      if (mask.type === 'time') {
        const fmt = mask.format || 'HH:mm';
        return formatTimeSimple(now, fmt);
      }
      return null;
    };

    const applyInitialDefaultIfNeeded = () => {
      if (!enableDefault) return;
      if (!mask) return;
      if (defaultAppliedRef.current) return;

      if (el.value && el.value.trim().length > 0) return;

      const def = computeDefaultForMask();
      if (def === null) return;

      defaultAppliedRef.current = true;
      el.value = def;
      dispatchInputEvent();
    };

    const isControlKey = (event: KeyboardEvent): boolean => {
      const key = event.key;
      const controlKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Tab',
        'Home',
        'End',
        'Enter',
        'Escape',
      ];

      if (controlKeys.includes(key)) return true;
      if (event.ctrlKey || event.metaKey || event.altKey) return true;
      return false;
    };

    // ----------------------------------------------------
    // DATE HELPERS
    // ----------------------------------------------------
    const daysInMonth = (year: number, month1Based: number) =>
      new Date(year, month1Based, 0).getDate();

    const splitDateFormat = (
      format: string
    ): { tokens: string[]; seps: string[] } => {
      const tokens: string[] = [];
      const seps: string[] = [];

      let currentSep = '';
      let i = 0;

      const isTokenChar = (c: string): boolean =>
        c === 'd' || c === 'M' || c === 'y';

      while (i < format.length) {
        const c = format[i];

        if (!isTokenChar(c)) {
          currentSep += c;
          i++;
          continue;
        }

        seps.push(currentSep);
        currentSep = '';

        const ch = c;
        let token = ch;
        let j = i + 1;
        while (j < format.length && format[j] === ch) {
          token += format[j];
          j++;
        }

        tokens.push(token);
        i = j;
      }

      seps.push(currentSep);
      return { tokens, seps };
    };

    const getDateSegments = (
      value: string,
      format: string
    ): {
      kind: 'day' | 'month' | 'year';
      start: number;
      end: number;
      raw: string;
    }[] => {
      const { tokens, seps } = splitDateFormat(format);
      const segments: {
        kind: 'day' | 'month' | 'year';
        start: number;
        end: number;
        raw: string;
      }[] = [];

      let pos = 0;

      if (seps[0]) {
        const s0 = seps[0];
        if (value.startsWith(s0)) pos += s0.length;
      }

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const kind: 'day' | 'month' | 'year' =
          ch === 'd' ? 'day' : ch === 'M' ? 'month' : 'year';

        const start = pos;
        let end = pos;

        while (end < value.length && /\d/.test(value[end])) end++;

        const raw = value.slice(start, end);
        segments.push({ kind, start, end, raw });

        pos = end;

        const sep = seps[i + 1] ?? '';
        if (sep && value.substr(pos, sep.length) === sep) pos += sep.length;
      }

      return segments;
    };

    const formatDateFromParts = (
      day: number,
      month: number,
      year: number,
      format: string
    ): string => {
      const { tokens, seps } = splitDateFormat(format);
      let result = seps[0] ?? '';

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;

        if (ch === 'd') result += pad(day, len);
        else if (ch === 'M') result += pad(month, len);
        else {
          let s = String(year);
          if (s.length < len) s = s.padStart(len, '0');
          else if (s.length > len) s = s.slice(-len);
          result += s;
        }

        if (i < tokens.length - 1) result += seps[i + 1] ?? '';
      }

      return result;
    };

    const normalizeDateValue = (value: string, format: string): string => {
      if (!value) return value;

      const segments = getDateSegments(value, format);
      if (!segments.length) return value;

      let day = 1;
      let month = 1;
      let year = 2000;

      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;

        if (seg.kind === 'day') day = n;
        else if (seg.kind === 'month') month = n;
        else year = n;
      }

      if (month < 1) month = 1;
      if (month > 12) month = 12;

      const maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day < 1) day = 1;
      if (day > maxDay) day = maxDay;

      return formatDateFromParts(day, month, year, format);
    };

    const applyNumericMask = (raw: string, allowDecimal: boolean): string => {
      if (!raw) return '';

      let result = '';
      let hasDecimal = false;

      for (const ch of raw) {
        if (/\d/.test(ch)) {
          result += ch;
          continue;
        }

        if (allowDecimal && (ch === '.' || ch === ',')) {
          if (!hasDecimal) {
            hasDecimal = true;
            result += ch;
          }
        }
      }

      return result;
    };

    const applyDateMaskDigitsOnly = (
      digits: string,
      format: string
    ): string => {
      const { tokens, seps } = splitDateFormat(format);
      if (!tokens.length) return digits;

      const firstSep = seps[1] ?? '';
      const secondSep = seps[2] ?? '';

      if (digits.length <= 2) {
        if (digits.length === 2 && firstSep) return digits + firstSep;
        return digits;
      }

      if (digits.length <= 4) {
        const dRaw = digits.slice(0, 2);
        const mRaw = digits.slice(2);

        let res = dRaw;
        if (firstSep) res += firstSep;

        if (mRaw.length) {
          res += mRaw;
          if (mRaw.length === 2 && secondSep) res += secondSep;
        }
        return res;
      }

      const dStr = digits.slice(0, 2);
      const mStr = digits.slice(2, 4);
      const yStr = digits.slice(4, 8);

      let day = Number(dStr || '1');
      let month = Number(mStr || '1');
      const year = Number(yStr || '2000');

      if (month < 1) month = 1;
      if (month > 12) month = 12;

      const maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day < 1) day = 1;
      if (day > maxDay) day = maxDay;

      return formatDateFromParts(day, month, year, format);
    };

    const applyDateMask = (raw: string, format: string): string => {
      if (!raw) return '';

      const hasSeparator = /[^0-9]/.test(raw);
      const { tokens, seps } = splitDateFormat(format);

      if (!tokens.length) return raw.replace(/\D/g, '');

      if (!hasSeparator) {
        const digits = raw.replace(/\D/g, '');
        if (!digits) return '';
        return applyDateMaskDigitsOnly(digits, format);
      }

      const rawSegs = raw.split(/[^0-9]/);
      const rawSeps = raw.match(/[^0-9]+/g) ?? [];

      type PartKind = 'day' | 'month' | 'year';
      type Part = {
        kind: PartKind;
        raw: string;
        len: number;
        closed: boolean;
        out: string;
      };

      const parts: Part[] = [];

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;
        const rawSeg = (rawSegs[i] ?? '').replace(/\D/g, '');

        const kind: PartKind =
          ch === 'd' ? 'day' : ch === 'M' ? 'month' : 'year';
        const closed = rawSeg.length >= len;

        parts.push({ kind, raw: rawSeg.slice(0, len), len, closed, out: '' });
      }

      const dayPart = parts.find((p) => p.kind === 'day');
      const monthPart = parts.find((p) => p.kind === 'month');
      const yearPart = parts.find((p) => p.kind === 'year');

      let monthNumForClamp: number | null = null;
      if (monthPart && monthPart.closed && monthPart.raw) {
        let m = Number(monthPart.raw);
        if (m < 1) m = 1;
        if (m > 12) m = 12;
        monthNumForClamp = m;
      }

      let yearForCalc = 2000;
      if (yearPart && yearPart.closed && yearPart.raw) {
        const y = Number(yearPart.raw);
        yearForCalc = y > 0 ? y : 2000;
      }

      if (monthPart) {
        if (monthPart.closed && monthPart.raw) {
          let m = monthNumForClamp ?? Number(monthPart.raw);
          if (m < 1) m = 1;
          if (m > 12) m = 12;
          monthPart.out = pad(m, monthPart.len);
          monthNumForClamp = m;
        } else monthPart.out = monthPart.raw;
      }

      if (dayPart) {
        if (dayPart.closed && dayPart.raw) {
          let d = Number(dayPart.raw);
          const monthForDay = monthNumForClamp !== null ? monthNumForClamp : 1;
          const maxDay = daysInMonth(yearForCalc, monthForDay);

          if (d < 1) d = 1;
          if (d > maxDay) d = maxDay;

          dayPart.out = pad(d, dayPart.len);
        } else dayPart.out = dayPart.raw;
      }

      if (yearPart) yearPart.out = yearPart.raw;

      const outSegs = parts.map((p) => p.out);
      const hasDigits = parts.map((p) => p.raw.length > 0);

      let result = seps[0] ?? '';
      for (let i = 0; i < parts.length; i++) {
        result += outSegs[i] ?? '';

        if (i < parts.length - 1) {
          const sepFmt = seps[i + 1] ?? '';
          const hadRawSep = i < rawSeps.length;
          const segClosed = parts[i].closed;
          const nextHasDigits = hasDigits[i + 1];

          if (sepFmt && (hadRawSep || segClosed || nextHasDigits))
            result += sepFmt;
        }
      }

      return result.replace(/[^0-9]+$/, (sep) => {
        const prefix = result.slice(0, -sep.length);
        return /\d/.test(prefix) ? sep : '';
      });
    };

    const adjustDateSegmentByArrow = (key: 'ArrowUp' | 'ArrowDown'): void => {
      if (!mask || mask.type !== 'date' || !mask.format) return;

      const format = mask.format;
      const value = el.value;

      const segments = getDateSegments(value, format);
      if (!segments.length) return;

      const caret = el.selectionStart ?? value.length;

      let idx = segments.findIndex((s) => caret >= s.start && caret <= s.end);
      if (idx === -1) {
        idx = segments.findIndex((s) => caret < s.start);
        if (idx === -1) idx = segments.length - 1;
        if (idx > 0 && caret > segments[idx - 1].end) idx = idx - 1;
      }
      if (idx < 0) idx = 0;

      let day = 1,
        month = 1,
        year = 2000;

      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg.kind === 'day') day = n;
        else if (seg.kind === 'month') month = n;
        else year = n;
      }

      if (month < 1) month = 1;
      if (month > 12) month = 12;

      let maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day < 1) day = 1;
      if (day > maxDay) day = maxDay;

      const seg = segments[idx];

      if (seg.kind === 'day') {
        day = key === 'ArrowUp' ? day + 1 : day - 1;
        if (day > maxDay) day = 1;
        if (day < 1) day = maxDay;
      } else if (seg.kind === 'month') {
        month = key === 'ArrowUp' ? month + 1 : month - 1;
        if (month > 12) month = 1;
        if (month < 1) month = 12;
      } else {
        year = key === 'ArrowUp' ? year + 1 : Math.max(0, year - 1);
      }

      maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day > maxDay) day = maxDay;

      const newValue = formatDateFromParts(day, month, year, format);
      el.value = newValue;
      dispatchInputEvent();

      const newSegments = getDateSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) el.setSelectionRange(newSeg.start, newSeg.end);
    };

    // ----------------------------------------------------
    // TIME HELPERS
    // ----------------------------------------------------
    const splitTimeFormat = (
      format: string
    ): { tokens: string[]; seps: string[] } => {
      const tokens: string[] = [];
      const seps: string[] = [];

      let currentSep = '';
      let i = 0;

      const isTokenChar = (c: string): boolean =>
        c === 'H' || c === 'm' || c === 's';

      while (i < format.length) {
        const c = format[i];

        if (!isTokenChar(c)) {
          currentSep += c;
          i++;
          continue;
        }

        seps.push(currentSep);
        currentSep = '';

        const ch = c;
        let token = ch;
        let j = i + 1;
        while (j < format.length && format[j] === ch) {
          token += format[j];
          j++;
        }

        tokens.push(token);
        i = j;
      }

      seps.push(currentSep);
      return { tokens, seps };
    };

    const getTimeSegments = (
      value: string,
      format: string
    ): {
      kind: 'hour' | 'minute' | 'second';
      start: number;
      end: number;
      raw: string;
    }[] => {
      const { tokens, seps } = splitTimeFormat(format);
      const segments: {
        kind: 'hour' | 'minute' | 'second';
        start: number;
        end: number;
        raw: string;
      }[] = [];

      let pos = 0;

      if (seps[0]) {
        const s0 = seps[0];
        if (value.startsWith(s0)) pos += s0.length;
      }

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const kind: 'hour' | 'minute' | 'second' =
          ch === 'H' ? 'hour' : ch === 'm' ? 'minute' : 'second';

        const start = pos;
        let end = pos;
        while (end < value.length && /\d/.test(value[end])) end++;

        const raw = value.slice(start, end);
        segments.push({ kind, start, end, raw });

        pos = end;

        const sep = seps[i + 1] ?? '';
        if (sep && value.substr(pos, sep.length) === sep) pos += sep.length;
      }

      return segments;
    };

    const formatTimeFromParts = (
      hour: number,
      minute: number,
      second: number,
      format: string
    ): string => {
      const { tokens, seps } = splitTimeFormat(format);
      let result = seps[0] ?? '';

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;

        if (ch === 'H') result += pad(hour, len);
        else if (ch === 'm') result += pad(minute, len);
        else result += pad(second, len);

        if (i < tokens.length - 1) result += seps[i + 1] ?? '';
      }

      return result;
    };

    const normalizeTimeValue = (value: string, format: string): string => {
      if (!value) return value;

      const segments = getTimeSegments(value, format);
      if (!segments.length) return value;

      let hour = 0,
        minute = 0,
        second = 0;

      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg.kind === 'hour') hour = n;
        else if (seg.kind === 'minute') minute = n;
        else second = n;
      }

      hour = Math.max(0, Math.min(23, hour));
      minute = Math.max(0, Math.min(59, minute));
      second = Math.max(0, Math.min(59, second));

      return formatTimeFromParts(hour, minute, second, format);
    };

    const applyTimeMaskDigitsOnly = (
      digits: string,
      format: string
    ): string => {
      const { tokens, seps } = splitTimeFormat(format);
      if (!tokens.length) return digits;

      const firstSep = seps[1] ?? '';
      const secondSep = seps[2] ?? '';

      const hasMinutes = tokens.length >= 2 && tokens[1][0] === 'm';
      const hasSeconds = tokens.length >= 3 && tokens[2][0] === 's';

      // HH:mm
      if (hasMinutes && !hasSeconds) {
        if (digits.length <= 2) {
          if (digits.length === 2 && firstSep) return digits + firstSep;
          return digits;
        }
        if (digits.length <= 4) {
          const hRaw = digits.slice(0, 2);
          const mRaw = digits.slice(2);
          return `${hRaw}${firstSep}${mRaw}`;
        }

        let hour = Number(digits.slice(0, 2) || '0');
        let minute = Number(digits.slice(2, 4) || '0');
        hour = Math.max(0, Math.min(23, hour));
        minute = Math.max(0, Math.min(59, minute));
        return formatTimeFromParts(hour, minute, 0, format);
      }

      // HH:mm:ss
      if (hasMinutes && hasSeconds) {
        if (digits.length <= 2) {
          if (digits.length === 2 && firstSep) return digits + firstSep;
          return digits;
        }

        if (digits.length <= 4) {
          const hRaw = digits.slice(0, 2);
          const mRaw = digits.slice(2);
          let res = `${hRaw}${firstSep}${mRaw}`;
          if (mRaw.length === 2) res += secondSep;
          return res;
        }

        if (digits.length <= 6) {
          const hRaw = digits.slice(0, 2);
          const mRaw = digits.slice(2, 4);
          const sRaw = digits.slice(4);
          return `${hRaw}${firstSep}${mRaw}${secondSep}${sRaw}`;
        }

        let hour = Number(digits.slice(0, 2) || '0');
        let minute = Number(digits.slice(2, 4) || '0');
        let second = Number(digits.slice(4, 6) || '0');
        hour = Math.max(0, Math.min(23, hour));
        minute = Math.max(0, Math.min(59, minute));
        second = Math.max(0, Math.min(59, second));
        return formatTimeFromParts(hour, minute, second, format);
      }

      return digits;
    };

    const applyTimeMask = (raw: string, format: string): string => {
      if (!raw) return '';

      const hasSeparator = /[^0-9]/.test(raw);
      const { tokens, seps } = splitTimeFormat(format);
      if (!tokens.length) return raw.replace(/\D/g, '');

      if (!hasSeparator) {
        const digits = raw.replace(/\D/g, '');
        if (!digits) return '';
        return applyTimeMaskDigitsOnly(digits, format);
      }

      const rawSegs = raw.split(/[^0-9]/);
      const rawSeps = raw.match(/[^0-9]+/g) ?? [];

      type PartKind = 'hour' | 'minute' | 'second';
      type Part = {
        kind: PartKind;
        raw: string;
        len: number;
        closed: boolean;
        out: string;
      };

      const parts: Part[] = [];

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;
        const rawSeg = (rawSegs[i] ?? '').replace(/\D/g, '');

        const kind: PartKind =
          ch === 'H' ? 'hour' : ch === 'm' ? 'minute' : 'second';
        const closed = rawSeg.length >= len;

        parts.push({ kind, raw: rawSeg.slice(0, len), len, closed, out: '' });
      }

      const hourPart = parts.find((p) => p.kind === 'hour');
      const minutePart = parts.find((p) => p.kind === 'minute');
      const secondPart = parts.find((p) => p.kind === 'second');

      let hour = hourPart?.raw ? Number(hourPart.raw) : 0;
      let minute = minutePart?.raw ? Number(minutePart.raw) : 0;
      let second = secondPart?.raw ? Number(secondPart.raw) : 0;

      if (hourPart) {
        if (hourPart.closed && hourPart.raw) {
          hour = Math.max(0, Math.min(23, hour));
          hourPart.out = pad(hour, hourPart.len);
        } else hourPart.out = hourPart.raw;
      }

      if (minutePart) {
        if (minutePart.closed && minutePart.raw) {
          minute = Math.max(0, Math.min(59, minute));
          minutePart.out = pad(minute, minutePart.len);
        } else minutePart.out = minutePart.raw;
      }

      if (secondPart) {
        if (secondPart.closed && secondPart.raw) {
          second = Math.max(0, Math.min(59, second));
          secondPart.out = pad(second, secondPart.len);
        } else secondPart.out = secondPart.raw;
      }

      const outSegs = parts.map((p) => p.out);
      const hasDigits = parts.map((p) => p.raw.length > 0);

      let result = seps[0] ?? '';
      for (let i = 0; i < parts.length; i++) {
        result += outSegs[i] ?? '';

        if (i < parts.length - 1) {
          const sepFmt = seps[i + 1] ?? '';
          const hadRawSep = i < rawSeps.length;
          const segClosed = parts[i].closed;
          const nextHasDigits = hasDigits[i + 1];

          if (sepFmt && (hadRawSep || segClosed || nextHasDigits))
            result += sepFmt;
        }
      }

      return result.replace(/[^0-9]+$/, (sep) => {
        const prefix = result.slice(0, -sep.length);
        return /\d/.test(prefix) ? sep : '';
      });
    };

    const adjustTimeSegmentByArrow = (key: 'ArrowUp' | 'ArrowDown'): void => {
      if (!mask || mask.type !== 'time' || !mask.format) return;

      const format = mask.format;
      const value = el.value;

      const segments = getTimeSegments(value, format);
      if (!segments.length) return;

      const caret = el.selectionStart ?? value.length;

      let idx = segments.findIndex((s) => caret >= s.start && caret <= s.end);
      if (idx === -1) {
        idx = segments.findIndex((s) => caret < s.start);
        if (idx === -1) idx = segments.length - 1;
        if (idx > 0 && caret > segments[idx - 1].end) idx = idx - 1;
      }
      if (idx < 0) idx = 0;

      let hour = 0,
        minute = 0,
        second = 0;

      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;
        if (seg.kind === 'hour') hour = n;
        else if (seg.kind === 'minute') minute = n;
        else second = n;
      }

      const seg = segments[idx];

      if (seg.kind === 'hour') {
        hour = key === 'ArrowUp' ? hour + 1 : hour - 1;
        if (hour > 23) hour = 0;
        if (hour < 0) hour = 23;
      } else if (seg.kind === 'minute') {
        minute = key === 'ArrowUp' ? minute + 1 : minute - 1;
        if (minute > 59) minute = 0;
        if (minute < 0) minute = 59;
      } else {
        second = key === 'ArrowUp' ? second + 1 : second - 1;
        if (second > 59) second = 0;
        if (second < 0) second = 59;
      }

      const newValue = formatTimeFromParts(hour, minute, second, format);
      el.value = newValue;
      dispatchInputEvent();

      const newSegments = getTimeSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) el.setSelectionRange(newSeg.start, newSeg.end);
    };

    // ----------------------------------------------------
    // HOST LISTENERS (DOM)
    // ----------------------------------------------------
    const onInput = () => {
      if (!hasMask() || !mask) return;

      const oldValue = el.value ?? '';
      let value = oldValue;

      const type = mask.type;
      const format = mask.format;

      const prevPos = el.selectionStart ?? oldValue.length;

      if (type === 'date' && format) value = applyDateMask(value, format);
      else if (type === 'time' && format) value = applyTimeMask(value, format);
      else if (type === 'integer') value = applyNumericMask(value, false);
      else if (type === 'number' || type === 'currency')
        value = applyNumericMask(value, true);

      if (value !== oldValue) {
        const oldLen = oldValue.length;
        el.value = value;
        const newLen = value.length;

        const delta = newLen - oldLen;
        const newPos = Math.max(0, Math.min(newLen, prevPos + delta));
        el.setSelectionRange(newPos, newPos);
      }
    };

    const onBlur = () => {
      if (!mask) return;

      if (mask.type === 'date' && mask.format) {
        if (!el.value) return;
        const normalized = normalizeDateValue(el.value, mask.format);
        if (normalized !== el.value) {
          el.value = normalized;
          dispatchInputEvent();
        }
      }

      if (mask.type === 'time' && mask.format) {
        if (!el.value) return;
        const normalized = normalizeTimeValue(el.value, mask.format);
        if (normalized !== el.value) {
          el.value = normalized;
          dispatchInputEvent();
        }
      }
    };

    const onFocus = () => {
      if (!mask) return;
      if (!defaultAppliedRef.current && el.value.trim() === '') {
        applyInitialDefaultIfNeeded();
      }
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (!mask || el.readOnly || el.disabled) return;

      const type = mask.type;
      const key = event.key;

      if (
        type === 'date' &&
        mask.format &&
        (key === 'ArrowUp' || key === 'ArrowDown')
      ) {
        event.preventDefault();
        adjustDateSegmentByArrow(key as 'ArrowUp' | 'ArrowDown');
        return;
      }

      if (
        type === 'time' &&
        mask.format &&
        (key === 'ArrowUp' || key === 'ArrowDown')
      ) {
        event.preventDefault();
        adjustTimeSegmentByArrow(key as 'ArrowUp' | 'ArrowDown');
        return;
      }

      // Normalize on Enter (matches your older Angular-ish behavior)
      if (type === 'date' && mask.format && key === 'Enter') {
        event.preventDefault();
        if (el.value) {
          const normalized = normalizeDateValue(el.value, mask.format);
          if (normalized !== el.value) {
            el.value = normalized;
            dispatchInputEvent();
          }
        }
        return;
      }

      if (type === 'time' && mask.format && key === 'Enter') {
        event.preventDefault();
        if (el.value) {
          const normalized = normalizeTimeValue(el.value, mask.format);
          if (normalized !== el.value) {
            el.value = normalized;
            dispatchInputEvent();
          }
        }
        return;
      }

      if (isControlKey(event)) return;

      // For date/time: allow digits + separators found in format
      if (type === 'date' || type === 'time') {
        const fmt = mask.format || '';
        const allowedSeps = new Set<string>();
        for (const c of fmt) {
          if (!/[dMyHms]/.test(c)) allowedSeps.add(c);
        }

        if (/\d/.test(key)) return;
        if (allowedSeps.has(key)) return;

        event.preventDefault();
        return;
      }

      if (type === 'integer') {
        if (!/\d/.test(key)) event.preventDefault();
        return;
      }

      if (type === 'number' || type === 'currency') {
        if (/\d/.test(key)) return;

        if (key === '.' || key === ',') {
          const v = el.value;
          if (v.includes('.') || v.includes(',')) event.preventDefault();
          return;
        }

        event.preventDefault();
      }
    };

    // mimic ngOnInit + ngOnChanges default
    applyInitialDefaultIfNeeded();

    el.addEventListener('input', onInput);
    el.addEventListener('blur', onBlur);
    el.addEventListener('focus', onFocus);
    el.addEventListener('keydown', onKeydown);

    return () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('keydown', onKeydown);
    };
  }, [mask, enableDefault]); // ✅ don't depend on ref object identity
}

/* =========================================
 * IInput
 * ========================================= */

export interface IInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  invalid?: boolean;
  mask?: IInputMask;

  value?: string | null;
  onValueChange?: (value: string) => void;

  prepend?: IInputAddons | IInputAddons[] | undefined;
  append?: IInputAddons | IInputAddons[] | undefined;

  /** ✅ expose inner input ref (Angular ViewChild vibe) */
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const IInput = React.forwardRef<HTMLInputElement, IInputProps>(
  function IInput(props, forwardedRef) {
    const {
      type = 'text',
      placeholder = '',
      autocomplete,
      readonly = false,
      invalid = false,
      mask,

      value,
      defaultValue,
      onValueChange,

      prepend,
      append,

      disabled,
      className,

      onBlur,
      onInput,

      inputRef,

      ...rest
    } = props;

    const innerRef = useRef<HTMLInputElement | null>(null);

    // wire forwardedRef + inputRef to the INNER <input>
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (inputRef) {
        inputRef.current = node;
      }

      if (!forwardedRef) return;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else forwardedRef.current = node;
    };

    const isControlled = value !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
      if (isControlled) return '';
      if (defaultValue !== undefined && defaultValue !== null)
        return String(defaultValue);
      return '';
    });

    const currentValue = isControlled ? (value ?? '') : uncontrolledValue;

    const prepends = useMemo<IInputAddons[]>(() => {
      if (!prepend) return [];
      return Array.isArray(prepend) ? prepend : [prepend];
    }, [prepend]);

    const appends = useMemo<IInputAddons[]>(() => {
      if (!append) return [];
      return Array.isArray(append) ? append : [append];
    }, [append]);

    useInputMask(innerRef, mask);

    const handleInput: React.FormEventHandler<HTMLInputElement> = (e) => {
      const v = e.currentTarget.value ?? '';

      if (!isControlled) {
        setUncontrolledValue(v);
      }

      onValueChange?.(v);
      onInput?.(e);
    };

    const handleHostClick: React.MouseEventHandler<HTMLElement> = (e) => {
      if (disabled) return;

      const target = e.target as HTMLElement | null;
      if (target && target.closest('i-input-addon')) return;

      innerRef.current?.focus();
    };

    return (
      <i-input className={className} onClick={handleHostClick as any}>
        {prepends.map((a, idx) => (
          <IInputAddon key={`pre-${idx}`} addon={a} />
        ))}

        <input
          ref={setRefs}
          aria-invalid={invalid ? 'true' : undefined}
          autoComplete={autocomplete ?? undefined}
          disabled={!!disabled}
          placeholder={placeholder}
          readOnly={readonly}
          type={type}
          value={currentValue}
          onInput={handleInput}
          onBlur={onBlur}
          {...rest}
        />

        {appends.map((a, idx) => (
          <IInputAddon key={`app-${idx}`} addon={a} />
        ))}
      </i-input>
    );
  }
);

/* =========================================
 * IFCInput (wrapper)
 * ========================================= */

export type IFCInputProps = React.HTMLAttributes<HTMLElement> & {
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  type?: string;

  mask?: IInputMask;

  prepend?: IInputAddons | IInputAddons[];
  append?: IInputAddons | IInputAddons[];

  value?: string | null;
  invalid?: boolean;

  errorMessage?: string | null;

  onInput?: React.FormEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export function IFCInput(props: IFCInputProps) {
  const {
    label = '',
    placeholder = '',
    autocomplete,
    readonly = false,
    type = 'text',
    mask,
    prepend,
    append,
    value,
    invalid = false,
    errorMessage = null,
    onInput,
    onBlur,
    children,
    ...hostProps
  } = props;

  return (
    <i-fc-input {...hostProps}>
      {label ? <label className="i-fc-input__label">{label} :</label> : null}

      <IInput
        placeholder={placeholder}
        autocomplete={autocomplete}
        readonly={readonly}
        type={type}
        mask={mask}
        prepend={prepend}
        append={append}
        value={value ?? ''}
        invalid={invalid}
        onInput={onInput}
        onBlur={onBlur}
      />

      {invalid && errorMessage ? (
        <div className="i-fc-input__error">{errorMessage}</div>
      ) : null}

      {children}
    </i-fc-input>
  );
}
