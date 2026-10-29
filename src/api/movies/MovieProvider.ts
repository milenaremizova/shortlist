import type { Item, ItemCategory } from '@/domain/types';

import { ApiError } from '../ApiError';
import type { ItemProvider } from '../ItemProvider';
import type { MovieDto } from './movieDto';
import { toItem } from './toItem';

export class MovieProvider implements ItemProvider {
  readonly category: ItemCategory = 'film';
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(baseUrl: string, fetchFn: typeof fetch = (...args) => fetch(...args)) {
    this.baseUrl = baseUrl;
    this.fetchFn = fetchFn;
  }

  async search(query: string, signal?: AbortSignal): Promise<Item[]> {
    const q = query.trim();
    if (q === '') return [];

    const url = new URL('/api/movies/search', this.baseUrl);
    url.searchParams.set('q', q);
    const response = await this.fetchFn(url, { signal });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new ApiError(response.status, body?.error ?? 'Не удалось загрузить фильм');
    }

    const movies: MovieDto[] = await response.json();
    return movies.map(toItem);
  }
}
