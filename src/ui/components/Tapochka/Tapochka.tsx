/**
 * Маскот. Пиксельная сетка 20×12 снята с макета: масштаб 5:3, без сглаживания.
 * Peach — основной, Butter — на тёплом фоне, White — пара-инверсия для «Пары тапочек».
 */
const GRID = [
  '............ooo.....',
  '...........oPPPo....',
  '...........oPPPo....',
  '.........ooooooooo..',
  '........ohhbbbbbbbo.',
  '.......ohbbbbebbebbo',
  '.......obbbbbebbebbo',
  '.......obbbccbeebcco',
  '.ooooooobbbbbbbbbbbo',
  'obbbbbbbbbbbbbbbbbbo',
  'osssssssssssssssssso',
  '.oooooooooooooooooo.',
];

type Palette = 'peach' | 'butter' | 'white';

const COLORS: Record<Palette, Record<string, string>> = {
  peach: {
    o: '#1E1A3A',
    e: '#1E1A3A',
    P: '#FFFFFF',
    h: '#FFC6B0',
    b: '#FF9E7A',
    c: '#F2603F',
    s: '#FFFFFF',
  },
  butter: {
    o: '#1E1A3A',
    e: '#1E1A3A',
    P: '#FFFFFF',
    h: '#FFE9A8',
    b: '#FFD66B',
    c: '#F2603F',
    s: '#FFFFFF',
  },
  white: {
    o: '#1E1A3A',
    e: '#1E1A3A',
    P: '#FF9E7A',
    h: '#E3E6F5',
    b: '#FFFFFF',
    c: '#F2603F',
    s: '#FFFFFF',
  },
};

interface Rect {
  x: number;
  y: number;
  width: number;
  fill: string;
}

/** Склеиваем соседние пиксели одного цвета в полоски — меньше узлов в DOM. */
function toRects(palette: Palette): Rect[] {
  const rects: Rect[] = [];
  GRID.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== '.') rects.push({ x, y, width: end - x, fill: COLORS[palette][ch] });
      x = end;
    }
  });
  return rects;
}

interface Props {
  palette?: Palette;
  /** Ширина в px; высота считается по пропорции 5:3. */
  size?: number;
  mirrored?: boolean;
  className?: string;
}

export function Tapochka({ palette = 'peach', size = 200, mirrored = false, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 3) / 5}
      viewBox="0 0 20 12"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Тапочка"
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    >
      {toRects(palette).map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.width} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
