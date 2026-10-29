import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';

import { createApp } from '../app.ts';
import { readConfig } from '../config.ts';
import { PoiskkinoError } from '../movies/PoiskkinoClient.ts';
import { parseSearchParams } from './movies.ts';

describe('parseSearchParams', () => {
  it('обрезает пробелы и берёт страницу 1 по умолчанию', () => {
    assert.deepEqual(parseSearchParams({ q: ' дюна ' }), { q: 'дюна', page: 1 });
  });

  it('принимает граничные значения', () => {
    const longest = 'a'.repeat(100);

    assert.deepEqual(parseSearchParams({ q: longest, page: '10' }), { q: longest, page: 10 });
    assert.deepEqual(parseSearchParams({ q: 'я', page: '1' }), { q: 'я', page: 1 });
  });

  it('отклоняет плохой ввод', () => {
    const bad = [
      {},
      { q: '   ' },
      { q: 'a'.repeat(101) },
      { q: ['a', 'b'] },
      { q: 'дюна', page: '0' },
      { q: 'дюна', page: '11' },
      { q: 'дюна', page: '2.5' },
      { q: 'дюна', page: 'abc' },
    ];

    for (const query of bad) {
      assert.equal(parseSearchParams(query), null, JSON.stringify(query));
    }
  });
});

describe('GET /api/movies/search: ошибки источника', () => {
  it('403 от ПоискКино превращается в 429', async () => {
    const app = createApp(readConfig({}), {
      search: async () => {
        throw new PoiskkinoError(403, 'лимит');
      },
    });

    const res = await request(app).get('/api/movies/search?q=дюна');

    assert.equal(res.status, 429);
  });

  it('любая другая ошибка превращается в 502 и не раскрывает детали', async () => {
    const app = createApp(readConfig({}), {
      search: async () => {
        throw new Error('внутренняя деталь');
      },
    });

    const res = await request(app).get('/api/movies/search?q=дюна');

    assert.equal(res.status, 502);
    assert.ok(!res.text.includes('внутренняя деталь'));
  });
});

describe('GET /api/movies/search: лимит запросов', () => {
  it('после 30 запросов в минуту отвечает 429', async () => {
    // Arrange
    const app = createApp(readConfig({}), { search: async () => [] });

    // Act
    let last = 0;
    for (let i = 0; i < 31; i++) {
      const res = await request(app).get('/api/movies/search?q=дюна');
      last = res.status;
    }

    // Assert
    assert.equal(last, 429);
  });
});
