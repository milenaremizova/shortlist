import type { HistoryEntry, HistoryRepository } from './HistoryRepository';

const KEY = 'shortlist:history:v1';

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
      return Array.isArray(parsed) ? parsed.filter(isHistoryEntry) : [];
    } catch {
      // битые данные или хранилище недоступно - показываем пустую историю, а не белый экран
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

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === 'string' &&
    typeof entry.title === 'string' &&
    typeof entry.createdAt === 'string' &&
    (entry.mode === 'rating' || entry.mode === 'evening' || entry.mode === 'duel') &&
    Array.isArray(entry.items)
  );
}
