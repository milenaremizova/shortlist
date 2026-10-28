import type { TtlCache } from './cache/TtlCache.ts';
import type { MovieSearch } from './MovieSearch.ts';
import type { MovieDto } from './toMovieDto.ts';

export class CachedMovieSearch implements MovieSearch {
  private readonly inner: MovieSearch;
  private readonly cache: TtlCache<MovieDto[]>;

  constructor(inner: MovieSearch, cache: TtlCache<MovieDto[]>) {
    this.inner = inner;
    this.cache = cache;
  }

  async search(query: string, page = 1): Promise<MovieDto[]> {
    const key = `${query.trim().toLowerCase()}:${page}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;

    const movies = await this.inner.search(query, page);
    this.cache.set(key, movies);
    return movies;
  }
}
