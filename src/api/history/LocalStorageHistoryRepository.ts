import type { HistoryEntry, HistoryRepository } from './HistoryRepository';

const KEY = 'shortlist:history:v1';

/** Минимум от Storage, который нам нужен: так в тестах можно подсунуть простой объект. */
type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

export class LocalStorageHistoryRepository implements HistoryRepository {
  private readonly storage: KeyValueStorage | null;

  constructor(storage: KeyValueStorage | null = safeLocalStorage()) {
    this.storage = storage;
  }

  list(): HistoryEntry[] {
    try {
      const raw = this.storage?.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
    } catch {
      // битые данные или хранилище недоступно — показываем пустую историю, а не белый экран
      return [];
    }
  }

  save(entry: HistoryEntry): void {
    this.write([entry, ...this.list().filter((e) => e.id !== entry.id)]);
  }

  remove(id: string): void {
    this.write(this.list().filter((e) => e.id !== id));
  }

  private write(entries: HistoryEntry[]): void {
    try {
      this.storage?.setItem(KEY, JSON.stringify(entries));
    } catch {
      // приватный режим или переполнение: молча живём без истории
    }
  }
}

function safeLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
