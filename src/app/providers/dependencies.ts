import { createContext, useContext } from 'react';

import type { RatingDraftRepository } from '@/api/draft/RatingDraftRepository';
import type { HistoryRepository } from '@/api/history/HistoryRepository';
import type { ItemProvider } from '@/api/ItemProvider';
import type { ItemCategory } from '@/domain/types';

export interface Dependencies {
  history: HistoryRepository;
  providers: Partial<Record<ItemCategory, ItemProvider>>;
}

export const DependenciesContext = createContext<Dependencies | null>(null);

export function useDependencies(): Dependencies {
  const deps = useContext(DependenciesContext);
  if (deps === null) {
    throw new Error('useDependencies: оберни приложение в <DependenciesProvider>');
  }
  return deps;
}

export interface Dependencies {
  history: HistoryRepository;
  drafts: RatingDraftRepository;
  providers: Partial<Record<ItemCategory, ItemProvider>>;
}
