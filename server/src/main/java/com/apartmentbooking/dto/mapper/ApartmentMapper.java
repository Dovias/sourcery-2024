package com.apartmentbooking.dto.mapper;

import com.apartmentbooking.dto.apartmentDTOs.ApartmentRequestDTO;
import com.apartmentbooking.dto.apartmentDTOs.ApartmentResponseDTO;
import com.apartmentbooking.models.Apartment;

import java.util.Collections;
import java.util.UUID;

public class ApartmentMapper {
    public static ApartmentResponseDTO toDto(Apartment apartment) {
        return ApartmentResponseDTO.builder()
                .id(apartment.getId())
                .name(apartment.getName())
                .description(apartment.getDescription())
                .country(apartment.getCountry())
                .city(apartment.getCity())
                .address(apartment.getAddress())
                .postalCode(apartment.getPostalCode())
                .rooms(apartment.getRooms() != null
                        ? apartment.getRooms().stream().map(RoomMapper::toDto).toList()
                        : Collections.emptyList())
                .photos64(apartment.getPhotos64() != null
                        ? apartment.getPhotos64().stream().map(ApartmentPhotoMapper::toDto).toList()
                        : Collections.emptyList())
                .build();
    }

    public static Apartment fromDto(ApartmentRequestDTO apartmentRequestDTO) {
        Apartment apartment = Apartment.builder()
                .id(UUID.randomUUID())
                .name(apartmentRequestDTO.getName())
                .description(apartmentRequestDTO.getDescription())
                .country(apartmentRequestDTO.getCountry())
                .city(apartmentRequestDTO.getCity())
                .postalCode(apartmentRequestDTO.getPostalCode())
                .address(apartmentRequestDTO.getAddress())
                .build();

        apartment.setRooms(apartmentRequestDTO.getRooms() != null ?
                apartmentRequestDTO.getRooms()
                        .stream()
                        .map(room -> RoomMapper.fromDto(room, apartment.getId()))
                        .toList()
                : Collections.emptyList());

        apartment.setPhotos64(apartmentRequestDTO.getPhotos64() != null ?
                apartmentRequestDTO.getPhotos64()
                        .stream()
                        .map(photo -> ApartmentPhotoMapper.fromDto(photo, apartment.getId()))
                        .toList()
                : Collections.emptyList());

        return apartment;
    }
}
