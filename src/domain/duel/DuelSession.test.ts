import { describe, expect, it } from 'vitest';

import { makeItem } from '../testing';
import { DuelSession, type CoinFn } from './DuelSession';

const pool = ['a', 'b', 'c', 'd'].map((id) => makeItem(id));
const [a, b, c, d] = pool;

/** «Монетка» всегда кладёт прежний выбор (или первый вариант) слева, так пары предсказуемы. */
const keepLeft: CoinFn = () => true;

describe('DuelSession', () => {
  it('не создаётся, если вариантов меньше трёх: иначе второй игрок не успеет сходить', () => {
    expect(() => new DuelSession([a, b], 'host', keepLeft)).toThrow();
  });

  it('первый ход: два первых варианта из пула, ходит тот, кто выиграл кубик', () => {
    const session = new DuelSession(pool, 'guest', keepLeft);

    expect(session.currentTurn()).toEqual({ player: 'guest', pair: { left: a, right: b } });
    expect(session.isComplete()).toBe(false);
    expect(session.result()).toBeNull();
  });

  it('после выбора ход переходит другому: его пара — выбор соперника и новый вариант', () => {
    const session = new DuelSession(pool, 'host', keepLeft);

    session.choose('b');

    expect(session.currentTurn()).toEqual({ player: 'guest', pair: { left: b, right: c } });
  });

  it('если игрок выбрал то же, что соперник, — совпадение и конец дуэли', () => {
    const session = new DuelSession(pool, 'host', keepLeft);

    session.choose('b'); // host выбрал b
    session.choose('b'); // guest тоже выбрал b

    expect(session.isComplete()).toBe(true);
    expect(session.result()).toEqual({ kind: 'match', item: b });
    expect(session.currentTurn()).toBeNull();
    expect(session.turnsTaken()).toBe(2);
  });

  it('если выбрал новый вариант — прежний выбывает навсегда, новый становится кандидатом', () => {
    const session = new DuelSession(pool, 'host', keepLeft);

    session.choose('a'); // host: a из (a, b) - b выбыл
    session.choose('c'); // guest: c из (a, c) - a выбыл

    expect(session.currentTurn()).toEqual({ player: 'host', pair: { left: c, right: d } });
  });

  it('если пул закончился без совпадения — noMatch с фаворитом каждого игрока', () => {
    const session = new DuelSession(pool, 'host', keepLeft);

    session.choose('a'); // host: (a, b) -> a
    session.choose('c'); // guest: (a, c) -> c
    session.choose('d'); // host: (c, d) -> d, новых вариантов больше нет

    expect(session.isComplete()).toBe(true);
    expect(session.result()).toEqual({ kind: 'noMatch', favorites: { host: d, guest: c } });
    expect(session.currentTurn()).toBeNull();
    expect(session.turnsTaken()).toBe(3);
  });

  it('монетка решает, с какой стороны окажется выбор соперника', () => {
    const session = new DuelSession(pool, 'host', () => false);

    expect(session.currentTurn()?.pair).toEqual({ left: b, right: a });
    session.choose('a');
    expect(session.currentTurn()?.pair).toEqual({ left: c, right: a });
  });

  it('бросает ошибку, если выбран вариант не из текущей пары', () => {
    const session = new DuelSession(pool, 'host', keepLeft);

    expect(() => session.choose('d')).toThrow();
  });

  it('после конца дуэли выбор ничего не меняет', () => {
    const session = new DuelSession(pool, 'host', keepLeft);
    session.choose('b');
    session.choose('b');

    session.choose('c');

    expect(session.result()).toEqual({ kind: 'match', item: b });
    expect(session.turnsTaken()).toBe(2);
  });
});
