package com.example.demo4.controller;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Instructor;
import com.example.demo4.service.CourseService;
import com.example.demo4.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/instructors")
public class InstructorController
{
    @Autowired
    InstructorService is;
    @Autowired
    CourseService cs;

    @GetMapping
    public Collection<Instructor> getAllInstructors()
    {
        return is.getAllInstructors();
    }

    @GetMapping("/{id}")
    public Instructor getInstructorById(@PathVariable int id)
    {
        return is.getInstructorById(id);
    }

    @PostMapping
    public Instructor addInstructor(@RequestBody Instructor instructor)
    {
        return is.addInstructor(instructor);
    }

    @PutMapping("/{id}")
    public Instructor updateInstructor(@PathVariable int id,@RequestBody Instructor instructor)
    {
        return is.updateInstructor(id,instructor);
    }

    @DeleteMapping("/{id}")
    public String deleteInstructor(@PathVariable int id)
    {
        return is.deleteInstructor(id);
    }

    @GetMapping("/{instructorId}/courses")
    public Collection<Course> getCoursesForInstructors(@PathVariable int instructorId)
    {
        return cs.getCoursesForInstructors(instructorId);
    }
}
