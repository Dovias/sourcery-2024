package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.roomPhotoDTOs.RoomPhotoRequestDTO;
import com.apartmentbooking.dto.roomPhotoDTOs.RoomPhotoResponseDTO;
import com.apartmentbooking.models.RoomPhoto;

import java.util.UUID;

public class RoomPhotoMapper {
    public static RoomPhotoResponseDTO toDto(RoomPhoto roomPhoto) {
        return RoomPhotoResponseDTO.builder()
                .id(roomPhoto.getId())
                .roomId(roomPhoto.getRoomId())
                .photoBase64(roomPhoto.getPhotoBase64())
                .build();
    }

    public static RoomPhoto fromDto(RoomPhotoRequestDTO roomPhoto, UUID roomId) {
        UUID id = roomPhoto.getId() == null || roomPhoto.getId().equals(RoomPhotoRequestDTO.defaultId)
                ? UUID.randomUUID()
                : roomPhoto.getId();
        return RoomPhoto.builder()
                .id(id)
                .photoBase64(roomPhoto.getPhotoBase64())
                .roomId(roomId)
                .build();
    }
}
