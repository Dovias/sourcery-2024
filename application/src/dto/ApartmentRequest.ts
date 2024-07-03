import { ApartmentModel } from '../models/ApartmentModel';
import { Photo64Model } from '../models/Photo64Model';
import { RoomModel } from '../models/RoomModel';
import { ApartmentPhotoRequest, toApartmentPhotoRequest } from './ApartmentPhotoRequest';
import { RoomRequest, toRoomRequest } from './RoomRequest';

export interface ApartmentRequest {
  name: string
  description?: string
  country: string
  city: string
  postalCode: string
  address: string
  rooms: RoomRequest[]
  photos64: ApartmentPhotoRequest[]
}

export const toApartmentRequest = (apartment: ApartmentModel): ApartmentRequest => {
  return {
    name: apartment.name,
    description: apartment.description,
    country: apartment.country,
    city: apartment.city,
    postalCode: apartment.postalCode,
    address: apartment.address,
    rooms: apartment.rooms.map((room: RoomModel) => toRoomRequest(room)),
    photos64: apartment.photos64.map((photo: Photo64Model) => toApartmentPhotoRequest(photo))
  };
};
