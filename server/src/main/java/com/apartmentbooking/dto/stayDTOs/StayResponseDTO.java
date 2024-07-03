package com.apartmentbooking.dto.stayDTOs;

import com.apartmentbooking.dto.apartmentDTOs.ApartmentResponseDTO;
import com.apartmentbooking.dto.employeeDTOs.EmployeeResponseDTO;
import com.apartmentbooking.dto.roomDTOs.RoomResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class StayResponseDTO extends StayRequestDTO {
    private UUID id;
    private RoomResponseDTO room;
    private EmployeeResponseDTO employee;
    private ApartmentResponseDTO apartment;
}
