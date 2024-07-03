package com.apartmentbooking.repository;

import com.apartmentbooking.models.Room;
import com.apartmentbooking.models.RoomPhoto;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Mapper
@Repository
public interface RoomPhotoRepository {
    @Select("SELECT * FROM room_photos WHERE room_id = #{roomId}")
    List<RoomPhoto> findByRoomId(@Param("roomId") UUID roomId);

    @Insert("<script>" +
            "<if test='photos != null and photos.size() > 0'>" +
            "INSERT INTO room_photos (id, room_id, photo_base64) " +
            "VALUES <foreach item='p' collection='photos' separator =', '>" +
            "(#{p.id}, #{p.roomId}, #{p.photoBase64})" +
            "</foreach>" +
            "</if>" +
            "</script>")
    public void insertList(List<RoomPhoto> photos);

    // Can possibly execute a lot of statements. Should be refactored in the future
    @Update("<script>"
            + "<if test='photos != null and photos.size() > 0'>"
            + "<foreach item = 'p' collection = 'photos' separator = '; ' >"
            + "UPDATE room_photos SET "
            + "room_id = #{p.roomId}, photo_base64 = #{p.photoBase64} "
            + "WHERE id = #{p.id}"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void updateList(List<RoomPhoto> photos);

    // Can possibly execute a lot of statements. Should be refactored in the future
    @Delete("<script>"
            + "<if test='photos != null and photos.size() > 0'>"
            + "<foreach item = 'p' collection = 'photos' separator = '; ' >"
            + "DELETE from room_photos where id = #{p.id}"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void deleteList(List<RoomPhoto> photos);
}
