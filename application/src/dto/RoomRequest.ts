import { RoomModel } from '../models/RoomModel';
import { RoomPhotoRequest, toRoomPhotoRequest } from './RoomPhotoRequest';

// if the [id] field is not given a new entity will be created. If [id] is given the
// specified entity will be edited
export interface RoomRequest {
  id?: string
  name: string
  capacity: number
  photos: RoomPhotoRequest[]
}

export const toRoomRequest = (room: RoomModel): RoomRequest => {
  const id = room.id ? { id: room.id } : null;
  return {
    ...id,
    name: room.name,
    capacity: room.capacity,
    photos: room.photos.map(roomPhoto => toRoomPhotoRequest(roomPhoto))
  };
};
