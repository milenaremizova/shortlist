/** Функция перемешивания передаётся снаружи — в тестах вместо неё подставляем identity. */
export type ShuffleFn = <T>(items: readonly T[]) => T[];

/** Тасование Фишера — Йетса. Возвращает новый массив, исходный не меняет. */
export const shuffle: ShuffleFn = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/** Без перемешивания: порядок как есть. Для тестов и повторов. */
export const identity: ShuffleFn = (items) => [...items];
