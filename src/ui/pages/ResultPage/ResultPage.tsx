import type { Ranking } from '@/domain/types';
import { Button } from '@/ui/components/Button/Button';

import styles from './ResultPage.module.scss';

interface Props {
  title: string;
  ranking: Ranking;
  onSave: () => void;
  onRestart: () => void;
  onExit: () => void;
}

/** 05.4 · Свой рейтинг — итог. */
export function ResultPage({ title, ranking, onSave, onRestart, onExit }: Props) {
  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Итог</h1>
        <button type="button" className={styles.close} aria-label="Закрыть" onClick={onExit}>
          ×
        </button>
      </header>

      <h2 className={styles.heading}>
        Твой <span className={styles.accent}>топ</span>
      </h2>
      <p className={styles.listTitle}>{title}</p>

      <ol className={styles.places}>
        {ranking.places.map((item, index) => (
          <li key={item.id} className={styles.place}>
            <span className={styles.number}>{index + 1}</span>
            <span className={styles.text}>
              <span className={styles.name}>{item.title}</span>
              {item.meta && <span className={styles.meta}>{item.meta}</span>}
            </span>
          </li>
        ))}
      </ol>

      <div className={styles.actions}>
        <Button onClick={onSave}>Сохранить</Button>
        <Button onClick={onRestart} variant="secondary">
          Сравнить заново
        </Button>
      </div>
    </main>
  );
}
