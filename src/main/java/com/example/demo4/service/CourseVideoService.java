package com.example.demo4.service;

import com.example.demo4.entity.Course;
import com.example.demo4.entity.CourseVideo;
import com.example.demo4.repository.CourseRepository;
import com.example.demo4.repository.CourseVideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Service
public class CourseVideoService
{
    @Autowired
    CourseVideoRepository cvr;
    @Autowired
    CourseRepository cr;
    public Collection<CourseVideo> getVideosForCourse(int course_id)
    {
        Course course = cr.findById(course_id).orElseThrow(() -> new RuntimeException("Course not Found"));
        return cvr.findAllByCourse(course);
    }
    public String addVideosForCourse(int course_id,List<MultipartFile> files)
    {
        Course course = cr.findById(course_id).orElseThrow(() ->
                        new RuntimeException("Course not found"));

        for (MultipartFile file : files)
        {
            CourseVideo video = new CourseVideo();
            video.setFileName(file.getOriginalFilename());
            video.setSize((int) file.getSize());
            video.setUpload_date(LocalDate.now());
            video.setUrl("/videos/" + file.getOriginalFilename());
            video.setCourse(course);
            CourseVideo cv = cvr.save(video);
        }
        return "Videos added Successfully";
    }
    public String removeVideoFromCourse(int course_id,String Objecturl)
    {
        Course course = cr.findById(course_id).orElseThrow(() ->
                new RuntimeException("Course not found"));

        cvr.deleteAllByUrl(Objecturl);
        return "Video removed Successfully";
    }
}
