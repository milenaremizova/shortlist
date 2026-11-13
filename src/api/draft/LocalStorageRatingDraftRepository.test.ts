import { describe, expect, it } from 'vitest';

import { makeItem } from '@/domain/testing';

import { LocalStorageRatingDraftRepository } from './LocalStorageRatingDraftRepository';
import type { RatingDraft } from './RatingDraftRepository';

const KEY = 'shortlist:rating-draft:v1';

/** Хранилище в памяти вместо localStorage. */
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

function draft(): RatingDraft {
  return {
    title: 'На неделю',
    items: [makeItem('a'), makeItem('b'), makeItem('c')],
    ranking: null,
  };
}

describe('LocalStorageRatingDraftRepository', () => {
  it('сохранённый черновик читается обратно', () => {
    const repo = new LocalStorageRatingDraftRepository(memoryStorage());

    repo.save(draft());

    expect(repo.load()).toEqual(draft());
  });

  it('черновик с готовым топом читается обратно', () => {
    const repo = new LocalStorageRatingDraftRepository(memoryStorage());
    const done: RatingDraft = {
      ...draft(),
      ranking: { places: [makeItem('b'), makeItem('a'), makeItem('c')], isFinal: true },
    };

    repo.save(done);

    expect(repo.load()).toEqual(done);
  });

  it('после clear черновика нет', () => {
    const repo = new LocalStorageRatingDraftRepository(memoryStorage());
    repo.save(draft());

    repo.clear();

    expect(repo.load()).toBeNull();
  });

  it.each([
    ['битый JSON', '{не json'],
    ['не объект', '"строка"'],
    ['нет items', JSON.stringify({ title: 'x', ranking: null })],
    ['вариант без id', JSON.stringify({ title: 'x', items: [{ title: 'без id' }], ranking: null })],
    ['топ не той формы', JSON.stringify({ title: 'x', items: [], ranking: { places: 'нет' } })],
  ])('%s в хранилище — начинаем с чистого листа', (_name, stored) => {
    const repo = new LocalStorageRatingDraftRepository(memoryStorage({ [KEY]: stored }));

    expect(repo.load()).toBeNull();
  });

  it('без хранилища не падает и ничего не помнит', () => {
    const repo = new LocalStorageRatingDraftRepository(null);

    repo.save(draft());
    repo.clear();

    expect(repo.load()).toBeNull();
  });

  it('сбой записи не роняет приложение', () => {
    const storage = {
      ...memoryStorage(),
      setItem: () => {
        throw new Error('quota');
      },
    };
    const repo = new LocalStorageRatingDraftRepository(storage);

    expect(() => repo.save(draft())).not.toThrow();
  });
});
