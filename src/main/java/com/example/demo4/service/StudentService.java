package com.example.demo4.service;

import com.example.demo4.entity.Student;
import com.example.demo4.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Service
public class StudentService
{
    @Autowired
    StudentRepository sr;
    @Autowired
    ActitvityService activityService;
    
    public Collection<Student> getAllStudents()
    {
        return sr.findAll();
    }
    public Student getStudentById(int id)
    {
        Student student = sr.findById(id).orElseThrow(() -> new RuntimeException("Student not Found"));
        return student;
    }
    public Student addStudent(Student student)
    {
        Student saved = sr.save(student);
        activityService.logActivity("student", "Registered new student: " + saved.getFullName(), "student", saved.getId());
        return saved;
    }
    public Student updateStudent(int id,Student updatedstudent)
    {
        Student student = sr.findById(id).orElseThrow(() -> new RuntimeException("Student Not Found"));
        student.setFullName(updatedstudent.getFullName());
        student.setAge(updatedstudent.getAge());
        student.setEmail(updatedstudent.getEmail());
        student.setProgram(updatedstudent.getProgram());

        Student saved = sr.save(student);
        activityService.logActivity("student", "Updated profile for student: " + saved.getFullName(), "student", saved.getId());
        return saved;
    }
    public String deleteStudent(int id)
    {
        Student student = sr.findById(id).orElseThrow(() -> new RuntimeException("StudentNotFound"));
        String name = student.getFullName();
        sr.delete(student);
        activityService.logActivity("student", "Deleted student profile: " + name, "student", id);
        return "Student Deleted Succesfully";
    }
}
