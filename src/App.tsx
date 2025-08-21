import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import MainTabs from './navigation/MainTabs';

const theme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#fff' }, // så du slipper grå bakgrund
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <MainTabs />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
