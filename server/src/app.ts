import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import type { Config } from './config.ts';
import type { MovieSearch } from './movies/MovieSearch.ts';
import { moviesRouter } from './routes/movies.ts';

export function createApp(config: Config, search: MovieSearch) {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.allowedOrigin }));

  const limiter = rateLimit({
    windowMs: 60_000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Слишком много запросов, попробуй через минуту' },
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/movies', limiter, moviesRouter(search));

  return app;
}
