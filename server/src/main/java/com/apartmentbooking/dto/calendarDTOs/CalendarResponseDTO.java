package com.apartmentbooking.dto.calendarDTOs;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CalendarResponseDTO {
    public UUID id;
    public CalendarRoomResponseDTO label;
    public List<CalendarStayResponseDTO> data;
}
