import { Photo64Model } from './Photo64Model';
import { RoomModel } from './RoomModel';

export interface ApartmentModel {
  id?: string
  name: string
  description: string
  country: string
  city: string
  postalCode: string
  address: string
  rooms: RoomModel[]
  photos64: Photo64Model[]
}
