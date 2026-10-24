import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { TtlCache } from './TtlCache.ts';

describe('TtlCache', () => {
  it('возвращает undefined для неизвестного ключа', () => {
    // TODO
    // arrange
    const cache = new TtlCache<string>(1000);

    // act
    const result = cache.get('нет такого ключа');

    // assert
    assert.equal(result, undefined);
  });

  it('возвращает сохранённое значение, пока оно не устарело', () => {
    // arrange
    let time = 0;
    const cache = new TtlCache<string>(1000, () => time);
    cache.set('a', 'x');

    // act
    time = 888;
    const result = cache.get('a');

    // assert =
    assert.equal(result, 'x');
  });

  it('возвращает undefined после истечения времени', () => {
    // Arrange
    let time = 0;
    const cache = new TtlCache<string>(1000, () => time); // часы, которыми управляем сами

    // Act
    cache.set('a', 'x');
    time = 1000; // «прошла» 1 секунда
    const result = cache.get('a');

    // Assert
    assert.equal(result, undefined);
  });
});
