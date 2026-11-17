import type { Item } from '@/domain/types';

export type HistoryMode = 'rating' | 'evening' | 'duel';

export interface HistoryEntry {
  id: string;
  mode: HistoryMode;
  createdAt: string;
  title: string;
  items: Item[];
}

export interface HistoryRepository {
  list(): Promise<HistoryEntry[]>;
  save(entry: HistoryEntry): Promise<void>;
  remove(id: string): Promise<void>;
}
