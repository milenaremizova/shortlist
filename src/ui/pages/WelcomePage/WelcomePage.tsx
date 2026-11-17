import { useNavigate } from 'react-router';

import roundIcon from '@/ui/assets/icons/round-icon.png';
import { Button } from '@/ui/components/Button/Button';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';

import styles from './WelcomePage.module.scss';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.logo}>shortlist.</span>
        <span className={styles.tagline}>досуг без напряга</span>
      </header>

      <div className={styles.hero}>
        <h1 className={styles.title}>
          Вечер
          <br />
          без мук
          <br />
          <span className={styles.accent}>выбора.</span>
        </h1>
        <Sparkle className={styles.starBig} />
      </div>

      <div className={styles.stage}>
        <img className={styles.circle} src={roundIcon} alt="" />
        <Tapochka className={styles.mascot} size={280} />
        <Sparkle className={styles.starSmall} />
        <p className={styles.bubble}>Привет! Я Тапочка — помогу выбрать, чем занять вечер.</p>
      </div>

      <p className={styles.lead}>
        Кино, ужин, напитки — выбирай одно из двух, а Тапочка соберёт то, что подходит тебе.
      </p>

      <Button onClick={() => navigate('/home')}>Начать</Button>
    </main>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 26 26" aria-hidden="true">
      <path
        d="M13 0C14.08 8.67 17.33 11.92 26 13C17.33 14.08 14.08 17.33 13 26C11.92 17.33 8.67 14.08 0 13C8.67 11.92 11.92 8.67 13 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
