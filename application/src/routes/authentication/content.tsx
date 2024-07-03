import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import { AppRoutes } from '../routes';

import { TermsOfService } from '../../components/page/terms-of-service/TermsOfService.tsx';
import { Support } from '../../components/page/support/Support.tsx';
import { SignUp } from '../../components/page/authentication/signup/SignUp.tsx';
import { Login } from '../../components/page/authentication/login/Login.tsx';

export const contentRoutes: RouteObject[] = [
  {
    path: AppRoutes.LOG_IN,
    element: <Login />
  },
  {
    path: AppRoutes.SIGN_UP,
    element: <SignUp />
  },
  {
    path: AppRoutes.TERMS_OF_SERVICE,
    element: <TermsOfService />
  },
  {
    path: AppRoutes.SUPPORT,
    element: <Support />
  },
  {
    path: AppRoutes.ANY,
    element: <Navigate to={AppRoutes.LOG_IN} />
  }
];
