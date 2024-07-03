package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.calendarDTOs.CalendarResponseDTO;
import com.apartmentbooking.dto.calendarDTOs.CalendarRoomResponseDTO;
import com.apartmentbooking.dto.calendarDTOs.CalendarStayResponseDTO;
import com.apartmentbooking.models.Apartment;
import com.apartmentbooking.models.Room;
import com.apartmentbooking.models.Stay;
import com.apartmentbooking.service.EmployeeService;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

public class CalenadarMapper {

    public static CalendarResponseDTO toDto(Room room, List<Apartment> apartments) {
        return CalendarResponseDTO.builder()
                .id(room.getId())
                .label(toRoomDto(room, apartments))
                .data(toStaysDto(room.getStays()))
                .build();
    }

    private static CalendarRoomResponseDTO toRoomDto(Room room, List<Apartment> apartments) {
        Optional<Apartment> matchingApartment = apartments.stream()
                .filter(apartment -> apartment.getId().equals(room.getApartmentId()))
                .findFirst();
        String apartmentName = "";
        String apartmentLocation = "";
        if (matchingApartment.isPresent()) {
            Apartment apartment = matchingApartment.get();
            apartmentName = apartment.getName();
            apartmentLocation = apartment.getAddress() + " "
                    + matchingApartment.get().getCity() + " "
                    + matchingApartment.get().getPostalCode();}

        return CalendarRoomResponseDTO.builder()
                .photo64("https://world-schools.com/wp-content/uploads/2023/01/IMG-Academy-cover-WS.webp")
                .apartmentName(apartmentName)
                .name(room.getName())
                .apartmentLocation(apartmentLocation)
                .build();
    }
    private static List<CalendarStayResponseDTO> toStaysDto(List<Stay> stays) {
        return stays.stream().map(stay -> toStayDto(stay, EmployeeService.getEmployeeColor(stay.getEmployeeId()))).collect(Collectors.toList());
    }

    private static CalendarStayResponseDTO toStayDto(Stay stay, String color) {
        return CalendarStayResponseDTO.builder()
                .id(stay.getId())
                .employeeId(stay.getEmployee().getId().toString())
                .employeeName(String.format("%s %s", stay.getEmployee().getFirstName(), stay.getEmployee().getLastName()))
                .employeeEmail(stay.getEmployee().getEmail())
                .note(stay.getNote())
                .startDate(stay.getStart())
                .endDate(stay.getEnd())
                .bgColor(color)
                .photo64(stay.getEmployee().getProfileBase64())
                .build();
    }

}
