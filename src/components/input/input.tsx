/* eslint-disable react-refresh/only-export-components */
// input.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { IButton, type IButtonVariant } from '../button';
import { IIcon, type IIconInput } from '../icon';
import { ILoading } from '../loading';

/* =========================================
 * Types: addons (Angular parity)
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
 * Types: mask (Angular parity)
 * ========================================= */

export type IInputMaskType =
  | 'date'
  | 'integer'
  | 'number'
  | 'currency'
  | 'time'
  | 'lowercase'
  | 'uppercase';

export type IInputMask = {
  type: IInputMaskType;
  format?: string;
};

export type UseInputMaskOptions = {
  enableDefault?: boolean;
};

/* =========================================
 * Helpers
 * ========================================= */

function clamp(n: number, min: number, max: number): number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function normalizeArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function countDigitsBeforePos(value: string, pos: number): number {
  let n = 0;
  for (let i = 0; i < Math.min(pos, value.length); i++) {
    if (/\d/.test(value[i])) n++;
  }
  return n;
}

function caretPosAfterDigits(value: string, digitCount: number): number {
  if (digitCount <= 0) return 0;

  let seen = 0;
  for (let i = 0; i < value.length; i++) {
    if (/\d/.test(value[i])) {
      seen++;
      if (seen === digitCount) return i + 1;
    }
  }

  return value.length;
}

