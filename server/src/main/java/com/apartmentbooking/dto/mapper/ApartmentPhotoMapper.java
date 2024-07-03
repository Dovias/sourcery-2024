package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.apartmentPhotoDTOs.ApartmentPhotoRequestDTO;
import com.apartmentbooking.dto.apartmentPhotoDTOs.ApartmentPhotoResponseDTO;
import com.apartmentbooking.models.ApartmentPhoto;

import java.util.UUID;

public class ApartmentPhotoMapper {

    public static ApartmentPhotoResponseDTO toDto(ApartmentPhoto photo) {
        return ApartmentPhotoResponseDTO.builder()
                .photo64(photo.getPhotoBase64())
                .id(photo.getId())
                .apartmentId(photo.getApartmentId())
                .build();
    }

    public static ApartmentPhoto fromDto(ApartmentPhotoRequestDTO apartmentPhotoRequestDTO, UUID apartmentId) {
        UUID id = apartmentPhotoRequestDTO.getId() == null || apartmentPhotoRequestDTO.getId().equals(ApartmentPhotoRequestDTO.defaultId)
                ? UUID.randomUUID()
                : apartmentPhotoRequestDTO.getId();
        return ApartmentPhoto.builder()
                .id(id)
                .photoBase64(apartmentPhotoRequestDTO.getPhoto64())
                .apartmentId(apartmentId)
                .build();
    }
}
