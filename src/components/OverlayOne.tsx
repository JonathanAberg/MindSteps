import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

type Props = {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onBackdropPress?: () => void;
};

export default function OverlayOne({ visible, onAccept, onDecline, onBackdropPress }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onBackdropPress} />

      {/* Card */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>Vill du ha reflektionsfrågor{'\n'}under din promenad?</Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onAccept}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Ja, ge mig reflektionsfrågor"
              android_ripple={{ borderless: true }}
              testID="thumbs-up"
            >
              <Feather name="thumbs-up" size={28} />
            </Pressable>

            <Pressable
              onPress={onDecline}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Nej tack"
              android_ripple={{ borderless: true }}
              testID="thumbs-down"
            >
              <Feather name="thumbs-down" size={28} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    // skugga
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: '#222',
  },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.6,
  },
});
