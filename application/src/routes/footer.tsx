import React from 'react';
import { RouteObject } from 'react-router-dom';

import { AppRoutes } from './routes';

import { searchableHeaderRoute } from './header.tsx';

import { FooterLayout } from '../components/footer';

export const footerRoute: RouteObject = {
  element: (
    <FooterLayout significance={200} emphasis={100}>
      <FooterLayout.Paragraph>{`Copyright © ${new Date().getFullYear()} Cognizant`}</FooterLayout.Paragraph>
      <FooterLayout.Route.Button route={AppRoutes.TERMS_OF_SERVICE}>Privacy Policy</FooterLayout.Route.Button>
    </FooterLayout>
  ),
  children: [
    searchableHeaderRoute
  ]
};
