import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import QuestionDisplay from '@/components/QuestionDisplay';
import { useGetQuestionByCategory } from '@/hooks/questions/useGetQuestionsByCategory';
import { useEffect } from 'react';
import apiClient from '@/api/client';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSession } from '@/store/SessionContext';
import { useNavigation } from '@react-navigation/native';

/**
 * Efter man tryckt på "Starta promenad" på Home screen och i den overlayn
 * valt att få frågor eller ej så kommer man hit.
 *
 * Här ser man under promenaden hur klockan tickar och en stoppknapp för när man
 * vill avsluta promenaden.
 *
 * Kanske vill vi att frågorna kommer upp här i text samtidigt som de läses upp av appen?
 * Kanske vill vi ha en inspelningsknapp för att spela in svar på frågorna?
 * Eller ska man kunna skriva in svar på frågorna? Svårt när man går men kanske ngt man vill kunna stanna upp och göra?
 */

// Define the route param types
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
  // Get route parameters
  const route = useRoute<DuringWalkScreenRouteProp>();

  const prefs = route.params?.prefs;

  const category = prefs?.cats?.[0] || 'Fokus';

  const interval = prefs?.interval || 30;

  const { data, loading, error } = useGetQuestionByCategory(category);
  const { steps, elapsedSec, finish, active, pause, resume, reset, paused } = useSession() as any;
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
      <SafeAreaView style={styles.container}>
        <Text>Laddar...</Text>
      </SafeAreaView>
    );
  if (error)
    return (
      <SafeAreaView style={styles.container}>
        <Text>Något gick fel.</Text>
      </SafeAreaView>
    );
  if (!count)
    return (
      <SafeAreaView style={styles.container}>
        <Text>Inga frågor i {category}</Text>
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container} testID="screen-duringwalk">
        <Text style={styles.title}>Under Promenaden</Text>

        {/* Show selected preferences */}
        <Text style={styles.subtitle}>
          Kategori: {category} • Intervall: {interval}s
        </Text>

        <Text style={styles.title}>Steg: {steps}</Text>
        <Text style={styles.subtitle}>
          Tid: {Math.floor(elapsedSec / 60)}m {elapsedSec % 60}s
        </Text>

        {active && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, paused && styles.actionBtnInactive]}
              onPress={() => (paused ? resume() : pause())}
            >
              <Text style={styles.actionText}>{paused ? 'Fortsätt' : 'Pausa'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.resetBtn]}
              onPress={reset}
              disabled={paused && steps === 0 && elapsedSec === 0}
            >
              <Text style={styles.actionText}>Nollställ</Text>
            </TouchableOpacity>
          </View>
        )}

        {!active && <Text style={styles.subtitle}>Ingen aktiv session</Text>}

        <QuestionDisplay question={data![index]} onPrev={prev} onNext={next} />

        {active && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={() => {
              const summary = finish();
              if (!summary) {
                Alert.alert('Fel', 'Ingen aktiv session');
                return;
              }
              (navigation as any).navigate('LogWalk', summary);
            }}
          >
            <Text style={styles.stopButtonText}>Avsluta</Text>
          </TouchableOpacity>
        )}

        {/*
        Här ska det ligga en component <StopWatch /> som tickar under pågående promenad

        Här ska det ligga en component <StopWalk /> för att avsluta promenaden, skicka info
        och navigera till LogWalkScreen. Koppla till backend genom hook useEndWalk
        (som skickar { JSON.stringify(walkInfo) })

        Här ska det ligga en component <QuestionDisplay /> för att visa frågorna under promenaden.
        Frågorna hämtas från frågebatteri valt av användaren i inställningarna. hook useQuestions

        Här ska det ligga en component <RecordYourAnswer /> för att spela in svar på frågorna. hook useRecordAnswer
      */}
      </View>
    </SafeAreaView>
  );
};

export default DuringWalkScreen;

// Removed unused color constants (BG, TITLE_BLUE, etc.) that triggered lint errors.

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  stopwatchContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  stopButton: {
    marginTop: 32,
    backgroundColor: '#d9534f',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  stopButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  actionBtn: {
    backgroundColor: '#DEE8FC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  actionBtnInactive: { backgroundColor: '#E9F1FF' },
  actionText: { color: '#304A76', fontWeight: '600' },
  resetBtn: { backgroundColor: '#E1F5FF' },
});
