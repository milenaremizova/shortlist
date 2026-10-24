import { describe, it, expect } from 'vitest';
import { createRatingSession } from './factories';
import { identity } from './shuffle';
import { makeItem } from './testing';

describe('createRatingSession', () => {
  it('перемешивает пул один раз: после undo пары идут в том же порядке', () => {
    // Arrange: «перемешивание» разворачивает пул и считает вызовы
    let calls = 0;
    const reverse = <T,>(items: readonly T[]): T[] => {
      calls++;
      return [...items].reverse();
    };
    const pool = ['a', 'b', 'c'].map((id) => makeItem(id));
    const session = createRatingSession(pool, reverse);
    const first = session.currentPair();

    // Act
    session.choose(first!.left.id);
    session.undo();

    // Assert
    expect(calls).toBe(1);
    expect(session.currentPair()).toEqual(first);
    expect(first).toEqual({ left: pool[2], right: pool[1] });
  });

  it('с identity отдаёт пары в исходном порядке', () => {
    const pool = ['a', 'b'].map((id) => makeItem(id));

    const session = createRatingSession(pool, identity);

    expect(session.currentPair()).toEqual({ left: pool[0], right: pool[1] });
  });
});
