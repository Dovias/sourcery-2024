import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, RouteObject } from 'react-router-dom';

import { AppRoutes } from './routes';

import { TermsOfService } from '../components/page/terms-of-service/TermsOfService.tsx';
import { NewApartment } from '../components/page/apartment/NewApartment.tsx';
import { Apartments } from '../components/page/apartments/Apartments.tsx';
import { Apartment } from '../components/page/apartment/Apartment.tsx';
import { Error } from '../components/page/error/Error.tsx';
import { Calendar } from '../components/page/calendar/Calendar.tsx';
import { Contacts } from '../components/page/contacts/Contacts.tsx';
import { Settings } from '../components/page/settings/Settings.tsx';
import { Bookings } from '../components/page/bookings/Bookings.tsx';
import { Support } from '../components/page/support/Support.tsx';
import { Logout } from '../components/page/authentication/logout/Logout.tsx';
import { Loader } from '../components/loader/Loader.tsx';

export const contentRoutes: RouteObject[] = [
  {
    path: AppRoutes.LOG_OUT,
    element: <Logout />
  }
];

export const nonSearchableContentRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={AppRoutes.CALENDAR} />
  },
  {
    path: AppRoutes.CALENDAR,
    element: <Calendar />
  },

  // This should be privacy policy route, but we don't have such component for a route to exist...
  {
    path: AppRoutes.TERMS_OF_SERVICE,
    element: <TermsOfService />
  },
  {
    path: AppRoutes.SUPPORT,
    element: <Support />
  },
  //

  {
    path: AppRoutes.ANY,
    element: <Error />
  }
];

export const searchableContentRoutes: RouteObject[] = [
  {
    path: AppRoutes.APARTMENTS,
    element: (
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader />}>
          <Apartments />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: AppRoutes.APARTMENT,
    element: (
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader />}>
          <Apartment />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: AppRoutes.NEW_APARTMENT,
    element: (
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader />}>
          <NewApartment />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: AppRoutes.BOOKINGS,
    element: (
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader />}>
          <Bookings />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: AppRoutes.CONTACTS,
    element: (
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader />}>
          <Contacts />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: AppRoutes.SETTINGS,
    element: (
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loader />}>
          <Settings />
        </Suspense>
      </ErrorBoundary>
    )
  }
];
