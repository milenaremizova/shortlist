import type { RankingStrategy } from "./RankingStrategy";
import type { Comparison, Movie, Pair, Ranking } from "../types";

interface MergeState {
  left: Movie[];
  right: Movie[];
  merged: Movie[];
}

export class MergeSortStrategy implements RankingStrategy {
  private runs: Movie[][];
  private mergeState: MergeState | null; // null - слияние не начато

  constructor(pool: Movie[]) {
    this.runs = this.shuffle(pool).map((movie) => [movie]);
    this.mergeState = null;
  }

  private shuffle(movies: Movie[]): Movie[] {
    const result = [...movies];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  nextPair(): Pair | null {
    if (this.mergeState !== null) {
      // деструктуризация
      const { left, right } = this.mergeState;
      return { left: left[0], right: right[0] };
    }

    if (this.runs.length >= 2) {
      const left = this.runs[0];
      const right = this.runs[1];
      this.mergeState = {
        left,
        right,
        merged: [],
      };
      return {
        left: left[0],
        right: right[0],
      };
    }
    return null;
  }

  submit(comparison: Comparison): void {
    if (this.mergeState === null) return;

    if (this.mergeState.left[0].id === comparison.winnerId) {
      const winner = this.mergeState.left.shift();
      this.mergeState.merged.push(winner);
    } else if (this.mergeState.right[0].id === comparison.winnerId) {
      const winner = this.mergeState.right.shift();
      this.mergeState.merged.push(winner);
    }

    if (this.mergeState.left.length === 0) {
      this.mergeState.merged.push(...this.mergeState.right);
      this.runs.splice(0, 2, this.mergeState.merged);
      this.mergeState = null;
    } else if (this.mergeState.right.length === 0) {
      this.mergeState.merged.push(...this.mergeState.left);
      this.runs.splice(0, 2, this.mergeState.merged);
      this.mergeState = null;
    }
  }

  getRanking(): Ranking {
    if (this.runs.length === 1) {
      return {
        places: this.runs[0],
        isFinal: true,
      };
    }
    return {
      places: this.runs.flat(),
      isFinal: false,
    };
  }

  estimateTotal(): number {
    const totalParts = this.runs.reduce((sum, run) => sum + run.length, 0);
    return Math.ceil((totalParts * Math.log(totalParts)) / Math.log(2));
  }

  isComplete(): boolean {
    return this.runs.length === 1;
  }
}
