import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Question } from '@/hooks/questions/useGetQuestionsByCategory';


type Props = {
  question?: Question;
  onPrev: () => void;
  onNext: () => void;
};

const QuestionDisplay: React.FC<Props> = ({question, onPrev, onNext}) => {
   if (!question) return null;
   
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Frågor om fokus 🎯: </Text>
            </View>
            <View style={styles.questionBox}>
                <Text style={styles.questionText}>{question.text}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onPrev}>
                     <Text style={styles.buttonText} > ◀︎ Föregående</Text>
                </TouchableOpacity>

               <TouchableOpacity style={styles.button} onPress={onNext}>
                 <Text style={styles.buttonText} > Nästa ▶︎</Text>
               </TouchableOpacity>
               
            </View>
        </SafeAreaView>
    )
};

export default QuestionDisplay;

const styles = StyleSheet.create ({
    container:{
        backgroundColor: '#DEE8FC',
        padding: 30,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold', 
        color: '#304A76',

    },
    questionBox: {
        backgroundColor: '#ffffff',
        padding: 20,
        width: '100%',
    },
    questionText: {
        color: '#304A76',
        fontSize: 20,
        fontWeight: 'bold',
     
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    button: {
        padding: 10,
        width: 130,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#304A76',
        fontSize: 14, 
        fontWeight: 'bold',
    },
   
});

