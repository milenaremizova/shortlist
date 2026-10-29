import { useState } from 'react';

import type { Item } from '@/domain/types';

export const MIN_POOL = 3;
export const MAX_POOL = 16;

export function usePool() {
  const [items, setItems] = useState<Item[]>([]);

  function add(item: Item) {
    setItems((prev) => {
      if (prev.some((x) => x.id === item.id) || prev.length >= MAX_POOL) return prev;
      const nextPrev = [...prev, item];
      return nextPrev;
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return {
    items,
    add,
    remove,
    canStart: items.length >= MIN_POOL,
    isFull: items.length >= MAX_POOL,
  };
}
