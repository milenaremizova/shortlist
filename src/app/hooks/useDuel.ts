import { useCallback, useState } from 'react';

import type { DuelResult, DuelSession, DuelTurn } from '@/domain/duel/DuelSession';
import { createDuelSession, type DuelSetup } from '@/domain/factories';
import type { Item } from '@/domain/types';

export interface DuelSnapshot {
  turn: DuelTurn | null;
  handoff: boolean;
  result: DuelResult | null;
  turnsTaken: number;
}

const EMPTY: DuelSnapshot = { turn: null, handoff: false, result: null, turnsTaken: 0 };

function snapshot(session: DuelSession, handoff: boolean): DuelSnapshot {
  return {
    turn: session.currentTurn(),
    handoff,
    result: session.result(),
    turnsTaken: session.turnsTaken(),
  };
}

export type CreateDuel = (pool: readonly Item[]) => DuelSetup;

export function useDuel(create: CreateDuel = createDuelSession) {
  const [setup, setSetup] = useState<DuelSetup | null>(null);
  const [state, setState] = useState<DuelSnapshot>(EMPTY);

  const start = useCallback(
    (pool: readonly Item[]) => {
      const duel = create(pool);
      setSetup(duel);
      setState(snapshot(duel.session, false));
    },
    [create],
  );

  const choose = useCallback(
    (itemId: string): DuelSnapshot | null => {
      if (setup === null) return null;

      setup.session.choose(itemId);
      const next = snapshot(setup.session, !setup.session.isComplete());
      setState(next);
      return next;
    },
    [setup],
  );
  const ready = useCallback(() => {
    setState((prev) => ({ ...prev, handoff: false }));
  }, []);

  return { roll: setup?.roll ?? null, ...state, start, choose, ready };
}
