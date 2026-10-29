// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/api/ApiError';
import type { HistoryRepository } from '@/api/history/HistoryRepository';
import type { ItemProvider } from '@/api/ItemProvider';
import { makeItem } from '@/domain/testing';
import type { Item } from '@/domain/types';

import { DependenciesProvider } from '../providers/DependenciesProvider';
import { useItemSearch } from './useItemSearch';

function renderSearch(search: ItemProvider['search']) {
  const provider: ItemProvider = { category: 'film', search };
  const deps = { history: {} as HistoryRepository, providers: { film: provider } };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <DependenciesProvider value={deps}>{children}</DependenciesProvider>
  );

  return renderHook(() => useItemSearch('film'), { wrapper });
}

describe('useItemSearch', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('быстрый ввод — один запрос, по последнему тексту', async () => {
    const search = vi.fn<ItemProvider['search']>(async () => []);
    const { result } = renderSearch(search);

    for (const text of ['д', 'дю', 'дюн', 'дюна']) {
      act(() => result.current.setQuery(text));
      await act(() => vi.advanceTimersByTimeAsync(100));
    }
    await act(() => vi.advanceTimersByTimeAsync(300));

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('дюна', expect.any(AbortSignal));
  });

  it('поздний ответ на старый запрос не затирает новый', async () => {
    const answers: Array<(items: Item[]) => void> = [];
    const search = vi.fn<ItemProvider['search']>(
      () => new Promise((resolve) => answers.push(resolve)),
    );
    const { result } = renderSearch(search);

    act(() => result.current.setQuery('дю'));
    await act(() => vi.advanceTimersByTimeAsync(300));
    act(() => result.current.setQuery('дюна'));
    await act(() => vi.advanceTimersByTimeAsync(300));

    await act(async () => {
      answers[1]([makeItem('dune')]);
      answers[0]([makeItem('stale')]);
    });

    expect(result.current.items.map((item) => item.id)).toEqual(['dune']);
    expect(result.current.status).toBe('done');
  });

  it.each([
    [new ApiError(429, 'Слишком много запросов'), 'Слишком много запросов'],
    [new TypeError('Failed to fetch'), 'Нет связи с сервером'],
  ])('ошибка %o → текст «%s»', async (thrown, expected) => {
    const { result } = renderSearch(async () => {
      throw thrown;
    });

    act(() => result.current.setQuery('дюна'));
    await act(() => vi.advanceTimersByTimeAsync(300));

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(expected);
  });
});
