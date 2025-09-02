// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { getOrInitDeviceId } from './utils/deviceId';
import { Text as RNText } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

// Håll splash öppen tills vi manuellt gömmer den
SplashScreen.preventAutoHideAsync().catch(() => {});

const theme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#fff' },
};

let deviceIdGlobal: string = 'unknown';
export const getDeviceId = () => deviceIdGlobal;

export default function App() {
  const [deviceReady, setDeviceReady] = useState(false);

  // 1) Ladda typsnitt
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  // 2) Init deviceId parallellt
  useEffect(() => {
    (async () => {
      const id = await getOrInitDeviceId();
      deviceIdGlobal = id;
      setDeviceReady(true);
    })();
  }, []);

  // 3) När fonts + deviceId är redo: gör Montserrat globalt default på <Text>
  useEffect(() => {
    if (fontsLoaded) {
      // Monkey-patch av RN <Text> för default font
      const DefaultRender = (RNText as any).render;
      if (!DefaultRender.__withMontserrat) {
        (RNText as any).render = function (...args: any[]) {
          const origin = DefaultRender.apply(this, args);
          return React.cloneElement(origin, {
            style: [{ fontFamily: 'Montserrat_400Regular' }, origin.props?.style],
          });
        };
        (RNText as any).render.__withMontserrat = true;
      }
    }
  }, [fontsLoaded]);

  // 4) Göm splash när allt är klart
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && deviceReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, deviceReady]);

  if (!fontsLoaded || !deviceReady) {
    // Låt SplashScreen ligga kvar
    return null;
  }

  return (
    <NavigationContainer theme={theme} onReady={onLayoutRootView}>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
