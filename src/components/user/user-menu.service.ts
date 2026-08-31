import type { IInsightAuthConfig } from '../auth/auth-config';
import { environment as defaultEnvironment } from '../environments/environment';
import type { IApiClient } from '../api/api.client';

import type {
  IInsightFavoriteMenuItem,
  IInsightFavoriteOrderItem,
  IInsightMenuNode,
  IInsightUserMenuEnvelope,
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
export class UserMenuService {
  private readonly config: IInsightAuthConfig;
  private readonly api: IApiClient;

  constructor(config: IInsightAuthConfig, api: IApiClient) {
    this.config = config;
    this.api = api;
  }

  private get baseUrl(): string {
    return this.config.api['user'] ?? defaultEnvironment.api.user;
  }

  /** GET `{api.user}/me/menus` — effective navigation tree for one or all active applications. */
  async getEffectiveMenus<T = IInsightMenuNode[]>(applicationId?: string): Promise<T> {
    const id = applicationId ?? this.config.appId;
    const response = await this.api.get<IInsightUserMenuEnvelope<T>>('/me/menus', {
      apiUrl: this.baseUrl,
      params: id ? { applicationId: id } : undefined,
    });
    return response.data;
  }

  /** GET `{api.user}/me/menus/favorites` — effective favorite items, sorted by name. */
  async getFavorites<T = IInsightFavoriteMenuItem[]>(applicationId?: string): Promise<T> {
    const id = applicationId ?? this.config.appId;
    const response = await this.api.get<IInsightUserMenuEnvelope<T>>('/me/menus/favorites', {
      apiUrl: this.baseUrl,
      params: id ? { applicationId: id } : undefined,
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
    const items: IInsightFavoriteOrderItem[] = menuIds.map((menuId, index) => ({
      menuId: String(menuId),
      displayOrder: index + 1,
    }));
    await this.api.put<void>('/me/menus/favorites', { items }, { apiUrl: this.baseUrl });
  }
}
