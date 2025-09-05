import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../buttons/PrimaryButton';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<Props> = ({ message = 'Något gick fel.', onRetry }) => (
  <View style={styles.root} accessibilityRole="alert" accessibilityLabel="Felmeddelande">
    <Text style={styles.text}>{message}</Text>
    {onRetry && <PrimaryButton title="Försök igen" onPress={onRetry} style={styles.btn} />}
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { marginBottom: 16, color: '#E53935', fontWeight: '700' },
  btn: { alignSelf: 'center' },
});

export default ErrorView;
