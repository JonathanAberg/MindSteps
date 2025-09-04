import React, { useState, type ReactElement } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import OverlayOne, { type ThumbChoice } from './OverlayOne';
import OverlayTwo, { type Category, type QuestionInterval } from './OverlayTwo';
import OverlayThree from './OverlayThree';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '@/store/SessionContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Definiera stack-parametrarna
type RootStackParamList = {
  StartScreen: undefined;
  DuringWalk: {
    prefs: { cats: Category[]; interval: QuestionInterval } | null;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StartScreen'>;

type Props = { onPress?: () => void };
type Step = 'none' | 'one' | 'two' | 'three';

export default function StartWalkButton({ onPress }: Props): ReactElement {
  const [step, setStep] = useState<Step>('none');
  const [prefs, setPrefs] = useState<{ cats: Category[]; interval: QuestionInterval } | null>(null);

  const navigation = useNavigation<NavigationProp>();
  const { start, active } = useSession();

  const handlePress = () => {
    setStep('one');
    onPress?.();
  };

  const handleOverlayOneConfirm = (choice: ThumbChoice) => {
    if (choice === 'up') setStep('two');
    else setStep('three');
  };

  const handleConfirmPrefs = (cats: Category[], interval: QuestionInterval) => {
    setPrefs({ cats, interval });
    setStep('three');
  };

  const handleConfirmAll = async () => {
    if (!active) {
      try {
        await start();
      } catch (e) {
        // Om permissions nekas, avbryt
        setStep('none');
        return;
      }
    }
    navigation.navigate('DuringWalk', { prefs });
    setStep('none');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Starta tanke-promenad</Text>
      </TouchableOpacity>

      <OverlayOne
        visible={step === 'one'}
        onConfirm={handleOverlayOneConfirm}
        onCancel={() => setStep('none')}
        onBackdropPress={() => setStep('none')}
      />

      <OverlayTwo
        visible={step === 'two'}
        onConfirm={handleConfirmPrefs}
        onCancel={() => setStep('one')}
        onBackdropPress={() => setStep('none')}
      />

      <OverlayThree
        visible={step === 'three'}
        onConfirmAll={handleConfirmAll}
        onBack={() => setStep('two')}
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
  buttonText: { color: '#304A76', fontSize: 18, fontFamily: 'Montserrat_700Bold' },
});
