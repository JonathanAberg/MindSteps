/// <reference types="jest" />
/* eslint-env jest */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../src/App';

test('renders app root', async () => {
  const { getByText, getAllByText } = render(<App />);
  await waitFor(() => {
    expect(getByText('one step closer to a better mind')).toBeTruthy();
    expect(getAllByText('Hem')).toHaveLength(2); // Tab + screen title
  });

});
