// input.tsx
import React, { useEffect, useMemo, useRef } from 'react';
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
  icon?: IIconInput;
  text?: string;
  variant?: IButtonVariant;
  onClick?: () => void;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddonLink = {
  type: 'link';
  icon?: IIconInput;
  text: string;
  href: string;
  target?: string;
  visible?: boolean;
} & IInputAddonType;

export type IInputAddons =
  | IInputAddonIcon
  | IInputAddonText
  | IInputAddonButton
  | IInputAddonLink
  | IInputAddonLoading;

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

export type UseInputMaskOptions = {
  enableDefault?: boolean;
};

/**
 * React counterpart for Angular IInputMaskDirective:
 * - attaches listeners to the native <input/>
 * - formats and constrains value based on the mask
 *
 * NOTE: this is intentionally “best effort parity”.
 */
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
    if (!mask) return;
    if (el.readOnly || el.disabled) return;

    const type = mask.type;
    const fmt = mask.format;

    /* =========================================
     * Helpers (React controlled-input safe)
     * ========================================= */

    const dispatchInput = () => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const safeSetSelectionRange = (start: number, end: number) => {
      try {
        if (typeof (el as any).setSelectionRange === 'function') {
          el.setSelectionRange(start, end);
        }
      } catch {
        // ignore
      }
    };

    const setValue = (
      v: string,
      opts?: { anchorPos?: number; emit?: boolean }
    ) => {
      const old = el.value ?? '';
      if (v === old) return;

      const prevPos = opts?.anchorPos ?? el.selectionStart ?? old.length;

      el.value = v;

      const delta = v.length - old.length;
      const newPos = Math.max(0, Math.min(v.length, prevPos + delta));
      safeSetSelectionRange(newPos, newPos);

      if (opts?.emit !== false) {
        dispatchInput();
      }
    };

    const pad2 = (n: number) => String(n).padStart(2, '0');

    const isControlKey = (e: KeyboardEvent) => {
      const key = e.key;
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
      if (e.ctrlKey || e.metaKey || e.altKey) return true;
      return false;
    };

    /* =========================================
     * Default apply (Angular parity)
     * ========================================= */

    const formatDateDefault = (d: Date, format: string) => {
      const yyyy = String(d.getFullYear());
      const MM = pad2(d.getMonth() + 1);
      const dd = pad2(d.getDate());
      return (format || 'dd/MM/yyyy')
        .replace(/yyyy/g, yyyy)
        .replace(/MM/g, MM)
        .replace(/dd/g, dd);
    };

    const formatTimeDefault = (d: Date, format: string) => {
      const HH = pad2(d.getHours());
      const mm = pad2(d.getMinutes());
      const ss = pad2(d.getSeconds());
      return (format || 'HH:mm')
        .replace(/HH/g, HH)
        .replace(/mm/g, mm)
        .replace(/ss/g, ss);
    };

    const applyInitialDefaultIfNeeded = () => {
      if (!enableDefault) return;
      if (defaultAppliedRef.current) return;
      if (el.value && el.value.trim().length > 0) return;

      const now = new Date();
      if (type === 'date') {
        const v = formatDateDefault(now, fmt || 'dd/MM/yyyy');
        defaultAppliedRef.current = true;
        el.value = v;
        dispatchInput();
      } else if (type === 'time') {
        const v = formatTimeDefault(now, fmt || 'HH:mm');
        defaultAppliedRef.current = true;
        el.value = v;
        dispatchInput();
      }
    };

    applyInitialDefaultIfNeeded();

    /* =========================================
     * Numeric mask
     * ========================================= */

    const applyNumericMask = (raw: string, allowDecimal: boolean) => {
      if (!raw) return '';
      let out = '';
      let hasDecimal = false;

      for (const ch of raw) {
        if (/\d/.test(ch)) {
          out += ch;
          continue;
        }
        if (allowDecimal && (ch === '.' || ch === ',')) {
          if (!hasDecimal) {
            hasDecimal = true;
            out += ch;
          }
        }
      }
      return out;
    };

    /* =========================================
     * Date helpers (ported)
     * ========================================= */

    const daysInMonth = (year: number, month1: number) =>
      new Date(year, month1, 0).getDate();

    const splitDateFormat = (format: string) => {
      const tokens: string[] = [];
      const seps: string[] = [];
      let currentSep = '';
      let i = 0;
      const isTokenChar = (c: string) => c === 'd' || c === 'M' || c === 'y';

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

    const getDateSegments = (value: string, format: string) => {
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
        if (sep && value.substr(pos, sep.length) === sep) {
          pos += sep.length;
        }
      }

      return segments;
    };

    const formatDateFromParts = (
      day: number,
      month: number,
      year: number,
      format: string
    ) => {
      const { tokens, seps } = splitDateFormat(format);
      let result = seps[0] ?? '';

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;

        if (ch === 'd') result += String(day).padStart(len, '0');
        else if (ch === 'M') result += String(month).padStart(len, '0');
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

    const applyDateMaskDigitsOnly = (digits: string, format: string) => {
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

    const applyDateMask = (raw: string, format: string) => {
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
          monthPart.out = String(m).padStart(monthPart.len, '0');
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

          dayPart.out = String(d).padStart(dayPart.len, '0');
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

          if (sepFmt && (hadRawSep || segClosed || nextHasDigits)) {
            result += sepFmt;
          }
        }
      }

      return result.replace(/[^0-9]+$/, (sep) => {
        const prefix = result.slice(0, -sep.length);
        return /\d/.test(prefix) ? sep : '';
      });
    };

    const normalizeDateValue = (value: string, format: string) => {
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

    const adjustDateSegmentByArrow = (key: 'ArrowUp' | 'ArrowDown') => {
      if (type !== 'date' || !fmt) return;

      const format = fmt;
      const value = el.value ?? '';

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

      let maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day < 1) day = 1;
      if (day > maxDay) day = maxDay;

      const seg = segments[idx];

      if (seg.kind === 'day') {
        if (key === 'ArrowUp') {
          day = day + 1;
          if (day > maxDay) day = 1;
        } else {
          day = day - 1;
          if (day < 1) day = maxDay;
        }
      } else if (seg.kind === 'month') {
        if (key === 'ArrowUp') {
          month = month + 1;
          if (month > 12) month = 1;
        } else {
          month = month - 1;
          if (month < 1) month = 12;
        }
      } else {
        if (key === 'ArrowUp') year = year + 1;
        else {
          year = year - 1;
          if (year < 0) year = 0;
        }
      }

      maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day > maxDay) day = maxDay;

      const newValue = formatDateFromParts(day, month, year, format);

      // set value and reselect same segment
      el.value = newValue;
      dispatchInput();

      const newSegments = getDateSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) safeSetSelectionRange(newSeg.start, newSeg.end);
    };

    /* =========================================
     * Time helpers (ported)
     * ========================================= */

    const splitTimeFormat = (format: string) => {
      const tokens: string[] = [];
      const seps: string[] = [];
      let currentSep = '';
      let i = 0;
      const isTokenChar = (c: string) => c === 'H' || c === 'm' || c === 's';

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

    const getTimeSegments = (value: string, format: string) => {
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
        if (sep && value.substr(pos, sep.length) === sep) {
          pos += sep.length;
        }
      }

      return segments;
    };

    const formatTimeFromParts = (
      hour: number,
      minute: number,
      second: number,
      format: string
    ) => {
      const { tokens, seps } = splitTimeFormat(format);
      let result = seps[0] ?? '';

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const ch = tok[0];
        const len = tok.length;

        if (ch === 'H') result += String(hour).padStart(len, '0');
        else if (ch === 'm') result += String(minute).padStart(len, '0');
        else result += String(second).padStart(len, '0');

        if (i < tokens.length - 1) result += seps[i + 1] ?? '';
      }

      return result;
    };

    const normalizeTimeValue = (value: string, format: string) => {
      if (!value) return value;

      const segments = getTimeSegments(value, format);
      if (!segments.length) return value;

      let hour = 0;
      let minute = 0;
      let second = 0;

      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;

        if (seg.kind === 'hour') hour = n;
        else if (seg.kind === 'minute') minute = n;
        else second = n;
      }

      if (hour < 0) hour = 0;
      if (hour > 23) hour = 23;

      if (minute < 0) minute = 0;
      if (minute > 59) minute = 59;

      if (second < 0) second = 0;
      if (second > 59) second = 59;

      return formatTimeFromParts(hour, minute, second, format);
    };

    const applyTimeMaskDigitsOnly = (digits: string, format: string) => {
      const { tokens, seps } = splitTimeFormat(format);
      if (!tokens.length) return digits;

      const firstSep = seps[1] ?? '';
      const secondSep = seps[2] ?? '';

      const hasMinutes = tokens.length >= 2 && tokens[1][0] === 'm';
      const hasSeconds = tokens.length >= 3 && tokens[2][0] === 's';

      if (hasMinutes && !hasSeconds) {
        if (digits.length <= 2) {
          if (digits.length === 2 && firstSep) return digits + firstSep;
          return digits;
        }

        if (digits.length <= 4) {
          const hRaw = digits.slice(0, 2);
          const mRaw = digits.slice(2);

          let res = hRaw;
          if (firstSep) res += firstSep;
          if (mRaw.length) res += mRaw;

          return res;
        }

        const hStr = digits.slice(0, 2);
        const mStr = digits.slice(2, 4);

        let hour = Number(hStr || '0');
        let minute = Number(mStr || '0');

        if (hour < 0) hour = 0;
        if (hour > 23) hour = 23;

        if (minute < 0) minute = 0;
        if (minute > 59) minute = 59;

        return formatTimeFromParts(hour, minute, 0, format);
      }

      if (hasMinutes && hasSeconds) {
        if (digits.length <= 2) {
          if (digits.length === 2 && firstSep) return digits + firstSep;
          return digits;
        }

        if (digits.length <= 4) {
          const hRaw = digits.slice(0, 2);
          const mRaw = digits.slice(2);

          let res = hRaw;
          if (firstSep) res += firstSep;

          if (mRaw.length) {
            res += mRaw;
            if (mRaw.length === 2 && secondSep) res += secondSep;
          }

          return res;
        }

        if (digits.length <= 6) {
          const hRaw = digits.slice(0, 2);
          const mRaw = digits.slice(2, 4);
          const sRaw = digits.slice(4);

          let res = hRaw;
          if (firstSep) res += firstSep;
          res += mRaw;
          if (secondSep) res += secondSep;
          res += sRaw;

          return res;
        }

        const hStr = digits.slice(0, 2);
        const mStr = digits.slice(2, 4);
        const sStr = digits.slice(4, 6);

        let hour = Number(hStr || '0');
        let minute = Number(mStr || '0');
        let second = Number(sStr || '0');

        if (hour < 0) hour = 0;
        if (hour > 23) hour = 23;

        if (minute < 0) minute = 0;
        if (minute > 59) minute = 59;

        if (second < 0) second = 0;
        if (second > 59) second = 59;

        return formatTimeFromParts(hour, minute, second, format);
      }

      return digits;
    };

    const applyTimeMask = (raw: string, format: string) => {
      if (!raw) return '';
      const hasSeparator = /[^0-9]/.test(raw);
      const { tokens } = splitTimeFormat(format);
      if (!tokens.length) return raw.replace(/\D/g, '');

      if (!hasSeparator) {
        const digits = raw.replace(/\D/g, '');
        if (!digits) return '';
        return applyTimeMaskDigitsOnly(digits, format);
      }

      // separator-typed path: keep it simple (digits + separators)
      // (Angular does more clamping while typing; we already clamp on blur/enter/arrow)
      return raw.replace(/[^\d:]/g, '');
    };

    const adjustTimeSegmentByArrow = (key: 'ArrowUp' | 'ArrowDown') => {
      if (type !== 'time' || !fmt) return;

      const format = fmt;
      const value = el.value ?? '';

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

      let hour = 0;
      let minute = 0;
      let second = 0;

      for (const seg of segments) {
        const n = seg.raw ? Number(seg.raw) : NaN;
        if (Number.isNaN(n)) continue;

        if (seg.kind === 'hour') hour = n;
        else if (seg.kind === 'minute') minute = n;
        else second = n;
      }

      const seg = segments[idx];

      if (seg.kind === 'hour') {
        if (key === 'ArrowUp') hour = (hour + 1) % 24;
        else hour = (hour - 1 + 24) % 24;
      } else if (seg.kind === 'minute') {
        if (key === 'ArrowUp') minute = (minute + 1) % 60;
        else minute = (minute - 1 + 60) % 60;
      } else {
        if (key === 'ArrowUp') second = (second + 1) % 60;
        else second = (second - 1 + 60) % 60;
      }

      const newValue = formatTimeFromParts(hour, minute, second, format);

      el.value = newValue;
      dispatchInput();

      const newSegments = getTimeSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) safeSetSelectionRange(newSeg.start, newSeg.end);
    };

    /* =========================================
     * Event handlers
     * ========================================= */

    const onInput = () => {
      const raw = el.value ?? '';
      let next = raw;

      if (type === 'date' && fmt) next = applyDateMask(raw, fmt);
      else if (type === 'time' && fmt) next = applyTimeMask(raw, fmt);
      else if (type === 'integer') next = applyNumericMask(raw, false);
      else if (type === 'number' || type === 'currency')
        next = applyNumericMask(raw, true);

      if (next !== raw) setValue(next, { emit: false });
    };

    const onBlur = () => {
      const raw = el.value ?? '';
      if (!raw) return;

      if (type === 'date' && fmt) {
        const norm = normalizeDateValue(raw, fmt);
        if (norm !== raw) setValue(norm);
      }

      if (type === 'time' && fmt) {
        const norm = normalizeTimeValue(raw, fmt);
        if (norm !== raw) setValue(norm);
      }
    };

    const onFocus = () => {
      if (!defaultAppliedRef.current && (el.value ?? '').trim() === '') {
        applyInitialDefaultIfNeeded();
      }
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (el.readOnly || el.disabled) return;

      // Arrow segment adjust (Angular parity)
      if (
        type === 'date' &&
        fmt &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      ) {
        e.preventDefault();
        adjustDateSegmentByArrow(e.key as 'ArrowUp' | 'ArrowDown');
        return;
      }

      if (
        type === 'time' &&
        fmt &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      ) {
        e.preventDefault();
        adjustTimeSegmentByArrow(e.key as 'ArrowUp' | 'ArrowDown');
        return;
      }

      // Normalize on Enter (Angular parity)
      if (type === 'date' && fmt && e.key === 'Enter') {
        e.preventDefault();
        if (el.value) {
          const norm = normalizeDateValue(el.value, fmt);
          if (norm !== el.value) setValue(norm);
        }
        return;
      }

      if (type === 'time' && fmt && e.key === 'Enter') {
        e.preventDefault();
        if (el.value) {
          const norm = normalizeTimeValue(el.value, fmt);
          if (norm !== el.value) setValue(norm);
        }
        return;
      }

      if (isControlKey(e)) return;

      // Date/time: digits + separators from format only
      if (type === 'date' || type === 'time') {
        const format = fmt || '';
        const allowedSeps = new Set<string>();
        for (const c of format) {
          if (!/[dMyHms]/.test(c)) allowedSeps.add(c);
        }

        if (/\d/.test(e.key)) return;
        if (allowedSeps.has(e.key)) return;

        e.preventDefault();
        return;
      }

      // Integer
      if (type === 'integer') {
        if (!/\d/.test(e.key)) e.preventDefault();
        return;
      }

      // Number/currency (digits + single dot/comma)
      if (type === 'number' || type === 'currency') {
        if (/\d/.test(e.key)) return;

        if (e.key === '.' || e.key === ',') {
          const v = el.value ?? '';
          if (v.includes('.') || v.includes(',')) e.preventDefault();
          return;
        }

        e.preventDefault();
      }
    };

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
  }, [inputRef, mask, enableDefault]);
}

