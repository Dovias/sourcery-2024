import axios from 'axios';
import Cookies from 'js-cookie';
import { Client } from '@stomp/stompjs';
import { SchedulerData } from '@justuxs/react-scheduler';
import { Order } from '../types/order.ts';
import { BookingModel } from '../models/BookingModel.ts';
import { RoomModel } from '../models/RoomModel.ts';
import { ApartmentModel } from '../models/ApartmentModel.ts';
import { BookingCompactModel } from '../models/BookingCompactModel.ts';

const baseUrl = `${import.meta.env.VITE_API}/bookings`;

function deserializeModel(model: BookingModel | BookingCompactModel) {
  model.start = new Date(model.start);
  model.end = new Date(model.end);
}

export const fetchAllBookingsCompact = async (order: Order): Promise<BookingCompactModel[]> => {
  try {
    const response = await axios.get<BookingCompactModel[]>(`${baseUrl}/compact?sortOrder=${order}`);
    const models = response.data;
    models.forEach(deserializeModel);

    return models;
  }
  catch (error) {
    throw error;
  }
};

export const fetchAllBookingsCompactWithSearch = async (
  order: Order,
  query: string
): Promise<BookingCompactModel[]> => {
  try {
    const response = await axios.get<BookingCompactModel[]>(
      `${baseUrl}/compact/search?SearchQuery=${query}&sortOrder=${order}`
    );
    const models = response.data;
    models.forEach(deserializeModel);

    return models;
  }
  catch (error) {
    throw error;
  }
};

export const fetchUserBookingsCompact = async (currentUserId: string, order: Order): Promise<BookingCompactModel[]> => {
  try {
    const response = await axios.get<BookingCompactModel[]>(
      `${baseUrl}/compact/by-employee/${currentUserId}?sortOrder=${order}`
    );
    const models = response.data;
    models.forEach(deserializeModel);

    return models;
  }
  catch (error) {
    throw error;
  }
};

export const fetchUserBookingsCompactWithSearch = async (
  currentUserId: string,
  order: Order,
  query: string
): Promise<BookingCompactModel[]> => {
  try {
    const response = await axios.get<BookingCompactModel[]>(
      `${baseUrl}/compact/by-employee/${currentUserId}/search?SearchQuery=${query}&sortOrder=${order}`
    );
    const models = response.data;
    models.forEach(deserializeModel);

    return models;
  }
  catch (error) {
    throw error;
  }
};

export const fetchBooking = async (bookingId: string): Promise<BookingModel> => {
  try {
    const response = await axios.get<BookingModel>(`${baseUrl}/${bookingId}`);
    const model = response.data;
    deserializeModel(model);

    return model;
  }
  catch (error) {
    throw error;
  }
};

export const handleSaveChanges = async (
  booking: BookingModel,
  selectedRoom: RoomModel | null,
  selectedApartment: ApartmentModel | null,
  startDate: Date | string,
  endDate: Date | string,
  note: string,
  onClose: () => void,
  refetchBookingsData: () => void
) => {
  try {
    const response = await axios.put(`${baseUrl}/${booking.id}`, {
      roomId: selectedRoom?.id,
      employeeId: booking?.employeeId,
      start: formatDate(startDate),
      end: formatDate(endDate),
      note,
      apartmentId: selectedApartment?.id
    });

    if (response.status === 200 || response.status === 202) {
      onClose();
      refetchBookingsData();
      return true;
    }
    else {
      const errorText = response.statusText;
      throw new Error(`Failed to save changes: ${errorText}`);
    }
  }
  catch (error: unknown) {
    let message = 'Error editing your room';
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      message = error.response?.data?.detail;
    }
    throw new Error(message);
  }
};

export const createBooking = async (
  booking: BookingModel,
  selectedRoom: RoomModel | null,
  selectedApartment: ApartmentModel | null,
  startDate: Date | string,
  endDate: Date | string,
  note: string,
  onClose: () => void,
  refetchBookingsData: () => void
) => {
  try {
    await axios.post(`${baseUrl}`, {
      roomId: selectedRoom?.id,
      employeeId: booking?.employeeId,
      start: formatDate(startDate),
      end: formatDate(endDate),
      note,
      apartmentId: selectedApartment?.id
    });
    refetchBookingsData();
    onClose();
  }
  catch (error: unknown) {
    let message = 'Error reserving your room';
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      message = error.response?.data?.detail;
    }
    throw new Error(message);
  }
};

const formatDate = (date: Date | string): string => {
  if (date instanceof Date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().split('T')[0];
  }
  return date;
};

export const deleteBooking = async (id: string) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.status;
};

export const fetchCalendarData = async (): Promise<SchedulerData> => {
  const response = await axios.get<SchedulerData>(`${baseUrl}/calendar`);
  return response.data;
};

export const getDummyBooking = async (roomId: string, employeeId: string, startDate: Date, endDate: Date) => {
  try {
    const response = await axios.post<BookingModel>(`${baseUrl}/dummy`, {
      roomId: roomId,
      employeeId: employeeId,
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
    const model = response.data;
    deserializeModel(model);

    return model;
  }
  catch (error: unknown) {
    let message = 'Error getting data';
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      message = error.response?.data?.detail;
    }
    throw new Error(message);
  }
};

export const createBookingsSocket = () => {
  const token = Cookies.get('token');
  return new Client({
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    brokerURL: `${import.meta.env.VITE_WS}/bookings`
  });
};
