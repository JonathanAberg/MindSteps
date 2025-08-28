/// <reference types="jest" />
/* eslint-env jest */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
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

test('renders app root', async () => {
  const { getByText, getAllByText } = render(<App />);
  await waitFor(() => {
    expect(getByText('one step closer to a better mind')).toBeTruthy();
    expect(getAllByText('Hem')).toHaveLength(2); 
  });
});


