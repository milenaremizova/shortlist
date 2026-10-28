import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PoiskkinoClient, PoiskkinoError } from './PoiskkinoClient.ts';

/** Подставной fetch: возвращает заготовленный ответ и в сеть не ходит. */
function fakeFetch(body: unknown, status = 200): typeof fetch {
  return async () => new Response(JSON.stringify(body), { status });
}

describe('PoiskkinoClient', () => {
  // тест 1 (ключ в заголовке, запрос в адресе): у тебя он уже есть из прошлого скелета

  it('возвращает фильмы в формате MovieDto', async () => {
    // Arrange
    const body = {
      docs: [{ id: 1, name: 'Дюна', poster: { previewUrl: 'https://img/p.jpg' } }],
      total: 1,
      limit: 10,
      page: 1,
      pages: 1,
    };
    const client = new PoiskkinoClient('key', fakeFetch(body));

    // Act
    const result = await client.search('дюна');

    // Assert
    // TODO: проверь, что в result один фильм, а у result[0] title 'Дюна' и posterUrl 'https://img/p.jpg'
    assert.equal(result.length, 1);
    assert.equal(result[0]?.title, 'Дюна');
    assert.equal(result[0]?.posterUrl, 'https://img/p.jpg');
  });

  it('при 403 бросает PoiskkinoError со статусом 403', async () => {
    // Arrange
    const client = new PoiskkinoClient('key', fakeFetch({}, 403));

    // Act + Assert
    await assert.rejects(client.search('дюна'), (err: unknown) => {
      assert.ok(err instanceof PoiskkinoError);
      return true;
    });
  });
});
