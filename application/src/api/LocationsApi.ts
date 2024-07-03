import axios from 'axios';
import { LocationsModel } from '../models/LocationsModel';

const baseUrl = `${import.meta.env.VITE_API}/apartments/locations`;

export const fetchLocations = async (): Promise<LocationsModel[]> => {
  const response = await axios.get<LocationsModel[]>(baseUrl);
  return response.data;
};
