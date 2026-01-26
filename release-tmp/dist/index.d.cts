import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode, HTMLAttributes } from 'react';
import { Observable } from 'rxjs';

declare const I_ICON_NAMES: {
    readonly add: "fa-solid fa-plus";
    readonly 'angle-down': "fa-solid fa-angle-down";
    readonly 'angle-up': "fa-solid fa-angle-up";
    readonly 'arrow-down': "fa-solid fa-arrow-down";
    readonly 'arrow-up': "fa-solid fa-arrow-up";
    readonly back: "fa-solid fa-chevron-left";
    readonly bars: "fa-solid fa-bars";
    readonly cancel: "fa-solid fa-xmark";
    readonly calendar: "fa-solid fa-calendar-days";
    readonly check: "fa-solid fa-check";
    readonly 'check-circle': "fa-solid fa-circle-check";
    readonly code: "fa-solid fa-code";
    readonly delete: "fa-solid fa-trash";
    readonly edit: "fa-solid fa-pen";
    readonly ellipsis: "fa-solid fa-ellipsis";
    readonly exclamation: "fa-solid fa-circle-exclamation";
    readonly 'file-excel': "fa-solid fa-file-excel";
    readonly 'file-pdf': "fa-solid fa-file-pdf";
    readonly 'folder-open': "fa-solid fa-folder-open";
    readonly hashtag: "fa-solid fa-hashtag";
    readonly info: "fa-solid fa-circle-info";
    readonly 'layer-group': "fa-solid fa-layer-group";
    readonly link: "fa-solid fa-arrow-up-right-from-square";
    readonly maximize: "fa-solid fa-window-maximize";
    readonly 'map-marker': "fa-solid fa-location-dot";
    readonly next: "fa-solid fa-chevron-right";
    readonly prev: "fa-solid fa-chevron-left";
    readonly up: "fa-solid fa-angle-up";
    readonly down: "fa-solid fa-angle-down";
    readonly save: "fa-solid fa-floppy-disk";
    readonly signature: "fa-solid fa-file-signature";
    readonly 'sort-asc': "fa-solid fa-arrow-down-a-z";
    readonly 'sort-dsc': "fa-solid fa-arrow-down-z-a";
    readonly sync: "fa-solid fa-arrows-rotate";
    readonly tags: "fa-solid fa-tags";
    readonly user: "fa-solid fa-user";
    readonly users: "fa-solid fa-users";
    readonly unlock: "fa-solid fa-unlock";
    readonly upload: "fa-solid fa-cloud-arrow-up";
    readonly view: "fa-solid fa-eye";
    readonly x: "fa-solid fa-xmark";
    readonly 'x-circle': "fa-solid fa-circle-xmark";
};
declare const I_ICON_SIZES: {
    readonly '2xs': "i-icon-2xs";
    readonly xs: "i-icon-xs";
    readonly sm: "i-icon-sm";
    readonly md: "i-icon-md";
    readonly lg: "i-icon-lg";
    readonly xl: "i-icon-xl";
    readonly '2xl': "i-icon-2xl";
    readonly '3xl': "i-icon-3xl";
    readonly '4xl': "i-icon-4xl";
};

type IIconName = keyof typeof I_ICON_NAMES;
type IIconSize = keyof typeof I_ICON_SIZES;
/**
 * ✅ Autocomplete for aliases (IIconName),
 * ✅ Still allow ANY string (raw FA classes, custom classes, etc.)
 */
type IIconInput = IIconName | (string & {});
type IIconProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
    /** Icon alias (IIconName) or raw class string (e.g. "fa-solid fa-user") */
    icon: IIconInput;
    /** Size class key (maps to i-icon-md, etc). Defaults to 'md' (Angular parity). */
    size?: IIconSize;
};
declare function IIcon(props: IIconProps): react_jsx_runtime.JSX.Element;

