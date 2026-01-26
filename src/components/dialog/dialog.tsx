// dialog.tsx (React) — full updated file (visible removed from action types)
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { IButton, type IButtonVariant } from '../button/button';
import { IIcon, type IIconName } from '../icon/icon';
import { IFCTextArea } from '../textarea/textarea';

/* =========================================================
 * Types (matches Angular)
 * ========================================================= */

export type IDialogConfig<TData = any> = {
  id?: string;
  data?: TData;
  width?: string;
  height?: string;
  disableClose?: boolean; // ignore ESC/backdrop
  backdropClose?: boolean; // allow click backdrop to close
};

export type IAlertData = {
  title: string;
  description: string;
  type: 'information' | 'success' | 'warning' | 'danger';
};

export type IConfirmData = {
  title: string;
  description: string;
  type: 'information' | 'success' | 'warning' | 'danger';
  reason?: boolean;
};

type Listener<T> = (value: T) => void;

export class IDialogRef<TResult = any> {
  private _closed = false;
  private _result: TResult | undefined = undefined;
  private _listeners = new Set<Listener<TResult | undefined>>();
  private _resolve!: (v: TResult | undefined) => void;
  private _promise: Promise<TResult | undefined>;

  constructor() {
    this._promise = new Promise<TResult | undefined>((resolve) => {
      this._resolve = resolve;
    });
  }

  close(result?: TResult): void {
    if (this._closed) return;
    this._closed = true;
    this._result = result;

    for (const l of this._listeners) l(this._result);
    this._listeners.clear();

    this._resolve(this._result);
  }

  /** Promise style */
  afterClosed(): Promise<TResult | undefined> {
    return this._promise;
  }

  /** Observable-like subscribe (no rxjs dependency) */
  subscribe(cb: Listener<TResult | undefined>): () => void {
    if (this._closed) {
      cb(this._result);
      return () => {};
    }
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }
}

export type IDialogInstance<TData = any, TResult = any> = {
  id: string;
  component: React.ComponentType<any>;
  config: Required<IDialogConfig<TData>>;
  ref: IDialogRef<TResult>;
};

/* =========================================================
 * Provider (service state)
 * ========================================================= */

let DIALOG_ID_COUNTER = 0;

type DialogApi = {
  dialogs: IDialogInstance[];
  open: <TData = any, TResult = any>(
    component: React.ComponentType<any>,
    config?: IDialogConfig<TData>
  ) => IDialogRef<TResult>;
  closeById: (id: string, result?: any) => void;
  closeAll: () => void;
};

const DialogContext = createContext<DialogApi | null>(null);

type DialogInstanceContextValue = {
  data: any;
  dialogRef: IDialogRef<any>;
};

const DialogInstanceContext = createContext<DialogInstanceContextValue | null>(
  null
);

export function useIDialog(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx)
    throw new Error('useIDialog() must be used inside <IDialogProvider>.');
  return ctx;
}

/** React equivalent to inject(I_DIALOG_DATA) */
export function useDialogData<T = any>(): T {
  const ctx = useContext(DialogInstanceContext);
  return (ctx?.data ?? undefined) as T;
}

/** React equivalent to inject(IDialogRef) */
export function useDialogRef<TResult = any>(): IDialogRef<TResult> {
  const ctx = useContext(DialogInstanceContext);
  if (!ctx?.dialogRef) {
    throw new Error('useDialogRef() must be used inside a dialog component.');
  }
  return ctx.dialogRef as IDialogRef<TResult>;
}

/** Optional version (lets <IDialog> be used outside the service too) */
function useOptionalDialogRef<TResult = any>(): IDialogRef<TResult> | null {
  const ctx = useContext(DialogInstanceContext);
  return (ctx?.dialogRef ?? null) as IDialogRef<TResult> | null;
}

export type IDialogProviderProps = {
  children?: ReactNode;
};

