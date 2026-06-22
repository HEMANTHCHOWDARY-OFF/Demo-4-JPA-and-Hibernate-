package com.example.demo4.controller;


import com.example.demo4.entity.Course;
import com.example.demo4.entity.CourseVideo;
import com.example.demo4.entity.Student;
import com.example.demo4.service.CourseService;
import com.example.demo4.service.CourseVideoService;
import com.example.demo4.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin("*")
public class CourseController
{
    @Autowired
    CourseService cs;
    @Autowired
    EnrollmentService es;
    @Autowired
    CourseVideoService cvs;
    @GetMapping
    public Collection<Course> getAllCourse()
    {
        return cs.getAllCourse();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable int id)
    {
        return cs.getCourseById(id);
    }

    @PostMapping
    public Course addCourse(@RequestBody Course course)
    {
        return cs.addCourse(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable int id , @RequestBody Course course)
    {
        return cs.updateCourse(id,course);
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable int id)
    {
        return cs.deleteCourse(id);
    }
    @GetMapping("/{courseId}/students")
    public Collection<Student> getStudentsForCourse(@PathVariable int courseId)
    {
        return es.getStudentsForCourse(courseId);
    }
    @GetMapping("/{courseId}/videos")
    public Collection<CourseVideo> getVideosForCourse(@PathVariable int courseId)
    {
        return cvs.getVideosForCourse(courseId);
    }
    @PostMapping("/{courseId}/videos")
    public String addVideosForCourse(@PathVariable int courseId , @RequestParam("files") List<MultipartFile> files)
    {
        return cvs.addVideosForCourse(courseId,files );
    }
    @DeleteMapping("{courseId}/videos")
    public String removeVideoFromCourse(@PathVariable int courseId , @RequestParam String Objecturl)
    {
        return cvs.removeVideoFromCourse(courseId,Objecturl);
    }

}
