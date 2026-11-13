import { useCallback, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';

import { useDependencies } from '@/app/providers/dependencies';
import type { PoolDraft, Ranking } from '@/domain/types';
import { ComparisonPage } from '@/ui/pages/ComparisonPage/ComparisonPage';
import { PoolPage } from '@/ui/pages/PoolPage/PoolPage';
import { ResultPage } from '@/ui/pages/ResultPage/ResultPage';

/** «Свой рейтинг»: пул -> сравнение -> итог. Хранит данные между шагами и решает, куда идти. */
export function RatingFlow() {
  const navigate = useNavigate();
  const { history, drafts } = useDependencies();
  const [saved] = useState(() => drafts.load());
  const [draft, setDraft] = useState<PoolDraft | null>(
    saved ? { title: saved.title, items: saved.items } : null,
  );
  const [ranking, setRanking] = useState<Ranking | null>(saved ? saved.ranking : null);

  function handleStart(next: PoolDraft) {
    drafts.save({ ...next, ranking: null });
    setDraft(next);
    navigate('/rating/compare');
  }

  const handleDone = useCallback(
    (result: Ranking) => {
      if (draft) drafts.save({ ...draft, ranking: result });
      setRanking(result);
      navigate('/rating/result', { replace: true });
    },
    [navigate, draft, drafts],
  );

  function handleRestart() {
    if (draft) drafts.save({ ...draft, ranking: null });
    setRanking(null);
    navigate('/rating/compare');
  }

  function handleExit() {
    drafts.clear();
    navigate('/home');
  }

  async function handleSave(): Promise<void> {
    if (!draft || !ranking) throw new Error('Нечего сохранять');

    await history.save({
      id: crypto.randomUUID(),
      mode: 'rating',
      createdAt: new Date().toISOString(),
      title: draft.title,
      items: ranking.places,
    });
  }

  return (
    <Routes>
      <Route index element={<Navigate to="new" replace />} />
      <Route path="new" element={<PoolPage onStart={handleStart} />} />
      <Route
        path="compare"
        element={
          draft ? (
            <ComparisonPage items={draft.items} onDone={handleDone} onExit={handleExit} />
          ) : (
            <Navigate to="/rating/new" replace />
          )
        }
      />
      <Route
        path="result"
        element={
          ranking && draft ? (
            <ResultPage
              title={draft.title}
              ranking={ranking}
              onSave={handleSave}
              onRestart={handleRestart}
              onExit={handleExit}
            />
          ) : (
            <Navigate to="/rating/new" replace />
          )
        }
      />
    </Routes>
  );
}
