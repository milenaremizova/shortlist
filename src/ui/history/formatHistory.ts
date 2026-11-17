import type { HistoryEntry, HistoryMode } from '@/api/history/HistoryRepository';

export const MODE_LABEL: Record<HistoryMode, string> = {
  rating: 'Свой рейтинг',
  evening: 'Конструктор',
  duel: 'В паре',
};

export interface MonthGroup {
  key: string;
  label: string;
  entries: HistoryEntry[];
}

export function groupByMonth(entries: HistoryEntry[], now: Date = new Date()): MonthGroup[] {
  const groups: MonthGroup[] = [];

  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const last = groups.at(-1);

    if (last?.key === key) {
      last.entries.push(entry);
    } else {
      groups.push({ key, label: monthLabel(date, now), entries: [entry] });
    }
  }

  return groups;
}

function monthLabel(date: Date, now: Date): string {
  const month = date.toLocaleDateString('ru-RU', { month: 'long' });
  return date.getFullYear() === now.getFullYear() ? month : `${month} ${date.getFullYear()}`;
}

export function dayParts(iso: string): { day: string; month: string } {
  const date = new Date(iso);
  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
  };
}

export function summary(entry: HistoryEntry): string {
  if (entry.mode === 'rating') {
    const winner = entry.items[0];
    return winner ? `1 место — ${winner.title}` : 'Пустой рейтинг';
  }
  return entry.items.map((item) => item.title).join(' · ');
}
