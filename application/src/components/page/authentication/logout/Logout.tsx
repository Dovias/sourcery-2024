import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { AppRoutes } from '../../../../routes';

import { useAppDispatch } from '../../../../store/store';
import { logOut } from '../../../../store/reducers/UserReducer';

export const Logout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logOut());
    Cookies.remove('token');
    navigate(AppRoutes.LOG_IN);
  }, []);

  return (
    <h1>Logout</h1>
  );
};
