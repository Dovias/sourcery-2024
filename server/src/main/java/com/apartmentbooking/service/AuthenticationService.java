package com.apartmentbooking.service;

import com.apartmentbooking.dto.registerDTOs.RegisterRequestDTO;
import com.apartmentbooking.dto.registerDTOs.RegisterResponseDTO;
import com.apartmentbooking.dto.authenticationDTOs.AuthenticationRequestDTO;
import com.apartmentbooking.dto.authenticationDTOs.AuthenticationResponseDTO;
import com.apartmentbooking.exception.authentication.AuthenticationException;
import com.apartmentbooking.exception.EntityNotFoundException;
import com.apartmentbooking.exception.authentication.RegistrationError;
import com.apartmentbooking.models.Country;
import com.apartmentbooking.models.Employee;
import com.apartmentbooking.models.Role;
import com.apartmentbooking.repository.EmployeeRepository;
import com.apartmentbooking.repository.RoleRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    public static String ROLE_NOT_FOUND = "Error assigning user role.";

    public AuthenticationResponseDTO login(AuthenticationRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        String employeeNotFound = "Employee with Id not found";
        Employee user = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(employeeNotFound));
        return login(user);
    }

    public AuthenticationResponseDTO login(Employee user){
        String jwtToken = jwtService.generateToken((UserDetails) user);

        Role role = user.getRole();

        return AuthenticationResponseDTO.builder()
                .id(user.getId())
                .token(jwtToken)
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .jobTitle(user.getJobTitle())
                .city(user.getCity())
                .country(user.getCountry())
                .profileBase64(user.getProfileBase64())
                .role(role)
                .build();
    }

    public RegisterResponseDTO createEmployee(RegisterRequestDTO userRequestDTO) {
        Map<String, Object> validationErrors = new HashMap<>();

        Optional<Employee> sameEmailEmployees = employeeRepository.findByEmail(userRequestDTO.getEmail()); if (sameEmailEmployees.isPresent()) {
            validationErrors.put("email", RegistrationError.EMAIL_EXISTS);
            throw new AuthenticationException(validationErrors);
        }

        if (StringUtils.length(userRequestDTO.getFirstName()) > 20) {
            validationErrors.put("firstName", RegistrationError.NAME_TOO_LONG);
        }
        if (StringUtils.length(userRequestDTO.getLastName()) > 20) {
            validationErrors.put("lastName", RegistrationError.LAST_NAME_TOO_LONG);
        }
        if (StringUtils.length(userRequestDTO.getEmail()) > 50) {
            validationErrors.put("email", RegistrationError.EMAIL_TOO_LONG);
        }
        if (StringUtils.length(userRequestDTO.getJobTitle()) > 50) {
            validationErrors.put("jobTitle", RegistrationError.JOB_TITLE_TOO_LONG);
        }
        if (StringUtils.length(userRequestDTO.getCity()) > 50) {
            validationErrors.put("city", RegistrationError.CITY_NAME_TOO_LONG);
        }
        try {
            Country.valueOf(userRequestDTO.getCountry().toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            validationErrors.put("country", RegistrationError.COUNTRY_NOT_FOUND);
        }

        if (!validationErrors.isEmpty()) {
            throw new AuthenticationException(validationErrors);
        }

        Role defaultRole = roleRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));

        String hashedPassword = passwordEncoder.encode(userRequestDTO.getPassword());

        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName(userRequestDTO.getFirstName())
                .lastName(userRequestDTO.getLastName())
                .email(userRequestDTO.getEmail())
                .jobTitle(userRequestDTO.getJobTitle())
                .city(userRequestDTO.getCity())
                .country(userRequestDTO.getCountry())
                .passwordHash(hashedPassword)
                .role(defaultRole)
                .build();
        employeeRepository.insert(employee);

        return RegisterResponseDTO.of(employee);
    }

    public UserDetails getUserDetailsFromToken(String token) {
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new EntityNotFoundException("User not found with username: " + username);
        }
        return userDetails;
    }

    public ResponseEntity<String> checkTokenValidity(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");

        try {
            UserDetails userDetails = getUserDetailsFromToken(token);

            if (!jwtService.isTokenValid(token, userDetails)) {
                return ResponseEntity.ok("Token is valid");
            } else {
                String newToken = jwtService.refreshToken(userDetails);
                return ResponseEntity.ok("Token refreshed successfully: " + newToken);
            }
        } catch (AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to check token validity", e);
        }
    }

    private String HashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(password.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}
