import { useState } from "react";
import { RankingSession } from "@/domain/RankingSession";
import { MergeSortStrategy } from "@/domain/strategies/MergeSortStrategy";
import { shuffle } from "@/domain/shuffle";
import type { Movie, Pair, SessionProgress } from "@/domain/types";

const identity = (movies: Movie[]): Movie[] => movies;

export function useRankingSession(pool: Movie[]) {
  const [session] = useState(() => {
    const shuffledPool = shuffle(pool);
    return new RankingSession(
      shuffledPool,
      () => new MergeSortStrategy(shuffledPool, identity),
    );
  });

  const [currentPair, setCurrentPair] = useState<Pair | null>(session.currentPair());
  const [progress, setProgress] = useState<SessionProgress>(session.progress());

  function syncState(): void {
    setCurrentPair(session.currentPair());
    setProgress(session.progress());
  }

  function chooseWinner(winnerId: string): void {
    session.choose(winnerId);
    syncState();
  }

  function undo(): void {
    session.undo();
    syncState();
  }

  return { currentPair, progress, chooseWinner, undo };
}