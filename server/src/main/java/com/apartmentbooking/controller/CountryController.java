package com.apartmentbooking.controller;

import com.apartmentbooking.models.Country;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/countries")
public class CountryController {

    @GetMapping
    public List<String> getCountries() {
        return Country.getCountryNames();
    }
}