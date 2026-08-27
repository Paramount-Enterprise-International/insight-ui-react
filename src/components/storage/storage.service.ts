/**
 * Session-storage wrapper for non-sensitive UI state (returnUrl, nonce/state).
 * Tokens are NEVER stored here — the access token lives in-memory
 * (SessionService) and the refresh token lives in an HttpOnly cookie set by
 * iam-identity-api.
 */
export class StorageService {
  private readonly storageKey = '@insight/ui';

  get(key: string): string {
    const session = JSON.parse(sessionStorage.getItem(this.storageKey) || '{}') || {};
    return session[key] ?? '';
  }

  set(key: string, value: string): void {
    const session = JSON.parse(sessionStorage.getItem(this.storageKey) || '{}') || {};
    session[key] = value;
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  delete(key: string): void {
    const session = JSON.parse(sessionStorage.getItem(this.storageKey) || '{}') || {};
    delete session[key];
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  /** Save the return URL for post-login/post-password-change redirect (keyed `ru`). */
  setReturnUrl(url: string): void {
    this.set('ru', url);
  }

  /** Retrieve and clear the saved return URL. Returns `'/'` when none is saved. */
  getReturnUrl(): string {
    const url = this.get('ru');
    this.delete('ru');
    return url || '/';
  }
}

export const storageService = new StorageService();
