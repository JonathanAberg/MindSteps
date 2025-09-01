import React, { useState, type ReactElement } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import OverlayOne from './OverlayOne';
import OverlayTwo, { type Category, type QuestionInterval } from './OverlayTwo';

type Props = { onPress?: () => void };
type Step = 'none' | 'one' | 'two';

export default function StartWalkButton({ onPress }: Props): ReactElement {
  const [step, setStep] = useState<Step>('none');

  const handlePress = () => {
    setStep('one'); // öppna första overlayn
    onPress?.();
  };

  const handleConfirm = (cats: Category[], interval: QuestionInterval) => {
    // spara/starta flödet
    setStep('none');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Starta tanke-promenad</Text>
      </TouchableOpacity>

      <OverlayOne
        visible={step === 'one'}
        onAccept={() => setStep('two')} // gå till andra overlayn
        onDecline={() => setStep('none')}
        onBackdropPress={() => setStep('none')}
      />

      {/* Overlay 2 (preferences) */}
      <OverlayTwo
        visible={step === 'two'}
        onConfirm={handleConfirm}
        onCancel={() => setStep('none')}
        onBackdropPress={() => setStep('none')}
      />
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
