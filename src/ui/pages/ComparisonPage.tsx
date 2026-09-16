import { useRankingSession } from "@/app/hooks/useRankingSession";
import type { Movie } from "@/domain/types";

interface ComparisonPageProps {
  pool: Movie[];
}

export function ComparisonPage({ pool }: ComparisonPageProps) {
  const { currentPair, progress, chooseWinner, undo } = useRankingSession(pool);

  if (currentPair === null) {
    return <p>Сессия завершена</p>;
  }

  return (
    <div>
      <p>
        {progress.done} из ~{progress.estimated}
      </p>
      <p>Какой лучше?</p>

      <div>
        <p>{currentPair.left.title}</p>
        <p>{currentPair.left.year}</p>
        <button onClick={() => chooseWinner(currentPair.left.id)}>
          Выбрать
        </button>
      </div>

      <div>
        <p>{currentPair.right.title}</p>
        <p>{currentPair.right.year}</p>
        <button onClick={() => chooseWinner(currentPair.right.id)}>
          Выбрать
        </button>
      </div>

      <div>
        <button onClick={() => undo()} disabled={progress.done === 0}>
          Отменить
        </button>
      </div>
    </div>
  );
}
