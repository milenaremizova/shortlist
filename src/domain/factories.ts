import type { ChoiceSession } from './ChoiceSession';
import { rollForFirstTurn, type DiceRoll, type RandomFn } from './duel/dice';
import { coin, DuelSession, type CoinFn } from './duel/DuelSession';
import { RankingSession } from './RankingSession';
import { identity, shuffle, type ShuffleFn } from './shuffle';
import { MergeSortStrategy } from './strategies/MergeSortStrategy';
import type { Item } from './types';

/**
 * Единственное место, где собираются конкретные сессии.
 * Чтобы поменять состав режима (другая стратегия, другой кубик), правится только этот файл.
 */

/** свой рейтинг. Пул перемешивается один раз здесь, поэтому отмена хода не меняет порядок пар. */
export function createRatingSession(
  pool: readonly Item[],
  shuffleFn: ShuffleFn = shuffle,
): ChoiceSession {
  const ordered = shuffleFn(pool);
  return new RankingSession(() => new MergeSortStrategy(identity(ordered)));
}

// TODO(этап 3): createEveningSession

export interface DuelSetup {
  session: DuelSession;
  roll: DiceRoll;
}

export interface DuelDeps {
  shuffleFn?: ShuffleFn;
  random?: RandomFn;
  flip?: CoinFn;
}

export function createDuelSession(pool: readonly Item[], deps: DuelDeps = {}): DuelSetup {
  const { shuffleFn = shuffle, random = Math.random, flip = coin } = deps;
  const roll = rollForFirstTurn(random);
  const session = new DuelSession(shuffleFn(pool), roll.starter, flip);
  return { session, roll };
}
