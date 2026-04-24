// 3-stop gradient: #8B0000 (deep red) → #FFD700 (yellow) → #006400 (deep green)
const STOPS = [
  { t: 0.0, r: 139, g: 0,   b: 0  },
  { t: 0.5, r: 255, g: 215, b: 0  },
  { t: 1.0, r: 0,   g: 100, b: 0  },
];

function interpolate(t) {
  const clamped = Math.max(0, Math.min(t, 1));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const f = (clamped - a.t) / (b.t - a.t);
      return `rgb(${Math.round(a.r + f * (b.r - a.r))},${Math.round(a.g + f * (b.g - a.g))},${Math.round(a.b + f * (b.b - a.b))})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1].r},${STOPS[STOPS.length - 1].g},${STOPS[STOPS.length - 1].b})`;
}

// progress: 0.0–1.0
export function getMuscleColor(progress) {
  if (progress == null || isNaN(Number(progress))) return '#2a2a2a';
  return interpolate(Number(progress));
}

export function getLegendColors() {
  return [0, 0.2, 0.4, 0.6, 0.8, 1.0].map(t => interpolate(t));
}
