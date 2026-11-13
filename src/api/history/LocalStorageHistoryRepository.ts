import { safeLocalStorage } from '@/api/storage';

import type { HistoryEntry, HistoryRepository } from './HistoryRepository';

const KEY = 'shortlist:history:v1';

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

export class LocalStorageHistoryRepository implements HistoryRepository {
  private readonly storage: KeyValueStorage | null;

  constructor(storage: KeyValueStorage | null = safeLocalStorage()) {
    this.storage = storage;
  }

  async list(): Promise<HistoryEntry[]> {
    return this.read();
  }

  private read(): HistoryEntry[] {
    try {
      const raw = this.storage?.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isHistoryEntry) : [];
    } catch {
      return [];
    }
  }

  async save(entry: HistoryEntry): Promise<void> {
    const others = this.read().filter((e) => e.id !== entry.id);
    this.write([entry, ...others]);
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((e) => e.id !== id));
  }

  private write(entries: HistoryEntry[]): void {
    if (this.storage === null) throw new Error('Хранилище недоступно');
    this.storage.setItem(KEY, JSON.stringify(entries));
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
