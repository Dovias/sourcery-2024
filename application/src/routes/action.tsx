import React from 'react';
import { RouteObject } from 'react-router-dom';

import { AppRoutes } from './routes';

import { nonSearchableHeaderRoute } from './header.tsx';

import { ActionLayout } from '../components/action';
import { footerRoute } from './footer.tsx';

export const actionRoute: RouteObject = {
  element: (
    <ActionLayout>
      <ActionLayout.Home.Route.Button route={AppRoutes.CALENDAR} />
      <ActionLayout.Tray>
        <ActionLayout.Tray.Route.Button route={AppRoutes.CALENDAR} icon="calendar-marked" label="Calendar" />
        <ActionLayout.Tray.Route.Button route={AppRoutes.BOOKINGS} icon="person-inverted" label="Bookings" />
        <ActionLayout.Tray.Route.Button route={AppRoutes.APARTMENTS} icon="building" label="Apartments" />
        <ActionLayout.Tray.Route.Button route={AppRoutes.CONTACTS} icon="marker" label="Contacts" />
        <ActionLayout.Tray.Route.Button route={AppRoutes.SETTINGS} icon="gear" label="Settings" />
      </ActionLayout.Tray>
    </ActionLayout>
  ),
  children: [
    nonSearchableHeaderRoute,
    footerRoute
  ]
};
