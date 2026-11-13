import { useState, type ReactNode } from 'react';

import { LocalStorageRatingDraftRepository } from '@/api/draft/LocalStorageRatingDraftRepository';
import { LocalStorageHistoryRepository } from '@/api/history/LocalStorageHistoryRepository';
import { MovieProvider } from '@/api/movies/MovieProvider';

import { DependenciesContext, type Dependencies } from './dependencies';

interface Props {
  children: ReactNode;
  value?: Dependencies;
}

export function DependenciesProvider({ children, value }: Props) {
  const [deps] = useState<Dependencies>(
    () =>
      value ?? {
        history: new LocalStorageHistoryRepository(),
        drafts: new LocalStorageRatingDraftRepository(),
        providers: {
          film: new MovieProvider(import.meta.env.VITE_API_URL),
        },
      },
  );

  return <DependenciesContext.Provider value={deps}>{children}</DependenciesContext.Provider>;
}
