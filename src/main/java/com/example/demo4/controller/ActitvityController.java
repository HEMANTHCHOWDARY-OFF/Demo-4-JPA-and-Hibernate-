package com.example.demo4.controller;


import com.example.demo4.entity.Activity;
import com.example.demo4.service.ActitvityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RequestMapping("/api/activities")
@RestController
@CrossOrigin("*")
public class ActitvityController
{
    @Autowired
    ActitvityService as;
    @GetMapping
    public Collection<Activity> getActivities()
    {
        return as.getActivities();
    }
}
