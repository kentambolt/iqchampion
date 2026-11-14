'use strict';

// Convert the unchanged empirical midrank onto an IQ-style normal scale.
// The table's second column is the normal CDF for mean 100, SD 15.
// Bound the presentation rather than extrapolating unsupported tail precision.
function estimate_iq(percentile) {
  if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100) return null;
  const low = percentiles.find(row => row[0] === 55);
  const high = percentiles.find(row => row[0] === 145);
  if (percentile <= low[1]) return '≤55';
  if (percentile >= high[1]) return '≥145';
  const upper = percentiles.findIndex(row => row[1] >= percentile);
  const [x0, p0] = percentiles[upper - 1];
  const [x1, p1] = percentiles[upper];
  return String(Math.round(x0 + (percentile - p0) / (p1 - p0) * (x1 - x0)));
}

