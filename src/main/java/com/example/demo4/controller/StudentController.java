package com.example.demo4.controller;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Student;
import com.example.demo4.service.EnrollmentService;
import com.example.demo4.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin("*")
public class StudentController
{
    @Autowired
    StudentService ss;
    @Autowired
    EnrollmentService es;
    @GetMapping
    public Collection<Student> getAllStudents()
    {
        return ss.getAllStudents();
    }
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable int id)
    {
        return ss.getStudentById(id);
    }
    @PostMapping
    public Student addStudent(@RequestBody Student student)
    {
        return ss.addStudent(student);
    }
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable int id,@RequestBody Student student)
    {
        return ss.updateStudent(id,student);
    }
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id)
    {
        return ss.deleteStudent(id);
    }
    @GetMapping("/{studentId}/courses")
    public Collection<Course> getCoursesForStudent(@PathVariable int studentId)
    {
        return es.getCoursesForStudent(studentId);
    }
}
