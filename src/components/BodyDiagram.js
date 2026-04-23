import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Rect, Circle, Ellipse, Line, Text as SvgText } from 'react-native-svg';

const INACTIVE = '#252525';
const STROKE = '#111';
const SW = 0.8;

export default function BodyDiagram({ muscleColors, onMusclePress, view }) {
  const c = (key) => muscleColors[key] || INACTIVE;

  return (
    <View style={styles.wrapper}>
      <Svg viewBox="0 0 200 430" width="100%" height="100%" style={{ flex: 1 }}>
        {view === 'front' ? <FrontView c={c} onPress={onMusclePress} /> : <BackView c={c} onPress={onMusclePress} />}
      </Svg>
    </View>
  );
}

function FrontView({ c, onPress }) {
  return (
    <G>
      {/* ── NON-INTERACTIVE ── */}

      {/* Head */}
      <Circle cx={100} cy={30} r={22} fill="#2e2e2e" stroke={STROKE} strokeWidth={SW} />
      <Circle cx={93} cy={27} r={2} fill="#1a1a1a" />
      <Circle cx={107} cy={27} r={2} fill="#1a1a1a" />
      <Path d="M94 37 Q100 41 106 37" stroke="#1a1a1a" strokeWidth={1.2} fill="none" strokeLinecap="round" />

      {/* Neck */}
      <Rect x={90} y={51} width={20} height={16} rx={5} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Torso background */}
      <Path d="M68,68 L132,68 L136,80 L138,155 L130,220 L70,220 L62,155 L64,80 Z" fill="#222" stroke={STROKE} strokeWidth={SW} />

      {/* Forearms */}
      <Rect x={37} y={152} width={14} height={52} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={149} y={152} width={14} height={52} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Hands */}
      <Ellipse cx={44} cy={208} rx={9} ry={7} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Ellipse cx={156} cy={208} rx={9} ry={7} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Hip connector */}
      <Rect x={72} y={218} width={56} height={18} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Knees */}
      <Rect x={73} y={300} width={24} height={14} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={103} y={300} width={24} height={14} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Lower legs (tibialis) */}
      <Rect x={75} y={314} width={20} height={64} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={105} y={314} width={20} height={64} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Feet */}
      <Rect x={68} y={378} width={30} height={12} rx={4} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={102} y={378} width={30} height={12} rx={4} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* ── INTERACTIVE MUSCLES ── */}

      {/* DELTOIDS */}
      <G onPress={() => onPress('shoulders')}>
        <Ellipse cx={50} cy={80} rx={22} ry={16} fill={c('shoulders')} stroke={STROKE} strokeWidth={SW} />
        <Ellipse cx={150} cy={80} rx={22} ry={16} fill={c('shoulders')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={50} y={77} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">DELTS</SvgText>
        <SvgText x={150} y={77} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">DELTS</SvgText>
      </G>

      {/* BICEPS */}
      <G onPress={() => onPress('biceps')}>
        <Rect x={37} y={82} width={26} height={68} rx={7} fill={c('biceps')} stroke={STROKE} strokeWidth={SW} />
        <Rect x={137} y={82} width={26} height={68} rx={7} fill={c('biceps')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={50} y={118} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">BIS</SvgText>
        <SvgText x={150} y={118} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">BIS</SvgText>
      </G>

      {/* CHEST */}
      <G onPress={() => onPress('chest')}>
        <Path d="M72,70 Q100,63 128,70 L126,124 Q100,130 74,124 Z" fill={c('chest')} stroke={STROKE} strokeWidth={SW} />
        <Line x1={100} y1={70} x2={100} y2={124} stroke={STROKE} strokeWidth={0.8} opacity={0.5} />
        <SvgText x={100} y={100} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={8} fontWeight="bold">CHEST</SvgText>
      </G>

      {/* OBLIQUES */}
      <G onPress={() => onPress('obliques')}>
        <Path d="M66,130 L74,128 L74,216 L66,210 Z" fill={c('obliques')} stroke={STROKE} strokeWidth={SW} />
        <Path d="M126,128 L134,130 L134,210 L126,216 Z" fill={c('obliques')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={70} y={175} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={5.5} fontWeight="bold">OBL</SvgText>
        <SvgText x={130} y={175} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={5.5} fontWeight="bold">OBL</SvgText>
      </G>

      {/* ABS */}
      <G onPress={() => onPress('abs')}>
        <Rect x={74} y={126} width={52} height={90} rx={5} fill={c('abs')} stroke={STROKE} strokeWidth={SW} />
        <Line x1={100} y1={127} x2={100} y2={215} stroke={STROKE} strokeWidth={0.8} opacity={0.4} />
        <Line x1={75} y1={152} x2={125} y2={152} stroke={STROKE} strokeWidth={0.8} opacity={0.4} />
        <Line x1={75} y1={178} x2={125} y2={178} stroke={STROKE} strokeWidth={0.8} opacity={0.4} />
        <SvgText x={100} y={165} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={8} fontWeight="bold">ABS</SvgText>
      </G>

      {/* QUADS — 4 heads visible */}
      <G onPress={() => onPress('quads')}>
        {/* Left quad (2 visible heads) */}
        <Rect x={73} y={236} width={12} height={62} rx={7} fill={c('quads')} stroke={STROKE} strokeWidth={SW} />
        <Rect x={86} y={236} width={12} height={62} rx={7} fill={c('quads')} stroke={STROKE} strokeWidth={SW} />
        {/* Right quad */}
        <Rect x={102} y={236} width={12} height={62} rx={7} fill={c('quads')} stroke={STROKE} strokeWidth={SW} />
        <Rect x={115} y={236} width={12} height={62} rx={7} fill={c('quads')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={85} y={268} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">QUADS</SvgText>
        <SvgText x={115} y={268} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">QUADS</SvgText>
      </G>
    </G>
  );
}

function BackView({ c, onPress }) {
  return (
    <G>
      {/* ── NON-INTERACTIVE ── */}

      {/* Head (back) */}
      <Circle cx={100} cy={30} r={22} fill="#2e2e2e" stroke={STROKE} strokeWidth={SW} />

      {/* Neck */}
      <Rect x={90} y={51} width={20} height={16} rx={5} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Torso background */}
      <Path d="M68,68 L132,68 L136,80 L138,155 L130,220 L70,220 L62,155 L64,80 Z" fill="#222" stroke={STROKE} strokeWidth={SW} />

      {/* Forearms */}
      <Rect x={37} y={152} width={14} height={52} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={149} y={152} width={14} height={52} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Hands */}
      <Ellipse cx={44} cy={208} rx={9} ry={7} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Ellipse cx={156} cy={208} rx={9} ry={7} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Hip connector */}
      <Rect x={72} y={218} width={56} height={18} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Knees */}
      <Rect x={73} y={300} width={24} height={14} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={103} y={300} width={24} height={14} rx={6} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* Feet */}
      <Rect x={68} y={378} width={30} height={12} rx={4} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />
      <Rect x={102} y={378} width={30} height={12} rx={4} fill="#2a2a2a" stroke={STROKE} strokeWidth={SW} />

      {/* ── INTERACTIVE MUSCLES ── */}

      {/* UPPER BACK (Traps) */}
      <G onPress={() => onPress('upper_back')}>
        <Path d="M72,68 L100,62 L128,68 L130,130 L100,136 L70,130 Z" fill={c('upper_back')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={100} y={95} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={7} fontWeight="bold">UPPER</SvgText>
        <SvgText x={100} y={105} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={7} fontWeight="bold">BACK</SvgText>
      </G>

      {/* LATS */}
      <G onPress={() => onPress('lats')}>
        <Path d="M70,128 L60,128 L56,196 L72,200 L72,128 Z" fill={c('lats')} stroke={STROKE} strokeWidth={SW} />
        <Path d="M130,128 L140,128 L144,196 L128,200 L128,128 Z" fill={c('lats')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={63} y={165} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={6} fontWeight="bold">LAT</SvgText>
        <SvgText x={137} y={165} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={6} fontWeight="bold">LAT</SvgText>
      </G>

      {/* LOWER BACK */}
      <G onPress={() => onPress('lower_back')}>
        <Rect x={78} y={136} width={44} height={70} rx={5} fill={c('lower_back')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={100} y={175} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">LOWER</SvgText>
        <SvgText x={100} y={184} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">BACK</SvgText>
      </G>

      {/* TRICEPS */}
      <G onPress={() => onPress('triceps')}>
        <Rect x={37} y={82} width={26} height={68} rx={7} fill={c('triceps')} stroke={STROKE} strokeWidth={SW} />
        <Rect x={137} y={82} width={26} height={68} rx={7} fill={c('triceps')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={50} y={118} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">TRI</SvgText>
        <SvgText x={150} y={118} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">TRI</SvgText>
      </G>

      {/* DELTOIDS (rear) */}
      <G onPress={() => onPress('shoulders')}>
        <Ellipse cx={50} cy={80} rx={20} ry={14} fill={c('shoulders')} stroke={STROKE} strokeWidth={SW} />
        <Ellipse cx={150} cy={80} rx={20} ry={14} fill={c('shoulders')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={50} y={77} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">DELT</SvgText>
        <SvgText x={150} y={77} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">DELT</SvgText>
      </G>

      {/* GLUTES */}
      <G onPress={() => onPress('glutes')}>
        <Path d="M72,220 Q60,224 60,252 Q60,278 74,282 L98,282 L98,220 Z" fill={c('glutes')} stroke={STROKE} strokeWidth={SW} />
        <Path d="M128,220 Q140,224 140,252 Q140,278 126,282 L102,282 L102,220 Z" fill={c('glutes')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={80} y={254} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">GLUTE</SvgText>
        <SvgText x={120} y={254} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6.5} fontWeight="bold">GLUTE</SvgText>
      </G>

      {/* HAMSTRINGS */}
      <G onPress={() => onPress('hamstrings')}>
        <Rect x={73} y={282} width={25} height={50} rx={8} fill={c('hamstrings')} stroke={STROKE} strokeWidth={SW} />
        <Rect x={102} y={282} width={25} height={50} rx={8} fill={c('hamstrings')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={85} y={310} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">HAMS</SvgText>
        <SvgText x={115} y={310} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">HAMS</SvgText>
      </G>

      {/* CALVES */}
      <G onPress={() => onPress('calves')}>
        <Rect x={75} y={316} width={21} height={62} rx={8} fill={c('calves')} stroke={STROKE} strokeWidth={SW} />
        <Rect x={104} y={316} width={21} height={62} rx={8} fill={c('calves')} stroke={STROKE} strokeWidth={SW} />
        <SvgText x={85} y={349} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">CALVES</SvgText>
        <SvgText x={115} y={349} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={6} fontWeight="bold">CALVES</SvgText>
      </G>
    </G>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
});
