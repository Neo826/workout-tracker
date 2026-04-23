import * as FileSystem from 'expo-file-system/legacy';

const WORKOUTS_FILE = FileSystem.documentDirectory + 'workouts.json';
const GOALS_FILE = FileSystem.documentDirectory + 'goals.json';

export const MUSCLE_LABELS = {
  chest:      'Chest',
  shoulders:  'Deltoids',
  biceps:     'Biceps',
  triceps:    'Triceps',
  abs:        'Abs',
  obliques:   'Obliques',
  quads:      'Quadriceps',
  upper_back: 'Upper Back',
  lats:       'Lats',
  lower_back: 'Lower Back',
  glutes:     'Glutes',
  hamstrings: 'Hamstrings',
  calves:     'Calves',
};

export const MUSCLE_EXERCISES = {
  chest:      ['Bench Press', 'Incline Bench Press', 'Dumbbell Fly', 'Push-Ups', 'Cable Fly', 'Decline Bench Press', 'Weighted Dips'],
  shoulders:  ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Arnold Press', 'Face Pull', 'Upright Row', 'Military Press'],
  biceps:     ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl', 'Concentration Curl', 'Chin-Ups'],
  triceps:    ['Skull Crusher', 'Tricep Pushdown', 'Tricep Dip', 'Overhead Extension', 'Close Grip Bench', 'Diamond Push-Up', 'Kickback'],
  abs:        ['Crunch', 'Plank', 'Leg Raise', 'Cable Crunch', 'Ab Wheel', 'Hanging Leg Raise', 'Mountain Climbers'],
  obliques:   ['Russian Twist', 'Wood Chop', 'Side Plank', 'Oblique Crunch', 'Cable Wood Chop', 'Bicycle Crunch'],
  quads:      ['Squat', 'Leg Press', 'Leg Extension', 'Lunges', 'Bulgarian Split Squat', 'Hack Squat', 'Wall Sit'],
  upper_back: ['Barbell Shrug', 'Dumbbell Shrug', 'Face Pull', 'Rack Pull', 'Upright Row', 'Bent-Over Lateral Raise'],
  lats:       ['Lat Pulldown', 'Pull-Up', 'Seated Cable Row', 'Bent-Over Row', 'Single Arm Row', 'Straight Arm Pulldown'],
  lower_back: ['Deadlift', 'Romanian Deadlift', 'Back Extension', 'Bird Dog', 'Superman', 'Good Morning'],
  glutes:     ['Hip Thrust', 'Glute Bridge', 'Kettlebell Swing', 'Sumo Deadlift', 'Cable Kickback', 'Step-Up'],
  hamstrings: ['Romanian Deadlift', 'Leg Curl', 'Lying Leg Curl', 'Nordic Curl', 'Stiff-Leg Deadlift', 'Good Morning'],
  calves:     ['Standing Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise', 'Box Jump', 'Jump Rope', 'Single-Leg Calf Raise'],
};

export const DEFAULT_GOALS = {
  chest:      { exercise: 'Bench Press',          maxWeight: 225 },
  shoulders:  { exercise: 'Overhead Press',        maxWeight: 135 },
  biceps:     { exercise: 'Barbell Curl',           maxWeight: 100 },
  triceps:    { exercise: 'Tricep Pushdown',        maxWeight: 100 },
  abs:        { exercise: 'Cable Crunch',           maxWeight: 100 },
  obliques:   { exercise: 'Russian Twist',          maxWeight: 45  },
  quads:      { exercise: 'Squat',                  maxWeight: 315 },
  upper_back: { exercise: 'Barbell Shrug',          maxWeight: 225 },
  lats:       { exercise: 'Lat Pulldown',           maxWeight: 150 },
  lower_back: { exercise: 'Deadlift',               maxWeight: 315 },
  glutes:     { exercise: 'Hip Thrust',             maxWeight: 225 },
  hamstrings: { exercise: 'Romanian Deadlift',      maxWeight: 225 },
  calves:     { exercise: 'Standing Calf Raise',    maxWeight: 150 },
};

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

async function readJSON(path, fallback) {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return fallback;
    const raw = await FileSystem.readAsStringAsync(path);
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJSON(path, data) {
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
}

export async function getWorkouts() {
  return readJSON(WORKOUTS_FILE, []);
}

export async function addWorkoutEntry(entry) {
  const workouts = await getWorkouts();
  workouts.push({ ...entry, id: Date.now().toString(), timestamp: Date.now() });
  await writeJSON(WORKOUTS_FILE, workouts);
}

export async function deleteWorkoutEntry(id) {
  const workouts = await getWorkouts();
  await writeJSON(WORKOUTS_FILE, workouts.filter(w => w.id !== id));
}

export async function getGoals() {
  const saved = await readJSON(GOALS_FILE, {});
  return { ...DEFAULT_GOALS, ...saved };
}

export async function saveGoals(goals) {
  await writeJSON(GOALS_FILE, goals);
}

export function getBestWeight(workouts, muscleGroup) {
  const entries = workouts.filter(w => w.muscleGroup === muscleGroup);
  if (entries.length === 0) return 0;
  return Math.max(...entries.flatMap(w => w.sets.map(s => s.weight)), 0);
}

export function getTodayWorkouts(workouts, muscleGroup) {
  const today = getTodayString();
  return workouts.filter(w => w.date === today && w.muscleGroup === muscleGroup);
}
