import React from 'react';
import { RouteObject } from 'react-router-dom';

import { AppRoutes } from '../routes';

import { ActionLayout } from '../../components/action';
import { footer } from './footer.tsx';

export const actionRoute: RouteObject = {
  element: (
    <ActionLayout>
      <ActionLayout.Home.Route.Button route={AppRoutes.LOG_IN} />
    </ActionLayout>
  ),
  children: [
    footer
  ]
};
