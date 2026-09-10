import * as React$1 from 'react';
import React__default, { ReactNode, JSX, HTMLAttributes } from 'react';
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
    readonly '3xs': "i-icon-3xs";
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
 * Autocomplete for aliases + allow raw FA class strings
 */
type IIconInput = IIconName | (string & {});
type IIconProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'children'> & {
    icon: IIconInput;
    size?: IIconSize;
};
declare function IIcon(props: IIconProps): React__default.JSX.Element;

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
type IButtonSize = Extract<IUISize, '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg'>;
type IButtonVariant = Extract<IUIVariant, 'primary' | 'warning' | 'danger' | 'success' | 'outline'>;
type IButtonProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> & {
    disabled?: boolean;
    loading?: boolean;
    type?: IButtonType;
    loadingText?: string;
    variant?: IButtonVariant;
    size?: IButtonSize;
    icon?: IIconInput;
    onClick?: (event: MouseEvent) => void;
    /** Router support */
    routerLink?: string;
    queryParams?: Record<string, unknown>;
    fragment?: string;
    state?: unknown;
    /** Anchor support */
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    children?: React__default.ReactNode;
};
declare function IButton(props: IButtonProps): React__default.JSX.Element;

type IAvatarShape = 'circle' | 'square' | 'rounded-square';
type IAvatarSize = number | IIconSize;
type IAvatarProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
    /** Primary image URL. Falls back to `fallbackSrc`, then the user icon. */
    src?: string | null;
    alt?: string;
    size?: IAvatarSize;
    shape?: IAvatarShape;
    fallbackSrc?: string | null;
};
declare function IAvatar(props: IAvatarProps): React$1.JSX.Element;

type RouterLinkInput = string | unknown[] | undefined;
type ICardProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> & {
    href?: string | null;
    routerLink?: RouterLinkInput;
    queryParams?: Record<string, unknown> | null;
    fragment?: string;
    replaceUrl?: boolean;
    skipLocationChange?: boolean;
    state?: Record<string, unknown>;
    target?: '_self' | '_blank' | '_parent' | '_top' | string;
    rel?: string | null;
    disabled?: boolean;
    onClick?: (ev: React__default.MouseEvent<HTMLAnchorElement>) => void;
    children?: React__default.ReactNode;
};
declare function ICard(props: ICardProps): React__default.JSX.Element;
declare function ICardImage(props: React__default.ImgHTMLAttributes<HTMLImageElement>): React__default.JSX.Element;
declare function ICardBody(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
declare function ICardFooter(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;

type ICodeHighlighter = 'auto' | 'hljs' | 'none';
type ICodeViewerFileLoaded = {
    file: string;
    language: string;
};
type ICodeViewerProps = React__default.HTMLAttributes<HTMLElement> & {
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
    height?: unknown;
    highlighter?: ICodeHighlighter;
    onFileLoaded?: (e: ICodeViewerFileLoaded) => void;
};
declare function ICodeViewer(props: ICodeViewerProps): React__default.JSX.Element;

/**
 * IDatepicker (React)
 * Version: 1.5.6
 *
 * Fixes (1.5.6):
 * - ✅ Fix “panel only appears after slight scroll” when datepicker is inside a scroll container:
 *   -> listen to scroll on *actual scroll parents* (not window/document)
 * - ✅ Fix “top placement offscreen until next layout”:
 *   -> when maxHeight clamps the panel, compute top using the *effective* height
 * - Keep your 1.5.5 open-cycle + failsafe unhide + smart controlled behavior intact.
 */

type IDatepickerPanelPosition = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type IDatepickerProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'onChange' | 'children'> & {
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
type IFCDatepickerProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'onChange' | 'children'> & {
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
    errorKey?: string;
};
declare function IDatepicker(props: IDatepickerProps): React__default.JSX.Element;
declare function IFCDatepicker(props: IFCDatepickerProps): React__default.JSX.Element;

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
    component: React__default.ComponentType<any>;
    config: Required<IDialogConfig<TData>>;
    ref: IDialogRef<TResult>;
};
type IDialogApi = {
    dialogs: IDialogInstance[];
    open: <TData = any, TResult = any>(component: React__default.ComponentType<any>, config?: IDialogConfig<TData>) => IDialogRef<TResult>;
    closeById: (id: string, result?: any) => void;
    closeAll: () => void;
};
declare function useIDialog(): IDialogApi;
/** React equivalent to inject(I_DIALOG_DATA) */
declare function useIDialogData<T = any>(): T;
/** React equivalent to inject(IDialogRef) */
declare function useIDialogRef<TResult = any>(): IDialogRef<TResult>;
type IDialogProviderProps = {
    children?: ReactNode;
};
declare function IDialogProvider(props: IDialogProviderProps): React__default.JSX.Element;
/** Put this once near app root (Option A) */
declare function IDialogOutlet(): React__default.JSX.Element;
type IDialogCloseProps = {
    result?: any;
    children?: React__default.ReactElement<React__default.HTMLAttributes<HTMLElement>>;
    className?: string;
};
declare function IDialogClose(props: IDialogCloseProps): React__default.ReactElement<React__default.HTMLAttributes<HTMLElement>, string | React__default.JSXElementConstructor<any>>;
type IDialogActionTypes = {
    type: 'cancel' | 'save' | 'ok' | 'confirm' | 'custom';
};
type IDialogActionType = IDialogActionTypes['type'];
type IDialogActionCancel = {
    type: 'cancel';
    disabled?: boolean;
    loading?: boolean;
    buttonType?: IButtonType;
    className?: string;
};
type IDialogActionSave = {
    type: 'save';
    disabled?: boolean;
    loading?: boolean;
    buttonType?: IButtonType;
    className?: string;
};
type IDialogActionOK = {
    type: 'ok';
    disabled?: boolean;
    loading?: boolean;
    buttonType?: IButtonType;
    className?: string;
};
type IDialogActionConfirm = {
    type: 'confirm';
    disabled?: boolean;
    loading?: boolean;
    buttonType?: IButtonType;
    className?: string;
};
type IDialogActionCustom = {
    type: 'custom';
    label: string;
    variant?: IButtonVariant;
    icon?: IIconName | string;
    disabled?: boolean;
    loading?: boolean;
    buttonType?: IButtonType;
    className?: string;
    onClick?: () => void;
};
type IDialogActionObject = IDialogActionCancel | IDialogActionSave | IDialogActionOK | IDialogActionConfirm | IDialogActionCustom;
type IDialogAction = IDialogActionType | IDialogActionObject;
type IDialogProps = React__default.HTMLAttributes<HTMLElement> & {
    title?: string;
    actions?: IDialogAction[];
    /** on* prefix (matches Angular Outputs) */
    onOk?: (value?: any) => void;
    onConfirm?: (value?: any) => void;
    onSave?: (value?: any) => void;
    onCustomAction?: (action: IDialogActionObject) => void;
    children?: ReactNode;
};
declare function IDialog(props: IDialogProps): React__default.JSX.Element;
declare function IAlert(): React__default.JSX.Element;
declare function useIAlert(): {
    show: (data: IAlertData) => Promise<boolean>;
    information: (title: string, description: string) => Promise<boolean>;
    success: (title: string, description: string) => Promise<boolean>;
    warning: (title: string, description: string) => Promise<boolean>;
    danger: (title: string, description: string) => Promise<boolean>;
};
declare function IConfirm(): React__default.JSX.Element;
declare function useIConfirm(): {
    show: (data: IConfirmData) => Promise<any>;
    information: (title: string, description: string) => Promise<boolean>;
    success: (title: string, description: string) => Promise<boolean>;
    warning: (title: string, description: string, reason?: boolean) => Promise<any>;
    danger: (title: string, description: string, reason?: boolean) => Promise<any>;
};
/**
 * Optional variant of `useIConfirm`: returns null when no dialog host is
 * mounted, so a component can render and fall back to its non-confirm path
 * when used outside an `<IDialogProvider>`.
 */
declare function useOptionalIConfirm(): {
    show: (data: IConfirmData) => Promise<unknown>;
    information: (title: string, description: string) => Promise<boolean>;
    success: (title: string, description: string) => Promise<boolean>;
    warning: (title: string, description: string, reason?: boolean) => Promise<unknown>;
    danger: (title: string, description: string, reason?: boolean) => Promise<unknown>;
};

/**
 * IGrid (React)
 * - Renders tags similar to Angular version:
 *   i-grid, i-grid-viewport, i-grid-header-row, i-grid-header-cell, i-grid-cell, i-grid-row, etc.
 *
 * IMPORTANT:
 * - Uses your React IButton (not native button)
 * - Custom tags are just semantic/styling hooks (not Web Components)
 * - Column config components behave like Angular: sortable/resizable/freeze are OPTIONAL with defaults
 *
 * Version: 1.24.0-ish parity (group header + tree + selection + expandable rows + paginator)
 *
 * ✅ Updated (Angular-close frozen/z-index/sticky logic):
 * - HeaderCell/Cell behave like Angular IGridHeaderCell/IGridCell:
 *   - If `col` exists, frozen/stickyLeft/zIndex are derived internally via grid helpers.
 *   - Call-sites no longer manually compute frozen props for normal columns.
 * - Special “expand/selection/number” columns still pass explicit stickyLeft like Angular template does.
 *
 * ✅ FIXED (Angular-close column order with ColumnGroup):
 * - Column parsing now preserves the exact JSX order:
 *   <IGridColumn/> , <IGridColumnGroup/> , <IGridCustomColumn/> ... in-place
 * - No more “collect direct columns first, then groups later” (which caused your order flip).
 */

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
type IGridServerPage = {
    pageIndex: number;
    pageSize: number;
};
/**
 * Delegates individual grid operations to a server. Operations without a
 * callback retain their current client-side behavior, enabling mixed modes.
 */
type IGridServerSideConfig = {
    totalRowCount: number;
    onSortChange?: (sort: ISortState[]) => void;
    onPageChange?: (page: IGridServerPage) => void;
    onFilterChange?: (filter: string) => void;
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
    serverSide?: IGridServerSideConfig;
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
    private _serverSide;
    private _serverSortListeners;
    private _serverPageListeners;
    private _serverFilterListeners;
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
    get serverSide(): IGridServerSideConfig | null;
    set serverSide(config: IGridServerSideConfig | null);
    /** Push a server response and synchronize its pagination metadata. */
    setData(rows: T[], options?: {
        total?: number;
        pageIndex?: number;
        pageSize?: number;
    }): void;
    /** Subscribe to grid-level server delegation outputs. */
    subscribeServerSort(listener: (sort: ISortState[]) => void): () => void;
    subscribeServerPage(listener: (page: IGridServerPage) => void): () => void;
    subscribeServerFilter(listener: (filter: string) => void): () => void;
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
    private _delegatesSort;
    private _delegatesPage;
    private _delegatesFilter;
    private _notifyOrEmitFilter;
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
    /** Angular alias */
    iRowDefExpandSingle?: boolean;
    render: (row: T, ctx: IGridExpandableRowRenderCtx<T>) => ReactNode;
};
declare function IGridExpandableRow<T>(_props: IGridExpandableRowProps<T>): any;
type IGridProps<T> = {
    dataSource: IGridDataSource<T> | T[];
    selectionMode?: IGridSelectionMode;
    selectionRowHidden?: (row: T) => boolean;
    selectionRowDisabled?: (row: T) => boolean;
    tree?: string | boolean | null;
    treeIndent?: number;
    treeColumn?: string;
    treeInitialExpandLevel?: number | null;
    showNumberColumn?: boolean;
    sortMode?: 'multi' | 'single';
    onSelectionChange?: (e: IGridSelectionChange<T>) => void;
    onRowClick?: (row: T) => void;
    onRowExpandChange?: (e: {
        row: T;
        expanded: boolean;
    }) => void;
    onExpandedRowsChange?: (rows: T[]) => void;
    /** Alternative React callback wiring for server-side data sources. */
    onServerSortChange?: (sort: ISortState[]) => void;
    onServerPageChange?: (page: IGridServerPage) => void;
    onServerFilterChange?: (filter: string) => void;
    children?: ReactNode;
    /**
     * If you want React-side highlighting (instead of Angular pipe),
     * pass a function; otherwise plain text will render.
     */
    highlightSearch?: (text: string, filter: string) => ReactNode;
    rowKey?: (row: T, index: number) => string | number;
    /** Angular alias */
    trackBy?: (row: T, index: number) => string | number;
};
type IGridHandle<T> = {
    /** Replaces selection atomically, ignoring rows that are unavailable or ineligible. */
    setSelected: (rows: T[]) => void;
    getSelected: () => T[];
};
declare const IGrid: <T>(props: IGridProps<T> & {
    ref?: React__default.ForwardedRef<IGridHandle<T>>;
}) => React__default.ReactElement;

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
declare function IPaginator(props: IPaginatorProps): React$1.JSX.Element;

type IBreadcrumbItem = {
    label: string;
    url?: string;
};
type IHostApi = {
    navigate: (url: string) => void | Promise<void>;
    setTitle: (title: string | null) => void;
    setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
};
type IMenuApplication = {
    id: string;
    code: string;
    name: string;
    url?: string | null;
    version?: string | null;
};
type IMenuCompany = {
    id: string;
    code: string;
    name: string;
};
type IMenuOpenIn = 'CURRENT_TAB' | 'NEW_TAB' | 'NEW_WINDOW';
type IMenuFavoriteToggleEvent = {
    id: string | number;
    isFavorite: boolean;
};
/**
 * Emitted by `IHSidebar` after the user drag-drops a favorite into a new
 * position. Carries the ordered favorite menu ids so the host app can persist
 * the new display order via the favorites reorder API.
 */
type IMenuFavoriteReorderEvent = {
    /** Favorite menu ids in their new display order (top to bottom). */
    menuIds: (string | number)[];
};
/**
 * Sidebar menu node.
 *
 * Supports two shapes:
 * - Legacy: numeric `menuId`, `menuName`, `menuTypeId` (2 = module, 3 = group /
 *   item), `child`, `level`, `visibility`, `openInNewTab` / `reload`.
 * - Modern (contract-aligned, optional): UUID `id`, `name`, `type`
 *   ('group' | 'item' | 'function'), `children`, `openIn`, `application`,
 *   `companies`, `isFavorite`. Sidebar normalizes modern nodes into the
 *   legacy shape on ingestion; the modern extras are preserved for pin /
 *   favorites / application-grouping rendering.
 */
type IMenu = {
    id?: string;
    name?: string;
    type?: 'group' | 'item' | 'function';
    children?: IMenu[];
    openIn?: IMenuOpenIn | null;
    application?: IMenuApplication | null;
    companies?: IMenuCompany[];
    isFavorite?: boolean;
    /** Backend menu code — used by menu-mode permission checks. */
    menuCode?: string | null;
    menuId?: number;
    menuName?: string;
    menuTypeId?: number;
    parentId?: number;
    sequence?: number;
    child?: IMenu[];
    level?: number;
    visibility?: string;
    selected?: boolean;
    /**
     * Open route using href + target="_blank".
     */
    openInNewTab?: boolean;
    /**
     * Force route to use href instead of routerLink.
     */
    reload?: boolean;
    route?: string | null;
    icon?: string | null;
};
type IUser = {
    employeeCode: string;
    fullName: string;
    userImagePath: string;
};

/**
 * Default Personal Profile URL opened from the sidebar user dropdown. Consumer
 * apps override it via the `personalProfileUrl` prop (per environment).
 */
declare const DEFAULT_PERSONAL_PROFILE_URL = "https://account-dev.paramountenterprise.co.id/personal-profile";
declare function IHContent(props: {
    title?: string | null;
    breadcrumbs?: IBreadcrumbItem[] | null;
    onSidebarToggled?: (visible: boolean) => void;
    defaultSidebarVisible?: boolean;
    onNavigate?: (url: string) => void;
    /** Current boot loading state — consumed by parent apps to render their own loader. */
    loading?: boolean;
    /** Invoked whenever the boot loading state changes. */
    onLoadingChange?: (loading: boolean) => void;
}): JSX.Element;
/**
 * IHContentLayout
 * - Reads title/breadcrumbs from Host UI context
 * - Uses hostApi.navigate when available (MF host mode),
 *   otherwise IHContent falls back to react-router navigate()
 */
declare function IHContentLayout(props: {
    onLoadingChange?: (loading: boolean) => void;
}): JSX.Element;
type IHMenuProps = {
    menu?: IMenu;
    filter: string;
    selectedMenuId: string | number | null;
    onToggleGroup: (menuId: string | number) => void;
    collapsible?: boolean;
    favoriteMode?: boolean;
    /** Render leaf rows draggable (used by the Favorites section for reorder). */
    dragEnabled?: boolean;
    /** Nesting depth from the sidebar root (0 = top level) — drives indentation + the top-level "no group icon" rule. */
    depth?: number;
    /** Render the owning application name next to leaf labels (used by the Favorites section). */
    showApplication?: boolean;
    /** Per-menu-key ancestor path labels (sidebar Favorites section) - rendered instead of the application name when present. */
    pathByKey?: Record<string, string | undefined>;
    onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
};
declare const IHMenu: React__default.NamedExoticComponent<IHMenuProps>;
type IHSidebarProps = {
    user?: IUser | null;
    menus: IMenu[];
    visible?: boolean;
    footerText?: string;
    /** Enable collapsible module headers (chevron + click-to-collapse). */
    collapsible?: boolean;
    /** Enable the favorites section + per-row star toggles. */
    favoriteMode?: boolean;
    /** Favorite menus (modern shape) rendered in the pinned section at the top. */
    favorites?: IMenu[];
    /** Personal Profile page URL opened in a new tab from the sidebar user dropdown. */
    personalProfileUrl?: string;
    onFavoriteToggle?: (event: IMenuFavoriteToggleEvent) => void;
    onFavoriteReorder?: (event: IMenuFavoriteReorderEvent) => void;
};
declare function IHSidebar(props: IHSidebarProps): JSX.Element;
declare function HostShell(props: {
    children: React__default.ReactNode;
}): JSX.Element;

declare function IHostApiProvider(props: {
    hostApi: IHostApi;
    children: React__default.ReactNode;
}): React__default.JSX.Element;
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
    children: React__default.ReactNode;
}): React__default.JSX.Element;
declare function useHostUi(): IHostUiState;

