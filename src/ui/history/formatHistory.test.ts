import { describe, expect, it } from 'vitest';

import type { HistoryEntry } from '@/api/history/HistoryRepository';
import { makeItem } from '@/domain/testing';

import { groupByMonth, itemLabels, summary } from './formatHistory';

function entry(id: string, createdAt: string): HistoryEntry {
  return { id, mode: 'rating', createdAt, title: id, items: [] };
}

const NOW = new Date('2026-11-17T12:00:00');

describe('groupByMonth', () => {
  it('раскладывает записи по месяцам и сохраняет порядок', () => {
    const groups = groupByMonth(
      [
        entry('a', '2026-10-17T18:00:00'),
        entry('b', '2026-10-05T18:00:00'),
        entry('c', '2026-09-28T18:00:00'),
      ],
      NOW,
    );

    expect(groups.map((g) => g.key)).toEqual(['2026-10', '2026-09']);
    expect(groups[0].entries.map((e) => e.id)).toEqual(['a', 'b']);
  });

  it('добавляет год к месяцу не из текущего года', () => {
    const [group] = groupByMonth([entry('a', '2025-12-31T18:00:00')], NOW);

    expect(group.label).toBe('декабрь 2025');
  });

  it('пустая история — пустой список групп', () => {
    expect(groupByMonth([], NOW)).toEqual([]);
  });
});

describe('summary', () => {
  it('для рейтинга показывает победителя', () => {
    const rating = { ...entry('r', '2026-10-01T18:00:00'), items: [makeItem('Дюна')] };

    expect(summary(rating)).toBe('1 место — Дюна');
  });
});

describe('дуэль в истории', () => {
  const duel = (titles: string[]): HistoryEntry => ({
    ...entry('d', '2026-11-22T18:00:00'),
    mode: 'duel',
    items: titles.map((title) => makeItem(title)),
  });

  it('один вариант — совпали на нём', () => {
    const matched = duel(['Человек-паук']);

    expect(summary(matched)).toBe('Совпали — Человек-паук');
    expect(itemLabels(matched)).toEqual(['Совпали']);
  });

  it('два варианта — не совпали, у каждого свой фаворит', () => {
    const missed = duel(['Дюна', 'Барби']);

    expect(summary(missed)).toBe('Не совпали');
    expect(itemLabels(missed)).toEqual(['Фаворит Игрока 1', 'Фаворит Игрока 2']);
  });

  it('у рейтинга подписей нет — там номера мест', () => {
    expect(itemLabels(entry('r', '2026-10-01T18:00:00'))).toBeNull();
  });
});
