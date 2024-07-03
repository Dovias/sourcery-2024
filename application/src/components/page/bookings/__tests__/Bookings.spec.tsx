import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../../store/reducers/UserReducer.ts';
import searchBarTextReducer from '../../../../store/reducers/searchBarTextReducer.ts';
import { MemoryRouter } from 'react-router-dom';
import { Bookings } from '../Bookings.tsx';
import { createBookingsSocket, fetchAllBookingsCompactWithSearch } from '../../../../api/BookingsApi.tsx';
import { Client } from '@stomp/stompjs';
import { BookingCompactModel } from '../../../../models/BookingCompactModel.ts';
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
    id: '74856',
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
vi.mock('../../../../api/BookingsApi.tsx');
vi.mocked(fetchAllBookingsCompactWithSearch).mockImplementation(() => {
  return [{
    start: new Date('2010-11-16'),
    end: new Date('2010-11-17'),
    roomId: '101',
    roomName: 'Room 101',
    apartmentId: '201',
    apartmentName: 'Apartment 201',
    employeeId: '74856',
    employeeCompact: {
      id: '74856',
      firstName: 'Petras',
      lastName: 'Petrauskas'
    }
  },
  {
    start: new Date('2011-11-16'),
    end: new Date('2011-11-17'),
    roomId: '102',
    roomName: 'Room 102',
    apartmentId: '202',
    apartmentName: 'Apartment 202',
    employeeId: '04687',
    employeeCompact: {
      id: '04687',
      firstName: 'Jonas',
      lastName: 'Jonaitis'
    }
  },
  {
    start: new Date('2034-05-19'),
    end: new Date('2034-05-21'),
    roomId: '103',
    roomName: 'Room 103',
    apartmentId: '203',
    apartmentName: 'Apartment 203',
    employeeId: '74856',
    employeeCompact: {
      id: '74856',
      firstName: 'Petras',
      lastName: 'Petrauskas'
    }
  },
  {
    start: new Date('2024-05-21'),
    end: new Date('2025-05-20'),
    roomId: '104',
    roomName: 'Room 104',
    apartmentId: '204',
    apartmentName: 'Apartment 204',
    employeeId: '74856',
    employeeCompact: {
      id: '74856',
      firstName: 'Petras',
      lastName: 'Petrauskas'
    }
  }] as unknown as Promise<BookingCompactModel[]>;
});
vi.mocked(createBookingsSocket).mockImplementation(() => {
  return {
    activate: () => {}
  } as Client;
});
describe('Bookings page', () => {
  it('Page has bookings and admin tabs', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <Bookings />
        </MemoryRouter>
      </Provider>);

    let text = result.getByText('View and manage upcoming apartment reservations', { exact: false });
    expect(text).toBeTruthy();
    text = await result.findByText('Petras Petrauskas', { exact: false });
    expect(text).toBeTruthy();
    const All = await result.findAllByText('All bookings');
    expect(All[0]).toBeTruthy();
    const My = await result.findAllByText('My bookings');
    expect(My[0]).toBeTruthy();
  });
  it('Booking tabs work correctly', async () => {
    const result = render(
      <Provider store={store}>
        <MemoryRouter>
          <Bookings />
        </MemoryRouter>
      </Provider>);
    fireEvent.click(await result.findByText('Archive (2)'));
    const archives = await result.findAllByText('Petras Petrauskas', { exact: false });
    expect(archives).toHaveLength(1);
    fireEvent.click(await result.findByText('Current (1)'));
    const current = await result.findAllByText('Petras Petrauskas', { exact: false });
    expect(current).toHaveLength(1);
    fireEvent.click(await result.findByText('Upcoming (1)'));
    const upcoming = await result.findAllByText('Petras Petrauskas', { exact: false });
    expect(upcoming).toHaveLength(1);
  });
});
