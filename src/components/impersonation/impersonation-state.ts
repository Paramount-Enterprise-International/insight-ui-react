import type { IApiClient } from '../api/api.client';
import { requestCancellation } from '../api/request-scope';
import type { IAuthConfig } from '../auth/auth-config';
import type { ISessionService } from '../session/session';
import {
  impersonationContextKey,
  normalizeImpersonationStatus,
  type IImpersonationStatus,
} from './impersonation-utils';

export class IImpersonationStateService {
  private value: IImpersonationStatus | null = null;
  private key = '';
  private version = 0;
  private requestVersion = 0;
  private disposed = false;
  private pending: Promise<IImpersonationStatus> | null = null;
  private controller: AbortController | null = null;
  private listeners = new Set<() => void>();
  private readonly unsubscribe: () => void;
  private readonly config: IAuthConfig;
  private readonly session: ISessionService;
  private readonly api: IApiClient;
  constructor(config: IAuthConfig, session: ISessionService, api: IApiClient) {
    this.config = config;
    this.session = session;
    this.api = api;
    this.key = impersonationContextKey(session.getAccessToken());
    this.unsubscribe = session.subscribe(() => {
      const key = impersonationContextKey(session.getAccessToken());
      if (key !== this.key) {
        this.key = key;
        this.clear();
      }
    });
  }
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getVersion = (): number => this.version;
  get status(): IImpersonationStatus | null {
    return this.value;
  }
  actor(): ReturnType<ISessionService['actor']> {
    return this.session.actor();
  }
  isImpersonating(): boolean {
    return this.session.isImpersonating();
  }
  clear(): void {
    this.requestVersion++;
    this.controller?.abort();
    this.controller = null;
    this.pending = null;
    this.value = null;
    this.version++;
    this.listeners.forEach((listener) => listener());
  }
  loadStatus(): Promise<IImpersonationStatus> {
    if (this.disposed) return Promise.reject(requestCancellation('abort'));
    if (!this.isImpersonating()) return Promise.resolve({ mode: 'NONE' });
    if (this.value) return Promise.resolve(this.value);
    if (this.pending) return this.pending;
    const version = this.requestVersion;
    const key = this.key;
    const controller = (this.controller = new AbortController());
    const source = this.config.impersonation?.source ?? 'iam-user';
    const base =
      source === 'bff' ? this.config.api.identity : this.config.api['user'];
    if (!base)
      return Promise.reject(
        new Error('Impersonation status requires api.user.')
      );
    const result = this.api
      .get<unknown>(source === 'bff' ? '/auth/me' : '/me/impersonation', {
        apiUrl: base,
        signal: controller.signal,
      })
      .then((value) => {
        if (
          this.disposed ||
          version !== this.requestVersion ||
          key !== impersonationContextKey(this.session.getAccessToken())
        )
          throw requestCancellation('abort');
        this.value = normalizeImpersonationStatus(value, source);
        this.version++;
        this.listeners.forEach((listener) => listener());
        return this.value;
      })
      .catch((error) => {
        if (
          this.disposed ||
          version !== this.requestVersion ||
          key !== impersonationContextKey(this.session.getAccessToken())
        )
          throw requestCancellation('abort');
        throw error;
      })
      .finally(() => {
        if (this.pending === result) {
          this.pending = null;
          this.controller = null;
        }
      });
    this.pending = result;
    return result;
  }
  dispose(): void {
    this.disposed = true;
    this.unsubscribe();
    this.clear();
    this.listeners.clear();
  }
}
