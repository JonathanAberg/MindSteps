import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  findNodeHandle,
} from 'react-native';
import MoodSelector, { MoodValue } from '@/components/MoodSelector';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getOrInitDeviceId } from '@/utils/deviceId';
import { createSession } from '@/services/api';
import { Alert, ActivityIndicator } from 'react-native';

type LogRouteParams = {
  steps?: number;
  durationSec?: number;
};

const LogWalkScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, LogRouteParams>, string>>();
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState('');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const steps = route.params?.steps ?? 0;
  const durationSec = route.params?.durationSec ?? 0;

  const distanceKm = steps > 0 ? steps * 0.0007 : 0;
  const durationMin = Math.max(1, Math.round(durationSec / 60));
  const endedAt = useMemo(() => new Date(), []);

  const dateLabel = useMemo(
    () => endedAt.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' }),
    [endedAt],
  );
  const durationLabel = useMemo(() => {
    const h = Math.floor(durationMin / 60);
    const m = durationMin % 60;
    return h > 0 ? `${h} tim ${m} min` : `${m} min`;
  }, [durationMin]);

  const canSave = mood !== null && !submitting && steps >= 0 && durationSec > 0 && deviceId;

  useEffect(() => {
    (async () => {
      const id = await getOrInitDeviceId();
      setDeviceId(id);
    })();
  }, []);

  const scrollToInput = () => {
    const node = findNodeHandle(inputRef.current);
    if (!node || !scrollRef.current) return;

    inputRef.current!.measureInWindow((x, y) => {
      const targetY = Math.max(y - 120, 0);
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
    });
  };

  const handleSave = async () => {
    if (!canSave || !deviceId || !mood) return;
    setSubmitting(true);
    const moodToAnswer: Record<MoodValue, 'Bra' | 'Okej' | 'Dåligt'> = {
      better: 'Bra',
      same: 'Okej',
      worse: 'Dåligt',
    };
    const payload = {
      deviceId,
      steps,
      time: Math.max(1, Math.round(durationSec)),
      answer: moodToAnswer[mood],
      reflection: note.trim() || undefined,
      date: new Date().toISOString(),
    } as const;
    try {
      await createSession(payload as any);
      Alert.alert('Sparat', 'Promenaden sparades.');
      setMood(null);
      setNote('');
    } catch (e: any) {
      Alert.alert('Fel', e?.response?.data?.error || 'Kunde inte spara. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        testID="screen-logwalk"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
            automaticallyAdjustKeyboardInsets
          >
            <Text style={styles.title}>Din promenad</Text>

            <View style={styles.card}>
              <Text style={styles.date}>{dateLabel}</Text>
              <View style={styles.row}>
                <Text style={styles.key}>Tid</Text>
                <Text style={styles.val}>{durationLabel}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.key}>Sträcka</Text>
                <Text style={styles.val}>{distanceKm.toFixed(1)} km</Text>
              </View>
              <MoodSelector value={mood} onChange={setMood} question="Hur mår du efter?" />
            </View>

            <Text style={styles.sectionTitle}>Lägg till notis</Text>

            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Skriv din notis här..."
              placeholderTextColor="#8aa0bf"
              value={note}
              onChangeText={setNote}
              multiline
              onFocus={scrollToInput}
              returnKeyType="done"
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={!canSave}
              style={[styles.saveBtn, (!canSave || submitting) && styles.saveBtnDisabled]}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSave }}
            >
              {submitting ? (
                <ActivityIndicator color="#689FE0" />
              ) : (
                <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>Spara</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogWalkScreen;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#E6F0FF' },
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#304A76' },
  date: { fontSize: 20, color: '#2b3f66', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  key: { color: '#7E9CD2', fontWeight: '600' },
  val: { color: '#304A76', fontWeight: '700' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#304A76',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    minHeight: 110,
    borderRadius: 16,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d5e0f2',
  },
  saveBtn: {
    backgroundColor: '#ffffff',
    color: '#689FE0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveText: { fontWeight: '800', fontSize: 25, color: '#689FE0' },
  saveTextDisabled: { color: '#7a9cc5' },
});
