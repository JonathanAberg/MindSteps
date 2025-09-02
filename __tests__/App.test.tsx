/// <reference types="jest" />
/* eslint-env jest */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../src/App';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock the actual fonts used in App.tsx
jest.mock('@expo-google-fonts/montserrat', () => ({
  useFonts: () => [true],
  Montserrat_400Regular: 'Montserrat_400Regular',
  Montserrat_500Medium: 'Montserrat_500Medium',
  Montserrat_700Bold: 'Montserrat_700Bold',
}));

// Mock deviceId so deviceReady is always true
jest.mock('../src/utils/deviceId', () => ({
  getOrInitDeviceId: jest.fn(() => Promise.resolve('test-device-id')),
}));

// Mock SplashScreen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

test('renders app root', async () => {
  const { getByText, getAllByText } = render(<App />);
  await waitFor(() => {
    expect(getByText('one step closer to a better mind')).toBeTruthy();
    expect(getAllByText('Hem')).toHaveLength(2);
  });
});
