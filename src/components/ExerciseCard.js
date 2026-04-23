import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Ellipse, Line, Path, G } from 'react-native-svg';
import { EXERCISE_EQUIPMENT } from '../utils/exerciseImages';
import { EXERCISE_INFO } from '../utils/exercises';
import { MUSCLE_LABELS } from '../utils/storage';

const ACCENT = '#00d4ff';

function BarbellIllustration() {
  return (
    <Svg viewBox="0 0 200 120" width="100%" height="100%">
      {/* Bar */}
      <Rect x={45} y={56} width={110} height={8} rx={4} fill="#555" />
      {/* Left plates */}
      <Rect x={25} y={42} width={22} height={36} rx={5} fill={ACCENT} opacity={0.85} />
      <Rect x={10} y={48} width={16} height={24} rx={4} fill={ACCENT} opacity={0.55} />
      {/* Right plates */}
      <Rect x={153} y={42} width={22} height={36} rx={5} fill={ACCENT} opacity={0.85} />
      <Rect x={174} y={48} width={16} height={24} rx={4} fill={ACCENT} opacity={0.55} />
      {/* Collars */}
      <Rect x={47} y={52} width={8} height={16} rx={3} fill="#333" />
      <Rect x={145} y={52} width={8} height={16} rx={3} fill="#333" />
      {/* Knurling marks */}
      {[70, 80, 90, 100, 110, 120, 130].map(x => (
        <Rect key={x} x={x} y={54} width={2} height={12} rx={1} fill="#444" />
      ))}
    </Svg>
  );
}

function DumbbellIllustration() {
  return (
    <Svg viewBox="0 0 200 120" width="100%" height="100%">
      {/* Left dumbbell */}
      <Rect x={15} y={52} width={14} height={16} rx={4} fill={ACCENT} opacity={0.85} />
      <Rect x={29} y={56} width={32} height={8} rx={4} fill="#555" />
      <Rect x={61} y={52} width={14} height={16} rx={4} fill={ACCENT} opacity={0.85} />
      {/* Right dumbbell */}
      <Rect x={111} y={52} width={14} height={16} rx={4} fill={ACCENT} opacity={0.85} />
      <Rect x={125} y={56} width={32} height={8} rx={4} fill="#555" />
      <Rect x={157} y={52} width={14} height={16} rx={4} fill={ACCENT} opacity={0.85} />
    </Svg>
  );
}

function CableIllustration() {
  return (
    <Svg viewBox="0 0 200 120" width="100%" height="100%">
      {/* Machine frame left */}
      <Rect x={10} y={10} width={12} height={100} rx={4} fill="#333" />
      <Rect x={10} y={10} width={40} height={10} rx={3} fill="#333" />
      {/* Pulley */}
      <Circle cx={30} cy={20} r={10} fill="#444" stroke="#555" strokeWidth={2} />
      <Circle cx={30} cy={20} r={4} fill="#333" />
      {/* Cable */}
      <Line x1={30} y1={30} x2={110} y2={90} stroke={ACCENT} strokeWidth={2.5} opacity={0.8} />
      {/* Handle */}
      <Rect x={100} y={84} width={30} height={12} rx={6} fill={ACCENT} opacity={0.7} />
      {/* Weight stack */}
      <Rect x={14} y={50} width={8} height={50} rx={2} fill="#444" />
      <Rect x={14} y={50} width={8} height={14} rx={2} fill={ACCENT} opacity={0.6} />
    </Svg>
  );
}

function BodyweightIllustration() {
  return (
    <Svg viewBox="0 0 200 120" width="100%" height="100%">
      {/* Ground */}
      <Rect x={30} y={105} width={140} height={4} rx={2} fill="#333" />
      {/* Figure standing */}
      <Circle cx={100} cy={30} r={12} fill={ACCENT} opacity={0.75} />
      {/* Torso */}
      <Line x1={100} y1={42} x2={100} y2={80} stroke={ACCENT} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      {/* Arms up/active */}
      <Line x1={100} y1={52} x2={72} y2={38} stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
      <Line x1={100} y1={52} x2={128} y2={38} stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
      {/* Legs */}
      <Line x1={100} y1={80} x2={82} y2={105} stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
      <Line x1={100} y1={80} x2={118} y2={105} stroke={ACCENT} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
    </Svg>
  );
}

