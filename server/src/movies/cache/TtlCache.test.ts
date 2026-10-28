import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { TtlCache } from './TtlCache.ts';

describe('TtlCache', () => {
  it('возвращает undefined для неизвестного ключа', () => {
    const cache = new TtlCache<string>(1000);

    const result = cache.get('нет такого ключа');

    assert.equal(result, undefined);
  });

  it('возвращает сохранённое значение, пока оно не устарело', () => {
    let time = 0;
    const cache = new TtlCache<string>(1000, () => time);
    cache.set('a', 'x');

    time = 888;
    const result = cache.get('a');

    assert.equal(result, 'x');
  });

  it('возвращает undefined после истечения времени', () => {
    let time = 0;
    const cache = new TtlCache<string>(1000, () => time);

    cache.set('a', 'x');
    time = 1000;
    const result = cache.get('a');

    assert.equal(result, undefined);
  });
});

it('при переполнении вытесняет самую старую запись', () => {
  const cache = new TtlCache<string>(1000, () => 0, 2);

  cache.set('a', '1');
  cache.set('b', '2');
  cache.set('c', '3');

  assert.equal(cache.get('a'), undefined);
  assert.equal(cache.get('b'), '2');
  assert.equal(cache.get('c'), '3');
});
