import axios from 'axios';
import { ApartmentModel } from '../models/ApartmentModel.ts';
import { toApartmentRequest } from '../dto/ApartmentRequest.ts';
import { RoomPhotoModel } from '../models/RoomPhotoModel.ts';

const baseUrl = `${import.meta.env.VITE_API}/apartments`;

export const fetchAllApartments = async (): Promise<ApartmentModel[]> => {
  const response = await axios.get<ApartmentModel[]>(baseUrl);
  return response.data;
};

export const fetchAllApartmentsNoPhotosNoSearchQuery = async (): Promise<ApartmentModel[]> => {
  const response = await axios.get<ApartmentModel[]>(baseUrl + `/no-photos/search/`);
  return response.data;
};

export const fetchAllApartmentsWithSearch = async (query: string): Promise<ApartmentModel[]> => {
  const response = await axios.get<ApartmentModel[]>(baseUrl + `/no-photos/search/${query}`);
  return response.data;
};

export const fetchApartmentById = async (id: string): Promise<ApartmentModel> => {
  const response = await axios.get<ApartmentModel>(`${baseUrl}/${id}`);
  return response.data;
};

export const fetchApartmentByIdWithoutRoomPhotos = async (id: string): Promise<ApartmentModel> => {
  const response = await axios.get<ApartmentModel>(`${baseUrl}/no-room-photos/${id}`);
  return response.data;
};

export const fetchRoomPhotosByApartmentId = async (apartmentId: string): Promise<RoomPhotoModel[]> => {
  const response = await axios.get<RoomPhotoModel[]>(`${baseUrl}/${apartmentId}/room-photos`);
  return response.data;
};

export const updateApartment = async (apartment: ApartmentModel, apartmentId: string) => {
  const apartmentRequestBody = toApartmentRequest(apartment);
  const response = await axios.put(`${baseUrl}/${apartmentId}`, apartmentRequestBody);

  return response.status;
};

export const createApartment = async (apartment: ApartmentModel): Promise<ApartmentModel> => {
  const apartmentRequestBody = toApartmentRequest(apartment);
  const response = await axios.post(baseUrl, apartmentRequestBody);

  return response.data;
};

export const deleteApartment = async (id: string): Promise<void> => {
  const response = await axios.delete(`${baseUrl}/${id}`);

  return response.data;
};
