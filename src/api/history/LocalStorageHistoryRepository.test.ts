import { describe, expect, it } from 'vitest';

import type { HistoryEntry } from './HistoryRepository';
import { LocalStorageHistoryRepository } from './LocalStorageHistoryRepository';

/** Хранилище в памяти вместо localStorage. */
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

function entry(id: string): HistoryEntry {
  return { id, mode: 'rating', createdAt: '2026-10-24T10:00:00.000Z', title: id, items: [] };
}

describe('LocalStorageHistoryRepository', () => {
  it('сохраняет запись и отдаёт её первой', () => {
    const repo = new LocalStorageHistoryRepository(memoryStorage());

    repo.save(entry('old'));
    repo.save(entry('new'));

    expect(repo.list().map((e) => e.id)).toEqual(['new', 'old']);
  });

  it('удаляет запись по id', () => {
    const repo = new LocalStorageHistoryRepository(memoryStorage());
    repo.save(entry('a'));
    repo.save(entry('b'));

    repo.remove('a');

    expect(repo.list().map((e) => e.id)).toEqual(['b']);
  });

  it('битый JSON в хранилище не роняет приложение', () => {
    const repo = new LocalStorageHistoryRepository(
      memoryStorage({ 'shortlist:history:v1': '{не json' }),
    );

    expect(repo.list()).toEqual([]);
  });

  it('без хранилища работает как пустая история', () => {
    const repo = new LocalStorageHistoryRepository(null);

    repo.save(entry('a'));

    expect(repo.list()).toEqual([]);
  });
});