type IFormControlErrorMessage = {
    required?: string;
    requiredTrue?: string;
    minlength?: string;
    maxlength?: string;
    pattern?: string;
    email?: string;
    min?: string;
    max?: string;
    [key: string]: string | undefined;
};
type IUISize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IUIVariant = 'primary' | 'info' | 'warning' | 'danger' | 'success' | 'outline';
type IErrorContext = {
    label: string;
    error: unknown;
    control?: unknown;
};
type IErrors = Record<string, unknown>;

type IButtonType = 'button' | 'submit' | 'reset';
type IButtonSize = Extract<IUISize, '2xs' | 'xs' | 'sm' | 'md' | 'lg'>;
type IButtonVariant = Extract<IUIVariant, 'primary' | 'warning' | 'danger' | 'success' | 'outline'>;
type IButtonProps = Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> & {
    disabled?: boolean;
    loading?: boolean;
    /** Used for submit/reset behavior (host is NOT a native <button>) */
    type?: IButtonType;
    loadingText?: string;
    variant?: IButtonVariant;
    size?: IButtonSize;
    /** ✅ autocomplete for aliases + allow raw FA class strings */
    icon?: IIconInput;
    /** Angular naming */
    onClick?: (event: MouseEvent) => void;
    children?: React.ReactNode;
};
declare function IButton(props: IButtonProps): react_jsx_runtime.JSX.Element;

