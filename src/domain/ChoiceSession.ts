import type { Pair, Ranking, SessionProgress } from './types';

/**
 * Общий интерфейс любой сессии выбора: свой рейтинг, раунд вечера, дуэль.
 * Экран сравнения и хуки работают только с ним, поэтому один экран подходит всем режимам,
 * а конкретную сессию можно заменить, не трогая UI.
 */
export interface ChoiceSession {
  currentPair(): Pair | null;
  choose(winnerId: string): void;
  undo(): void;
  canUndo(): boolean;
  progress(): SessionProgress;
  isComplete(): boolean;
  result(): Ranking;
}
