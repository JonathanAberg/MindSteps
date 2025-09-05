import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import QuestionDisplay from '@/components/QuestionDisplay';
import { useGetQuestionByCategory } from '@/hooks/questions/useGetQuestionsByCategory';
import apiClient from '@/api/client';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSession } from '@/store/SessionContext';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  DuringWalk: {
    prefs: {
      cats: string[];
      interval: number;
    } | null;
  };
};

type DuringWalkScreenRouteProp = RouteProp<RootStackParamList, 'DuringWalk'>;

const DuringWalkScreen: React.FC = () => {
  const route = useRoute<DuringWalkScreenRouteProp>();
  const prefs = route.params?.prefs;
  const category = prefs?.cats?.[0] || 'Fokus';
  const interval = prefs?.interval || 30;

  const { data, loading, error } = useGetQuestionByCategory(category);
  const { steps, elapsedSec, stopAndSave, active, pause, resume, reset, paused } =
    useSession() as any;
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        await apiClient.get('/questions/category/Fokus');
      } catch {
        /* ignore preflight question fetch error */
      }
    })();
  }, []);

  const [index, setIndex] = useState(0);
  const count = data?.length ?? 0;

  const next = () => {
    if (!count) return;
    setIndex((i) => (i + 1) % count);
  };

  const prev = () => {
    if (!count) return;
    setIndex((i) => (i - 1 + count) % count);
  };

  if (loading)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Laddar...</Text>
        </View>
      </SafeAreaView>
    );
  if (error)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Något gick fel.</Text>
        </View>
      </SafeAreaView>
    );
  if (!count)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Inga frågor i {category}</Text>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container} testID="screen-duringwalk">
        {/* Vit “kort”-panel som i mockupen — endast layout/styling */}
        <View style={styles.card}>
          <Text style={styles.timerText}>
            {`${String(Math.floor(elapsedSec / 3600)).padStart(2, '0')}:${String(
              Math.floor((elapsedSec % 3600) / 60),
            ).padStart(2, '0')}:${String(elapsedSec % 60).padStart(2, '0')}`}
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricsColLeft}>
              <Text style={styles.metricLabel}>Sträcka</Text>
              <Text style={styles.metricLabel}>Steg</Text>
            </View>
            <View style={styles.metricsColRight}>
              {/* Oförändrat värdeinnehåll (vi visar bara ”Steg” som tidigare) */}
              <Text style={styles.metricValue}>—</Text>
              <Text style={styles.metricValue}>{steps}</Text>
            </View>
          </View>
        </View>

        {active && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.pillBtn, paused ? styles.pillAlt : styles.pillPrimary]}
              onPress={() => (paused ? resume() : pause())}
            >
              <Text style={styles.pillText}>{paused ? 'Fortsätt' : 'Pausa'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pillBtn, styles.pillAlt]}
              onPress={reset}
              disabled={paused && steps === 0 && elapsedSec === 0}
            >
              <Text style={styles.pillZero}>Nollställ</Text>
            </TouchableOpacity>
          </View>
        )}

        {!active && <Text style={styles.muted}>Ingen aktiv session</Text>}

        <View style={styles.qWrapper}>
          <Text style={styles.footerNote}>
            Kategori: {category} • Intervall: {interval}s
          </Text>
          <QuestionDisplay question={data![index]} onPrev={prev} onNext={next} />
        </View>

        {active && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={async () => {
              const res = await stopAndSave('Okej');
              if (!res.ok) {
                Alert.alert('Fel', res.error || 'Kunde inte spara');
                return;
              }
              Alert.alert('Sparat', 'Promenaden sparades');
              navigation.navigate('LogWalk' as never);
            }}
          >
            <Text style={styles.stopButtonText}>Stopp</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DuringWalkScreen;

const COLORS = {
  bg: '#DEE8FC', // ljus blå bakgrund
  card: '#FFFFFF', // vit panel
  darkBlue: '#304A76', // primär text (timer)
  midBlue: '#7E9CD2 ', // etiketter
  chipBlue: '#E1E9FF', // piller-knappar
  chipAlt: '#EDF4FF',
  red: '#E06868',
  muted: '#71819A',
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Kortet
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  timerText: {
    fontSize: 30,
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.darkBlue,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  metricsColLeft: { gap: 8 },
  metricsColRight: { alignItems: 'flex-end', gap: 8 },
  metricLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#7E9CD2',
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.darkBlue,
  },
  // Sekundära kontroller
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  pillBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  pillPrimary: { backgroundColor: '#FFFFFF' },
  pillAlt: { backgroundColor: COLORS.chipAlt },
  pillText: { color: COLORS.darkBlue, fontFamily: 'Montserrat_700Bold' },
  pillZero: { color: COLORS.red, fontFamily: 'Montserrat_700Bold' },
  // Frågor
  qWrapper: { width: '100%', marginTop: 8 },
  // Stopp-knapp (vit med röd text)
  stopButton: {
    marginTop: 50,
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  stopButtonText: {
    color: COLORS.red,
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  muted: { color: COLORS.muted, fontSize: 16 },
  footerNote: { display: 'none', marginTop: 8, color: COLORS.muted, fontSize: 13 },
});
