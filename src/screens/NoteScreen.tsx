import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoteScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Skriv en notis 📒</Text>
    </View>
  );
};

export default NoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontStyle: 'italic',
  },
});
