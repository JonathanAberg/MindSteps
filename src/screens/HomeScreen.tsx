import StartWalkButton from '@/components/StartWalkButton';
import TripleFeatureRow from '@/components/TripleFeatureRow';
import React from 'react';
import { View, Text, StyleSheet, Image,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  AnnieUseYourTelescope_400Regular,
} from '@expo-google-fonts/annie-use-your-telescope'; // Installera med: expo install @expo-google-fonts/annie-use-your-telescope expo-font

const HomeScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({ AnnieUseYourTelescope_400Regular });
  if (!fontsLoaded) return null;

  return (
     
    <SafeAreaView style={styles.safe} testID="screen-home">
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/mindstepslogo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessible
            accessibilityLabel="MindSteps logotyp"
          />
          <Text style={styles.tagline}>one step closer to a better mind</Text>
        </View>

        <View style={styles.buttonWrap}>
          <StartWalkButton />
        </View>

        <View style={styles.helperWrap}>
          <Text style={styles.helperTop}>Redo att rensa tankarna?</Text>
          <Text style={styles.helperBottom}>Din senaste promenad var igår, 2,1 km</Text>
        </View>

        <View style={styles.featuresWrap}>
          <TripleFeatureRow />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    width: '100%', // ⟵ viktigt
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: -40, // ⟵ dra upp logotypen lite
    tintColor: '#689FE0', // <-- färga loggan
  },

  tagline: {
    fontFamily: 'AnnieUseYourTelescope_400Regular', // <— från Google Fonts
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    alignSelf: 'stretch', // ⟵ ge full bredd
    flexShrink: 1, // ⟵ låt den radbrytas istället för att klippas
  },

  /* STARTWALK-BUTTON */
  buttonWrap: {
    width: '100%',
    maxWidth: 520,
    marginTop: 8,
  },

  /* SUBTEXT */
  helperWrap: {
    width: '100%', // ⟵ viktigt
    alignItems: 'center',
    marginTop: 10,
  },
  helperTop: {
    fontSize: 12,
    color: '#304A76',
    textAlign: 'center',
    alignSelf: 'stretch',
    fontFamily: 'Montserrat_500Medium',
  },
  helperBottom: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    alignSelf: 'stretch',
    fontFamily: 'Montserrat_500Medium',
  },

  /* FEATURES */
  featuresWrap: {
    width: '100%',
    maxWidth: 560,
    marginTop: 20,
  },
});
