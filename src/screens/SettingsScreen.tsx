import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; // npm i @react-native-community/datetimepicker
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [time, setTime] = useState<Date>(new Date(0, 0, 0, 18, 0)); // 18:00
  const [showPicker, setShowPicker] = useState<boolean>(false);

  // Enkel, tydlig tidslabel
  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const timeLabel = `${h}:${m}`;

  const onChangeTime = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) setTime(selected);
  };

  const confirmWipe = () => {
    Alert.alert(
      'Radera allt innehåll',
      'Detta raderar samtliga promenader, anteckningar och appens inställningar på den här enheten. Åtgärden går inte att ångra. Påminnelser avaktiveras.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Radera',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setReminderEnabled(false);
              Alert.alert('Klart', 'Allt innehåll har raderats.');
            } catch {
              Alert.alert('Fel', 'Kunde inte radera innehållet.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* Kort: Notiser */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Pushnotiser</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
              trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
            />
          </View>

          <View style={[styles.row, styles.rowTop]}>
            <Text style={styles.cardTitle}>Påminnelse</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
              trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
            />
          </View>

          {/* Rad: "Varje dag kl." + tid-pill till höger (robust) */}
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>Varje dag kl.</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              disabled={!reminderEnabled}
              style={[
                styles.timePill,
                !reminderEnabled && styles.timePillDisabled,
                styles.pushRight,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Ändra tid, nu ${timeLabel}`}
            >
              <Text style={styles.timePillText}>{timeLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer som trycker ner Data-delen */}
        <View style={styles.flexSpacer} />

        {/* Data */}
        <Text style={styles.sectionTitle}>Data</Text>

        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            Detta raderar samtliga promenader, anteckningar och appens inställningar på den här
            enheten. Åtgärden går inte att ångra. Påminnelser avaktiveras.
          </Text>
        </View>

        <TouchableOpacity style={styles.dangerCardButton} onPress={confirmWipe}>
          <Text style={styles.dangerCardButtonText}>Radera allt innehåll…</Text>
        </TouchableOpacity>
      </View>

      {/* Tidväljare */}
      {showPicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalAction}>Stäng</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Välj tid</Text>
                <View style={styles.modalSpacer} />
              </View>
              <DateTimePicker mode="time" value={time} onChange={onChangeTime} display="spinner" />
            </View>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker mode="time" value={time} onChange={onChangeTime} display="default" />
      )}
    </SafeAreaView>
  );
}

/* ---- Styles ---- */
const BG = '#EAF1FF';
const CARD = '#FFFFFF';
const TEXT = '#1F2937';
const BLUE_TEXT = '#1D4ED8';
const PILL_BG = '#E0EAFF';
const TITLE_BLUE = '#274C7A';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  spacer24: { width: 24 },
  screenTitle: {
    flex: 1,
    fontSize: 28,
    color: TITLE_BLUE,
    marginLeft: 8,
    fontFamily: 'Montserrat_700Bold',
  },

  content: { flex: 1, padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTop: { marginTop: 14 },
  cardTitle: { fontSize: 18, color: TEXT, fontFamily: 'Montserrat_500Medium' },

  // Tid-raden – texten får inte krympas; pillen skjuts till höger
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  timeText: {
    color: '#000000',
    fontSize: 18,
    marginRight: 8,
    flexShrink: 0,
    fontFamily: 'Montserrat_500Medium',
  },
  pushRight: { marginLeft: 'auto' },

  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: PILL_BG,
    borderRadius: 8,
  },
  timePillText: { color: BLUE_TEXT, fontSize: 14, fontFamily: 'Montserrat_700Bold' },
  timePillDisabled: { opacity: 0.5 },

  // Spacer som trycker ner Data-delen
  flexSpacer: { flex: 1 },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 22,
    color: TITLE_BLUE,
    fontFamily: 'Montserrat_700Bold',
  },

  warningCard: {
    marginBottom: 20,
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  warningText: { color: '#374151', lineHeight: 20, fontFamily: 'Montserrat_500Medium' },

  dangerCardButton: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 20,
  },
  dangerCardButtonText: { color: '#E16464', fontFamily: 'Montserrat_700Bold' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: CARD,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  modalAction: { fontSize: 16, fontWeight: '600', color: BLUE_TEXT, width: 56 },
  modalSpacer: { width: 56 },
});
