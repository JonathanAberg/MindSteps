import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

/**
 * Efter man tryckt på "Starta promenad" på Home screen och i den overlayn
 * valt att få frågor eller ej så kommer man hit.
 *
 * Här ser man under promenaden hur klockan tickar och en stoppknapp för när man
 * vill avsluta promenaden.
 *
 * Kanske vill vi att frågorna kommer upp här i text samtidigt som de läses upp av appen?
 * Kanske vill vi ha en inspelningsknapp för att spela in svar på frågorna?
 * Eller ska man kunna skriva in svar på frågorna? Svårt när man går men kanske ngt man vill kunna stanna upp och göra?
 */

const DuringWalkScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>During Walk</Text>

      {/*
        Här ska det ligga en component <StopWatch /> som tickar under pågående promenad

        Här ska det ligga en component <StopWalk /> för att avsluta promenaden, skicka info
        och navigera till LogWalkScreen. Koppla till backend genom hook useEndWalk
        (som skickar { JSON.stringify(walkInfo) })

        Här ska det ligga en component <QuestionDisplay /> för att visa frågorna under promenaden.
        Frågorna hämtas från frågebatteri valt av användaren i inställningarna. hook useQuestions

        Här ska det ligga en component <RecordYourAnswer /> för att spela in svar på frågorna. hook useRecordAnswer
      */}
    </SafeAreaView>
  );
};

export default DuringWalkScreen;

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