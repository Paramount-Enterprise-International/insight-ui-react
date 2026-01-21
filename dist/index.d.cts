import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode, HTMLAttributes, JSX } from 'react';

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
    icon: IIconInput;
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
    type?: IButtonType;
    loadingText?: string;
    variant?: IButtonVariant;
    size?: IButtonSize;
    /** ✅ autocomplete for aliases + allow raw FA class strings */
    icon?: IIconInput;
    /** Angular-ish naming: expose native event */
    onClick?: (event: MouseEvent) => void;
    children?: React.ReactNode;
};
declare function IButton(props: IButtonProps): react_jsx_runtime.JSX.Element;

type ICardProps = React.HTMLAttributes<HTMLElement> & {
    href?: string | null;
    target?: '_self' | '_blank' | '_parent' | '_top' | string;
    rel?: string | null;
    disabled?: boolean;
    onCardClick?: (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};
declare function ICard(props: ICardProps): react_jsx_runtime.JSX.Element;
type ICardImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    src: string;
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

type IDatepickerPanelPosition = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type IDatepickerProps = React.HTMLAttributes<HTMLElement> & {
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
declare function IDatepicker(props: IDatepickerProps): react_jsx_runtime.JSX.Element;
type IFCDatepickerProps = React.HTMLAttributes<HTMLElement> & {
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
    visible?: boolean;
};
type IDialogActionSave = {
    type: 'save';
    className?: string;
    visible?: boolean;
};
type IDialogActionOK = {
    type: 'ok';
    className?: string;
    visible?: boolean;
};
type IDialogActionConfirm = {
    type: 'confirm';
    className?: string;
    visible?: boolean;
};
type IDialogActionCustom = {
    type: 'custom';
    visible?: boolean;
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

/**
 * IGridDataSource (React)
 * Mirrors Angular behavior:
 * - filter (string | recursive)
 * - multi-sort
 * - optional paginator
 * - connect(listener) subscription API
 */
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
    /**
     * Optional:
     * - If provided, this wrapper will use it (MF host mode)
     * - Otherwise it will use react-router navigate() (standalone mode)
     */
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

type IRoute = {
    path?: string;
    index?: boolean;
    title?: string;
    breadcrumb?: string;
    element?: React.ReactNode;
    loadComponent?: () => Promise<{
        default: React.ComponentType<unknown>;
    }>;
    children?: IRoutes;
};
type IRoutes = IRoute[];

type IRouterProps = {
    routes: IRoutes;
    loading?: React.ReactNode;
    notFound?: React.ReactNode;
    redirectIndexTo?: string;
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
    icon: IIconInput;
    onClick?: () => void;
    visible?: boolean;
    variant?: IButtonVariant;
} & IInputAddonType;
type IInputAddonLink = {
    type: 'link';
    icon: IIconInput;
    href?: string;
    visible?: boolean;
    variant?: IButtonVariant;
} & IInputAddonType;
type IInputAddons = IInputAddonLoading | IInputAddonIcon | IInputAddonText | IInputAddonButton | IInputAddonLink;
interface IInputAddonProps extends React.HTMLAttributes<HTMLElement> {
    addon: IInputAddons | undefined;
}
declare function IInputAddon(props: IInputAddonProps): react_jsx_runtime.JSX.Element;
type IInputMaskType = 'date' | 'integer' | 'number' | 'currency' | 'time';
type IInputMask = {
    type: IInputMaskType;
    format?: string;
};
type UseInputMaskOptions = {
    enableDefault?: boolean;
};
declare function useInputMask(inputRef: React.RefObject<HTMLInputElement | null>, mask: IInputMask | undefined, opts?: UseInputMaskOptions): void;
interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
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
declare const IInput: React.ForwardRefExoticComponent<IInputProps & React.RefAttributes<HTMLInputElement>>;
type IFCInputProps = React.HTMLAttributes<HTMLElement> & {
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
type ISectionTabHeaderProps = {
    children?: React.ReactNode;
};
declare function ISectionTabHeader(props: ISectionTabHeaderProps): react_jsx_runtime.JSX.Element;
declare namespace ISectionTabHeader {
    var displayName: string;
}
type ISectionTabContentProps = {
    children?: React.ReactNode;
};
declare function ISectionTabContent(props: ISectionTabContentProps): react_jsx_runtime.JSX.Element;
declare namespace ISectionTabContent {
    var displayName: string;
}
type ISectionTabProps = {
    title?: string;
    opened?: boolean;
    badge?: ISectionTabBadge;
    children?: React.ReactNode;
    /**
     * Optional: direct header/content (instead of using <ISectionTabHeader/> / <ISectionTabContent/>)
     */
    header?: React.ReactNode;
    content?: React.ReactNode;
};
declare function ISectionTab(_props: ISectionTabProps): any;
declare namespace ISectionTab {
    var displayName: string;
}
type ISectionTabsProps = React.HTMLAttributes<HTMLElement> & {
    selectedIndex?: number | null;
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

type ISelectChange<T> = {
    value: T | null;
    label: string;
};
type ISelectPanelPosition = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type ISelectProps<T> = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    role?: string;
    tabIndex?: number;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    filterDelay?: number;
    panelPosition?: ISelectPanelPosition;
    options?: T[] | null;
    /** React-friendly replacement for options$ */
    loading?: boolean;
    displayWith?: ((row: T | null) => string) | string | undefined;
    filterPredicate?: (row: T, term: string) => boolean;
    value?: T | null;
    onChange?: (value: T | null) => void;
    onChanged?: (change: ISelectChange<T>) => void;
    onOptionSelected?: (change: ISelectChange<T>) => void;
    /** React replacement for <ng-template iSelectOption> */
    renderOption?: (row: T) => ReactNode;
    /** if true, highlight matches in default label rendering */
    highlightSearch?: boolean;
};
type ISelectRef = {
    focus: () => void;
    open: () => void;
    close: () => void;
    toggle: () => void;
    clear: () => void;
};
declare const ISelect: <T = unknown>(props: ISelectProps<T> & {
    ref?: React.Ref<ISelectRef>;
}) => JSX.Element;
type IFCSelectProps<T = any> = React.HTMLAttributes<HTMLElement> & {
    label?: string;
    placeholder?: string;
    options?: T[] | null;
    displayWith?: ((row: T | null) => string) | string | undefined;
    filterDelay?: number;
    filterPredicate?: (row: T, term: string) => boolean;
    panelPosition?: ISelectPanelPosition;
    value?: T | null;
    onChange?: (v: T | null) => void;
    onChanged?: (change: ISelectChange<T>) => void;
    onOptionSelected?: (change: ISelectChange<T>) => void;
    renderOption?: (row: T) => React.ReactNode;
    disabled?: boolean;
    /** React validation */
    required?: boolean;
    invalid?: boolean;
    /** Angular-like template map */
    errorMessage?: IFormControlErrorMessage;
    /** which key to render when invalid (default: 'required') */
    errorKey?: string;
};
declare function IFCSelect<T = any>(props: IFCSelectProps<T>): react_jsx_runtime.JSX.Element;

type ITextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> & {
    value?: string;
    invalid?: boolean;
    onChange?: (value: string) => void;
};
declare function ITextarea(props: ITextareaProps): react_jsx_runtime.JSX.Element;
type IFCTextareaProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    required?: boolean;
    invalid?: boolean;
    errorMessage?: IFormControlErrorMessage;
    errorKey?: string;
};
declare function IFCTextarea(props: IFCTextareaProps): react_jsx_runtime.JSX.Element;

export { DEFAULT_ERROR_FACTORIES, type DialogAction, HostShell, IAlert, type IAlertData, type IBreadcrumbItem, IButton, type IButtonProps, type IButtonSize, type IButtonType, type IButtonVariant, ICard, ICardBody, ICardFooter, ICardImage, type ICardImageProps, type ICardProps, type ICodeHighlighter, ICodeViewer, type ICodeViewerFileLoaded, type ICodeViewerProps, IConfirm, type IConfirmData, IDatepicker, type IDatepickerPanelPosition, type IDatepickerProps, IDialog, type IDialogActionCancel, type IDialogActionConfirm, type IDialogActionCustom, type IDialogActionOK, type IDialogActionObject, type IDialogActionSave, type IDialogActionType, type IDialogActionTypes, IDialogClose, type IDialogCloseProps, type IDialogConfig, type IDialogInstance, IDialogOutlet, type IDialogProps, IDialogProvider, type IDialogProviderProps, IDialogRef, type IErrorContext, type IErrors, IFCDatepicker, type IFCDatepickerProps, IFCInput, type IFCInputProps, IFCSelect, type IFCSelectProps, IFCTextarea, type IFCTextareaProps, type IFormControlErrorMessage, IGrid, IGridColumn, IGridColumnGroup, type IGridColumnGroupProps, type IGridColumnLike, type IGridColumnProps, type IGridColumnWidth, IGridCustomColumn, type IGridCustomColumnProps, IGridDataSource, type IGridDataSourceConfig, IGridExpandableRow, type IGridExpandableRowProps, type IGridExpandableRowRenderCtx, type IGridFilter, type IGridHeaderItem, type IGridPaginatorInput, type IGridProps, type IGridSelectionChange, type IGridSelectionMode, type IGridSortAccessor, IHContent, IHContentLayout, IHMenu, IHSidebar, type IHSidebarProps, type IHostApi, IHostApiProvider, IHostUiProvider, type IHostUiState, IIcon, type IIconInput, type IIconName, type IIconProps, type IIconSize, IInput, IInputAddon, type IInputAddonButton, type IInputAddonIcon, type IInputAddonKind, type IInputAddonLink, type IInputAddonLoading, type IInputAddonProps, type IInputAddonText, type IInputAddonType, type IInputAddons, type IInputMask, type IInputMaskType, type IInputProps, ILoading, type ILoadingProps, type IMenu, IPaginator, type IPaginatorProps, type IPaginatorState, type IRoute, IRouter, type IRouterProps, type IRoutes, ISection, ISectionBody, ISectionFilter, ISectionFooter, ISectionHeader, ISectionSubHeader, ISectionTab, type ISectionTabBadge, ISectionTabContent, type ISectionTabContentProps, ISectionTabHeader, type ISectionTabHeaderProps, type ISectionTabProps, ISectionTabs, type ISectionTabsHeight, type ISectionTabsProps, ISelect, type ISelectChange, type ISelectPanelPosition, type ISelectProps, type ISelectRef, type ISortConfig, type ISortDirection, type ISortState, ITextarea, type ITextareaProps, type IUISize, type IUIVariant, type IUser, I_ICON_NAMES, I_ICON_SIZES, type ResolveControlErrorMessageArgs, asMinMaxLengthError, hasNumber, interpolate, isControlRequired, isRecord, readNumber, resolveControlErrorMessage, useDialogData, useDialogRef, useHostApi, useHostApiOptional, useHostUi, useIAlertService, useIConfirmService, useIDialog, useInputMask };
