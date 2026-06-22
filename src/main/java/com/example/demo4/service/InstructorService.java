package com.example.demo4.service;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Instructor;
import com.example.demo4.repository.CourseRepository;
import com.example.demo4.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@Service
public class InstructorService
{
    @Autowired
    InstructorRepository ir;
    @Autowired
    CourseRepository cr;
    @Autowired
    ActitvityService activityService;

    public Collection<Instructor> getAllInstructors()
    {
        return ir.findAll();
    }

    public Instructor getInstructorById(int id)
    {
        return ir.findById(id);
    }

    public Instructor addInstructor(Instructor instructor)
    {
        Instructor saved = ir.save(instructor);
        activityService.logActivity("instructor", "Registered new instructor: " + saved.getFullName(), "instructor", saved.getId());
        return saved;
    }

    public Instructor updateInstructor(int id,Instructor updateinstructor)
    {
        Instructor instructor =ir.findById(id);
        instructor.setFullName(updateinstructor.getFullName());
        instructor.setEmail(updateinstructor.getEmail());
        instructor.setDepartment(updateinstructor.getDepartment());
        Instructor saved = ir.save(instructor);
        activityService.logActivity("instructor", "Updated instructor profile: " + saved.getFullName(), "instructor", saved.getId());
        return saved;
    }

    public String deleteInstructor(int id)
    {
        Instructor instructor =ir.findById(id);
        String name = instructor.getFullName();
        
        List<Course> courses = cr.findAllByInstructor(instructor);
        for(Course c : courses) {
            c.setInstructor(null);
            cr.save(c);
        }
        
        ir.delete(instructor);
        activityService.logActivity("instructor", "De-registered instructor: " + name, "instructor", id);
        return "Instructor deleted Successfully";
    }
}
