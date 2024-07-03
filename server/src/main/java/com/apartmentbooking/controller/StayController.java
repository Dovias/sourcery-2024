package com.apartmentbooking.controller;

import com.apartmentbooking.dto.calendarDTOs.CalendarResponseDTO;
import com.apartmentbooking.dto.stayDTOs.StayRequestDTO;
import com.apartmentbooking.dto.stayDTOs.StayResponseDTO;
import com.apartmentbooking.service.StayService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stays")
public class StayController {
    private final StayService stayService;
    private final SimpMessagingTemplate messageTemplate;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StayResponseDTO createStay(@RequestBody StayRequestDTO stayRequestDTO) throws BadRequestException {
        StayResponseDTO response = stayService.createStay(stayRequestDTO);
        messageTemplate.convertAndSend("/topic/public", stayService.getCalendarStays());
        return response;
    }

    @PostMapping("/dummy")
    public StayResponseDTO createDummyStay(@RequestBody StayRequestDTO stayRequestDTO) throws BadRequestException {
        return stayService.createDummyStay(stayRequestDTO);
    }

    @GetMapping("/{id}")
    public StayResponseDTO getStay(@PathVariable UUID id) {
        return stayService.getStay(id);
    }

    @GetMapping({"","/search/"})
    public List<StayResponseDTO> getSortedStays(@RequestParam Optional<String> sortOrder) {
        return stayService.getSortedStays(sortOrder);
    }

    @GetMapping("/search/{SearchQuery}")
    public List<StayResponseDTO> getSortedStays(@RequestParam Optional<String> sortOrder, @PathVariable String SearchQuery) {
        return stayService.getSortedStays(sortOrder,SearchQuery+"%");
    }

    @GetMapping("/calendar")
    public List<CalendarResponseDTO> getCalendarStays() {
        return stayService.getCalendarStays();
    }

    @GetMapping({"/by-employee/{employeeId}", "/by-employee/{employeeId}/search/"})
    public List<StayResponseDTO> getSortedStaysByEmployeeId(@PathVariable UUID employeeId, @RequestParam Optional<String> sortOrder) {
        return stayService.getStaysByEmployeeId(employeeId, sortOrder);
    }

    @GetMapping("/by-employee/{employeeId}/search/{SearchQuery}")
    public List<StayResponseDTO> getSortedStaysByEmployeeId(@PathVariable UUID employeeId, @RequestParam Optional<String> sortOrder, @PathVariable String SearchQuery) {
        return stayService.getStaysByEmployeeId(employeeId, sortOrder, SearchQuery+"%");
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public StayResponseDTO updateStay(@PathVariable UUID id, @RequestBody StayRequestDTO stayRequestDTO) throws BadRequestException {
        StayResponseDTO response = stayService.updateStay(id, stayRequestDTO);
        messageTemplate.convertAndSend("/topic/public", stayService.getCalendarStays());
        return response;
    }

    @DeleteMapping("/{id}")
    public void deleteStay(@PathVariable UUID id) {
        stayService.deleteStay(id);
        messageTemplate.convertAndSend("/topic/public", stayService.getCalendarStays());
    }
}
