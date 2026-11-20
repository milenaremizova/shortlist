import { describe, expect, it } from 'vitest';

import { plural } from './plural';

const PAIRS: [string, string, string] = ['пара', 'пары', 'пар'];

describe('plural', () => {
  it.each([
    [1, 'пара'],
    [2, 'пары'],
    [4, 'пары'],
    [5, 'пар'],
    [11, 'пар'],
    [12, 'пар'],
    [14, 'пар'],
    [21, 'пара'],
    [22, 'пары'],
    [0, 'пар'],
  ])('%i → %s', (n, expected) => {
    expect(plural(n, PAIRS)).toBe(expected);
  });
});
