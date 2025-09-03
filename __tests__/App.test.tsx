/// <reference types="jest" />
/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../src/App';


jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@expo-google-fonts/annie-use-your-telescope', () => ({
  useFonts: () => [true],
  AnnieUseYourTelescope_400Regular: 'AnnieUseYourTelescope_400Regular',
}));

jest.mock('@expo-google-fonts/montserrat', () => ({
  useFonts: () => [true],
  Montserrat_400Regular: 'Montserrat_400Regular',
  Montserrat_600SemiBold: 'Montserrat_600SemiBold',
  Montserrat_700Bold: 'Montserrat_700Bold',
}));

jest.mock('../src/utils/deviceId', () => ({
  getOrInitDeviceId: jest.fn().mockResolvedValue('mock-device-id'),
}));

test('renders Home as initial screen', async () => {
  render(<App />);
  expect(await screen.findByTestId('screen-home')).toBeTruthy();
  expect(screen.queryByTestId('screen-duringwalk')).toBeNull();
});