declare function getMenuRoute(menu: IMenu | null | undefined): string | null;
/**
 * Very intentionally simple:
 * If route starts with "http", never use SPA navigation.
 */
declare function isHttpRoute(route: string | null | undefined): boolean;
/**
 * Node key used for tracking and selection — prefers the modern UUID `id`,
 * falls back to the legacy numeric `menuId`.
 */
declare function getMenuKey(menu: IMenu | null | undefined): string | number | null;
/** Display label — prefers the modern `name`, falls back to legacy `menuName`. */
declare function getMenuLabel(menu: IMenu | null | undefined): string;
/** Children — prefers the modern `children`, falls back to legacy `child`. */
declare function getMenuChildren(menu: IMenu | null | undefined): IMenu[];
declare function hasMenuChildren(menu: IMenu | null | undefined): boolean;
/**
 * Walks a menu tree (roots -> children) looking for the node whose key matches
 * `targetKey`, returning the chain from the matching root down to that node.
 * Used to resolve a favorite leaf's ancestor path from the sidebar menu tree.
 */
declare function collectMenuChain(menus: IMenu[] | null | undefined, targetKey: string): IMenu[] | null;
/**
 * Builds a per-menu-key ancestor path label map for the sidebar Favorites
 * section. The label is the chain of ancestor NAMES (excluding the leaf itself)
 * joined by "> ", resolved from the full menu tree - never from the item's
 * route, since route and tree position can differ. A favorite that is not
 * found in the tree maps to `undefined` (callers fall back to the app label);
 * a root-level favorite (no ancestors) maps to an empty string.
 */
declare function buildFavoritePathMap(menus: IMenu[] | null | undefined, favorites: IMenu[] | null | undefined): Record<string, string | undefined>;
/** True for a legacy top-level module header (menuTypeId === 2). */
declare function isModuleMenu(menu: IMenu | null | undefined): boolean;
/** True for a structural group/module node (non-navigable container). */
declare function isGroupNode(menu: IMenu | null | undefined): boolean;
/** True for a navigable leaf node (item / function / legacy leaf menu). */
declare function isLeafItem(menu: IMenu | null | undefined): boolean;
declare function isNewTabMenu(menu: IMenu | null | undefined): boolean;
declare function isReloadMenu(menu: IMenu | null | undefined): boolean;
declare function isSpaMenu(menu: IMenu | null | undefined): boolean;
/**
 * Converts modern (contract-aligned) menu nodes into the legacy `IMenu` shape
 * that `IHMenu` renders. Modern extras (`id`, `isFavorite`, `application`,
 * `companies`, `openIn`, `route`, `icon`) are preserved for pin / favorites /
 * application-grouping rendering. Legacy nodes pass through untouched.
 */
declare function normalizeMenuTree(menus: IMenu[] | null | undefined): IMenu[];

type IRouteComponent = React__default.ComponentType<unknown>;
type ILoadComponent = () => Promise<IRouteComponent>;
type IRoute = {
    path?: string;
    index?: boolean;
    redirectTo?: string;
    title?: string;
    breadcrumb?: string;
    element?: React__default.ReactNode;
    loadComponent?: ILoadComponent;
    children?: IRoutes;
};
type IRoutes = IRoute[];

type IRouterProps = {
    routes: IRoutes;
    loading?: React__default.ReactNode;
    notFound?: React__default.ReactNode;
};
declare function IRouter(props: IRouterProps): React__default.JSX.Element;

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
type IInputMaskType = 'date' | 'integer' | 'number' | 'currency' | 'time' | 'lowercase' | 'uppercase';
type IInputMask = {
    type: IInputMaskType;
    format?: string;
};
type UseInputMaskOptions = {
    enableDefault?: boolean;
};
declare function useInputMask(inputRef: React__default.RefObject<HTMLInputElement | null>, mask: IInputMask | undefined, opts?: UseInputMaskOptions): void;
type IInputAddonProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'children'> & {
    addon: IInputAddons | undefined;
};
declare function IInputAddon(props: IInputAddonProps): React__default.JSX.Element;
type IInputProps = Omit<React__default.InputHTMLAttributes<HTMLInputElement>, 'children' | 'value' | 'defaultValue' | 'readOnly' | 'prepend'> & {
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
    inputRef?: React__default.MutableRefObject<HTMLInputElement | null>;
};
declare const IInput: React__default.ForwardRefExoticComponent<Omit<React__default.InputHTMLAttributes<HTMLInputElement>, "children" | "defaultValue" | "value" | "readOnly" | "prepend"> & {
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
    inputRef?: React__default.MutableRefObject<HTMLInputElement | null>;
} & React__default.RefAttributes<HTMLInputElement>>;
type IFCInputProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'children'> & {
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
    onInput?: React__default.FormEventHandler<HTMLInputElement>;
    onBlur?: React__default.FocusEventHandler<HTMLInputElement>;
};
declare function IFCInput(props: IFCInputProps): React__default.JSX.Element;

type ILoadingProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    label?: string;
    light?: boolean;
};
declare function ILoading(props: ILoadingProps): React$1.JSX.Element;

type IPillSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';
type IPillVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type IPillProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'onClick'> & {
    icon?: IIconInput;
    size?: IPillSize;
    variant?: IPillVariant;
    disabled?: boolean;
    /** show close button */
    closable?: boolean;
    /** fires when user clicks the pill body (not the close button) */
    onClick?: (e: React__default.MouseEvent<HTMLElement>) => void;
    /** fires when user clicks close button */
    onClose?: (e: React__default.MouseEvent<HTMLButtonElement>) => void;
};
declare function IPill({ icon, size, variant, disabled, closable, className, children, onClick, onClose, ...rest }: IPillProps): React__default.JSX.Element;

type ISectionTabBadge = boolean | '' | number | string | null | undefined;
type ISectionTabsHeight = 'wrap' | 'auto' | number | string | null | undefined;
declare function ISection(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
declare function ISectionHeader(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
declare function ISectionSubHeader(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
declare function ISectionFilter(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
declare function ISectionBody(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
declare function ISectionFooter(props: React__default.HTMLAttributes<HTMLElement>): React__default.JSX.Element;
type ISectionTabProps = {
    title?: string;
    opened?: boolean;
    badge?: ISectionTabBadge;
    header?: React__default.ReactNode;
    children?: React__default.ReactNode;
};
declare function ISectionTab(_props: ISectionTabProps): any;
type ISectionTabsProps = React__default.HTMLAttributes<HTMLElement> & {
    selectedIndex?: number | null;
    onSelectedIndexChange?: (index: number) => void;
    height?: ISectionTabsHeight;
    sticky?: boolean;
    stickyTopOffset?: string;
    scrollable?: boolean;
    chevronSize?: Extract<IIconSize, 'sm' | 'md' | 'lg' | 'xl'>;
    tabMinHeight?: string;
    headerClass?: string;
    tabClass?: string;
    styleVariant?: 'default' | 'bar';
    children?: React__default.ReactNode;
};
declare function ISectionTabs(props: ISectionTabsProps): React__default.JSX.Element;

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

/**
 * ISelect + IFCSelect (React)
 * Version: 2.2.7
 *
 * Aligns with Angular i-select 2.2.7:
 * - Render options container as <i-options>
 * - Let dropdown grow from visible control width to fit option text
 * - Keep portal-to-body + fixed positioning for overflow parents
 * - Fix flicker: portal + measure + position before showing panel
 * - Fix selected long value poisoning trigger measurement on next open
 * - Keep dropdown visible if a reposition callback does not reveal it
 */

type ISelectChange<T = any> = {
    value: T | null;
    label: string;
};
type ISelectPanelPosition = 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
type ISelectHandle = {
    focus: () => void;
};
type ISelectProps<T = any> = Omit<React__default.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> & {
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** debounce delay (ms) */
    filterDelay?: number;
    /** minimum chars before filtering (default 0, matching Angular) */
    filterMinLength?: number;
    panelPosition?: ISelectPanelPosition;
    /** portal panel to body to avoid overflow clipping (default true) */
    portalToBody?: boolean;
    /** gap between trigger and panel (px) */
    panelOffset?: number;
    /** match dropdown width to control width (default false, matching Angular) */
    matchTriggerWidth?: boolean;
    /** Array options */
    options?: T[] | null;
    /** Observable options */
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
    renderOption?: (row: T) => React__default.ReactNode;
    /** Angular alias for option template */
    iSelectOption?: (row: T) => React__default.ReactNode;
    /**
     * Selected value (controlled)
     */
    value?: T | null;
    /**
     * Default selected value (uncontrolled)
     * NOTE: keep API allowing null, but we won't pass null into DOM props.
     */
    defaultValue?: T | null;
    /**
     * Event parity (Angular outputs)
     */
    onChange?: (change: ISelectChange<T>) => void;
    /** Angular alias */
    onChanged?: (change: ISelectChange<T>) => void;
    onOptionSelected?: (change: ISelectChange<T>) => void;
};
type IFCSelectHandle = {
    focus: () => void;
};
type IFCSelectProps<T = any> = Omit<React__default.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> & {
    label?: string;
    placeholder?: string;
    options?: T[] | null;
    options$?: Observable<T[]> | null;
    displayWith?: ((row: T | null) => string) | string;
    filterDelay?: number;
    filterMinLength?: number;
    filterPredicate?: (row: T, term: string) => boolean;
    panelPosition?: ISelectPanelPosition;
    /** Angular-like error hooks */
    errors?: IErrors | null;
    errorMessage?: IFormControlErrorMessage;
    /**
     * Angular parity:
     * If submitted is provided, invalid display is gated by submitted.
     * Otherwise invalid display is gated by dirty/touched.
     */
    submitted?: boolean;
    touched?: boolean;
    dirty?: boolean;
    disabled?: boolean;
    /** controlled */
    value?: T | null;
    /** uncontrolled */
    defaultValue?: T | null;
    /** Event parity */
    onChange?: (change: ISelectChange<T>) => void;
    /** Angular alias */
    onChanged?: (change: ISelectChange<T>) => void;
    onOptionSelected?: (change: ISelectChange<T>) => void;
    /** pass-through */
    renderOption?: (row: T) => React__default.ReactNode;
    /** Angular alias for option template */
    iSelectOption?: (row: T) => React__default.ReactNode;
    portalToBody?: boolean;
    panelOffset?: number;
    matchTriggerWidth?: boolean;
    /**
     * Force invalid (non-form usage)
     * Note: IFCSelect already computes invalid from errors + submitted/touched/dirty.
     * This is additive (OR).
     */
    invalid?: boolean;
};
declare const ISelect: <T = any>(props: ISelectProps<T> & {
    ref?: React__default.Ref<ISelectHandle>;
}) => JSX.Element;
declare const IFCSelect: <T = any>(props: IFCSelectProps<T> & {
    ref?: React__default.Ref<IFCSelectHandle>;
}) => JSX.Element;

type ITextAreaProps = Omit<React__default.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange' | 'readOnly'> & {
    value?: string | null;
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    placeholder?: string;
    onChange?: (value: string) => void;
};
declare function ITextArea(props: ITextAreaProps): React__default.JSX.Element;
type IFCTextAreaProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'onChange'> & {
    label?: string;
    placeholder?: string;
    readonly?: boolean;
    rows?: number;
    errorMessage?: IFormControlErrorMessage;
    value?: string | null;
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
declare function IFCTextArea(props: IFCTextAreaProps): React__default.JSX.Element;

type IToggleSize = 'xs' | 'sm' | 'md' | 'lg';
type IToggleProps = Omit<React__default.HTMLAttributes<HTMLElement>, 'onChange' | 'children'> & {
    /** Controlled value */
    checked?: boolean;
    /** Uncontrolled initial value */
    defaultChecked?: boolean;
    disabled?: boolean;
    /** Toggle size. Uses the matching Insight design token. */
    size?: IToggleSize;
    /** Label content: <IToggle>Label</IToggle> */
    children?: React__default.ReactNode;
    /** Put label left or right */
    labelPosition?: 'left' | 'right';
    /** Matches your convention */
    onChange?: (checked: boolean) => void;
    /** Optional: touched semantics */
    onTouched?: () => void;
};
declare function IToggle(props: IToggleProps): React__default.JSX.Element;

/**
 * Shape of `@insight/ui`'s default environment.
 *
 * The library's services read a subset of these fields. `api` is an open-ended
 * registry of backend base URLs so consumer apps can register additional
 * service endpoints. Mirrors `insight-ui-angular`'s `IEnvironment`.
 */
type IEnvironment = {
    production: boolean;
    releaseStage: string;
    appName: string;
    version: string;
    /** API base URLs grouped by backend service. `identity` is intentionally empty in the default env - the consumer app supplies its own BFF/identity host. */
    api: {
        identity: string;
        user: string;
        configuration: string;
        application: string;
        [key: string]: string;
    };
    /** Full URL of this app's sign-in page. Left empty by default - set by the consumer app. */
    signinUrl: string;
    /** Full URL of this app's own auth callback (informational, unused by the library). */
    authCallbackUrl: string;
    securityMode: boolean;
    tokenLifespan: {
        accessTokenSeconds: number;
        refreshTokenSeconds: number;
        ssoSessionMaxSeconds: number;
    };
    cookieSecure: boolean;
    /** CSRF token max age in seconds (backend cookie maxAge minus a safety buffer). */
    csrfTokenMaxAgeSeconds: number;
    /** MFA challenge session timeout (seconds). */
    mfaChallengeSessionTimeoutSeconds?: number;
    /** Origins this app's sign-in page trusts for post-login redirects (informational). */
    allowedReturnOrigins: string[];
    /** This app's registered application API key (attached as `Api-Key` header). */
    apiKey?: string;
    /** This app's application id (used as the default filter when loading effective menus). */
    appId?: string;
    /** Personal Profile page URL opened from the sidebar user dropdown. Defaults to the shared account URL when empty. */
    personalProfileUrl?: string;
};

/**
 * Default environment for `@insight/ui`'s shared data layer.
 *
 * `api.identity`, `signinUrl` and `authCallbackUrl` are intentionally EMPTY -
 * the library does not default to any shared identity provider. Each consumer
 * app supplies its own values (its own BFF/identity host) via
 * `IAuthProvider` / `resolveIAuthConfig`. The
 * `user`/`configuration`/`application` keys keep defaulting to the platform
 * services and can still be overridden.
 */
declare const environment: IEnvironment;

/** Normalized current and legacy backend error fields with extension metadata. */
type INormalizedApiError = {
    status?: number;
    errorCode?: string;
    code?: string;
    message?: string;
    revision?: number;
    detail?: string;
    title?: string;
    retryAfter?: number;
    [key: string]: unknown;
};
/** Optional synchronous catalog lookup supplied by the consumer application. */
type IApiErrorCatalogResolver = (errorCode: string, revision: number | undefined, error: INormalizedApiError) => string | null | undefined;
/** Normalize current catalog errors, legacy Problem Details, and raw transport errors. */
declare function normalizeApiError(error: unknown): INormalizedApiError;
/** Resolve display text as backend message, catalog, legacy detail/title, then local fallback. */
declare function resolveApiErrorDisplayMessage(error: unknown, localFallback: string, catalogResolver?: IApiErrorCatalogResolver): string;

/**
 * Token lifespan configuration (seconds). Mirrors the platform-wide AC used by
 * iam-web: Access Token 1h, Refresh Token 2h, Max SSO Session 15h. Consumer
 * apps should reuse the exact same values as iam-web for consistency, not
 * invent their own policy.
 */
type ITokenLifespan = {
    accessTokenSeconds: number;
    refreshTokenSeconds: number;
    ssoSessionMaxSeconds: number;
};
/**
 * Relative endpoint paths served by the configured identity host (`api.identity`).
 *
 * The library never assumes a specific identity provider's route layout. These
 * default to the platform contract (`/auth/csrf`, `/auth/login`, ...) shared by
 * iam-identity-api and the reference BFF (atlas-api); a consumer app can point
 * them at whatever routes its own backend exposes. Paths are relative to
 * `api.identity` - the host (including any mount prefix) comes from there.
 *
 * Only the auth-facade endpoints are configurable. MFA/password routes are used
 * by identity-owner apps only (e.g. iam-web) and stay fixed.
 */
type IAuthEndpoints = {
    /** CSRF bootstrap: `GET {identity}{csrf}` returns `{ csrfToken }` and sets the CSRF cookie. */
    csrf?: string;
    /** Mode-2 username/password login: `POST {identity}{login}` (identity-owner apps only). */
    login?: string;
    /** Silent session refresh via the HttpOnly session cookie: `POST {identity}{refresh}`. */
    refresh?: string;
    /** Server-side session clear (CSRF-protected): `POST {identity}{logout}`. */
    logout?: string;
    /** Cross-app handoff: `POST {identity}{exchange}` carrying the `at=` token in `Authorization`. */
    exchange?: string;
};
/** Default relative endpoint paths for the configured identity host. */
declare function getDefaultIAuthEndpoints(): IAuthEndpoints;
/**
 * Configuration required by @insight/ui's shared SSO stack
 * (`IAuthProvider`, session/api/csrf services, `IRequireAuth`,
 * `IAuthCallback`). Mirrors the Angular `IAuthConfig`.
 */
type IAuthConfig = {
    /**
     * API base URLs grouped by backend service. `identity` is REQUIRED and must
     * point at this app's OWN auth backend (typically a same-origin BFF that
     * proxies iam-identity and owns the session cookie, e.g. an atlas-api
     * instance) - never at the shared identity provider. All session calls
     * (csrf, refresh, logout) go through it. No default is baked in.
     */
    api: {
        identity: string;
        [key: string]: string;
    };
    /**
     * REQUIRED. Full URL of this app's sign-in page - the app redirects here
     * when unauthenticated. For BFF-mode apps this is the app's own login route
     * (e.g. `{identity}/auth/login`); for identity-owner apps (iam-web) it is
     * their signin page. No default is baked in.
     */
    signinUrl: string;
    /**
     * This app's own SSO callback route, e.g. `/auth/callback` (default).
     * `IRequireAuth`/the api client always redirect through this route (never
     * through the page the user was originally trying to visit) so the
     * `#at=<token>` handoff has a dedicated place to be consumed and stripped
     * before the user is sent on to their original destination.
     */
    callbackPath?: string;
    /**
     * Trusted origins for post-callback/return redirects. Absolute URLs matching
     * any origin here are allowed; all others fall back to '/'. Wildcards are
     * supported (e.g. `https://*.paramountenterprise.co.id`). Relative paths
     * (starting with `/`) are always allowed regardless of this list.
     */
    allowedReturnOrigins: string[];
    tokenLifespan: ITokenLifespan;
    /** CSRF token max age in seconds (backend cookie maxAge minus a safety buffer). */
    csrfTokenMaxAgeSeconds: number;
    /**
     * Optional relative endpoint paths served by the configured identity host
     * (`api.identity`). Defaults match the platform / reference-BFF contract -
     * override when this app's backend exposes different routes.
     */
    endpoints?: IAuthEndpoints;
    /**
     * This app's registered application API key (iam-user-api `application.api_key`).
     * Attached as an `Api-Key` header on every request. Empty/undefined disables it.
     */
    apiKey?: string;
    /**
     * This app's application id (iam-user-api `application.id`). Used as the
     * default `applicationId` when loading the effective menus, so each app only
     * sees its own application's navigation. Empty/undefined keeps the legacy
     * all-applications behaviour.
     */
    appId?: string;
    /**
     * How the api client handles a failed session refresh:
     * - `'dialog'`: show the library session-expired dialog (default).
     * - `'redirect'`: legacy behaviour — full-page redirect to the signin page.
     * When `onUnauthorized` is provided it takes precedence and disables both.
     */
    unauthorizedHandling?: 'dialog' | 'redirect';
    /**
     * Optional consumer-owned handler invoked when a session refresh fails.
     * Overrides `unauthorizedHandling` — neither the dialog nor the redirect
     * runs when this is provided.
     */
    onUnauthorized?: (error: unknown) => void;
    /** Optional synchronous catalog lookup used only when the backend message is absent. */
    errorCatalogResolver?: IApiErrorCatalogResolver;
};
/**
 * Overrides accepted by `resolveIAuthConfig()`. Every field is optional
 * and merged on top of `getDefaultIAuthConfig()` — including individual
 * `api.*`, `tokenLifespan.*` and `endpoints.*` entries, so a consumer app can
 * override just `api.identity` (e.g. for staging/production) without restating
 * the rest of the config.
 */
type IAuthConfigOverrides = Partial<Omit<IAuthConfig, 'api' | 'tokenLifespan'>> & {
    api?: Partial<IAuthConfig['api']>;
    tokenLifespan?: Partial<ITokenLifespan>;
};
/**
 * Default `IAuthConfig`. `api.identity` and `signinUrl` are left EMPTY
 * (no shared identity host is baked in) - a consumer app MUST supply its own
 * values via `resolveIAuthConfig({ ... })` and is validated fail-fast
 * when it forgets. All other fields default sensibly: `allowedReturnOrigins`
 * to this app's own origin, `endpoints` to the platform/BFF path contract, and
 * lifespan / csrf / api-key values from the library's default environment.
 */
declare function getDefaultIAuthConfig(): IAuthConfig;
/**
 * Merge overrides on top of defaults (deep for `api`, `tokenLifespan` and
 * `endpoints`) - the React analog of Angular's `provideIAuth(config)`
 * config resolution.
 */
declare function resolveIAuthConfig(overrides?: IAuthConfigOverrides): IAuthConfig;
/**
 * The configured identity host (`api.identity`) or a descriptive error. Used by
 * auth services before building a request URL so a missing per-app host fails
 * loudly instead of producing a relative/undefined URL.
 */
declare function requireIdentityHost(config: IAuthConfig): string;
/**
 * Relative path of an identity endpoint for the current config. Falls back to
 * `getDefaultIAuthEndpoints()` when the consumer did not override it.
 */
declare function getAuthEndpointPath(config: IAuthConfig, key: keyof IAuthEndpoints): string;
/**
 * Absolute URL of an identity endpoint: `{api.identity}{path}`. Throws a
 * descriptive error when the identity host is not configured.
 */
declare function getAuthEndpointUrl(config: IAuthConfig, key: keyof IAuthEndpoints): string;
/**
 * Validate a resolved auth config at bootstrap. Throws a descriptive error when
 * the mandatory per-app values (`api.identity`, `signinUrl`) are missing so a
 * misconfigured consumer fails fast instead of silently calling an undefined
 * host.
 */
declare function validateIAuthConfig(config: IAuthConfig): void;

type ISanitizedReturnUrl = {
    returnUrl: string;
    isExternal: boolean;
};
/**
 * Validate and sanitize a `returnUrl` for post-login / post-callback redirect.
 * Ported from iam-web's `signin.ts::sanitizeReturnUrl()` — behavior is kept
 * identical so consumer apps and iam-web enforce the exact same open-redirect
 * protection:
 *
 * - Relative paths (starting with `/`) are always allowed.
 * - Protocol-relative URLs (`//`) are rejected — always fall back to `/`.
 * - Absolute URLs are checked against `allowedReturnOrigins` (wildcard
 *   supported, e.g. `https://*.paramountenterprise.co.id`).
 * - Anything else (invalid URL, untrusted origin, unknown scheme) falls back to `/`.
 *
 * `isExternal: true` means the caller must do a full `window.location.href`
 * navigation, not an in-app router navigation.
 */
declare function sanitizeReturnUrl(url: string | null | undefined, allowedReturnOrigins: string[]): ISanitizedReturnUrl;

/**
 * Build the full external URL to the app's configured sign-in page
 * (`config.signinUrl` - its own BFF login or iam-web signin) for a cross-domain
 * SSO redirect, routing the eventual handoff through THIS APP'S OWN callback
 * route (`config.callbackPath`, default `/auth/callback`) — never through the
 * page the user originally tried to visit.
 *
 * This is deliberate and fixes a real redirect loop: if the guard used
 * `window.location.href` (the current page) as the returnUrl directly,
 * the sign-in page's handoff would append `#at=<token>` to THAT SAME page. Since that
 * page still doesn't have a stored session yet at the moment it re-renders,
 * the guard would fire again, capture `window.location.href` again — which
 * NOW ALREADY CONTAINS the previous `#at=` fragment — and redirect back to
 * back to the sign-in page with an ever-growing `returnUrl`, eventually overflowing header
 * size limits (HTTP 431).
 *
 * Routing through a dedicated callback route breaks the loop: the callback
 * page (`IAuthCallback`) consumes and strips the token BEFORE navigating (via
 * the in-app router, not a full reload) to `targetPath` — so the guard only
 * ever sees a clean, token-free URL on its next check.
 */
declare function buildExternalSigninUrl(config: IAuthConfig, targetPath: string): string;

/**
 * CSRF token management — cookie-to-header pattern for @insight/ui consumer apps.
 * Mirrors `@insight/ui`'s Angular `ICsrfService`:
 *
 *   1. FE calls GET {api.identity}{csrf endpoint} (default `/auth/csrf`).
 *   2. Backend returns `{ csrfToken }` in the JSON body AND sets a `csrf_token` cookie.
 *   3. FE stores the token in memory (JS cannot read cross-origin cookies).
 *   4. FE sends the token back as `X-CSRF-Token` header on mutating requests.
 *   5. Backend validates: header value === cookie value.
 *
 * Token expiration mirrors the backend cookie maxAge (minus a safety buffer,
 * configured via `csrfTokenMaxAgeSeconds`) so the FE transparently re-fetches
 * before the server-side cookie actually expires.
 */
declare class ICsrfService {
    private readonly config;
    /** In-memory CSRF token — retrieved from the backend response body, never from document.cookie directly. */
    private token;
    private tokenFetchedAt;
    constructor(config: IAuthConfig);
    /**
     * Return the in-memory CSRF token, or `null` if never fetched or expired
     * (expiry triggers callers to re-invoke `ensureToken()`).
     */
    getToken(): string | null;
    /** Whether the in-memory token has exceeded its TTL (`csrfTokenMaxAgeSeconds`). */
    isTokenExpired(): boolean;
    /**
     * Fetch a fresh CSRF token from the configured identity host and store it in
     * memory. On failure the error is propagated - a failed fetch must not be
     * silently swallowed.
     */
    ensureToken(): Promise<void>;
}

/**
 * Unified login response. When MFA is required, only `mfa*` fields are set and
 * `accessToken` is absent. Once MFA is verified, `accessToken`/`expiresIn`/
 * `user` are populated and `mfaRequired` is false/absent.
 */
type ILoginResponse = {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    user?: IAuthUser;
    mfaRequired?: boolean;
    mfaStep?: 'CHALLENGE' | 'ENROLL';
    mfaSessionId?: string;
    qrCodeUri?: string;
    secret?: string;
    passwordExpired?: boolean;
    changePasswordToken?: string;
    requiresV2Challenge?: boolean;
};
type IMfaChallengeResponse = {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    user: IAuthUser;
};
type IRefreshResponse = {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
};
/** User claims decoded from the access token / returned by the backend. */
type IAuthUser = {
    sub: string;
    email: string;
    name: string;
    roles: string[];
    userType: 'internal' | 'external';
};
type IForgotPasswordResponse = {
    message: string;
    token?: string;
    link?: string;
};
type IValidateResetTokenResponse = {
    valid: boolean;
    reason?: 'invalid' | 'expired' | 'used';
    email?: string;
};
type IResetPasswordResponse = {
    success: boolean;
    message: string;
    reason?: 'invalid' | 'expired' | 'used' | 'history';
};
/**
 * Auth facade against the configured identity host (`api.identity`) - typically
 * a Mode-2 proxy (Keycloak is never exposed to the frontend) or an app's own
 * BFF. Endpoint paths are relative and come from `config.endpoints` (defaults
 * match the platform/BFF contract). MFA/password methods are identity-owner
 * routes and stay fixed.
 * React analog of the Angular `IAuthService`.
 */
declare class IAuthService {
    private readonly config;
    private readonly csrf;
    constructor(config: IAuthConfig, csrf: ICsrfService);
    private get identityUrl();
    login(username: string, password: string, recaptchaToken?: string, isChallengeResponse?: boolean): Promise<ILoginResponse>;
    /** Silently refresh the access token via the HttpOnly session cookie. */
    refresh(): Promise<IRefreshResponse>;
    /** Clear the server-side session and expire the HttpOnly session cookie. */
    logout(refreshToken?: string): Promise<void>;
    /** Exchange a short-lived `at=` auth token for a full session (cross-app handoff). */
    exchangeAuthToken(authToken: string): Promise<ILoginResponse>;
    /** Verify the MFA TOTP code during a login challenge. */
    verifyMfaChallenge(mfaSessionId: string, totpCode: string): Promise<IMfaChallengeResponse>;
    /** Verify the TOTP code during first-time MFA enrollment (forced at login). */
    verifyMfaEnroll(mfaSessionId: string, totpCode: string): Promise<IMfaChallengeResponse>;
    /** Self-service MFA — check enrollment status (`GET /profile/mfa`). */
    selfServiceGetStatus(): Promise<{
        enrolled: boolean;
        createdAt?: string;
        lastUsedAt?: string;
    }>;
    /** Self-service MFA — initiate enrollment to get the QR & session id (`POST /profile/mfa/enroll`). */
    selfServiceEnrollInitiate(): Promise<{
        qrCodeUri: string;
        secret: string;
        enrollmentSessionId: string;
    }>;
    /** Self-service MFA — verify OTP and complete enrollment (`POST /profile/mfa/enroll/verify`). */
    selfServiceEnrollVerify(enrollmentSessionId: string, totpCode: string): Promise<void>;
    /** Self-service reset (un-enroll) MFA for the current user — requires password (`DELETE /profile/mfa`). */
    selfServiceResetMfa(userSub: string, password: string): Promise<void>;
    /**
     * Change password when it has expired (forced change flow). Uses a short-lived
     * `changePasswordToken` (10 min, scope `change_password_only`) as the Bearer
     * header. Backend returns a full accessToken on success so the user continues
     * seamlessly without re-login.
     */
    changePassword(changePasswordToken: string, newPassword: string, confirmPassword: string): Promise<{
        success: boolean;
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: number;
    }>;
    /** Request a password-reset link via email or WhatsApp (`POST /auth/forgot-password`). */
    forgotPassword(identifier: string, mode: 'email' | 'whatsapp'): Promise<IForgotPasswordResponse>;
    /** Validate a reset token before showing the reset form (`GET /auth/reset-password/validate`). */
    validateResetToken(token: string): Promise<IValidateResetTokenResponse>;
    /** Submit a new password using the reset token (`POST /auth/reset-password`). */
    resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<IResetPasswordResponse>;
    private getLockoutData;
    private recordFailedAttempt;
    private resetLockout;
}

/**
 * Extract the access token appended by the sign-in host after a successful
 * external SSO redirect. Reads the URL HASH FRAGMENT (`#at=<token>`) —
 * deliberately NOT a query parameter — so the token is never sent to the
 * server and never appears in access/gateway logs (fragments are browser-only).
 */
declare function extractAccessTokenFromHash(hash?: string): string | null;
/**
 * Reusable SSO callback route component for @insight/ui consumer apps — the
 * React analog of Angular's `IAuthCallback`. Register it at whatever route
 * path is used as the `returnUrl` when redirecting to the configured signinUrl:
 * ```tsx
 * { path: 'auth/callback', element: <IAuthCallback /> }
 * ```
 *
 * Flow:
 *  1. Extract the `at` token from the URL hash fragment.
 *  2. Store it via `session.setAccessToken` (in-memory only).
 *  3. Clear the fragment from the URL immediately (never leave the token
 *     sitting in browser history).
 *  4. Validate & redirect to the original in-app `returnUrl` (query param
 *     `returnUrl`, defaulting to `/`), using the same `sanitizeReturnUrl`
 *     rules as the sign-in page.
 */
declare function IAuthCallback(): ReactNode;

type IApiError = INormalizedApiError;
/**
 * Normalize a failed fetch response into a consistent shape:
 * `{ status, detail, retryAfter, ...rest }`. `retryAfter` is read from the
 * body or the `Retry-After` header, so 429/423 responses surface it untouched
 * for rate-limit/lockout UX.
 */
declare function normalizeFetchError(res: Response, body: unknown): Promise<IApiError>;
type IRequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    /** Override the default API base URL. */
    apiUrl?: string;
    params?: Record<string, string | number | boolean | undefined> | URLSearchParams;
};
/**
 * Low-level fetch wrapper (mirrors `@insight/ui` Angular `IApiService`):
 * - `credentials: 'include'` on every request (CSRF cookie + HttpOnly refresh cookie flow)
 * - automatic `X-CSRF-Token` injection
 * - RFC 9457 Problem Details error enrichment (`status` / `detail` / `retryAfter`)
 *
 * Does NOT inject `Authorization` — that is the api client's (consumer) job so
 * auth endpoints (csrf/refresh) never receive a Bearer header.
 */
declare function rawRequest<T = unknown>(baseUrl: string, path: string, csrf: ICsrfService | null, options?: IRequestOptions): Promise<T>;
/** Build a full URL from base + path + query params. */
declare function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined> | URLSearchParams): string;
type IApiOptions = {
    /** Override the default API base URL (e.g. to call a different backend service). */
    apiUrl?: string;
    /** Additional headers to merge with the defaults. */
    headers?: Record<string, string>;
    /** Request body (only used by DELETE requests that send a payload). */
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined> | URLSearchParams;
    /**
     * Skip attaching the `Authorization: Bearer` header for this call. The flag
     * also disables the 401 refresh-retry for this request (a bearer-less call
     * cannot be fixed by refreshing the token).
     */
    skipBearer?: boolean;
};
type IApiClientDeps = {
    config: IAuthConfig;
    csrf: ICsrfService;
    session: {
        getAccessToken(): string | null;
        isTokenExpired(): boolean;
        refreshToken(): Promise<string>;
        clearSession(): void;
    };
    /** Called when a refresh fails and the session must be considered expired. */
    onSessionExpired?: (error: IApiError) => void;
};
type IApiClient = {
    get<T = unknown>(path: string, options?: IApiOptions): Promise<T>;
    post<T = unknown>(path: string, body?: unknown, options?: IApiOptions): Promise<T>;
    put<T = unknown>(path: string, body?: unknown, options?: IApiOptions): Promise<T>;
    patch<T = unknown>(path: string, body?: unknown, options?: IApiOptions): Promise<T>;
    delete<T = unknown>(path: string, options?: IApiOptions): Promise<T>;
};
/**
 * Consumer-facing HTTP client for @insight/ui apps — the React analog of the
 * Angular `IApiService` + `authInterceptor` combo:
 * - CSRF header + `credentials: 'include'`
 * - `Authorization: Bearer <accessToken>` attached (except the configured csrf/refresh endpoints)
 * - on 401: single silent refresh (single-flight) + one retry
 * - on refresh failure: `clearSession()` + `onSessionExpired()` + redirect to signin
 * - RFC 9457 Problem Details error enrichment
 */
declare function createApiClient(deps: IApiClientDeps): IApiClient;

type ISessionExpiredReason = 'TOKEN_EXPIRED' | 'SESSION_REVOKED' | 'SESSION_REPLACED';
/** Supports normalized Problem Details errors and raw legacy HTTP error bodies. */
declare const extractProblemDetailsErrorCode: (error: unknown) => string | undefined;
/** Maps current backend and legacy error codes to the session-expired UI states. */
declare const toSessionExpiredReason: (errorCode: string | undefined) => ISessionExpiredReason | undefined;
/**
 * True when an error is semantically a session-expiry event (HTTP 401/498 or a
 * recognized session-related error code). Other statuses are business/transport
 * errors and must be handled by the caller instead of forcing a logout.
 */
declare const isSessionExpiredError: (error: unknown) => boolean;
/**
 * In-memory overlay state for the session-expired UI.
 *
 * Besides the derived `reason`, the service also exposes the RAW backend error
 * code and Problem Details `detail` so consumer apps (e.g. iam-web) can resolve
 * a localized display message from their own error-catalog service without the
 * library ever calling the configuration API.
 *
 * This is a tiny observable store — subscribe + getVersion so `useSyncExternalStore`
 * re-renders consumers when the overlay state changes.
 */
declare class ISessionExpiredService {
    private visibleValue;
    private returnUrlValue;
    private reasonValue;
    private errorCodeValue;
    private detailValue;
    private messageValue;
    private apiErrorValue;
    private version;
    private listeners;
    subscribe: (listener: () => void) => (() => void);
    getVersion: () => number;
    private notify;
    get visible(): boolean;
    get returnUrl(): string;
    get reason(): ISessionExpiredReason | undefined;
    get errorCode(): string | null;
    get detail(): string | null;
    get message(): string | null;
    get apiError(): INormalizedApiError | null;
    show(returnUrl: string, reason?: ISessionExpiredReason, errorCode?: string | null, detail?: string | null, message?: string | null, apiError?: INormalizedApiError | null): void;
    hide(): void;
}
declare const sessionExpiredService: ISessionExpiredService;

/**
 * Types for the current-user navigation, favorites and effective-authorization
 * data, matched to the iam-user-api user-menu service contract
 * (`GET {api.user}/me/menus*`, `GET {api.user}/me/authorizations` and
 * `GET {api.user}/users/user`). These are the raw backend shapes; the library
 * maps them onto the UI-facing `IMenu` / `IUser` contracts via `user.mapper.ts`.
 */
/** Standard `{ meta, data }` response envelope used by the user-menu endpoints. */
type IUserMenuEnvelopeDto<T> = {
    meta: {
        timestamp: string;
    };
    data: T;
};
/** Navigation target for a menu node. */
type IMenuOpenInDto = 'CURRENT_TAB' | 'NEW_TAB' | 'NEW_WINDOW';
/** Owning application reference for a menu node. */
type IMenuApplicationDto = {
    id: string;
    code: string;
    name: string;
    url: string | null;
    version: string | null;
};
/** Effective company access for a menu node. */
type IMenuCompanyDto = {
    id: string;
    code: string;
    name: string;
};
/** Effective menu node returned by `GET {api.user}/me/menus` (user-menu contract). */
type IMenuNodeDto = {
    id: string;
    name: string;
    type: 'group' | 'item';
    menuCode: string | null;
    parentId: string | null;
    route: string | null;
    icon: string | null;
    openIn: IMenuOpenInDto | null;
    sequence: number;
    application: IMenuApplicationDto;
    companies: IMenuCompanyDto[];
    isFavorite: boolean;
    children: IMenuNodeDto[];
};
/** Favorite item returned by `GET {api.user}/me/menus/favorites`. */
type IFavoriteMenuItemDto = {
    id: string;
    name: string;
    /** User-controlled display order (1..n). */
    displayOrder: number;
    menuCode: string | null;
    route: string | null;
    icon: string | null;
    openIn: IMenuOpenInDto | null;
    application: IMenuApplicationDto;
    companies: IMenuCompanyDto[];
};
/** One entry of the reorder payload for `PUT {api.user}/me/menus/favorites`. */
type IFavoriteOrderItemDto = {
    menuId: string;
    displayOrder: number;
};
/** Current user returned by `GET {api.user}/users/user` (iam-user-api `CurrentUserDto`). */
type ICurrentUserDto = {
    userId: string;
    username: string;
    fullName: string;
    employeeCode: string | null;
    email: string;
    photoUrl: string | null;
    userType: 'internal' | 'external';
    occupationName: string | null;
    departmentName: string | null;
    enabled: boolean;
};
/**
 * Kind of effective authorization entry:
 * - `item` = navigable `MENU_ITEM`
 * - `function` = feature/action grant (`FUNCTION`)
 */
type IEffectiveAuthorizationType = 'item' | 'function';
/**
 * One entry returned by `GET {api.user}/me/authorizations` (iam-user-api
 * `EffectiveAuthorizationDto`). The backend already applied the full effective
 * authorization pipeline (active application mapping, roles + additional-menu
 * grants, company scope, denied menu/company) and returns ONLY entries whose
 * final decision is `allowed`, restricted to `MENU_ITEM` / `FUNCTION` menus,
 * sorted by `menuCode`.
 */
type IEffectiveAuthorizationDto = {
    menuCode: string;
    menuId: string;
    type: IEffectiveAuthorizationType;
    /**
     * Companies the grant is scoped to. Follows the menu's company scope, so a
     * `function` entry with scope `ALL` carries the full company list; an empty
     * array means the resolved company pool was empty.
     */
    companies: IMenuCompanyDto[];
};

/**
 * Maps the backend current-user DTO to `@insight/ui`'s sidebar `IUser` shape
 * (`employeeCode` / `fullName` / `userImagePath`), falling back to `username`.
 * `userImagePath` is `''` when no photo exists — the sidebar renders it with
 * `IAvatar`, which falls back to a user icon when the image is empty/errors.
 */
declare function mapToSidebarUser(user: ICurrentUserDto): IUser;
/** Maps a backend effective-menu node onto the UI-facing `IMenu` (modern shape). */
declare function toIMenu(node: IMenuNodeDto): IMenu;
/** Maps an array of backend effective-menu nodes onto `IMenu[]`. */
declare function toIMenus(nodes: IMenuNodeDto[]): IMenu[];
/** Maps a backend favorite item onto the UI-facing `IMenu` (modern shape). */
declare function toIMenuFavorite(item: IFavoriteMenuItemDto): IMenu;
/**
 * Recursively collects the `menuCode` of every navigable leaf item across a
 * menu tree (deduplicated, order preserved). Structural group/module nodes are
 * excluded so a container code never counts as a grant - matching the flat
 * granted-code list the legacy menu token carried (`IHasMn` menu mode).
 */
declare function collectMenuCodes(menus: IMenu[]): string[];
/** Normalizes a route path for comparison (strips surrounding slashes). */
declare function normalizeRoutePath(route: string): string;
/**
 * Recursively collects the `route` of every navigable leaf item across a menu
 * tree (deduplicated, order preserved). The union of these routes is the set
 * of pages the current user is granted to open.
 */
declare function collectLeafRoutes(menus: IMenu[]): string[];
/** True when any granted leaf menu route equals `path` (slash-normalized). */
declare function hasAnyRoute(menus: IMenu[], path: string): boolean;
/**
 * Menu-mode permission check: returns true if the user's loaded menus contain
 * ANY of the given menu codes. An empty set of menus (not yet loaded) always
 * returns `false` — gated UI renders only once the store has data.
 */
declare function hasAnyMenuCode(menus: IMenu[], code: string | string[]): boolean;
/** First navigable leaf route in a menu tree — a sensible post-login default landing. */
declare function findFirstLeafRoute(menus: IMenu[]): string | null;
/** Finds a menu node's display name by id (recursive), or null. */
declare function findMenuNameById(menus: IMenu[], menuId: string | number): string | null;

/**
 * Current-user navigation & favorites service — calls iam-user-api's
 * `/me/menus*` endpoints (user-menu service contract). These endpoints return
 * a `{ meta, data }` envelope; this service unwraps `.data` so callers keep
 * the app-wide body-as-data convention.
 *
 * Base URL: `{api.user}` from the resolved auth config (defaults to the
 * library environment file). React analog of the Angular `IUserMenuService`.
 */
declare class IUserMenuService {
    private readonly config;
    private readonly api;
    constructor(config: IAuthConfig, api: IApiClient);
    private get baseUrl();
    /** GET `{api.user}/me/menus` — effective navigation tree for one or all active applications. */
    getEffectiveMenus<T = IMenuNodeDto[]>(applicationId?: string): Promise<T>;
    /** GET `{api.user}/me/menus/favorites` — effective favorite items, sorted by name. */
    getFavorites<T = IFavoriteMenuItemDto[]>(applicationId?: string): Promise<T>;
    /**
     * GET `{api.user}/me/authorizations?applicationId=...` — the complete set of
     * effective authorizations (menu items + functions) for the current user,
     * already reduced to `allowed` entries by the backend.
     *
     * The backend REQUIRES `applicationId`, so it falls back to `config.appId`
     * and fails loudly when neither is configured (fail-closed: the caller's
     * permission list simply stays empty).
     */
    getAuthorizations<T = IEffectiveAuthorizationDto[]>(applicationId?: string): Promise<T>;
    /** PUT `{api.user}/me/menus/{menuId}/favorite` — pin an effective menu item (204 No Content). */
    addFavorite(menuId: string | number): Promise<void>;
    /** DELETE `{api.user}/me/menus/{menuId}/favorite` — unpin a menu item (204 No Content). */
    removeFavorite(menuId: string | number): Promise<void>;
    /**
     * PUT `{api.user}/me/menus/favorites` — atomically replace the complete
     * favorite collection after a drag-drop. `displayOrder` values form the
     * complete sequence 1..n. Returns 204 No Content.
     */
    reorderFavorites(menuIds: (string | number)[]): Promise<void>;
}

/**
 * Current-user profile service — calls iam-user-api's `GET {api.user}/users/user`
 * endpoint (`CurrentUserDto`). The sidebar-shaped mapping (`IUser`) lives in
 * `user.mapper.ts` (`mapToSidebarUser`).
 *
 * Base URL: `{api.user}` from the resolved auth config (defaults to the
 * library environment file). React analog of the Angular `ICurrentUserService`.
 */
declare class ICurrentUserService {
    private readonly config;
    private readonly api;
    constructor(config: IAuthConfig, api: IApiClient);
    private get baseUrl();
    /** GET `{api.user}/users/user` — raw current-user DTO. Override `T` to use your own response type. */
    getCurrentUser<T = ICurrentUserDto>(): Promise<T>;
}

/**
 * In-memory store for the current user's sidebar data — user profile, effective
 * navigation menus, favorites — and permission checks (React analog of the
 * Angular `IUserMenuStore`).
 *
 * Everything lives in memory; NOTHING is persisted to Web Storage. On a cold
 * start (page load) consumers call `load()` to re-fetch user, menus, favorites
 * and effective authorizations; the store then re-emits so gated UI
 * (`usePermission` / `<IHasMn>`) re-renders reactively once data is available
 * (async-aware).
 *
 * Observable store: `subscribe` + `getVersion` for `useSyncExternalStore`.
 */
type IUserMenuLoadSource = 'user' | 'menus' | 'favorites' | 'permissions';
type IUserMenuLoadErrors = Record<IUserMenuLoadSource, INormalizedApiError | null>;
declare class IUserMenuStore {
    private readonly currentUserService;
    private readonly menuService;
    private readonly session;
    private currentUserValue;
    private rawCurrentUserValue;
    private menusValue;
    private favoritesValue;
    private rolesValue;
    private permissionsValue;
    private initializingValue;
    private loadErrorValue;
    private loadErrorsValue;
    /** Identity (`sub`) whose data is currently cached — invalidated on user switch. */
    private loadedUserSub;
    private version;
    private listeners;
    constructor(currentUserService: ICurrentUserService, menuService: IUserMenuService, session: ISessionService);
    subscribe: (listener: () => void) => (() => void);
    getVersion: () => number;
    private notify;
    /** Sidebar-shaped current user (`IUser`) — `null` until loaded. */
    get currentUser(): IUser | null;
    /** Raw current-user DTO as returned by the backend — `null` until loaded. */
    get rawCurrentUser(): ICurrentUserDto | null;
    /** Effective navigation tree (`IMenu` modern shape). */
    get menus(): IMenu[];
    /** Favorite menus (`IMenu` modern shape). */
    get favorites(): IMenu[];
    /** Roles decoded from the access token (for `source: 'role'` permission checks). */
    get roles(): string[];
    /**
     * Feature permissions granted by the backend (for `source: 'permission'`
     * checks). Hydrated by `load()` from the effective authorizations endpoint
     * (`GET {api.user}/me/authorizations`) as the deduplicated set of
     * `data[].menuCode`; `setPermissions()` remains available for a caller that
     * wants to supply the list itself.
     */
    get permissions(): string[];
    /** True while the cold-start `load()` is in flight. */
    get initializing(): boolean;
    /** First error encountered during `load()`, if any (e.g. `menus: ...`). */
    get loadError(): string | null;
    /** Normalized per-branch errors from the last `load()` — mirrors the service API error contract. */
    get loadErrors(): IUserMenuLoadErrors;
    /**
     * Post-login default landing (when no return URL is present).
     * Order: (1) first navigable favorite route, (2) first navigable menu route.
     */
    get defaultRoute(): string | null;
    /** Finds a menu node's display name by id (recursive), or null. */
    findMenuName(menuId: string | number): string | null;
    /**
     * Cold-start: fetch user + menus + favorites + permissions concurrently. A
     * failure in one branch does not block the others; `initializing` clears once
     * all settle. Resolves when the load settles, so callers can await it (e.g.
     * to navigate to `defaultRoute` after login).
     */
    load(): Promise<void>;
    /**
     * Clears every cached user/menu/favorite value and error state, and forgets
     * the identity they belonged to. Call on logout / session clear so no stale
     * data survives into the next login.
     */
    reset(): void;
    private waitUntilSettled;
    /** Refresh roles from the current access token (call after login / token change). */
    syncRoles(): void;
    /** Menu-mode permission check against the in-memory menu codes (ANY match). */
    hasMenu(code: string | string[]): boolean;
    /**
     * Route-membership check: can the user open `path`? True when any granted
     * leaf menu route equals it (slash-normalized). Used by route-level access
     * guards (e.g. `IRequireRouteAccess`).
     */
    hasRoute(path: string): boolean;
    /** Role-mode permission check against the in-memory roles. ANY match. */
    hasRole(code: string | string[]): boolean;
    /**
     * Replaces the granted permission list (feature/action codes). `load()`
     * hydrates this automatically - call this only to override it explicitly.
     * Codes are deduplicated so an accidental duplicate in the source list can
     * never make `hasPermission()` behave differently.
     */
    setPermissions(permissions: string[]): void;
    /**
     * Permission-mode check against the granted permissions (ANY match). Returns
     * `false` while the list is empty/not loaded - gated UI renders only after
     * the store has data.
     */
    hasPermission(code: string | string[]): boolean;
    /**
     * Pin (`isFavorite: true`) or unpin a menu item. Flips the star icon in the
     * `menus` tree immediately (optimistic), calls the backend, then re-fetches
     * favorites so the server remains the source of truth. The menu-star change
     * is reverted on error.
     */
    toggleFavorite(menuId: string | number, isFavorite: boolean): Promise<void>;
    /**
     * Persists the new favorite order after a drag-drop. Reorders the in-memory
     * `favorites` locally (optimistic) and calls the backend — no GET refetch
     * after the write. The local change is reverted on error.
     */
    reorderFavorites(menuIds: (string | number)[]): Promise<void>;
    /** Re-fetches the favorites from the backend (manual refresh). */
    reloadFavorites(): Promise<void>;
    /**
     * Loads the effective navigation tree into `menus` — for one application
     * (`applicationId`) or all active applications when omitted. Returns the
     * mapped `IMenu[]`.
     */
    loadMenus(applicationId?: string): Promise<IMenu[]>;
    /** Loads favorites into `favorites` — optionally for a single application. Returns the mapped `IMenu[]`. */
    loadFavorites(applicationId?: string): Promise<IMenu[]>;
    /**
     * Loads the granted feature permissions into `permissions` — the deduplicated
     * set of `data[].menuCode` from the effective authorizations endpoint.
     * Returns the resulting permission list.
     */
    loadPermissions(applicationId?: string): Promise<string[]>;
    /** Returns a new menu tree with the matching node's `isFavorite` flipped (star icon). */
    private applyMenuFavorite;
    private applyFavoriteReorder;
    private loadUserInternal;
    private loadMenusInternal;
    private loadFavoritesInternal;
    private loadPermissionsInternal;
    private clearData;
    private recordError;
}

/** User derived from Keycloak JWT claims. */
type ISessionUser = {
    sub: string;
    email: string;
    name: string;
    roles: string[];
    userType: 'internal' | 'external';
};
/**
 * Minimal inline JWT payload decode — deliberately NOT using a JWT library to
 * avoid forcing a new dependency onto every @insight/ui consumer. Returns
 * `null` on any decode failure.
 */
declare function decodeJwtPayload(token: string): Record<string, unknown> | null;
/** Decodes an `IAuthUser` from the token's Keycloak claims. */
declare function decodeUser(accessToken: string): IAuthUser;
/**
 * Session management for @insight/ui consumer apps (React analog of the
 * Angular `ISessionService`).
 *
 * Access token: stored IN MEMORY only (never Web Storage). Refresh token:
 * HttpOnly cookie managed by the app's own identity host/BFF; this service
 * never reads or stores it directly (an in-memory `refreshToken` is kept only
 * for server-side logout).
 *
 * This is a tiny observable store - `subscribe` + `getVersion` so
 * `useSyncExternalStore` re-renders consumers when the session state changes.
 */
declare class ISessionService {
    private readonly config;
    private readonly authService;
    private readonly csrf;
    private readonly sessionExpiredService;
    private userMenuStore;
    private accessToken;
    private _refreshToken;
    private expiresAt;
    private sessionStartedAt;
    private currentUser;
    private passwordExpired;
    private changePasswordTokenValue;
    private lastVerifiedAt;
    private initializingValue;
    private refreshInFlight;
    private restoreInFlight;
    private version;
    private listeners;
    constructor(config: IAuthConfig, authService: IAuthService, csrf: ICsrfService, sessionExpiredService: ISessionExpiredService);
    /** Attach the user-menu store so logout() also drops its cached data. */
    setUserMenuStore(store: IUserMenuStore): void;
    subscribe: (listener: () => void) => (() => void);
    getVersion: () => number;
    private notify;
    /**
     * True while the app is restoring/validating the session on load (starts
     * `true` on cold start so guards can allow navigation during the restore and
     * consumer apps can show a loading state). Cleared once the session is
     * established (`setAccessToken`/`setSession`) or `tryRestoreSession()` settles.
     */
    get initializing(): boolean;
    isAuth(): boolean;
    isTokenExpired(): boolean;
    /**
     * Whether the max SSO session duration has been exceeded (default 15h,
     * configured via `tokenLifespan.ssoSessionMaxSeconds`). After this, the
     * user must re-authenticate regardless of token state.
     */
    isSsoSessionExpired(): boolean;
    isPasswordExpired(): boolean;
    clearPasswordExpired(): void;
    setPasswordExpired(): void;
    setChangePasswordToken(token: string): void;
    getChangePasswordToken(): string | null;
    clearChangePasswordToken(): void;
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    getUser(): ISessionUser | null;
    /** Role-membership check against the decoded token roles (ANY match). */
    hasMn(mn: string | string[]): boolean;
    /**
     * Roles claimed by the current access token (Keycloak `realm_access.roles`).
     * Returns an empty array while no token is set. Used by role-mode permission
     * checks.
     */
    getRoles(): string[];
    /** True if the current access token claims ANY of the given roles. */
    hasRole(code: string | string[]): boolean;
    /**
     * Store the access token received from the SSO handoff (URL hash fragment)
     * or from a refresh response. `expiresIn` (seconds) defaults to the token's
     * own `exp` claim, then falls back to the configured `accessTokenSeconds`.
     */
    setAccessToken(accessToken: string, expiresIn?: number): void;
    /**
     * Full session establishment (login / MFA / exchange / refresh). Sets the
     * user, decodes password-expiry claims, stamps the last-verified time, and
     * marks an active session so `tryRestoreSession()` can distinguish a cold
     * start from a refresh-after-revocation.
     */
    setSession(accessToken: string, expiresIn: number, user: IAuthUser, refreshToken?: string): void;
    clearSession(): void;
    /**
     * Clears the client-side session AND invalidates the server-side session by
     * revoking the refresh token. Resolves after the server logout call finishes
     * (or fails — failures are swallowed so the user is never stuck on a logout
     * page).
     */
    logout(): Promise<void>;
    /**
     * Silently refresh the access token via the HttpOnly refresh cookie
     * (`POST {api.identity}/auth/refresh`, `credentials: 'include'`).
     * Single-flight: concurrent callers share the in-flight refresh.
     */
    refreshToken(): Promise<string>;
    /** True if the session was verified against the backend within `cooldownMs` (default 30s). */
    isRecentlyVerified(cooldownMs?: number): boolean;
    /**
     * Proactive session validation for guards. Refreshes the token to check
     * session validity WITHOUT resetting the SSO session timer. Skips the refresh
     * if the last check was within 30 seconds.
     */
    proactiveValidate(): Promise<string>;
    /**
     * Cold-start session restore from the HttpOnly cookie (called on app load).
     * Skips non-signin auth sub-pages (forgot/reset password, MFA, callback).
     * The signin page ALWAYS attempts the silent refresh. Shows the
     * session-expired overlay when refreshing after a previously-active session.
     * Returns the reason (if any) extracted from the error so the guard can
     * decide overlay vs. signin.
     */
    tryRestoreSession(): Promise<{
        reason?: ISessionExpiredReason;
    }>;
    private readExpiresInFromToken;
}

/**
 * Everything the shared SSO stack exposes to consumer apps. Provided by
 * `IAuthProvider`.
 */
type IAuthContext = {
    config: IAuthConfig;
    session: ISessionService;
    auth: IAuthService;
    csrf: ICsrfService;
    api: IApiClient;
    sessionExpired: ISessionExpiredService;
    userMenuStore: IUserMenuStore;
};
declare const IAuthContext: React$1.Context<IAuthContext>;
declare function useIAuthContext(): IAuthContext;
/** Session service + re-render on session state change. */
declare function useISession(): ISessionService;
/** Consumer HTTP client (Authorization + CSRF + refresh-retry). */
declare function useIApi(): IApiClient;
declare function useIAuth(): IAuthService;
declare function useICsrf(): ICsrfService;
/** Session-expired overlay state + re-render on change. */
declare function useISessionExpired(): ISessionExpiredService;
/** User-menu store (user/menus/favorites) + re-render on change. */
declare function useIUserMenuStore(): IUserMenuStore;

/**
 * Root provider for `@insight/ui`'s shared SSO stack — the React analog of
 * Angular's `provideIAuth()`.
 *
 * Creates and wires: auth config, CSRF service, session service (runs
 * `tryRestoreSession()` once on mount — the APP_INITIALIZER equivalent),
 * consumer api client, session-expired overlay, and the user-menu store
 * (user/menus/favorites + permission checks).
 *
 * `api.identity` and `signinUrl` are MANDATORY and app-specific: they must point
 * at THIS app's own auth backend. In the BFF-per-app model the app's session
 * cookie stays first-party on its own origin (SameSite-safe), so the library no
 * longer ships a default pointing at any shared identity provider. A config
 * that omits them throws at bootstrap (fail-fast).
 *
 * Usage - point at your own auth host/BFF:
 * ```tsx
 * <IAuthProvider
 *   config={{
 *     // this app's own backend: a same-origin BFF (e.g. atlas-api) or identity-api
 *     api: { identity: 'https://<your-app>.example.com/api' },
 *     // this app's own login entry (BFF login route or the app's signin page)
 *     signinUrl: 'https://<your-app>.example.com/api/auth/login',
 *   }}
 * >
 *   <App />
 * </IAuthProvider>
 * ```
 */
declare function IAuthProvider({ config, children, }: {
    config?: IAuthConfigOverrides;
    children: ReactNode;
}): React$1.JSX.Element;

/**
 * Known API error codes surfaced by the platform services (mirrors the
 * iam-user-api error catalog — see `iam-user-api/src/common/errors/user-errors.ts`).
 *
 * Consumers branch on these to tailor UX (e.g. showing the "Access Unavailable"
 * page when the current user has no application mapping).
 */
declare const USER_APPLICATION_MAPPING_NOT_FOUND: "USER_APPLICATION_MAPPING_NOT_FOUND";
/** Union of error codes the @insight/ui consumers may need to branch on. */
type IKnownErrorCode = typeof USER_APPLICATION_MAPPING_NOT_FOUND;

/**
 * Library-provided session-expired overlay for React consumer apps. Render it
 * once near the app root (inside `<IAuthProvider>`, mirroring
 * `<IDialogOutlet />`):
 *
 * ```tsx
 * <ISessionExpiredDialog />
 * ```
 *
 * It reads its state from the shared `ISessionExpiredService` (shown by the api
 * client's `onSessionExpired` when a refresh fails and `unauthorizedHandling`
 * is `'dialog'`) and, on "Log in again", performs a full-page redirect to
 * the configured signinUrl via `buildExternalSigninUrl`, then hides itself. It cannot
 * be dismissed by clicking the backdrop.
 */
declare function ISessionExpiredDialog(): React$1.JSX.Element;

/**
 * Session-storage wrapper for non-sensitive UI state (returnUrl, nonce/state).
 * Tokens are NEVER stored here — the access token lives in-memory
 * (ISessionService) and the refresh token lives in an HttpOnly cookie set by
 * iam-identity-api.
 */
declare class IStorageService {
    private readonly storageKey;
    get(key: string): string;
    set(key: string, value: string): void;
    delete(key: string): void;
    clear(): void;
    /** Save the return URL for post-login/post-password-change redirect (keyed `ru`). */
    setReturnUrl(url: string): void;
    /** Retrieve and clear the saved return URL. Returns `'/'` when none is saved. */
    getReturnUrl(): string;
}
declare const storageService: IStorageService;

/**
 * Cross-domain auth guard for @insight/ui consumer apps — the React analog of
 * Angular's `authGuard`. Wrap protected routes:
 *
 * ```tsx
 * <Route path="settings" element={<IRequireAuth><Settings /></IRequireAuth>} />
 * ```
 *
 * Performs a FULL PAGE redirect to the configured signinUrl when
 * unauthenticated, since the consumer app and its auth/BFF host are separate
 * applications/domains. The
 * redirect is routed through this app's OWN callback route (not the page the
 * user was trying to visit) — see `buildExternalSigninUrl()` for why that's
 * required to avoid a redirect loop.
 *
 * While the session is `initializing` (cold-start restore), a loading
 * placeholder is rendered instead of a redirect — this prevents a flash /
 * redirect loop during the restore.
 *
 * When the session-expired overlay is visible (session revoked/replaced by a
 * new login elsewhere), the guard does NOT redirect — the overlay's
 * "Login again" action owns the redirect to signin.
 */
declare function IRequireAuth({ children, loading, }: {
    children: ReactNode;
    /** Custom loading placeholder while the session is restoring. */
    loading?: ReactNode;
}): string | number | bigint | boolean | React$1.JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | React$1.ReactPortal | React$1.ReactElement<unknown, string | React$1.JSXElementConstructor<any>> | Iterable<ReactNode>>;

/** Permission source selector used by `usePermission` / `<IHasMn>` / `<INotHasMn>`. */
type IPermissionSource = 'menu' | 'role' | 'permission';
/** Object form: inline source + value. */
type IPermission = {
    source: IPermissionSource;
    value: string | string[];
};
/**
 * Accepted input for the permission checks:
 * - a plain `string | string[]` → menu-mode check (default), or
 * - an object `{ source, value }` to select the source explicitly.
 */
type IPermissionInput = string | string[] | IPermission;
/** Resolves an input into a concrete `{ source, codes }` pair (or `null`). */
declare function resolvePermission(value: IPermissionInput | null): {
    source: IPermissionSource;
    codes: string | string[];
} | null;
/**
 * ASYNC-AWARE permission check hook — the React analog of the Angular
 * `ihHasMn` / `ihNotHasMn` directives. Reads the `IUserMenuStore` reactively,
 * so gated UI renders only once the store has data (menus or roles).
 *
 * ```tsx
 * const canView = usePermission('sales:report');
 * const canAdmin = usePermission({ source: 'role', value: 'iam-admin' });
 * const canExport = usePermission({ source: 'permission', value: 'report.export' });
 * ```
 */
declare function usePermission(value: IPermissionInput | null | undefined): boolean;
/**
 * Renders `children` only when the current user has the given permission
 * (menu code by default, or `{ source: 'role', value }`). Renders nothing
 * while the user-menu store is initializing (permission not yet known).
 */
declare function IHasMn({ value, children, }: {
    value: IPermissionInput;
    children: ReactNode;
}): ReactNode;
/**
 * Renders `children` only when the current user does NOT have the given
 * permission. Renders nothing while the user-menu store is initializing
 * (permission not yet known) so a not-yet-loaded grant never flashes a denied
 * element.
 */
declare function INotHasMn({ value, children, }: {
    value: IPermissionInput;
    children: ReactNode;
}): ReactNode;

/** Route that renders the "account lacks the required access/role" (403) page. */
declare const UNAUTHORIZED_ACCESS_PATH = "/unauthorized-access";
type IRequireAccessProps = {
    /** Single code or list of codes (ANY match) the user must hold. */
    value: string | string[];
    /** Source of the access check. Defaults to `menu` (menu codes). */
    source?: IPermissionSource;
    /** Where to redirect users who lack access. */
    unauthorizedPath?: string;
    /** Custom loading placeholder while the session/menus are still loading. */
    loading?: ReactNode;
    children: ReactNode;
};
/**
 * React analog of the Angular `requireAccess` guard — wraps a route element and
 * denies navigation to users who lack a required menu/role/permission by
 * rendering `<Navigate>` to `unauthorizedPath`:
 *
 * ```tsx
 * <Route
 *   path="settings"
 *   element={
 *     <IRequireAuth>
 *       <IRequireAccess value="admin-iam">
 *         <Settings />
 *       </IRequireAccess>
 *     </IRequireAuth>
 *   }
 * />
 * ```
 *
 * Compose INSIDE `IRequireAuth` — this wrapper only handles the
 * authenticated-but-not-allowed branch. `source: 'menu'` is async-aware: it
 * waits for (or triggers) the user-menu store load before judging, so a
 * cold-start deep link is never denied just because the menus have not been
 * fetched yet.
 */
declare function IRequireAccess({ value, source, unauthorizedPath, loading, children, }: IRequireAccessProps): string | number | bigint | boolean | React$1.JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | React$1.ReactPortal | React$1.ReactElement<unknown, string | React$1.JSXElementConstructor<any>> | Iterable<ReactNode>>;

/** Decides whether the current path may be opened for the given store state. */
type IRouteCanOpen = (path: string, store: IUserMenuStore) => boolean;
type IRequireRouteAccessProps = {
    /**
     * Override the open-decision. Default: the path is one of the user's granted
     * leaf menu routes (`store.hasRoute`). Apps whose menus carry host-formatted
     * routes (remotes mounted under a host prefix) supply a matcher that maps
     * the local path into the menu-route space.
     */
    canOpen?: IRouteCanOpen;
    /** Where to redirect users without access to the current route. */
    unauthorizedPath?: string;
    /** Custom loading placeholder while the session/menus are still loading. */
    loading?: ReactNode;
    children: ReactNode;
};
/**
 * Route-membership guard — the React analog of the Angular `requireRouteAccess`.
 * Wraps a route element and denies navigation to pages the user has no granted
 * menu for by rendering `<Navigate>` to `unauthorizedPath`:
 *
 * ```tsx
 * <Route
 *   path="nup"
 *   element={
 *     <IRequireAuth>
 *       <IRequireRouteAccess>
 *         <Nup />
 *       </IRequireRouteAccess>
 *     </IRequireAuth>
 *   }
 * />
 * ```
 *
 * Compose INSIDE `IRequireAuth` — this wrapper only handles the
 * authenticated-but-not-allowed branch. It is menu-data aware: it waits for (or
 * triggers) the user-menu store load before judging, so a cold-start deep link
 * is never denied just because the menus have not been fetched yet.
 */
declare function IRequireRouteAccess({ canOpen, unauthorizedPath, loading, children, }: IRequireRouteAccessProps): string | number | bigint | boolean | React$1.JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | React$1.ReactPortal | React$1.ReactElement<unknown, string | React$1.JSXElementConstructor<any>> | Iterable<ReactNode>>;

export { DEFAULT_ERROR_FACTORIES, DEFAULT_PERSONAL_PROFILE_URL, HostShell, IAlert, type IAlertData, type IApiClient, type IApiClientDeps, type IApiError, type IApiErrorCatalogResolver, type IApiOptions, IAuthCallback, type IAuthConfig, type IAuthConfigOverrides, IAuthContext, type IAuthEndpoints, IAuthProvider, IAuthService, type IAuthUser, IAvatar, type IAvatarProps, type IAvatarShape, type IAvatarSize, type IBreadcrumbItem, IButton, type IButtonProps, type IButtonSize, type IButtonType, type IButtonVariant, ICard, ICardBody, ICardFooter, ICardImage, type ICardProps, type ICodeHighlighter, ICodeViewer, type ICodeViewerFileLoaded, type ICodeViewerProps, IConfirm, type IConfirmData, ICsrfService, type ICurrentUserDto, ICurrentUserService, IDatepicker, type IDatepickerPanelPosition, type IDatepickerProps, IDialog, type IDialogAction, type IDialogActionCancel, type IDialogActionConfirm, type IDialogActionCustom, type IDialogActionOK, type IDialogActionObject, type IDialogActionSave, type IDialogActionType, type IDialogActionTypes, IDialogClose, type IDialogCloseProps, type IDialogConfig, type IDialogInstance, IDialogOutlet, type IDialogProps, IDialogProvider, type IDialogProviderProps, IDialogRef, type IEffectiveAuthorizationDto, type IEffectiveAuthorizationType, type IEnvironment, type IErrorContext, type IErrors, IFCDatepicker, type IFCDatepickerProps, IFCInput, type IFCInputProps, IFCSelect, type IFCSelectHandle, type IFCSelectProps, IFCTextArea, type IFCTextAreaProps, type IFavoriteMenuItemDto, type IFavoriteOrderItemDto, type IForgotPasswordResponse, type IFormControlErrorMessage, IGrid, IGridColumn, IGridColumnGroup, type IGridColumnGroupProps, type IGridColumnLike, type IGridColumnProps, type IGridColumnWidth, IGridCustomColumn, type IGridCustomColumnProps, IGridDataSource, type IGridDataSourceConfig, IGridExpandableRow, type IGridExpandableRowProps, type IGridExpandableRowRenderCtx, type IGridFilter, type IGridHandle, type IGridHeaderItem, type IGridPaginatorInput, type IGridProps, type IGridSelectionChange, type IGridSelectionMode, type IGridServerPage, type IGridServerSideConfig, type IGridSortAccessor, IHContent, IHContentLayout, IHMenu, IHSidebar, type IHSidebarProps, IHasMn, type IHostApi, IHostApiProvider, IHostUiProvider, type IHostUiState, IIcon, type IIconInput, type IIconName, type IIconProps, type IIconSize, IInput, IInputAddon, type IInputAddonButton, type IInputAddonIcon, type IInputAddonKind, type IInputAddonLink, type IInputAddonLoading, type IInputAddonProps, type IInputAddonText, type IInputAddonType, type IInputAddons, type IInputMask, type IInputMaskType, type IInputProps, type IKnownErrorCode, type ILoadComponent, ILoading, type ILoadingProps, type ILoginResponse, type IMenu, type IMenuApplication, type IMenuApplicationDto, type IMenuCompany, type IMenuCompanyDto, type IMenuFavoriteReorderEvent, type IMenuFavoriteToggleEvent, type IMenuNodeDto, type IMenuOpenIn, type IMenuOpenInDto, type IMfaChallengeResponse, type INormalizedApiError, INotHasMn, IPaginator, type IPaginatorProps, type IPaginatorState, type IPermission, type IPermissionInput, type IPermissionSource, IPill, type IPillProps, type IPillSize, type IPillVariant, type IRefreshResponse, type IRequestOptions, IRequireAccess, type IRequireAccessProps, IRequireAuth, IRequireRouteAccess, type IRequireRouteAccessProps, type IResetPasswordResponse, type IRoute, type IRouteCanOpen, type IRouteComponent, IRouter, type IRouterProps, type IRoutes, type ISanitizedReturnUrl, ISection, ISectionBody, ISectionFilter, ISectionFooter, ISectionHeader, ISectionSubHeader, ISectionTab, type ISectionTabBadge, type ISectionTabProps, ISectionTabs, type ISectionTabsHeight, type ISectionTabsProps, ISelect, type ISelectChange, type ISelectHandle, type ISelectPanelPosition, type ISelectProps, ISessionExpiredDialog, type ISessionExpiredReason, ISessionExpiredService, ISessionService, type ISessionUser, type ISortConfig, type ISortDirection, type ISortState, IStorageService, ITextArea, type ITextAreaProps, IToggle, type IToggleProps, type IToggleSize, type ITokenLifespan, type IUISize, type IUIVariant, type IUser, type IUserMenuEnvelopeDto, type IUserMenuLoadErrors, type IUserMenuLoadSource, IUserMenuService, IUserMenuStore, type IValidateResetTokenResponse, I_ICON_NAMES, I_ICON_SIZES, type ResolveControlErrorMessageArgs, type RouterLinkInput, UNAUTHORIZED_ACCESS_PATH, USER_APPLICATION_MAPPING_NOT_FOUND, type UseInputMaskOptions, asMinMaxLengthError, buildExternalSigninUrl, buildFavoritePathMap, buildUrl, collectLeafRoutes, collectMenuChain, collectMenuCodes, createApiClient, decodeJwtPayload, decodeUser, environment, extractAccessTokenFromHash, extractProblemDetailsErrorCode, findFirstLeafRoute, findMenuNameById, getAuthEndpointPath, getAuthEndpointUrl, getDefaultIAuthConfig, getDefaultIAuthEndpoints, getMenuChildren, getMenuKey, getMenuLabel, getMenuRoute, hasAnyMenuCode, hasAnyRoute, hasMenuChildren, hasNumber, interpolate, isControlRequired, isGroupNode, isHttpRoute, isLeafItem, isModuleMenu, isNewTabMenu, isRecord, isReloadMenu, isSessionExpiredError, isSpaMenu, mapToSidebarUser, normalizeApiError, normalizeFetchError, normalizeMenuTree, normalizeRoutePath, rawRequest, readNumber, requireIdentityHost, resolveApiErrorDisplayMessage, resolveControlErrorMessage, resolveIAuthConfig, resolvePermission, sanitizeReturnUrl, sessionExpiredService, storageService, toIMenu, toIMenuFavorite, toIMenus, toSessionExpiredReason, useHostApi, useHostApiOptional, useHostUi, useIAlert, useIApi, useIAuth, useIAuthContext, useIConfirm, useICsrf, useIDialog, useIDialogData, useIDialogRef, useISession, useISessionExpired, useIUserMenuStore, useInputMask, useOptionalIConfirm, usePermission, validateIAuthConfig };
