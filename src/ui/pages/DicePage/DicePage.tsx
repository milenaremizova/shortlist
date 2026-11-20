import type { DiceRoll, PlayerId } from '@/domain/duel/dice';
import type { Participants } from '@/domain/duel/participant';
import { Avatar } from '@/ui/components/Avatar/Avatar';
import { Button } from '@/ui/components/Button/Button';
import { PixelDie } from '@/ui/components/PixelDie/PixelDie';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';

import styles from './DicePage.module.scss';

interface Props {
  roll: DiceRoll;
  participants: Participants;
  subject: string;
  onStart: () => void;
  onExit: () => void;
}

const ORDER: PlayerId[] = ['host', 'guest'];

export function DicePage({ roll, participants, subject, onStart, onExit }: Props) {
  return (
    <main className={styles.screen}>
      <ScreenHeader title="Пара тапочек" onClose={onExit} />

      <h2 className={styles.heading}>
        Кто
        <br />
        <span className={styles.accent}>первый?</span>
      </h2>
      <p className={styles.lead}>Бросили кубики за вас обоих — у кого больше, тот и начинает.</p>

      <div className={styles.players}>
        {ORDER.map((id) => {
          const first = id === roll.starter;
          return (
            <div key={id} className={styles.player}>
              <PixelDie
                value={roll[id]}
                palette={id === 'host' ? 'white' : 'lavender'}
                size={88}
                className={styles.die}
              />
              <Avatar initial={participants[id].initial} tone={first ? 'accent' : 'muted'} />
              <span className={styles.name}>{participants[id].name}</span>
              <span className={first ? styles.badgeFirst : styles.badge}>
                {first ? 'Ходит первым' : 'Второй ход'}
              </span>
            </div>
          );
        })}
      </div>

      <p className={styles.subject}>
        <span className={styles.subjectLabel}>Что выбираем</span>
        {subject}
      </p>

      <Button className={styles.submit} onClick={onStart}>
        → Начать
      </Button>
    </main>
  );
}
