import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { Question } from '@/hooks/questions/useGetQuestionsByCategory';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  question?: Question | null;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
  index?: number;
  total?: number;
  testID?: string;
};

const QuestionDisplay: React.FC<Props> = ({
  question,
  onPrev,
  onNext,
  title = 'Frågor',
  index,
  total,
}) => {
  if (!question) return null;

  const showCounter = typeof index === 'number' && typeof total === 'number' && total > 0;

  return (
    <View style={styles.container}>
      {/* Titel/counter kvar men dold */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {showCounter && (
          <Text style={styles.counter}>
            {index! + 1} / {total}
          </Text>
        )}
      </View>

      {/* Vitt kort med skugga */}
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>{question.text}</Text>

          {/* Runda knappar med ikoner */}
          <View style={styles.roundButtonsRow}>
            <View style={styles.roundCol}>
              <View style={styles.roundBtn}>
                <Ionicons name="mic-outline" style={styles.roundIcon} />
              </View>
              <Text style={styles.roundCaption}>Spela in{'\n'}ljud</Text>
            </View>
            <View style={styles.roundCol}>
              <View style={styles.roundBtn}>
                <MaterialCommunityIcons name="notebook-outline" style={styles.roundIcon} />
              </View>
              <Text style={styles.roundCaption}>Skriv en{'\n'}notis</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Pillerknappar: Föregående / En fråga till */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.pillBtn}
          onPress={onPrev}
          accessibilityRole="button"
          accessibilityLabel="Föregående fråga"
          hitSlop={styles.hitSlop}
        >
          <View style={styles.btnContent}>
            <Ionicons name="chevron-back-outline" style={styles.pillIcon} />
            <Text style={styles.pillText}>Föregående fråga</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pillBtn}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel="Nästa fråga"
          hitSlop={styles.hitSlop}
        >
          <View style={styles.btnContent}>
            <Text style={styles.pillText}>En fråga till</Text>
            <Ionicons name="chevron-forward-outline" style={styles.pillIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuestionDisplay;

const COLORS = {
  darkBlue: '#304A76',
  card: '#FFFFFF',
  shadow: '#000',
  lightBlue: '#DEE8FC',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingTop: 4,
  },

  titleRow: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 20, color: COLORS.darkBlue, flexShrink: 1 },
  counter: { fontSize: 14, color: COLORS.darkBlue, opacity: 0.7 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 50,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  questionText: {
    color: '#000',
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 18,
  },

  roundButtonsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 2,
  },
  roundCol: { alignItems: 'center', justifyContent: 'center' },
  roundBtn: {
    width: 76,
    height: 76,
    borderRadius: 100,
    backgroundColor: COLORS.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  roundIcon: {
    fontSize: 28,
    color: COLORS.darkBlue,
  },
  roundCaption: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 16,
    color: '#000',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card, // vit bakgrund
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 4,
  },
  pillText: {
    color: '#7E9CD2',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },
  pillIcon: {
    fontSize: 18,
    color: '#7E9CD2',
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    elevation: 4,
  },
});
