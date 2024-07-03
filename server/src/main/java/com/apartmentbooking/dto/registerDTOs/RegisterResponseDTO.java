package com.apartmentbooking.dto.registerDTOs;

import com.apartmentbooking.models.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class RegisterResponseDTO extends RegisterRequestDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String jobTitle;
    private String city;
    private String country;
    private String role;
    private String profilePhoto;

    public static RegisterResponseDTO of(Employee user) {
        return RegisterResponseDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .jobTitle(user.getJobTitle())
                .city(user.getCity())
                .country(user.getCountry())
                .role(user.getRole().getRoleName())
                .profilePhoto(user.getProfileBase64())
                .build();
    }
}
