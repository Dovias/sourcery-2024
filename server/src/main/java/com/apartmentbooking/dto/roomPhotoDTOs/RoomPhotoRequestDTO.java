package com.apartmentbooking.dto.roomPhotoDTOs;

import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RoomPhotoRequestDTO {
    public static final UUID defaultId = UUID.fromString("000000-0000-0000-0000-000000000000");

    @Builder.Default
    private UUID id = defaultId;
    private String photoBase64;
}
