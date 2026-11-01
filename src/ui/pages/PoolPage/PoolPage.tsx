import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useItemSearch } from '@/app/hooks/useItemSearch';
import { MAX_POOL, MIN_POOL, usePool } from '@/app/hooks/usePool';
import type { Item } from '@/domain/types';
import { Button } from '@/ui/components/Button/Button';

import styles from './PoolPage.module.scss';

export interface PoolDraft {
  title: string;
  items: Item[];
}

interface Props {
  onStart: (draft: PoolDraft) => void;
}

export function PoolPage({ onStart }: Props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const pool = usePool();
  const search = useItemSearch('film');

  function handlePick(item: Item) {
    pool.add(item);
    search.setQuery('');
  }

  function handleStart() {
    onStart({ items: pool.items, title: title.trim() || 'Мой рейтинг' });
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          aria-label="Назад"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h1 className={styles.title}>Новый рейтинг</h1>
      </header>

      <label className={styles.field}>
        <span className={styles.label}>Название</span>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Что посмотреть на неделе"
          maxLength={60}
        />
      </label>

      <section>
        <h2 className={styles.caption}>Варианты · {pool.items.length}</h2>
        <ul className={styles.pool}>
          {pool.items.map((item) => (
            <li key={item.id} className={styles.poolItem}>
              <span>{item.title}</span>
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
      </section>

      <label className={styles.field}>
        <span className={styles.label}>Добавить вариант</span>
        <input
          type="search"
          className={styles.input}
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          disabled={pool.isFull}
          placeholder={pool.isFull ? `Максимум ${MAX_POOL} вариантов` : 'Название фильма'}
        />
      </label>

      <p className={styles.status} aria-live="polite">
        {search.status === 'loading' && 'Ищу...'}
        {search.status === 'error' && search.error}
        {search.status === 'done' && search.items.length === 0 && 'Ничего не нашлось'}
      </p>

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

      {!pool.canStart && (
        <p className={styles.hint}>Нужно минимум {MIN_POOL} варианта — сравним их попарно.</p>
      )}

      <Button className={styles.submit} disabled={!pool.canStart} onClick={handleStart}>
        Сравнить
      </Button>
    </main>
  );
}
