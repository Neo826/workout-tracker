import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BodyDiagram from '../components/BodyDiagram';
import { getWorkouts, getGoals, getBestWeight, MUSCLE_LABELS } from '../utils/storage';
import { getMuscleColor, getStrengthPercent, getLegendColors } from '../utils/colors';

const MUSCLES = ['chest', 'shoulders', 'biceps', 'triceps', 'abs', 'obliques', 'quads', 'upper_back', 'lats', 'lower_back', 'glutes', 'hamstrings', 'calves'];

export default function HomeScreen({ navigation }) {
  const [muscleColors, setMuscleColors] = useState({});
  const [muscleStats, setMuscleStats] = useState({});
  const [view, setView] = useState('front');

  useFocusEffect(useCallback(() => {
    (async () => {
      const [workouts, goals] = await Promise.all([getWorkouts(), getGoals()]);
      const colors = {};
      const stats = {};
      MUSCLES.forEach(key => {
        const best = getBestWeight(workouts, key);
        const goal = goals[key];
        colors[key] = getMuscleColor(best, goal?.maxWeight);
        stats[key] = {
          best,
          goalWeight: goal?.maxWeight || 0,
          pct: getStrengthPercent(best, goal?.maxWeight),
        };
      });
      setMuscleColors(colors);
      setMuscleStats(stats);
    })();
  }, []));

  const handleMusclePress = (key) => {
    navigation.navigate('Workout', { muscleGroup: key, muscleName: MUSCLE_LABELS[key] });
  };

  const legendColors = getLegendColors();

  return (
    <View style={styles.container}>
      <View style={styles.diagramWrapper}>
        <BodyDiagram muscleColors={muscleColors} onMusclePress={handleMusclePress} view={view} />
      </View>

      {/* Front/Back toggle — between diagram and chips */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'front' && styles.toggleActive]}
          onPress={() => setView('front')}
        >
          <Text style={[styles.toggleText, view === 'front' && styles.toggleTextActive]}>FRONT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'back' && styles.toggleActive]}
          onPress={() => setView('back')}
        >
          <Text style={[styles.toggleText, view === 'back' && styles.toggleTextActive]}>BACK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {MUSCLES.map(key => {
          const stat = muscleStats[key] || { pct: 0 };
          const color = muscleColors[key] || '#2a2a2a';
          return (
            <TouchableOpacity key={key} style={styles.chip} onPress={() => handleMusclePress(key)}>
              <View style={[styles.chipDot, { backgroundColor: color }]} />
              <Text style={styles.chipLabel}>{MUSCLE_LABELS[key]}</Text>
              <Text style={[styles.chipPct, { color }]}>{stat.pct}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Strength Scale</Text>
        <View style={styles.legendBar}>
          {legendColors.map((color, i) => (
            <View key={i} style={[styles.legendSegment, { backgroundColor: color }]} />
          ))}
        </View>
        <View style={styles.legendRow}>
          <Text style={styles.legendLabel}>Beginner</Text>
          <Text style={styles.legendLabel}>Goal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  diagramWrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  toggle: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#1a1a1a', marginHorizontal: 60, borderRadius: 20, padding: 3, marginBottom: 6, borderWidth: 1, borderColor: '#2a2a2a' },
  toggleBtn: { flex: 1, paddingVertical: 6, borderRadius: 18, alignItems: 'center' },
  toggleActive: { backgroundColor: '#00d4ff' },
  toggleText: { color: '#555', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  toggleTextActive: { color: '#0f0f0f' },
  chipsScroll: { maxHeight: 52, flexGrow: 0 },
  chipsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1a1a1a', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  chipDot: { width: 10, height: 10, borderRadius: 5 },
  chipLabel: { color: '#ccc', fontSize: 12, fontWeight: '600' },
  chipPct: { fontSize: 11, fontWeight: '700' },
  legend: { paddingHorizontal: 20, paddingBottom: 14, paddingTop: 6 },
  legendTitle: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5 },
  legendBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  legendSegment: { flex: 1 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  legendLabel: { color: '#444', fontSize: 10 },
});
