export const estimateDistanceKm = (steps: number, strideMeters = 0.7): number => {
  if (!Number.isFinite(steps) || steps <= 0) return 0;
  return +((steps * strideMeters) / 1000).toFixed(2);
};
