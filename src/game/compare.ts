import { DUPLICATE_TOLERANCE } from '../constants/config';
import { buildGearRows, GearRowData, DrivetrainInput, gearInchList } from './gearMath';
import { fmt1, fmt2, padCell } from '../utils/format';

export type DrivetrainSummary = {
  label: string;
  spec: string;
  gears: number[];
  rangePct: number;
  low: number;
  high: number;
};

export type CompareSummary = {
  a: DrivetrainSummary;
  b: DrivetrainSummary;
  duplicates: number;
  duplicatePositions: number[];
  min: number;
  max: number;
  exportLines: string[];
};

export function rangePercent(gears: number[]): number {
  if (gears.length < 2) {
    return 100;
  }
  const low = Math.min(...gears);
  const high = Math.max(...gears);
  if (low <= 0) {
    return 100;
  }
  return (high / low) * 100;
}

/** Gears count as duplicates when they sit within the tolerance of each other. */
export function findDuplicates(
  a: number[],
  b: number[],
  tolerance: number = DUPLICATE_TOLERANCE,
): number[] {
  const hits: number[] = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] > 0 && Math.abs(a[i] - b[j]) / a[i] < tolerance) {
        hits.push((a[i] + b[j]) / 2);
        break;
      }
    }
  }
  return hits;
}

export function buildExportLines(rows: GearRowData[], limit: number = 3): string[] {
  const head =
    padCell('COG', 5) + padCell('GEAR IN', 9) + padCell('DEV m', 8) + 'GAIN';
  const body = rows
    .slice(0, limit)
    .map(
      r =>
        padCell(String(r.cog) + 'T', 5) +
        padCell(fmt1(r.gearInches), 9) +
        padCell(fmt2(r.development), 8) +
        fmt2(r.gain),
    );
  return [head, ...body];
}

function toSummary(label: string, spec: string, rows: GearRowData[]): DrivetrainSummary {
  const gears = gearInchList(rows);
  const safe = gears.length ? gears : [1];
  return {
    label,
    spec,
    gears: safe,
    rangePct: rangePercent(safe),
    low: Math.min(...safe),
    high: Math.max(...safe),
  };
}

export function buildSummary(
  aInput: DrivetrainInput,
  aLabel: string,
  aSpec: string,
  bInput: DrivetrainInput,
  bLabel: string,
  bSpec: string,
): CompareSummary {
  const rowsA = buildGearRows(aInput);
  const rowsB = buildGearRows(bInput);
  const a = toSummary(aLabel, aSpec, rowsA);
  const b = toSummary(bLabel, bSpec, rowsB);
  const dupes = findDuplicates(a.gears, b.gears);

  return {
    a,
    b,
    duplicates: dupes.length,
    duplicatePositions: dupes,
    min: Math.min(a.low, b.low),
    max: Math.max(a.high, b.high),
    exportLines: buildExportLines(rowsA, 3),
  };
}
