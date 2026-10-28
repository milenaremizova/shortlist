import { useState, type ReactNode } from 'react';

import { LocalStorageHistoryRepository } from '@/api/history/LocalStorageHistoryRepository';

import { DependenciesContext, type Dependencies } from './dependencies';

interface Props {
  children: ReactNode;
  /** Для тестов: подставить свои зависимости вместо настоящих. */
  value?: Dependencies;
}

/** Composition root: здесь создаются настоящие реализации и раздаются вниз по дереву. */
export function DependenciesProvider({ children, value }: Props) {
  const [deps] = useState<Dependencies>(
    () =>
      value ?? {
        history: new LocalStorageHistoryRepository(),
        providers: {}, // TODO(этап 2): film: new MovieProvider()
      },
  );

  return <DependenciesContext.Provider value={deps}>{children}</DependenciesContext.Provider>;
}
