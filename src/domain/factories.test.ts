import { describe, expect, it } from 'vitest';

import { createDuelSession, createRatingSession } from './factories';
import { identity } from './shuffle';
import { makeItem } from './testing';

describe('createRatingSession', () => {
  it('перемешивает пул один раз: после undo пары идут в том же порядке', () => {
    // Arrange: «перемешивание» разворачивает пул и считает вызовы
    let calls = 0;
    const reverse = <T>(items: readonly T[]): T[] => {
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

describe('createDuelSession', () => {
  it('перемешивает пул и отдаёт первый ход победителю кубика', () => {
    const pool = ['a', 'b', 'c'].map((id) => makeItem(id));
    const reverse = <T>(items: readonly T[]): T[] => [...items].reverse();
    // host выбрасывает 1, guest - 6
    const rolls = [0, 0.9999];
    let index = 0;

    const { session, roll } = createDuelSession(pool, {
      shuffleFn: reverse,
      random: () => rolls[index++],
      flip: () => true,
    });

    expect(roll).toEqual({ host: 1, guest: 6, starter: 'guest' });
    expect(session.currentTurn()).toEqual({
      player: 'guest',
      pair: { left: pool[2], right: pool[1] },
    });
  });
});
