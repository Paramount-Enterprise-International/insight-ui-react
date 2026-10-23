export type IHStateAdapter = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type IHStateStorage = 'temporary' | 'session' | 'local' | (string & {});
export type IHStateNamespaceOptions = { storage?: IHStateStorage };
export type IHStateError = {
  namespace: string;
  operation: 'read' | 'write' | 'remove';
  message: string;
};
export type IHStateApi = {
  registerNamespace(namespace: string, options?: IHStateNamespaceOptions): void;
  get<T>(namespace: string, key: string, fallback: T): T;
  set<T>(namespace: string, key: string, value: T): void;
  update<T>(namespace: string, key: string, fallback: T, update: (value: T) => T): void;
  remove(namespace: string, key: string): void;
  clearNamespace(namespace: string): void;
  getError(namespace: string): IHStateError | null;
  subscribe(listener: () => void): () => void;
  getVersion(): number;
  readonly selection: IHSelectionApi;
};

type Namespace = {
  storage: string;
  values: Record<string, unknown>;
  hydrated: boolean;
  error: IHStateError | null;
};

function browserAdapter(kind: 'sessionStorage' | 'localStorage'): IHStateAdapter {
  return {
    getItem: (key) => window[kind].getItem(key),
    setItem: (key, value) => window[kind].setItem(key, value),
    removeItem: (key) => window[kind].removeItem(key),
  };
}

/** Rejects lossy JSON values and returns an immutable, detached snapshot. */
function snapshot<T>(value: T): T {
  const seen = new Set<object>();
  const check = (item: unknown): void => {
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return;
    if (typeof item === 'number' && Number.isFinite(item)) return;
    if (typeof item !== 'object' || seen.has(item))
      throw new Error('IHState requires JSON-compatible values.');
    if (
      !Array.isArray(item) &&
      Object.getPrototypeOf(item) !== Object.prototype &&
      Object.getPrototypeOf(item) !== null
    ) {
      throw new Error('IHState requires plain JSON objects.');
    }
    seen.add(item);
    for (const child of Object.values(item)) check(child);
    seen.delete(item);
  };
  check(value);
  const freeze = (item: unknown): void => {
    if (item !== null && typeof item === 'object') {
      Object.values(item).forEach(freeze);
      Object.freeze(item);
    }
  };
  const copy = JSON.parse(JSON.stringify(value)) as T;
  freeze(copy);
  return copy;
}

/** One synchronous state owner per host application. */
export class IHStateOwner implements IHStateApi {
  private readonly namespaces = new Map<string, Namespace>();
  private readonly adapters = new Map<string, IHStateAdapter>();
  private readonly listeners = new Set<() => void>();
  private version = 0;
  private identity: string | null = null;
  private identified = false;
  readonly selection: IHSelection;

  private readonly prefix: string;

