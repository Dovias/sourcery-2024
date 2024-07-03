package com.apartmentbooking.dto.apartmentDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.apartmentbooking.dto.apartmentPhotoDTOs.ApartmentPhotoRequestDTO;
import com.apartmentbooking.dto.roomDTOs.RoomRequestDTO;
import lombok.Builder;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class ApartmentRequestDTO {
    private String name;
    private String description;
    private String country;
    private String city;
    private String postalCode;
    private String address;
    private List<RoomRequestDTO> rooms;
    private List<ApartmentPhotoRequestDTO> photos64;
}
