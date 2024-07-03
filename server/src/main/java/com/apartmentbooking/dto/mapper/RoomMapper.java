package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.roomDTOs.RoomRequestDTO;
import com.apartmentbooking.dto.roomDTOs.RoomResponseDTO;
import com.apartmentbooking.models.Room;

import java.util.Collections;
import java.util.UUID;

public class RoomMapper {

    public static RoomResponseDTO toDto(Room room) {
        return RoomResponseDTO.builder()
                .id(room.getId())
                .name(room.getName())
                .capacity(room.getCapacity())
                .apartment(room.getApartmentId())
                .stays(room.getStays() != null
                        ? room.getStays().stream().map(StayMapper::toDto).toList()
                        : Collections.emptyList())
                .photos(room.getPhotos() != null
                        ? room.getPhotos().stream().map(RoomPhotoMapper::toDto).toList()
                        : Collections.emptyList())
                .build();
    }

    public static Room fromDto(RoomRequestDTO roomRequestDTO, UUID apartmentId) {
        UUID id = roomRequestDTO.getId() == null || roomRequestDTO.getId().equals(RoomRequestDTO.defaultId)
                ? UUID.randomUUID()
                : roomRequestDTO.getId();
        return Room.builder()
                .id(id)
                .apartmentId(apartmentId)
                .name(roomRequestDTO.getName())
                .capacity(roomRequestDTO.getCapacity())
                .stays(Collections.emptyList())
                .photos(roomRequestDTO.getPhotos().stream().map((room) -> RoomPhotoMapper.fromDto(room, id)).toList())
                .build();
    }
}
