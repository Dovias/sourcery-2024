package com.apartmentbooking.dto.ApartmentLocationDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentLocationDTO {
    private String country;
    private String city;
    private String postalCode;
    private String address;
    private List<String> apartmentNames;
}