/* =========================================
 * React counterpart of IInputMaskDirective
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
    if (!mask) return;
    if (el.readOnly || el.disabled) return;

    const type = mask.type;
    const fmt = mask.format;

    const dispatchInput = () => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const safeSetSelectionRange = (start: number, end: number) => {
      try {
        if (typeof (el as HTMLInputElement).setSelectionRange === 'function') {
          el.setSelectionRange(start, end);
        }
      } catch {
        // ignore
      }
    };

    const setValue = (
      v: string,
      o?: { anchorPos?: number; emit?: boolean }
    ) => {
      const old = el.value ?? '';
      if (v === old) return;

      const prevPos = o?.anchorPos ?? el.selectionStart ?? old.length;

      el.value = v;

      const delta = v.length - old.length;
      const newPos = Math.max(0, Math.min(v.length, prevPos + delta));
      safeSetSelectionRange(newPos, newPos);

      if (o?.emit !== false) {
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
     * Defaults
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
     * Shared formatters
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

    const applyTextCaseMask = (
      value: string,
      caseType: 'lowercase' | 'uppercase'
    ) => {
      if (!value) return value;
      return caseType === 'lowercase'
        ? value.toLowerCase()
        : value.toUpperCase();
    };

    /* =========================================
     * Date helpers
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

        if (ch === 'd') {
          result += String(day).padStart(len, '0');
        } else if (ch === 'M') {
          result += String(month).padStart(len, '0');
        } else {
          let s = String(year);
          if (s.length < len) s = s.padStart(len, '0');
          else if (s.length > len) s = s.slice(-len);
          result += s;
        }

        if (i < tokens.length - 1) {
          result += seps[i + 1] ?? '';
        }
      }

      return result;
    };

    const applyDateMaskDigitsOnly = (digits: string, format: string) => {
      const { tokens, seps } = splitDateFormat(format);
      if (!tokens.length) return digits;

      const totalDigits = tokens.reduce((a, t) => a + t.length, 0);
      const d = digits.replace(/\D/g, '').slice(0, totalDigits);

      const firstSep = seps[1] ?? '';
      const secondSep = seps[2] ?? '';

      if (d.length <= 2) {
        if (d.length === 2 && firstSep) return d + firstSep;
        return d;
      }

      if (d.length <= 4) {
        const dRaw = d.slice(0, 2);
        const mRaw = d.slice(2);

        let res = dRaw;
        if (firstSep) res += firstSep;

        if (mRaw.length) {
          res += mRaw;
          if (mRaw.length === 2 && secondSep) res += secondSep;
        }

        return res;
      }

      const dStr = d.slice(0, 2);
      const mStr = d.slice(2, 4);
      const yStr = d.slice(4, 8);

      let day = Number(dStr || '1');
      let month = Number(mStr || '1');
      let year = Number(yStr || '2000');

      month = clamp(month, 1, 12);

      if (!Number.isFinite(year) || year <= 0) year = 2000;
      year = Math.min(year, 9999);

      const maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);

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
        const rawSeg = ((rawSegs[i] ?? '') as string)
          .replace(/\D/g, '')
          .slice(0, len);

        const kind: PartKind =
          ch === 'd' ? 'day' : ch === 'M' ? 'month' : 'year';
        const closed = rawSeg.length >= len;

        parts.push({ kind, raw: rawSeg, len, closed, out: '' });
      }

      const dayPart = parts.find((p) => p.kind === 'day');
      const monthPart = parts.find((p) => p.kind === 'month');
      const yearPart = parts.find((p) => p.kind === 'year');

      let monthNumForClamp: number | null = null;

      if (monthPart && monthPart.closed && monthPart.raw) {
        let m = Number(monthPart.raw);
        if (!Number.isFinite(m)) m = 1;
        m = clamp(m, 1, 12);
        monthNumForClamp = m;
      }

      let yearForCalc = 2000;
      if (yearPart && yearPart.closed && yearPart.raw) {
        let y = Number(yearPart.raw);
        if (!Number.isFinite(y) || y <= 0) y = 2000;
        y = Math.min(y, 9999);
        yearForCalc = y;
      }

      if (monthPart) {
        if (monthPart.closed && monthPart.raw) {
          let m = monthNumForClamp ?? Number(monthPart.raw);
          if (!Number.isFinite(m)) m = 1;
          m = clamp(m, 1, 12);
          monthPart.out = String(m).padStart(monthPart.len, '0');
          monthNumForClamp = m;
        } else {
          monthPart.out = monthPart.raw;
        }
      }

      if (dayPart) {
        if (dayPart.closed && dayPart.raw) {
          let d = Number(dayPart.raw);
          if (!Number.isFinite(d)) d = 1;

          const monthForDay = monthNumForClamp !== null ? monthNumForClamp : 1;
          const maxDay = daysInMonth(yearForCalc, monthForDay);

          d = clamp(d, 1, maxDay);
          dayPart.out = String(d).padStart(dayPart.len, '0');
        } else {
          dayPart.out = dayPart.raw;
        }
      }

      if (yearPart) {
        yearPart.out = yearPart.raw;
      }

      const outSegs = parts.map((p) => p.out);
      const hasDigitsArr = parts.map((p) => p.raw.length > 0);

      let result = seps[0] ?? '';

      for (let i = 0; i < parts.length; i++) {
        result += outSegs[i] ?? '';

        if (i < parts.length - 1) {
          const sepFmt = seps[i + 1] ?? '';
          const hadRawSep = i < rawSeps.length;
          const segClosed = parts[i].closed;
          const nextHasDigits = hasDigitsArr[i + 1];

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

      month = clamp(month, 1, 12);

      if (!Number.isFinite(year) || year <= 0) year = 2000;
      year = Math.min(year, 9999);

      const maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);

      return formatDateFromParts(day, month, year, format);
    };

    const normalizePastedDate = (text: string, format: string): string => {
      if (!text) return '';

      const nums = text.match(/\d+/g) ?? [];
      if (!nums.length) return '';

      const { tokens } = splitDateFormat(format);

      let day = 1;
      let month = 1;
      let year = 2000;

      if (nums.length >= 3) {
        const a = nums[0] ?? '';
        const b = nums[1] ?? '';
        const c = nums[2] ?? '';

        const aNum = Number(a);
        const bNum = Number(b);
        const cNum = Number(c);

        if (a.length === 4) {
          year = aNum;
          month = bNum;
          day = cNum;
        } else if (c.length === 4) {
          day = aNum;
          month = bNum;
          year = cNum;
        } else {
          tokens.forEach((t, i) => {
            const rawNum = nums[i] ?? '';
            const n = Number(rawNum);
            if (!Number.isFinite(n)) return;

            if (t[0] === 'd') day = n;
            else if (t[0] === 'M') month = n;
            else year = n;
          });
        }
      } else {
        const digits = nums.join('').replace(/\D/g, '');
        return applyDateMaskDigitsOnly(digits, format);
      }

      if (!Number.isFinite(year) || year <= 0) year = 2000;
      year = Math.min(year, 9999);

      month = clamp(month, 1, 12);
      const maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);

      return formatDateFromParts(day, month, year, format);
    };

    const handleDateDigitKeydown = (digitChar: string) => {
      if (type !== 'date') return false;

      const format = fmt || 'dd/MM/yyyy';
      const { tokens } = splitDateFormat(format);
      if (!tokens.length) return false;

      const lens = tokens.map((t) => t.length);
      const totalDigits = lens.reduce((a, b) => a + b, 0);

      const currentDigits = (el.value ?? '')
        .replace(/\D/g, '')
        .slice(0, totalDigits);

      const caret = el.selectionStart ?? (el.value ?? '').length;
      const digitCursor = countDigitsBeforePos(el.value ?? '', caret);

      const ranges: Array<{
        start: number;
        end: number;
        kind: 'day' | 'month' | 'year';
      }> = [];

      let acc = 0;
      for (const tok of tokens) {
        const kind: 'day' | 'month' | 'year' =
          tok[0] === 'd' ? 'day' : tok[0] === 'M' ? 'month' : 'year';
        const len = tok.length;
        ranges.push({ start: acc, end: acc + len, kind });
        acc += len;
      }

      let idx = ranges.findIndex((r) => digitCursor < r.end);
      if (idx === -1) idx = ranges.length - 1;
      if (idx > 0 && digitCursor === ranges[idx].start) idx = idx - 1;

      const r = ranges[idx];
      const tokenLen = r.end - r.start;

      const tokenDigits = currentDigits.slice(r.start, r.end);
      const isFull = tokenDigits.length >= tokenLen;

      let rel = digitCursor - r.start;
      rel = clamp(rel, 0, tokenLen);

      let newToken = tokenDigits;

      if (!isFull) {
        newToken = (
          tokenDigits.slice(0, rel) +
          digitChar +
          tokenDigits.slice(rel)
        ).slice(0, tokenLen);
      } else {
        if (digitCursor >= r.end) {
          newToken = tokenDigits.slice(1) + digitChar;
        } else {
          newToken = (
            tokenDigits.slice(0, rel) +
            digitChar +
            tokenDigits.slice(rel + 1)
          ).slice(0, tokenLen);
        }
      }

      const before = currentDigits.slice(0, r.start);
      const after = currentDigits.slice(r.end);
      let nextDigits = (before + newToken + after).slice(0, totalDigits);

      const monthRange = ranges.find((x) => x.kind === 'month');
      const yearRange = ranges.find((x) => x.kind === 'year');

      const monthRaw = monthRange
        ? nextDigits.slice(monthRange.start, monthRange.end)
        : '';
      const yearRaw = yearRange
        ? nextDigits.slice(yearRange.start, yearRange.end)
        : '';

      if (r.kind === 'month' && newToken.length === 2) {
        let m = Number(newToken);
        if (!Number.isFinite(m)) m = 1;
        m = clamp(m, 1, 12);

        nextDigits =
          nextDigits.slice(0, r.start) +
          String(m).padStart(2, '0') +
          nextDigits.slice(r.end);
        nextDigits = nextDigits.slice(0, totalDigits);
      }

      if (r.kind === 'day' && newToken.length === 2) {
        let d = Number(newToken);
        if (!Number.isFinite(d)) d = 1;

        let m = Number(monthRaw);
        if (!Number.isFinite(m) || m < 1) m = 1;
        m = clamp(m, 1, 12);

        let y = Number(yearRaw);
        if (!Number.isFinite(y) || y <= 0) y = 2000;
        y = Math.min(y, 9999);

        const maxDay = daysInMonth(y, m);
        d = clamp(d, 1, maxDay);

        nextDigits =
          nextDigits.slice(0, r.start) +
          String(d).padStart(2, '0') +
          nextDigits.slice(r.end);
        nextDigits = nextDigits.slice(0, totalDigits);
      }

      if (yearRange) {
        const y = nextDigits.slice(yearRange.start, yearRange.end).slice(0, 4);
        nextDigits =
          nextDigits.slice(0, yearRange.start) +
          y +
          nextDigits.slice(yearRange.end);
        nextDigits = nextDigits.slice(0, totalDigits);
      }

      const masked = applyDateMaskDigitsOnly(nextDigits, format);

      const didRollAtEnd = isFull && digitCursor >= r.end;
      const nextDigitCursor = didRollAtEnd
        ? r.end
        : Math.min(totalDigits, digitCursor + 1);

      el.value = masked;
      dispatchInput();

      const nextCaret = caretPosAfterDigits(masked, nextDigitCursor);
      safeSetSelectionRange(nextCaret, nextCaret);

      return true;
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

      month = clamp(month, 1, 12);

      if (!Number.isFinite(year) || year <= 0) year = 2000;
      year = Math.min(year, 9999);

      let maxDay = daysInMonth(year, month);
      day = clamp(day, 1, maxDay);

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
        else year = Math.max(0, year - 1);
      }

      maxDay = daysInMonth(year > 0 ? year : 2000, month);
      if (day > maxDay) day = maxDay;

      const newValue = formatDateFromParts(day, month, year, format);
      el.value = newValue;
      dispatchInput();

      const newSegments = getDateSegments(newValue, format);
      const newSeg = newSegments[idx] ?? newSegments[newSegments.length - 1];
      if (newSeg) safeSetSelectionRange(newSeg.start, newSeg.end);
    };

    /* =========================================
     * Time helpers
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

        if (i < tokens.length - 1) {
          result += seps[i + 1] ?? '';
        }
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

      hour = clamp(hour, 0, 23);
      minute = clamp(minute, 0, 59);
      second = clamp(second, 0, 59);

      return formatTimeFromParts(hour, minute, second, format);
    };

    const applyTimeMaskDigitsOnly = (digits: string, format: string) => {
      const { tokens, seps } = splitTimeFormat(format);
      if (!tokens.length) return digits;

      const totalDigits = tokens.reduce((a, t) => a + t.length, 0);
      const d = digits.replace(/\D/g, '').slice(0, totalDigits);

      const firstSep = seps[1] ?? '';
      const secondSep = seps[2] ?? '';

      const hasMinutes = tokens.length >= 2 && tokens[1][0] === 'm';
      const hasSeconds = tokens.length >= 3 && tokens[2][0] === 's';

      if (hasMinutes && !hasSeconds) {
        if (d.length <= 2) {
          if (d.length === 2 && firstSep) return d + firstSep;
          return d;
        }

        if (d.length <= 4) {
          const hRaw = d.slice(0, 2);
          const mRaw = d.slice(2);

          let res = hRaw;
          if (firstSep) res += firstSep;
          if (mRaw.length) res += mRaw;

          return res;
        }

        const hStr = d.slice(0, 2);
        const mStr = d.slice(2, 4);

        let hour = Number(hStr || '0');
        let minute = Number(mStr || '0');

        hour = clamp(hour, 0, 23);
        minute = clamp(minute, 0, 59);

        return formatTimeFromParts(hour, minute, 0, format);
      }

      if (hasMinutes && hasSeconds) {
        if (d.length <= 2) {
          if (d.length === 2 && firstSep) return d + firstSep;
          return d;
        }

        if (d.length <= 4) {
          const hRaw = d.slice(0, 2);
          const mRaw = d.slice(2);

          let res = hRaw;
          if (firstSep) res += firstSep;

          if (mRaw.length) {
            res += mRaw;
            if (mRaw.length === 2 && secondSep) res += secondSep;
          }

          return res;
        }

        if (d.length <= 6) {
          const hRaw = d.slice(0, 2);
          const mRaw = d.slice(2, 4);
          const sRaw = d.slice(4);

          let res = hRaw;
          if (firstSep) res += firstSep;
          res += mRaw;
          if (secondSep) res += secondSep;
          res += sRaw;

          return res;
        }

        const hStr = d.slice(0, 2);
        const mStr = d.slice(2, 4);
        const sStr = d.slice(4, 6);

        let hour = Number(hStr || '0');
        let minute = Number(mStr || '0');
        let second = Number(sStr || '0');

        hour = clamp(hour, 0, 23);
        minute = clamp(minute, 0, 59);
        second = clamp(second, 0, 59);

        return formatTimeFromParts(hour, minute, second, format);
      }

      return d;
    };

    const applyTimeMask = (raw: string, format: string) => {
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
        const rawSeg = ((rawSegs[i] ?? '') as string)
          .replace(/\D/g, '')
          .slice(0, len);

        const kind: PartKind =
          ch === 'H' ? 'hour' : ch === 'm' ? 'minute' : 'second';
        const closed = rawSeg.length >= len;

        parts.push({ kind, raw: rawSeg, len, closed, out: '' });
      }

      const hourPart = parts.find((p) => p.kind === 'hour');
      const minutePart = parts.find((p) => p.kind === 'minute');
      const secondPart = parts.find((p) => p.kind === 'second');

      let hour = hourPart?.raw ? Number(hourPart.raw) : 0;
      let minute = minutePart?.raw ? Number(minutePart.raw) : 0;
      let second = secondPart?.raw ? Number(secondPart.raw) : 0;

      if (hourPart) {
        if (hourPart.closed && hourPart.raw) {
          if (hour < 0) hour = 0;
          if (hour > 23) hour = 23;
          hourPart.out = String(hour).padStart(hourPart.len, '0');
        } else {
          hourPart.out = hourPart.raw;
        }
      }

      if (minutePart) {
        if (minutePart.closed && minutePart.raw) {
          if (minute < 0) minute = 0;
          if (minute > 59) minute = 59;
          minutePart.out = String(minute).padStart(minutePart.len, '0');
        } else {
          minutePart.out = minutePart.raw;
        }
      }

      if (secondPart) {
        if (secondPart.closed && secondPart.raw) {
          if (second < 0) second = 0;
          if (second > 59) second = 59;
          secondPart.out = String(second).padStart(secondPart.len, '0');
        } else {
          secondPart.out = secondPart.raw;
        }
      }

      const outSegs = parts.map((p) => p.out);
      const hasDigitsArr = parts.map((p) => p.raw.length > 0);

      let result = seps[0] ?? '';

      for (let i = 0; i < parts.length; i++) {
        result += outSegs[i] ?? '';

        if (i < parts.length - 1) {
          const sepFmt = seps[i + 1] ?? '';
          const hadRawSep = i < rawSeps.length;
          const segClosed = parts[i].closed;
          const nextHasDigits = hasDigitsArr[i + 1];

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

    const normalizePastedTime = (text: string, format: string): string => {
      if (!text) return '';

      const nums = text.match(/\d+/g) ?? [];
      if (!nums.length) return '';

      const digits = nums.join('');

      let hour = 0;
      let minute = 0;
      let second = 0;

      if (digits.length >= 2) hour = Number(digits.slice(0, 2));
      if (digits.length >= 4) minute = Number(digits.slice(2, 4));
      if (digits.length >= 6) second = Number(digits.slice(4, 6));

      hour = clamp(hour, 0, 23);
      minute = clamp(minute, 0, 59);
      second = clamp(second, 0, 59);

      return formatTimeFromParts(hour, minute, second, format);
    };

    const handleTimeDigitKeydown = (digitChar: string) => {
      if (type !== 'time') return false;

      const format = fmt || 'HH:mm';
      const { tokens } = splitTimeFormat(format);
      if (!tokens.length) return false;

      const lens = tokens.map((t) => t.length);
      const totalDigits = lens.reduce((a, b) => a + b, 0);

      const currentDigits = (el.value ?? '')
        .replace(/\D/g, '')
        .slice(0, totalDigits);

      const caret = el.selectionStart ?? (el.value ?? '').length;
      const digitCursor = countDigitsBeforePos(el.value ?? '', caret);

      const ranges: Array<{
        start: number;
        end: number;
        kind: 'hour' | 'minute' | 'second';
      }> = [];

      let acc = 0;
      for (const tok of tokens) {
        const kind: 'hour' | 'minute' | 'second' =
          tok[0] === 'H' ? 'hour' : tok[0] === 'm' ? 'minute' : 'second';
        const len = tok.length;
        ranges.push({ start: acc, end: acc + len, kind });
        acc += len;
      }

      let idx = ranges.findIndex((r) => digitCursor < r.end);
      if (idx === -1) idx = ranges.length - 1;
      if (idx > 0 && digitCursor === ranges[idx].start) idx = idx - 1;

      const r = ranges[idx];
      const tokenLen = r.end - r.start;

      const tokenDigits = currentDigits.slice(r.start, r.end);
      const isFull = tokenDigits.length >= tokenLen;

      let rel = digitCursor - r.start;
      rel = clamp(rel, 0, tokenLen);

      let newToken = tokenDigits;

      if (!isFull) {
        newToken = (
          tokenDigits.slice(0, rel) +
          digitChar +
          tokenDigits.slice(rel)
        ).slice(0, tokenLen);
      } else {
        if (digitCursor >= r.end) {
          newToken = tokenDigits.slice(1) + digitChar;
        } else {
          newToken = (
            tokenDigits.slice(0, rel) +
            digitChar +
            tokenDigits.slice(rel + 1)
          ).slice(0, tokenLen);
        }
      }

      const before = currentDigits.slice(0, r.start);
      const after = currentDigits.slice(r.end);
      let nextDigits = (before + newToken + after).slice(0, totalDigits);

      const read2 = (start: number, end: number) =>
        Number(nextDigits.slice(start, end) || '0');

      const hourR = ranges.find((x) => x.kind === 'hour');
      const minR = ranges.find((x) => x.kind === 'minute');
      const secR = ranges.find((x) => x.kind === 'second');

      if (r.kind === 'hour' && newToken.length === 2 && hourR) {
        let h = read2(hourR.start, hourR.end);
        if (!Number.isFinite(h)) h = 0;
        h = clamp(h, 0, 23);
        nextDigits =
          nextDigits.slice(0, hourR.start) +
          String(h).padStart(2, '0') +
          nextDigits.slice(hourR.end);
      }

      if (r.kind === 'minute' && newToken.length === 2 && minR) {
        let m = read2(minR.start, minR.end);
        if (!Number.isFinite(m)) m = 0;
        m = clamp(m, 0, 59);
        nextDigits =
          nextDigits.slice(0, minR.start) +
          String(m).padStart(2, '0') +
          nextDigits.slice(minR.end);
      }

      if (r.kind === 'second' && newToken.length === 2 && secR) {
        let s = read2(secR.start, secR.end);
        if (!Number.isFinite(s)) s = 0;
        s = clamp(s, 0, 59);
        nextDigits =
          nextDigits.slice(0, secR.start) +
          String(s).padStart(2, '0') +
          nextDigits.slice(secR.end);
      }

      const masked = applyTimeMaskDigitsOnly(nextDigits, format);

      const didRollAtEnd = isFull && digitCursor >= r.end;
      const nextDigitCursor = didRollAtEnd
        ? r.end
        : Math.min(totalDigits, digitCursor + 1);

      el.value = masked;
      dispatchInput();

      const nextCaret = caretPosAfterDigits(masked, nextDigitCursor);
      safeSetSelectionRange(nextCaret, nextCaret);

      return true;
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

      if (type === 'date' && fmt) {
        next = applyDateMask(raw, fmt);
      } else if (type === 'time' && fmt) {
        next = applyTimeMask(raw, fmt);
      } else if (type === 'integer') {
        next = applyNumericMask(raw, false);
      } else if (type === 'number' || type === 'currency') {
        next = applyNumericMask(raw, true);
      } else if (type === 'lowercase' || type === 'uppercase') {
        next = applyTextCaseMask(raw, type);
      }

      if (next !== raw) {
        setValue(next, { emit: false });
      }
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

    const onPaste = (e: ClipboardEvent) => {
      if (el.readOnly || el.disabled) return;
      if (!mask) return;

      const text = e.clipboardData?.getData('text');
      if (!text) return;

      e.preventDefault();

      let next = '';

      if (type === 'date' && fmt) {
        next = normalizePastedDate(text, fmt);
      } else if (type === 'time' && fmt) {
        next = normalizePastedTime(text, fmt);
      } else if (type === 'integer') {
        next = text.replace(/\D/g, '');
      } else if (type === 'number' || type === 'currency') {
        next = applyNumericMask(text, true);
      } else {
        return;
      }

      el.value = next;
      dispatchInput();
      safeSetSelectionRange(next.length, next.length);
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (el.readOnly || el.disabled) return;

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

      if (type === 'date' && fmt && e.key === 'Enter') {
        e.preventDefault();
        if (el.value) {
          const norm = normalizeDateValue(el.value, fmt);
          if (norm !== el.value) {
            el.value = norm;
            dispatchInput();
          }
        }
        return;
      }

      if (type === 'time' && fmt && e.key === 'Enter') {
        e.preventDefault();
        if (el.value) {
          const norm = normalizeTimeValue(el.value, fmt);
          if (norm !== el.value) {
            el.value = norm;
            dispatchInput();
          }
        }
        return;
      }

      if (isControlKey(e)) return;

      if (type === 'lowercase' || type === 'uppercase') {
        return;
      }

      if (type === 'date' || type === 'time') {
        const format = fmt || '';
        const allowedSeps = new Set<string>();

        for (const c of format) {
          if (!/[dMyHms]/.test(c)) {
            allowedSeps.add(c);
          }
        }

        if (/\d/.test(e.key)) {
          e.preventDefault();

          if (type === 'date') {
            handleDateDigitKeydown(e.key);
          } else {
            handleTimeDigitKeydown(e.key);
          }

          return;
        }

        if (allowedSeps.has(e.key)) return;

        e.preventDefault();
        return;
      }

      if (type === 'integer') {
        if (!/\d/.test(e.key)) e.preventDefault();
        return;
      }

      if (type === 'number' || type === 'currency') {
        if (/\d/.test(e.key)) return;

        if (e.key === '.' || e.key === ',') {
          const v = el.value ?? '';
          if (v.includes('.') || v.includes(',')) {
            e.preventDefault();
          }
          return;
        }

        e.preventDefault();
      }
    };

    el.addEventListener('input', onInput);
    el.addEventListener('blur', onBlur);
    el.addEventListener('focus', onFocus);
    el.addEventListener('keydown', onKeydown);
    el.addEventListener('paste', onPaste);

    return () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('keydown', onKeydown);
      el.removeEventListener('paste', onPaste);
    };
  }, [inputRef, mask, enableDefault]);
}

/* =========================================
 * IInputAddon
 * ========================================= */

