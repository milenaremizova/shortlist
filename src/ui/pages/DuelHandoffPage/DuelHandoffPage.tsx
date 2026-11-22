import { useState } from 'react';

import type { Participant } from '@/domain/duel/participant';
import type { Item } from '@/domain/types';
import { Avatar } from '@/ui/components/Avatar/Avatar';
import { Button } from '@/ui/components/Button/Button';
import { ConfirmSheet } from '@/ui/components/ConfirmSheet/ConfirmSheet';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';

import styles from './DuelHandoffPage.module.scss';

interface Props {
  next: Participant;
  turnNumber: number;
  /**
   * Онлайн: свой выбор, который показываем, пока ждём напарника.
   * На одном телефоне не передаём - следующий игрок не должен его увидеть.
   */
  pick?: Item;
  /** Есть — на одном телефоне: кнопка «готов». Нет — онлайн: ждём напарника. */
  onReady?: () => void;
  onExit: () => void;
}

export function DuelHandoffPage({ next, turnNumber, pick, onReady, onExit }: Props) {
  const [confirmExit, setConfirmExit] = useState(false);

  return (
    <main className={styles.screen}>
      <ScreenHeader title={`Пара ${turnNumber}`} onClose={() => setConfirmExit(true)} />

      <h2 className={styles.heading}>
        Выбор
        <br />
        <span className={styles.accent}>принят</span>
      </h2>

      {pick ? (
        <div className={styles.pick}>
          <span className={styles.pickTitle}>{pick.title}</span>
          {pick.meta && <span className={styles.pickMeta}>{pick.meta}</span>}
        </div>
      ) : (
        <div className={styles.hero}>
          <Tapochka size={150} />
        </div>
      )}

      <section className={styles.next}>
        <Avatar initial={next.initial} size="lg" />
        <p className={styles.lead}>
          {onReady ? (
            <>
              Передай телефон: ходит <strong>{next.name}</strong>.
              <br />
              Не подглядывайте друг к другу!
            </>
          ) : (
            <>
              Ждём выбор <strong>{next.name}</strong>…
            </>
          )}
        </p>
      </section>

      {onReady ? (
        <Button className={styles.submit} onClick={onReady}>
          Продолжить
        </Button>
      ) : (
        <span className={styles.spinner} role="status" aria-label="Ждём" />
      )}

      {confirmExit && (
        <ConfirmSheet
          title="Выйти из пары?"
          text="Пройденные раунды не сохранятся."
          confirmLabel="Выйти"
          cancelLabel="Остаться"
          onConfirm={onExit}
          onCancel={() => setConfirmExit(false)}
        />
      )}
    </main>
  );
}
