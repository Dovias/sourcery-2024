package com.apartmentbooking.dto.employeeDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class EmployeeRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String jobTitle;
    private String city;
    private String country;
    private int roleId;
    private String profileBase64;
}