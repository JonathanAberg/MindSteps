// src/screens/InfoScreen.tsx
import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';

const Line = () => <View style={styles.hr} />;

const InfoScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>

      <View testID="screen-info"> {/* är osynlig för appen*/}
      <Text>Info</Text>
    </View>


      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Välkommen till MindSteps</Text>
        <Text style={styles.lead}>En app som hjälper dig att tänka klart genom att gå.</Text>

        <Line />

        <View >
          <Text style={styles.sectionTitle}>Kom igång automatiskt</Text>
          <Text style={styles.sectionText}>
            Appen startar när du börjar promenera – du behöver inte göra något själv.
          </Text>
        </View>

        <View >
          <Text style={styles.sectionTitle}>Reflektera under promenaden</Text>
          <Text style={styles.sectionText}>
            Få en fråga att tänka på eller välj en själv. Du kan även prata in dina tankar.
          </Text>
        </View>

        <View >
          <Text style={styles.sectionTitle}>Se tillbaka</Text>
          <Text style={styles.sectionText}>
            Efter promenaden loggas sträcka, tid och hur du mådde. Följ din utveckling över tid.
          </Text>
        </View>

        <View >
          <Text style={styles.sectionTitle}>Påminnelser</Text>
          <Text style={styles.sectionText}>
            Har du suttit still länge? Appen påminner dig om att ta en tanke-promenad.
          </Text>
        </View>

        <Line />

        <View style={styles.note}>
          <Text style={styles.noteText}>
            MindSteps är ingen träningsapp – fokus ligger på ditt mentala välmående.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#304A76',
    fontFamily: 'Montserrat_700Bold',
  },
  lead: {
    fontSize: 16,
    color: '#7E9CD2',
    fontFamily: 'Montserrat_500Medium',
  },
  hr: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 4,
    color: '#304A76',
  },
  sectionText: {
    fontSize: 12,
    color: '#304A76',
  },
  note: {
    backgroundColor: '#f3f7ff',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },

  noteText: { fontSize: 14, color: '#304A76', fontFamily: 'Montserrat_700Bold' },

});

export default InfoScreen;
