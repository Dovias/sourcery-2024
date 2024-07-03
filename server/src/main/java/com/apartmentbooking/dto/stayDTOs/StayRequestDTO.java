package com.apartmentbooking.dto.stayDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class StayRequestDTO {
    private UUID roomId;
    private UUID employeeId;
    private LocalDate start;
    private LocalDate end;
    private String note;
    private UUID apartmentId;
}
