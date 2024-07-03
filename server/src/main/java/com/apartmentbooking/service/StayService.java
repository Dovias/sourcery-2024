package com.apartmentbooking.service;

import com.apartmentbooking.dto.calendarDTOs.CalendarResponseDTO;
import com.apartmentbooking.dto.mapper.CalenadarMapper;
import com.apartmentbooking.dto.mapper.StayMapper;
import com.apartmentbooking.dto.stayDTOs.StayRequestDTO;
import com.apartmentbooking.dto.stayDTOs.StayResponseDTO;
import com.apartmentbooking.exception.EntityNotFoundException;
import com.apartmentbooking.models.Apartment;
import com.apartmentbooking.models.Employee;
import com.apartmentbooking.models.Room;
import com.apartmentbooking.models.Stay;
import com.apartmentbooking.repository.ApartmentRepository;
import com.apartmentbooking.repository.EmployeeRepository;
import com.apartmentbooking.repository.RoomRepository;
import com.apartmentbooking.repository.StayRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StayService {
    private final StayRepository stayRepository;
    private final EmployeeRepository employeeRepository;
    private final RoomRepository roomRepository;
    private final ApartmentRepository apartmentRepository;
    private static final String STAY_NOT_FOUND = "Stay with given id not found.";
    private static final String ROOM_IS_ALREADY_RESERVED = "This date is already reserved by someone else.";
    private static final String ROOM_NOT_FOUND = "Room with given id not found.";
    private static final String EMPLOYEE_NOT_FOUND = "Employee with given id not found.";
    private static final String APARTMENT_NOT_FOUND = "Apartment with given id not found.";
    private static final String WRONG_DATE = "End date must be after the start date.";

    public StayResponseDTO createStay(StayRequestDTO stayRequestDTO) throws BadRequestException {
        Stay stay = Stay.builder()
                .id(UUID.randomUUID())
                .employeeId(stayRequestDTO.getEmployeeId())
                .start(stayRequestDTO.getStart())
                .end(stayRequestDTO.getEnd())
                .note(stayRequestDTO.getNote())
                .roomId(stayRequestDTO.getRoomId())
                .apartmentId(stayRequestDTO.getApartmentId())
                .build();

        // Warnings ignored because `stayRepository.insert(stay)` throws exception on non-existent room or employee ids
        stay.setRoom(roomRepository.findById(stay.getRoomId()).get());
        stay.setEmployee(employeeRepository.findById(stay.getEmployeeId()).get());
        stay.setApartment(apartmentRepository.findById(stay.getApartmentId()).get());

        validateStay(stay);
        stayRepository.insert(stay);
        return StayMapper.toDto(stay);
    }

    public StayResponseDTO createDummyStay(StayRequestDTO stayRequestDTO) throws BadRequestException {
        if (stayRequestDTO.getStart() == null || stayRequestDTO.getEnd() == null) {
            throw new EntityNotFoundException(WRONG_DATE);
        }
        Optional<Room> room = roomRepository.findById(stayRequestDTO.getRoomId());
        if (room.isEmpty()) {
            throw new EntityNotFoundException(ROOM_NOT_FOUND);
        }
        Optional<Employee> employee = employeeRepository.findById(stayRequestDTO.getEmployeeId());
        if (employee.isEmpty()) {
            throw new EntityNotFoundException(EMPLOYEE_NOT_FOUND);
        }
        Optional<Apartment> apartment = apartmentRepository.findById(room.get().getApartmentId());
        if (apartment.isEmpty()) {
            throw new EntityNotFoundException(APARTMENT_NOT_FOUND);
        }

        Stay stay = Stay.builder()
                .start(stayRequestDTO.getStart())
                .end(stayRequestDTO.getEnd())
                .note(stayRequestDTO.getNote())
                .roomId(stayRequestDTO.getRoomId())
                .employeeId(stayRequestDTO.getEmployeeId())
                .apartmentId(room.get().getApartmentId())
                .room(room.get())
                .employee(employee.get())
                .apartment(apartment.get())
                .build();

        validateStay(stay);
        return StayMapper.toDto(stay);
    }

    public StayResponseDTO getStay(UUID id) {
        Stay stay = stayRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(STAY_NOT_FOUND));
        return StayMapper.toDto(stay);
    }

    public List<StayResponseDTO> getSortedStays(Optional<String> optionalSortOrder) {
        String sortOrder = optionalSortOrder
                .filter(order -> "ASC".equalsIgnoreCase(order) || "DESC".equalsIgnoreCase(order))
                .orElse("ASC");
        List<Stay> stays = stayRepository.findAllSorted(sortOrder);
        return stays
                .stream()
                .map(StayMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StayResponseDTO> getStaysByEmployeeId(UUID employeeId, Optional<String> optionalSortOrder) {
        String sortOrder = optionalSortOrder
                .filter(order -> "ASC".equalsIgnoreCase(order) || "DESC".equalsIgnoreCase(order))
                .orElse("ASC");
        List<Stay> stays = stayRepository.findByEmployeeIdSorted(employeeId, sortOrder);
        return stays.stream()
                .map(StayMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StayResponseDTO> getSortedStays(Optional<String> optionalSortOrder,String SearchQuery) {
        String sortOrder = optionalSortOrder
                .filter(order -> "ASC".equalsIgnoreCase(order) || "DESC".equalsIgnoreCase(order))
                .orElse("ASC");
        List<Stay> stays = stayRepository.findAllSortedWithSearch(sortOrder, SearchQuery.toLowerCase());
        return stays
                .stream()
                .map(StayMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StayResponseDTO> getStaysByEmployeeId(UUID employeeId, Optional<String> optionalSortOrder, String SearchQuery) {
        String sortOrder = optionalSortOrder
                .filter(order -> "ASC".equalsIgnoreCase(order) || "DESC".equalsIgnoreCase(order))
                .orElse("ASC");
        List<Stay> stays = stayRepository.findByEmployeeIdSortedWithSearch(employeeId, sortOrder, SearchQuery.toLowerCase());
        return stays.stream()
                .map(StayMapper::toDto)
                .collect(Collectors.toList());
    }

    public StayResponseDTO updateStay(UUID id, StayRequestDTO stayRequestDTO) throws BadRequestException {
        Stay existingStay = stayRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(STAY_NOT_FOUND));

        Stay stay = Stay.builder()
                .id(id)
                .start(stayRequestDTO.getStart())
                .end(stayRequestDTO.getEnd())
                .note(stayRequestDTO.getNote())
                .roomId(stayRequestDTO.getRoomId())
                .employeeId(stayRequestDTO.getEmployeeId())
                .apartmentId(stayRequestDTO.getApartmentId())
                .build();

        // Warnings ignored because `stayRepository.insert(stay)` throws exception on non-existent room or employee ids
        // May be worthwhile to remake into single join statement
        stay.setRoom(roomRepository.findById(stay.getRoomId()).get());
        stay.setEmployee(employeeRepository.findById(stay.getEmployeeId()).get());
        stay.setApartment(apartmentRepository.findById(stay.getApartmentId()).get());

        validateStay(stay);
        stayRepository.update(stay);
        return StayMapper.toDto(stay);
    }

    public void deleteStay(UUID id) {
        stayRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(STAY_NOT_FOUND));
        stayRepository.delete(id);
    }

    public List<CalendarResponseDTO> getCalendarStays() {
        List<Room> rooms = roomRepository.findAll();
        List<Apartment> apartments = apartmentRepository.findAll();
        return rooms.stream().map(r -> CalenadarMapper.toDto(r, apartments)).collect(Collectors.toList());
    }

    private void validateStay(Stay stay) throws BadRequestException {
        List<Stay> roomStays = stayRepository.findByRoomId(stay.getRoomId());
        List<Stay> staysInSameDate = roomStays.stream()
                .filter(s -> !s.getId().equals(stay.getId())
                        && isOverlap(s.getStart(), s.getEnd(), stay.getStart(), stay.getEnd()))
                .toList();
        if (staysInSameDate.size() > 0) {
            throw new BadRequestException(ROOM_IS_ALREADY_RESERVED);
        }
        if (stay.getStart().isAfter(stay.getEnd())) {
            throw new BadRequestException(WRONG_DATE);
        }
    }

    private boolean isOverlap(LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
        return !(end1.isBefore(start2) || start1.isAfter(end2));
    }
}
