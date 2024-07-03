package com.apartmentbooking.repository;

import com.apartmentbooking.models.Employee;
import com.apartmentbooking.models.Role;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface EmployeeRepository {
    @Insert("INSERT INTO employees "
            + "(id, googleId, first_name, last_name, email, job_title, city, country, password_hash, role_id, profile_base64)"
            + " VALUES (#{id}, #{googleId}, #{firstName}, #{lastName}, #{email}, #{jobTitle}, #{city}, #{country}, #{passwordHash}, #{role.roleId}, #{profileBase64})")
    public void insert(Employee employee);

    @Select("SELECT * FROM employees WHERE id = #{id}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "googleId", column = "googleId"),
            @Result(property = "firstName", column = "first_name"),
            @Result(property = "lastName", column = "last_name"),
            @Result(property = "email", column = "email"),
            @Result(property = "jobTitle", column = "job_title"),
            @Result(property = "city", column = "city"),
            @Result(property = "country", column = "country"),
            @Result(property = "passwordHash", column = "password_hash"),
            @Result(property = "profileBase64", column = "profile_base64"),
            @Result(property = "role", column = "role_id",
                    javaType = Role.class,
                    one = @One(select = "com.apartmentbooking.repository.RoleRepository.findById"))
    })
    Optional<Employee> findById(@Param("id") UUID id);

    @Select("SELECT * FROM employees WHERE email = #{email}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "googleId", column = "googleId"),
            @Result(property = "firstName", column = "first_name"),
            @Result(property = "lastName", column = "last_name"),
            @Result(property = "email", column = "email"),
            @Result(property = "jobTitle", column = "job_title"),
            @Result(property = "city", column = "city"),
            @Result(property = "country", column = "country"),
            @Result(property = "passwordHash", column = "password_hash"),
            @Result(property = "profileBase64", column = "profile_base64"),
            @Result(property = "role", column = "role_id",
                    javaType = Role.class,
                    one = @One(select = "com.apartmentbooking.repository.RoleRepository.findById"))
    })
    Optional<Employee> findByEmail(@Param("email") String email);

    @Select("SELECT * FROM employees WHERE googleId = #{googleId}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "googleId", column = "googleId"),
            @Result(property = "firstName", column = "first_name"),
            @Result(property = "lastName", column = "last_name"),
            @Result(property = "email", column = "email"),
            @Result(property = "jobTitle", column = "job_title"),
            @Result(property = "city", column = "city"),
            @Result(property = "country", column = "country"),
            @Result(property = "passwordHash", column = "password_hash"),
            @Result(property = "profileBase64", column = "profile_base64"),
            @Result(property = "role", column = "role_id",
                    javaType = Role.class,
                    one = @One(select = "com.apartmentbooking.repository.RoleRepository.findById"))
    })
    Optional<Employee> findByGoogleId(@Param("googleId") String googleId);

    @Select("SELECT * FROM employees ORDER BY first_name ASC")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "googleId", column = "googleId"),
            @Result(property = "firstName", column = "first_name"),
            @Result(property = "lastName", column = "last_name"),
            @Result(property = "email", column = "email"),
            @Result(property = "jobTitle", column = "job_title"),
            @Result(property = "city", column = "city"),
            @Result(property = "country", column = "country"),
            @Result(property = "passwordHash", column = "password_hash"),
            @Result(property = "profileBase64", column = "profile_base64"),
            @Result(property = "role", column = "role_id",
                    javaType = Role.class,
                    one = @One(select = "com.apartmentbooking.repository.RoleRepository.findById"))
    })
    List<Employee> findAll();

    @Select("SELECT * FROM employees WHERE LOWER(first_name) like #{SearchQuery} "
            +"OR LOWER(last_name) like #{SearchQuery} OR LOWER(job_title) like #{SearchQuery} "
            +"OR LOWER(city) like #{SearchQuery} OR LOWER(country) like #{SearchQuery}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "googleId", column = "googleId"),
            @Result(property = "firstName", column = "first_name"),
            @Result(property = "lastName", column = "last_name"),
            @Result(property = "email", column = "email"),
            @Result(property = "jobTitle", column = "job_title"),
            @Result(property = "city", column = "city"),
            @Result(property = "country", column = "country"),
            @Result(property = "passwordHash", column = "password_hash"),
            @Result(property = "profileBase64", column = "profile_base64"),
            @Result(property = "role", column = "role_id",
                    javaType = Role.class,
                    one = @One(select = "com.apartmentbooking.repository.RoleRepository.findById"))
    })
    List<Employee> findAllWithSearch(String SearchQuery);

    @Update("UPDATE employees SET googleId = #{googleId}, first_name = #{firstName}, last_name = #{lastName}, "
            + "email = #{email}, job_title = #{jobTitle}, city = #{city}, country = #{country}, "
            + "password_hash = #{passwordHash}, role_id = #{role.roleId},"
            + "profile_base64 = #{profileBase64} WHERE id = #{id}")
    void update(Employee employee);

    @Delete("DELETE from employees where id = #{id}")
    void delete(@Param("id") UUID id);
}
