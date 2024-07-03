package com.apartmentbooking.dto.apartmentDTOs;

import com.apartmentbooking.dto.apartmentPhotoDTOs.ApartmentPhotoResponseDTO;
import com.apartmentbooking.dto.roomDTOs.RoomResponseDTO;
import lombok.*;

import java.util.List;
import java.util.UUID;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ApartmentResponseDTO {
    private UUID id;
    private String name;
    private String description;
    private String country;
    private String city;
    private String postalCode;
    private String address;
    private List<RoomResponseDTO> rooms;
    private List<ApartmentPhotoResponseDTO> photos64;

}
