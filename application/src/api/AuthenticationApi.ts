import axios from 'axios';
import { RegistrationRequest } from '../dto/RegistrationRequest';
import { RegistrationResponse } from '../dto/RegistrationResponse';

export interface Credentials {
  email: string
  password: string
}

export interface GoogleAuth {
  token: string
}

const baseUrl = `${import.meta.env.VITE_API}/authentication`;

export const registerUser = async (
  registrationRequestBody: RegistrationRequest
): Promise<RegistrationResponse> => {
  const request = await axios.post(
    `${baseUrl}/register`,
    registrationRequestBody
  );

  return request.data;
};

export const loginUser = async (credentials: Credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);

  return response.data;
};

export const loginUserGoogle = async (googleAuth: GoogleAuth) => {
  const response = await axios.post(`${baseUrl}/google/login`, googleAuth);

  return response.data;
};