export type IInputAddonProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> & {
  addon: IInputAddons | undefined;
};

export function IInputAddon(props: IInputAddonProps) {
  const { addon, className, ...rest } = props;

  if (!addon || addon.visible === false) {
    return null;
  }

  return (
    <i-input-addon class={className} kind={addon.type} {...rest}>
      {addon.type === 'button' ? (
        <IButton
          size="xs"
          type="button"
          icon={addon.icon}
          variant={addon.variant ?? 'primary'}
          onClick={() => (addon.onClick ? addon.onClick() : null)}
        />
      ) : addon.type === 'link' ? (
        <a
          className="i-btn i-btn-xs"
          target="_blank"
          variant={addon.variant ?? 'primary'}
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
 * IInput
 * ========================================= */

export type IInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children' | 'value' | 'defaultValue' | 'readOnly' | 'prepend'
> & {
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  readonly?: boolean;
  invalid?: boolean;
  disabled?: boolean;

  mask?: IInputMask;

  /**
   * Applies today's date/current time to an initially empty date/time mask.
   * Defaults to `true`; composite controls such as `IDatepicker` disable it.
   */
  autoDefault?: boolean;

  prepend?: IInputAddons | IInputAddons[];
  append?: IInputAddons | IInputAddons[] | IInputAddonLoading;

  value?: string | null;

  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

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
      autoDefault = true,
      prepend,
      append,
      value,
      className,
      onInput,
      onBlur,
      inputRef: inputRefProp,
      ...rest
    } = props;

    const inputRef = inputRefProp;
    const innerRef = useRef<HTMLInputElement | null>(null);

    useInputMask(innerRef, mask, { enableDefault: autoDefault });

    const prepends = useMemo(() => normalizeArray(prepend), [prepend]);
    const appends = useMemo(
      () => normalizeArray(append as IInputAddons | IInputAddons[] | undefined),
      [append]
    );

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (inputRef) {
        inputRef.current = node;
      }

      if (!forwardedRef) return;

      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    };

    const handleHostClick: React.MouseEventHandler<HTMLElement> = (event) => {
      if (disabled || !innerRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (target && target.closest('i-input-addon')) {
        return;
      }

      innerRef.current.focus();
    };

    return (
      <i-input class={className} onClick={handleHostClick}>
        {prepends.map((item, index) => (
          <IInputAddon key={`prepend-${index}`} addon={item} />
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
          onBlur={onBlur}
          onInput={onInput}
        />

        {appends.map((item, index) => (
          <IInputAddon key={`append-${index}`} addon={item} />
        ))}
      </i-input>
    );
  }
);

/* =========================================
 * IFCInput
 * React wrapper equivalent
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
  invalid?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  required?: boolean;
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
    disabled = false,
    required = false,
    onInput,
    onBlur,
    className,
    ...hostProps
  } = props;

  const innerRef = useRef<HTMLInputElement | null>(null);

  const focusInnerInput = () => {
    if (!disabled && innerRef.current) {
      innerRef.current.focus();
    }
  };

  return (
    <i-fc-input class={className} {...hostProps}>
      {label ? (
        <label className="i-fc-input__label" onClick={focusInnerInput}>
          {label} :
          {required ? <span className="i-fc-input__required">*</span> : null}
        </label>
      ) : null}

      <IInput
        inputRef={innerRef}
        append={append}
        autocomplete={autocomplete}
        disabled={disabled}
        invalid={invalid}
        mask={mask}
        placeholder={placeholder}
        prepend={prepend}
        readonly={readonly}
        type={type}
        value={value ?? ''}
        onBlur={onBlur}
        onInput={onInput}
      />

      {invalid && errorMessage ? (
        <div className="i-fc-input__error">{errorMessage}</div>
      ) : null}
    </i-fc-input>
  );
}
