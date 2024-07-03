import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../../store/reducers/UserReducer.ts';
import searchBarTextReducer from '../../../../store/reducers/searchBarTextReducer.ts';
import { MemoryRouter } from 'react-router-dom';
import { fetchAllApartmentsWithSearch } from '../../../../api/ApartmentsApi.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Apartments } from '../Apartments.tsx';
import { ApartmentModel } from '../../../../models/ApartmentModel';
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
vi.mock('../../../../api/ApartmentsApi.ts');
vi.mocked(fetchAllApartmentsWithSearch).mockImplementation(() => {
  return [{
    name: 'Apartment 1',
    id: '46416416',
    rooms: [{ capacity: 1 }]
  }] as unknown as Promise<ApartmentModel[]>;
});
describe('Apartments page', () => {
  it('Page has apartments', async () => {
    const result = render(
      <QueryClientProvider client={new QueryClient()}>
        <Provider store={store}>
          <MemoryRouter>
            <Apartments />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>);

    let text = await result.findByText('View and manage available apartments and their information', { exact: false });
    expect(text).toBeTruthy();
    text = await result.findByText('Apartment 1', { exact: false });
    expect(text).toBeTruthy();
  });
});
