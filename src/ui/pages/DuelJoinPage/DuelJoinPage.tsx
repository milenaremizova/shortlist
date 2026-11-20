import { useState } from 'react';

import { Button } from '@/ui/components/Button/Button';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';

import styles from './DuelJoinPage.module.scss';

export const CODE_LENGTH = 4;

interface Props {
  onJoin: (code: string) => void;
  onBack: () => void;
  error?: string;
}

export function DuelJoinPage({ onJoin, onBack, error }: Props) {
  const [code, setCode] = useState('');
  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => code[i] ?? '');

  return (
    <main className={styles.screen}>
      <ScreenHeader title="Пара тапочек" onBack={onBack} />

      <h2 className={styles.heading}>
        Введи{' '}
        <span className={styles.pair} aria-hidden="true">
          <Tapochka size={34} />
          <Tapochka size={34} palette="white" mirrored />
        </span>
        <br />
        <span className={styles.accent}>код</span>
      </h2>
      <p className={styles.lead}>
        Напарник видит {CODE_LENGTH} цифры у себя на экране «Выбор на двоих».
      </p>

      <label className={styles.cells}>
        <span className={styles.visuallyHidden}>Код комнаты</span>
        <input
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={CODE_LENGTH}
          autoFocus
        />
        {digits.map((digit, i) => (
          <span
            key={i}
            className={[styles.cell, i === code.length && styles.cellActive]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {digit}
          </span>
        ))}
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Button
        className={styles.submit}
        disabled={code.length < CODE_LENGTH}
        onClick={() => onJoin(code)}
      >
        Присоединиться
      </Button>
    </main>
  );
}
