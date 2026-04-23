import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getWorkouts, addWorkoutEntry, deleteWorkoutEntry,
  getTodayWorkouts, getTodayString, getGoals,
  getBestWeight, MUSCLE_EXERCISES, MUSCLE_LABELS,
} from '../utils/storage';
import { getMuscleColor, getStrengthPercent } from '../utils/colors';
import { EXERCISE_INFO, openTutorial } from '../utils/exercises';
import ExerciseCard from '../components/ExerciseCard';

export default function WorkoutScreen({ route, navigation }) {
  const { muscleGroup, muscleName } = route.params;

  const [todayEntries, setTodayEntries] = useState([]);
  const [exercise, setExercise] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sets, setSets] = useState([{ reps: '', weight: '' }]);
  const [strengthColor, setStrengthColor] = useState('#2a2a2a');
  const [strengthPct, setStrengthPct] = useState(0);
  const [goal, setGoal] = useState(null);
  const [bestWeight, setBestWeight] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const suggestions = MUSCLE_EXERCISES[muscleGroup] || [];

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: `${muscleName} Workout` });
  }, [muscleName]);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    const [workouts, goals] = await Promise.all([getWorkouts(), getGoals()]);
    setTodayEntries(getTodayWorkouts(workouts, muscleGroup));
    const g = goals[muscleGroup];
    setGoal(g);
    const best = getBestWeight(workouts, muscleGroup);
    setBestWeight(best);
    setStrengthColor(getMuscleColor(best, g?.maxWeight));
    setStrengthPct(getStrengthPercent(best, g?.maxWeight));
  };

  const addSet = () => setSets(p => [...p, { reps: '', weight: '' }]);
  const removeSet = (i) => setSets(p => p.filter((_, idx) => idx !== i));
  const updateSet = (i, field, val) => setSets(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleLog = async () => {
    if (!exercise.trim()) { Alert.alert('Missing', 'Enter an exercise name.'); return; }
    const validSets = sets.filter(s => s.reps && s.weight && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
    if (validSets.length === 0) { Alert.alert('Missing', 'Add at least one complete set (weight + reps).'); return; }
    try {
      await addWorkoutEntry({
        date: getTodayString(),
        muscleGroup,
        exercise: exercise.trim(),
        sets: validSets.map(s => ({ reps: parseInt(s.reps), weight: parseFloat(s.weight) })),
      });
      setExercise('');
      setSets([{ reps: '', weight: '' }]);
      setShowSuggestions(false);
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save workout.');
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert('Delete', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteWorkoutEntry(id); loadData(); } },
    ]);
  };

  const handleSelectSuggestion = (name) => {
    setExercise(name);
    setShowSuggestions(false);
  };

  const filteredSuggestions = exercise
    ? suggestions.filter(s => s.toLowerCase().includes(exercise.toLowerCase()))
    : suggestions;

  const info = selectedExercise ? EXERCISE_INFO[selectedExercise] : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        {/* Strength card */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthTop}>
            <View>
              <Text style={styles.strengthTitle}>Current Strength</Text>
              {goal && <Text style={styles.strengthGoal}>Goal: {goal.maxWeight} lbs — {goal.exercise}</Text>}
            </View>
            <Text style={[styles.strengthPct, { color: strengthColor }]}>{strengthPct}%</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${strengthPct}%`, backgroundColor: strengthColor }]} />
          </View>
          {bestWeight > 0 && (
            <Text style={styles.strengthBest}>Personal best: {bestWeight} lbs</Text>
          )}
        </View>

        {/* Popular exercises */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Exercises</Text>
          <Text style={styles.sectionSub}>Tap to select · hold for form tips</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cardsContent}>
          {suggestions.slice(0, 5).map(name => (
            <ExerciseCard
              key={name}
              name={name}
              onSelect={(n) => { setExercise(n); setShowSuggestions(false); }}
              onInfo={(n) => setSelectedExercise(n)}
            />
          ))}
        </ScrollView>

        {/* Today's log */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Log</Text>
        </View>

        {todayEntries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No exercises logged today.{'\n'}Add one below to get started.</Text>
          </View>
        ) : todayEntries.map(entry => {
          const vol = entry.sets.reduce((s, x) => s + x.weight * x.reps, 0);
          const maxW = Math.max(...entry.sets.map(s => s.weight));
          return (
            <View key={entry.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{entry.exercise}</Text>
                <TouchableOpacity onPress={() => handleDelete(entry.id, entry.exercise)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              {entry.sets.map((set, i) => (
                <View key={i} style={styles.setRow}>
                  <Text style={styles.setLabel}>Set {i + 1}</Text>
                  <Text style={styles.setDetail}>
                    <Text style={styles.setWeight}>{set.weight} lbs</Text>
                    <Text style={styles.setMid}> × </Text>
                    <Text style={styles.setReps}>{set.reps} reps</Text>
                  </Text>
                </View>
              ))}
              <View style={styles.exerciseFooter}>
                <Text style={styles.volumeText}>Volume: {vol.toLocaleString()} lbs</Text>
                <Text style={styles.bestText}>Best: {maxW} lbs</Text>
              </View>
            </View>
          );
        })}

        {/* Log new exercise */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Log Exercise</Text>
        </View>
        <View style={styles.addCard}>
          <Text style={styles.fieldLabel}>Exercise Name</Text>
          <TextInput
            style={styles.exerciseInput}
            value={exercise}
            onChangeText={(t) => { setExercise(t); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="e.g. Bench Press"
            placeholderTextColor="#555"
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsRow}>
              {filteredSuggestions.map(s => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestion}
                  onPress={() => handleSelectSuggestion(s)}
                  onLongPress={() => setSelectedExercise(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                  <Text style={styles.suggestionHint}>hold for info</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Sets</Text>
          {sets.map((set, i) => (
            <View key={i} style={styles.setInputRow}>
              <Text style={styles.setInputLabel}>Set {i + 1}</Text>
              <TextInput
                style={styles.setInput}
                value={set.weight}
                onChangeText={(v) => updateSet(i, 'weight', v)}
                placeholder="lbs"
                placeholderTextColor="#555"
                keyboardType="decimal-pad"
              />
              <Text style={styles.setX}>×</Text>
              <TextInput
                style={styles.setInput}
                value={set.reps}
                onChangeText={(v) => updateSet(i, 'reps', v)}
                placeholder="reps"
                placeholderTextColor="#555"
                keyboardType="number-pad"
              />
              {sets.length > 1 && (
                <TouchableOpacity onPress={() => removeSet(i)} style={styles.removeSet}>
                  <Text style={styles.removeSetText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addSetBtn} onPress={addSet}>
            <Text style={styles.addSetText}>+ Add Set</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logBtn} onPress={handleLog}>
            <Text style={styles.logBtnText}>Log Exercise</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Exercise info modal */}
      <Modal visible={!!selectedExercise} transparent animationType="slide" onRequestClose={() => setSelectedExercise(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedExercise(null)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            <Text style={styles.modalTitle}>{selectedExercise}</Text>

            {info && (
              <>
                <Text style={styles.modalSection}>Primary Muscles</Text>
                <View style={styles.modalMuscles}>
                  {info.muscles.map(m => (
                    <View key={m} style={styles.muscleTag}>
                      <Text style={styles.muscleTagText}>{MUSCLE_LABELS[m] || m}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.modalSection}>Form Tips</Text>
                {info.tips.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipNum}>{i + 1}</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </>
            )}

            {!info && (
              <Text style={styles.noInfo}>No detailed info available yet for this exercise.</Text>
            )}

            <TouchableOpacity
              style={styles.youtubeBtn}
              onPress={() => { openTutorial(selectedExercise); }}
            >
              <Text style={styles.youtubeBtnText}>▶  Watch Tutorial on YouTube</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.useBtn}
              onPress={() => { handleSelectSuggestion(selectedExercise); setSelectedExercise(null); }}
            >
              <Text style={styles.useBtnText}>Use This Exercise</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },

  strengthCard: {
    backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  strengthTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  strengthTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  strengthGoal: { color: '#555', fontSize: 12, marginTop: 3 },
  strengthPct: { fontSize: 36, fontWeight: '800' },
  barBg: { backgroundColor: '#2a2a2a', borderRadius: 5, height: 8, marginBottom: 8 },
  barFill: { height: 8, borderRadius: 5 },
  strengthBest: { color: '#666', fontSize: 11 },

  sectionHeader: { marginBottom: 8 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  sectionSub: { color: '#555', fontSize: 11, marginTop: 2 },
  cardsScroll: { marginBottom: 20 },
  cardsContent: { paddingRight: 16 },

  empty: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 20 },
  emptyText: { color: '#555', textAlign: 'center', lineHeight: 22 },

  exerciseCard: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a',
  },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  exerciseName: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
  deleteBtn: { color: '#555', fontSize: 16 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  setLabel: { color: '#666', fontSize: 13 },
  setDetail: { fontSize: 13 },
  setWeight: { color: '#00d4ff', fontWeight: '600' },
  setMid: { color: '#555' },
  setReps: { color: '#00ff88', fontWeight: '600' },
  exerciseFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#2a2a2a' },
  volumeText: { color: '#666', fontSize: 11 },
  bestText: { color: '#666', fontSize: 11 },

  addCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 40 },
  fieldLabel: { color: '#888', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  exerciseInput: {
    backgroundColor: '#252525', borderRadius: 8,
    padding: 12, color: '#fff', fontSize: 15,
  },
  suggestionsRow: { marginTop: 8 },
  suggestion: {
    backgroundColor: '#2a2a2a', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 8, marginRight: 8,
    borderWidth: 1, borderColor: '#333', alignItems: 'center',
  },
  suggestionText: { color: '#aaa', fontSize: 12 },
  suggestionHint: { color: '#444', fontSize: 9, marginTop: 2 },

  setInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  setInputLabel: { color: '#666', fontSize: 13, width: 38 },
  setInput: {
    flex: 1, backgroundColor: '#252525', borderRadius: 8,
    padding: 10, color: '#fff', fontSize: 14, textAlign: 'center',
  },
  setX: { color: '#555', fontSize: 16 },
  removeSet: { padding: 6 },
  removeSetText: { color: '#555', fontSize: 14 },

  addSetBtn: {
    borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 8, borderStyle: 'dashed',
    padding: 10, alignItems: 'center', marginBottom: 14, marginTop: 4,
  },
  addSetText: { color: '#555', fontWeight: '600', fontSize: 13 },

  logBtn: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  logBtnText: { color: '#0f0f0f', fontWeight: '800', fontSize: 15 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, borderWidth: 1, borderColor: '#2a2a2a',
  },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 18 },
  modalSection: { color: '#555', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  modalMuscles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  muscleTag: { backgroundColor: '#252525', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#00d4ff' },
  muscleTagText: { color: '#00d4ff', fontSize: 12, fontWeight: '600' },
  tipRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  tipNum: { color: '#00d4ff', fontWeight: '800', fontSize: 14, width: 18 },
  tipText: { color: '#ccc', fontSize: 13, lineHeight: 19, flex: 1 },
  noInfo: { color: '#555', fontSize: 13, marginBottom: 16 },
  youtubeBtn: {
    backgroundColor: '#ff0000', borderRadius: 10, padding: 14,
    alignItems: 'center', marginTop: 18, marginBottom: 10,
  },
  youtubeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  useBtn: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  useBtnText: { color: '#0f0f0f', fontWeight: '800', fontSize: 15 },
});
