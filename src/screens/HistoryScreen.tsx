import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchSessions, deleteSession } from '../services/api';
import { HistorySession } from 'types/sessionProps';
import { getOrInitDeviceId } from '@/utils/deviceId';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistorySession | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const deviceId = await getOrInitDeviceId();
        const data = await fetchSessions(deviceId);
        const filtered = (data || []).filter(
          (s: any) => !(s?.steps === 0 && (s?.time === 0 || s?.time === undefined))
        );
        setSessions(filtered);
        if (__DEV__ && data.length !== filtered.length) {
          console.warn('[History] Placeholder/dubblett filtrerad bort');
        }
      } catch (err) {
        setError('Failed to fetch sessions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const deviceId = await getOrInitDeviceId();
      const data = await fetchSessions(deviceId);
      const filtered = (data || []).filter(
        (s: any) => !(s?.steps === 0 && (s?.time === 0 || s?.time === undefined))
      );
      setSessions(filtered);
    } catch (e) {
      // ignore silently in refresh
    } finally {
      setRefreshing(false);
    }
  };

  const confirmDelete = () => {
    if (!selected) return;
    Alert.alert('Radera', 'Är du säker på att du vill radera denna promenad?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Radera',
        style: 'destructive',
        onPress: handleDelete,
      },
    ]);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await deleteSession(selected._id);
      setSessions((prev) => prev.filter((s) => s._id !== selected._id));
      setSelected(null);
    } catch (e: any) {
      Alert.alert('Fel', 'Kunde inte radera. Försök igen.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container} testID="screen-history">
      <Text style={styles.title}>History</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
            <Text style={styles.cardText}>Steg: {item.steps}</Text>
            <Text style={styles.cardText}>Svar: {item.answer}</Text>
            {'time' in item && <Text style={styles.cardText}>Tid: {item.time}s</Text>}
            <Text style={styles.cardText}>
              Datum: {new Date(item.date).toLocaleDateString('sv-SE')}{' '}
              {new Date(item.date).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Inga sparade promenader.</Text>}
      />

      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => !deleting && setSelected(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>Promenad</Text>
                <Text style={styles.modalLine}>Steg: {selected.steps}</Text>
                {'time' in selected && <Text style={styles.modalLine}>Tid: {selected.time}s</Text>}
                <Text style={styles.modalLine}>Svar: {selected.answer}</Text>
                {selected.mood !== undefined && (
                  <Text style={styles.modalLine}>Mood: {selected.mood}</Text>
                )}
                {selected.reflection && (
                  <Text style={[styles.modalLine, styles.reflection]}>
                    Reflektion: {selected.reflection}
                  </Text>
                )}
                <Text style={styles.modalLine}>
                  Datum: {new Date(selected.date).toLocaleString('sv-SE')}
                </Text>
                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.modalBtn, styles.closeBtn]}
                    disabled={deleting}
                    onPress={() => setSelected(null)}
                  >
                    <Text style={styles.modalBtnText}>Stäng</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalBtn, styles.deleteBtn]}
                    disabled={deleting}
                    onPress={confirmDelete}
                    accessibilityHint="Radera denna promenad"
                  >
                    {deleting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalBtnText}>Radera</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  empty: { textAlign: 'center', marginTop: 32, color: '#666' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#1d3557' },
  modalLine: { fontSize: 15, marginBottom: 6, color: '#2b3f66' },
  reflection: { fontStyle: 'italic' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  modalBtn: {
    flex: 1,
    backgroundColor: '#689FE0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtn: { backgroundColor: '#ADBFD9' },
  deleteBtn: { backgroundColor: '#E57373' },
  modalBtnText: { color: '#fff', fontWeight: '700' },
});
