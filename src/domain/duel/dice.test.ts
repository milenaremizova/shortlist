import { describe, expect, it } from 'vitest';

import { otherPlayer, rollDie, rollForFirstTurn, type RandomFn } from './dice';

function sequence(...values: number[]): RandomFn {
  let index = 0;
  return () => values[index++];
}
const face = (n: number) => (n - 1) / 6;

describe('rollDie', () => {
  it('выдаёт грани от 1 до 6 на краях диапазона', () => {
    expect(rollDie(() => 0)).toBe(1);
    expect(rollDie(() => 0.9999)).toBe(6);
  });
});

describe('rollForFirstTurn', () => {
  it('первым ходит тот, у кого больше', () => {
    const roll = rollForFirstTurn(sequence(face(2), face(5)));

    expect(roll).toEqual({ host: 2, guest: 5, starter: 'guest' });
  });

  it('при ничьей перебрасывает', () => {
    const roll = rollForFirstTurn(sequence(face(3), face(3), face(6), face(1)));

    expect(roll).toEqual({ host: 6, guest: 1, starter: 'host' });
  });
});

describe('otherPlayer', () => {
  it('передаёт ход другому игроку', () => {
    expect(otherPlayer('host')).toBe('guest');
    expect(otherPlayer('guest')).toBe('host');
  });
});
