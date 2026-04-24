import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWorkouts, getExercises, MUSCLE_LABELS, MUSCLE_IDS } from '../utils/storage';

const FILTERS = ['All', ...MUSCLE_IDS.map(id => MUSCLE_LABELS[id])];
const FILTER_KEYS = Object.fromEntries([
  ['All', null],
  ...MUSCLE_IDS.map(id => [MUSCLE_LABELS[id], id]),
]);

export default function HistoryScreen() {
  const [grouped, setGrouped] = useState([]);
  const [filter, setFilter] = useState('All');
  const [allLogs, setAllLogs] = useState([]);
  const [exercises, setExercises] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const [logs, exs] = await Promise.all([getWorkouts(), getExercises()]);
      setAllLogs(logs);
      setExercises(exs);
      groupLogs(logs, exs, filter);
    })();
  }, []));

  const resolveExerciseName = (log, exs) => {
    if (log.exerciseId) {
      return exs.find(e => e.id === log.exerciseId)?.name || log.exerciseId;
    }
    return log.exercise || 'Unknown';
  };

  const logMatchesMuscle = (log, muscleId, exs) => {
    if (log.exerciseId) {
      const ex = exs.find(e => e.id === log.exerciseId);
      return ex?.muscleContributions.some(c => c.muscleId === muscleId);
    }
    return log.muscleGroup === muscleId;
  };

  const LEGACY_EXPAND = {
    shoulders:  ['front_delt', 'side_delt', 'rear_delt'],
    upper_back: ['rhomboids', 'traps'],
  };

  const getLogMuscles = (log, exs) => {
    if (log.exerciseId) {
      const ex = exs.find(e => e.id === log.exerciseId);
      return ex?.muscleContributions.map(c => c.muscleId) || [];
    }
    if (!log.muscleGroup) return [];
    return LEGACY_EXPAND[log.muscleGroup] || [log.muscleGroup];
  };

  const groupLogs = (logs, exs, activeFilter) => {
    const muscleKey = FILTER_KEYS[activeFilter];
    const filtered = muscleKey
      ? logs.filter(log => logMatchesMuscle(log, muscleKey, exs))
      : logs;
    const map = {};
    filtered.forEach(log => {
      if (!map[log.date]) map[log.date] = [];
      map[log.date].push(log);
    });
    setGrouped(Object.entries(map).sort(([a], [b]) => b.localeCompare(a)));
  };

  const handleFilter = (f) => {
    setFilter(f);
    groupLogs(allLogs, exercises, f);
  };

  if (grouped.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filters}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => handleFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No workouts logged yet.{'\n'}Tap a muscle on the home screen to start.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => handleFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list}>
        {grouped.map(([date, logs]) => {
          const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric',
          });
          const allMuscleIds = [...new Set(logs.flatMap(log => getLogMuscles(log, exercises)))];
          const totalSets = logs.reduce((s, log) => s + log.sets.length, 0);
          const totalVol = logs.reduce((s, log) => s + log.sets.reduce((sv, set) => sv + set.weight * set.reps, 0), 0);

          return (
            <View key={date} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayDate}>{label}</Text>
                <Text style={styles.daySummary}>{totalSets} sets · {totalVol.toLocaleString()} lbs volume</Text>
              </View>

              <View style={styles.muscleTags}>
                {allMuscleIds.map(m => (
                  <View key={m} style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>{MUSCLE_LABELS[m] || m}</Text>
                  </View>
                ))}
              </View>

              {logs.map(log => {
                const name = resolveExerciseName(log, exercises);
                const best = Math.max(...log.sets.map(s => s.weight));
                return (
                  <View key={log.id} style={styles.entryRow}>
                    <View style={styles.entryLeft}>
                      <Text style={styles.entryExercise}>{name}</Text>
                      <Text style={styles.entrySets}>{log.sets.length} sets</Text>
                    </View>
                    <View style={styles.entryRight}>
                      <Text style={styles.entryBest}>{best} lbs</Text>
                      <Text style={styles.entryBestLabel}>best set</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  filterScroll: { maxHeight: 52, flexGrow: 0, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  filters: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 16, backgroundColor: '#1a1a1a',
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  filterChipActive: { backgroundColor: '#00d4ff', borderColor: '#00d4ff' },
  filterText: { color: '#666', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#0f0f0f' },
  list: { flex: 1, padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#444', textAlign: 'center', lineHeight: 24 },

  dayCard: {
    backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a2a',
  },
  dayHeader: { marginBottom: 10 },
  dayDate: { color: '#fff', fontSize: 16, fontWeight: '700' },
  daySummary: { color: '#555', fontSize: 12, marginTop: 2 },
  muscleTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  muscleTag: {
    borderWidth: 1, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3, borderColor: '#333',
  },
  muscleTagText: { color: '#aaa', fontSize: 11, fontWeight: '600' },

  entryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#252525',
  },
  entryLeft: {},
  entryExercise: { color: '#ddd', fontSize: 14, fontWeight: '600' },
  entrySets: { color: '#555', fontSize: 11, marginTop: 2 },
  entryRight: { alignItems: 'flex-end' },
  entryBest: { color: '#00d4ff', fontSize: 14, fontWeight: '700' },
  entryBestLabel: { color: '#444', fontSize: 10, marginTop: 1 },
});
