package com.apartmentbooking.dto.authenticationDTOs;

import com.apartmentbooking.dto.stayDTOs.StayResponseDTO;
import com.apartmentbooking.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponseDTO {

    private UUID id;
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private String jobTitle;
    private String city;
    private String country;
    private String profileBase64;
    private List<StayResponseDTO> stays;
    private Role role;

}
