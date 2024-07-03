package com.apartmentbooking.dto.roomPhotoDTOs;

import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RoomPhotoResponseDTO {
    private UUID id;
    private UUID roomId;
    private String photoBase64;
}
