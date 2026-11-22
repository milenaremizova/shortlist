import { useId, useState } from 'react';
import { useNavigate } from 'react-router';

import { useItemSearch } from '@/app/hooks/useItemSearch';
import { MAX_POOL, MIN_POOL, usePool } from '@/app/hooks/usePool';
import type { Item, PoolDraft } from '@/domain/types';
import { Button } from '@/ui/components/Button/Button';
import { ScreenHeader } from '@/ui/components/ScreenHeader/ScreenHeader';

import styles from './PoolPage.module.scss';

interface Props {
  onStart: (draft: PoolDraft) => void;
  heading?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  defaultTitle?: string;
  submitLabel?: string;
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4L19 9l-4-4L4 16v4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PoolPage({
  onStart,
  heading = 'Новый рейтинг',
  titleLabel = 'Название',
  titlePlaceholder = 'Что посмотреть на неделе',
  defaultTitle = 'Мой рейтинг',
  submitLabel = 'Сравнить',
}: Props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const pool = usePool();
  const search = useItemSearch('film');
  const titleId = useId();
  const searchId = useId();
  const hintId = useId();

  function handlePick(item: Item) {
    pool.add(item);
    search.setQuery('');
  }

  function handleStart() {
    onStart({ items: pool.items, title: title.trim() || defaultTitle });
  }

  return (
    <main className={styles.screen}>
      <ScreenHeader title={heading} onBack={() => navigate(-1)} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor={titleId}>
          {titleLabel}
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.icon}>
            <PencilIcon />
          </span>
          <input
            id={titleId}
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            maxLength={60}
          />
        </div>
      </div>

      <section className={styles.field}>
        <h2 className={styles.caption}>Варианты: {pool.items.length}</h2>
        {pool.items.length > 0 && (
          <ul className={styles.pool}>
            {pool.items.map((item) => (
              <li key={item.id} className={styles.poolItem}>
                <span className={styles.poolTitle}>{item.title}</span>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Убрать ${item.title}`}
                  onClick={() => pool.remove(item.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={searchId}>
          Добавить вариант
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.icon}>
            <PlusIcon />
          </span>
          <input
            id={searchId}
            type="search"
            className={styles.input}
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            disabled={pool.isFull}
            placeholder={pool.isFull ? `Максимум ${MAX_POOL} вариантов` : 'Название фильма'}
            aria-describedby={pool.canStart ? undefined : hintId}
          />
        </div>
        {!pool.canStart && (
          <p id={hintId} className={styles.hint}>
            Нужно минимум {MIN_POOL} варианта — сравним их попарно.
          </p>
        )}

        <p className={styles.status} aria-live="polite">
          {search.status === 'loading' && 'Ищу...'}
          {search.status === 'error' && search.error}
          {search.status === 'done' && search.items.length === 0 && 'Ничего не нашлось'}
        </p>

        {search.items.length > 0 && (
          <ul className={styles.suggestions}>
            {search.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handlePick(item)}
                  disabled={pool.items.some((x) => x.id === item.id)}
                  className={styles.suggestion}
                >
                  {item.imageUrl && (
                    <img
                      className={styles.poster}
                      src={item.imageUrl}
                      alt=""
                      width={40}
                      height={60}
                      loading="lazy"
                    />
                  )}
                  <span className={styles.suggestionTitle}>{item.title}</span>
                  <span className={styles.suggestionMeta}>{item.meta}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button className={styles.submit} disabled={!pool.canStart} onClick={handleStart}>
        {submitLabel}
      </Button>
    </main>
  );
}
