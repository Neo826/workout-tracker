import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWorkouts, MUSCLE_LABELS } from '../utils/storage';
import { getMuscleColor } from '../utils/colors';

const FILTERS = ['All', 'Chest', 'Deltoids', 'Biceps', 'Triceps', 'Abs', 'Obliques', 'Quadriceps', 'Upper Back', 'Lats', 'Lower Back', 'Glutes', 'Hamstrings', 'Calves'];
const FILTER_KEYS = {
  'All': null, 'Chest': 'chest', 'Deltoids': 'shoulders', 'Biceps': 'biceps',
  'Triceps': 'triceps', 'Abs': 'abs', 'Obliques': 'obliques', 'Quadriceps': 'quads',
  'Upper Back': 'upper_back', 'Lats': 'lats', 'Lower Back': 'lower_back',
  'Glutes': 'glutes', 'Hamstrings': 'hamstrings', 'Calves': 'calves',
};

export default function HistoryScreen({ navigation }) {
  const [grouped, setGrouped] = useState([]);
  const [filter, setFilter] = useState('All');
  const [allWorkouts, setAllWorkouts] = useState([]);

  useFocusEffect(useCallback(() => {
    getWorkouts().then(w => {
      setAllWorkouts(w);
      groupWorkouts(w, filter);
    });
  }, []));

  const groupWorkouts = (workouts, activeFilter) => {
    const key = FILTER_KEYS[activeFilter];
    const filtered = key ? workouts.filter(w => w.muscleGroup === key) : workouts;
    const map = {};
    filtered.forEach(w => {
      if (!map[w.date]) map[w.date] = [];
      map[w.date].push(w);
    });
    setGrouped(Object.entries(map).sort(([a], [b]) => b.localeCompare(a)));
  };

  const handleFilter = (f) => {
    setFilter(f);
    groupWorkouts(allWorkouts, f);
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
        {grouped.map(([date, entries]) => {
          const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric',
          });
          const muscles = [...new Set(entries.map(e => e.muscleGroup))];
          const totalSets = entries.reduce((s, e) => s + e.sets.length, 0);
          const totalVol = entries.reduce((s, e) => s + e.sets.reduce((sv, set) => sv + set.weight * set.reps, 0), 0);

          return (
            <View key={date} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayDate}>{label}</Text>
                <Text style={styles.daySummary}>{totalSets} sets · {totalVol.toLocaleString()} lbs volume</Text>
              </View>

              <View style={styles.muscleTags}>
                {muscles.map(m => (
                  <View key={m} style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>{MUSCLE_LABELS[m]}</Text>
                  </View>
                ))}
              </View>

              {entries.map(entry => {
                const best = Math.max(...entry.sets.map(s => s.weight));
                return (
                  <View key={entry.id} style={styles.entryRow}>
                    <View style={styles.entryLeft}>
                      <Text style={styles.entryExercise}>{entry.exercise}</Text>
                      <Text style={styles.entrySets}>{entry.sets.length} sets</Text>
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
