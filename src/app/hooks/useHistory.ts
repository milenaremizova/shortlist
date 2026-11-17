import { useCallback, useEffect, useState } from 'react';

import type { HistoryEntry } from '@/api/history/HistoryRepository';
import { useDependencies } from '@/app/providers/dependencies';

export type HistoryStatus = 'loading' | 'ready' | 'error';

export function useHistory() {
  const { history } = useDependencies();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [status, setStatus] = useState<HistoryStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    history
      .list()
      .then((list) => {
        if (cancelled) return;
        setEntries(list);
        setStatus('ready');
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(error);
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [history]);

  const removeEntry = useCallback(
    async (id: string): Promise<void> => {
      await history.remove(id);
      setEntries((prev) => prev.filter((x) => x.id !== id));
    },
    [history],
  );

  return { entries, status, removeEntry };
}