function MachineIllustration() {
  return (
    <Svg viewBox="0 0 200 120" width="100%" height="100%">
      {/* Seat */}
      <Rect x={60} y={75} width={55} height={12} rx={4} fill="#333" />
      <Rect x={75} y={87} width={8} height={20} rx={3} fill="#444" />
      {/* Back pad */}
      <Rect x={112} y={40} width={12} height={48} rx={5} fill="#333" />
      {/* Arm pad */}
      <Rect x={20} y={55} width={50} height={10} rx={5} fill={ACCENT} opacity={0.7} />
      <Rect x={28} y={45} width={8} height={20} rx={3} fill="#444" />
      {/* Weight stack */}
      <Rect x={155} y={30} width={22} height={65} rx={4} fill="#333" />
      <Rect x={157} y={32} width={18} height={16} rx={3} fill={ACCENT} opacity={0.55} />
      <Rect x={157} y={50} width={18} height={4} rx={1} fill="#444" />
      <Rect x={157} y={56} width={18} height={4} rx={1} fill="#444" />
      {/* Frame */}
      <Rect x={120} y={20} width={8} height={90} rx={3} fill="#2a2a2a" />
      <Rect x={128} y={20} width={30} height={8} rx={3} fill="#2a2a2a" />
    </Svg>
  );
}

function KettlebellIllustration() {
  return (
    <Svg viewBox="0 0 200 120" width="100%" height="100%">
      {/* Left kettlebell */}
      <Circle cx={65} cy={72} r={24} fill={ACCENT} opacity={0.75} />
      <Rect x={55} y={42} width={20} height={14} rx={4} fill="#333" />
      <Path d="M55,48 Q65,36 75,48" stroke={ACCENT} strokeWidth={5} fill="none" opacity={0.75} strokeLinecap="round" />
      {/* Right kettlebell */}
      <Circle cx={140} cy={72} r={24} fill={ACCENT} opacity={0.55} />
      <Rect x={130} y={42} width={20} height={14} rx={4} fill="#333" />
      <Path d="M130,48 Q140,36 150,48" stroke={ACCENT} strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />
    </Svg>
  );
}

const ILLUSTRATIONS = {
  barbell:    BarbellIllustration,
  dumbbell:   DumbbellIllustration,
  cable:      CableIllustration,
  bodyweight: BodyweightIllustration,
  machine:    MachineIllustration,
  kettlebell: KettlebellIllustration,
};

export default function ExerciseCard({ name, onSelect, onInfo }) {
  const equipmentType = EXERCISE_EQUIPMENT[name] || 'barbell';
  const Illustration = ILLUSTRATIONS[equipmentType];
  const info = EXERCISE_INFO[name];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(name)}
      onLongPress={() => onInfo(name)}
      activeOpacity={0.8}
    >
      <View style={styles.illustrationBox}>
        <Illustration />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        {info && (
          <View style={styles.tags}>
            {info.muscles.slice(0, 2).map(m => (
              <View key={m} style={styles.tag}>
                <Text style={styles.tagText}>{MUSCLE_LABELS[m] || m}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.hint}>tap · hold for tips</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  illustrationBox: {
    width: '100%',
    height: 110,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { padding: 10 },
  name: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 6, lineHeight: 17 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  tag: { backgroundColor: '#0d2f38', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#00d4ff33' },
  tagText: { color: '#00d4ff', fontSize: 10, fontWeight: '600' },
  hint: { color: '#444', fontSize: 10 },
});
