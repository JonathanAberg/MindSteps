import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

export const getOrInitDeviceId = async (): Promise<string> => {
  const existing = await AsyncStorage.getItem('deviceUniqueId');
  if (existing) return existing;

  let newId = 'unknown';

  if (Platform.OS === 'android') {
    newId = await Application.getAndroidId() ?? 'unknown-android';
  } else {
    const iosId = await Application.getIosIdForVendorAsync();
    newId = iosId ?? 'unknown-ios';
  }

  await AsyncStorage.setItem('deviceUniqueId', newId);
  return newId;
};
