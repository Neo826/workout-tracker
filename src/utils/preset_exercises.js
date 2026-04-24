export const PRESET_EXERCISES = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'chest',      percentage: 0.6 },
      { muscleId: 'triceps',    percentage: 0.3 },
      { muscleId: 'front_delt', percentage: 0.1 },
    ],
  },
  {
    id: 'squat',
    name: 'Squat',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'quads',      percentage: 0.5 },
      { muscleId: 'glutes',     percentage: 0.3 },
      { muscleId: 'hamstrings', percentage: 0.2 },
    ],
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'hamstrings', percentage: 0.4 },
      { muscleId: 'glutes',     percentage: 0.3 },
      { muscleId: 'lower_back', percentage: 0.2 },
      { muscleId: 'traps',      percentage: 0.1 },
    ],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'front_delt',  percentage: 0.6 },
      { muscleId: 'triceps',     percentage: 0.3 },
      { muscleId: 'upper_chest', percentage: 0.1 },
    ],
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'lats',      percentage: 0.5  },
      { muscleId: 'rhomboids', percentage: 0.25 },
      { muscleId: 'rear_delt', percentage: 0.15 },
      { muscleId: 'biceps',    percentage: 0.1  },
    ],
  },
  {
    id: 'pull-up',
    name: 'Pull Up',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'lats',      percentage: 0.6  },
      { muscleId: 'biceps',    percentage: 0.25 },
      { muscleId: 'rear_delt', percentage: 0.15 },
    ],
  },
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'biceps', percentage: 1.0 },
    ],
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'triceps', percentage: 1.0 },
    ],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'quads',      percentage: 0.6  },
      { muscleId: 'glutes',     percentage: 0.25 },
      { muscleId: 'hamstrings', percentage: 0.15 },
    ],
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    isCustom: false,
    muscleContributions: [
      { muscleId: 'side_delt', percentage: 1.0 },
    ],
  },
];
