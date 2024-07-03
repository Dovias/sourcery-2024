package com.apartmentbooking.controller;

import com.apartmentbooking.dto.authenticationDTOs.AuthenticationWithGoogleRequestDTO;
import com.apartmentbooking.dto.authenticationDTOs.AuthenticationWithGoogleResponseDTO;
import com.apartmentbooking.dto.employeeDTOs.EmployeeRequestDTO;
import com.apartmentbooking.dto.employeeDTOs.EmployeeResponseDTO;
import com.apartmentbooking.service.EmployeeService;
import com.apartmentbooking.service.GoogleAuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final GoogleAuthService googleAuthService;

    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmployee(@PathVariable UUID id) {
        return employeeService.getEmployee(id);
    }

    @GetMapping("/search/{SearchQuery}")
    public List<EmployeeResponseDTO> getEmployees(@PathVariable String SearchQuery) {
        return employeeService.getEmployees(SearchQuery + "%");
    }

    @GetMapping({"", "/search/"})
    public List<EmployeeResponseDTO> getEmployees() {
        return employeeService.getEmployees();
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable UUID id) {
        employeeService.deleteEmployee(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponseDTO updateEmployee(@PathVariable UUID id, @RequestBody EmployeeRequestDTO employeeRequestDTO) {
        return employeeService.updateEmployee(id, employeeRequestDTO);
    }

    @PutMapping("/{id}/role")
    public EmployeeResponseDTO updateEmployeeRole(@PathVariable UUID id, @RequestParam("roleId") int roleId) {
        return employeeService.updateEmplyeeRole(id, roleId);
    }

    @PutMapping("/google/unlink/{id}")
    public AuthenticationWithGoogleResponseDTO unLinkGoogle(@PathVariable UUID id) {
        googleAuthService.unLinkGoogle(id);
        return new AuthenticationWithGoogleResponseDTO();
    }

    @PutMapping("/google/link/{id}")
    public AuthenticationWithGoogleResponseDTO linkGoogle(
            @PathVariable UUID id,
            @RequestBody AuthenticationWithGoogleRequestDTO request
    ) throws BadRequestException {
        return googleAuthService.linkGoogle(id, request.getToken());
    }

    @GetMapping("/google/{id}")
    public AuthenticationWithGoogleResponseDTO getEmployeeGoogleId(@PathVariable UUID id) {
        return googleAuthService.getEmployeeGoogleId(id);
    }
}