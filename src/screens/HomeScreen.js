import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BodyDiagram from '../components/BodyDiagram';
import { getWorkouts, getExercises, getMuscleGroups, getMuscleProgress, MUSCLE_LABELS, MUSCLE_IDS, DEFAULT_MUSCLE_GROUPS } from '../utils/storage';
import { getMuscleColor, getLegendColors } from '../utils/colors';

// Maps SVG diagram region keys → the new granular muscle IDs they represent
const SVG_REGION_MUSCLES = {
  chest:      ['chest', 'upper_chest'],
  shoulders:  ['front_delt', 'side_delt', 'rear_delt'],
  upper_back: ['rhomboids', 'traps'],
  lats:       ['lats'],
  lower_back: ['lower_back'],
  biceps:     ['biceps'],
  triceps:    ['triceps'],
  quads:      ['quads'],
  glutes:     ['glutes'],
  hamstrings: ['hamstrings'],
  abs:        [],
  obliques:   [],
  calves:     [],
};

// Which muscle panel to show when a SVG region is tapped (view-aware for shoulders)
function svgTapToMuscle(svgKey, view) {
  if (svgKey === 'shoulders') return view === 'front' ? 'front_delt' : 'rear_delt';
  if (svgKey === 'upper_back') return 'traps';
  if (svgKey === 'chest') return 'chest';
  return DEFAULT_MUSCLE_GROUPS[svgKey] ? svgKey : null;
}

