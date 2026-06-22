package com.example.demo4.service;

import com.example.demo4.entity.Activity;
import com.example.demo4.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class ActitvityService
{
    @Autowired
    ActivityRepository ar;
    public Collection<Activity> getActivities()
    {
        return ar.findTop10ByOrderByIdDesc();
    }

    public void logActivity(String type, String desc, String entityType, int entityId) {
        Activity act = new Activity();
        act.setActivity_type(type);
        act.setDescription(desc);
        act.setEntity_type(entityType);
        act.setEntity_id(entityId);
        act.setCreated_at(java.time.LocalDate.now());
        ar.save(act);
    }
}