/* =========================================
 * IInputAddon (render)
 * ========================================= */

export type IInputAddonProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> & {
  addon: IInputAddons | undefined;
};

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
          onClick={() => addon.onClick?.()}>
          {addon.text ?? null}
        </IButton>
      ) : addon.type === 'icon' ? (
        <IIcon icon={addon.icon} size="sm" />
      ) : addon.type === 'link' ? (
        <a
          href={addon.href}
          target={addon.target ?? undefined}
          rel="noopener noreferrer">
          {addon.icon ? <IIcon icon={addon.icon} size="sm" /> : null}
          {addon.text}
        </a>
      ) : addon.type === 'loading' ? (
        <ILoading />
      ) : (
        <span>{addon.text}</span>
      )}
    </i-input-addon>
  );
}

/* =========================================
 * IInput (Angular parity)
 * ========================================= */

export type IInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children' | 'value' | 'defaultValue' | 'readOnly'
> & {
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  invalid?: boolean;
  disabled?: boolean;

  mask?: IInputMask;

  prepend?: IInputAddons | IInputAddons[];
  append?: IInputAddons | IInputAddons[] | IInputAddonLoading;

  value?: string | null;

  /**
   * ✅ expose inner input ref (ViewChild vibe)
   * Must be MutableRefObject because we assign .current
   */
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

function normalizeArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/**
 * ✅ forwardRef supported:
 * <IInput ref={...} />
 * ✅ inputRef supported:
 * <IInput inputRef={...} />
 *
 * Both point to the INNER <input>
 */
export const IInput = React.forwardRef<HTMLInputElement, IInputProps>(
  function IInput(props, forwardedRef) {
    const {
      type = 'text',
      placeholder = '',
      autocomplete,
      readonly = false,
      invalid = false,
      disabled = false,
      mask,
      prepend,
      append,
      value,
      className,
      onInput,
      onBlur,
      inputRef,
      ...rest
    } = props;

    const innerRef = useRef<HTMLInputElement | null>(null);

    // Mask parity
    useInputMask(innerRef, mask);

    const prepends = useMemo(() => normalizeArray(prepend), [prepend]);
    const appends = useMemo(() => normalizeArray(append as any), [append]);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (inputRef) {
        inputRef.current = node;
      }

      if (!forwardedRef) return;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else forwardedRef.current = node;
    };

    // Click anywhere on <i-input> focuses inner input, except clicks on addons
    const handleHostClick: React.MouseEventHandler<HTMLElement> = (e) => {
      if (disabled) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest?.('i-input-addon')) return;

      innerRef.current?.focus();
    };

    return (
      <i-input className={className} onClick={handleHostClick}>
        {prepends.map((a, idx) => (
          <IInputAddon key={`prepend-${idx}`} addon={a} />
        ))}

        <input
          {...rest}
          ref={setRefs}
          aria-invalid={invalid ? 'true' : undefined}
          autoComplete={autocomplete ?? undefined}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readonly}
          type={type}
          value={value ?? ''}
          onInput={onInput}
          onBlur={onBlur}
        />

        {appends.map((a: any, idx: number) => (
          <IInputAddon key={`append-${idx}`} addon={a} />
        ))}
      </i-input>
    );
  }
);

