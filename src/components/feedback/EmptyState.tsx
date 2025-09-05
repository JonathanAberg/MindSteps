import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  hint?: string;
}

export const EmptyState: React.FC<Props> = ({ title, hint }) => (
  <View style={styles.root} accessibilityLabel={title} accessibilityHint={hint}>
    <Text style={styles.title}>{title}</Text>
    {hint && <Text style={styles.hint}>{hint}</Text>}
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 18, fontWeight: '700', color: '#304A76' },
  hint: { marginTop: 8, color: '#567', textAlign: 'center' },
});

export default EmptyState;
