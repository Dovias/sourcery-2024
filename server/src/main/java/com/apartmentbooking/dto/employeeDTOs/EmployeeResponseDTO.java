package com.apartmentbooking.dto.employeeDTOs;

import com.apartmentbooking.dto.stayDTOs.StayResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class EmployeeResponseDTO extends EmployeeRequestDTO {
    private UUID id;
    private List<StayResponseDTO> stays;
}
