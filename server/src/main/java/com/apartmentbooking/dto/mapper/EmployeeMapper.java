package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.employeeDTOs.EmployeeResponseDTO;
import com.apartmentbooking.models.Employee;

import java.util.Collections;

public class EmployeeMapper {
    public static EmployeeResponseDTO toDto(Employee employee) {
        int roleId = employee.getRole() != null ? employee.getRole().getRoleId() : null;

        return EmployeeResponseDTO.builder()
                .id(employee.getId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .jobTitle(employee.getJobTitle())
                .city(employee.getCity())
                .country(employee.getCountry())
                .roleId(roleId)
                .profileBase64(employee.getProfileBase64())
                .stays(employee.getStays() == null
                        ? Collections.emptyList()
                        : employee.getStays()
                        .stream()
                        .map(StayMapper::toDto)
                        .toList())
                .build();
    }
}
