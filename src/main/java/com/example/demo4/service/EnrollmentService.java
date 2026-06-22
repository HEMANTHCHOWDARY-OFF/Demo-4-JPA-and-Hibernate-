package com.example.demo4.service;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.Enrollment;
import com.example.demo4.entity.Student;
import com.example.demo4.repository.CourseRepository;
import com.example.demo4.repository.EnrollmentRepository;
import com.example.demo4.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Service
public class EnrollmentService
{
    @Autowired
    EnrollmentRepository er;
    @Autowired
    StudentRepository sr;
    @Autowired
    CourseRepository cr;
    @Autowired
    ActitvityService activityService;

    public Collection<Enrollment> getALlEnrollments()
    {
        return er.findAll();
    }

    public Enrollment enrollStudent(int student_id,int course_id)
    {
        Enrollment enrollment = new Enrollment();
        Student student = sr.findById(student_id).orElseThrow(() -> new RuntimeException("No Student Found to Enroll"));
        Course course = cr.findById(course_id).orElseThrow(() -> new RuntimeException("No Student Found to Enroll"));
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollment_date(LocalDate.now());
        Enrollment saved = er.save(enrollment);
        activityService.logActivity(
            "enroll",
            "Enrolled " + student.getFullName() + " in course: " + course.getCourse_id() + " - " + course.getCourseName(),
            "enrollment",
            saved.getId()
        );
        return saved;
    }

    public String removeEnrollment(int student_id,int course_id)
    {
        Student student = sr.findById(student_id).orElseThrow(() -> new RuntimeException("Student not Found"));
        Course course = cr.findById(course_id).orElseThrow(() -> new RuntimeException("Course not Found"));
        Enrollment enrollment  = er.findByStudentAndCourse(student,course);
        er.delete(enrollment);
        activityService.logActivity(
            "unenroll",
            "Unenrolled " + student.getFullName() + " from course: " + course.getCourse_id() + " - " + course.getCourseName(),
            "enrollment",
            student_id
        );
        return "Enrollment removed Successfully";
    }
    public Collection<Student> getStudentsForCourse(int id)
    {
        Course course = cr.findById(id).orElseThrow(() -> new RuntimeException("Course not Found"));
        return er.findAllByCourse(id);
    }
    public Collection<Course> getCoursesForStudent(int id)
    {
        Student student = sr.findById(id).orElseThrow(() -> new RuntimeException("Student no Found"));
        return er.findAllByStudent(id);
    }
}
