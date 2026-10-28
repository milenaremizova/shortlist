import { createContext, useContext } from 'react';

import type { HistoryRepository } from '@/api/history/HistoryRepository';
import type { ItemProvider } from '@/api/ItemProvider';
import type { ItemCategory } from '@/domain/types';

/**
 * Всё, что приходит «снаружи» домена: источники вариантов и хранилища.
 * Компоненты берут зависимости отсюда, а не создают их сами (Dependency Injection),
 * поэтому в тестах и сторибуке их можно подменить фейками.
 */
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
