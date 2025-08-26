import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';


//Efter man tryckt på starta promenad på Home screen och i den overlayen 
// som kom upp valt att få frågor eller ej så kommer man hit. 
// Här ser man under promenaden hur klockan tickar och en stoppknapp för när man
// vill avsluta promenaden.
// Kanske vill vi att frågorna kommer upp här i text samtidigt som de läses upp av appen?
// Kanske vill vi ha en inspelningsknapp för att spela in svar på frågorna?
// Eller ska man kunna skriva in svar på frågorna? Svårt när man går men kanske ngt man vill kunna stanna upp och göra?

const DuringWalkScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>During Walk</Text>

      <Text> Här ska det ligga en component StopWatch  som tickar under pågående promenad</Text>

      <Text> Här ska det ligga en component StopWalk för att avsluta promenaden, skicka info och navigera till LogWalkScreen. Koppla till backend genom hook useEndWalk(som skickar {JSON.stringify(walkInfo)})</Text>

      <Text> Här ska det ligga en component QuestionDisplay för att visa frågorna under promenaden. Frågorna hämtas från frågebatteri valt av användaren i inställnignarna. hook useQuestions</Text>

      <Text> Här ska det ligga en component RecordYourAnswer för att spela in svar på frågorna. hook useRecordAnswer</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DuringWalkScreen;
