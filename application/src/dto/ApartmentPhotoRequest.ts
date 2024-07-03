import { Photo64Model } from '../models/Photo64Model';

// if the [id] field is not given a new entity will be created. If [id] is given the
// specified entity will be edited
export interface ApartmentPhotoRequest {
  id?: string
  photo64: string
}

export const toApartmentPhotoRequest = (apartmentPhoto: Photo64Model): ApartmentPhotoRequest => {
  const id = apartmentPhoto.id ? { id: apartmentPhoto.id } : null;
  return {
    ...id,
    photo64: apartmentPhoto.photo64
  };
};
