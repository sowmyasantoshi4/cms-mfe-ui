import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/globalState/store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders Home component when navigating to the root route', () => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );

  // Check if the Home component is displayed
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
