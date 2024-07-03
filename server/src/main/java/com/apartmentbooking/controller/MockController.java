package com.apartmentbooking.controller;

import com.apartmentbooking.service.MockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MockController {

  private final MockService mockService;

  @GetMapping("/mock")
  public String getMockValue() {
    return mockService.getMockValue();
  }
}