export function IDialogProvider(props: IDialogProviderProps) {
  const { children } = props;
  const [dialogs, setDialogs] = useState<IDialogInstance[]>([]);

  const open: DialogApi['open'] = useCallback((component, config = {}) => {
    const id = config.id ?? `i-dialog-${++DIALOG_ID_COUNTER}`;
    const ref = new IDialogRef<any>();

    const instance: IDialogInstance<any, any> = {
      id,
      component,
      config: {
        width: config.width ?? 'auto',
        height: config.height ?? 'auto',
        disableClose: config.disableClose ?? false,
        backdropClose: config.backdropClose ?? true,
        data: (config.data as any) ?? (undefined as any),
        id,
      },
      ref,
    };

    setDialogs((prev) => [...prev, instance]);

    ref.subscribe(() => {
      setDialogs((prev) => prev.filter((d) => d.id !== id));
    });

    return ref as IDialogRef<any>;
  }, []);

  const closeById = useCallback(
    (id: string, result?: any) => {
      const inst = dialogs.find((d) => d.id === id);
      inst?.ref.close(result);
    },
    [dialogs]
  );

  const closeAll = useCallback(() => {
    dialogs.forEach((d) => d.ref.close(undefined));
  }, [dialogs]);

  const api = useMemo<DialogApi>(
    () => ({ dialogs, open, closeById, closeAll }),
    [dialogs, open, closeById, closeAll]
  );

  return (
    <DialogContext.Provider value={api}>{children}</DialogContext.Provider>
  );
}

/* =========================================================
 * Outlet + Container (Angular-like)
 * ========================================================= */

type IDialogContainerProps = {
  instance: IDialogInstance;
  isTopMost: boolean;
};

function IDialogContainer(props: IDialogContainerProps) {
  const { instance, isTopMost } = props;
  const { width, height, disableClose, backdropClose } = instance.config;

  const onEsc = useCallback(
    (e: KeyboardEvent) => {
      if (!isTopMost) return;
      if (e.key !== 'Escape') return;
      if (disableClose) return;
      instance.ref.close(undefined);
    },
    [isTopMost, disableClose, instance.ref]
  );

  useEffect(() => {
    document.addEventListener('keydown', onEsc, true);
    return () => document.removeEventListener('keydown', onEsc, true);
  }, [onEsc]);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (!isTopMost) return;
    if (disableClose) return;
    if (!backdropClose) return;

    e.preventDefault();
    instance.ref.close(undefined);
  };

  const panelStyles: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  const Comp = instance.component;

  return (
    <i-dialog-container data-dialog-id={instance.id}>
      <div className="i-dialog-backdrop" onClick={onBackdropClick} />
      <div className="i-dialog-wrapper">
        <div className="i-dialog-panel" style={panelStyles}>
          <DialogInstanceContext.Provider
            value={{ data: instance.config.data, dialogRef: instance.ref }}>
            <Comp />
          </DialogInstanceContext.Provider>
        </div>
      </div>
    </i-dialog-container>
  );
}

/** Put this once near app root (Option A) */
export function IDialogOutlet() {
  const { dialogs } = useIDialog();

  return (
    <i-dialog-outlet>
      {dialogs.map((dialog, idx) => {
        const last = idx === dialogs.length - 1;
        return (
          <IDialogContainer
            key={dialog.id}
            instance={dialog}
            isTopMost={last}
          />
        );
      })}
    </i-dialog-outlet>
  );
}

/* =========================================================
 * i-dialog-close replacement
 * ========================================================= */

export type IDialogCloseProps = {
  result?: any;
  children?: ReactNode;
  className?: string;
};

export function IDialogClose(props: IDialogCloseProps) {
  const { result, children, className } = props;
  const ref = useDialogRef<any>();

  return (
    <span
      className={className}
      onClick={(e) => {
        e.preventDefault();
        ref.close(result);
      }}>
      {children}
    </span>
  );
}

/* =========================================================
 * Public <IDialog> (title + actions) — mirrors Angular
 * ========================================================= */

export type IDialogActionTypes = {
  type: 'cancel' | 'save' | 'ok' | 'confirm' | 'custom';
};
export type IDialogActionType = IDialogActionTypes['type'];

export type IDialogActionCancel = {
  type: 'cancel';
  className?: string;
};

export type IDialogActionSave = {
  type: 'save';
  className?: string;
};

export type IDialogActionOK = {
  type: 'ok';
  className?: string;
};

export type IDialogActionConfirm = {
  type: 'confirm';
  className?: string;
};

