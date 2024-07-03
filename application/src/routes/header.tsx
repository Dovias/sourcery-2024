import React from 'react';
import { RouteObject } from 'react-router-dom';

import { nonSearchableContentRoutes, searchableContentRoutes } from './content.tsx';

import { HeaderLayout } from '../components/header';

export const nonSearchableHeaderRoute: RouteObject = {
  element: (
    <HeaderLayout significance={100} emphasis={100}>
      <HeaderLayout.Profile.Button />
    </HeaderLayout>
  ),
  children: nonSearchableContentRoutes
};

export const searchableHeaderRoute: RouteObject = {
  element: (
    <HeaderLayout significance={100} emphasis={100}>
      <HeaderLayout.Search.Field />
      <HeaderLayout.Profile.Button />
    </HeaderLayout>
  ),
  children: searchableContentRoutes
};
