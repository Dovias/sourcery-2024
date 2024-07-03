package com.apartmentbooking.controller;

import com.apartmentbooking.dto.stayDTOs.StayRequestDTO;
import com.apartmentbooking.models.*;
import com.apartmentbooking.repository.*;
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

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
@AutoConfigureTestDatabase
class StayControllerIntegrationTest {
    @LocalServerPort
    private int port;
    @Autowired
    private ApartmentRepository apartmentRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private StayRepository stayRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ObjectMapper objectMapper;
    private Role roleUser;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
        cleanup();
        setupRoles();
    }

    @Test
    void createStayShouldCreateStay() {
        Apartment apartment = Apartment.builder()
                .id(UUID.randomUUID())
                .name("n")
                .city("c")
                .country("c")
                .description("d")
                .postalCode("pc")
                .address("a")
                .build();

        Room room = Room.builder()
                .id(UUID.randomUUID())
                .name("n")
                .capacity(1)
                .apartmentId(apartment.getId())
                .build();

        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("fn")
                .lastName("ln")
                .email("e")
                .passwordHash("ph")
                .profileBase64("pb64")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .role(roleUser)
                .build();

        StayRequestDTO stay = StayRequestDTO.builder()
                .roomId(room.getId())
                .apartmentId(apartment.getId())
                .employeeId(employee.getId())
                .note("n")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .build();

        apartmentRepository.insert(apartment);
        roomRepository.insertList(List.of(room));
        employeeRepository.insert(employee);

        String stayJson;

        try {
            stayJson = objectMapper.writeValueAsString(stay);
        } catch (JsonProcessingException e) {
            throw new RuntimeException();
        }

        given()
                .contentType(ContentType.JSON)
                .body(stayJson)
                .when()
                .post("/stays")
                .then()
                .statusCode(201)
                .body("roomId", is(room.getId().toString()))
                .body("employeeId", is(employee.getId().toString()))
                .body("note", is(stay.getNote()))
                .body("room", notNullValue())
                .body("employee", notNullValue())
                .body("start", hasSize(3))
                .body("start[0]", is(stay.getStart().getYear()))
                .body("start[1]", is(stay.getStart().getMonthValue()))
                .body("start[2]", is(stay.getStart().getDayOfMonth()))
                .body("end", hasSize(3))
                .body("end[0]", is(stay.getEnd().getYear()))
                .body("end[1]", is(stay.getEnd().getMonthValue()))
                .body("end[2]", is(stay.getEnd().getDayOfMonth()));

        assertEquals(1, stayRepository.findAll().size());
    }

    @Test
    void getStayShouldGetStayWithDependentEntities() {
        Apartment apartment = Apartment.builder()
                .id(UUID.randomUUID())
                .name("n")
                .city("c")
                .country("c")
                .description("d")
                .postalCode("pc")
                .address("a")
                .build();

        Room room = Room.builder()
                .id(UUID.randomUUID())
                .name("n")
                .capacity(1)
                .apartmentId(apartment.getId())
                .build();

        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("fn")
                .lastName("ln")
                .email("e")
                .passwordHash("ph")
                .profileBase64("pb64")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .role(roleUser)
                .build();

        Stay stay = Stay.builder()
                .id(UUID.randomUUID())
                .apartmentId(apartment.getId())
                .start(LocalDate.now())
                .end(LocalDate.now())
                .note("Hello")
                .employeeId(employee.getId())
                .roomId(room.getId())
                .build();

        apartmentRepository.insert(apartment);
        roomRepository.insertList(List.of(room));
        employeeRepository.insert(employee);
        stayRepository.insert(stay);

        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/stays/" + stay.getId())
                .then()
                .statusCode(200)
                .body("id", is(stay.getId().toString()))
                .body("roomId", is(room.getId().toString()))
                .body("employeeId", is(employee.getId().toString()))
                .body("note", is(stay.getNote()))
                .body("room", notNullValue())
                .body("employee", notNullValue())
                .body("start", hasSize(3))
                .body("start[0]", is(stay.getStart().getYear()))
                .body("start[1]", is(stay.getStart().getMonthValue()))
                .body("start[2]", is(stay.getStart().getDayOfMonth()))
                .body("end", hasSize(3))
                .body("end[0]", is(stay.getEnd().getYear()))
                .body("end[1]", is(stay.getEnd().getMonthValue()))
                .body("end[2]", is(stay.getEnd().getDayOfMonth()));
    }

    @Test
    void getStaysShouldGetAllStays() {
        Apartment apartment = Apartment.builder()
                .id(UUID.randomUUID())
                .name("n")
                .city("c")
                .country("c")
                .description("d")
                .postalCode("pc")
                .address("a")
                .build();

        Room room1 = Room.builder()
                .id(UUID.randomUUID())
                .name("n")
                .capacity(1)
                .apartmentId(apartment.getId())
                .build();

        Room room2 = Room.builder()
                .id(UUID.randomUUID())
                .name("n")
                .capacity(1)
                .apartmentId(apartment.getId())
                .build();

        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("fn")
                .lastName("ln")
                .email("e")
                .passwordHash("ph")
                .profileBase64("pb64")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .role(roleUser)
                .build();

        Stay stay1 = Stay.builder()
                .id(UUID.randomUUID())
                .start(LocalDate.now())
                .end(LocalDate.now())
                .note("Hello")
                .employeeId(employee.getId())
                .roomId(room1.getId())
                .apartmentId(apartment.getId())
                .build();

        Stay stay2 = Stay.builder()
                .id(UUID.randomUUID())
                .start(LocalDate.now())
                .end(LocalDate.now())
                .note("Hello")
                .employeeId(employee.getId())
                .roomId(room2.getId())
                .apartmentId(apartment.getId())
                .build();

        apartmentRepository.insert(apartment);
        roomRepository.insertList(List.of(room1));
        roomRepository.insertList(List.of(room2));
        employeeRepository.insert(employee);
        stayRepository.insert(stay1);
        stayRepository.insert(stay2);

        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/stays")
                .then()
                .statusCode(200)
                .body("id", hasItems(stay1.getId().toString(), stay2.getId().toString()))
                .body("roomId", hasItems(room1.getId().toString(), room2.getId().toString()))
                .body("employeeId", hasItems(employee.getId().toString(), employee.getId().toString()))
                .body("note", hasItems(stay1.getNote(), stay2.getNote()))
                .body("room", notNullValue())
                .body("employee", notNullValue())
                .body("start[0]", hasSize(3))
                .body("start[0][0]", is(stay1.getStart().getYear()))
                .body("start[0][1]", is(stay1.getStart().getMonthValue()))
                .body("start[0][2]", is(stay1.getStart().getDayOfMonth()))
                .body("end[0]", hasSize(3))
                .body("end[0][0]", is(stay1.getEnd().getYear()))
                .body("end[0][1]", is(stay1.getEnd().getMonthValue()))
                .body("end[0][2]", is(stay1.getEnd().getDayOfMonth()))
                .body("start[1]", hasSize(3))
                .body("start[1][0]", is(stay1.getStart().getYear()))
                .body("start[1][1]", is(stay1.getStart().getMonthValue()))
                .body("start[1][2]", is(stay1.getStart().getDayOfMonth()))
                .body("end[1]", hasSize(3))
                .body("end[1][0]", is(stay1.getEnd().getYear()))
                .body("end[1][1]", is(stay1.getEnd().getMonthValue()))
                .body("end[1][2]", is(stay1.getEnd().getDayOfMonth()));
    }

    @Test
    void updateStayShouldUpdateStay() {
        Apartment apartment = Apartment.builder()
                .id(UUID.randomUUID())
                .name("n")
                .city("c")
                .country("c")
                .description("d")
                .postalCode("pc")
                .address("a")
                .build();

        Room room = Room.builder()
                .id(UUID.randomUUID())
                .name("n")
                .capacity(1)
                .apartmentId(apartment.getId())
                .build();

        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("fn")
                .lastName("ln")
                .email("e")
                .passwordHash("ph")
                .profileBase64("pb64")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .role(roleUser)
                .build();

        Stay stay = Stay.builder()
                .id(UUID.randomUUID())
                .roomId(room.getId())
                .apartmentId(apartment.getId())
                .employeeId(employee.getId())
                .note("n")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .build();

        apartmentRepository.insert(apartment);
        roomRepository.insertList(List.of(room));
        employeeRepository.insert(employee);
        stayRepository.insert(stay);

        StayRequestDTO stayRequestDTO = StayRequestDTO.builder()
                .roomId(room.getId())
                .employeeId(employee.getId())
                .apartmentId(apartment.getId())
                .note("f")
                .start(LocalDate.now())
                .end(LocalDate.now())
                .build();
        String stayJson;

        try {
            stayJson = objectMapper.writeValueAsString(stayRequestDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException();
        }

        given()
                .contentType(ContentType.JSON)
                .body(stayJson)
                .when()
                .put("/stays/" + stay.getId())
                .then()
                .statusCode(202)
                .body("roomId", is(room.getId().toString()))
                .body("employeeId", is(employee.getId().toString()))
                .body("note", is(stayRequestDTO.getNote()))
                .body("room", notNullValue())
                .body("employee", notNullValue())
                .body("start", hasSize(3))
                .body("start[0]", is(stay.getStart().getYear()))
                .body("start[1]", is(stay.getStart().getMonthValue()))
                .body("start[2]", is(stay.getStart().getDayOfMonth()))
                .body("end", hasSize(3))
                .body("end[0]", is(stay.getEnd().getYear()))
                .body("end[1]", is(stay.getEnd().getMonthValue()))
                .body("end[2]", is(stay.getEnd().getDayOfMonth()));

        assertEquals(1, stayRepository.findAll().size());
        assertEquals(stayRequestDTO.getNote(), stayRepository.findAll().getFirst().getNote());
    }

    @Test
    void deleteStayShouldDeleteStay() {
        Apartment apartment = Apartment.builder()
                .id(UUID.randomUUID())
                .name("n")
                .city("c")
                .country("c")
                .description("d")
                .postalCode("pc")
                .address("a")
                .build();

        Room room = Room.builder()
                .id(UUID.randomUUID())
                .name("n")
                .capacity(1)
                .apartmentId(apartment.getId())
                .build();

        Employee employee = Employee.builder()
                .id(UUID.randomUUID())
                .firstName("fn")
                .lastName("ln")
                .email("e")
                .passwordHash("ph")
                .profileBase64("pb64")
                .country("Poland")
                .city("Warsaw")
                .jobTitle("Engineer")
                .role(roleUser)
                .build();

        Stay stay = Stay.builder()
                .id(UUID.randomUUID())
                .start(LocalDate.now())
                .end(LocalDate.now())
                .note("Hello")
                .employeeId(employee.getId())
                .roomId(room.getId())
                .apartmentId(apartment.getId())
                .build();

        apartmentRepository.insert(apartment);
        roomRepository.insertList(List.of(room));
        employeeRepository.insert(employee);
        stayRepository.insert(stay);

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete("/stays/" + stay.getId())
                .then()
                .statusCode(200);

        assertEquals(stayRepository.findAll().size(), 0);
    }

    private void setupRoles() {
        roleUser = new Role(1, "USER");
        roleRepository.insert(roleUser);
    }

    private void cleanup() {
        employeeRepository.findAll()
                .forEach(employee -> employeeRepository.delete(employee.getId()));
        apartmentRepository.findAll()
                .forEach(apartment -> apartmentRepository.delete(apartment.getId()));
        roleRepository.findAll()
                .forEach(role -> roleRepository.delete(role.getRoleId()));
    }
}