/* =========================================
 * IFCInput (React wrapper)
 * ========================================= */

export type IFCInputProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> & {
  label?: string;

  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  type?: string;

  mask?: IInputMask;

  prepend?: IInputProps['prepend'];
  append?: IInputProps['append'];

  value?: string | null;

  /**
   * In Angular, invalid/error are derived from NgControl.
   * In React, you supply them (works with any form lib).
   */
  invalid?: boolean;
  errorMessage?: string | null;

  disabled?: boolean;
  required?: boolean;

  onInput?: React.FormEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  children?: React.ReactNode;
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
    disabled = false,
    required = false,
    onInput,
    onBlur,
    children,
    className,
    ...hostProps
  } = props;

  // ✅ focus target for label click
  const innerRef = useRef<HTMLInputElement | null>(null);

  const focusInnerInput = () => {
    if (!disabled) {
      innerRef.current?.focus();
    }
  };

  return (
    <i-fc-input className={className} {...hostProps}>
      {label ? (
        <label className="i-fc-input__label" onClick={focusInnerInput}>
          {label} :{' '}
          {required ? <span className="i-fc-input__required">*</span> : null}
        </label>
      ) : null}

      <IInput
        inputRef={innerRef}
        placeholder={placeholder}
        autocomplete={autocomplete}
        readonly={readonly}
        type={type}
        mask={mask}
        prepend={prepend}
        append={append}
        value={value ?? ''}
        invalid={invalid}
        disabled={disabled}
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
