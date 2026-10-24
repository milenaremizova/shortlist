// Встроенный раннер Node (node:test): серверу не нужен отдельный тестовый фреймворк.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './app.ts';
import { readConfig } from './config.ts';

describe('server', () => {
  it('/api/health отвечает ok', async () => {
    const app = createApp(readConfig({}));

    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true });
  });

  it('без ключа поиск фильмов честно говорит, чего не хватает', async () => {
    const app = createApp(readConfig({}));

    const res = await request(app).get('/api/movies/search?q=дюна');

    assert.equal(res.status, 503);
  });
});
