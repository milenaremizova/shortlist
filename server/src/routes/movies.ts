import { Router } from 'express';
import type { Config } from '../config.ts';

/**
 * Прокси к ПоискКино. Ключ добавляется здесь, в браузер уходит только урезанный ответ.
 *
 * TODO(этап 1):
 *  - GET /search?q=…&page=1 → https://api.poiskkino.dev/v1.5/movie/search, заголовок X-API-KEY, limit=10
 *  - ответ клиенту: { id, title, year, posterUrl } — постер обязателен для карточки
 *  - кэш в памяти на 24 ч (лимит бесплатного тарифа — 200 запросов в день)
 *  - ошибки: 400 пустой запрос · 429 лимит · 502 ПоискКино не ответил
 */
export function moviesRouter(config: Config) {
  const router = Router();

  router.get('/search', (_req, res) => {
    if (!config.poiskkinoApiKey) {
      res.status(503).json({ error: 'POISKKINO_API_KEY не задан в server/.env' });
      return;
    }
    res.status(501).json({ error: 'Поиск фильмов ещё не реализован' });
  });

  return router;
}
