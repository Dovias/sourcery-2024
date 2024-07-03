package com.apartmentbooking.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Apartment {
    private UUID id;
    private String name;
    private String description;
    private String country;
    private String city;
    private String postalCode;
    private String address;
    private List<Room> rooms;
    private List<ApartmentPhoto> photos64;
}
