import axios from 'axios';
import { EmployeeModel } from '../models/EmployeeModel.tsx';
import { AuthenticationWithGoogleResponse } from '../dto/AuthenticationWithGoogleResponse';

const baseUrl = `${import.meta.env.VITE_API}/employees`;

export const fetchUsers = async (Query: string) => {
  return axios.get<EmployeeModel[]>(baseUrl + `/search/${Query}`);
};

export const fetchUser = (id: string) => {
  return axios.get<EmployeeModel>(`${baseUrl}/${id}`);
};

export const fetchUserGoogleId = (id: string) => {
  return axios.get<null | AuthenticationWithGoogleResponse>(`${baseUrl}/google/${id}`);
};

export const unlinkGoogle = (id: string) => {
  return axios.put<null | AuthenticationWithGoogleResponse>(`${baseUrl}/google/unlink/${id}`);
};

export const linkGoogle = (id: string, token: string) => {
  return axios.put<null | AuthenticationWithGoogleResponse>(`${baseUrl}/google/link/${id}`, { token });
};

export const updateUser = (newPerms: EmployeeModel) => {
  const requestForm = {
    firstName: newPerms.firstName,
    lastName: newPerms.lastName,
    email: newPerms.email,
    roleId: newPerms.roleId,
    profileBase64: newPerms.profileBase64,
    jobTitle: newPerms.jobTitle,
    city: newPerms.city,
    country: newPerms.country
  };
  return axios.put(
    `${baseUrl}/${newPerms.id}`,
    requestForm
  );
};

export const updateRole = async (employeeId: string, roleId: number) => {
  const response = await axios.put(`${baseUrl}/${employeeId}/role?roleId=${roleId}`);
  return response.data;
};
