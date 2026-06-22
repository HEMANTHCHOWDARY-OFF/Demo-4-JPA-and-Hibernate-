package com.example.demo4.repository;


import com.example.demo4.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ActivityRepository extends JpaRepository<Activity,Integer>
{
    List<Activity> findAll();
    List<Activity> findTop10ByOrderByIdDesc();
}
