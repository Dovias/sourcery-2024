import React from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { it, expect, describe } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import userReducer from '../../../../../store/reducers/UserReducer.ts';
import searchBarTextReducer from '../../../../../store/reducers/searchBarTextReducer.ts';

import { Login } from '../Login.tsx';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    profileBase64: '',
    token: '',
    isLogged: false,
    role: null,
    jobTitle: '',
    city: '',
    id: '',
    country: ''
  },
  searchBarText: { text: '' }
};

const rootReducer = combineReducers({
  user: userReducer,
  searchBarText: searchBarTextReducer
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState
});
describe('Login page', () => {
  it('Welcome message exists', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleOAuthProvider clientId="">
            <Login />
          </GoogleOAuthProvider>
        </MemoryRouter>
      </Provider>);

    const welcomeText = result.getByText('Welcome to Cognizant Apartments', { exact: false });
    expect(welcomeText).toBeTruthy();
  });
});
