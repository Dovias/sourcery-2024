import { useSelector } from 'react-redux';

import { RoleModel } from '../models/RoleModel.ts';

import { RootState } from '../store/store.ts';

function getUserRole() {
  return useSelector((state: RootState) => state.user.role?.roleName.toUpperCase());
}

export function usePermission(...roles: RoleModel['roleName'][]) {
  return roles.length === 0 || roles.includes(getUserRole()!);
}

export function useRolePermission(roles: RoleModel['roleName'][], userRole: string = getUserRole()!) {
  return roles.length === 0 || roles.includes(userRole);
}
