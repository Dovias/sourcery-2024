import axios from 'axios';

interface OptionType {
  value: string
  label: string
}

export const fetchAllCountries = async (): Promise<OptionType[]> => {
  const baseUrl = `${import.meta.env.VITE_API}`;
  const response = await axios.get<string[]>(`${baseUrl}/countries`);
  return response.data.map(country => ({ value: country, label: country }));
};
