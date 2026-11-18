import type { Item, Pair } from '../types';
import { otherPlayer, type PlayerId } from './dice';

/** Монетка: true — выбор соперника слева, false — справа. */
export type CoinFn = () => boolean;

export const coin: CoinFn = () => Math.random() < 0.5;

/** Чем закончилась дуэль: совпали или варианты кончились. */
export type DuelResult =
  { kind: 'match'; item: Item } | { kind: 'noMatch'; favorites: Record<PlayerId, Item> };

/** Чей сейчас ход и какую пару ему показать. */
export interface DuelTurn {
  player: PlayerId;
  pair: Pair;
}

/**
 * Дуэль вслепую. Игроки ходят по очереди и не видят выбор друг друга.
 * Каждому показывают пару: то, что выбрал соперник (кандидат), и новый вариант из пула.
 * новый становится кандидатом, ход переходит. Пул кончился - noMatch с фаворитом каждого игрока.
 * новый становится кандидатом, ход переходит. Пул кончился - noMatch с последним выбором.
 */
export class DuelSession {
  /** Варианты, которые ещё не показывали. Берём с начала через shift(). */
  private readonly queue: Item[];
  private readonly flip: CoinFn;
  /** Последний выбор каждого игрока: из них получаются фавориты, если не совпали. */
  private readonly lastPicks: Partial<Record<PlayerId, Item>> = {};

  /** Последний выбор: его увидит следующий игрок. На первом ходе кандидата ещё нет. */
  private candidate: Item | null = null;
  private player: PlayerId;
  private turn: DuelTurn | null;
  private outcome: DuelResult | null = null;
  private turns = 0;

  constructor(pool: readonly Item[], starter: PlayerId, flip: CoinFn = coin) {
    if (pool.length < 3) throw new Error('Для дуэли нужно минимум три варианта');

    this.queue = [...pool];
    this.flip = flip;
    this.player = starter;
    this.turn = this.nextTurn();
  }

  currentTurn(): DuelTurn | null {
    return this.turn;
  }

  isComplete(): boolean {
    return this.outcome !== null;
  }

  result(): DuelResult | null {
    return this.outcome;
  }

  turnsTaken(): number {
    return this.turns;
  }

  choose(itemId: string): void {
    if (!this.turn) return;

    const turn = this.turn;
    const { left, right } = turn.pair;
    let picked: Item;

    if (itemId === left.id) {
      picked = left;
    } else if (itemId === right.id) {
      picked = right;
    } else {
      throw new Error(`itemId "${itemId}" не из текущей пары`);
    }

    this.turns++;

    if (this.candidate !== null && picked.id === this.candidate.id) {
      this.outcome = { kind: 'match', item: picked };
      this.turn = null;
      return;
    }
    this.candidate = picked;
    this.lastPicks[this.player] = picked;
    this.player = otherPlayer(this.player);
    this.turn = this.nextTurn();

    if (!this.turn) {
      this.outcome = {
        kind: 'noMatch',
        favorites: { host: this.lastPicks.host!, guest: this.lastPicks.guest! },
      };
    }
  }

  /** Собирает следующий ход или возвращает null, если новых вариантов не осталось. */
  private nextTurn(): DuelTurn | null {
    let first: Item;
    let second: Item;

    if (this.candidate === null) {
      first = this.queue.shift()!;
      second = this.queue.shift()!;
    } else {
      first = this.candidate;

      const fresh = this.queue.shift();
      if (fresh === undefined) return null;

      second = fresh;
    }

    const pair = this.flip() ? { left: first, right: second } : { left: second, right: first };

    return { player: this.player, pair };
  }
}
