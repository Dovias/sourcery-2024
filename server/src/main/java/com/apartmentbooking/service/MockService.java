package com.apartmentbooking.service;

import com.apartmentbooking.repository.MockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MockService {

  private final MockRepository mockRepository;

  public String getMockValue() {
    return mockRepository.getMockTitle();
  }
}
