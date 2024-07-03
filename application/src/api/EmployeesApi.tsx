import axios from 'axios';

import { EmployeeModel } from '../models/EmployeeModel.tsx';

const baseUrl = `${import.meta.env.VITE_API}/employees`;

export const fetchAllEmployees = async (): Promise<EmployeeModel[]> => {
  const response = await axios.get<EmployeeModel[]>(baseUrl);

  return response.data;
};

export const fetchEmployeeByEmail = async (email: string): Promise<EmployeeModel> => {
  const response = await axios.get<EmployeeModel>(`${baseUrl}/by-email/`, {
    params: {
      email: email
    }
  });

  return response.data;
};
