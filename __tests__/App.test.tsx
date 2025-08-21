/// <reference types="jest" />
/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/App';

test('renders app root', () => {
  const { getByText, getAllByText } = render(<App />);
  expect(getByText('MindSteps 👣')).toBeTruthy();
  expect(getAllByText('Hem')).toHaveLength(2); // Tab + screen title
});
