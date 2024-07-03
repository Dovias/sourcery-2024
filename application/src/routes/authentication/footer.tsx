import React from 'react';
import { RouteObject } from 'react-router-dom';

import { AppRoutes } from '../routes';

import { contentRoutes } from './content.tsx';

import { FooterLayout } from '../../components/footer';

export const footer: RouteObject = {
  element: (
    <FooterLayout significance={100} emphasis={100} className="absolute top-0 left-0 size-full bg-[url('/images/authentication-background.svg')] bg-right-bottom bg-no-repeat">
      <FooterLayout.Route.Button route={AppRoutes.TERMS_OF_SERVICE}>Terms of Service</FooterLayout.Route.Button>
      <FooterLayout.Paragraph>|</FooterLayout.Paragraph>
      <FooterLayout.Route.Button route={AppRoutes.SUPPORT}>Support</FooterLayout.Route.Button>
      <FooterLayout.Paragraph>|</FooterLayout.Paragraph>
      <FooterLayout.Paragraph>{`© ${new Date().getFullYear()} Cognizant`}</FooterLayout.Paragraph>
    </FooterLayout>
  ),
  children: contentRoutes
};
