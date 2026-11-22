import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { useHistory } from '@/app/hooks/useHistory';
import duelIcon from '@/ui/assets/icons/duel-icon.svg';
import eveningIcon from '@/ui/assets/icons/evening-icon.svg';
import ratingIcon from '@/ui/assets/icons/rating-icon.svg';
import starIcon from '@/ui/assets/icons/start-icon.svg';
import { BottomNav } from '@/ui/components/BottomNav/BottomNav';
import { Separator } from '@/ui/components/Separator/Separator';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';
import { summary } from '@/ui/history/formatHistory';

import styles from './HomePage.module.scss';

export function HomePage() {
  const { entries } = useHistory();
  const last = entries[0];

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          <Tapochka size={30} />
        </span>
        <span className={styles.greeting}>
          <span className={styles.hello}>Привет!</span>
          <span className={styles.question}>Готовы к вечеру?</span>
        </span>
        <button type="button" className={styles.bell} aria-label="Уведомления" disabled>
          <svg width="16" height="17" viewBox="0 0 16 17" aria-hidden="true">
            <path
              d="M8 1.5a4.5 4.5 0 0 0-4.5 4.5v3.5L2 12.5h12l-1.5-3V6A4.5 4.5 0 0 0 8 1.5ZM6.3 14.5a1.8 1.8 0 0 0 3.4 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <h1 className={styles.title}>
        Что <img className={styles.star} src={starIcon} alt="" width={26} height={26} />
        <br />
        делаем?
      </h1>

      <ModeCard
        className={styles.evening}
        badge="3 раунда"
        icon={eveningIcon}
        title="Собрать вечер"
        text="Фильм, еда и напитки — по очереди, пара тапов на каждое."
      />

      <div className={styles.row}>
        <ModeCard
          className={styles.duel}
          to="/duel"
          icon={duelIcon}
          title="Пара тапочек"
          text="Выбираете вдвоём вслепую, пока не совпадёте"
        />
        <ModeCard
          className={styles.rating}
          to="/rating/new"
          title="Свой рейтинг"
          icon={ratingIcon}
          text="Расставь любые фильмы по местам"
        />
      </div>

      {last && (
        <Link to="/history" className={styles.last}>
          <span className={styles.lastLabel}>Прошлый выбор</span>
          <span className={styles.lastTitle}>
            {last.title}
            <Separator />
            {summary(last)}
          </span>
        </Link>
      )}

      <BottomNav />
    </main>
  );
}

interface ModeCardProps {
  className: string;
  title: string;
  text: string;
  icon?: string;
  badge?: string;
  to?: string;
}

function ModeCard({ className, title, text, icon, badge, to }: ModeCardProps) {
  const label = badge;

  const content: ReactNode = (
    <>
      {label && <span className={styles.badge}>{label}</span>}
      {icon && <img className={styles.icon} src={icon} alt="" width={60} height={44} />}
      <span className={styles.cardTitle}>{title}</span>
      <span className={styles.cardText}>{text}</span>
    </>
  );

  return to ? (
    <Link to={to} className={`${styles.card} ${className}`}>
      {content}
    </Link>
  ) : (
    <div className={`${styles.card} ${styles.soon} ${className}`} aria-disabled="true">
      {content}
    </div>
  );
}
