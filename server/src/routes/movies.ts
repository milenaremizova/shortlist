import { Router, type Request } from 'express';

import type { MovieSearch } from '../movies/MovieSearch.ts';
import { PoiskkinoError } from '../movies/PoiskkinoClient.ts';

export function parseSearchParams(query: Request['query']): { q: string; page: number } | null {
  if (typeof query.q !== 'string') return null;

  const q = query.q.trim();
  if (q.length < 1 || q.length > 100) return null;

  const page = Number(query.page ?? 1);
  if (!Number.isInteger(page) || page < 1 || page > 10) return null;

  return { q, page };
}

export function moviesRouter(search: MovieSearch) {
  const router = Router();

  router.get('/search', async (req, res) => {
    const params = parseSearchParams(req.query);
    if (params === null) {
      res
        .status(400)
        .json({ error: 'Некорректный запрос: q от 1 до 100 символов, page от 1 до 10' });
      return;
    }

    try {
      const movies = await search.search(params.q, params.page);
      res.json(movies);
    } catch (error) {
      console.log(error);
      if (error instanceof PoiskkinoError && error.status === 403) {
        res.status(429).json({ error: 'Превышен лимит запросов' });
        return;
      }
      res.status(502).json({ error: 'Внешний сервер не отвечает' });
    }
  });

  return router;
}