  constructor(prefix = 'insight.state', adapters: Record<string, IHStateAdapter> = {}) {
    this.prefix = prefix;
    this.adapters.set('session', browserAdapter('sessionStorage'));
    this.adapters.set('local', browserAdapter('localStorage'));
    for (const [name, adapter] of Object.entries(adapters)) {
      if (['temporary', 'session', 'local'].includes(name))
        throw new Error(`Reserved storage: ${name}`);
      this.adapters.set(name, adapter);
    }
    this.selection = new IHSelection(this);
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  readonly getVersion = (): number => this.version;

  registerNamespace(namespace: string, options?: IHStateNamespaceOptions): void {
    if (!namespace.trim()) throw new Error('A state namespace is required.');
    const existing = this.namespaces.get(namespace);
    if (existing) {
      if (options?.storage && existing.storage !== options.storage)
        throw new Error(`Conflicting storage for ${namespace}.`);
      return;
    }
    const storage = options?.storage ?? 'session';
    if (storage !== 'temporary' && !this.adapters.has(storage))
      throw new Error(`Unknown state storage: ${storage}`);
    this.namespaces.set(namespace, {
      storage,
      values: Object.create(null),
      hydrated: false,
      error: null,
    });
  }

  private entry(namespace: string): Namespace {
    this.registerNamespace(namespace);
    const entry = this.namespaces.get(namespace)!;
    if (!entry.hydrated && this.identity) {
      entry.hydrated = true;
      if (entry.storage !== 'temporary') {
        try {
          const raw = this.adapters.get(entry.storage)!.getItem(this.storageKey(namespace));
          if (raw !== null) {
            const parsed: unknown = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
              throw new Error('Invalid namespace snapshot.');
            entry.values = snapshot(parsed) as Record<string, unknown>;
          }
        } catch (error) {
          this.recordError(namespace, entry, 'read', error);
        }
      }
    }
    return entry;
  }

  get<T>(namespace: string, key: string, fallback: T): T {
    const values = this.entry(namespace).values;
    return Object.hasOwn(values, key) ? (values[key] as T) : fallback;
  }

  set<T>(namespace: string, key: string, value: T): void {
    if (!this.identity)
      throw new Error('IHState requires an authenticated identity before writing.');
    const entry = this.entry(namespace);
    entry.values = { ...entry.values, [key]: snapshot(value) };
    this.persist(namespace, entry);
    this.emit();
  }

  update<T>(namespace: string, key: string, fallback: T, update: (value: T) => T): void {
    this.set(namespace, key, update(this.get(namespace, key, fallback)));
  }

  remove(namespace: string, key: string): void {
    const entry = this.entry(namespace);
    const values = { ...entry.values };
    delete values[key];
    entry.values = values;
    this.persist(namespace, entry);
    this.emit();
  }

  clearNamespace(namespace: string): void {
    const entry = this.entry(namespace);
    entry.values = Object.create(null);
    entry.error = null;
    if (this.identity && entry.storage !== 'temporary') {
      try {
        this.adapters.get(entry.storage)!.removeItem(this.storageKey(namespace));
      } catch (error) {
        this.recordError(namespace, entry, 'remove', error);
      }
    }
    this.emit();
  }

  getError(namespace: string): IHStateError | null {
    return this.entry(namespace).error;
  }

  /** Cold starts restore the same identity; identity transitions discard both contexts. */
  setIdentity(identity: string | null): void {
    if (this.identified && identity === this.identity) return;
    const marker = `${this.prefix}:identity`;
    let previous = this.identity;
    try {
      previous ??= this.adapters.get('session')!.getItem(marker);
    } catch {
      /* Namespace operations expose storage failures to consumers. */
    }
    for (const entry of this.namespaces.values()) {
      entry.values = Object.create(null);
      entry.hydrated = false;
      entry.error = null;
    }
    if (previous !== identity) {
      if (previous) this.purge(previous);
      if (identity && previous) this.purge(identity);
    }
    this.identity = identity;
    this.identified = true;
    try {
      if (identity) this.adapters.get('session')!.setItem(marker, identity);
      else this.adapters.get('session')!.removeItem(marker);
    } catch {
      /* State remains usable when browser persistence is unavailable. */
    }
    this.selection.activateMenu(null);
    this.emit();
  }

  private storageKey(namespace: string, identity = this.identity): string {
    return `${this.prefix}:${encodeURIComponent(identity ?? '')}:${encodeURIComponent(namespace)}`;
  }

  private indexKey(identity: string | null): string {
    return `${this.prefix}:[index]:${encodeURIComponent(identity ?? '')}`;
  }

  private persist(namespace: string, entry: Namespace): void {
    entry.error = null;
    if (!this.identity || entry.storage === 'temporary') return;
    try {
      const adapter = this.adapters.get(entry.storage)!;
      const key = this.storageKey(namespace);
      const indexKey = this.indexKey(this.identity);
      const index = this.readIndex(adapter, indexKey);
      if (!index.includes(key)) adapter.setItem(indexKey, JSON.stringify([...index, key]));
      adapter.setItem(key, JSON.stringify(entry.values));
    } catch (error) {
      this.recordError(namespace, entry, 'write', error);
    }
  }

  private readIndex(adapter: IHStateAdapter, key: string): string[] {
    const raw = adapter.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  }

  private purge(identity: string): void {
    for (const [name, adapter] of this.adapters) {
      const indexKey = this.indexKey(identity);
      const known = [...this.namespaces]
        .filter(([, entry]) => entry.storage === name)
        .map(([namespace]) => this.storageKey(namespace, identity));
      try {
        const keys = new Set([...this.readIndex(adapter, indexKey), ...known]);
        const scopePrefix = this.storageKey('', identity);
        for (const key of keys) if (key.startsWith(scopePrefix)) adapter.removeItem(key);
        adapter.removeItem(indexKey);
      } catch (error) {
        for (const [namespace, entry] of this.namespaces) {
          if (entry.storage === name) this.recordError(namespace, entry, 'remove', error);
        }
      }
    }
  }

  private recordError(
    namespace: string,
    entry: Namespace,
    operation: IHStateError['operation'],
    error: unknown,
  ): void {
    entry.error = {
      namespace,
      operation,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  private emit(): void {
    this.version++;
    for (const listener of [...this.listeners]) listener();
  }
}

export type IHSelectionStatus = 'idle' | 'loading' | 'ready' | 'error';
export type IHSelectionSnapshot = {
  companyId: string | null;
  projectKey: string | null;
  menuCode: string | null;
  companyStatus: IHSelectionStatus;
  projectStatus: IHSelectionStatus;
  error: string | null;
  revision: number;
};
export type IHProjectValidation = { revision: number; request: number; companyId: string | null };
const SELECTION_NAMESPACE = 'shared.selection';
const EMPTY_SELECTION = Object.freeze({ companyId: null, projectKey: null });

/** Coordinates candidate selections and rejects results from previous contexts. */
export class IHSelection {
  private value: IHSelectionSnapshot = Object.freeze({
    ...EMPTY_SELECTION,
    menuCode: null,
    companyStatus: 'idle',
    projectStatus: 'idle',
    error: null,
    revision: 0,
  });
  private readonly listeners = new Set<() => void>();
  private request = 0;
  private companies = new Set<string>();
  private projects = new Set<string>();

  private readonly state: IHStateApi;

  constructor(state: IHStateApi) {
    this.state = state;
    state.registerNamespace(SELECTION_NAMESPACE, { storage: 'session' });
    state.subscribe(() => this.sync());
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  readonly getSnapshot = (): IHSelectionSnapshot => {
    this.sync();
    return this.value;
  };

  private sync(): void {
    const candidate = this.state.get(SELECTION_NAMESPACE, 'active', EMPTY_SELECTION) as {
      companyId: unknown;
      projectKey: unknown;
    };
    const companyId = typeof candidate?.companyId === 'string' ? candidate.companyId : null;
    const projectKey =
      companyId && typeof candidate?.projectKey === 'string' ? candidate.projectKey : null;
    if (companyId !== this.value.companyId || projectKey !== this.value.projectKey) {
      const companyChanged = companyId !== this.value.companyId;
      this.publish({
        companyId,
        projectKey,
        companyStatus: companyChanged ? 'loading' : this.value.companyStatus,
        projectStatus: 'loading',
        error: null,
        revision: this.value.revision + (companyChanged ? 1 : 0),
      });
    }
  }

  activateMenu(menuCode: string | null): void {
    this.companies.clear();
    this.projects.clear();
    this.request++;
    this.publish({
      menuCode,
      companyStatus: 'loading',
      projectStatus: 'loading',
      error: null,
      revision: this.value.revision + 1,
    });
  }

  validateCompanies(
    menuCode: string | null,
    ids: readonly string[],
    status: IHSelectionStatus,
    error: string | null = null,
  ): void {
    this.sync();
    if (!menuCode || (this.value.menuCode && menuCode !== this.value.menuCode)) return;
    if (status !== 'ready') {
      this.companies.clear();
      this.publish({
        companyStatus: status,
        projectStatus: 'loading',
        error,
        revision: this.value.revision + (this.value.companyStatus === 'ready' ? 1 : 0),
      });
      return;
    }
    this.companies = new Set(ids);
    if (this.value.companyId && !this.companies.has(this.value.companyId)) this.write(null, null);
    this.publish({
      companyStatus: 'ready',
      ...(this.value.companyId ? {} : { projectStatus: 'idle' as const }),
      error: this.value.projectStatus === 'error' ? this.value.error : null,
    });
  }

  setCompany(companyId: string | null): boolean {
    if (this.value.companyStatus !== 'ready' || (companyId && !this.companies.has(companyId)))
      return false;
    if (companyId === this.value.companyId) return true;
    this.projects.clear();
    this.write(companyId, companyId ? this.value.projectKey : null);
    this.publish({
      companyStatus: 'ready',
      projectStatus: companyId ? 'loading' : 'idle',
      error: null,
    });
    return true;
  }

  beginProjects(): IHProjectValidation {
    this.sync();
    this.projects.clear();
    this.publish({ projectStatus: 'loading', error: null });
    return {
      revision: this.value.revision,
      request: ++this.request,
      companyId: this.value.companyId,
    };
  }

  resolveProjects(token: IHProjectValidation, keys: readonly string[]): boolean {
    if (!this.current(token)) return false;
    this.projects = new Set(keys);
    if (this.value.projectKey && !this.projects.has(this.value.projectKey)) {
      this.write(this.value.companyId, null);
      this.publish({ companyStatus: 'ready' });
    }
    this.publish({ projectStatus: 'ready', error: null });
    return true;
  }

  rejectProjects(token: IHProjectValidation, message: string): boolean {
    if (!this.current(token)) return false;
    this.publish({ projectStatus: 'error', error: message });
    return true;
  }

  setProject(projectKey: string | null): boolean {
    if (
      this.value.companyStatus !== 'ready' ||
      this.value.projectStatus !== 'ready' ||
      !this.value.companyId ||
      (projectKey && !this.projects.has(projectKey))
    )
      return false;
    this.write(this.value.companyId, projectKey);
    this.publish({ companyStatus: 'ready', projectStatus: 'ready', error: null });
    return true;
  }

  private current(token: IHProjectValidation): boolean {
    this.sync();
    return (
      token.revision === this.value.revision &&
      token.request === this.request &&
      token.companyId !== null &&
      token.companyId === this.value.companyId &&
      this.value.companyStatus === 'ready'
    );
  }

  private write(companyId: string | null, projectKey: string | null): void {
    this.state.set(SELECTION_NAMESPACE, 'active', { companyId, projectKey });
  }

  private publish(patch: Partial<IHSelectionSnapshot>): void {
    if (
      Object.entries(patch).every(
        ([key, value]) => this.value[key as keyof IHSelectionSnapshot] === value,
      )
    )
      return;
    this.value = Object.freeze({ ...this.value, ...patch });
    for (const listener of [...this.listeners]) listener();
  }
}

export type IHSelectionApi = Pick<
  IHSelection,
  | 'subscribe'
  | 'getSnapshot'
  | 'activateMenu'
  | 'validateCompanies'
  | 'setCompany'
  | 'beginProjects'
  | 'resolveProjects'
  | 'rejectProjects'
  | 'setProject'
>;
