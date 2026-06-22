package com.example.demo4.controller;


import com.example.demo4.entity.Enrollment;
import com.example.demo4.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RequestMapping("/api/enrollments")
@RestController
@CrossOrigin("*")
public class EnrollmentController
{
    @Autowired
    EnrollmentService es;
    @GetMapping
    public Collection<Enrollment> getALlEnrollments()
    {
        return es.getALlEnrollments();
    }
    @PostMapping
    public Enrollment enrollStudent(@RequestParam int student_id,@RequestParam int course_id)
    {
        return es.enrollStudent(student_id,course_id);
    }
    @DeleteMapping
    public String removeEnrollment(@RequestParam int student_id,@RequestParam int course_id)
    {
        return es.removeEnrollment(student_id,course_id);
    }
}
