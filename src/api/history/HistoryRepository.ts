import type { Item } from '@/domain/types';

export type HistoryMode = 'rating' | 'evening' | 'duel';

/** Одна запись в «Вечерах»: что выбрали и как. */
export interface HistoryEntry {
  id: string;
  mode: HistoryMode;
  /** ISO-дата, когда сохранили. */
  createdAt: string;
  title: string;
  /** Итог по местам: для вечера — фильм, еда, напиток; для рейтинга — весь топ. */
  items: Item[];
}

/**
 * Repository: UI не знает, где лежит история.
 * Сейчас — localStorage, после аккаунтов — HTTP, и экраны при этом не меняются.
 */
export interface HistoryRepository {
  list(): HistoryEntry[];
  save(entry: HistoryEntry): void;
  remove(id: string): void;
}
