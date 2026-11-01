import type { Item, ItemCategory } from './types';

export function makeItem(id: string, category: ItemCategory = 'film'): Item {
  return { id, title: id, category, imageUrl: null };
}
