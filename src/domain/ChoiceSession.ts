import type { Pair, Ranking, SessionProgress } from './types';

/**
 * Общий интерфейс сессии ранжирования: свой рейтинг, раунд вечера.
 * Экран сравнения и хуки работают только с ним, поэтому один экран подходит всем режимам,
 * а конкретную сессию можно заменить, не трогая UI.
 *
 * Дуэль сюда не входит: в ней нет отмены хода, прогресса и рейтинга, зато есть игроки
 * и совпадение. Поэтому DuelSession - отдельный класс со своим API (Interface Segregation).
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
