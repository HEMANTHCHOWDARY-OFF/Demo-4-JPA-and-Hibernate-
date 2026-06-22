package com.example.demo4.repository;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Enrollment;
import com.example.demo4.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment,Integer>
{
    List<Enrollment> findAll();

    Enrollment save(Enrollment enrollment);

    @Query("SELECT e.course FROM Enrollment e WHERE e.student.id = :id")
    List<Course> findAllByStudent(@Param("id") int id);

    @Query("SELECT e.student FROM Enrollment e WHERE e.course.id = :id")
    List<Student> findAllByCourse(@Param("id") int id);

    Enrollment findByStudentAndCourse(Student student, Course course);
}
