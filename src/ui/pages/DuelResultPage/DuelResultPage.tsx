import type { PlayerId } from '@/domain/duel/dice';
import type { DuelResult } from '@/domain/duel/DuelSession';
import type { Participants } from '@/domain/duel/participant';
import { Avatar } from '@/ui/components/Avatar/Avatar';
import { Button } from '@/ui/components/Button/Button';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';
import { plural } from '@/ui/plural';

import styles from './DuelResultPage.module.scss';

interface Props {
  result: DuelResult;
  participants: Participants;
  turnsTaken: number;
  onRestart: () => void;
  onExit: () => void;
  onAddToEvening?: () => void;
}

const ORDER: PlayerId[] = ['host', 'guest'];

export function DuelResultPage({
  result,
  participants,
  turnsTaken,
  onRestart,
  onExit,
  onAddToEvening,
}: Props) {
  const isMatch = result.kind === 'match';

  return (
    <main className={styles.screen}>
      <ScreenHeader title="Пара тапочек" onClose={onExit} />

      <h2 className={[styles.heading, isMatch ? styles.match : styles.miss].join(' ')}>
        {isMatch ? 'Совпали!' : 'Мимо!'}
      </h2>
      <p className={styles.lead}>
        {isMatch
          ? `Вы оба выбрали одно и то же — за ${turnsTaken} ${plural(turnsTaken, ['ход', 'хода', 'ходов'])}:`
          : 'Пары кончились, а общего не нашлось. Вот ваши фавориты:'}
      </p>

      <div className={styles.slippers} aria-hidden="true">
        <Tapochka size={110} />
        <span className={styles.between}>{isMatch ? '♥' : '?'}</span>
        <Tapochka size={110} palette="white" mirrored />
      </div>

      {result.kind === 'match' ? (
        <div className={styles.winner}>
          {result.item.tag && <span className={styles.tag}>{result.item.tag}</span>}
          <span className={styles.winnerTitle}>{result.item.title}</span>
          {result.item.meta && <span className={styles.meta}>{result.item.meta}</span>}
        </div>
      ) : (
        <ul className={styles.favorites}>
          {ORDER.map((id) => (
            <li key={id} className={styles.favorite}>
              <Avatar
                initial={participants[id].initial}
                tone={id === 'host' ? 'accent' : 'warm'}
                size="sm"
              />
              <span className={styles.favoriteText}>
                <span className={styles.favoriteLabel}>Фаворит · {participants[id].name}</span>
                <span className={styles.favoriteTitle}>{result.favorites[id].title}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {!isMatch && <p className={styles.hint}>Сыграйте ещё раз — пары перемешаются заново.</p>}

      <div className={styles.actions}>
        {isMatch ? (
          <>
            <Button onClick={onAddToEvening} disabled={!onAddToEvening}>
              + Добавить в вечер{!onAddToEvening && ' · скоро'}
            </Button>
            <Button variant="secondary" onClick={onRestart}>
              Ещё раз вдвоём
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onRestart}>↻ Ещё круг вдвоём</Button>
            <Button variant="secondary" onClick={onExit}>
              Выйти
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
