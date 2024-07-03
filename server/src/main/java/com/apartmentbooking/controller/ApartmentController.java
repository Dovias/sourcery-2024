package com.apartmentbooking.controller;

import com.apartmentbooking.dto.ApartmentLocationDTO.ApartmentLocationDTO;
import com.apartmentbooking.dto.apartmentDTOs.ApartmentRequestDTO;
import com.apartmentbooking.dto.apartmentDTOs.ApartmentResponseDTO;
import com.apartmentbooking.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/apartments")
public class ApartmentController {
    private final ApartmentService apartmentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApartmentResponseDTO createApartment(@Valid @RequestBody ApartmentRequestDTO apartmentRequestDTO) {
        return apartmentService.createApartment(apartmentRequestDTO);
    }

    @GetMapping("/search/{SearchQuery}")
    public List<ApartmentResponseDTO> getApartments(@PathVariable String SearchQuery) {
        return apartmentService.getApartments(SearchQuery+"%");
    }
    @GetMapping({"","/search/"})
    public List<ApartmentResponseDTO> getApartments() {
        return apartmentService.getApartments();
    }

    @GetMapping("/{id}")
    public ApartmentResponseDTO getApartment(@PathVariable(value="id") UUID id) {
        return apartmentService.getApartment(id);
    }

    @GetMapping("/locations")
    public List<ApartmentLocationDTO> getApartment() {
        return apartmentService.getApartmentLocations();
    }

    @PutMapping("/{id}")
    public ApartmentResponseDTO updateApartment(@PathVariable(value="id") UUID id,
                                                @Valid @RequestBody ApartmentRequestDTO apartmentRequestDTO) {
        return apartmentService.updateApartment(apartmentRequestDTO, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApartment(@PathVariable(value="id") UUID id) {
        apartmentService.deleteApartment(id);
    }
}
