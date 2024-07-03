package com.apartmentbooking.service;

import com.apartmentbooking.dto.employeeDTOs.EmployeeRequestDTO;
import com.apartmentbooking.dto.employeeDTOs.EmployeeResponseDTO;
import com.apartmentbooking.dto.mapper.EmployeeMapper;
import com.apartmentbooking.exception.EntityNotFoundException;
import com.apartmentbooking.models.Country;
import com.apartmentbooking.models.Employee;
import com.apartmentbooking.models.Role;
import com.apartmentbooking.repository.EmployeeRepository;
import com.apartmentbooking.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    public static final String EMPLOYEE_NOT_FOUND = "Employee by the given id not found";
    public static final String ROLE_NOT_FOUND = "Role by the given id not found";

    public EmployeeResponseDTO getEmployee(UUID id) {
        return EmployeeMapper.toDto(employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND)));
    }

    public List<EmployeeResponseDTO> getEmployees(String SearchQuery) {
        return employeeRepository.findAllWithSearch(SearchQuery.toLowerCase())
                .stream()
                .map(EmployeeMapper::toDto)
                .toList();
    }
    public List<EmployeeResponseDTO> getEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(EmployeeMapper::toDto)
                .toList();
    }

    public void deleteEmployee(UUID id) {
        employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND));
        employeeRepository.delete(id);
    }

    public EmployeeResponseDTO updateEmployee(UUID id, EmployeeRequestDTO employeeRequestDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND));
        Role role = roleRepository.findById(employeeRequestDTO.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));

        employee.setFirstName(employeeRequestDTO.getFirstName());
        employee.setLastName(employeeRequestDTO.getLastName());
        employee.setEmail(employeeRequestDTO.getEmail());
        employee.setJobTitle(employeeRequestDTO.getJobTitle());
        employee.setCity(employeeRequestDTO.getCity());
        employee.setCountry(employeeRequestDTO.getCountry());
        employee.setProfileBase64(employeeRequestDTO.getProfileBase64());
        employee.setRole(role);

        employeeRepository.update(employee);
        return EmployeeMapper.toDto(employee);
    }

    public EmployeeResponseDTO updateEmplyeeRole(UUID userId, int newRoleId) {
        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(EMPLOYEE_NOT_FOUND));
        Role newRole = roleRepository.findById(newRoleId)
                .orElseThrow(() -> new EntityNotFoundException(ROLE_NOT_FOUND));
        employee.setRole(newRole);

        employeeRepository.update(employee);
        return EmployeeMapper.toDto(employee);
    }

    public boolean isCountryNameValid(String countryName) {
        return Arrays.stream(Country.values())
                .map(Country::getCountryName)
                .anyMatch(name -> name.equalsIgnoreCase(countryName));
    }
    public static String getEmployeeColor(UUID uuid){
        Random random = new Random(uuid.getMostSignificantBits());
        int red = random.nextInt(50, 200);
        int green = random.nextInt(50, 200);
        int blue = random.nextInt(50, 200);

        return String.format("rgb(%d, %d, %d)", red, green, blue);
    }
}
