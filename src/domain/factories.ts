import type { ChoiceSession } from './ChoiceSession';
import { RankingSession } from './RankingSession';
import { identity, shuffle, type ShuffleFn } from './shuffle';
import { MergeSortStrategy } from './strategies/MergeSortStrategy';
import type { Item } from './types';

/**
 * Единственное место, где собираются конкретные сессии.
 * Чтобы поменять состав режима (другая стратегия, правило конца дуэли), правится только этот файл.
 */

/** «Свой рейтинг». Пул перемешивается один раз здесь, поэтому отмена хода не меняет порядок пар. */
export function createRatingSession(
  pool: readonly Item[],
  shuffleFn: ShuffleFn = shuffle,
): ChoiceSession {
  const ordered = shuffleFn(pool);
  return new RankingSession(() => new MergeSortStrategy(identity(ordered)));
}

// TODO(этап 3): createEveningSession — шаги film → food → drink, KnockoutStrategy
// TODO(этап 4): createDuelSession — DuelSession + FirstMatchRule, кубик за первый ход
