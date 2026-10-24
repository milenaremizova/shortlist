import { useCallback, useState } from 'react';
import type { ChoiceSession } from '@/domain/ChoiceSession';
import { createRatingSession } from '@/domain/factories';
import type { Item, Pair, Ranking, SessionProgress } from '@/domain/types';

/** Снимок сессии для рендера: React перерисовывает экран, когда меняется снимок. */
export interface SessionSnapshot {
  pair: Pair | null;
  progress: SessionProgress;
  canUndo: boolean;
  isComplete: boolean;
  result: Ranking;
}

function snapshot(session: ChoiceSession): SessionSnapshot {
  return {
    pair: session.currentPair(),
    progress: session.progress(),
    canUndo: session.canUndo(),
    isComplete: session.isComplete(),
    result: session.result(),
  };
}

/**
 * Мост между доменом и React для любого режима: работает с интерфейсом ChoiceSession,
 * поэтому экран сравнения один на «Свой рейтинг», вечер и дуэль.
 */
export function useChoiceSession(create: () => ChoiceSession) {
  // ленивый инициализатор: сессия создаётся один раз, а не на каждый рендер
  const [session] = useState(create);
  const [state, setState] = useState(() => snapshot(session));

  const choose = useCallback(
    (winnerId: string) => {
      session.choose(winnerId);
      setState(snapshot(session));
    },
    [session],
  );

  const undo = useCallback(() => {
    session.undo();
    setState(snapshot(session));
  }, [session]);

  return { ...state, choose, undo };
}

/** «Свой рейтинг»: пул перемешивается один раз при создании сессии. */
export function useRatingSession(pool: readonly Item[]) {
  return useChoiceSession(() => createRatingSession(pool));
}
