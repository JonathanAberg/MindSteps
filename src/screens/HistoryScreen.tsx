import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { fetchSessions } from '../services/api';
import { HistorySession } from 'types/sessionProps';
import { getDeviceId } from '@/App';


export default function HistoryScreen() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const deviceId = getDeviceId(); // Get deviceId from global state
        if (!deviceId) {
          setError("Failed to fetch device ID.");
          return;
        }
        const data = await fetchSessions(deviceId); // Pass deviceId to the API
        setSessions(data);
      } catch (err) {
        setError("Failed to fetch sessions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>

      <View testID="screen-history"/> {/* är osynlig för appen*/}

      <Text style={styles.title}>History</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>Steps: {item.steps}</Text>
            <Text style={styles.cardText}>Mood: {item.answer}</Text>
            <Text style={styles.cardText}>Date: {new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
      />
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
});
