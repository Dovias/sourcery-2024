package com.apartmentbooking.dto.apartmentPhotoDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Builder
public class ApartmentPhotoResponseDTO {
    private UUID apartmentId;
    private UUID id;
    private String photo64;
}
