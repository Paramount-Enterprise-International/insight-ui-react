/**
 * Types for the current-user navigation & favorites data, matched to the
 * iam-user-api user-menu service contract (`GET {api.user}/me/menus*` and
 * `GET {api.user}/users/user`). These are the raw backend shapes; the library
 * maps them onto the UI-facing `IMenu` / `IUser` contracts via `user.mapper.ts`.
 */

/** Standard `{ meta, data }` response envelope used by the user-menu endpoints. */
export type IInsightUserMenuEnvelope<T> = {
  meta: {
    timestamp: string;
  };
  data: T;
};

/** Navigation target for a menu node. */
export type IInsightMenuOpenIn = 'CURRENT_TAB' | 'NEW_TAB' | 'NEW_WINDOW';

/** Owning application reference for a menu node. */
export type IInsightMenuApplication = {
  id: string;
  code: string;
  name: string;
  url: string | null;
  version: string | null;
};

/** Effective company access for a menu node. */
export type IInsightMenuCompany = {
  id: string;
  code: string;
  name: string;
};

/** Effective menu node returned by `GET {api.user}/me/menus` (user-menu contract). */
export type IInsightMenuNode = {
  id: string;
  name: string;
  type: 'group' | 'item';
  menuCode: string | null;
  parentId: string | null;
  route: string | null;
  icon: string | null;
  openIn: IInsightMenuOpenIn | null;
  sequence: number;
  application: IInsightMenuApplication;
  companies: IInsightMenuCompany[];
  isFavorite: boolean;
  children: IInsightMenuNode[];
};

/** Favorite item returned by `GET {api.user}/me/menus/favorites`. */
export type IInsightFavoriteMenuItem = {
  id: string;
  name: string;
  /** User-controlled display order (1..n). */
  displayOrder: number;
  menuCode: string | null;
  route: string | null;
  icon: string | null;
  openIn: IInsightMenuOpenIn | null;
  application: IInsightMenuApplication;
  companies: IInsightMenuCompany[];
};

/** One entry of the reorder payload for `PUT {api.user}/me/menus/favorites`. */
export type IInsightFavoriteOrderItem = {
  menuId: string;
  displayOrder: number;
};

/** Current user returned by `GET {api.user}/users/user` (iam-user-api `CurrentUserDto`). */
export type IInsightCurrentUser = {
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
