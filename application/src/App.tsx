import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { AppRoutes, routes, authenticationRoutes } from './routes';

import { RootState } from './store/store.ts';
import { setUser } from './store/reducers/UserReducer.ts';

import { Error } from './components/page/error/Error.tsx';
import { Loader } from './components/loader/Loader.tsx';

import './App.pcss';
import { fetchEmployeeByEmail } from './api/EmployeesApi.tsx';
import { fetchRoleById } from './api/RolesApi.ts';

export function App() {
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setTokenValid(false);
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API}/authentication/check`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const decodedToken = jwtDecode(token);

          if (!decodedToken.sub) {
            setTokenValid(false);
            return;
          }

          const userData = await fetchEmployeeByEmail(decodedToken.sub);
          // Could get it in one request but would require changing api
          const role = await fetchRoleById(userData.roleId);

          dispatch(setUser({ token, ...userData, role }));
          setTokenValid(true);
        }
        else {
          setTokenValid(false);
          return;
        }
      }
      catch (error) {
        console.error('Error checking token validity:', error);
        setTokenValid(false);
      }
      finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const errorPageDisplayAppRoutes = [
    AppRoutes.LOG_IN,
    AppRoutes.SIGN_UP,
    AppRoutes.TERMS_OF_SERVICE,
    AppRoutes.SUPPORT,
    AppRoutes.APARTMENT,
    AppRoutes.APARTMENTS,
    AppRoutes.BOOKINGS,
    AppRoutes.CALENDAR,
    AppRoutes.NEW_APARTMENT,
    AppRoutes.LOG_OUT,
    AppRoutes.SETTINGS,
    AppRoutes.CONTACTS,
    AppRoutes.ROOT
  ];

  const unauthorizedErrorPageDisplayAppRoutes = [
    AppRoutes.APARTMENT,
    AppRoutes.APARTMENTS,
    AppRoutes.BOOKINGS,
    AppRoutes.CALENDAR,
    AppRoutes.NEW_APARTMENT,
    AppRoutes.SETTINGS,
    AppRoutes.CONTACTS
  ];

  const shouldDisplayErrorPage = !tokenValid && !user.id
    && !errorPageDisplayAppRoutes.includes(location.pathname as typeof errorPageDisplayAppRoutes[number]);
  const shouldDisplayErrorPageWhenUnauthorized = !tokenValid && !user.id
    && unauthorizedErrorPageDisplayAppRoutes.includes(location.pathname as typeof unauthorizedErrorPageDisplayAppRoutes[number]);

  if (loading) {
    return <Loader />;
  }
  else if (shouldDisplayErrorPage || shouldDisplayErrorPageWhenUnauthorized) {
    return <Error />;
  }

  const authorizedRoutes = user.id ? [...routes, ...authenticationRoutes.filter(route => route.path !== AppRoutes.ANY)] : authenticationRoutes;
  const authorizedRouter = createBrowserRouter(authorizedRoutes);

  return <RouterProvider router={authorizedRouter} />;
}
