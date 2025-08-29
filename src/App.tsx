import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import MainTabs from './navigation/MainTabs';
import { getOrInitDeviceId } from './utils/deviceId';


const theme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#fff' }, // så du slipper grå bakgrund
};

let deviceIdGlobal: string = 'unknown';

export const getDeviceId = () => deviceIdGlobal;

export default function App() {
  const [ready, setReady] = useState(false);


  useEffect(() => {
    const initDeviceId = async () => {
      console.log('⏳ App useEffect running...');
      const id = await getOrInitDeviceId();
      deviceIdGlobal = id;
      console.log('✅ Device ID ready:', id);
      setReady(true);
    };
    initDeviceId();
  }, []);


  if (!ready) return null;

  return (
    <NavigationContainer theme={theme}>
      <MainTabs />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
