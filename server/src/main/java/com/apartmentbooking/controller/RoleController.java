package com.apartmentbooking.controller;

import com.apartmentbooking.models.Role;
import com.apartmentbooking.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/roles")
public class RoleController {
    private final RoleService roleService;

    @GetMapping()
    public List<Role> getRoles() {
        return roleService.getRoles();
    }

    @GetMapping("/{roleId}")
    public Role getRole(@PathVariable int roleId) {
        return roleService.getRole(roleId);
    }

    @DeleteMapping("/{roleId}")
    public void deleteRole(@PathVariable int roleId) {
        roleService.deleteRole(roleId);
    }

    @PutMapping("/{roleId}")
    public Role updateRole(@PathVariable int roleId, @RequestBody Role role) {
        return roleService.updateRole(roleId, role);
    }
}