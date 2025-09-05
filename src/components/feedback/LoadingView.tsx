import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export const LoadingView = ({ label = 'Laddar...' }: { label?: string }) => (
  <View style={styles.root} accessibilityRole="text" accessibilityLabel={label}>
    <ActivityIndicator size="large" color="#689FE0" />
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { marginTop: 12, color: '#304A76', fontWeight: '600' },
});

export default LoadingView;
