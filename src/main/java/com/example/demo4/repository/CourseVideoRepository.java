package com.example.demo4.repository;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.CourseVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CourseVideoRepository extends JpaRepository<CourseVideo,Integer>
{
    List<CourseVideo> findAllByCourse(Course course);

    CourseVideo save(MultipartFile file);

    void deleteAllByUrl(String Objecturl);
}
