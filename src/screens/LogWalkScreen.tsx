import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
//import MoodSelector from '@/components/MoodSelector';

/* Hit kommer man när man trycker på STOPPA PROMENAD  på DuringWalkScreen
* Här visas hur långt man gått och hur länge man gått. Hook getWalkInfo kan användas här
*Därunder kommer fråga om hur man mrå efter promenad och MoodSelectorn
* Därefter kommer en INPUTmöjlighet för att skriva ner en reflektion och KNAPP för att spara hela sessionen hook useSaveSession
 */

const LogWalkScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Log a Walk</Text>
      {/* Här visas hur långt man gått och hur länge man gått 
      <MoodSelector />
       Additional components for logging walk details can be added here */}
    </SafeAreaView>
  );
};

export default LogWalkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
