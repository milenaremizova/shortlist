// Доменные типы. Ничего не знают о React, сети и хранилище.

/** Категории вариантов. Порядок раундов «Собрать вечер» — film → food → drink. */
export type ItemCategory = 'film' | 'food' | 'drink' | 'custom';

/** Любой вариант, который можно сравнивать: фильм, блюдо, напиток или своя хотелка. */
export interface Item {
  id: string;
  title: string;
  category: ItemCategory;
  /** Метка на карточке: жанр, кухня, «Без алкоголя». */
  tag?: string;
  /** Вторая строка карточки: «2010 · 2 ч 28 м», «Доставка · ~40 мин». */
  meta?: string;
  /** Постер или фото. null — карточка показывает заглушку. */
  imageUrl: string | null;
}

export interface Pair {
  left: Item;
  right: Item;
}

export interface Comparison {
  leftId: string;
  rightId: string;
  winnerId: string;
}

export interface Ranking {
  places: Item[];
  isFinal: boolean;
}

export interface SessionProgress {
  done: number;
  estimated: number;
}
