import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { Question } from '@/hooks/questions/useGetQuestionsByCategory';


type Props = {
  question?: Question | null;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
  index?: number;
  total?: number;
  testID?: string;
};

const QuestionDisplay: React.FC<Props> = ({question, onPrev, onNext, title='Frågor', index, total}) => {
   if (!question) return null;
   

   const showCounter = typeof index === 'number' && typeof total === 'number' && total > 0;

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {showCounter && <Text style={styles.counter}>{index! + 1} / {total}</Text>}
            </View>
         
            
            <View style={styles.card}>
                <ScrollView  
                contentContainerStyle={styles.cardContent}
                showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.questionText}>{question.text}</Text>
                </ScrollView>
            </View>
        <View>
            <TouchableOpacity
                style={[styles.button, styles.buttonLeft]}
                onPress={onPrev}
                accessibilityRole="button"
                accessibilityLabel="Föregående fråga"
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                >
                    <Text style={styles.buttonText}>◀︎ Föregående</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.buttonRight]}
                onPress={onNext}
                accessibilityRole="button"
                accessibilityLabel="Nästa fråga"
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                >
                    <Text style={styles.buttonText}>Nästa ▶︎</Text>
            </TouchableOpacity>
        </View>
        </View>
    )
};

export default QuestionDisplay;

const BG = '#DEE8FC';
const TITLE = '#304A76';
const CARD_BG = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TITLE,
    flexShrink: 1,
  },
  counter: {
    fontSize: 14,
    color: TITLE,
    opacity: 0.7,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    minHeight: 100,
    maxHeight: 240,       // skyddar layouten vid lång text
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardContent: {
    padding: 16,
  },
  questionText: {
    color: TITLE,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  buttonLeft: {
    borderWidth: 1,
    borderColor: TITLE,
  },
  buttonRight: {
    borderWidth: 1,
    borderColor: TITLE,
  },
  buttonText: {
    color: TITLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});