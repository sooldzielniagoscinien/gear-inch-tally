/** Drivetrain maths. Pure functions, no React, no side effects. */

export type GearRowData = {
  cog: number;
  gearInches: number;
  development: number;
  gain: number;
  ratio: number;
  skidPatches: number;
  speedKmh: number;
};

export type DrivetrainInput = {
  ring: number;
  cogs: number[];
  bsd: number;
  tyre: number;
  crank: number;
  cadence: number;
};

const MM_PER_INCH = 25.4;

export function effectiveDiameterIn(bsdMm: number, tyreMm: number): number {
  return (bsdMm + 2 * tyreMm) / MM_PER_INCH;
}

export function gearInches(diameterIn: number, ring: number, cog: number): number {
  if (cog <= 0) {
    return 0;
  }
  return diameterIn * (ring / cog);
}

/** Metres of development — distance travelled per crank revolution. */
export function development(gi: number): number {
  return (gi * MM_PER_INCH * Math.PI) / 1000;
}

export function gainRatio(
  diameterIn: number,
  crankMm: number,
  ring: number,
  cog: number,
): number {
  if (crankMm <= 0 || cog <= 0) {
    return 0;
  }
  return ((diameterIn * MM_PER_INCH) / 2 / crankMm) * (ring / cog);
}

export function speedKmh(dev: number, rpm: number): number {
  return (dev * rpm * 60) / 1000;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function skidPatches(ring: number, cog: number): number {
  return Math.round(cog / gcd(ring, cog));
}

export function buildGearRows(input: DrivetrainInput): GearRowData[] {
  const { ring, cogs, bsd, tyre, crank, cadence } = input;
  const diameterIn = effectiveDiameterIn(bsd, tyre);
  const sorted = cogs.slice().sort((a, b) => a - b);

  return sorted.map(cog => {
    const gi = gearInches(diameterIn, ring, cog);
    const dev = development(gi);
    return {
      cog,
      gearInches: gi,
      development: dev,
      gain: gainRatio(diameterIn, crank, ring, cog),
      ratio: ring / cog,
      skidPatches: skidPatches(ring, cog),
      speedKmh: speedKmh(dev, cadence),
    };
  });
}

export function gearInchList(rows: GearRowData[]): number[] {
  return rows.map(r => r.gearInches);
}
