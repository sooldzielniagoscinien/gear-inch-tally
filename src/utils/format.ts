export const MPH_PER_KMH = 0.621371;

export function fmt1(n: number): string {
  return Number.isFinite(n) ? n.toFixed(1) : '--';
}

export function fmt2(n: number): string {
  return Number.isFinite(n) ? n.toFixed(2) : '--';
}

export function fmtInt(n: number): string {
  return Number.isFinite(n) ? String(Math.round(n)) : '--';
}

export function fmtPct(n: number): string {
  return fmtInt(n) + '%';
}

export function fmtSpeed(kmh: number, metric: boolean): string {
  const v = metric ? kmh : kmh * MPH_PER_KMH;
  return fmt1(v) + (metric ? ' km/h' : ' mph');
}

export function speedUnit(metric: boolean): string {
  return metric ? 'KM/H' : 'MPH';
}

/** Pads a cell so the plain-text export lines stay column aligned. */
export function padCell(value: string, width: number): string {
  if (value.length >= width) {
    return value.slice(0, width);
  }
  return value + ' '.repeat(width - value.length);
}
