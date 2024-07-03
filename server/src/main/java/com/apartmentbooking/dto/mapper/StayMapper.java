package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.stayDTOs.StayResponseDTO;
import com.apartmentbooking.models.Stay;

public class StayMapper {

    public static StayResponseDTO toDto(Stay stay) {
        return StayResponseDTO.builder()
                .id(stay.getId())
                .roomId(stay.getRoomId())
                .employeeId(stay.getEmployeeId())
                .start(stay.getStart())
                .end(stay.getEnd())
                .note(stay.getNote())
                .apartmentId(stay.getApartmentId())
                .room(RoomMapper.toDto(stay.getRoom()))
                .employee(EmployeeMapper.toDto(stay.getEmployee()))
                .apartment(ApartmentMapper.toDto(stay.getApartment()))
                .build();
    }
}
