/// <reference types="jest" />
/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders app root', () => {
  const { getByText } = render(<App />);
  expect(getByText(/open up App\.tsx/i)).toBeTruthy();
});
