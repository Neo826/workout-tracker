# Workout Tracker — Claude Code Context

## What this is
A personal React Native / Expo app for Neo Slason to track workouts by muscle group.
Built for personal use on iPhone via Expo Go. Published to Expo cloud via EAS Update so it runs without a Mac.

## Tech stack
- Expo SDK 54, React Native 0.81.5
- `@react-navigation/native` + `@react-navigation/bottom-tabs` + `@react-navigation/native-stack`
- `react-native-svg` — SVG body diagram
- `expo-file-system/legacy` — local data persistence (NOT AsyncStorage — it doesn't work in Expo Go with SDK 54)
- No backend, no auth, all data stored locally on device

## Running the app
```
cd workout-tracker
npx expo start
```
Scan QR code with Expo Go on iPhone. The app is also published to Expo cloud via EAS so it runs without the dev server.

## Publishing updates
```
eas update --branch production --message "description of changes"
```
Then close and reopen the project in Expo Go to pull the latest.

## Project structure
```
App.js                          — Navigation setup (bottom tabs + native stack)
src/
  components/
    BodyDiagram.js              — SVG human body diagram, front/back toggle
    ExerciseCard.js             — Exercise card with SVG equipment illustration
  screens/
    HomeScreen.js               — Body diagram + muscle chips + strength legend
    WorkoutScreen.js            — Log exercises, exercise cards, strength bar
    HistoryScreen.js            — Past workouts grouped by date with filters
    SettingsScreen.js           — Per-muscle goal weight and exercise settings
  utils/
    storage.js                  — All file-based storage (workouts + goals)
    colors.js                   — Muscle strength color interpolation
    exercises.js                — Form tips + YouTube tutorial opener per exercise
    exerciseImages.js           — Maps exercises to equipment type for illustrations
```

## Muscle groups (13 total)
Front view: `chest`, `shoulders` (deltoids), `biceps`, `abs`, `obliques`, `quads`
Back view: `triceps`, `upper_back`, `lats`, `lower_back`, `glutes`, `hamstrings`, `calves`

All defined in `src/utils/storage.js` — MUSCLE_LABELS, MUSCLE_EXERCISES, DEFAULT_GOALS

## Key features
- **Body diagram** — SVG front/back toggle, tap any muscle to open its workout screen
- **Strength color system** — muscles color from dark red (0%) → green (100% of goal weight)
- **Exercise cards** — 5 popular exercises per muscle shown as cards with SVG equipment illustrations (barbell, dumbbell, cable, bodyweight, machine, kettlebell). Tap to select, hold for form tips modal
- **Form tips modal** — shows primary muscles, 3 form cues, YouTube tutorial button
- **Goal tracking** — per-muscle goal weight set in Settings, drives the color system
- **History** — grouped by date, filterable by muscle group

## Important implementation details
- Storage uses `expo-file-system/legacy` not AsyncStorage (AsyncStorage gives "native module is null" error in Expo Go with SDK 54)
- The front/back toggle state lives in HomeScreen.js and is passed down as a prop to BodyDiagram
- Exercise cards use local SVG illustrations — no external image API (Wger API was tried but unreliable)
- `exercises.js` has detailed form tips for ~65 exercises and opens YouTube search for tutorials

## Navigation structure
```
Bottom Tabs:
  💪 Muscles → HomeStack
      HomeScreen
      WorkoutScreen (params: muscleGroup, muscleName)
  📅 History → HistoryScreen
  ⚙️ Settings → SettingsScreen
```

## Owner
Neo Slason — neoslason1@gmail.com — personal use only, iPhone
