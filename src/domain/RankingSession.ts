import type { ChoiceSession } from './ChoiceSession';
import type { RankingStrategy, StrategyFactory } from './RankingStrategy';
import type { Comparison, Pair, Ranking, SessionProgress } from './types';

/**
 * Facade: прячет стратегию и журнал сравнений за простым API.
 * Отмена хода — через повтор журнала: стратегия создаётся заново и «проигрывает» все ходы, кроме последнего.
 */
export class RankingSession implements ChoiceSession {
  private readonly log: Comparison[] = [];
  private readonly factory: StrategyFactory;
  private strategy: RankingStrategy;
  private pair: Pair | null;

  constructor(factory: StrategyFactory) {
    this.factory = factory;
    this.strategy = factory();
    this.pair = this.strategy.nextPair();
  }

  currentPair(): Pair | null {
    return this.pair;
  }

  choose(winnerId: string): void {
    const pair = this.pair;
    if (pair === null) return;

    if (winnerId !== pair.left.id && winnerId !== pair.right.id) {
      throw new Error(`winnerId "${winnerId}" не из текущей пары`);
    }

    const comparison: Comparison = { leftId: pair.left.id, rightId: pair.right.id, winnerId };
    this.log.push(comparison);
    this.strategy.submit(comparison);
    this.pair = this.strategy.nextPair();
  }

  undo(): void {
    if (this.log.length === 0) return;

    this.log.pop();
    this.strategy = this.factory();
    for (const comparison of this.log) {
      // Стратегия начинает слияние внутри nextPair(), поэтому при повторе
      // сначала спрашиваем пару и только потом отдаём результат.
      this.strategy.nextPair();
      this.strategy.submit(comparison);
    }
    this.pair = this.strategy.nextPair();
  }

  canUndo(): boolean {
    return this.log.length > 0;
  }

  progress(): SessionProgress {
    return { done: this.log.length, estimated: this.strategy.estimateTotal() };
  }

  isComplete(): boolean {
    return this.strategy.isComplete();
  }

  result(): Ranking {
    return this.strategy.getRanking();
  }
}