export type IDialogActionCustom = {
  type: 'custom';
  label: string;
  variant?: IButtonVariant;
  icon?: IIconName | string;
  className?: string;
  onClick?: () => void;
};

export type IDialogActionObject =
  | IDialogActionCancel
  | IDialogActionSave
  | IDialogActionOK
  | IDialogActionConfirm
  | IDialogActionCustom;

export type DialogAction = IDialogActionType | IDialogActionObject;

export type IDialogProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  actions?: DialogAction[];

  /** on* prefix (matches Angular Outputs) */
  onOk?: (value?: any) => void;
  onConfirm?: (value?: any) => void;
  onSave?: (value?: any) => void;
  onCustomAction?: (action: IDialogActionObject) => void;

  children?: ReactNode;
};

function normalizeActions(
  actions: DialogAction[] | undefined
): IDialogActionObject[] {
  return (actions ?? ['save', 'cancel']).map((a) =>
    typeof a === 'string' ? ({ type: a } as IDialogActionObject) : a
  );
}

export function IDialog(props: IDialogProps) {
  const {
    title,
    actions = ['save', 'cancel'],

    onOk,
    onConfirm,
    onSave,
    onCustomAction,

    children,
    ...rest
  } = props;

  // ✅ safe: if used outside dialog context, cancel just no-ops
  const dialogRef = useOptionalDialogRef<any>();

  const normalized = useMemo(() => normalizeActions(actions), [actions]);

  const saveAction = normalized.find((a) => a.type === 'save') as
    | IDialogActionSave
    | undefined;
  const okAction = normalized.find((a) => a.type === 'ok') as
    | IDialogActionOK
    | undefined;
  const confirmAction = normalized.find((a) => a.type === 'confirm') as
    | IDialogActionConfirm
    | undefined;
  const cancelAction = normalized.find((a) => a.type === 'cancel') as
    | IDialogActionCancel
    | undefined;

  const customActions = normalized.filter(
    (a) => a.type === 'custom'
  ) as IDialogActionCustom[];

  // Angular renders actions block if actions.length > 0
  const hasActionsBlock = (actions ?? []).length > 0;

  const hasBuiltInActions = !!(
    okAction ||
    confirmAction ||
    saveAction ||
    cancelAction
  );

  return (
    <i-dialog {...rest}>
      {title ? <h4 className="i-dialog-title">{title}</h4> : null}

      <div className="i-dialog-content">{children}</div>

      {hasActionsBlock ? (
        <div className="i-dialog-actions">
          {customActions.length > 0
            ? customActions.map((a, idx) => (
                <IButton
                  key={idx}
                  icon={a.icon as any}
                  className={a.className}
                  variant={a.variant || 'primary'}
                  onClick={() => {
                    // Angular: only emits onCustomAction (does NOT call a.onClick)
                    onCustomAction?.(a);
                  }}>
                  {a.label}
                </IButton>
              ))
            : null}

          {hasBuiltInActions && customActions.length > 0 ? (
            <span className="flex-fill" />
          ) : null}

          {okAction ? (
            <IButton
              icon="check"
              variant="primary"
              className={okAction.className}
              onClick={() => onOk?.()}>
              OK
            </IButton>
          ) : null}

          {confirmAction ? (
            <IButton
              icon="save"
              variant="primary"
              className={confirmAction.className}
              onClick={() => onConfirm?.()}>
              Confirm
            </IButton>
          ) : null}

          {saveAction ? (
            <IButton
              icon="save"
              variant="primary"
              className={saveAction.className}
              onClick={() => onSave?.()}>
              Save
            </IButton>
          ) : null}

          {cancelAction ? (
            <IButton
              icon="cancel"
              variant="danger"
              className={cancelAction.className}
              onClick={(e) => {
                e.preventDefault();
                dialogRef?.close(undefined); // Angular closes with undefined
              }}>
              Cancel
            </IButton>
          ) : null}
        </div>
      ) : null}
    </i-dialog>
  );
}

/* =========================================================
 * ALERT (React port)
 * ========================================================= */