export default function HomeScreen({ navigation }) {
  const [muscleColors, setMuscleColors] = useState({});
  const [muscleProgress, setMuscleProgress] = useState({});
  const [muscleVolumes, setMuscleVolumes] = useState({});
  const [muscleGroupData, setMuscleGroupData] = useState({});
  const [view, setView] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  useFocusEffect(useCallback(() => {
    (async () => {
      const [logs, exercises, groups] = await Promise.all([
        getWorkouts(), getExercises(), getMuscleGroups(),
      ]);

      // Progress per granular muscle ID
      const progress = {}, volumes = {};
      MUSCLE_IDS.forEach(id => {
        const p = getMuscleProgress(id, exercises, logs, groups);
        progress[id] = p;
        volumes[id] = p * (groups[id]?.targetVolume || 0);
      });

      // Aggregate granular muscles → SVG diagram region colors (average)
      const svgColors = {};
      Object.entries(SVG_REGION_MUSCLES).forEach(([svgKey, ids]) => {
        if (ids.length === 0) {
          svgColors[svgKey] = '#2a2a2a';
        } else {
          const avg = ids.reduce((s, id) => s + (progress[id] || 0), 0) / ids.length;
          svgColors[svgKey] = getMuscleColor(avg);
        }
      });

      setMuscleColors(svgColors);
      setMuscleProgress(progress);
      setMuscleVolumes(volumes);
      setMuscleGroupData(groups);
    })();
  }, []));

  const handleMusclePress = (svgKey) => {
    const muscleId = svgTapToMuscle(svgKey, view);
    if (muscleId) setSelectedMuscle(muscleId);
  };

  const handleLogWorkout = () => {
    const key = selectedMuscle;
    setSelectedMuscle(null);
    navigation.navigate('Workout', { muscleGroup: key, muscleName: MUSCLE_LABELS[key] });
  };

  const legendColors = getLegendColors();
  const selProgress = selectedMuscle ? (muscleProgress[selectedMuscle] || 0) : 0;
  const selGroup = selectedMuscle ? muscleGroupData[selectedMuscle] : null;
  const selVolume = selectedMuscle ? (muscleVolumes[selectedMuscle] || 0) : 0;
  const selColor = getMuscleColor(selProgress);

  return (
    <View style={styles.container}>
      <View style={styles.diagramWrapper}>
        <BodyDiagram muscleColors={muscleColors} onMusclePress={handleMusclePress} view={view} />
      </View>

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
        {MUSCLE_IDS.map(key => {
          const pct = Math.round((muscleProgress[key] || 0) * 100);
          const color = getMuscleColor(muscleProgress[key] || 0);
          return (
            <TouchableOpacity
              key={key}
              style={styles.chip}
              onPress={() => navigation.navigate('Workout', { muscleGroup: key, muscleName: MUSCLE_LABELS[key] })}
            >
              <View style={[styles.chipDot, { backgroundColor: color }]} />
              <Text style={styles.chipLabel}>{MUSCLE_LABELS[key]}</Text>
              <Text style={[styles.chipPct, { color }]}>{pct}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Volume Progress Scale</Text>
        <View style={styles.legendBar}>
          {legendColors.map((color, i) => (
            <View key={i} style={[styles.legendSegment, { backgroundColor: color }]} />
          ))}
        </View>
        <View style={styles.legendRow}>
          <Text style={styles.legendLabel}>Untrained</Text>
          <Text style={styles.legendLabel}>At Goal</Text>
        </View>
      </View>

      {/* Muscle info panel */}
      <Modal
        visible={!!selectedMuscle}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMuscle(null)}
      >
        <TouchableOpacity style={styles.panelOverlay} activeOpacity={1} onPress={() => setSelectedMuscle(null)}>
          <TouchableOpacity style={styles.panel} activeOpacity={1}>
            <View style={styles.panelHandle} />

            <View style={styles.panelHeader}>
              <View style={[styles.panelDot, { backgroundColor: selColor }]} />
              <Text style={styles.panelTitle}>{MUSCLE_LABELS[selectedMuscle] || ''}</Text>
              <Text style={[styles.panelPct, { color: selColor }]}>
                {Math.round(selProgress * 100)}%
              </Text>
            </View>

            <View style={styles.panelStats}>
              <View style={styles.panelStat}>
                <Text style={styles.panelStatLabel}>Current Volume</Text>
                <Text style={styles.panelStatValue}>{Math.round(selVolume).toLocaleString()} lbs</Text>
              </View>
              <View style={styles.panelStatDivider} />
              <View style={styles.panelStat}>
                <Text style={styles.panelStatLabel}>Target Volume</Text>
                <Text style={styles.panelStatValue}>{(selGroup?.targetVolume || 0).toLocaleString()} lbs</Text>
              </View>
              <View style={styles.panelStatDivider} />
              <View style={styles.panelStat}>
                <Text style={styles.panelStatLabel}>Progress</Text>
                <Text style={[styles.panelStatValue, { color: selColor }]}>
                  {Math.round(selProgress * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.panelBarBg}>
              <View style={[
                styles.panelBarFill,
                { width: `${Math.round(selProgress * 100)}%`, backgroundColor: selColor },
              ]} />
            </View>

            <Text style={styles.panelHint}>
              Volume decays 5% per day — log workouts regularly to stay green.
            </Text>

            <TouchableOpacity style={styles.panelLogBtn} onPress={handleLogWorkout}>
              <Text style={styles.panelLogBtnText}>
                Log {MUSCLE_LABELS[selectedMuscle] || ''} Workout
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  diagramWrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },

  toggle: {
    flexDirection: 'row', justifyContent: 'center',
    backgroundColor: '#1a1a1a', marginHorizontal: 60,
    borderRadius: 20, padding: 3, marginBottom: 6,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
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

  // Muscle info panel modal
  panelOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  panel: {
    backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36, borderWidth: 1, borderColor: '#2a2a2a',
  },
  panelHandle: {
    width: 40, height: 4, backgroundColor: '#333', borderRadius: 2,
    alignSelf: 'center', marginBottom: 20,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  panelDot: { width: 14, height: 14, borderRadius: 7 },
  panelTitle: { color: '#fff', fontSize: 22, fontWeight: '800', flex: 1 },
  panelPct: { fontSize: 28, fontWeight: '800' },

  panelStats: { flexDirection: 'row', marginBottom: 16 },
  panelStat: { flex: 1, alignItems: 'center' },
  panelStatLabel: { color: '#555', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  panelStatValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  panelStatDivider: { width: 1, backgroundColor: '#2a2a2a', marginVertical: 4 },

  panelBarBg: { backgroundColor: '#252525', borderRadius: 6, height: 10, marginBottom: 12, overflow: 'hidden' },
  panelBarFill: { height: 10, borderRadius: 6 },

  panelHint: { color: '#444', fontSize: 11, textAlign: 'center', marginBottom: 20 },

  panelLogBtn: {
    backgroundColor: '#00d4ff', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  panelLogBtnText: { color: '#0f0f0f', fontWeight: '800', fontSize: 15 },
});
