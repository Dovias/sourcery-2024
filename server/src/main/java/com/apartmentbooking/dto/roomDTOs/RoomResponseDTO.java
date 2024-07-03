package com.apartmentbooking.dto.roomDTOs;

import com.apartmentbooking.dto.roomPhotoDTOs.RoomPhotoResponseDTO;
import com.apartmentbooking.dto.stayDTOs.StayResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class RoomResponseDTO {
    private UUID id;
    private UUID apartment;
    private String name;
    private int capacity;
    private List<StayResponseDTO> stays;
    private List<RoomPhotoResponseDTO> photos;
}
