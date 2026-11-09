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
  it('сохраняет запись и отдаёт её первой', async () => {
    const repo = new LocalStorageHistoryRepository(memoryStorage());

    await repo.save(entry('old'));
    await repo.save(entry('new'));

    const list = await repo.list();
    expect(list.map((e) => e.id)).toEqual(['new', 'old']);
  });

  it('удаляет запись по id', async () => {
    const repo = new LocalStorageHistoryRepository(memoryStorage());
    await repo.save(entry('a'));
    await repo.save(entry('b'));

    await repo.remove('a');

    const list = await repo.list();
    expect(list.map((e) => e.id)).toEqual(['b']);
  });

  it('битый JSON в хранилище не роняет приложение', async () => {
    const repo = new LocalStorageHistoryRepository(
      memoryStorage({ 'shortlist:history:v1': '{не json' }),
    );

    expect(await repo.list()).toEqual([]);
  });

  it('битая запись отсеивается, остальные остаются', async () => {
    const stored = JSON.stringify([
      entry('good'),
      { id: 'broken', title: 'без items и mode' },
      'просто строка',
      entry('also-good'),
    ]);
    const repo = new LocalStorageHistoryRepository(
      memoryStorage({ 'shortlist:history:v1': stored }),
    );

    const list = await repo.list();
    expect(list.map((e) => e.id)).toEqual(['good', 'also-good']);
  });

  it('без хранилища list отдаёт пустую историю', async () => {
    const repo = new LocalStorageHistoryRepository(null);

    expect(await repo.list()).toEqual([]);
  });

  it('без хранилища save отклоняется, а не делает вид, что сохранил', async () => {
    const repo = new LocalStorageHistoryRepository(null);

    await expect(repo.save(entry('a'))).rejects.toThrow('Хранилище недоступно');
  });

  it('save отклоняется, если setItem падает (переполнение, приватный режим)', async () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    const repo = new LocalStorageHistoryRepository(storage);

    await expect(repo.save(entry('a'))).rejects.toThrow('quota');
  });
});
