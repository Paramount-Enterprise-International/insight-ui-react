/**
 * Types for the current-user navigation, favorites and effective-authorization
 * data, matched to the iam-user-api user-menu service contract
 * (`GET {api.user}/me/menus*`, `GET {api.user}/me/authorizations` and
 * `GET {api.user}/users/user`). These are the raw backend shapes; the library
 * maps them onto the UI-facing `IMenu` / `IUser` contracts via `user.mapper.ts`.
 */

/** Standard `{ meta, data }` response envelope used by the user-menu endpoints. */
export type IUserMenuEnvelopeDto<T> = {
  meta: {
    timestamp: string;
  };
  data: T;
};

/** Navigation target for a menu node. */
export type IMenuOpenInDto = 'CURRENT_TAB' | 'NEW_TAB' | 'NEW_WINDOW';

/** Owning application reference for a menu node. */
export type IMenuApplicationDto = {
  id: string;
  code: string;
  name: string;
  url: string | null;
  version: string | null;
};

/** Effective company access for a menu node. */
export type IMenuCompanyDto = {
  id: string;
  code: string;
  name: string;
};

/** Effective menu node returned by `GET {api.user}/me/menus` (user-menu contract). */
export type IMenuNodeDto = {
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
export type IFavoriteMenuItemDto = {
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
export type IFavoriteOrderItemDto = {
  menuId: string;
  displayOrder: number;
};

/** Current user returned by `GET {api.user}/users/user` (iam-user-api `CurrentUserDto`). */
export type ICurrentUserDto = {
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
export type IEffectiveAuthorizationType = 'item' | 'function';

/**
 * One entry returned by `GET {api.user}/me/authorizations` (iam-user-api
 * `EffectiveAuthorizationDto`). The backend already applied the full effective
 * authorization pipeline (active application mapping, roles + additional-menu
 * grants, company scope, denied menu/company) and returns ONLY entries whose
 * final decision is `allowed`, restricted to `MENU_ITEM` / `FUNCTION` menus,
 * sorted by `menuCode`.
 */
export type IEffectiveAuthorizationDto = {
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
