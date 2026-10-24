import type { Item, ItemCategory } from './types';

/** Фабрика тестовых вариантов: id = title, без картинки. Только для тестов. */
export function makeItem(id: string, category: ItemCategory = 'film'): Item {
  return { id, title: id, category, imageUrl: null };
}
