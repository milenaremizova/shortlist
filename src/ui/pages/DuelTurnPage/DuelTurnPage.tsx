import { useState } from 'react';

import { otherPlayer } from '@/domain/duel/dice';
import type { DuelTurn } from '@/domain/duel/DuelSession';
import type { Participants } from '@/domain/duel/participant';
import { Avatar } from '@/ui/components/Avatar/Avatar';
import { ConfirmSheet } from '@/ui/components/ConfirmSheet/ConfirmSheet';
import { ItemCard } from '@/ui/components/ItemCard/ItemCard';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';
import { Toast } from '@/ui/components/Toast/Toast';
import { plural } from '@/ui/plural';

import styles from './DuelTurnPage.module.scss';

interface Props {
  turn: DuelTurn;
  participants: Participants;
  turnNumber: number;
  onChoose: (itemId: string) => void;
  onExit: () => void;
}

export function DuelTurnPage({ turn, participants, turnNumber, onChoose, onExit }: Props) {
  const [confirmExit, setConfirmExit] = useState(false);
  const me = participants[turn.player];
  const partner = participants[otherPlayer(turn.player)];
  const passed = turnNumber - 1;
  const missedMatch = passed >= 2;

  return (
    <main className={styles.screen}>
      <ScreenHeader title={`Пара ${turnNumber}`} onClose={() => setConfirmExit(true)} />

      {missedMatch && (
        <div className={styles.toast}>
          <Toast>Мэтч не случился — вот следующая пара</Toast>
        </div>
      )}

      <div className={styles.players}>
        <span className={styles.player}>
          <Avatar initial={me.initial} size="lg" />
          <span className={styles.playerText}>
            <span className={styles.playerName}>{me.name}</span>
            <span className={`${styles.playerHint} ${styles.playerHintAccent}`}>выбирает</span>
          </span>
        </span>
        <span className={styles.player}>
          <Avatar initial={partner.initial} tone="muted" size="lg" />
          <span className={styles.playerText}>
            <span className={styles.playerName}>{partner.name}</span>
            <span className={styles.playerHint}>{passed > 0 ? 'уже выбрал' : 'ждёт'}</span>
          </span>
        </span>
      </div>

      <h2 className={styles.heading}>
        Что выбираешь,
        <br />
        <span className={styles.accent}>{me.name}?</span>
      </h2>
      <p className={styles.lead}>
        {partner.name} не видит твой выбор. Совпадёте в выборе — раунд завершится сразу.
      </p>

      <div className={styles.pair}>
        <ItemCard item={turn.pair.left} onClick={() => onChoose(turn.pair.left.id)} />
        <span className={styles.or}>или</span>
        <ItemCard item={turn.pair.right} onClick={() => onChoose(turn.pair.right.id)} />
      </div>

      <p className={styles.footer}>
        Мэтча пока нет
        {passed > 0 && ` · позади ${passed} ${plural(passed, ['пара', 'пары', 'пар'])}`}
      </p>

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
