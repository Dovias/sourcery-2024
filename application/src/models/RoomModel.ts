import { RoomPhotoModel } from './RoomPhotoModel';
import { BookingModel } from './BookingModel';

export interface RoomModel {
  id?: string
  name: string
  capacity: number
  apartment: string
  bookings: BookingModel[]
  photos: RoomPhotoModel[]
}
