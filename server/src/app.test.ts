// Встроенный раннер Node (node:test): серверу не нужен отдельный тестовый фреймворк.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import request from 'supertest';

import { createApp } from './app.ts';
import { readConfig } from './config.ts';
import type { MovieSearch } from './movies/MovieSearch.ts';

/** Заглушка поиска: этим тестам источник данных не важен. */
const fakeSearch: MovieSearch = { search: async () => [] };

describe('server', () => {
  it('/api/health отвечает ok', async () => {
    const app = createApp(readConfig({}), fakeSearch);

    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true });
  });
});
