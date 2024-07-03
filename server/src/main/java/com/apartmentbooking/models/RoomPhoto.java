package com.apartmentbooking.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoomPhoto {
    private UUID id;
    private UUID roomId;
    private String photoBase64;
}
