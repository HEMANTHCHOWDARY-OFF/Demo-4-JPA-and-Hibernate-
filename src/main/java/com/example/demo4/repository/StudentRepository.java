package com.example.demo4.repository;

import com.example.demo4.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;


public interface StudentRepository extends JpaRepository<Student,Integer>
{
    List<Student> findAll();

    Optional<Student> findById(int id);

    Student save(Student student);

    void delete(Student student);


}
