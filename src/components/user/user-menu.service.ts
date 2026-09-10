import type { IAuthConfig } from '../auth/auth-config';
import { environment as defaultEnvironment } from '../environments/environment';
import type { IApiClient } from '../api/api.client';

import type {
  IEffectiveAuthorizationDto,
  IFavoriteMenuItemDto,
  IFavoriteOrderItemDto,
  IMenuNodeDto,
  IUserMenuEnvelopeDto,
} from './user.types';

/**
 * Current-user navigation & favorites service — calls iam-user-api's
 * `/me/menus*` endpoints (user-menu service contract). These endpoints return
 * a `{ meta, data }` envelope; this service unwraps `.data` so callers keep
 * the app-wide body-as-data convention.
 *
 * Base URL: `{api.user}` from the resolved auth config (defaults to the
 * library environment file). React analog of the Angular `IUserMenuService`.
 */
export class IUserMenuService {
  private readonly config: IAuthConfig;
  private readonly api: IApiClient;

  constructor(config: IAuthConfig, api: IApiClient) {
    this.config = config;
    this.api = api;
  }

  private get baseUrl(): string {
    return this.config.api['user'] ?? defaultEnvironment.api.user;
  }

  /** GET `{api.user}/me/menus` — effective navigation tree for one or all active applications. */
  async getEffectiveMenus<T = IMenuNodeDto[]>(applicationId?: string): Promise<T> {
    const id = applicationId ?? this.config.appId;
    const response = await this.api.get<IUserMenuEnvelopeDto<T>>('/me/menus', {
      apiUrl: this.baseUrl,
      params: id ? { applicationId: id } : undefined,
    });
    return response.data;
  }

  /** GET `{api.user}/me/menus/favorites` — effective favorite items, sorted by name. */
  async getFavorites<T = IFavoriteMenuItemDto[]>(applicationId?: string): Promise<T> {
    const id = applicationId ?? this.config.appId;
    const response = await this.api.get<IUserMenuEnvelopeDto<T>>('/me/menus/favorites', {
      apiUrl: this.baseUrl,
      params: id ? { applicationId: id } : undefined,
    });
    return response.data;
  }

  /**
   * GET `{api.user}/me/authorizations?applicationId=...` — the complete set of
   * effective authorizations (menu items + functions) for the current user,
   * already reduced to `allowed` entries by the backend.
   *
   * The backend REQUIRES `applicationId`, so it falls back to `config.appId`
   * and fails loudly when neither is configured (fail-closed: the caller's
   * permission list simply stays empty).
   */
  async getAuthorizations<T = IEffectiveAuthorizationDto[]>(
    applicationId?: string,
  ): Promise<T> {
    const id = applicationId ?? this.config.appId;

    if (!id) {
      throw new Error(
        '[@insight/ui] applicationId is required to load current-user authorizations.',
      );
    }

    const response = await this.api.get<IUserMenuEnvelopeDto<T>>('/me/authorizations', {
      apiUrl: this.baseUrl,
      params: { applicationId: id },
    });

    return response.data;
  }

  /** PUT `{api.user}/me/menus/{menuId}/favorite` — pin an effective menu item (204 No Content). */
  addFavorite(menuId: string | number): Promise<void> {
    return this.api.put<void>(`/me/menus/${menuId}/favorite`, {}, { apiUrl: this.baseUrl });
  }

  /** DELETE `{api.user}/me/menus/{menuId}/favorite` — unpin a menu item (204 No Content). */
  removeFavorite(menuId: string | number): Promise<void> {
    return this.api.delete<void>(`/me/menus/${menuId}/favorite`, { apiUrl: this.baseUrl });
  }

  /**
   * PUT `{api.user}/me/menus/favorites` — atomically replace the complete
   * favorite collection after a drag-drop. `displayOrder` values form the
   * complete sequence 1..n. Returns 204 No Content.
   */
  async reorderFavorites(menuIds: (string | number)[]): Promise<void> {
    const items: IFavoriteOrderItemDto[] = menuIds.map((menuId, index) => ({
      menuId: String(menuId),
      displayOrder: index + 1,
    }));
    await this.api.put<void>('/me/menus/favorites', { items }, { apiUrl: this.baseUrl });
  }
}
