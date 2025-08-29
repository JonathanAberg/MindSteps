import React, {useState} from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import QuestionDisplay from "@/components/QuestionDisplay";
import {useGetQuestionByCategory} from "@/hooks/questions/useGetQuestionsByCategory";
import { useEffect } from "react";
import apiClient from "@/api/client";
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

  const category = "Fokus";
  const {data, loading, error} = useGetQuestionByCategory(category);

  useEffect(() => {
  (async () => {
    try {
      const res = await apiClient.get("/questions/category/Fokus");
      console.log("✅ API OK, antal frågor:", res.data?.length);
    } catch (e: any) {
      console.log("❌ API fel:", e.message, e.response?.status);
    }
  })();
}, []);

  const [index, setIndex] = useState(0);
  const count = data?.length ?? 0;

  const next = () => {
    if (!count) return;
    setIndex((i) => (i + 1) % count);
  };

const prev = () => {
  if(!count) return;
  setIndex((i) => (i - 1 + count) % count);
};

if(loading) return <SafeAreaView style={styles.container}><Text>Laddar...</Text></SafeAreaView>;
if (error) return <SafeAreaView style={styles.container}><Text>Något gick fel.</Text></SafeAreaView>;
if (!count) return <SafeAreaView style={styles.container}><Text>Inga frågor i {category}</Text></SafeAreaView>
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>During Walk</Text>
      <QuestionDisplay
        question={data![index]}
        onPrev={prev}
        onNext={next}
        />


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