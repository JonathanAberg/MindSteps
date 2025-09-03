import React, {useState} from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import QuestionDisplay from "@/components/QuestionDisplay";
import {useGetQuestionByCategory} from "@/hooks/questions/useGetQuestionsByCategory";
import { useRoute, RouteProp } from "@react-navigation/native";
import StopWatch from "@/components/StopWatch"

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

 // Define the route param types
 type RootStackParamList = {
  DuringWalk: {
    prefs: { 
      cats: string[]; 
      interval: number 
    } | null;
  };
};

type DuringWalkScreenRouteProp = RouteProp<RootStackParamList, 'DuringWalk'>;

const DuringWalkScreen: React.FC = () => {
  // Get route parameters
  const route = useRoute<DuringWalkScreenRouteProp>();
  
  // Access the preferences passed from StartWalkButton
  const prefs = route.params?.prefs;
  
  // Use the first category from preferences or default to "Fokus"
  const category = (prefs?.cats?.[0] || "fokus").toLowerCase();
    console.log("🔎 Category skickas till hook:", category);
  
  // Get the interval (will be useful for automatic question cycling)
  const interval = prefs?.interval || 30;
  
  const {data, loading, error} = useGetQuestionByCategory(category);

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
    <SafeAreaView style={styles.safe} >
      <View style={styles.container} testID="screen-duringwalk" >

  <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
  <StopWatch
    autoStart
    onSecondTick={(elapsedMs) => {
      // Byt fråga varje 'interval' sekund (om du vill):
      // if (elapsedMs > 0 && Math.floor(elapsedMs/1000) % interval === 0) next();
    }}
    onStop={(elapsedMs) => {
      // Skicka vidare till LogWalk, spara i backend, etc.
      // navigation.navigate('LogWalk', { elapsedMs })
    }}
  />
</View>
      
      
      {/* Show selected preferences */}
      <Text style={styles.subtitle}>
        Kategori: {category} • Intervall: {interval}s
      </Text>

      
     

    <QuestionDisplay
  question={data![index]}
  onPrev={prev}
  onNext={next}
  title={`Frågor om ${category}`}
  index={index}
  total={count}
/>
       </View>
    </SafeAreaView>
  );
};

export default DuringWalkScreen;

const BG = '#EAF1FF';
//const CARD = '#FFFFFF';
//const TEXT = '#1F2937';
//const BLUE_TEXT = '#1D4ED8';
//const PILL_BG = '#E0EAFF';
const TITLE_BLUE = '#274C7A';

const styles = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: TITLE_BLUE,
  },
});