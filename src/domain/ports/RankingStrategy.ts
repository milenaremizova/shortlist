// беру только форму данных через type, явно говорю комплиятору, что при сборке этот код можно убрать
import type { Comparison, Pair, Ranking } from "../types";

export interface RankingStrategy {
  // методы - действие, которое будет выполнено в момент вызова
  nextPair(): Pair | null;
  submit(comparison: Comparison): void; // задача поменять состояние. нет возврата или вычислений
  getRanking(): Ranking;
  estimateTotal(): number;
  isComplete(): boolean;
}