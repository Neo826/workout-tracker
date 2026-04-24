import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getWorkouts, getExercises, getMuscleGroups, getMuscleProgress,
  addWorkoutLog, deleteWorkoutEntry, getTodayLogsForMuscle,
  getTodayString, saveCustomExercise, MUSCLE_LABELS, MUSCLE_IDS,
} from '../utils/storage';
import { getMuscleColor } from '../utils/colors';
import { EXERCISE_INFO, openTutorial } from '../utils/exercises';
import ExerciseCard from '../components/ExerciseCard';

export default function WorkoutScreen({ route, navigation }) {
  const { muscleGroup, muscleName } = route.params;

  const [todayLogs, setTodayLogs] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [muscleExercises, setMuscleExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [infoExercise, setInfoExercise] = useState(null);
  const [sets, setSets] = useState([{ reps: '', weight: '' }]);
  const [progress, setProgress] = useState(0);
  const [targetVolume, setTargetVolume] = useState(0);

  // Custom exercise modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscles, setCustomMuscles] = useState({}); // { muscleId: percentage (0-100) }

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: `${muscleName} Workout` });
  }, [muscleName]);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    const [logs, exercises, groups] = await Promise.all([
      getWorkouts(), getExercises(), getMuscleGroups(),
    ]);
    const filtered = exercises
      .filter(e => e.muscleContributions.some(c => c.muscleId === muscleGroup && c.percentage > 0))
      .sort((a, b) => {
        const aPct = a.muscleContributions.find(c => c.muscleId === muscleGroup)?.percentage || 0;
        const bPct = b.muscleContributions.find(c => c.muscleId === muscleGroup)?.percentage || 0;
        return bPct - aPct;
      });
    setAllExercises(exercises);
    setMuscleExercises(filtered);
    setTodayLogs(getTodayLogsForMuscle(logs, muscleGroup, exercises));
    const p = getMuscleProgress(muscleGroup, exercises, logs, groups);
    setProgress(p);
    setTargetVolume(groups[muscleGroup]?.targetVolume || 0);
  };

  const addSet = () => setSets(p => [...p, { reps: '', weight: '' }]);
  const removeSet = (i) => setSets(p => p.filter((_, idx) => idx !== i));
  const updateSet = (i, field, val) => setSets(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleLog = async () => {
    if (!selectedExercise) { Alert.alert('Missing', 'Select an exercise first.'); return; }
    const validSets = sets.filter(s => s.reps && s.weight && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
    if (validSets.length === 0) { Alert.alert('Missing', 'Add at least one complete set (weight + reps).'); return; }
    try {
      await addWorkoutLog({
        exerciseId: selectedExercise.id,
        date: getTodayString(),
        sets: validSets.map(s => ({ reps: parseInt(s.reps), weight: parseFloat(s.weight) })),
      });
      setSelectedExercise(null);
      setSets([{ reps: '', weight: '' }]);
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

  const getLogExerciseName = (log) => {
    if (log.exerciseId) {
      return allExercises.find(e => e.id === log.exerciseId)?.name || log.exerciseId;
    }
    return log.exercise || 'Unknown';
  };

  // ── Custom exercise modal helpers ──────────────────────────────────────────

  const toggleCustomMuscle = (id) => {
    setCustomMuscles(prev => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
        // Redistribute to remaining
        const remaining = Object.keys(next);
        if (remaining.length > 0) {
          const evenSplit = Math.floor(100 / remaining.length);
          remaining.forEach((m, i) => {
            next[m] = i === remaining.length - 1
              ? 100 - evenSplit * (remaining.length - 1)
              : evenSplit;
          });
        }
      } else {
        next[id] = 0;
        const keys = Object.keys(next);
        const evenSplit = Math.floor(100 / keys.length);
        keys.forEach((m, i) => {
          next[m] = i === keys.length - 1
            ? 100 - evenSplit * (keys.length - 1)
            : evenSplit;
        });
      }
      return next;
    });
  };

  const adjustCustomMuscle = (id, delta) => {
    setCustomMuscles(prev => {
      const keys = Object.keys(prev);
      if (keys.length < 2) return prev;
      const current = prev[id];
      const newVal = Math.max(5, Math.min(95, current + delta));
      if (newVal === current) return prev;
      const diff = newVal - current;
      // Distribute the diff across other muscles proportionally
      const others = keys.filter(k => k !== id);
      const othersTotal = others.reduce((s, k) => s + prev[k], 0);
      const next = { ...prev, [id]: newVal };
      if (othersTotal > 0) {
        let remaining = -diff;
        others.forEach((k, i) => {
          if (i === others.length - 1) {
            next[k] = Math.max(5, prev[k] + remaining);
          } else {
            const share = Math.round((-diff) * (prev[k] / othersTotal));
            next[k] = Math.max(5, prev[k] + share);
            remaining -= share;
          }
        });
      }
      // Clamp and re-normalize to exactly 100
      keys.forEach(k => { next[k] = Math.max(5, next[k]); });
      const total = keys.reduce((s, k) => s + next[k], 0);
      if (total !== 100) next[id] = Math.max(5, next[id] + (100 - total));
      return next;
    });
  };

  const handleSaveCustomExercise = async () => {
    if (!customName.trim()) { Alert.alert('Missing', 'Enter an exercise name.'); return; }
    const keys = Object.keys(customMuscles);
    if (keys.length === 0) { Alert.alert('Missing', 'Select at least one muscle group.'); return; }
    const total = keys.reduce((s, k) => s + customMuscles[k], 0);
    if (Math.abs(total - 100) > 1) { Alert.alert('Error', `Percentages must sum to 100 (currently ${total}%).`); return; }
    const muscleContributions = keys.map(k => ({ muscleId: k, percentage: customMuscles[k] / 100 }));
    await saveCustomExercise({ name: customName.trim(), muscleContributions });
    setShowCustomModal(false);
    setCustomName('');
    setCustomMuscles({});
    loadData();
    Alert.alert('Saved', `"${customName.trim()}" added to your exercise library.`);
  };

  const strengthColor = getMuscleColor(progress);
  const strengthPct = Math.round(progress * 100);
  const currentVolume = Math.round(progress * targetVolume);
  const info = infoExercise ? EXERCISE_INFO[infoExercise.name] : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        {/* Progress card */}
        <View style={styles.strengthCard}>
          <View style={styles.strengthTop}>
            <View>
              <Text style={styles.strengthTitle}>Volume Progress</Text>
              <Text style={styles.strengthGoal}>
                {currentVolume.toLocaleString()} / {targetVolume.toLocaleString()} lbs (decayed)
              </Text>
            </View>
            <Text style={[styles.strengthPct, { color: strengthColor }]}>{strengthPct}%</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${strengthPct}%`, backgroundColor: strengthColor }]} />
          </View>
        </View>

        {/* Exercise library for this muscle */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <Text style={styles.sectionSub}>Tap to select · hold for form tips</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cardsContent}>
          {muscleExercises.slice(0, 8).map(ex => (
            <ExerciseCard
              key={ex.id}
              name={ex.name}
              selected={selectedExercise?.id === ex.id}
              onSelect={() => setSelectedExercise(ex)}
              onInfo={() => setInfoExercise(ex)}
            />
          ))}
          <TouchableOpacity style={styles.customExCard} onPress={() => setShowCustomModal(true)}>
            <Text style={styles.customExPlus}>+</Text>
            <Text style={styles.customExLabel}>Custom</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Selected exercise badge */}
        {selectedExercise && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeLabel}>Selected:</Text>
            <Text style={styles.selectedBadgeName}>{selectedExercise.name}</Text>
            <TouchableOpacity onPress={() => setSelectedExercise(null)}>
              <Text style={styles.selectedBadgeClear}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's log */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Log</Text>
        </View>
        {todayLogs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No exercises logged today.{'\n'}Select an exercise above to get started.</Text>
          </View>
        ) : todayLogs.map(log => {
          const name = getLogExerciseName(log);
          const vol = log.sets.reduce((s, x) => s + x.weight * x.reps, 0);
          const maxW = Math.max(...log.sets.map(s => s.weight));
          return (
            <View key={log.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{name}</Text>
                <TouchableOpacity onPress={() => handleDelete(log.id, name)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              {log.sets.map((set, i) => (
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

        {/* Sets input */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Log Sets</Text>
        </View>
        <View style={styles.addCard}>
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
      <Modal visible={!!infoExercise} transparent animationType="slide" onRequestClose={() => setInfoExercise(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoExercise(null)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            <Text style={styles.modalTitle}>{infoExercise?.name}</Text>
            {info ? (
              <>
                <Text style={styles.modalSection}>Primary Muscles</Text>
                <View style={styles.modalMuscles}>
                  {(info.muscles || []).map(m => (
                    <View key={m} style={styles.muscleTag}>
                      <Text style={styles.muscleTagText}>{MUSCLE_LABELS[m] || m}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.modalSection}>Form Tips</Text>
                {(info.tips || []).map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipNum}>{i + 1}</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.modalSection}>Muscle Contributions</Text>
                <View style={styles.modalMuscles}>
                  {(infoExercise?.muscleContributions || []).map(c => (
                    <View key={c.muscleId} style={styles.muscleTag}>
                      <Text style={styles.muscleTagText}>
                        {MUSCLE_LABELS[c.muscleId] || c.muscleId} {Math.round(c.percentage * 100)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            <TouchableOpacity style={styles.youtubeBtn} onPress={() => openTutorial(infoExercise?.name)}>
              <Text style={styles.youtubeBtnText}>▶  Watch Tutorial on YouTube</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.useBtn} onPress={() => { setSelectedExercise(infoExercise); setInfoExercise(null); }}>
              <Text style={styles.useBtnText}>Use This Exercise</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Custom exercise creation modal */}
      <Modal visible={showCustomModal} transparent animationType="slide" onRequestClose={() => setShowCustomModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCustomModal(false)}>
          <TouchableOpacity style={[styles.modalCard, styles.customModalCard]} activeOpacity={1}>
            <Text style={styles.modalTitle}>Create Custom Exercise</Text>

            <Text style={styles.fieldLabel}>Exercise Name</Text>
            <TextInput
              style={styles.customNameInput}
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. Bulgarian Split Squat"
              placeholderTextColor="#555"
              autoFocus
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
              Muscle Contributions
              {Object.keys(customMuscles).length > 0 &&
                ` — Total: ${Object.values(customMuscles).reduce((s, v) => s + v, 0)}%`}
            </Text>

            <ScrollView style={styles.customMuscleList} nestedScrollEnabled>
              {MUSCLE_IDS.map(id => {
                const isSelected = customMuscles[id] !== undefined;
                const pct = customMuscles[id] || 0;
                return (
                  <View key={id} style={styles.customMuscleRow}>
                    <TouchableOpacity
                      style={[styles.customMuscleCheck, isSelected && styles.customMuscleCheckOn]}
                      onPress={() => toggleCustomMuscle(id)}
                    >
                      {isSelected && <Text style={styles.customMuscleCheckMark}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={[styles.customMuscleName, isSelected && styles.customMuscleNameOn]}>
                      {MUSCLE_LABELS[id]}
                    </Text>
                    {isSelected && (
                      <View style={styles.customMuscleSlider}>
                        <TouchableOpacity
                          style={styles.customMuscleBtn}
                          onPress={() => adjustCustomMuscle(id, -5)}
                        >
                          <Text style={styles.customMuscleBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.customMusclePct}>{pct}%</Text>
                        <TouchableOpacity
                          style={styles.customMuscleBtn}
                          onPress={() => adjustCustomMuscle(id, 5)}
                        >
                          <Text style={styles.customMuscleBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.logBtn} onPress={handleSaveCustomExercise}>
              <Text style={styles.logBtnText}>Save Exercise</Text>
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
  barBg: { backgroundColor: '#2a2a2a', borderRadius: 5, height: 8 },
  barFill: { height: 8, borderRadius: 5 },

  sectionHeader: { marginBottom: 8 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  sectionSub: { color: '#555', fontSize: 11, marginTop: 2 },
  cardsScroll: { marginBottom: 14 },
  cardsContent: { paddingRight: 16, gap: 8 },

  customExCard: {
    width: 90, height: 100, backgroundColor: '#1a1a1a', borderRadius: 12,
    borderWidth: 1, borderColor: '#333', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  customExPlus: { color: '#00d4ff', fontSize: 28, fontWeight: '300' },
  customExLabel: { color: '#555', fontSize: 11, marginTop: 4 },

  selectedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1a2a1a', borderRadius: 10, padding: 10,
    marginBottom: 14, borderWidth: 1, borderColor: '#00d4ff33',
  },
  selectedBadgeLabel: { color: '#555', fontSize: 12 },
  selectedBadgeName: { color: '#00d4ff', fontSize: 14, fontWeight: '700', flex: 1 },
  selectedBadgeClear: { color: '#555', fontSize: 14 },

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
  exerciseFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#2a2a2a',
  },
  volumeText: { color: '#666', fontSize: 11 },
  bestText: { color: '#666', fontSize: 11 },

  addCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 40 },
  fieldLabel: { color: '#888', fontSize: 12, fontWeight: '600', marginBottom: 6 },
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

  // Exercise info modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, borderWidth: 1, borderColor: '#2a2a2a',
  },
  customModalCard: { maxHeight: '85%' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 18 },
  modalSection: { color: '#555', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  modalMuscles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  muscleTag: { backgroundColor: '#252525', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#00d4ff' },
  muscleTagText: { color: '#00d4ff', fontSize: 12, fontWeight: '600' },
  tipRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  tipNum: { color: '#00d4ff', fontWeight: '800', fontSize: 14, width: 18 },
  tipText: { color: '#ccc', fontSize: 13, lineHeight: 19, flex: 1 },
  youtubeBtn: {
    backgroundColor: '#ff0000', borderRadius: 10, padding: 14,
    alignItems: 'center', marginTop: 18, marginBottom: 10,
  },
  youtubeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  useBtn: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  useBtnText: { color: '#0f0f0f', fontWeight: '800', fontSize: 15 },

  // Custom exercise modal
  customNameInput: {
    backgroundColor: '#252525', borderRadius: 8, padding: 12, color: '#fff', fontSize: 15,
  },
  customMuscleList: { maxHeight: 280, marginBottom: 16 },
  customMuscleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#252525',
  },
  customMuscleCheck: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: '#444',
    alignItems: 'center', justifyContent: 'center',
  },
  customMuscleCheckOn: { backgroundColor: '#00d4ff', borderColor: '#00d4ff' },
  customMuscleCheckMark: { color: '#0f0f0f', fontSize: 13, fontWeight: '800' },
  customMuscleName: { color: '#555', fontSize: 14, flex: 1 },
  customMuscleNameOn: { color: '#fff' },
  customMuscleSlider: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  customMuscleBtn: {
    width: 28, height: 28, backgroundColor: '#252525', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333',
  },
  customMuscleBtnText: { color: '#00d4ff', fontSize: 18, fontWeight: '700', lineHeight: 22 },
  customMusclePct: { color: '#fff', fontSize: 14, fontWeight: '700', width: 38, textAlign: 'center' },
});