type RouterLinkInput = string | any[] | undefined;
type ICardProps = Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> & {
    href?: string | null;
    routerLink?: RouterLinkInput;
    queryParams?: Record<string, any> | null;
    fragment?: string;
    replaceUrl?: boolean;
    skipLocationChange?: boolean;
    state?: Record<string, any>;
    target?: '_self' | '_blank' | '_parent' | '_top' | string;
    rel?: string | null;
    disabled?: boolean;
    /** Standardized event name (Angular + React) */
    onClick?: (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    children?: React.ReactNode;
};
declare function ICard(props: ICardProps): react_jsx_runtime.JSX.Element;
type ICardImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> & {
    src?: string;
    alt?: string | null;
};
declare function ICardImage(props: ICardImageProps): react_jsx_runtime.JSX.Element;
declare function ICardBody(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
declare function ICardFooter(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;

type ICodeHighlighter = 'auto' | 'hljs' | 'none';
type ICodeViewerFileLoaded = {
    file: string;
    language: string;
};
type ICodeViewerProps = React.HTMLAttributes<HTMLElement> & {
    language?: string | null;
    file?: string | null;
    code?: string | null;
    wrap?: boolean;
    compact?: boolean;
    /** default false */
    lineNumbers?: boolean;
    /** overlay controls */
    overlay?: boolean;
    showFileType?: boolean;
    copy?: boolean;
    /** if true => scroll, and if height specified => scroll forced */
    scroll?: boolean;
    /** "wrap" | "auto" | 300 | "300" | "300px" */
    height?: any;
    highlighter?: ICodeHighlighter;
    onFileLoaded?: (e: ICodeViewerFileLoaded) => void;
};
declare function ICodeViewer(props: ICodeViewerProps): react_jsx_runtime.JSX.Element;

type IDatepickerPanelPosition = 'bottom left' | 'bottom right' | 'top left' | 'top right';
type IDatepickerProps = React.HTMLAttributes<HTMLElement> & {
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
type IFCDatepickerProps = React.HTMLAttributes<HTMLElement> & {
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
declare function IDatepicker(props: IDatepickerProps): react_jsx_runtime.JSX.Element;
declare function IFCDatepicker(props: IFCDatepickerProps): react_jsx_runtime.JSX.Element;

type IDialogConfig<TData = any> = {
    id?: string;
    data?: TData;
    width?: string;
    height?: string;
    disableClose?: boolean;
    backdropClose?: boolean;
};
type IAlertData = {
    title: string;
    description: string;
    type: 'information' | 'success' | 'warning' | 'danger';
};
type IConfirmData = {
    title: string;
    description: string;
    type: 'information' | 'success' | 'warning' | 'danger';
    reason?: boolean;
};
type Listener$1<T> = (value: T) => void;
declare class IDialogRef<TResult = any> {
    private _closed;
    private _result;
    private _listeners;
    private _resolve;
    private _promise;
    constructor();
    close(result?: TResult): void;
    /** Promise style */
    afterClosed(): Promise<TResult | undefined>;
    /** Observable-like subscribe (no rxjs dependency) */
    subscribe(cb: Listener$1<TResult | undefined>): () => void;
}
type IDialogInstance<TData = any, TResult = any> = {
    id: string;
    component: React.ComponentType<any>;
    config: Required<IDialogConfig<TData>>;
    ref: IDialogRef<TResult>;
};
type DialogApi = {
    dialogs: IDialogInstance[];
    open: <TData = any, TResult = any>(component: React.ComponentType<any>, config?: IDialogConfig<TData>) => IDialogRef<TResult>;
    closeById: (id: string, result?: any) => void;
    closeAll: () => void;
};
declare function useIDialog(): DialogApi;
/** React equivalent to inject(I_DIALOG_DATA) */
declare function useDialogData<T = any>(): T;
/** React equivalent to inject(IDialogRef) */
declare function useDialogRef<TResult = any>(): IDialogRef<TResult>;
type IDialogProviderProps = {
    children?: ReactNode;
};
declare function IDialogProvider(props: IDialogProviderProps): react_jsx_runtime.JSX.Element;
/** Put this once near app root (Option A) */
declare function IDialogOutlet(): react_jsx_runtime.JSX.Element;
type IDialogCloseProps = {
    result?: any;
    children?: ReactNode;
    className?: string;
};
declare function IDialogClose(props: IDialogCloseProps): react_jsx_runtime.JSX.Element;
type IDialogActionTypes = {
    type: 'cancel' | 'save' | 'ok' | 'confirm' | 'custom';
};
type IDialogActionType = IDialogActionTypes['type'];
type IDialogActionCancel = {
    type: 'cancel';
    className?: string;
};
type IDialogActionSave = {
    type: 'save';
    className?: string;
};
type IDialogActionOK = {
    type: 'ok';
    className?: string;
};
type IDialogActionConfirm = {
    type: 'confirm';
    className?: string;
};
type IDialogActionCustom = {
    type: 'custom';
    label: string;
    variant?: IButtonVariant;
    icon?: IIconName | string;
    className?: string;
    onClick?: () => void;
};
type IDialogActionObject = IDialogActionCancel | IDialogActionSave | IDialogActionOK | IDialogActionConfirm | IDialogActionCustom;
type DialogAction = IDialogActionType | IDialogActionObject;
type IDialogProps = React.HTMLAttributes<HTMLElement> & {
    title?: string;
    actions?: DialogAction[];
    /** on* prefix (matches Angular Outputs) */
    onOk?: (value?: any) => void;
    onConfirm?: (value?: any) => void;
    onSave?: (value?: any) => void;
    onCustomAction?: (action: IDialogActionObject) => void;
    children?: ReactNode;
};
declare function IDialog(props: IDialogProps): react_jsx_runtime.JSX.Element;
declare function IAlert(): react_jsx_runtime.JSX.Element;
declare function useIAlertService(): {
    show: (data: IAlertData) => Promise<boolean>;
    information: (title: string, description: string) => Promise<boolean>;
    success: (title: string, description: string) => Promise<boolean>;
    warning: (title: string, description: string) => Promise<boolean>;
    danger: (title: string, description: string) => Promise<boolean>;
};
declare function IConfirm(): react_jsx_runtime.JSX.Element;
declare function useIConfirmService(): {
    show: (data: IConfirmData) => Promise<any>;
    information: (title: string, description: string) => Promise<boolean>;
    success: (title: string, description: string) => Promise<boolean>;
    warning: (title: string, description: string, reason?: boolean) => Promise<any>;
    danger: (title: string, description: string, reason?: boolean) => Promise<any>;
};

type IGridSelectionMode = false | 'single' | 'multiple';
type IGridSelectionChange<T = any> = {
    selected: T[];
    lastChanged: T | null;
};
type IGridColumnWidth = number | 'fill';
type IGridColumnLike<T = any> = {
    fieldName?: string;
    title: string;
    sortable: boolean;
    resizable: boolean;
    freeze: boolean;
    width?: IGridColumnWidth;
    headerDef?: (col: IGridColumnLike<T>) => ReactNode;
    cellDef?: ((row: T) => ReactNode) | ((row: T, ctx: {
        row: T;
        index: number;
        column: IGridColumnLike<T>;
    }) => ReactNode);
    isAuto?: boolean;
};
type IGridHeaderItem<T = any> = {
    kind: 'col';
    col: IGridColumnLike<T>;
} | {
    kind: 'group';
    title: string;
    columns: IGridColumnLike<T>[];
};
type ISortDirection = 'asc' | 'desc' | '';
type ISortState = {
    active: string;
    direction: ISortDirection;
};
type ISortConfig = ISortState | ISortState[] | null;
type IGridFilter = string | {
    recursive: true;
    text: string;
    key?: string;
};
type IGridPaginatorInput = false | {
    pageIndex?: number;
    pageSize?: number;
    pageSizeOptions?: number[];
};
/**
 * NOTE:
 * No generic here because it's unused (fixes "T is declared but never read")
 * If you later want column-specific typed filter/sort accessors,
 * you can add generic usages in this config.
 */
type IGridDataSourceConfig = {
    sort?: ISortConfig;
    filter?: IGridFilter;
    /**
     * paginator:
     * - false → disabled
     * - undefined/missing → enabled with defaults
     * - { pageIndex?, pageSize?, pageSizeOptions? } → enabled + overridden
     */
    paginator?: IGridPaginatorInput;
};
type Listener<T> = (rows: T[]) => void;
/** ✅ Sorting accessor must be comparable */
type IGridSortAccessor<T> = (data: T, columnId: string) => string | number;
declare class IGridDataSource<T = unknown> {
    private _rawData;
    private _filter;
    private _recursive;
    private _childrenKey;
    private _sort;
    private _paginatorEnabled;
    private _pageIndex;
    private _pageSize;
    private _pageSizeOptions;
    private _listeners;
    constructor(initialData?: T[], config?: IGridDataSourceConfig);
    private _applyPaginatorConfig;
    get paginatorEnabled(): boolean;
    get pageIndex(): number;
    get pageSize(): number;
    get pageSizeOptions(): number[];
    set paginator(state: {
        pageIndex: number;
        pageSize: number;
    } | null);
    get paginator(): {
        pageIndex: number;
        pageSize: number;
    } | null;
    get data(): T[];
    set data(value: T[]);
    get length(): number;
    /**
     * Smart filter:
     * - string: normal flat filtering
     * - { recursive: true, text, key? }: recursive tree filtering
     */
    set filter(value: IGridFilter | null | undefined);
    /**
     * Returns the current normalized filter text.
     * (Always plain string, lowercased & trimmed.)
     */
    get filter(): string;
    get sort(): ISortState[] | null;
    set sort(value: ISortConfig);
    filterPredicate: (data: T, filter: string) => boolean;
    /**
     * ✅ must always return comparable primitive (string|number)
     * Normalize:
     * - non-record → ''
     * - null/undefined → ''
     * - string/number → itself
     * - everything else → String(value)
     */
    sortAccessor: IGridSortAccessor<T>;
    connect(listener: Listener<T>): () => void;
    disconnect(): void;
    /** Basic row match using public filterPredicate */
    private _rowMatchesFilter;
    private _filterRecursiveArray;
    private _filterRecursiveNode;
    private _normalizeSort;
    private _computeRendered;
    private _emit;
}
type IGridColumnProps<T> = {
    fieldName: string;
    title?: string;
    width?: IGridColumnWidth;
    freeze?: boolean;
    sortable?: boolean;
    resizable?: boolean;
    headerDef?: (col: IGridColumnLike<T>) => ReactNode;
    cellDef?: ((row: T) => ReactNode) | ((row: T, ctx: {
        row: T;
        index: number;
        column: IGridColumnLike<T>;
    }) => ReactNode);
};
declare function IGridColumn<T>(_props: IGridColumnProps<T>): any;
type IGridCustomColumnProps<T> = {
    title?: string;
    width?: IGridColumnWidth;
    freeze?: boolean;
    sortable?: boolean;
    resizable?: boolean;
    headerDef?: (col: IGridColumnLike<T>) => ReactNode;
    cellDef?: ((row: T) => ReactNode) | ((row: T, ctx: {
        row: T;
        index: number;
        column: IGridColumnLike<T>;
    }) => ReactNode);
};
declare function IGridCustomColumn<T>(_props: IGridCustomColumnProps<T>): any;
type IGridColumnGroupProps = {
    title: string;
    children: ReactNode;
};
declare function IGridColumnGroup(_props: IGridColumnGroupProps): any;
type IGridExpandableRowRenderCtx<T> = {
    row: T;
    index: number;
};
type IGridExpandableRowProps<T> = {
    expandSingle?: boolean;
    render: (row: T, ctx: IGridExpandableRowRenderCtx<T>) => ReactNode;
};
declare function IGridExpandableRow<T>(_props: IGridExpandableRowProps<T>): any;
type IGridProps<T> = {
    dataSource: IGridDataSource<T> | T[];
    selectionMode?: IGridSelectionMode;
    tree?: string | boolean | null;
    treeIndent?: number;
    treeColumn?: string;
    treeInitialExpandLevel?: number | null;
    showNumberColumn?: boolean;
    onSelectionChange?: (e: IGridSelectionChange<T>) => void;
    onRowClick?: (row: T) => void;
    onRowExpandChange?: (e: {
        row: T;
        expanded: boolean;
    }) => void;
    onExpandedRowsChange?: (rows: T[]) => void;
    children?: ReactNode;
    /**
     * If you want React-side highlighting (instead of Angular pipe),
     * pass a function; otherwise plain text will render.
     */
    highlightSearch?: (text: string, filter: string) => ReactNode;
    rowKey?: (row: T, index: number) => string | number;
};
declare function IGrid<T>(props: IGridProps<T>): react_jsx_runtime.JSX.Element;

/**
 * IPaginator (React)
 * Matches Angular behavior:
 * - page size buttons
 * - numeric pages with ellipsis
 * - emits pageChange with { pageIndex, pageSize }
 */
type IPaginatorState = {
    pageIndex: number;
    pageSize: number;
};
type IPaginatorProps = {
    length: number;
    pageIndex: number;
    pageSize: number;
    pageSizeOptions: number[];
    onPageChange: (state: IPaginatorState) => void;
};
declare function IPaginator(props: IPaginatorProps): react_jsx_runtime.JSX.Element;

type IBreadcrumbItem = {
    label: string;
    url?: string;
};
type IHostApi = {
    navigate: (url: string) => void | Promise<void>;
    setTitle: (title: string | null) => void;
    setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
};
type IMenu = {
    menuId: number;
    menuName: string;
    route?: string | null;
    menuTypeId: number;
    parentId: number;
    sequence: number;
    icon?: string | null;
    child?: IMenu[];
    level: number;
    visibility?: string;
    selected?: boolean;
    openInId?: number;
    versionCode?: string;
    applicationCode?: string;
    applicationUrl?: string;
};
type IUser = {
    employeeCode: string;
    fullName: string;
    userImagePath: string;
};

declare function IHContent(props: {
    title?: string | null;
    breadcrumbs?: IBreadcrumbItem[] | null;
    onSidebarToggled?: (visible: boolean) => void;
    defaultSidebarVisible?: boolean;
    onNavigate?: (url: string) => void;
}): react_jsx_runtime.JSX.Element;
/**
 * IHContentLayout
 * - Reads title/breadcrumbs from Host UI context
 * - Uses hostApi.navigate when available (MF host mode),
 *   otherwise IHContent falls back to react-router navigate()
 */
declare function IHContentLayout(): react_jsx_runtime.JSX.Element;
type IHMenuProps = {
    menu?: IMenu;
    filter: string;
    selectedMenuId: number | null;
    onToggleGroup: (menuId: number) => void;
};
declare const IHMenu: React.NamedExoticComponent<IHMenuProps>;
type IHSidebarProps = {
    user?: IUser | null;
    menus: IMenu[];
    visible?: boolean;
    footerText?: string;
};
declare function IHSidebar(props: IHSidebarProps): react_jsx_runtime.JSX.Element;
declare function HostShell(props: {
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;

declare function IHostApiProvider(props: {
    hostApi: IHostApi;
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useHostApi(): IHostApi;
/** For components like IRouter (won’t crash standalone mode) */
declare function useHostApiOptional(): IHostApi | null;

type IHostUiState = {
    title: string | null;
    breadcrumbs: IBreadcrumbItem[] | null;
    setTitle: (title: string | null) => void;
    setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
};
declare function IHostUiProvider(props: {
    children: React.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useHostUi(): IHostUiState;

type IRouteComponent = React.ComponentType<unknown>;
type ILoadComponent = () => Promise<IRouteComponent>;
type IRoute = {
    path?: string;
    index?: boolean;
    redirectTo?: string;
    title?: string;
    breadcrumb?: string;
    element?: React.ReactNode;
    loadComponent?: ILoadComponent;
    children?: IRoutes;
};
type IRoutes = IRoute[];

type IRouterProps = {
    routes: IRoutes;
    loading?: React.ReactNode;
    notFound?: React.ReactNode;
};
declare function IRouter(props: IRouterProps): react_jsx_runtime.JSX.Element;

type IInputAddonKind = 'icon' | 'text' | 'button' | 'link' | 'loading';
type IInputAddonType = {
    type: IInputAddonKind;
};
type IInputAddonLoading = {
    type: 'loading';
    visible?: boolean;
} & IInputAddonType;
type IInputAddonIcon = {
    type: 'icon';
    icon: IIconInput;
    visible?: boolean;
} & IInputAddonType;
type IInputAddonText = {
    type: 'text';
    text: string;
    visible?: boolean;
} & IInputAddonType;
type IInputAddonButton = {
    type: 'button';
    icon?: IIconInput;
    text?: string;
    variant?: IButtonVariant;
    onClick?: () => void;
    visible?: boolean;
} & IInputAddonType;
type IInputAddonLink = {
    type: 'link';
    icon?: IIconInput;
    text: string;
    href: string;
    target?: string;
    visible?: boolean;
} & IInputAddonType;
type IInputAddons = IInputAddonIcon | IInputAddonText | IInputAddonButton | IInputAddonLink | IInputAddonLoading;
type IInputMaskType = 'date' | 'integer' | 'number' | 'currency' | 'time';
type IInputMask = {
    type: IInputMaskType;
    format?: string;
};
type UseInputMaskOptions = {
    enableDefault?: boolean;
};
/**
 * React counterpart for Angular IInputMaskDirective:
 * - attaches listeners to the native <input/>
 * - formats and constrains value based on the mask
 *
 * NOTE: this is intentionally “best effort parity”.
 */
declare function useInputMask(inputRef: React.RefObject<HTMLInputElement | null>, mask: IInputMask | undefined, opts?: UseInputMaskOptions): void;
type IInputAddonProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
    addon: IInputAddons | undefined;
};
declare function IInputAddon(props: IInputAddonProps): react_jsx_runtime.JSX.Element;
type IInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'value' | 'defaultValue' | 'readOnly'> & {
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
/**
 * ✅ forwardRef supported:
 * <IInput ref={...} />
 * ✅ inputRef supported:
 * <IInput inputRef={...} />
 *
 * Both point to the INNER <input>
 */
declare const IInput: React.ForwardRefExoticComponent<Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "defaultValue" | "value" | "readOnly"> & {
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
} & React.RefAttributes<HTMLInputElement>>;
type IFCInputProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
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
declare function IFCInput(props: IFCInputProps): react_jsx_runtime.JSX.Element;

type ILoadingProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    label?: string;
    light?: boolean;
};
declare function ILoading(props: ILoadingProps): react_jsx_runtime.JSX.Element;

type ISectionTabBadge = boolean | '' | number | string | null | undefined;
type ISectionTabsHeight = 'wrap' | 'auto' | number | string | null | undefined;
declare function ISection(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
declare function ISectionHeader(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
declare function ISectionSubHeader(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
declare function ISectionFilter(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
declare function ISectionBody(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
declare function ISectionFooter(props: React.HTMLAttributes<HTMLElement>): react_jsx_runtime.JSX.Element;
type ISectionTabProps = {
    title?: string;
    opened?: boolean;
    badge?: ISectionTabBadge;
    /**
     * If provided, overrides the default header (Angular parity:
     * <i-section-tab-header> replaces default header template).
     */
    header?: React.ReactNode;
    /** Content of the tab */
    children?: React.ReactNode;
};
declare function ISectionTab(_props: ISectionTabProps): any;
type ISectionTabsProps = React.HTMLAttributes<HTMLElement> & {
    /** optional controlled mode */
    selectedIndex?: number | null;
    /** ✅ on* prefix (Angular parity) */
    onSelectedIndexChange?: (index: number) => void;
    /**
     * height:
     * - "wrap" / "auto" / null => wrap (default)
     * - 300 / "300" / "300px" => fixed px height + internal scroll
     */
    height?: ISectionTabsHeight;
    children?: React.ReactNode;
};
declare function ISectionTabs(props: ISectionTabsProps): react_jsx_runtime.JSX.Element;

type ISelectChange<T = any> = {
    value: T | null;
    label: string;
};
type ISelectPanelPosition = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type ISelectProps<T = any> = Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> & {
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
declare function ISelect<T = any>(props: ISelectProps<T>): react_jsx_runtime.JSX.Element;

type MinMaxLengthError = {
    requiredLength: number;
    actualLength: number;
};
declare function isRecord(v: unknown): v is Record<string, unknown>;
declare function hasNumber(obj: Record<string, unknown>, key: string): obj is Record<string, unknown> & Record<string, number>;
declare function asMinMaxLengthError(err: unknown): MinMaxLengthError | null;
declare function readNumber(err: unknown, key: 'min' | 'max'): number | null;
declare const DEFAULT_ERROR_FACTORIES: Record<string, (ctx: IErrorContext) => string>;
type ResolveControlErrorMessageArgs = {
    errors: IErrors | null | undefined;
    label?: string;
    errorMessage?: IFormControlErrorMessage;
    extraFactories?: Record<string, (ctx: IErrorContext) => string>;
    control?: unknown;
};
declare function resolveControlErrorMessage({ errors, label, errorMessage, extraFactories, control, }: ResolveControlErrorMessageArgs): string | null;
declare function isControlRequired(args: {
    errors?: IErrors | null;
    errorMessage?: IFormControlErrorMessage;
}): boolean;
declare function interpolate(tpl: string, ctx: IErrorContext): string;

type ITextAreaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange' | 'readOnly'> & {
    value?: string;
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    placeholder?: string;
    onChange?: (value: string) => void;
};
declare function ITextArea(props: ITextAreaProps): react_jsx_runtime.JSX.Element;
type IFCTextAreaProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
    label?: string;
    placeholder?: string;
    readonly?: boolean;
    rows?: number;
    errorMessage?: IFormControlErrorMessage;
    value?: string;
    onChange?: (value: string) => void;
    /**
     * React-only adapters (Angular derives these from NgControl/FormGroupDirective):
     * Keep optional so React users can integrate with any form lib.
     */
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    /** maps to errorMessage[errorKey]; Angular resolves by control error keys */
    errorKey?: string;
};
declare function IFCTextArea(props: IFCTextAreaProps): react_jsx_runtime.JSX.Element;

type IToggleProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'children'> & {
    /** Controlled value */
    checked?: boolean;
    /** Uncontrolled initial value */
    defaultChecked?: boolean;
    disabled?: boolean;
    /** Label content: <IToggle>Label</IToggle> */
    children?: React.ReactNode;
    /** Put label left or right */
    labelPosition?: 'left' | 'right';
    /** Matches your convention */
    onChange?: (checked: boolean) => void;
    /** Optional: touched semantics */
    onTouched?: () => void;
    /** Optional: pass through input name/value for forms */
    name?: string;
    value?: string;
};
declare function IToggle(props: IToggleProps): react_jsx_runtime.JSX.Element;

export { DEFAULT_ERROR_FACTORIES, type DialogAction, HostShell, IAlert, type IAlertData, type IBreadcrumbItem, IButton, type IButtonProps, type IButtonSize, type IButtonType, type IButtonVariant, ICard, ICardBody, ICardFooter, ICardImage, type ICardImageProps, type ICardProps, type ICodeHighlighter, ICodeViewer, type ICodeViewerFileLoaded, type ICodeViewerProps, IConfirm, type IConfirmData, IDatepicker, type IDatepickerPanelPosition, type IDatepickerProps, IDialog, type IDialogActionCancel, type IDialogActionConfirm, type IDialogActionCustom, type IDialogActionOK, type IDialogActionObject, type IDialogActionSave, type IDialogActionType, type IDialogActionTypes, IDialogClose, type IDialogCloseProps, type IDialogConfig, type IDialogInstance, IDialogOutlet, type IDialogProps, IDialogProvider, type IDialogProviderProps, IDialogRef, type IErrorContext, type IErrors, IFCDatepicker, type IFCDatepickerProps, IFCInput, type IFCInputProps, IFCTextArea, type IFCTextAreaProps, type IFormControlErrorMessage, IGrid, IGridColumn, IGridColumnGroup, type IGridColumnGroupProps, type IGridColumnLike, type IGridColumnProps, type IGridColumnWidth, IGridCustomColumn, type IGridCustomColumnProps, IGridDataSource, type IGridDataSourceConfig, IGridExpandableRow, type IGridExpandableRowProps, type IGridExpandableRowRenderCtx, type IGridFilter, type IGridHeaderItem, type IGridPaginatorInput, type IGridProps, type IGridSelectionChange, type IGridSelectionMode, type IGridSortAccessor, IHContent, IHContentLayout, IHMenu, IHSidebar, type IHSidebarProps, type IHostApi, IHostApiProvider, IHostUiProvider, type IHostUiState, IIcon, type IIconInput, type IIconName, type IIconProps, type IIconSize, IInput, IInputAddon, type IInputAddonButton, type IInputAddonIcon, type IInputAddonKind, type IInputAddonLink, type IInputAddonLoading, type IInputAddonProps, type IInputAddonText, type IInputAddonType, type IInputAddons, type IInputMask, type IInputMaskType, type IInputProps, type ILoadComponent, ILoading, type ILoadingProps, type IMenu, IPaginator, type IPaginatorProps, type IPaginatorState, type IRoute, type IRouteComponent, IRouter, type IRouterProps, type IRoutes, ISection, ISectionBody, ISectionFilter, ISectionFooter, ISectionHeader, ISectionSubHeader, ISectionTab, type ISectionTabBadge, type ISectionTabProps, ISectionTabs, type ISectionTabsHeight, type ISectionTabsProps, ISelect, type ISelectChange, type ISelectPanelPosition, type ISelectProps, type ISortConfig, type ISortDirection, type ISortState, ITextArea, type ITextAreaProps, IToggle, type IToggleProps, type IUISize, type IUIVariant, type IUser, I_ICON_NAMES, I_ICON_SIZES, type ResolveControlErrorMessageArgs, type RouterLinkInput, type UseInputMaskOptions, asMinMaxLengthError, hasNumber, interpolate, isControlRequired, isRecord, readNumber, resolveControlErrorMessage, useDialogData, useDialogRef, useHostApi, useHostApiOptional, useHostUi, useIAlertService, useIConfirmService, useIDialog, useInputMask };
