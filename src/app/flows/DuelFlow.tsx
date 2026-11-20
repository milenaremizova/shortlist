import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';

import { useDuel } from '@/app/hooks/useDuel';
import { useDependencies } from '@/app/providers/dependencies';
import type { DuelResult } from '@/domain/duel/DuelSession';
import type { PoolDraft } from '@/domain/types';
import { LOCAL_PARTICIPANTS } from '@/ui/duel/participants';
import { DicePage } from '@/ui/pages/DicePage/DicePage';
import { DuelHandoffPage } from '@/ui/pages/DuelHandoffPage/DuelHandoffPage';
import { DuelInvitePage } from '@/ui/pages/DuelInvitePage/DuelInvitePage';
import { DuelJoinPage } from '@/ui/pages/DuelJoinPage/DuelJoinPage';
import { DuelResultPage } from '@/ui/pages/DuelResultPage/DuelResultPage';
import { DuelTurnPage } from '@/ui/pages/DuelTurnPage/DuelTurnPage';
import { DuelWaitingPage } from '@/ui/pages/DuelWaitingPage/DuelWaitingPage';
import { PoolPage } from '@/ui/pages/PoolPage/PoolPage';

export function DuelFlow() {
  const navigate = useNavigate();
  const { history } = useDependencies();
  const duel = useDuel();
  const [draft, setDraft] = useState<PoolDraft | null>(null);
  const participants = LOCAL_PARTICIPANTS;

  function handleStart(next: PoolDraft) {
    setDraft(next);
    duel.start(next.items);
    navigate('/duel/dice');
  }

  function handleRestart() {
    if (draft === null) return;
    duel.start(draft.items);
    navigate('/duel/dice');
  }

  function handleExit() {
    navigate('/home');
  }

  function handleChoose(itemId: string) {
    const next = duel.choose(itemId);
    if (next?.result) {
      void saveResult(next.result);
      navigate('/duel/result', { replace: true });
    }
  }

  async function saveResult(result: DuelResult) {
    if (draft === null) return;
    const items =
      result.kind === 'match' ? [result.item] : [result.favorites.host, result.favorites.guest];
    try {
      await history.save({
        id: crypto.randomUUID(),
        mode: 'duel',
        createdAt: new Date().toISOString(),
        title: draft.title,
        items,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Routes>
      <Route index element={<Navigate to="invite" replace />} />
      <Route
        path="invite"
        element={
          <DuelInvitePage
            roomCode={null}
            onPlayHere={() => navigate('/duel/new')}
            onInvite={() => navigate('/duel/wait')}
            onJoin={() => navigate('/duel/join')}
            onBack={handleExit}
          />
        }
      />
      <Route
        path="new"
        element={
          <PoolPage
            onStart={handleStart}
            heading="Пара тапочек"
            titlePlaceholder="Что смотрим вдвоём"
            defaultTitle="Наша дуэль"
            submitLabel="Бросить кубик"
          />
        }
      />
      <Route
        path="dice"
        element={
          duel.roll && draft ? (
            <DicePage
              roll={duel.roll}
              participants={participants}
              subject="Фильм · на одном телефоне"
              onStart={() => navigate('/duel/play')}
              onExit={handleExit}
            />
          ) : (
            <Navigate to="/duel/invite" replace />
          )
        }
      />

      <Route
        path="play"
        element={
          duel.result ? (
            <Navigate to="/duel/result" replace />
          ) : duel.turn === null ? (
            <Navigate to="/duel/invite" replace />
          ) : duel.handoff ? (
            <DuelHandoffPage
              next={participants[duel.turn.player]}
              turnNumber={duel.turnsTaken}
              onReady={duel.ready}
              onExit={handleExit}
            />
          ) : (
            <DuelTurnPage
              turn={duel.turn}
              participants={participants}
              turnNumber={duel.turnsTaken + 1}
              onChoose={handleChoose}
              onExit={handleExit}
            />
          )
        }
      />
      <Route
        path="result"
        element={
          duel.result ? (
            <DuelResultPage
              result={duel.result}
              participants={participants}
              turnsTaken={duel.turnsTaken}
              onRestart={handleRestart}
              onExit={handleExit}
            />
          ) : (
            <Navigate to="/duel/invite" replace />
          )
        }
      />
      <Route
        path="join"
        element={
          <DuelJoinPage
            onJoin={() => navigate('/duel/wait')}
            onBack={() => navigate('/duel/invite')}
          />
        }
      />
      <Route
        path="wait"
        element={
          <DuelWaitingPage
            roomCode="4827"
            myInitial={participants.host.initial}
            onCancel={() => navigate('/duel/invite')}
          />
        }
      />
    </Routes>
  );
}
