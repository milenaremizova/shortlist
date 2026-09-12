import { describe, it, expect } from "vitest";
import { MergeSortStrategy } from "./MergeSortStrategy";
import type { Movie } from "../types";

const identity = (movies: Movie[]): Movie[] => movies;

function makeMovie(id: string): Movie {
  return { id, title: id, year: 2020, posterUrl: null };
}

describe("MergeqSortStrategy", () => {
  it("на старте отдаёт пару из первых двух фильмов пула", () => {
    // Arrange
    const a = makeMovie("a");
    const b = makeMovie("b");
    const c = makeMovie("c");
    const strategy = new MergeSortStrategy([a, b, c], identity);

    // Act
    const pair = strategy.nextPair();

    // Assert
    expect(pair).toEqual({ left: a, right: b });
  });

  it("следующая пара после первого раунда", () => {
    const a = makeMovie("a");
    const b = makeMovie("b");
    const c = makeMovie("c");
    const strategy = new MergeSortStrategy([a, b, c], identity);

    const pairAB = strategy.nextPair();
    const submit = strategy.submit({
      leftId: a.id,
      rightId: b.id,
      winnerId: a.id,
    });
    const pairAC = strategy.nextPair();

    expect(pairAC).toEqual({ left: a, right: c });
  });

  it("сортировка 4ых фильмов до конца", () => {
    // Arrange
    const a = makeMovie("a");
    const b = makeMovie("b");
    const c = makeMovie("c");
    const d = makeMovie("d");
    const strategy = new MergeSortStrategy([a, b, c, d], identity);

    // Act
    let pair = strategy.nextPair();
    while (pair !== null) {
      strategy.submit({
        leftId: pair.left.id,
        rightId: pair.right.id,
        winnerId: pair.left.id,
      });
      pair = strategy.nextPair();
    }

    // Assert
    expect(strategy.getRanking()).toEqual({
      places: [a, b, c, d],
      isFinal: true,
    });
    expect(strategy.isComplete()).toBe(true);
  });
  it("верно сортирует нечетное число фильмов", () => {
    // Arrange
    const a = makeMovie("a");
    const b = makeMovie("b");
    const c = makeMovie("c");
    const d = makeMovie("d");
    const e = makeMovie("e");
    const strategy = new MergeSortStrategy([a, b, c, d, e], identity);

    // Act
    let pair = strategy.nextPair();
    while (pair !== null) {
      strategy.submit({
        leftId: pair.left.id,
        rightId: pair.right.id,
        winnerId: pair.left.id,
      });
      pair = strategy.nextPair();
    }

    // Assert
    expect(strategy.getRanking()).toEqual({
      places: [a, b, c, d, e],
      isFinal: true,
    });
    expect(strategy.isComplete()).toBe(true);
  });
});
