package com.apartmentbooking.repository;

import com.apartmentbooking.models.Apartment;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface ApartmentRepository {
    @Insert("INSERT INTO apartments "
            + "(id, name, description, country, city, postal_code, address)"
            + " VALUES (#{id}, #{name}, #{description}, #{country}, #{city}, #{postalCode}, #{address})")
    void insert(Apartment apartment);

    @Select("SELECT * " +
            "FROM apartments " +
            "WHERE id = #{id} ")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "name", column = "name"),
            @Result(property = "description", column = "description"),
            @Result(property = "country", column = "country"),
            @Result(property = "city", column = "city"),
            @Result(property = "address", column = "address"),
            @Result(property = "postalCode", column = "postal_code"),
            @Result(property = "rooms", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.RoomRepository.findByApartmentId"
            )),
            @Result(property = "photos64", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.ApartmentPhotoRepository.findByApartmentId"
            ))
    })
    Optional<Apartment> findById(@Param("id") UUID id);

    @Select("SELECT * FROM apartments")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "name", column = "name"),
            @Result(property = "description", column = "description"),
            @Result(property = "country", column = "country"),
            @Result(property = "city", column = "city"),
            @Result(property = "address", column = "address"),
            @Result(property = "postalCode", column = "postal_code"),
            @Result(property = "rooms", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.RoomRepository.findByApartmentId"
            )),
            @Result(property = "photos64", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.ApartmentPhotoRepository.findByApartmentId"
            ))
    })
    List<Apartment> findAll();
    @Select("SELECT * FROM apartments WHERE LOWER(name) like #{SearchQuery} "
            +"OR LOWER(city) like #{SearchQuery} OR LOWER(address) like #{SearchQuery} "
            +"OR LOWER(postal_code) like #{SearchQuery} OR LOWER(description) like #{SearchQuery}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "name", column = "name"),
            @Result(property = "description", column = "description"),
            @Result(property = "country", column = "country"),
            @Result(property = "city", column = "city"),
            @Result(property = "address", column = "address"),
            @Result(property = "postalCode", column = "postal_code"),
            @Result(property = "rooms", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.RoomRepository.findByApartmentId"
            )),
            @Result(property = "photos64", column = "id", javaType = List.class, many = @Many(
                    select = "com.apartmentbooking.repository.ApartmentPhotoRepository.findByApartmentId"
            ))
    })
    List<Apartment> findAllWithSearch(String SearchQuery);

    @Update("UPDATE apartments SET name = #{name}, description = #{description}, "
            + "country = #{country}, city = #{city}, postal_code = #{postalCode}, address = #{address} WHERE id = #{id}")
    void update(Apartment apartment);

    @Delete("DELETE from apartments where id = #{id}")
    void delete(@Param("id") UUID id);
}
