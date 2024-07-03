import { BookingModel } from './BookingModel';
import { UserModel } from './UserModel';

export interface EmployeeModel {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  jobTitle: string
  city: string
  country: string
  roleId: number
  profileBase64: string
  bookings: BookingModel[]
}

// Here only because for some reason UserModel and EmployeeModel are
// two different things. Should be fixed
export const employeeModelFromUserModel = (user: UserModel): EmployeeModel => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roleId: user.role.roleId,
    profileBase64: user.profileBase64,
    jobTitle: user.jobTitle,
    city: user.city,
    country: user.country,
    password: '',
    bookings: []
  };
};
