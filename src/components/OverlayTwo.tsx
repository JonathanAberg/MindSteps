import React, { useEffect, useState, type ReactElement } from 'react';
import { Modal, View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';

// 🔹 Exportera typer så andra filer kan använda dem
export type Category = 'oro' | 'fokus' | 'slapp' | 'planering' | 'reflekterande' | 'filosofiska';

export type QuestionInterval = 15 | 30 | 'once';

type Props = {
  visible: boolean;
  initialCategories?: Category[];
  initialInterval?: QuestionInterval;
  onConfirm: (categories: Category[], interval: QuestionInterval) => void;
  onCancel?: () => void;
  onBackdropPress?: () => void;
};

const ALL_CATEGORIES: Array<{ key: Category; label: string; emoji: string }> = [
  { key: 'oro', label: 'Oro', emoji: '😟' },
  { key: 'fokus', label: 'Fokus', emoji: '🎯' },
  { key: 'slapp', label: 'Släpp taget', emoji: '🎈' },
  { key: 'planering', label: 'Planering', emoji: '🗓️' },
  { key: 'reflekterande', label: 'Reflekterande', emoji: '☁️' },
  { key: 'filosofiska', label: 'Filosofiska', emoji: '🤔' },
];

const INTERVALS: Array<{ key: QuestionInterval; label: string }> = [
  { key: 15, label: 'Var 15:e minut' },
  { key: 30, label: 'Var 30:e minut' },
  { key: 'once', label: 'Endast en gång' },
];

export default function OverlayTwo({
  visible,
  initialCategories,
  initialInterval,
  onConfirm,
  onCancel,
  onBackdropPress,
}: Props): ReactElement {
  const [selectedCats, setSelectedCats] = useState<Set<Category>>(new Set());
  const [selectedInterval, setSelectedInterval] = useState<QuestionInterval | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedCats(new Set(initialCategories ?? []));
      setSelectedInterval(initialInterval ?? null);
    }
  }, [visible, initialCategories, initialInterval]);

  const toggleCat = (c: Category) => {
    const next = new Set(selectedCats);
    next.has(c) ? next.delete(c) : next.add(c);
    setSelectedCats(next);
  };

  const confirm = () => {
    if (!selectedInterval || selectedCats.size === 0) return;
    onConfirm(Array.from(selectedCats), selectedInterval);
  };

  const canConfirm = selectedCats.size > 0 && !!selectedInterval;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onBackdropPress} />

      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.heading}>
            Utifrån vilken eller vilka{'\n'}kategorier vill du ha frågor från?
          </Text>

          <View style={styles.grid}>
            {ALL_CATEGORIES.map(({ key, label, emoji }) => {
              const selected = selectedCats.has(key);
              return (
                <Pressable
                  key={key}
                  onPress={() => toggleCat(key)}
                  style={({ pressed }) => [
                    styles.categoryTile,
                    selected && styles.categoryTileSelected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                  <Text
                    style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.heading, { marginTop: 12 }]}>
            Vilket intervall vill du att{'\n'}frågorna ställs?
          </Text>

          <View style={styles.intervalRow}>
            {INTERVALS.map(({ key, label }) => {
              const selected = selectedInterval === key;
              return (
                <Pressable
                  key={String(key)}
                  onPress={() => setSelectedInterval(key)}
                  style={({ pressed }) => [
                    styles.intervalChip,
                    selected && styles.intervalChipSelected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.intervalText, selected && styles.intervalTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancel}>Avbryt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={confirm}
              disabled={!canConfirm}
              style={[styles.cta, !canConfirm && styles.ctaDisabled]}
            >
              <Text style={styles.ctaText}>Bekräfta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const LIGHT = '#E1ECFF';
const LIGHT_SELECTED = '#CFE0FF';
const TEXT_PRIMARY = '#304A76';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  heading: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: '#222',
    marginBottom: 8,
  },
  grid: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryTile: {
    backgroundColor: LIGHT,
    width: '31%',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  categoryTileSelected: {
    backgroundColor: LIGHT_SELECTED,
    borderWidth: 2,
    borderColor: TEXT_PRIMARY,
  },
  emoji: { fontSize: 26, marginBottom: 6 },
  categoryLabel: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
  categoryLabelSelected: { fontWeight: '600' },
  intervalRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intervalChip: {
    backgroundColor: LIGHT,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '31%',
    alignItems: 'center',
  },
  intervalChipSelected: {
    backgroundColor: LIGHT_SELECTED,
    borderWidth: 2,
    borderColor: TEXT_PRIMARY,
  },
  intervalText: { fontSize: 13, color: TEXT_PRIMARY, textAlign: 'center' },
  intervalTextSelected: { fontWeight: '600' },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancel: { color: TEXT_PRIMARY, fontSize: 15 },
  cta: {
    backgroundColor: TEXT_PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: 'white', fontWeight: '600', fontSize: 15 },
  pressed: { opacity: 0.7 },
});
