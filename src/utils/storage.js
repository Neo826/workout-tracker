import * as FileSystem from 'expo-file-system/legacy';
import { PRESET_EXERCISES } from './preset_exercises';

const WORKOUTS_FILE = FileSystem.documentDirectory + 'workouts.json';
const GOALS_FILE = FileSystem.documentDirectory + 'goals.json';
const EXERCISES_FILE = FileSystem.documentDirectory + 'custom_exercises.json';
const MUSCLE_GROUPS_FILE = FileSystem.documentDirectory + 'muscle_groups.json';

export const MUSCLE_LABELS = {
  chest:       'Chest',
  upper_chest: 'Upper Chest',
  front_delt:  'Front Delt',
  side_delt:   'Side Delt',
  rear_delt:   'Rear Delt',
  biceps:      'Biceps',
  triceps:     'Triceps',
  lats:        'Lats',
  rhomboids:   'Rhomboids',
  traps:       'Traps',
  lower_back:  'Lower Back',
  quads:       'Quads',
  hamstrings:  'Hamstrings',
  glutes:      'Glutes',
};

export const MUSCLE_IDS = Object.keys(MUSCLE_LABELS);

// Kept for legacy exercise card / form tips lookup
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

export const DEFAULT_MUSCLE_GROUPS = {
  chest:       { id: 'chest',       name: 'Chest',        targetVolume: 4500 },
  quads:       { id: 'quads',       name: 'Quads',        targetVolume: 5000 },
  hamstrings:  { id: 'hamstrings',  name: 'Hamstrings',   targetVolume: 4000 },
  glutes:      { id: 'glutes',      name: 'Glutes',       targetVolume: 3500 },
  lats:        { id: 'lats',        name: 'Lats',         targetVolume: 4500 },
  rhomboids:   { id: 'rhomboids',   name: 'Rhomboids',    targetVolume: 3000 },
  triceps:     { id: 'triceps',     name: 'Triceps',      targetVolume: 3500 },
  biceps:      { id: 'biceps',      name: 'Biceps',       targetVolume: 3000 },
  front_delt:  { id: 'front_delt',  name: 'Front Delt',   targetVolume: 2500 },
  side_delt:   { id: 'side_delt',   name: 'Side Delt',    targetVolume: 2500 },
  rear_delt:   { id: 'rear_delt',   name: 'Rear Delt',    targetVolume: 2000 },
  traps:       { id: 'traps',       name: 'Traps',        targetVolume: 2500 },
  lower_back:  { id: 'lower_back',  name: 'Lower Back',   targetVolume: 2500 },
  upper_chest: { id: 'upper_chest', name: 'Upper Chest',  targetVolume: 2000 },
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

// ── Workout logs ──────────────────────────────────────────────────────────────

export async function getWorkouts() {
  return readJSON(WORKOUTS_FILE, []);
}

// New format: { exerciseId, date, sets }
export async function addWorkoutLog(log) {
  const workouts = await getWorkouts();
  workouts.push({ ...log, id: Date.now().toString(), timestamp: Date.now() });
  await writeJSON(WORKOUTS_FILE, workouts);
}

// Legacy format: { muscleGroup, exercise, date, sets }
export async function addWorkoutEntry(entry) {
  const workouts = await getWorkouts();
  workouts.push({ ...entry, id: Date.now().toString(), timestamp: Date.now() });
  await writeJSON(WORKOUTS_FILE, workouts);
}

export async function deleteWorkoutEntry(id) {
  const workouts = await getWorkouts();
  await writeJSON(WORKOUTS_FILE, workouts.filter(w => w.id !== id));
}

// ── Exercise library ──────────────────────────────────────────────────────────

export async function getExercises() {
  const custom = await readJSON(EXERCISES_FILE, []);
  return [...PRESET_EXERCISES, ...custom];
}

export async function saveCustomExercise(exercise) {
  const custom = await readJSON(EXERCISES_FILE, []);
  const newEx = { ...exercise, id: Date.now().toString(), isCustom: true };
  custom.push(newEx);
  await writeJSON(EXERCISES_FILE, custom);
  return newEx;
}

// ── Muscle groups / target volumes ───────────────────────────────────────────

export async function getMuscleGroups() {
  const saved = await readJSON(MUSCLE_GROUPS_FILE, {});
  const result = {};
  MUSCLE_IDS.forEach(id => {
    result[id] = { ...DEFAULT_MUSCLE_GROUPS[id], ...(saved[id] || {}) };
  });
  return result;
}

export async function saveMuscleGroups(groups) {
  await writeJSON(MUSCLE_GROUPS_FILE, groups);
}

// ── Volume / progress calculation ─────────────────────────────────────────────

export function getMuscleProgress(muscleId, exercises, logs, muscleGroups) {
  const group = muscleGroups[muscleId];
  if (!group || group.targetVolume <= 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalDecayedVolume = 0;

  for (const log of logs) {
    let contribution = 0;

    if (log.exerciseId) {
      const exercise = exercises.find(e => e.id === log.exerciseId);
      if (!exercise) continue;
      const mc = exercise.muscleContributions.find(c => c.muscleId === muscleId);
      if (!mc) continue;
      contribution = mc.percentage;
    } else if (log.muscleGroup) {
      // Legacy format — map old broad IDs to new granular ones (split evenly)
      const LEGACY_MAP = {
        shoulders:  ['front_delt', 'side_delt', 'rear_delt'],
        upper_back: ['rhomboids', 'traps'],
      };
      const mapped = LEGACY_MAP[log.muscleGroup];
      if (mapped) {
        if (!mapped.includes(muscleId)) continue;
        contribution = 1.0 / mapped.length;
      } else if (log.muscleGroup === muscleId) {
        contribution = 1.0;
      } else {
        continue;
      }
    } else {
      continue;
    }

    const logDate = new Date(log.date + 'T00:00:00');
    const daysSince = Math.max(0, Math.floor((today - logDate) / (1000 * 60 * 60 * 24)));
    const decayFactor = Math.pow(0.95, daysSince);
    const rawVolume = log.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
    totalDecayedVolume += rawVolume * contribution * decayFactor;
  }

  return Math.min(totalDecayedVolume / group.targetVolume, 1.0);
}

// Returns today's logs that involve the given muscle (new + legacy formats)
export function getTodayLogsForMuscle(logs, muscleId, exercises) {
  const today = getTodayString();
  return logs.filter(log => {
    if (log.date !== today) return false;
    if (log.exerciseId) {
      const ex = exercises.find(e => e.id === log.exerciseId);
      return ex?.muscleContributions.some(c => c.muscleId === muscleId);
    }
    return log.muscleGroup === muscleId;
  });
}

// ── Legacy helpers (kept for backward compat) ─────────────────────────────────

export const DEFAULT_GOALS = {
  chest:      { exercise: 'Bench Press',       maxWeight: 225 },
  shoulders:  { exercise: 'Overhead Press',    maxWeight: 135 },
  biceps:     { exercise: 'Barbell Curl',      maxWeight: 100 },
  triceps:    { exercise: 'Tricep Pushdown',   maxWeight: 100 },
  abs:        { exercise: 'Cable Crunch',      maxWeight: 100 },
  obliques:   { exercise: 'Russian Twist',     maxWeight: 45  },
  quads:      { exercise: 'Squat',             maxWeight: 315 },
  upper_back: { exercise: 'Barbell Shrug',     maxWeight: 225 },
  lats:       { exercise: 'Lat Pulldown',      maxWeight: 150 },
  lower_back: { exercise: 'Deadlift',          maxWeight: 315 },
  glutes:     { exercise: 'Hip Thrust',        maxWeight: 225 },
  hamstrings: { exercise: 'Romanian Deadlift', maxWeight: 225 },
  calves:     { exercise: 'Standing Calf Raise', maxWeight: 150 },
};

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
