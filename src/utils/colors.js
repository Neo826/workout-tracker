// Color stops from deep red → orange → yellow → light green → deep green
const STOPS = [
  { t: 0.00, r: 100, g: 5,   b: 5   },  // deep red (never worked / 0%)
  { t: 0.20, r: 200, g: 30,  b: 0   },  // red
  { t: 0.40, r: 230, g: 110, b: 0   },  // orange
  { t: 0.60, r: 218, g: 195, b: 0   },  // yellow
  { t: 0.80, r: 100, g: 210, b: 50  },  // light green
  { t: 1.00, r: 0,   g: 168, b: 40  },  // deep green (at goal)
];

function interpolate(t) {
  const clamped = Math.max(0, Math.min(t, 1));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const f = (clamped - a.t) / (b.t - a.t);
      const r = Math.round(a.r + f * (b.r - a.r));
      const g = Math.round(a.g + f * (b.g - a.g));
      const bl = Math.round(a.b + f * (b.b - a.b));
      return `rgb(${r},${g},${bl})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1].r},${STOPS[STOPS.length - 1].g},${STOPS[STOPS.length - 1].b})`;
}

export function getMuscleColor(bestWeight, goalWeight) {
  if (!goalWeight || goalWeight <= 0) return '#2a2a2a'; // no goal set
  if (!bestWeight || bestWeight <= 0) return interpolate(0); // never worked
  return interpolate(bestWeight / goalWeight);
}

export function getStrengthPercent(bestWeight, goalWeight) {
  if (!goalWeight || goalWeight <= 0) return 0;
  return Math.min(Math.round((bestWeight / goalWeight) * 100), 100);
}

// Returns hex string for display in legend
export function getLegendColors() {
  return [0, 0.2, 0.4, 0.6, 0.8, 1.0].map(t => interpolate(t));
}
