package com.apartmentbooking.models;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class Room {
    private UUID id;
    private UUID apartmentId;
    private String name;
    private int capacity;
    private List<Stay> stays;
    private List<RoomPhoto> photos;
}
