import React, { type ReactElement } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

type Props = { onPress?: () => void };

export default function StartWalkButton({ onPress }: Props): ReactElement {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Starta tanke-promenad</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}>({
  container: { marginTop: 20, alignItems: 'center' },
  button: {
    backgroundColor: '#DEE8FC',
    padding: 20,
    width: 300,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#304A76', fontSize: 18, fontWeight: 'bold' },
});
