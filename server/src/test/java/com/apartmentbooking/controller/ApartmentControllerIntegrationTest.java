package com.apartmentbooking.controller;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.apartmentbooking.dto.apartmentDTOs.ApartmentRequestDTO;
import com.apartmentbooking.dto.apartmentPhotoDTOs.ApartmentPhotoRequestDTO;
import com.apartmentbooking.dto.roomDTOs.RoomRequestDTO;
import com.apartmentbooking.dto.roomPhotoDTOs.RoomPhotoRequestDTO;
import com.apartmentbooking.models.Apartment;
import com.apartmentbooking.models.ApartmentPhoto;
import com.apartmentbooking.models.Room;
import com.apartmentbooking.models.RoomPhoto;
import com.apartmentbooking.repository.ApartmentPhotoRepository;
import com.apartmentbooking.repository.ApartmentRepository;
import com.apartmentbooking.repository.RoomPhotoRepository;
import com.apartmentbooking.repository.RoomRepository;
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
import java.util.List;
import java.util.UUID;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
@AutoConfigureTestDatabase
class ApartmentControllerIntegrationTest {

    @LocalServerPort
    private int port;
    @Autowired
    private ApartmentRepository apartmentRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ApartmentPhotoRepository apartmentPhotoRepository;
    @Autowired
    private RoomPhotoRepository roomPhotoRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
        cleanup();
    }

    @Test
    void getApartmentsShouldGetAllApartments() {
        Apartment apartment1 = new Apartment(UUID.randomUUID(), "Ap1", "des", "lit", "vl", "str1", "0000", Collections.emptyList(), Collections.emptyList());
        Apartment apartment2 = new Apartment(UUID.randomUUID(), "Ap2", "des", "lit", "vl", "str2", "0000", Collections.emptyList(), Collections.emptyList());
        Apartment apartment3 = new Apartment(UUID.randomUUID(), "Ap3", "des", "lit", "vl", "str2", "0000", Collections.emptyList(), Collections.emptyList());

        Room room1 = new Room(UUID.randomUUID(), apartment3.getId(), "1", 8, Collections.emptyList(), Collections.emptyList());
        Room room2 = new Room(UUID.randomUUID(), apartment3.getId(), "2", 4, Collections.emptyList(), Collections.emptyList());
        List<Room> rooms = List.of(room1, room2);

        RoomPhoto roomPhoto1 = new RoomPhoto(UUID.randomUUID(), room1.getId(), "rp1");
        RoomPhoto roomPhoto2 = new RoomPhoto(UUID.randomUUID(), room1.getId(), "rp2");
        List<RoomPhoto> roomPhotos = List.of(roomPhoto1, roomPhoto2);

        ApartmentPhoto photo1 = new ApartmentPhoto(UUID.randomUUID(), apartment3.getId(), "p1");
        ApartmentPhoto photo2 = new ApartmentPhoto(UUID.randomUUID(), apartment3.getId(), "p2");
        List<ApartmentPhoto> photos = List.of(photo1, photo2);

        apartmentRepository.insert(apartment1);
        apartmentRepository.insert(apartment2);
        apartmentRepository.insert(apartment3);
        roomRepository.insertList(rooms);
        roomPhotoRepository.insertList(roomPhotos);
        apartmentPhotoRepository.insertList(photos);

        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/apartments")
                .then()
                .statusCode(200)
                .body(".", hasSize(3))
                .body("rooms[0].name", hasSize(0))
                .body("rooms[1].name", hasSize(0))
                .body("rooms[2].name", hasItems(room1.getName(), room2.getName()))
                .body("rooms[2].photos", hasSize(2))
                .body("photos64[0].photo64", hasSize(0))
                .body("photos64[1].photo64", hasSize(0))
                .body("photos64[2].photo64", hasSize(2))
                .body("photos64[2].photo64", hasItems(photo1.getPhotoBase64(), photo2.getPhotoBase64()));
    }

    @Test
    void deleteApartmentShouldDeleteApartmentAndDependentEntities() {
        Apartment apartment1 = new Apartment(UUID.randomUUID(), "Ap1", "des", "lit", "vl", "str1", "0000", Collections.emptyList(), Collections.emptyList());
        Apartment apartment2 = new Apartment(UUID.randomUUID(), "Ap2", "des", "lit", "vl", "str2", "0000", Collections.emptyList(), Collections.emptyList());
        Apartment apartment3 = new Apartment(UUID.randomUUID(), "Ap3", "des", "lit", "vl", "str2", "0000", Collections.emptyList(), Collections.emptyList());

        Room room1 = new Room(UUID.randomUUID(), apartment3.getId(), "1", 8, Collections.emptyList(), Collections.emptyList());
        Room room2 = new Room(UUID.randomUUID(), apartment3.getId(), "2", 4, Collections.emptyList(), Collections.emptyList());
        List<Room> rooms = List.of(room1, room2);

        RoomPhoto roomPhoto1 = new RoomPhoto(UUID.randomUUID(), room1.getId(), "rp1");
        RoomPhoto roomPhoto2 = new RoomPhoto(UUID.randomUUID(), room1.getId(), "rp2");
        List<RoomPhoto> roomPhotos = List.of(roomPhoto1, roomPhoto2);

        ApartmentPhoto photo1 = new ApartmentPhoto(UUID.randomUUID(), apartment3.getId(), "p1");
        ApartmentPhoto photo2 = new ApartmentPhoto(UUID.randomUUID(), apartment3.getId(), "p2");
        List<ApartmentPhoto> photos = List.of(photo1, photo2);

        apartmentRepository.insert(apartment1);
        apartmentRepository.insert(apartment2);
        apartmentRepository.insert(apartment3);
        roomRepository.insertList(rooms);
        roomPhotoRepository.insertList(roomPhotos);
        apartmentPhotoRepository.insertList(photos);

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete("/apartments/" + apartment3.getId())
                .then()
                .statusCode(204);

        assertTrue(apartmentRepository.findById(apartment3.getId()).isEmpty());
        assertEquals(apartmentRepository.findAll().size(), 2);
        assertTrue(roomRepository.findByApartmentId(apartment3.getId()).isEmpty());
        assertTrue(apartmentPhotoRepository.findByApartmentId(apartment3.getId()).isEmpty());
        assertTrue(roomPhotoRepository.findByRoomId(room1.getId()).isEmpty());
    }

    @Test
    void deleteApartmentShouldDeleteApartmentWithNoDependentEntities() {
        Apartment apartment1 = new Apartment(UUID.randomUUID(), "Ap1", "des", "lit", "vl", "str1", "0000", Collections.emptyList(), Collections.emptyList());

        apartmentRepository.insert(apartment1);

        given()
                .contentType(ContentType.JSON)
                .when()
                .delete("/apartments/" + apartment1.getId())
                .then()
                .statusCode(204);

        assertTrue(apartmentRepository.findById(apartment1.getId()).isEmpty());
    }

    @Test
    void createApartmentShouldInsertApartmentWithDependentEntities() {
        RoomPhotoRequestDTO roomPhoto1 = RoomPhotoRequestDTO.builder()
                .photoBase64("rp1")
                .build();

        RoomPhotoRequestDTO roomPhoto2 = RoomPhotoRequestDTO.builder()
                .photoBase64("rp2")
                .build();

        List<RoomPhotoRequestDTO> roomPhotoList = List.of(roomPhoto1, roomPhoto2);


        RoomRequestDTO room1 = RoomRequestDTO.builder()
                .name("name1")
                .capacity(7)
                .photos(roomPhotoList)
                .build();
        RoomRequestDTO room2 = RoomRequestDTO.builder()
                .name("name2")
                .capacity(7)
                .photos(Collections.emptyList())
                .build();
        List<RoomRequestDTO> rooms = List.of(room1, room2);

        ApartmentPhotoRequestDTO photo1 = ApartmentPhotoRequestDTO.builder()
                .photo64("photo1")
                .build();
        ApartmentPhotoRequestDTO photo2 = ApartmentPhotoRequestDTO.builder()
                .photo64("photo2")
                .build();
        List<ApartmentPhotoRequestDTO> photos = List.of(photo1, photo2);

        ApartmentRequestDTO apartmentRequestDTO = ApartmentRequestDTO.builder()
                .name("apartment")
                .address("address")
                .city("vln")
                .country("lt")
                .description("des")
                .postalCode("pc")
                .rooms(rooms)
                .photos64(photos)
                .build();

        String apartmentJson;
        try {
            apartmentJson = objectMapper.writeValueAsString(apartmentRequestDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        given()
                .contentType(ContentType.JSON)
                .body(apartmentJson)
                .when()
                .post("/apartments")
                .then()
                .statusCode(201);

        assertEquals(apartmentRepository.findAll().size(), 1);
        Apartment apartment = apartmentRepository.findAll().getFirst();
        UUID apartmentId = apartment.getId();
        assertEquals(roomRepository.findByApartmentId(apartmentId).size(), rooms.size());
        assertEquals(apartmentPhotoRepository.findByApartmentId(apartmentId).size(), photos.size());
        UUID roomId = apartment.getRooms().getFirst().getId();
        assertEquals(roomPhotoRepository.findByRoomId(roomId).size(), roomPhotoList.size());
    }

    @Test
    void createApartmentShouldInsertApartmentWithNoDependentEntities() {
        ApartmentRequestDTO apartmentRequestDTO = ApartmentRequestDTO.builder()
                .name("apartment")
                .address("address")
                .city("vln")
                .country("lt")
                .description("des")
                .postalCode("pc")
                .rooms(Collections.emptyList())
                .photos64(Collections.emptyList())
                .build();

        String apartmentJson;
        try {
            apartmentJson = objectMapper.writeValueAsString(apartmentRequestDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        given()
                .contentType(ContentType.JSON)
                .body(apartmentJson)
                .when()
                .post("/apartments")
                .then()
                .statusCode(201);

        assertEquals(apartmentRepository.findAll().size(), 1);
    }

    @Test
    void updateApartmentShouldUpdateApartment() {
        Apartment apartment1 = new Apartment(UUID.randomUUID(), "Ap1", "des", "lit", "vl", "str1", "0000", Collections.emptyList(), Collections.emptyList());
        Apartment apartment2 = new Apartment(UUID.randomUUID(), "Ap2", "des", "lit", "vl", "str2", "0000", Collections.emptyList(), Collections.emptyList());
        Apartment apartment3 = new Apartment(UUID.randomUUID(), "Ap3", "des", "lit", "vl", "str2", "0000", Collections.emptyList(), Collections.emptyList());

        apartmentRepository.insert(apartment1);
        apartmentRepository.insert(apartment2);
        apartmentRepository.insert(apartment3);

        ApartmentRequestDTO apartmentRequestDTO = ApartmentRequestDTO.builder()
                .name("new")
                .address("new")
                .country("new")
                .city("new")
                .postalCode("new")
                .description("new")
                .rooms(Collections.emptyList())
                .photos64(Collections.emptyList())
                .build();

        String apartmentJson;

        try {
            apartmentJson = objectMapper.writeValueAsString(apartmentRequestDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        given()
                .contentType(ContentType.JSON)
                .body(apartmentJson)
                .when()
                .put("/apartments/" + apartment1.getId())
                .then()
                .statusCode(200);

        assertEquals(apartmentRepository.findAll().size(), 3);
        assertTrue(apartmentRepository.findById(apartment1.getId()).isPresent());
        assertEquals(apartmentRepository.findById(apartment1.getId()).get().getName(), apartmentRequestDTO.getName());
    }

    private void cleanup() {
        List<Apartment> apartments = apartmentRepository.findAll();

        for (Apartment apartment : apartments) {
            apartmentRepository.delete(apartment.getId());
        }
    }
}