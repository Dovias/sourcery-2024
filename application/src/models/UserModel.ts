import { RoleModel } from './RoleModel';

export interface UserModel {
  id: string
  firstName: string
  lastName: string
  email: string
  profileBase64: string
  token: string
  role: RoleModel
  jobTitle: string
  city: string
  country: string
}
