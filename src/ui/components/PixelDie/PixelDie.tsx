/**
 * Пиксельный кубик по рисунку из макета: сетка 12×12, грань 9×9, точки 2×2.
 * Точки ставятся в одну из трёх колонок и строк: слева/сверху, по центру, справа/снизу.
 */
const CELL_W = 8.384;
const CELL_H = 9.629;
const SIDE = 12;

const L = 2;
const C = 5;
const R = 8;

/** [колонка, строка] левого верхнего пикселя каждой точки. */
const PIPS: Record<number, [number, number][]> = {
  1: [[C, C]],
  2: [
    [L, L],
    [R, R],
  ],
  3: [
    [L, L],
    [C, C],
    [R, R],
  ],
  4: [
    [L, L],
    [R, L],
    [L, R],
    [R, R],
  ],
  5: [
    [L, L],
    [R, L],
    [C, C],
    [L, R],
    [R, R],
  ],
  6: [
    [L, L],
    [R, L],
    [L, C],
    [R, C],
    [L, R],
    [R, R],
  ],
};

type Palette = 'white' | 'lavender';

const COLORS: Record<Palette, { face: string; shade: string }> = {
  white: { face: '#FFFFFF', shade: '#CFCCDD' },
  lavender: { face: '#C9CEFF', shade: '#9AA2F0' },
};

const INK = '#1E1A3A';

interface Props {
  value: number;
  palette?: Palette;
  size?: number;
  className?: string;
}

export function PixelDie({ value, palette = 'white', size = 100, className }: Props) {
  const { face, shade } = COLORS[palette];
  const pips = PIPS[value] ?? [];
  const cell = (col: number, row: number, w: number, h: number, fill: string) => (
    <rect
      key={`${col}-${row}-${fill}`}
      x={col * CELL_W}
      y={row * CELL_H}
      width={w * CELL_W}
      height={h * CELL_H}
      fill={fill}
    />
  );

  return (
    <svg
      className={className}
      width={size}
      height={(size * CELL_H) / CELL_W}
      viewBox={`0 0 ${SIDE * CELL_W} ${SIDE * CELL_H}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`На кубике ${value}`}
    >
      {/* контур */}
      {cell(1, 0, 10, 1, INK)}
      {cell(1, 11, 10, 1, INK)}
      {cell(0, 1, 1, 10, INK)}
      {cell(11, 1, 1, 10, INK)}
      {/* грань и тень справа и снизу */}
      {cell(1, 1, 9, 9, face)}
      {cell(10, 1, 1, 10, shade)}
      {cell(1, 10, 9, 1, shade)}
      {/* точки */}
      {pips.map(([col, row]) => cell(col, row, 2, 2, INK))}
    </svg>
  );
}
