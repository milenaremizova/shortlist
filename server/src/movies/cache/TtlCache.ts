interface CachedValue<T> {
  value: T;
  expiresAt: number; // момент (в мс), после которого запись считается устаревшей
}

export class TtlCache<T> {
  private readonly store = new Map<string, CachedValue<T>>();
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(ttlMs: number, now: () => number = Date.now) {
    this.ttlMs = ttlMs;
    this.now = now;
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
    this.store.set(key, { value, expiresAt: this.now() + this.ttlMs });
  }
}
