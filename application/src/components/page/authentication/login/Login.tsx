import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

import { AppRoutes } from '../../../../routes';

import { apiRequestWrapper } from '../../../../api/apiRequestWrapper/ApiRequestWrapper.ts';
import { Credentials, GoogleAuth, loginUser, loginUserGoogle } from '../../../../api/AuthenticationApi.ts';

import { RootState, useAppDispatch } from '../../../../store/store';
import { setUser } from '../../../../store/reducers/UserReducer';

import { TextButton } from '../../../input/buttons/TextButton.tsx';
import { AuthenticationArticle } from '../article';

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userState.id) {
      navigate(AppRoutes.CALENDAR);
    }
  }, [userState.id, navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const [loginResponse, loginError] = await apiRequestWrapper(() => loginUser(credentials));

    if (loginError) {
      toast.error(loginError.detail || 'An unexpected error occurred');
      return;
    }
    dispatch(setUser(loginResponse));
    Cookies.set('token', loginResponse.token, { expires: 7 });
  };

  const handleGoogleLogin = async (token: string) => {
    const googleAuth: GoogleAuth = {
      token: token
    };
    const [loginResponse, loginError] = await apiRequestWrapper(() => loginUserGoogle(googleAuth));

    if (loginError) {
      toast.error(loginError.detail || 'An unexpected error occurred');
      return;
    }
    dispatch(setUser(loginResponse));
    Cookies.set('token', loginResponse.token, { expires: 7 });
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleLogin(tokenResponse.access_token);
    }
  });

  return (
    <AuthenticationArticle significance={200} emphasis={200}>
      <AuthenticationArticle.Heading className="text-center">Welcome to Cognizant&nbsp;Apartments</AuthenticationArticle.Heading>
      <AuthenticationArticle.Paragraph className="text-center">Login in with your work email address</AuthenticationArticle.Paragraph>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-start flex-col my-8">
          <label className="mb-1" htmlFor="email">
            Email address
          </label>
          <input
            className="block border border-gray-300 border-solid rounded-md p-2 mb-2"
            type="email"
            placeholder="e.g., name@devbridge.com"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
          <label className="mb-1" htmlFor="password">
            Password
          </label>
          <input
            className="block border border-gray-300 border-solid rounded-md p-2"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <TextButton
          name="Login"
          significance={400}
          emphasis={600}
          className="block w-full"
        />
      </form>
      <TextButton
        name="Login with Google account"
        significance={200}
        emphasis={600}
        className="block w-full mt-2"
        onClick={() => loginGoogle()}
      />
      <p className="text-lg font-light text-gray-500 py-5">
        Don&apos;t have an account yet?
        <Link to={AppRoutes.SIGN_UP} className="text-gray-600 font-medium hover:underline">
            &nbsp;Sign Up
        </Link>
      </p>
    </AuthenticationArticle>
  );
};
