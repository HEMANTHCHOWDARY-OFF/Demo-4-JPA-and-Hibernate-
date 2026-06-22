package com.example.demo4.repository;

import com.example.demo4.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface InstructorRepository extends JpaRepository<Instructor,Integer>
{
    List<Instructor> findAll();

    Instructor findById(int id);

    Instructor save(Instructor instructor);

    void delete(Instructor instructor);

}
