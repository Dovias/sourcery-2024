package com.apartmentbooking.dto.apartmentPhotoDTOs;

import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ApartmentPhotoRequestDTO {
    public final static UUID defaultId = UUID.fromString("00000000-0000-0000-0000-000000000000");
    private UUID id = defaultId;
    private String photo64;
}
