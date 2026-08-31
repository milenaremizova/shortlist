import type { RankingStrategy } from "./RankingStrategy";
import type { Comparison, Movie } from "./types";

export class RankingSession {
  private pool: Movie[];
  private log: Comparison[];
  private strategy: RankingStrategy;
  private readonly factory: () => RankingStrategy;

  constructor(pool: Movie[], factory: () => RankingStrategy) {
    this.pool = pool;
    this.log = [];
    this.strategy = factory();
    this.factory = factory;
  }

  choose(winnerId: string): void {
    const pair = this.strategy.nextPair();
    if (!pair) {
      return;
    }

    if (winnerId !== pair.left.id && winnerId !== pair.right.id) {
      throw new Error(`winnerId ${winnerId} does not match current pair`);
    }
    const comparison: Comparison = {
      leftId: pair.left.id,
      rightId: pair.right.id,
      winnerId,
    };
    this.log.push(comparison);
    this.strategy.submit(comparison);
  }

  undo(): void {
    this.log.pop();
    this.strategy = this.factory();
    for (const comparison of this.log) {
      this.strategy.submit(comparison);
    }
  }
}
