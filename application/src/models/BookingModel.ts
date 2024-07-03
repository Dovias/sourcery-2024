import { ApartmentModel } from './ApartmentModel';
import { EmployeeModel } from './EmployeeModel';
import { RoomModel } from './RoomModel';

export interface BookingModel {
  id?: string
  roomId: string
  employeeId: string
  start: Date
  end: Date
  note: string
  apartmentId: string
  room: RoomModel
  employee: EmployeeModel
  apartment: ApartmentModel
}
