package com.apartmentbooking.controller;

import com.apartmentbooking.dto.authenticationDTOs.AuthenticationWithGoogleRequestDTO;
import com.apartmentbooking.dto.registerDTOs.RegisterRequestDTO;
import com.apartmentbooking.dto.registerDTOs.RegisterResponseDTO;
import com.apartmentbooking.dto.authenticationDTOs.AuthenticationRequestDTO;
import com.apartmentbooking.dto.authenticationDTOs.AuthenticationResponseDTO;
import com.apartmentbooking.service.AuthenticationService;
import com.apartmentbooking.service.GoogleAuthService;
import com.apartmentbooking.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@Controller
@RequiredArgsConstructor
@RequestMapping("/authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(
            @RequestBody AuthenticationRequestDTO request
    ) throws NoSuchAlgorithmException {
        return ResponseEntity.ok(service.login(request));
    }

    @PostMapping("/google/login")
    public ResponseEntity<AuthenticationResponseDTO> googleLogin(
            @RequestBody AuthenticationWithGoogleRequestDTO request
    ) throws BadRequestException {
        return ResponseEntity.ok(googleAuthService.login(request.getToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> updateEmployee(@Valid @RequestBody RegisterRequestDTO userRequestDTO) throws NoSuchAlgorithmException, BadRequestException {
        return ResponseEntity.ok(service.createEmployee(userRequestDTO));
    }

    @GetMapping("/check")
    public ResponseEntity<String> checkTokenValidity(HttpServletRequest request) {
        return service.checkTokenValidity(request);
    }

}
