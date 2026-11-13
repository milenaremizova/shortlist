import { safeLocalStorage } from '@/api/storage';
import type { Item, Ranking } from '@/domain/types';

import type { RatingDraft, RatingDraftRepository } from './RatingDraftRepository';

const KEY = 'shortlist:rating-draft:v1';

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export class LocalStorageRatingDraftRepository implements RatingDraftRepository {
  private readonly storage: KeyValueStorage | null;

  constructor(storage: KeyValueStorage | null = safeLocalStorage()) {
    this.storage = storage;
  }

  load(): RatingDraft | null {
    try {
      const raw = this.storage?.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      return isRatingDraft(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  save(draft: RatingDraft): void {
    try {
      this.storage?.setItem(KEY, JSON.stringify(draft));
    } catch {
      // приватный режим или переполнение: без черновика
    }
  }

  clear(): void {
    try {
      this.storage?.removeItem(KEY);
    } catch {
      // нечего чистить
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isItem(value: unknown): value is Item {
  return isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string';
}

function isItemList(value: unknown): value is Item[] {
  return Array.isArray(value) && value.every(isItem);
}

function isRanking(value: unknown): value is Ranking {
  return isRecord(value) && isItemList(value.places) && typeof value.isFinal === 'boolean';
}

function isRatingDraft(value: unknown): value is RatingDraft {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    isItemList(value.items) &&
    (value.ranking === null || isRanking(value.ranking))
  );
}
