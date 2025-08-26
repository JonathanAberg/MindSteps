import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export type TripleFeatureRowProps = {
  onPressReflections?: () => void;
  onPressRecordings?: () => void;
  onPressStats?: () => void;
};

const COLOR_PRIMARY = '#2876D3';

export default function TripleFeatureRow({
  onPressReflections,
  onPressRecordings,
  onPressStats,
}: TripleFeatureRowProps) {
  return (
    <View style={styles.container}>
      <Feature
        accessibilityLabel="Reflektionsfrågor"
        icon={
          <MaterialCommunityIcons name="thought-bubble-outline" size={50} color={COLOR_PRIMARY} />
        }
        label={'Reflektions-\nfrågor'}
        onPress={onPressReflections}
      />

      <Feature
        accessibilityLabel="Mina inspelningar"
        icon={<Feather name="mic" size={50} color={COLOR_PRIMARY} />}
        label={'Mina\ninspelningar'}
        onPress={onPressRecordings}
      />

      <Feature
        accessibilityLabel="Statistik"
        icon={<Feather name="bar-chart-2" size={50} color={COLOR_PRIMARY} />}
        label="Statistik"
        onPress={onPressStats}
      />
    </View>
  );
}

function Feature({
  icon,
  label,
  onPress,
  accessibilityLabel,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label.replace('\n', ' ')}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    borderRadius: 14,
    marginHorizontal: 10,
  },
  itemPressed: {
    opacity: 0.6,
  },
  iconWrap: {
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    color: COLOR_PRIMARY,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
});
