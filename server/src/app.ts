import express from 'express';
import cors from 'cors';
import type { Config } from './config.ts';
import { moviesRouter } from './routes/movies.ts';

/** Приложение собирается отдельно от запуска — так его можно тестировать через supertest без порта. */
export function createApp(config: Config) {
  const app = express();
  app.use(cors({ origin: config.allowedOrigin }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/movies', moviesRouter(config));

  return app;
}
