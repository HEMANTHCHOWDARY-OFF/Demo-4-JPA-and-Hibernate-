package com.example.demo4.repository;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface CourseRepository extends JpaRepository<Course,Integer>
{
        List<Course> findAll();

        Optional<Course> findById(int id);

        void delete(Course course);

        Course save(Course course);

        List<Course>  findAllByInstructor(Instructor instructor);
}

