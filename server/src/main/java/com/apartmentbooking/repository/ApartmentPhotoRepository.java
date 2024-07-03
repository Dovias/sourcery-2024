package com.apartmentbooking.repository;

import com.apartmentbooking.models.ApartmentPhoto;
import com.apartmentbooking.models.RoomPhoto;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@Mapper
@Repository
public interface ApartmentPhotoRepository {
    @Select("SELECT * FROM apartment_photos WHERE apartment_id = #{apartmentId}")
    List<ApartmentPhoto> findByApartmentId(@Param("apartmentId") UUID apartmentId);

    @Insert("<script>" +
            "<if test='photos != null and photos.size() > 0'>" +
            "INSERT INTO apartment_photos (id, apartment_id, photo_base64) " +
            "VALUES <foreach item='p' collection='photos' separator =', '>" +
            "(#{p.id}, #{p.apartmentId}, #{p.photoBase64})" +
            "</foreach>" +
            "</if>" +
            "</script>")
    public void insertList(List<ApartmentPhoto> photos);

    @Delete("DELETE FROM apartment_photos WHERE id = #{id}")
    public void delete(@Param("id") UUID id);

    // Can possibly execute a lot of statements. Should be refactored in the future
    @Update("<script>"
            + "<if test='photos != null and photos.size() > 0'>"
            + "<foreach item = 'p' collection = 'photos' separator = '; ' >"
            + "UPDATE apartment_photos SET "
            + "apartment_id = #{p.apartmentId}, photo_base64 = #{p.photoBase64} "
            + "WHERE id = #{p.id}"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void updateList(List<ApartmentPhoto> photos);

    // Can possibly execute a lot of statements. Should be refactored in the future
    @Delete("<script>"
            + "<if test='photos != null and photos.size() > 0'>"
            + "<foreach item = 'p' collection = 'photos' separator = '; ' >"
            + "DELETE from apartment_photos where id = #{p.id}"
            + "</foreach>"
            + "</if>"
            + "</script>")
    void deleteList(List<ApartmentPhoto> photos);
}
