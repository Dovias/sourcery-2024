package com.apartmentbooking.service;

import com.apartmentbooking.dto.authenticationDTOs.AuthenticationResponseDTO;
import com.apartmentbooking.dto.authenticationDTOs.AuthenticationWithGoogleResponseDTO;
import com.apartmentbooking.dto.googleAuthDTOs.GoogleTokenInfoResponse;
import com.apartmentbooking.exception.EntityNotFoundException;
import com.apartmentbooking.models.Employee;
import com.apartmentbooking.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private static final String TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v1";

    private static final String INVALID_TOKEN = "Authentication failed: Invalid token";
    private static final String JSON_ERROR = "Authentication failed: Internal error";
    private static final String EMPLOYEE_NOT_FOUND = "Employee not found.";
    private static final String GOOGLE_LINK_ALREADY_EXISTS = "This Google account is already linked";

    private final EmployeeRepository employeeRepository;
    private final AuthenticationService authenticationService;

    public AuthenticationResponseDTO login(String accessToken) throws BadRequestException {
        GoogleTokenInfoResponse tokenData = getTokenData(accessToken);
        return authenticationService.login(employeeRepository.findByGoogleId(tokenData.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND)));
    }

    public void unLinkGoogle(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND));
        employee.setGoogleId("");
        employeeRepository.update(employee);
    }

    public AuthenticationWithGoogleResponseDTO linkGoogle(UUID id, String accessToken) throws BadRequestException {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND));

        GoogleTokenInfoResponse tokenData = getTokenData(accessToken);
        String googleId = tokenData.getEmail();

        Optional<Employee> already_Linked_employee = employeeRepository.findByGoogleId(googleId);
        if (already_Linked_employee.isPresent()) {
            throw new BadRequestException(GOOGLE_LINK_ALREADY_EXISTS + " "
                    + already_Linked_employee.get().getFirstName() + " "
                    + already_Linked_employee.get().getLastName());
        }

        employee.setGoogleId(googleId);
        employeeRepository.update(employee);
        return new AuthenticationWithGoogleResponseDTO(googleId);
    }

    public AuthenticationWithGoogleResponseDTO getEmployeeGoogleId(UUID id) {
        AuthenticationWithGoogleResponseDTO dto = new AuthenticationWithGoogleResponseDTO();
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND));
        if (employee.getGoogleId() == null || employee.getGoogleId().isEmpty()) {
            return dto;
        }
        dto.setGoogleId(employee.getGoogleId());
        return dto;
    }

    private GoogleTokenInfoResponse getTokenData(String accessToken) throws BadRequestException {
        RestTemplate restTemplate = new RestTemplate();
        try {
            String response = restTemplate.getForObject(TOKEN_INFO_URL + "/tokeninfo?access_token=" + accessToken, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            try {
                return objectMapper.readValue(response, GoogleTokenInfoResponse.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (HttpClientErrorException.BadRequest e) {
            throw new BadRequestException(INVALID_TOKEN);
        }
        throw new BadRequestException(JSON_ERROR);
    }
}
