import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import { AppRoutes } from '../../../../routes';

import { RegistrationRequest } from '../../../../dto/RegistrationRequest.ts';

import { apiRequestWrapper } from '../../../../api/apiRequestWrapper/ApiRequestWrapper.ts';
import { registerUser } from '../../../../api/AuthenticationApi.ts';
import { fetchAllCountries } from '../../../../api/CountriesApi.ts';

import { useDebounce } from '../../../../hooks/useDebounce.ts';

import { AuthenticationArticle } from '../article';
import { TextButton } from '../../../input/buttons/TextButton';

interface Credentials {
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  city: string
  country: string
  password: string
  confirmPassword: string
}

enum ErrorType {
  NoError = 'no_error',
  PasswordTooWeak = 'password_too_weak',
  PasswordsDoNotMatch = 'passwords_do_not_match',
  CountryNotSelected = 'country_not_selected',
  Other = 'other'
}

interface Err {
  message: string
  errorType: ErrorType
}

interface OptionType {
  value: string
  label: string
}

export const SignUp: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<OptionType[]>([]);
  const debounce = useDebounce(200);
  const [credentials, setCredentials] = useState<Credentials>({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchCountries = async () => {
      const [countries, apiError] = await apiRequestWrapper(async () => fetchAllCountries());

      if (apiError) {
        debounce(() => toast.error(apiError.detail || 'Error finding countries!'));
        return;
      }
      setCountries(countries);
    };
    fetchCountries();
  }, []);

  const [error, setError] = useState<Err>({
    message: '',
    errorType: ErrorType.NoError
  });

  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    validatePasswords(event.target.value, credentials.confirmPassword);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    validatePasswords(credentials.password, event.target.value);
  };

  function isPasswordStrong(password: string): boolean {
    const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
    return regex.test(password);
  }

  function validatePasswords(password: string, confirmPassword: string) {
    if (!isPasswordStrong(password)) {
      setError({
        message: '',
        errorType: ErrorType.PasswordTooWeak
      });
    }
    else {
      if (password !== confirmPassword) {
        setError({
          message: '',
          errorType: ErrorType.PasswordsDoNotMatch
        });
      }
      else {
        setError({
          message: '',
          errorType: ErrorType.NoError
        });
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || error.errorType === ErrorType.PasswordsDoNotMatch || error.errorType === ErrorType.PasswordTooWeak) return;
    setIsSubmitting(true);
    setError({
      message: '',
      errorType: ErrorType.NoError
    });

    if (!credentials.country) {
      setError({
        message: 'Please select a country.',
        errorType: ErrorType.CountryNotSelected
      });
      setIsSubmitting(false);
      return;
    }

    const registrationData: RegistrationRequest = {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      jobTitle: credentials.jobTitle,
      city: credentials.city,
      country: credentials.country,
      password: credentials.password
    };
    const [registrationResponse, registrationError] = await apiRequestWrapper(() => registerUser(registrationData));

    if (registrationResponse) {
      navigate(AppRoutes.LOG_IN);
      return;
    }

    const authenticationError: Err = {
      message: registrationError.properties.length > 0
        ? registrationError.properties[0][1]
        : registrationError.detail || 'Oops... Something went wrong!',
      errorType: ErrorType.Other
    };
    toast.error(authenticationError.message);

    /*
      Even though we output the server-side error message through the toast, we still need to set the state due to how
      errors are being very coupled with field validation.
     */
    setError(authenticationError);
    setIsSubmitting(false);
  };

  return (
    <AuthenticationArticle significance={200} emphasis={200}>
      <div className="w-96">
        <AuthenticationArticle.Heading className="text-center">Create Your Account</AuthenticationArticle.Heading>
        <AuthenticationArticle.Paragraph className="text-center">Join the Cognizant Apartments Community</AuthenticationArticle.Paragraph>

        <form className="space-y-4 my-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="mb-1 block font-medium text-gray-900">First name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              placeholder="name"
              required={true}
              value={credentials.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block font-medium text-gray-900">Last name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              placeholder="surname"
              required={true}
              value={credentials.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block font-medium text-gray-900">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              placeholder="name@company.com"
              required={true}
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className="mb-1 block font-medium text-gray-900">
              Job
              title
            </label>
            <input
              type="text"
              name="jobTitle"
              id="jobTitle"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              placeholder="job title"
              required={true}
              value={credentials.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="mb-1 block font-medium text-gray-900"
            >
              Country
            </label>
            <Select
              id="country"
              options={countries}
              onChange={(selectedOption: SingleValue<OptionType>) => {
                if (selectedOption !== null) {
                  setCredentials({ ...credentials, country: selectedOption.value });
                  if (error.errorType === ErrorType.CountryNotSelected) {
                    setError({ message: '', errorType: ErrorType.NoError });
                  }
                }
                else {
                  setCredentials({ ...credentials, country: '' });
                }
              }}
              className="text-base border border-gray-300 rounded-lg"
              placeholder="Select country"
              isSearchable={true}
            />
            {error.errorType === ErrorType.CountryNotSelected && (
              <span className="text-sm text-red-300">Please select your country!</span>
            )}
          </div>
          <div>
            <label
              htmlFor="city"
              className="mb-1 block font-medium text-gray-900"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              placeholder="city"
              required={true}
              value={credentials.city}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block font-medium text-gray-900">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              required={true}
              value={credentials.password}
              onChange={handlePasswordChange}
            />
            {error.errorType === ErrorType.PasswordTooWeak && (
              <span className="text-sm text-red-300">Password is too weak!</span>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block font-medium text-gray-900">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
              required={true}
              value={credentials.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {error.errorType === ErrorType.PasswordsDoNotMatch && (
              <span className="text-sm text-red-300">Passwords do not match!</span>
            )}
          </div>

          <TextButton
            name={isSubmitting ? 'Creating...' : 'Create'}
            significance={400}
            emphasis={600}
            className="block w-full"
          />
        </form>
        <p className="text-lg font-light text-gray-500">
          Already have an account?
          <Link to={AppRoutes.LOG_IN} className="text-gray-600 font-medium hover:underline">
            &nbsp;Login here
          </Link>
        </p>
      </div>
    </AuthenticationArticle>
  );
};
