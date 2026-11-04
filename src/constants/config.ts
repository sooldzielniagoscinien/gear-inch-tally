import { Dimensions } from 'react-native';

/**
 * Splash duration. Must stay at exactly 8000ms: anything shorter races the
 * automated screenshot window and the Loader is gone before it is captured.
 */
export const LOADER_DURATION_MS = 8000;

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Short devices get tighter chips, paddings and a shorter table. */
export const COMPACT = SCREEN_H < 780;

/** Board geometry — derived from the column width so no cell can overflow. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 10;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 11
export const TABLE_COLS = 4;
export const COL_W = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / TABLE_COLS);
export const BOARD_W = COL_W * TABLE_COLS + 2 * BOARD_FRAME;

export const HEADER_TOP_PAD = 44;
export const HEADER_CONTENT_H = 72;

export type Rim = { label: string; bsd: number };

export const RIMS: Rim[] = [
  { label: '700C', bsd: 622 },
  { label: '650B', bsd: 584 },
  { label: '26 IN', bsd: 559 },
];

export const TYRES = [28, 32, 40, 47];
export const CADENCES = [70, 80, 90, 100];
export const DEFAULT_CADENCE = 90;
export const DEFAULT_CRANK_MM = 172.5;

export const CHAINRINGS = [34, 40, 46, 50];
export const COG_CHOICES = [11, 13, 15, 18, 21, 24, 28, 32, 36, 42];
export const MIN_COGS = 3;

export type BikePreset = {
  id: string;
  name: string;
  spec: string;
  ring: number;
  cogs: number[];
  rimIdx: number;
  tyre: number;
};

export const BIKES: BikePreset[] = [
  {
    id: 'gravel',
    name: 'GRAVEL 1x11',
    spec: '40T / 11-42T / 700x40C',
    ring: 40,
    cogs: [11, 13, 15, 18, 21, 24, 28, 32, 36, 42],
    rimIdx: 0,
    tyre: 40,
  },
  {
    id: 'road',
    name: 'ROAD 2x11',
    spec: '50T / 11-28T / 700x28C',
    ring: 50,
    cogs: [11, 13, 15, 18, 21, 24, 28],
    rimIdx: 0,
    tyre: 28,
  },
];

/** Two gears are duplicates when their gear inches sit within this tolerance. */
export const DUPLICATE_TOLERANCE = 0.025;
