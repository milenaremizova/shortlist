import { Link } from 'react-router';

import { useHistory } from '@/app/hooks/useHistory';
import { BottomNav } from '@/ui/components/BottomNav/BottomNav';
import { Tapochka } from '@/ui/components/Tapochka/Tapochka';
import { dayParts, groupByMonth, MODE_LABEL, summary } from '@/ui/history/formatHistory';

import styles from './HistoryPage.module.scss';

export function HistoryPage() {
  const { entries, status } = useHistory();

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>Вечера</h1>

      {status === 'loading' && <p className={styles.note}>Загружаю…</p>}

      {status === 'error' && (
        <p className={styles.note}>Не получилось загрузить историю. Попробуй обновить страницу.</p>
      )}

      {status === 'ready' && entries.length === 0 && (
        <div className={styles.empty}>
          <Tapochka palette="butter" size={140} />
          <p>Здесь появится всё, что ты выберешь и сохранишь.</p>
          <Link to="/rating/new" className={styles.emptyLink}>
            Собрать первый рейтинг
          </Link>
        </div>
      )}

      {status === 'ready' &&
        groupByMonth(entries).map((group) => (
          <section key={group.key} className={styles.month}>
            <h2 className={styles.monthTitle}>{group.label}</h2>
            <ul className={styles.list}>
              {group.entries.map((entry) => {
                const date = dayParts(entry.createdAt);
                return (
                  <li key={entry.id} className={styles.entry}>
                    <span className={styles.date}>
                      <span className={styles.day}>{date.day}</span>
                      <span className={styles.dayMonth}>{date.month}</span>
                    </span>
                    <span className={styles.text}>
                      <span className={styles.entryTitle}>{entry.title}</span>
                      <span className={styles.meta}>
                        {MODE_LABEL[entry.mode]} · {summary(entry)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

      <BottomNav />
    </main>
  );
}
