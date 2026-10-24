import { useNavigate } from 'react-router';

import { Button } from '@/ui/components/Button/Button';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';

import styles from './WelcomePage.module.scss';

/** 01.2 · Приветствие. В v1 без аккаунтов: одна кнопка «Начать». */
export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.logo}>shortlist.</span>
        <span className={styles.tagline}>досуг без напряга</span>
      </header>

      <h1 className={styles.title}>
        Вечер
        <br />
        без мук
        <br />
        <span className={styles.accent}>выбора.</span>
      </h1>

      <Tapochka className={styles.mascot} size={220} />

      <p className={styles.lead}>
        Кино, ужин и напитки — пара тапов, и решено. Не договоритесь — выбирайте вдвоём вслепую.
      </p>

      <Button onClick={() => navigate('/home')}>Начать</Button>
    </main>
  );
}
