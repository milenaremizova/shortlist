import { toMovieDto, type MovieDto, type PoiskkinoSearchResponse } from './toMovieDto.ts';

const BASE_URL = 'https://api.poiskkino.dev/v1.5';
const PAGE_SIZE = 10;

export class PoiskkinoError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'PoiskkinoError';
    this.status = status;
  }
}

export class PoiskkinoClient {
  private readonly apiKey: string;
  private readonly fetchFn: typeof fetch;

  constructor(apiKey: string, fetchFn: typeof fetch = fetch) {
    this.apiKey = apiKey;
    this.fetchFn = fetchFn;
  }

  async search(query: string, page = 1): Promise<MovieDto[]> {
    const url = new URL(`${BASE_URL}/movie/search`);
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(PAGE_SIZE));

    const resp = await this.fetchFn(url, {
      headers: { 'X-API-KEY': this.apiKey },
    });

    if (!resp.ok) throw new PoiskkinoError(resp.status, `ПоискКино ответил ${resp.status}`);
    const data = (await resp.json()) as PoiskkinoSearchResponse;
    return data.docs.map(toMovieDto);
  }
}
