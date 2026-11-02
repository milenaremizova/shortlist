import { useEffect } from 'react';

import { useRatingSession } from '@/app/hooks/useChoiceSession';
import type { Item, Ranking } from '@/domain/types';
import { ItemCard } from '@/ui/components/ItemCard/ItemCard';

import styles from './ComparisonPage.module.scss';

interface Props {
  items: Item[];
  onDone: (ranking: Ranking) => void;
  onExit: () => void;
}

export function ComparisonPage({ items, onDone, onExit }: Props) {
  const { pair, progress, canUndo, isComplete, result, choose, undo } = useRatingSession(items);

  useEffect(() => {
    if (isComplete) onDone(result);
  }, [isComplete, result, onDone]);

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>Сравнение</h1>
        <button type="button" className={styles.close} aria-label="Выйти" onClick={onExit}>
          ×
        </button>
      </header>

      <p className={styles.progress}>
        Пара {progress.done + 1} из ~{progress.estimated}
      </p>

      <h2 className={styles.question}>
        Что хочется
        <br />
        больше?
      </h2>
      <p className={styles.lead}>Необходимо выбрать один вариант. Из ответов соберётся топ.</p>
      {pair && (
        <div className={styles.pair}>
          <ItemCard item={pair.left} onClick={() => choose(pair.left.id)} />
          <span className={styles.or}>или</span>
          <ItemCard item={pair.right} onClick={() => choose(pair.right.id)} />
        </div>
      )}
      <footer className={styles.footer}>
        <p className={styles.hint}>Нажми на карточку</p>
        {canUndo && (
          <button type="button" className={styles.undo} onClick={undo}>
            Отменить выбор
          </button>
        )}
      </footer>
    </main>
  );
}
