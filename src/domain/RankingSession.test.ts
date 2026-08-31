import { describe, it, expect } from "vitest";
import { RankingSession } from "./RankingSession";
import type { RankingStrategy } from "./RankingStrategy";
import type { Pair, Comparison, Ranking, Movie } from "./types";

class FakeStrategy implements RankingStrategy {
  private pairs: Pair[];
  private index = 0;

  constructor(pairs: Pair[]) {
    this.pairs = pairs;
  }

  nextPair(): Pair | null {
    return this.pairs[this.index] ?? null;
  }

  submit(comparison: Comparison): void {
    this.index++;
  }

  getRanking(): Ranking {
    return { places: [], isFinal: this.isComplete() };
  }

  estimateTotal(): number {
    return this.pairs.length;
  }

  isComplete(): boolean {
    return this.index >= this.pairs.length;
  }
}

function makeMovie(id: string): Movie {
  return { id, title: id, year: 2020, posterUrl: null };
}

describe("RankingSession", () => {
  it("отдаёт первую пару из стратегии сразу после создания", () => {
    // Arrange
    const a = makeMovie("a");
    const b = makeMovie("b");
    const pair: Pair = { left: a, right: b };
    const session = new RankingSession([a, b], () => new FakeStrategy([pair]));

    // Act
    const current = session.currentPair();

    // Assert
    expect(current).toEqual(pair);
  });
});

describe("Ranking session", () => {
  it("после choose с валидным winnerId текущая пара должна смениться на следующую из списка", () => {
    // Arrange
    const a = makeMovie("a");
    const b = makeMovie("b");
    const c = makeMovie("c");
    const pairA: Pair = { left: a, right: b };
    const pairB: Pair = { left: b, right: c };
    const session = new RankingSession(
      [a, b],
      () => new FakeStrategy([pairA, pairB]),
    );

    // act
    session.choose(pairA.left.id);
    const current = session.currentPair();

    // assert
    expect(current).toEqual(pairB);
  });
});
