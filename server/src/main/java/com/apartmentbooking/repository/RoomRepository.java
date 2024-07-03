package com.apartmentbooking.repository;

import com.apartmentbooking.models.Room;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface RoomRepository {
    @Insert("<script>"
            + "<if test='rooms != null and rooms.size() > 0'>"
            + "INSERT INTO rooms "
            + "(id, apartment_id, name, capacity)"
            + " VALUES <foreach item = 'r' collection = 'rooms' separator = ', ' >"
            + "(#{r.id}, #{r.apartmentId}, #{r.name}, #{r.capacity})"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void insertList(List<Room> rooms);

    @Select("SELECT * FROM rooms WHERE id = #{id}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "capacity", column = "capacity"),
            @Result(property = "name", column = "name"),
            @Result(property = "photos", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.RoomPhotoRepository.findByRoomId"
            )),
    })
    Optional<Room> findById(@Param("id") UUID id);


    @Select("SELECT * FROM rooms")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "name", column = "name"),
            @Result(property = "capacity", column = "capacity"),
            @Result(property = "stays", column = "id", javaType = List.class, many = @Many(select = "com.apartmentbooking.repository.StayRepository.findByRoomId")),
    })
    List<Room> findAll();

    @Select("SELECT * FROM rooms WHERE apartment_id = #{apartment}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "apartmentId", column = "apartment_id"),
            @Result(property = "capacity", column = "capacity"),
            @Result(property = "name", column = "name"),
            @Result(property = "photos", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.RoomPhotoRepository.findByRoomId"
            )),
    })
    List<Room> findByApartmentId(@Param("apartment") UUID apartment);

    @Update("UPDATE rooms SET apartment_id = #{apartment}, name = #{name}, capacity = #{capacity} WHERE id = #{id}")
    void update(Room room);

    // Can possibly execute a lot of statements. Should be refactored in the future
    @Update("<script>"
            + "<if test='rooms != null and rooms.size() > 0'>"
            + "<foreach item = 'r' collection = 'rooms' separator = '; ' >"
            + "UPDATE rooms SET "
            + "apartment_id = #{r.apartmentId}, name = #{r.name}, capacity = #{r.capacity} "
            + "WHERE id = #{r.id}"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void updateList(List<Room> rooms);

    // Can possibly execute a lot of statements. Should be refactored in the future
    @Delete("<script>"
            + "<if test='rooms != null and rooms.size() > 0'>"
            + "<foreach item = 'r' collection = 'rooms' separator = '; ' >"
            + "DELETE from rooms where id = #{r.id}"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void deleteList(List<Room> rooms);

    @Delete("DELETE from rooms where id = #{id}")
    void delete(@Param("id") UUID id);
}
