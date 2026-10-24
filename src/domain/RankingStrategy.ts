// import type — берём только форму данных, при сборке импорт исчезает (verbatimModuleSyntax)
import type { Comparison, Pair, Ranking } from './types';

/**
 * Strategy: алгоритм, который решает, какую пару показать следующей и как собрать итог.
 * Сессия работает с этим интерфейсом и не знает, какой алгоритм внутри.
 */
export interface RankingStrategy {
  /** Следующая пара или null, если сравнивать больше нечего. */
  nextPair(): Pair | null;
  /** Принять результат сравнения. Меняет состояние, ничего не возвращает. */
  submit(comparison: Comparison): void;
  getRanking(): Ranking;
  /** Примерное число сравнений до конца — для прогресса «пара 3 из ~5». */
  estimateTotal(): number;
  isComplete(): boolean;
}

/** Фабрика стратегии: сессия пересоздаёт стратегию с нуля, когда отменяет ход. */
export type StrategyFactory = () => RankingStrategy;
