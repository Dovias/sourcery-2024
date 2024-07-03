package com.apartmentbooking.repository;

import com.apartmentbooking.models.Apartment;
import com.apartmentbooking.models.Role;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Mapper
@Repository
public interface RoleRepository {
    @Insert("INSERT INTO roles "
            + "(role_id, role_name)"
            + " VALUES (#{roleId}, #{roleName})")
    public void insert(Role role);

    @Select("SELECT * FROM roles WHERE role_id = #{roleId}")
    Optional<Role> findById(@Param("roleId") int roleId);

    @Select("SELECT * FROM roles WHERE role_name = #{roleName}")
    Optional<Role> findByName(@Param("roleName") String roleName);

    @Select("SELECT * FROM roles")
    List<Role> findAll();

    @Update("UPDATE roles SET role_name = #{roleName} WHERE role_id = #{roleId}")
    void update(Role role);

    @Delete("DELETE from roles where role_id = #{roleId}")
    void delete(@Param("roleId") int roleId);
}
