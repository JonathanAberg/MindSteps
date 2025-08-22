import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // eller @expo/vector-icons

export type MoodValue = 'better' | 'same' | 'worse';

export type MoodSelectorProps = {
  value: MoodValue | null;
  onChange: (value: MoodValue) => void;
  question?: string;
  style?: object;
};

export default function MoodSelector({
  value,
  onChange,
  question = 'Hur mår du efter?',
  style,
}: MoodSelectorProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.row}>
        <Option
          label="Bättre"
          icon="smile"
          color="#6DBE7D"
          selected={value === 'better'}
          onPress={() => onChange('better')}
        />
        <Option
          label="Likadant"
          icon="meh"
          color="#689FE0"
          selected={value === 'same'}
          onPress={() => onChange('same')}
        />
        <Option
          label="Sämre"
          icon="frown"
          color="#E57373"
          selected={value === 'worse'}
          onPress={() => onChange('worse')}
        />
      </View>
    </View>
  );
}

/** Intern knappkomponent – exporteras inte */
function Option({
  label,
  icon,
  color,
  selected,
  onPress,
}: {
  label: string;
  icon: string;
  color: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.opt,
        selected && { backgroundColor: '#eef5ff', borderColor: color, borderWidth: 1 },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Icon name={icon} size={36} color={color} solid={selected} />
      <Text style={styles.optLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  question: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#1d3557',
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  opt: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
  optLabel: { fontSize: 14, fontWeight: '700', color: '#2b3f66', marginTop: 6 },
});
