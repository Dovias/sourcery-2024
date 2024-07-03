package com.apartmentbooking.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Stay {
    private UUID id;
    private UUID roomId;
    private UUID employeeId;
    private LocalDate start;
    private LocalDate end;
    private String note;
    private UUID apartmentId;
    private Room room;
    private Employee employee;
    private Apartment apartment;
}
