import React from 'react';
import { it, expect, describe } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../../store/reducers/UserReducer.ts';
import searchBarTextReducer from '../../../../store/reducers/searchBarTextReducer.ts';
import { MemoryRouter } from 'react-router-dom';
import { Calendar } from '../Calendar';
import 'intersection-observer';
import 'vitest-canvas-mock';
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
describe('Calendar page', () => {
  it('Page exists', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <Calendar />
        </MemoryRouter>
      </Provider>);

    const heading = await result.findAllByText('Calendar', { exact: false });
    expect(heading).toBeTruthy();
  });
});
