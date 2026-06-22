package com.example.demo4.service;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Instructor;
import com.example.demo4.repository.CourseRepository;
import com.example.demo4.repository.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class CourseService
{
    @Autowired
    CourseRepository cr;
    @Autowired
    InstructorRepository ir;
    @Autowired
    ActitvityService activityService;
    
    public Collection<Course> getAllCourse()
    {
        return cr.findAll();
    }

    public Course getCourseById(int id)
    {
        Course course = cr.findById(id).orElseThrow(() -> new RuntimeException("Course not Found"));
        return course;
    }

    public Course addCourse(Course course)
    {
        Course saved = cr.save(course);
        activityService.logActivity("course", "Cataloged new course: " + saved.getCourse_id() + " - " + saved.getCourseName(), "course", saved.getId());
        return saved;
    }

    public Course updateCourse(int id ,Course updatecourse)
    {
        Course course = cr.findById(id).orElseThrow(() -> new RuntimeException("Course not Found"));
        course.setCourse_id(updatecourse.getCourse_id());
        course.setCourseName(updatecourse.getCourseName());
        course.setCredits(updatecourse.getCredits());
        course.setInstructor(updatecourse.getInstructor());
        Course saved = cr.save(course);
        activityService.logActivity("course", "Updated syllabus for course: " + saved.getCourse_id(), "course", saved.getId());
        return saved;
    }

    public String deleteCourse(int id)
    {
        Course course = cr.findById(id).orElseThrow(() -> new RuntimeException("Course not Found"));
        String courseIdStr = course.getCourse_id();
        cr.delete(course);
        activityService.logActivity("course", "Dissolved course syllabus: " + courseIdStr, "course", id);
        return "Course deleted Successfully";
    }
    public Collection<Course> getCoursesForInstructors(int instructorId)
    {
        Instructor instructor = ir.findById(instructorId);
        return cr.findAllByInstructor(instructor);
    }
}
