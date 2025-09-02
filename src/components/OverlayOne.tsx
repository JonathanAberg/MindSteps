import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export type ThumbChoice = 'up' | 'down';

type Props = {
  visible: boolean;
  onConfirm: (choice: ThumbChoice) => void; // Bekräfta med valt alternativ
  onCancel: () => void; // Avbryt
  onBackdropPress?: () => void;
};

export default function OverlayOne({ visible, onConfirm, onCancel, onBackdropPress }: Props) {
  const [choice, setChoice] = useState<ThumbChoice | null>(null);

  // rensa val när modalen öppnas/stängs
  React.useEffect(() => {
    if (visible) setChoice(null);
  }, [visible]);

  const canConfirm = choice !== null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onBackdropPress} />
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>Vill du ha reflektionsfrågor{'\n'}under din promenad?</Text>

          {/* Val: tummar fungerar som toggles (kräver ett val) */}
          <View style={styles.actions}>
            <Pressable
              onPress={() => setChoice('up')}
              style={({ pressed }) => [
                styles.iconBtn,
                choice === 'up' && styles.iconBtnSelected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: choice === 'up' }}
              android_ripple={{ borderless: true }}
              testID="thumbs-up"
            >
              <Feather name="thumbs-up" size={28} />
              <Text style={styles.iconLabel}>Ja</Text>
            </Pressable>

            <Pressable
              onPress={() => setChoice('down')}
              style={({ pressed }) => [
                styles.iconBtn,
                choice === 'down' && styles.iconBtnSelected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: choice === 'down' }}
              android_ripple={{ borderless: true }}
              testID="thumbs-down"
            >
              <Feather name="thumbs-down" size={28} />
              <Text style={styles.iconLabel}>Nej</Text>
            </Pressable>
          </View>

          {/* Footer med Avbryt / Gå vidare (disabled om inget valt) */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancel}>Avbryt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => choice && onConfirm(choice)}
              disabled={!canConfirm}
              style={[styles.cta, !canConfirm && styles.ctaDisabled]}
            >
              <Text style={styles.ctaText}>Gå vidare</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const TEXT_PRIMARY = '#304A76';
const LIGHT_SELECTED = '#CFE0FF';

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  centerWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: { textAlign: 'center', fontSize: 16, lineHeight: 22, color: '#222' },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  iconBtn: {
    alignItems: 'center',
    padding: 10,
    minWidth: 80,
  },
  iconBtnSelected: { backgroundColor: LIGHT_SELECTED, borderColor: TEXT_PRIMARY, borderRadius: 50 },
  iconLabel: { marginTop: 6, fontSize: 13, color: TEXT_PRIMARY, fontWeight: '600' },
  footer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancel: { color: TEXT_PRIMARY, fontSize: 15, paddingHorizontal: 15, paddingVertical: 6 },
  cta: {
    backgroundColor: TEXT_PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: 'white', fontWeight: '600', fontSize: 15 },
  pressed: { opacity: 0.6 },
});
