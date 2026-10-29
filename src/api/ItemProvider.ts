import type { Item, ItemCategory } from '@/domain/types';

/**
 * Откуда берутся варианты. У каждой категории своя реализация:
 * фильмы — через прокси к ПоискКино (Adapter), еда и напитки — готовые наборы.
 * Хуки получают провайдер через DependenciesContext, поэтому в тестах его легко подменить.
 */
export interface ItemProvider {
  readonly category: ItemCategory;
  search(query: string, signal?: AbortSignal): Promise<Item[]>;
}

// TODO(этап 3): PresetProvider — food.json / drinks.json, фото через прокси к Pexels
