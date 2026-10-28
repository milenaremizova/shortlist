import { createApp } from './app.ts';
import { readConfig } from './config.ts';
import { TtlCache } from './movies/cache/TtlCache.ts';
import { CachedMovieSearch } from './movies/CachedMovieSearch.ts';
import { PoiskkinoClient } from './movies/PoiskkinoClient.ts';
import type { MovieDto } from './movies/toMovieDto.ts';

const config = readConfig();

if (!config.poiskkinoApiKey) {
  console.error('POISKKINO_API_KEY не задан в server/.env');
  process.exit(1);
}

const search = new CachedMovieSearch(
  new PoiskkinoClient(config.poiskkinoApiKey),
  new TtlCache<MovieDto[]>(24 * 60 * 60 * 1000),
);

createApp(config, search).listen(config.port, () => {
  console.log(`shortlist server → http://localhost:${config.port}`);
});
