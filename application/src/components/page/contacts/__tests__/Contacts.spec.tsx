import React from 'react';
import { it, expect, describe } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../../store/reducers/UserReducer.ts';
import searchBarTextReducer from '../../../../store/reducers/searchBarTextReducer.ts';
import { MemoryRouter } from 'react-router-dom';
import { Contacts } from '../Contacts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const initialState = {
  user: {
    firstName: 'Petras',
    lastName: 'Petrauskas',
    email: '',
    profileBase64: '',
    token: '',
    isLogged: false,
    role: {
      roleId: 2,
      roleName: 'ADMIN'
    },
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
describe('Contacts page', () => {
  it('Page exists', async () => {
    const result = render(
      <QueryClientProvider client={new QueryClient()}>
        <Provider store={store}>
          <MemoryRouter>
            <Contacts />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>);

    const heading = await result.findByText('Address and contact details for the apartments', { exact: false });
    expect(heading).toBeTruthy();
  });
});
