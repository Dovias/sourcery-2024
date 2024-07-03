package com.apartmentbooking.dto.roomDTOs;

import com.apartmentbooking.dto.roomPhotoDTOs.RoomPhotoRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequestDTO {
    public final static UUID defaultId = UUID.fromString("00000000-0000-0000-0000-000000000000");

    @Builder.Default
    private UUID id = defaultId;
    private String name;
    private int capacity;
    private List<RoomPhotoRequestDTO> photos;
}
