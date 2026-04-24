import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMuscleGroups, saveMuscleGroups, MUSCLE_LABELS, MUSCLE_IDS } from '../utils/storage';
import { getMuscleColor } from '../utils/colors';

export default function SettingsScreen() {
  const [groups, setGroups] = useState({});
  const [saved, setSaved] = useState(false);

  useFocusEffect(useCallback(() => {
    getMuscleGroups().then(g => {
      const strGroups = {};
      MUSCLE_IDS.forEach(id => {
        strGroups[id] = { ...g[id], targetVolume: String(g[id]?.targetVolume || '') };
      });
      setGroups(strGroups);
    });
  }, []));

  const update = (id, value) => {
    setGroups(prev => ({ ...prev, [id]: { ...prev[id], targetVolume: value } }));
  };

  const handleSave = async () => {
    const parsed = {};
    MUSCLE_IDS.forEach(id => {
      parsed[id] = {
        ...groups[id],
        targetVolume: parseFloat(groups[id]?.targetVolume) || 0,
      };
    });
    await saveMuscleGroups(parsed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Volume Progress Works</Text>
          <Text style={styles.infoText}>
            Each workout contributes volume (weight × reps × muscle contribution %).
            Volume decays 5% per day, so recent workouts count most.
            Set your target volume to match what you want to achieve weekly at peak training.
          </Text>
          <Text style={styles.infoExample}>
            Example: 4 sets × 10 reps × 135 lbs bench press = 5,400 lbs raw volume.
            At 60% chest contribution that adds 3,240 lbs toward chest target.
          </Text>
        </View>

        {MUSCLE_IDS.map(id => {
          const g = groups[id] || { targetVolume: '' };
          const tv = parseFloat(g.targetVolume) || 0;
          return (
            <View key={id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.colorDot, { backgroundColor: tv > 0 ? getMuscleColor(1) : '#2a2a2a' }]} />
                <Text style={styles.muscleLabel}>{MUSCLE_LABELS[id]}</Text>
              </View>

              <Text style={styles.fieldLabel}>Target Volume (lbs)</Text>
              <TextInput
                style={styles.input}
                value={g.targetVolume}
                onChangeText={v => update(id, v)}
                placeholder="e.g. 10000"
                placeholderTextColor="#555"
                keyboardType="decimal-pad"
              />

              {tv > 0 && (
                <Text style={styles.hint}>
                  Reaching {tv.toLocaleString()} lbs of decayed volume = 100% (green)
                </Text>
              )}
            </View>
          );
        })}

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Color Scale</Text>
          <View style={styles.legendRows}>
            {[
              { label: '0% — No recent training', t: 0 },
              { label: '25% — Some activity', t: 0.25 },
              { label: '50% — Half way to goal', t: 0.5 },
              { label: '75% — Good progress', t: 0.75 },
              { label: '100% — At target volume', t: 1.0 },
            ].map(({ label, t }) => (
              <View key={label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: getMuscleColor(t) }]} />
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.saveBtn, saved && styles.savedBtn]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{saved ? '✓ Saved!' : 'Save Target Volumes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },

  infoCard: {
    backgroundColor: '#1a1f1a', borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: '#2a3a2a',
  },
  infoTitle: { color: '#00d4ff', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  infoText: { color: '#888', fontSize: 13, lineHeight: 20, marginBottom: 10 },
  infoExample: { color: '#555', fontSize: 12, lineHeight: 18, fontStyle: 'italic' },

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
    padding: 11, color: '#fff', fontSize: 14, marginBottom: 8,
  },
  hint: { color: '#444', fontSize: 11 },

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
