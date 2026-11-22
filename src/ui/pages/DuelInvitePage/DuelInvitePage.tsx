import { Button } from '@/ui/components/Button/Button';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';

import styles from './DuelInvitePage.module.scss';

interface Props {
  /** Код комнаты; null, онлайна в разработке, игра на одном телефоне. */
  roomCode: string | null;
  onPlayHere: () => void;
  onInvite: () => void;
  onJoin: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  { id: 'film', label: 'Фильм', available: true },
  { id: 'food', label: 'Еда', available: false },
  { id: 'drink', label: 'Напитки', available: false },
];

export function DuelInvitePage({ roomCode, onPlayHere, onInvite, onJoin, onBack }: Props) {
  const online = roomCode !== null;

  return (
    <main className={styles.screen}>
      <ScreenHeader title="Пара тапочек" onBack={onBack} />

      <h2 className={styles.heading}>
        Выбор{' '}
        <span className={styles.pair} aria-hidden="true">
          <Tapochka size={76} />
          <Tapochka size={76} palette="white" mirrored />
        </span>
        <br />
        <span className={styles.accent}>на двоих</span>
      </h2>
      <p className={styles.lead}>
        Ходите по очереди вслепую: каждый видит выбор напарника рядом с новым вариантом. Выбрали
        одно и то же — совпали, выбор сделан.
      </p>

      <section className={styles.section}>
        <div className={styles.chips}>
          {CATEGORIES.map((category) => (
            <span
              key={category.id}
              className={[styles.chip, category.available && styles.chipActive]
                .filter(Boolean)
                .join(' ')}
              aria-disabled={!category.available}
            >
              {category.label}
              {!category.available && <span className={styles.soon}>скоро</span>}
            </span>
          ))}
        </div>
      </section>

      {online && (
        <section className={styles.code}>
          <span className={styles.codeLabel}>Код комнаты</span>
          <span className={styles.codeValue}>{roomCode}</span>
          <span className={styles.codeHint}>Напарник вводит код в «Пара тапочек» на главной</span>
        </section>
      )}
      {!online && (
        <section className={styles.code}>
          <span className={styles.codeLabel}>Как играть?</span>
          <ol className={styles.steps}>
            <li>Соберите варианты — 3 и больше</li>
            <li>Кубики разыграют первый ход</li>
            <li>Выбирайте по очереди и передавайте телефон</li>
            <li>Выбрали одно и то же — мэтч!</li>
          </ol>
        </section>
      )}

      <div className={styles.actions}>
        {!online && <Button onClick={onPlayHere}>Играть на одном телефоне</Button>}
        <Button variant={online ? 'primary' : 'secondary'} onClick={onInvite} disabled={!online}>
          Позвать напарника{!online && ' · скоро'}
        </Button>
        <Button variant="secondary" onClick={onJoin} disabled={!online}>
          Ввести код напарника{!online && ' · скоро'}
        </Button>
      </div>
    </main>
  );
}
