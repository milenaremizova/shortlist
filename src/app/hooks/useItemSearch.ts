import { useEffect, useState } from 'react';

import { ApiError } from '@/api/ApiError';
import type { Item, ItemCategory } from '@/domain/types';

import { useDependencies } from '../providers/dependencies';

const DEBOUNCE_MS = 300;

export type SearchStatus = 'idle' | 'loading' | 'done' | 'error';

export function useItemSearch(category: ItemCategory) {
  const provider = useDependencies().providers[category];

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!provider || q === '') return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setStatus('loading');
      setError(null);

      try {
        const found = await provider.search(q, controller.signal);
        if (controller.signal.aborted === true) return;
        setItems(found);
        setStatus('done');
      } catch (err) {
        if (controller.signal.aborted === true) return;
        setError(err instanceof ApiError ? err.message : 'Нет связи с сервером');
        setStatus('error');
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, provider]);

  const isEmpty = query.trim() === '';

  return {
    query,
    setQuery,
    items: isEmpty ? [] : items,
    status: isEmpty ? 'idle' : status,
    error: isEmpty ? null : error,
  };
}
