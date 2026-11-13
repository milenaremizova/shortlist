import type { PoolDraft, Ranking } from '@/domain/types';

/**
 * Незаконченный «Свой рейтинг»: то, что нужно, чтобы пережить обновление страницы.
 * Шаг отдельно не храним: есть ranking — мы на итоге, нет — на сравнении.
 */
export interface RatingDraft extends PoolDraft {
  ranking: Ranking | null;
}

/**
 * Черновик живёт только на этом устройстве и на сервер не уедет даже после аккаунтов,
 * поэтому методы синхронные — в отличие от HistoryRepository, где всё на промисах.
 * Синхронное чтение ещё и позволяет восстановить экран сразу, без состояния «загрузка».
 */
export interface RatingDraftRepository {
  load(): RatingDraft | null;
  save(draft: RatingDraft): void;
  clear(): void;
}
