import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../../store/reducers/UserReducer.ts';
import searchBarTextReducer from '../../../../store/reducers/searchBarTextReducer.ts';
import { MemoryRouter } from 'react-router-dom';
import { Settings } from '../Settings.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fetchUser } from '../../../../api/SettingsPageApi.ts';
import { AxiosResponse } from 'axios';
import { EmployeeModel } from '../../../../models/EmployeeModel';

const initialState = {
  user: {
    firstName: 'Petras',
    lastName: 'Petrauskas',
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
vi.mock('../../../../api/SettingsPageApi.ts');
vi.mocked(fetchUser).mockImplementation(() => {
  return { data: initialState.user } as unknown as Promise<AxiosResponse<EmployeeModel, unknown>>;
});
describe('Settings page', () => {
  it('Page exists', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleOAuthProvider clientId="">
            <Settings />
          </GoogleOAuthProvider>
        </MemoryRouter>
      </Provider>);

    const heading = result.getByText('View and manage who can administrate apartment bookings', { exact: false });
    expect(heading).toBeTruthy();
  });
  it('Personal settings displays accurate data', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleOAuthProvider clientId="">
            <Settings />
          </GoogleOAuthProvider>
        </MemoryRouter>
      </Provider>);
    fireEvent.click(result.getAllByText('Personal settings')[0]);
    const text = result.getAllByText('Property', { exact: false })[0];
    expect(text).toBeTruthy();
    const name = (await result.findAllByDisplayValue('Petras'))[0];
    expect(name).toBeTruthy();
    const lastname = result.getAllByDisplayValue('Petrauskas')[0];
    expect(lastname).toBeTruthy();
  });
  it('Navigate to authentication settings', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <GoogleOAuthProvider clientId="">
            <Settings />
          </GoogleOAuthProvider>
        </MemoryRouter>
      </Provider>);
    fireEvent.click(result.getAllByText('Authentication settings')[0]);
    const text = result.getByText('You are not linked account to Google account', { exact: false });
    expect(text).toBeTruthy();
  });
});
