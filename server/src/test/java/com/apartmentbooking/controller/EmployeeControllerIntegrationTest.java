package com.apartmentbooking.controller;

import com.apartmentbooking.dto.employeeDTOs.EmployeeRequestDTO;
import com.apartmentbooking.models.Employee;
import com.apartmentbooking.models.Role;
import com.apartmentbooking.repository.EmployeeRepository;
import com.apartmentbooking.repository.RoleRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.Collections;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
@AutoConfigureTestDatabase
class EmployeeControllerIntegrationTest {
    @LocalServerPort
    private int port;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ObjectMapper objectMapper;

    private Role roleUser;
    private Role roleAdmin;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
        cleanup();
        setupRoles();
    }

    @Test
    void gtEmployeeShouldGetEmployeeWithNoStays() {
        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("name")
                .lastName("surname")
                .email("ns@g.com")
                .passwordHash("SECRET")
                .profileBase64("photo")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .stays(Collections.emptyList())
                .role(roleUser)
                .build();

        employeeRepository.insert(employee);

        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/employees/" + employee.getId())
                .then()
                .statusCode(200)
                .body("firstName", is(employee.getFirstName()))
                .body("lastName", is(employee.getLastName()))
                .body("email", is(employee.getEmail()))
                .body("profileBase64", is(employee.getProfileBase64()))
                .body("jobTitle", is(employee.getJobTitle()))
                .body("city", is(employee.getCity()))
                .body("country", is(employee.getCountry()))
                .body("stays", hasSize(0));
    }

    @Test
    void getEmployeesShouldGetEmployeesWithNoStays() {
        Employee employee1 = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("name")
                .lastName("surname")
                .email("ns@g.com")
                .passwordHash("SECRET")
                .profileBase64("photo")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .stays(Collections.emptyList())
                .role(roleUser)
                .build();

        Employee employee2 = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("name2")
                .lastName("surname2")
                .email("ns@g.com2")
                .passwordHash("SECRET2")
                .profileBase64("photo2")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .stays(Collections.emptyList())
                .role(roleUser)
                .build();

        employeeRepository.insert(employee1);
        employeeRepository.insert(employee2);

        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/employees")
                .then()
                .statusCode(200)
                .body("firstName", hasItems(employee1.getFirstName(), employee2.getFirstName()))
                .body("lastName", hasItems(employee1.getLastName(), employee2.getLastName()))
                .body("email", hasItems(employee1.getEmail(), employee2.getEmail()))
                .body("profileBase64", hasItems(employee1.getProfileBase64(), employee2.getProfileBase64()))
                .body("roleId", hasItems(employee1.getRole().getRoleId(), employee2.getRole().getRoleId()))
                .body("jobTitle", hasItems(employee1.getJobTitle(), employee2.getJobTitle()))
                .body("country", hasItems(employee1.getCountry(), employee2.getCountry()))
                .body("city", hasItems(employee1.getCity(), employee2.getCity()))
                .body("stays", hasSize(2));
    }

    @Test
    void deleteEmployeeShouldDeleteEmployeeWithNoStays() {
        Employee employee1 = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("name")
                .lastName("surname")
                .email("ns@g.com")
                .passwordHash("SECRET")
                .profileBase64("photo")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .stays(Collections.emptyList())
                .role(roleUser)
                .build();

        Employee employee2 = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("name2")
                .lastName("surname2")
                .email("ns@g.com2")
                .passwordHash("SECRET2")
                .profileBase64("photo2")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .stays(Collections.emptyList())
                .role(roleUser)
                .build();

        employeeRepository.insert(employee1);
        employeeRepository.insert(employee2);

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete("/employees/" + employee1.getId())
                .then()
                .statusCode(200);

        assertEquals(employeeRepository.findAll().size(), 1);
    }

    @Test
    void updateEmployee() {
        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("name")
                .lastName("surname")
                .email("ns@g.com")
                .passwordHash("SECRET")
                .profileBase64("photo")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .stays(Collections.emptyList())
                .role(roleUser)
                .build();

        employeeRepository.insert(employee);

        EmployeeRequestDTO employeeRequestDTO = EmployeeRequestDTO.builder()
                .firstName("new")
                .lastName("new")
                .email("new")
                .roleId(employee.getRole().getRoleId())
                .profileBase64("new")
                .jobTitle("new")
                .country("Poland")
                .city("Warsaw")
                .build();

        String employeeJson;

        try {
            employeeJson = objectMapper.writeValueAsString(employeeRequestDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException();
        }

        System.out.println(employeeJson);
        given()
                .contentType(ContentType.JSON)
                .body(employeeJson)
                .when()
                .put("/employees/" + employee.getId())
                .then()
                .statusCode(200)
                .body("firstName", is(employeeRequestDTO.getFirstName()))
                .body("lastName", is(employeeRequestDTO.getLastName()))
                .body("email", is(employeeRequestDTO.getEmail()))
                .body("profileBase64", is(employeeRequestDTO.getProfileBase64()))
                .body("roleId", is(employeeRequestDTO.getRoleId()))
                .body("jobTitle", is(employeeRequestDTO.getJobTitle()))
                .body("country", is(employeeRequestDTO.getCountry()))
                .body("city", is(employeeRequestDTO.getCity()))
                .body("stays", hasSize(0));

        assertTrue(employeeRepository.findById(employee.getId()).isPresent());
        Employee changedEmployee = employeeRepository.findById(employee.getId()).get();
        assertEquals(changedEmployee.getFirstName(), employeeRequestDTO.getFirstName());
        assertEquals(changedEmployee.getLastName(), employeeRequestDTO.getLastName());
        assertEquals(changedEmployee.getEmail(), employeeRequestDTO.getEmail());
        assertEquals(changedEmployee.getProfileBase64(), employeeRequestDTO.getProfileBase64());
    }

    private void cleanup() {
        employeeRepository.findAll()
                .forEach(employee -> employeeRepository.delete(employee.getId()));
        roleRepository.findAll()
                .forEach(role -> roleRepository.delete(role.getRoleId()));
    }

    private void setupRoles() {
        roleUser = new Role(1, "USER");
        roleAdmin = new Role(2, "ADMIN");
        roleRepository.insert(roleUser);
        roleRepository.insert(roleAdmin);
    }
}