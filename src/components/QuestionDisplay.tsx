import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const QuestionDisplay: React.FC = () => {
   

    

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.questionText}>{}</Text>
            </View>
        </SafeAreaView>
    )




};

export default QuestionDisplay;

const styles = StyleSheet.create ({
    container:{

    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});