export function IAlert() {
  const data = useDialogData<IAlertData>();
  const dialog = useDialogRef<boolean>();

  const alertClass = `i-alert i-alert-${data.type}`;

  return (
    <IDialog
      className={alertClass}
      actions={[{ type: 'ok', className: 'w-full' }]}
      onOk={() => dialog.close(true)}>
      {data.type === 'information' ? <IIcon icon="info" size="3xl" /> : null}
      {data.type === 'success' ? (
        <IIcon icon="check-circle" size="3xl" />
      ) : null}
      {data.type === 'warning' ? <IIcon icon="exclamation" size="3xl" /> : null}
      {data.type === 'danger' ? <IIcon icon="x-circle" size="3xl" /> : null}

      <h4>{data.title}</h4>
      <p dangerouslySetInnerHTML={{ __html: data.description }} />
    </IDialog>
  );
}

export function useIAlertService() {
  const dialog = useIDialog();

  const show = useCallback(
    async (data: IAlertData) => {
      const ref = dialog.open<IAlertData, boolean>(IAlert, {
        width: '',
        data,
        disableClose: true,
      });
      const result = await ref.afterClosed();
      return !!result;
    },
    [dialog]
  );

  return useMemo(
    () => ({
      show,
      information: (title: string, description: string) =>
        show({ title, description, type: 'information' }),
      success: (title: string, description: string) =>
        show({ title, description, type: 'success' }),
      warning: (title: string, description: string) =>
        show({ title, description, type: 'warning' }),
      danger: (title: string, description: string) =>
        show({ title, description, type: 'danger' }),
    }),
    [show]
  );
}

/* =========================================================
 * CONFIRM (React port)
 * ========================================================= */

export function IConfirm() {
  const data = useDialogData<IConfirmData>();
  const dialog = useDialogRef<any>();

  const [reason, setReason] = useState<string>('');
  const [invalid, setInvalid] = useState(false);

  const confirmClass = `i-confirm i-confirm-${data.type}`;

  const submit = () => {
    if (data.reason) {
      const ok = !!reason.trim();
      setInvalid(!ok);
      if (!ok) return;
      dialog.close(reason);
      return;
    }
    dialog.close(true);
  };

  return (
    <IDialog
      className={confirmClass}
      actions={[
        { type: 'confirm', className: 'w-104' },
        { type: 'cancel', className: 'w-104' },
      ]}
      onConfirm={submit}>
      {data.type === 'information' ? <IIcon icon="info" size="3xl" /> : null}
      {data.type === 'success' ? (
        <IIcon icon="check-circle" size="3xl" />
      ) : null}
      {data.type === 'warning' ? <IIcon icon="exclamation" size="3xl" /> : null}
      {data.type === 'danger' ? <IIcon icon="x-circle" size="3xl" /> : null}

      <h4>{data.title}</h4>
      <p dangerouslySetInnerHTML={{ __html: data.description }} />

      {data.reason ? (
        <form
          className="mt-xs"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}>
          <IFCTextArea
            label="Reason"
            placeholder="Fill your reason here.."
            value={reason}
            onChange={(v) => {
              setReason(v);
              if (invalid) setInvalid(false);
            }}
            invalid={invalid}
            errorMessage={{ required: 'Please fill in the reason..' }}
            errorKey="required"
          />
          <button className="hidden" type="submit">
            Submit
          </button>
        </form>
      ) : null}
    </IDialog>
  );
}

export function useIConfirmService() {
  const dialog = useIDialog();

  const show = useCallback(
    async (data: IConfirmData) => {
      const ref = dialog.open<IConfirmData, any>(IConfirm, {
        width: '',
        data,
      });
      return ref.afterClosed();
    },
    [dialog]
  );

  return useMemo(
    () => ({
      show,
      information: async (title: string, description: string) => {
        const r = await show({ title, description, type: 'information' });
        return !!r;
      },
      success: async (title: string, description: string) => {
        const r = await show({ title, description, type: 'success' });
        return !!r;
      },
      warning: (title: string, description: string, reason?: boolean) =>
        show({ title, description, type: 'warning', reason }),
      danger: (title: string, description: string, reason?: boolean) =>
        show({ title, description, type: 'danger', reason }),
    }),
    [show]
  );
}

/** DONT REMOVE THIS, ITS FOR REMINDER
  <IDialogProvider>
    <App />
    <IDialogOutlet />
  </IDialogProvider>
*/
