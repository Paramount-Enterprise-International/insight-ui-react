import type { IAuthConfig } from '../auth/auth-config';
import { environment as defaultEnvironment } from '../environments/environment';
import type { IApiClient } from '../api/api.client';

import type { ICurrentUserDto } from './user.types';

/**
 * Current-user profile service — calls iam-user-api's `GET {api.user}/users/user`
 * endpoint (`CurrentUserDto`). The sidebar-shaped mapping (`IUser`) lives in
 * `user.mapper.ts` (`mapToSidebarUser`).
 *
 * Base URL: `{api.user}` from the resolved auth config (defaults to the
 * library environment file). React analog of the Angular `ICurrentUserService`.
 */
export class ICurrentUserService {
  private readonly config: IAuthConfig;
  private readonly api: IApiClient;

  constructor(config: IAuthConfig, api: IApiClient) {
    this.config = config;
    this.api = api;
  }

  private get baseUrl(): string {
    return this.config.api['user'] ?? defaultEnvironment.api.user;
  }

  /** GET `{api.user}/users/user` — raw current-user DTO. Override `T` to use your own response type. */
  getCurrentUser<T = ICurrentUserDto>(): Promise<T> {
    return this.api.get<T>('/users/user', { apiUrl: this.baseUrl });
  }
}
