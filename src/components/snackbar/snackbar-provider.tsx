/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ISnackbar } from './snackbar';
import { SnackbarContext } from './snackbar-context';
import { nextSnackbarId } from './snackbar-runtime';
import type {
  ISnackbarChanges,
  ISnackbarDefaults,
  ISnackbarDismissReason,
  ISnackbarOptions,
} from './snackbar.types';

export class ISnackbarRef {
  readonly id: string;
  private readonly result: Promise<ISnackbarDismissReason>;
  private resolve!: (reason: ISnackbarDismissReason) => void;
  private readonly close: () => void;
  constructor(id: string, close: () => void) {
    this.id = id;
    this.close = close;
    this.result = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  dismiss(): void {
    this.close();
  }
  afterDismissed(): Promise<ISnackbarDismissReason> {
    return this.result;
  }
  complete(reason: ISnackbarDismissReason): void {
    this.resolve(reason);
  }
}

export interface ISnackbarApi {
  show(message: string, options?: ISnackbarOptions): ISnackbarRef;
  update(id: string, changes: ISnackbarChanges): void;
  dismiss(id: string): void;
  dismissAll(): void;
}

type Entry = {
  ref: ISnackbarRef;
  message: string;
  options: ISnackbarOptions;
  revision: number;
  open: boolean;
};

export function ISnackbarProvider({
  children,
  maxVisible,
}: ISnackbarDefaults & { children?: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const instances = useRef(new Map<string, Entry>());
  const [scope] = useState(() => ({}));
  const api = useMemo<ISnackbarApi>(() => {
    const refresh = (): void => setEntries([...instances.current.values()]);
    const api: ISnackbarApi = {
      show(message, options = {}) {
        const id = options.id ?? nextSnackbarId();
        const existing = instances.current.get(id);
        if (existing) {
          api.update(id, { ...options, message });
          return existing.ref;
        }
        const ref = new ISnackbarRef(id, () => api.dismiss(id));
        if (
          typeof document === 'undefined' ||
          (!message.trim() && !options.title?.trim())
        ) {
          ref.complete('programmatic');
          return ref;
        }
        instances.current.set(id, {
          ref,
          message,
          options: { ...options, id },
          revision: 0,
          open: true,
        });
        refresh();
        return ref;
      },
      update(id, changes) {
        const existing = instances.current.get(id);
        if (!existing) return;
        instances.current.set(id, {
          ...existing,
          message: changes.message ?? existing.message,
          options: { ...existing.options, ...changes },
          revision: existing.revision + 1,
          open: true,
        });
        refresh();
      },
      dismiss(id) {
        const existing = instances.current.get(id);
        if (!existing) return;
        instances.current.set(id, { ...existing, open: false });
        refresh();
      },
      dismissAll() {
        for (const id of instances.current.keys()) api.dismiss(id);
      },
    };
    return api;
  }, []);
  useEffect(
    () => () => {
      for (const entry of instances.current.values())
        entry.ref.complete('programmatic');
      instances.current.clear();
    },
    []
  );
  const value = useMemo(
    () => ({ api, scope, maxVisible }),
    [api, scope, maxVisible]
  );
  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {entries.map((entry) => (
        <ISnackbar
          key={entry.ref.id}
          {...entry.options}
          message={entry.message}
          resetKey={entry.revision}
          open={entry.open}
          onOpenChange={() => api.dismiss(entry.ref.id)}
          onAction={() =>
            instances.current.get(entry.ref.id)?.options.onAction?.()
          }
          onAfterDismissed={(reason) => {
            if (instances.current.get(entry.ref.id)?.ref !== entry.ref) return;
            instances.current.delete(entry.ref.id);
            setEntries([...instances.current.values()]);
            entry.ref.complete(reason);
          }}
        />
      ))}
    </SnackbarContext.Provider>
  );
}

export function useISnackbar(): ISnackbarApi {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useISnackbar requires ISnackbarProvider.');
  return context.api;
}
