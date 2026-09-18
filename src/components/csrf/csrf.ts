import { rawRequest } from '../api/api.client';
import { getAuthEndpointUrl, type IAuthConfig } from '../auth/auth-config';

export class ICsrfService {
  private token: string | null = null;
  private tokenFetchedAt: number | null = null;
  private inFlight: Promise<void> | null = null;
  private controller = new AbortController();
  private disposed = false;

  private readonly config: IAuthConfig;
  private readonly signal?: AbortSignal;

  constructor(config: IAuthConfig, signal?: AbortSignal) {
    this.config = config;
    this.signal = signal;
  }

  getToken(): string | null {
    return this.isTokenExpired() ? null : this.token;
  }

  isTokenExpired(): boolean {
    return (
      this.tokenFetchedAt !== null &&
      Date.now() - this.tokenFetchedAt >=
        (this.config.csrfTokenMaxAgeSeconds ?? 7170) * 1000
    );
  }

  /** Share the current token bootstrap and retain tokens only for this application. */
  ensureToken(): Promise<void> {
    if (this.disposed)
      return Promise.reject(new Error('CSRF service is disposed.'));
    if (this.signal?.aborted) return Promise.reject(this.signal.reason);
    if (this.inFlight) return this.inFlight;
    const controller = this.controller;
    const abort = () => controller.abort();
    this.signal?.addEventListener('abort', abort, { once: true });
    const pending = rawRequest<{ csrfToken?: string }>(
      getAuthEndpointUrl(this.config, 'csrf'),
      '',
      null,
      {
        signal: controller.signal,
      }
    )
      .then((body) => {
        if (controller.signal.aborted || this.controller !== controller) return;
        this.token = body?.csrfToken ?? null;
        this.tokenFetchedAt = Date.now();
      })
      .finally(() => {
        this.signal?.removeEventListener('abort', abort);
        if (this.inFlight === pending) this.inFlight = null;
      });
    this.inFlight = pending;
    return pending;
  }

  clear(): void {
    this.controller.abort();
    this.controller = new AbortController();
    this.inFlight = null;
    this.token = null;
    this.tokenFetchedAt = null;
  }

  dispose(): void {
    this.clear();
    this.disposed = true;
  }
}
