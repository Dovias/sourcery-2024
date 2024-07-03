package com.apartmentbooking.dto.calendarDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class CalendarRoomResponseDTO {
    @JsonProperty("title")
    public String name;
    @JsonProperty("subtitle")
    public String apartmentName;
    @JsonProperty("description")
    public String apartmentLocation;
    @JsonProperty("icon")
    public String photo64;
}
