import type { RankingStrategy } from '../RankingStrategy';
import type { Comparison, Item, Pair, Ranking } from '../types';

interface MergeState {
  left: Item[];
  right: Item[];
  merged: Item[];
}

/**
 * Полный рейтинг для «Своего рейтинга»: восходящая сортировка слиянием.
 * Каждая показанная пара — одно сравнение при слиянии двух соседних «кучек».
 * Порядок пула задаёт вызывающий код: перемешивание — не забота стратегии.
 */
export class MergeSortStrategy implements RankingStrategy {
  private readonly runs: Item[][];
  private readonly total: number;
  private mergeState: MergeState | null = null; // null — слияние пары кучек ещё не начато

  constructor(pool: readonly Item[]) {
    this.runs = pool.map((item) => [item]);
    this.total = pool.length;
  }

  nextPair(): Pair | null {
    if (this.mergeState === null) {
      if (this.runs.length < 2) return null;
      // копии, чтобы shift() не портил кучки в runs
      this.mergeState = { left: [...this.runs[0]], right: [...this.runs[1]], merged: [] };
    }
    const { left, right } = this.mergeState;
    return { left: left[0], right: right[0] };
  }

  submit(comparison: Comparison): void {
    const state = this.mergeState;
    if (state === null) return;

    const from = state.left[0].id === comparison.winnerId ? state.left : state.right;
    const winner = from.shift();
    if (winner) state.merged.push(winner);

    if (state.left.length === 0 || state.right.length === 0) {
      state.merged.push(...state.left, ...state.right);
      // слияние всегда идёт по двум первым кучкам: заменяем их одной
      this.runs.splice(0, 2, state.merged);
      this.mergeState = null;
    }
  }

  getRanking(): Ranking {
    return { places: this.runs.flat(), isFinal: this.isComplete() };
  }

  estimateTotal(): number {
    // верхняя оценка n·log2(n): реальных сравнений обычно меньше
    if (this.total < 2) return 0;
    return Math.ceil(this.total * Math.log2(this.total));
  }

  isComplete(): boolean {
    return this.runs.length <= 1;
  }
}
