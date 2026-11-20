import { Avatar } from '@/ui/components/Avatar/Avatar';
import { Button } from '@/ui/components/Button/Button';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';

import styles from './DuelWaitingPage.module.scss';

interface Props {
  roomCode: string;
  myInitial: string;
  partnerName?: string;
  onCancel: () => void;
}

export function DuelWaitingPage({ roomCode, myInitial, partnerName, onCancel }: Props) {
  return (
    <main className={styles.screen}>
      <ScreenHeader title="Пара тапочек" onClose={onCancel} />

      <span className={styles.codePill}>Код комнаты {roomCode}</span>

      <section className={styles.center}>
        <div className={styles.avatars}>
          <Avatar initial={myInitial} size="lg" />
          <Tapochka size={40} />
          <Avatar initial="?" tone="muted" size="lg" />
        </div>

        <h2 className={styles.heading}>Ждём {partnerName ?? 'напарника'}…</h2>
        <p className={styles.lead}>Приглашение отправлено. Как только напарник зайдёт — начнём.</p>
        <span className={styles.spinner} role="status" aria-label="Ждём" />
      </section>

      <Button variant="secondary" onClick={onCancel}>
        Отменить
      </Button>
    </main>
  );
}
