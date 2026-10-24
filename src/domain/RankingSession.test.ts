import { describe, it, expect } from 'vitest';
import { RankingSession } from './RankingSession';
import type { RankingStrategy } from './RankingStrategy';
import { MergeSortStrategy } from './strategies/MergeSortStrategy';
import { makeItem } from './testing';
import type { Pair, Ranking } from './types';

/** Фейковая стратегия: просто отдаёт пары по списку. Проверяем сессию, а не алгоритм. */
class FakeStrategy implements RankingStrategy {
  private readonly pairs: Pair[];
  private index = 0;

  constructor(pairs: Pair[]) {
    this.pairs = pairs;
  }

  nextPair(): Pair | null {
    return this.pairs[this.index] ?? null;
  }

  submit(): void {
    this.index++;
  }

  getRanking(): Ranking {
    return { places: [], isFinal: this.isComplete() };
  }

  estimateTotal(): number {
    return this.pairs.length;
  }

  isComplete(): boolean {
    return this.index >= this.pairs.length;
  }
}

describe('RankingSession', () => {
  const a = makeItem('a');
  const b = makeItem('b');
  const c = makeItem('c');
  const d = makeItem('d');
  const pairAB: Pair = { left: a, right: b };
  const pairBC: Pair = { left: b, right: c };
  const pairCD: Pair = { left: c, right: d };

  it('отдаёт первую пару из стратегии сразу после создания', () => {
    // Arrange
    const session = new RankingSession(() => new FakeStrategy([pairAB]));

    // Act
    const current = session.currentPair();

    // Assert
    expect(current).toEqual(pairAB);
  });

  it('после choose с валидным winnerId переходит к следующей паре', () => {
    const session = new RankingSession(() => new FakeStrategy([pairAB, pairBC]));

    session.choose(a.id);

    expect(session.currentPair()).toEqual(pairBC);
  });

  it('бросает ошибку, если winnerId не из текущей пары', () => {
    const session = new RankingSession(() => new FakeStrategy([pairAB]));

    expect(() => session.choose('c')).toThrow();
  });

  it('undo возвращает предыдущую пару и прогресс', () => {
    const session = new RankingSession(() => new FakeStrategy([pairAB, pairBC, pairCD]));

    session.choose(b.id);
    expect(session.currentPair()).toEqual(pairBC);
    expect(session.progress().done).toBe(1);

    session.undo();

    expect(session.currentPair()).toEqual(pairAB);
    expect(session.progress().done).toBe(0);
  });

  it('undo без ходов ничего не ломает, canUndo показывает, можно ли отменить', () => {
    const session = new RankingSession(() => new FakeStrategy([pairAB]));

    expect(session.canUndo()).toBe(false);
    session.undo();
    expect(session.currentPair()).toEqual(pairAB);

    session.choose(a.id);
    expect(session.canUndo()).toBe(true);
  });

  it('вместе с MergeSortStrategy: undo посреди слияния возвращает ту же пару, а не первую', () => {
    // Arrange: на этом сценарии ломался старый undo — повтор журнала без nextPair()
    const pool = ['a', 'b', 'c', 'd'].map((id) => makeItem(id));
    const session = new RankingSession(() => new MergeSortStrategy(pool));
    session.choose('a'); // a > b
    session.choose('c'); // c > d → идёт слияние [a, b] и [c, d]
    const beforeChoice = session.currentPair();

    // Act
    session.choose(beforeChoice!.left.id);
    session.undo();

    // Assert
    expect(session.currentPair()).toEqual(beforeChoice);
    expect(session.progress().done).toBe(2);
  });
});
