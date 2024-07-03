package com.apartmentbooking.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface MockRepository {
  @Select("SELECT title FROM dummy LIMIT 1")
  String getMockTitle();
}
