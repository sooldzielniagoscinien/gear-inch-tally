import { useCallback, useMemo, useState } from 'react';
import { Vibration } from 'react-native';
import {
  BIKES,
  BikePreset,
  DEFAULT_CADENCE,
  DEFAULT_CRANK_MM,
  MIN_COGS,
  RIMS,
  TYRES,
} from '../constants/config';
import { buildGearRows, GearRowData, DrivetrainInput } from '../game/gearMath';
import { rangePercent } from '../game/compare';

function cogSpec(cogs: number[]): string {
  if (!cogs.length) {
    return '--';
  }
  return cogs[0] + '-' + cogs[cogs.length - 1] + 'T';
}

export function useDrivetrain(bikeIndex: number) {
  const base: BikePreset = BIKES[bikeIndex] ?? BIKES[0];

  const [ring, setRing] = useState<number>(base.ring);
  const [cogs, setCogs] = useState<number[]>(base.cogs);
  const [rimIdx, setRimIdx] = useState<number>(base.rimIdx);
  const [tyreIdx, setTyreIdx] = useState<number>(
    Math.max(0, TYRES.indexOf(base.tyre)),
  );
  const [cadence, setCadence] = useState<number>(DEFAULT_CADENCE);
  const [metric, setMetric] = useState<boolean>(true);

  const rim = RIMS[rimIdx] ?? RIMS[0];
  const tyre = TYRES[tyreIdx] ?? TYRES[0];

  const input: DrivetrainInput = useMemo(
    () => ({
      ring,
      cogs,
      bsd: rim.bsd,
      tyre,
      crank: DEFAULT_CRANK_MM,
      cadence,
    }),
    [ring, cogs, rim.bsd, tyre, cadence],
  );

  const rows: GearRowData[] = useMemo(() => buildGearRows(input), [input]);

  const stats = useMemo(() => {
    const gears = rows.map(r => r.gearInches);
    if (gears.length < 2) {
      return { range: 0, low: 0, high: 0 };
    }
    return {
      range: rangePercent(gears),
      low: Math.min(...gears),
      high: Math.max(...gears),
    };
  }, [rows]);

  const selectRing = useCallback((value: number) => {
    Vibration.vibrate(8);
    setRing(value);
  }, []);

  const toggleCog = useCallback((value: number) => {
    Vibration.vibrate(8);
    setCogs(prev => {
      if (prev.includes(value)) {
        if (prev.length <= MIN_COGS) {
          return prev;
        }
        return prev.filter(c => c !== value);
      }
      return prev.concat(value).sort((a, b) => a - b);
    });
  }, []);

  const selectCadence = useCallback((value: number) => {
    Vibration.vibrate(8);
    setCadence(value);
  }, []);

  const cycleRim = useCallback(() => {
    Vibration.vibrate(8);
    setRimIdx(prev => (prev + 1) % RIMS.length);
  }, []);

  const cycleTyre = useCallback(() => {
    Vibration.vibrate(8);
    setTyreIdx(prev => (prev + 1) % TYRES.length);
  }, []);

  const toggleUnits = useCallback(() => {
    Vibration.vibrate(8);
    setMetric(prev => !prev);
  }, []);

  const spec = ring + 'T / ' + cogSpec(cogs);
  const fullSpec = spec + ' / ' + rim.label + 'x' + tyre;

  return {
    ring,
    cogs,
    rim,
    tyre,
    cadence,
    metric,
    rows,
    stats,
    input,
    spec,
    fullSpec,
    name: base.name,
    selectRing,
    toggleCog,
    selectCadence,
    cycleRim,
    cycleTyre,
    toggleUnits,
  };
}
