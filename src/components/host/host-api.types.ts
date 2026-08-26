// host-api.types.ts

export type IBreadcrumbItem = {
  label: string;
  url?: string; // undefined means current / non-clickable
};

export type IHostApi = {
  navigate: (url: string) => void | Promise<void>;
  setTitle: (title: string | null) => void;
  setBreadcrumbs: (items: IBreadcrumbItem[] | null) => void;
};

export type IMenuApplication = {
  id: string;
  code: string;
  name: string;
  url?: string | null;
  version?: string | null;
};

export type IMenuCompany = {
  id: string;
  code: string;
  name: string;
};

export type IMenuOpenIn = 'CURRENT_TAB' | 'NEW_TAB' | 'NEW_WINDOW';

export type IMenuFavoriteToggleEvent = {
  id: string | number;
  isFavorite: boolean;
};

/**
 * Emitted by `IHSidebar` after the user drag-drops a favorite into a new
 * position. Carries the ordered favorite menu ids so the host app can persist
 * the new display order via the favorites reorder API.
 */
export type IMenuFavoriteReorderEvent = {
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
export type IMenu = {
  /* ── Modern (contract-aligned) ── */
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

  /* ── Legacy ── */
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

  /* ── Shared ── */
  route?: string | null;
  icon?: string | null;
};

export type IUser = {
  employeeCode: string;
  fullName: string;
  userImagePath: string;
};
