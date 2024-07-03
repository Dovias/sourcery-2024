import axios from 'axios';
import { RoleModel } from '../models/RoleModel';

const baseUrl = `${import.meta.env.VITE_API}/roles`;

export const fetchAllRoles = async (): Promise<RoleModel[]> => {
  const response = await axios.get<RoleModel[]>(`${baseUrl}`);
  return response.data;
};

export const fetchRoleById = async (id: number): Promise<RoleModel> => {
  const response = await axios.get<RoleModel>(`${baseUrl}/${id}`);
  return response.data;
};
