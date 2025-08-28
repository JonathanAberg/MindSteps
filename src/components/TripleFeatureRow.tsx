import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export type TripleFeatureRowProps = {
  title?: string; // rubrik ovanför
};

const COLOR_PRIMARY = '#5D8FC9';
const ICON_SIZE = 30;

export default function TripleFeatureRow({ title = 'Vad appen erbjuder' }: TripleFeatureRowProps) {
  return (
    <View style={styles.container}>
      {!!title && (
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      )}

      <View style={styles.row}>
        <Feature
          accessibilityLabel="Reflektionsfrågor under promenader"
          icon={
            <MaterialCommunityIcons
              name="thought-bubble-outline"
              size={ICON_SIZE}
              color={COLOR_PRIMARY}
            />
          }
          label={'Reflektions-\nfrågor under promenader'}
        />

        <Feature
          accessibilityLabel="Mina inspelningar"
          icon={<Feather name="mic" size={ICON_SIZE} color={COLOR_PRIMARY} />}
          label={'Spela in\ntankar'}
        />

        <Feature
          accessibilityLabel="Statistik"
          icon={<Feather name="bar-chart-2" size={ICON_SIZE} color={COLOR_PRIMARY} />}
          label="Få tillgång till statistik"
        />
      </View>
    </View>
  );
}

function Feature({
  icon,
  label,
  accessibilityLabel,
}: {
  icon: React.ReactNode;
  label: string;
  accessibilityLabel?: string;
}) {
  return (
    <View
      style={styles.item}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || label.replace('\n', ' ')}
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={styles.iconWrap}
        accessibilityElementsHidden
        importantForAccessibility="no"
        pointerEvents="none"
      >
        {icon}
      </View>
      <View style={styles.labelBox}>
        <Text style={styles.label} numberOfLines={3} ellipsizeMode="tail">
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#304A76',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  iconWrap: {
    marginBottom: 8,
  },
  labelBox: {
    minHeight: 36,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    color: COLOR_PRIMARY,
    fontSize: 12,
    fontWeight: '400',
  },
});
