import { EmployeeCompactModel } from './EmployeeCompactModel';

export interface BookingCompactModel {
  id?: string
  start: Date
  end: Date
  roomId: string
  roomName: string
  apartmentId: string
  apartmentName: string
  employeeId: string
  employeeCompact: EmployeeCompactModel
}
