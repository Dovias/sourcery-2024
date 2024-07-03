package com.apartmentbooking.dto.registerDTOs;

import com.apartmentbooking.models.Country;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class RegisterRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String jobTitle;
    private String city;
    private String country;
    private String password;
}
