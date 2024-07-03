package com.apartmentbooking.service;

import com.apartmentbooking.exception.EntityNotFoundException;
import com.apartmentbooking.models.Role;
import com.apartmentbooking.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
   public static final String ROLE_NOT_FOUND = "Role by the given id not found";

    public Role getRole(int roleId) {
        return (roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND)));
    }

    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    public void deleteRole(int roleId) {
        roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));
        roleRepository.delete(roleId);
    }

    public Role updateRole(int roleId, Role newRole) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));

        roleRepository.update(role);
        return role;
    }

}
