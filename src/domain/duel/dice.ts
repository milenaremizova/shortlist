export type PlayerId = 'host' | 'guest';

export type RandomFn = () => number;

export interface DiceRoll {
  host: number;
  guest: number;
  starter: PlayerId;
}

export function otherPlayer(player: PlayerId): PlayerId {
  return player === 'host' ? 'guest' : 'host';
}

export function rollDie(random: RandomFn = Math.random): number {
  return Math.floor(random() * 6) + 1;
}

export function rollForFirstTurn(random: RandomFn = Math.random): DiceRoll {
  let host = rollDie(random);
  let guest = rollDie(random);
  while (host === guest) {
    host = rollDie(random);
    guest = rollDie(random);
  }
  return { host, guest, starter: host > guest ? 'host' : 'guest' };
}
