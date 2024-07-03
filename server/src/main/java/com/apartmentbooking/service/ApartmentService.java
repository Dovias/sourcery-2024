package com.apartmentbooking.service;

import com.apartmentbooking.dto.ApartmentLocationDTO.ApartmentLocationDTO;
import com.apartmentbooking.dto.apartmentDTOs.ApartmentRequestDTO;
import com.apartmentbooking.dto.apartmentDTOs.ApartmentResponseDTO;
import com.apartmentbooking.dto.apartmentPhotoDTOs.ApartmentPhotoRequestDTO;
import com.apartmentbooking.dto.mapper.ApartmentMapper;
import com.apartmentbooking.dto.mapper.ApartmentPhotoMapper;
import com.apartmentbooking.dto.mapper.RoomMapper;
import com.apartmentbooking.dto.roomDTOs.RoomRequestDTO;
import com.apartmentbooking.exception.EntityNotFoundException;
import com.apartmentbooking.models.Apartment;
import com.apartmentbooking.models.ApartmentPhoto;
import com.apartmentbooking.models.Room;
import com.apartmentbooking.models.RoomPhoto;
import com.apartmentbooking.repository.ApartmentPhotoRepository;
import com.apartmentbooking.repository.ApartmentRepository;
import com.apartmentbooking.repository.RoomPhotoRepository;
import com.apartmentbooking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ApartmentService {
    private final ApartmentRepository apartmentRepository;
    private final ApartmentPhotoRepository apartmentPhotoRepository;
    private final RoomRepository roomRepository;
    private final RoomPhotoRepository roomPhotoRepository;
    private final static String APARTMENT_NOT_FOUND = "Apartment with given id not found";

    @Transactional
    public ApartmentResponseDTO createApartment(ApartmentRequestDTO apartmentRequestDTO) {
        Apartment apartment = ApartmentMapper.fromDto(apartmentRequestDTO);
        apartmentRepository.insert(apartment);
        apartmentPhotoRepository.insertList(apartment.getPhotos64());
        roomRepository.insertList(apartment.getRooms());
        roomPhotoRepository.insertList(apartment.getRooms()
                .stream()
                .map(Room::getPhotos)
                .flatMap(List::stream)
                .collect(Collectors.toList()));

        return ApartmentMapper.toDto(apartment);
    }

    public ApartmentResponseDTO getApartment(UUID id) {
        return ApartmentMapper.toDto(apartmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(APARTMENT_NOT_FOUND)));
    }

    public List<ApartmentResponseDTO> getApartments(String SearchQuery) {
        return apartmentRepository.findAllWithSearch(SearchQuery.toLowerCase())
                .stream()
                .map(ApartmentMapper::toDto)
                .collect(Collectors.toList());
    }
    public List<ApartmentResponseDTO> getApartments() {
        return apartmentRepository.findAll()
                .stream()
                .map(ApartmentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ApartmentLocationDTO> getApartmentLocations() {
        List<Apartment> apartments = apartmentRepository.findAll();

        Map<String, List<Apartment>> groupedByAddress = apartments.stream()
                .collect(Collectors.groupingBy(Apartment::getAddress));

        return groupedByAddress.entrySet().stream()
                .map(entry -> new ApartmentLocationDTO(
                         entry.getValue().getFirst().getCountry(),
                         entry.getValue().getFirst().getCity(),
                         entry.getValue().getFirst().getPostalCode(),
                         entry.getKey(),
                         entry.getValue().stream().map(Apartment::getName).collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    // If a ApartmentRequestDTO.rooms[n].id that does not exist is entered the server
    // does not return an error but also does not post the value in database.
    public ApartmentResponseDTO updateApartment(ApartmentRequestDTO apartmentRequestDTO, UUID id) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(APARTMENT_NOT_FOUND));

        apartment.setCountry(apartmentRequestDTO.getCountry());
        apartment.setCity(apartmentRequestDTO.getCity());
        apartment.setAddress(apartmentRequestDTO.getAddress());
        apartment.setName(apartmentRequestDTO.getName());
        apartment.setDescription(apartmentRequestDTO.getDescription());
        apartment.setPostalCode(apartmentRequestDTO.getPostalCode());

        List<Room> newRooms = apartmentRequestDTO.getRooms()
                .stream()
                .filter((room) -> room.getId().equals(RoomRequestDTO.defaultId))
                .map((room) -> RoomMapper.fromDto(room, apartment.getId()))
                .toList();

        List<Room> editedRooms = apartmentRequestDTO.getRooms()
                .stream()
                .filter((room) -> !room.getId().equals(RoomRequestDTO.defaultId))
                .map((room) -> RoomMapper.fromDto(room, apartment.getId()))
                .toList();

        List<ApartmentPhoto> newApartmentPhotos = apartmentRequestDTO.getPhotos64()
                .stream()
                .filter((photo) -> photo.getId().equals(ApartmentPhotoRequestDTO.defaultId))
                .map((photo) -> ApartmentPhotoMapper.fromDto(photo, apartment.getId()))
                .toList();

        List<ApartmentPhoto> editedApartmentPhotos = apartmentRequestDTO.getPhotos64()
                .stream()
                .filter((photo) -> !photo.getId().equals(ApartmentPhotoRequestDTO.defaultId))
                .map((photo) -> ApartmentPhotoMapper.fromDto(photo, apartment.getId()))
                .toList();

        List<RoomPhoto> editedRoomPhotos = editedRooms.stream()
                .map(Room::getPhotos)
                .flatMap(List::stream)
                .toList();

        List<RoomPhoto> newRoomPhotos = newRooms.stream()
                .map(Room::getPhotos)
                .flatMap(List::stream)
                .toList();

        List<RoomPhoto> roomPhotos = Stream.concat(newRoomPhotos.stream(), editedRoomPhotos.stream())
                .collect(Collectors.toList());

        List<Room> roomsToDelete = apartment.getRooms()
                .stream()
                .filter((room) -> !editedRooms.stream()
                        .map(Room::getId)
                        .toList()
                        .contains(room.getId()))
                .toList();

        List<ApartmentPhoto> apartmentPhotosToDelete = apartment.getPhotos64()
                .stream()
                .filter((photo) -> !editedApartmentPhotos.stream()
                        .map(ApartmentPhoto::getId)
                        .toList()
                        .contains(photo.getId()))
                .toList();

        roomRepository.deleteList(roomsToDelete);
        roomRepository.insertList(newRooms);
        roomRepository.updateList(editedRooms);

        // This probably won't cause any issues as photos
        // will most likely not have dependent entities
        roomPhotoRepository.deleteList(editedRoomPhotos);
        roomPhotoRepository.insertList(roomPhotos);

        apartmentPhotoRepository.deleteList(apartmentPhotosToDelete);
        apartmentPhotoRepository.updateList(editedApartmentPhotos);
        apartmentPhotoRepository.insertList(newApartmentPhotos);

        apartment.getPhotos64().clear();
        apartment.getPhotos64().addAll(editedApartmentPhotos);
        apartment.getPhotos64().addAll(newApartmentPhotos);
        apartment.getRooms().clear();
        apartment.getRooms().addAll(editedRooms);
        apartment.getRooms().addAll(newRooms);

        apartmentRepository.update(apartment);
        return ApartmentMapper.toDto(apartment);
    }

    public void deleteApartment(UUID id) {
        apartmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(APARTMENT_NOT_FOUND));
        apartmentRepository.delete(id);
    }
}
