export type ItemCategory = 'film' | 'food' | 'drink' | 'custom';

export interface Item {
  id: string;
  title: string;
  category: ItemCategory;
  tag?: string;
  meta?: string;
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
