import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getGoals, saveGoals, MUSCLE_LABELS, MUSCLE_EXERCISES } from '../utils/storage';
import { getMuscleColor } from '../utils/colors';

const MUSCLES = ['chest', 'shoulders', 'biceps', 'triceps', 'abs', 'obliques', 'quads', 'upper_back', 'lats', 'lower_back', 'glutes', 'hamstrings', 'calves'];

export default function SettingsScreen() {
  const [goals, setGoals] = useState({});
  const [saved, setSaved] = useState(false);

  useFocusEffect(useCallback(() => {
    getGoals().then(g => {
      const strGoals = {};
      MUSCLES.forEach(m => {
        strGoals[m] = { exercise: g[m]?.exercise || '', maxWeight: String(g[m]?.maxWeight || '') };
      });
      setGoals(strGoals);
    });
  }, []));

  const update = (muscle, field, value) => {
    setGoals(prev => ({ ...prev, [muscle]: { ...prev[muscle], [field]: value } }));
  };

  const handleSave = async () => {
    const parsed = {};
    MUSCLES.forEach(m => {
      parsed[m] = {
        exercise: goals[m]?.exercise || '',
        maxWeight: parseFloat(goals[m]?.maxWeight) || 0,
      };
    });
    await saveGoals(parsed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <Text style={styles.intro}>
          Set your goal weight for each muscle group. The body diagram colors update based on how close your logged weights are to these goals.
        </Text>

        {MUSCLES.map(muscle => {
          const g = goals[muscle] || { exercise: '', maxWeight: '' };
          const maxW = parseFloat(g.maxWeight) || 0;
          return (
            <View key={muscle} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.colorDot, { backgroundColor: getMuscleColor(maxW, maxW) || '#2a2a2a' }]} />
                <Text style={styles.muscleLabel}>{MUSCLE_LABELS[muscle]}</Text>
              </View>

              <Text style={styles.fieldLabel}>Primary Exercise</Text>
              <TextInput
                style={styles.input}
                value={g.exercise}
                onChangeText={v => update(muscle, 'exercise', v)}
                placeholder={`e.g. ${MUSCLE_EXERCISES[muscle]?.[0] || ''}`}
                placeholderTextColor="#555"
              />

              <Text style={styles.fieldLabel}>Goal Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={g.maxWeight}
                onChangeText={v => update(muscle, 'maxWeight', v)}
                placeholder="e.g. 225"
                placeholderTextColor="#555"
                keyboardType="decimal-pad"
              />

              {maxW > 0 && (
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Color at 100% goal:</Text>
                  <View style={[styles.previewDot, { backgroundColor: getMuscleColor(maxW, maxW) }]} />
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>How the colors work</Text>
          <View style={styles.legendRows}>
            {[
              { label: 'Never logged', pct: 0 },
              { label: '25% of goal', pct: 0.25 },
              { label: '50% of goal', pct: 0.5 },
              { label: '75% of goal', pct: 0.75 },
              { label: '100% of goal', pct: 1.0 },
            ].map(({ label, pct }) => (
              <View key={label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: getMuscleColor(pct, 1) }]} />
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.saveBtn, saved && styles.savedBtn]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{saved ? '✓ Saved!' : 'Save Goals'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  intro: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 20 },

  card: {
    backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#2a2a2a',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  muscleLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },

  fieldLabel: { color: '#888', fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#252525', borderRadius: 8,
    padding: 11, color: '#fff', fontSize: 14, marginBottom: 12,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  previewLabel: { color: '#555', fontSize: 11 },
  previewDot: { width: 16, height: 16, borderRadius: 8 },

  legendCard: {
    backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: '#2a2a2a',
  },
  legendTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 12 },
  legendRows: { gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 20, height: 20, borderRadius: 10 },
  legendLabel: { color: '#888', fontSize: 13 },

  saveBtn: { backgroundColor: '#00d4ff', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 40 },
  savedBtn: { backgroundColor: '#00ff88' },
  saveBtnText: { color: '#0f0f0f', fontWeight: '800', fontSize: 16 },
});
