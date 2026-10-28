import { describe, expect, it } from 'vitest';

import { makeItem } from '../testing';
import { MergeSortStrategy } from './MergeSortStrategy';

/** Прогоняет стратегию до конца: всегда побеждает левый вариант пары. */
function runLeftAlwaysWins(strategy: MergeSortStrategy): void {
  let pair = strategy.nextPair();
  while (pair !== null) {
    strategy.submit({ leftId: pair.left.id, rightId: pair.right.id, winnerId: pair.left.id });
    pair = strategy.nextPair();
  }
}

describe('MergeSortStrategy', () => {
  it('на старте отдаёт пару из первых двух вариантов пула', () => {
    // Arrange
    const [a, b, c] = ['a', 'b', 'c'].map((id) => makeItem(id));
    const strategy = new MergeSortStrategy([a, b, c]);

    // Act
    const pair = strategy.nextPair();

    // Assert
    expect(pair).toEqual({ left: a, right: b });
  });

  it('после первого сравнения сливает победителя со следующей кучкой', () => {
    const [a, b, c] = ['a', 'b', 'c'].map((id) => makeItem(id));
    const strategy = new MergeSortStrategy([a, b, c]);

    strategy.nextPair();
    strategy.submit({ leftId: a.id, rightId: b.id, winnerId: a.id });

    expect(strategy.nextPair()).toEqual({ left: a, right: c });
  });

  it('сортирует 4 варианта до конца', () => {
    const items = ['a', 'b', 'c', 'd'].map((id) => makeItem(id));
    const strategy = new MergeSortStrategy(items);

    runLeftAlwaysWins(strategy);

    expect(strategy.getRanking()).toEqual({ places: items, isFinal: true });
    expect(strategy.isComplete()).toBe(true);
  });

  it('верно сортирует нечётное число вариантов', () => {
    const items = ['a', 'b', 'c', 'd', 'e'].map((id) => makeItem(id));
    const strategy = new MergeSortStrategy(items);

    runLeftAlwaysWins(strategy);

    expect(strategy.getRanking()).toEqual({ places: items, isFinal: true });
  });

  it('пул из одного варианта сразу готов', () => {
    const strategy = new MergeSortStrategy([makeItem('a')]);

    expect(strategy.nextPair()).toBeNull();
    expect(strategy.isComplete()).toBe(true);
    expect(strategy.estimateTotal()).toBe(0);
  });

  it('estimateTotal — положительная конечная оценка', () => {
    const strategy = new MergeSortStrategy(['a', 'b', 'c', 'd'].map((id) => makeItem(id)));

    const estimate = strategy.estimateTotal();

    expect(estimate).toBeGreaterThan(0);
    expect(Number.isFinite(estimate)).toBe(true);
  });
});
