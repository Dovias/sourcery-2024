import { RoomPhotoModel } from '../models/RoomPhotoModel';

// if the [id] field is not given a new entity will be created. If [id] is given the
// specified entity will be edited
export interface RoomPhotoRequest {
  id?: string
  photoBase64: string
}

export const toRoomPhotoRequest = (roomPhoto: RoomPhotoModel): RoomPhotoRequest => {
  const id = roomPhoto.id ? { id: roomPhoto.id } : null;
  return {
    ...id,
    photoBase64: roomPhoto.photoBase64
  };
};
