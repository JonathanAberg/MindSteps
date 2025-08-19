import React from '@react';
import { View, Text, StyleSheet } from 'react-native';

const NoteScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Skriv en notis 📒</Text>
    </View>
  );
};

export default NoteScreen;
