// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createDuelSession } from '@/domain/factories';
import { identity } from '@/domain/shuffle';
import { makeItem } from '@/domain/testing';
import type { Item } from '@/domain/types';

import { useDuel } from './useDuel';

const pool = ['a', 'b', 'c'].map((id) => makeItem(id));

function createFixed(items: readonly Item[]) {
  const rolls = [0.9999, 0];
  let index = 0;
  return createDuelSession(items, {
    shuffleFn: identity,
    random: () => rolls[index++],
    flip: () => true,
  });
}

describe('useDuel', () => {
  it('до start дуэли нет', () => {
    const { result } = renderHook(() => useDuel(createFixed));

    expect(result.current.roll).toBeNull();
    expect(result.current.turn).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('start бросает кубик и сразу показывает первый ход, без передачи телефона', () => {
    const { result } = renderHook(() => useDuel(createFixed));

    act(() => result.current.start(pool));

    expect(result.current.roll).toEqual({ host: 6, guest: 1, starter: 'host' });
    expect(result.current.turn?.player).toBe('host');
    expect(result.current.handoff).toBe(false);
  });

  it('после выбора включается передача телефона, ready её выключает', () => {
    const { result } = renderHook(() => useDuel(createFixed));
    act(() => result.current.start(pool));

    act(() => result.current.choose('a'));

    expect(result.current.handoff).toBe(true);
    expect(result.current.turn?.player).toBe('guest');
    expect(result.current.turnsTaken).toBe(1);

    act(() => result.current.ready());

    expect(result.current.handoff).toBe(false);
    expect(result.current.turn?.player).toBe('guest');
  });

  it('при совпадении отдаёт результат и не просит передать телефон', () => {
    const { result } = renderHook(() => useDuel(createFixed));
    act(() => result.current.start(pool));

    act(() => result.current.choose('a'));
    act(() => result.current.ready());
    act(() => result.current.choose('a'));

    expect(result.current.result).toEqual({ kind: 'match', item: pool[0] });
    expect(result.current.handoff).toBe(false);
    expect(result.current.turn).toBeNull();
  });

  it('choose сразу возвращает новый снимок — по нему видно, что дуэль закончилась', () => {
    const { result } = renderHook(() => useDuel(createFixed));
    act(() => result.current.start(pool));
    act(() => result.current.choose('a'));
    act(() => result.current.ready());

    let next: ReturnType<typeof result.current.choose> = null;
    act(() => {
      next = result.current.choose('a');
    });

    expect(next).toMatchObject({ result: { kind: 'match', item: pool[0] } });
  });

  it('повторный start начинает новую дуэль с нуля', () => {
    const { result } = renderHook(() => useDuel(createFixed));
    act(() => result.current.start(pool));
    act(() => result.current.choose('a'));

    act(() => result.current.start(pool));

    expect(result.current.turnsTaken).toBe(0);
    expect(result.current.result).toBeNull();
    expect(result.current.handoff).toBe(false);
  });
});
