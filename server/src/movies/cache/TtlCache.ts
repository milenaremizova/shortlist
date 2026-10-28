interface CachedValue<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<T> {
  private readonly store = new Map<string, CachedValue<T>>();
  private readonly ttlMs: number;
  private readonly now: () => number;
  private readonly maxEntries: number;

  constructor(ttlMs: number, now: () => number = Date.now, maxEntries = 500) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.maxEntries = maxEntries;
  }

  get(key: string): T | undefined {
    const cached = this.store.get(key);

    if (!cached) return undefined;
    if (this.now() >= cached.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return cached.value;
  }

  set(key: string, value: T): void {
    this.store.delete(key);
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) {
        this.store.delete(oldest);
      }
    }
    this.store.set(key, { value, expiresAt: this.now() + this.ttlMs });
  }
}
