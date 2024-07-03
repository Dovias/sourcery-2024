package com.apartmentbooking.repository;

import com.apartmentbooking.models.Apartment;
import com.apartmentbooking.models.Employee;
import com.apartmentbooking.models.Room;
import com.apartmentbooking.models.Stay;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface StayRepository {
    @Insert("INSERT INTO stays "
            + "(id, room_id, employee_id, start_date, end_date, note, apartment_id)"
            + " VALUES (#{id}, #{roomId}, #{employeeId}, #{start}, #{end}, #{note}, #{apartmentId})")
    void insert(Stay stay);

    @Select("SELECT * FROM stays WHERE id = #{id}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "room", column = "room_id", javaType = Room.class, one = @One(select = "com.apartmentbooking.repository.RoomRepository.findById")),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById")),
            @Result(property = "apartment", column = "apartment_id", javaType = Apartment.class, one = @One(select = "com.apartmentbooking.repository.ApartmentRepository.findById"))
    })
    Optional<Stay> findById(@Param("id") UUID id);

    @Select("SELECT * FROM stays WHERE room_id = #{id}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById"))
    })
    List<Stay> findByRoomId(@Param("id") UUID id);

    @Select("SELECT * FROM stays")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "room", column = "room_id", javaType = Room.class, one = @One(select = "com.apartmentbooking.repository.RoomRepository.findById")),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById")),
            @Result(property = "apartment", column = "apartment_id", javaType = Apartment.class, one = @One(select = "com.apartmentbooking.repository.ApartmentRepository.findById"))
    })
    List<Stay> findAll();

    @Select("SELECT * FROM stays ORDER BY start_date ${sortOrder}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "room", column = "room_id", javaType = Room.class, one = @One(select = "com.apartmentbooking.repository.RoomRepository.findById")),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById")),
            @Result(property = "apartment", column = "apartment_id", javaType = Apartment.class, one = @One(select = "com.apartmentbooking.repository.ApartmentRepository.findById"))
    })
    List<Stay> findAllSorted(@Param("sortOrder") String sortOrder);

    @Select("SELECT stays.* FROM stays"
            +" INNER JOIN employees e ON e.id = stays.employee_id"
            +" INNER JOIN apartments a ON a.id = stays.apartment_id"
            +" INNER JOIN rooms r ON r.id = stays.room_id"
            +" WHERE LOWER(e.first_name) like #{SearchQuery}"
            +" OR LOWER(e.last_name) like #{SearchQuery}"
            +" OR LOWER(a.name) like #{SearchQuery}"
            +" OR LOWER(r.name) like #{SearchQuery}"
            +" ORDER BY start_date ${sortOrder}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "room", column = "room_id", javaType = Room.class, one = @One(select = "com.apartmentbooking.repository.RoomRepository.findById")),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById")),
            @Result(property = "apartment", column = "apartment_id", javaType = Apartment.class, one = @One(select = "com.apartmentbooking.repository.ApartmentRepository.findById"))
    })
    List<Stay> findAllSortedWithSearch(@Param("sortOrder") String sortOrder,String SearchQuery);

    @Select("SELECT * FROM stays WHERE employee_id = #{id} ORDER BY start_date ${sortOrder}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "room", column = "room_id", javaType = Room.class, one = @One(select = "com.apartmentbooking.repository.RoomRepository.findById")),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById")),
            @Result(property = "apartment", column = "apartment_id", javaType = Apartment.class, one = @One(select = "com.apartmentbooking.repository.ApartmentRepository.findById"))
    })
    List<Stay> findByEmployeeIdSorted(@Param("id") UUID id, @Param("sortOrder") String sortOrder);

    @Select("SELECT stays.* FROM stays"
            +" INNER JOIN employees e ON e.id = stays.employee_id"
            +" INNER JOIN apartments a ON a.id = stays.apartment_id"
            +" INNER JOIN rooms r ON r.id = stays.room_id"
            +" WHERE e.id = #{id}"
            +" AND (LOWER(a.name) like #{SearchQuery}"
            +" OR LOWER(r.name) like #{SearchQuery})"
            +" ORDER BY start_date ${sortOrder}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "note", column = "note"),
            @Result(property = "start", column = "start_date"),
            @Result(property = "end", column = "end_date"),
            @Result(property = "employeeId", column = "employee_id"),
            @Result(property = "roomId", column = "room_id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "room", column = "room_id", javaType = Room.class, one = @One(select = "com.apartmentbooking.repository.RoomRepository.findById")),
            @Result(property = "employee", column = "employee_id", javaType = Employee.class, one = @One(select = "com.apartmentbooking.repository.EmployeeRepository.findById")),
            @Result(property = "apartment", column = "apartment_id", javaType = Apartment.class, one = @One(select = "com.apartmentbooking.repository.ApartmentRepository.findById"))
    })
    List<Stay> findByEmployeeIdSortedWithSearch(@Param("id") UUID id, @Param("sortOrder") String sortOrder,String SearchQuery);

    @Update("UPDATE stays SET room_id = #{roomId}, employee_id = #{employeeId}, apartment_id = #{apartmentId}, "
            + "start_date = #{start}, end_date = #{end}, note = #{note} WHERE id = #{id}")
    void update(Stay stay);

    @Delete("DELETE from stays where id = #{id}")
    void delete(@Param("id") UUID id);

    @Select("SELECT COUNT(*) FROM stays " +
            "WHERE room_id = #{roomId} " +
            "AND (#{startDate} < end_date AND start_date < #{endDate})")
    int countOverlappingStays(@Param("roomId") UUID roomId, @Param("startDate") LocalDate startDate,
                              @Param("endDate") LocalDate endDate);

    @Select("SELECT COUNT(*) FROM stays " +
            "WHERE room_id = #{roomId} " +
            "AND id <> #{stayId} " +
            "AND (#{startDate} < end_date AND start_date < #{endDate})")
    int countOverlappingStaysExcludingItself(@Param("roomId") UUID roomId, @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate, @Param("stayId") UUID stayId);

}
