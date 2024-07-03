package com.apartmentbooking.dto.calendarDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CalendarStayResponseDTO {
    public UUID id;
    @JsonProperty("ownerId")
    public String employeeId;
    public LocalDate startDate;
    public LocalDate endDate;
    @JsonProperty("title")
    public String employeeName;
    @JsonProperty("subtitle")
    public String employeeEmail;
    @JsonProperty("description")
    public String note;
    @JsonProperty("bgColor")
    public String bgColor;
    @JsonProperty("icon")
    public String photo64;
}
