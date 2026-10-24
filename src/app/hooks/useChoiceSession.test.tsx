// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useChoiceSession } from './useChoiceSession';
import { createRatingSession } from '@/domain/factories';
import { identity } from '@/domain/shuffle';
import { makeItem } from '@/domain/testing';

describe('useChoiceSession', () => {
  const pool = ['a', 'b', 'c'].map((id) => makeItem(id));

  it('choose и undo обновляют пару и прогресс на экране', () => {
    // Arrange
    const { result } = renderHook(() => useChoiceSession(() => createRatingSession(pool, identity)));
    const first = result.current.pair;

    // Act
    act(() => result.current.choose('a'));

    // Assert
    expect(result.current.progress.done).toBe(1);
    expect(result.current.canUndo).toBe(true);

    act(() => result.current.undo());
    expect(result.current.pair).toEqual(first);
  });

  it('создаёт сессию один раз, даже если компонент перерисовался', () => {
    let created = 0;
    const { rerender } = renderHook(() =>
      useChoiceSession(() => {
        created++;
        return createRatingSession(pool, identity);
      }),
    );

    rerender();
    rerender();

    expect(created).toBe(1);
  });
});
