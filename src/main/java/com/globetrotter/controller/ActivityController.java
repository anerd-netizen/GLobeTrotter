package com.globetrotter.controller;

import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.model.Activity;
import com.globetrotter.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/stops/{stopId}/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(
            @PathVariable Long tripId,
            @PathVariable Long stopId,
            @RequestBody Activity activity,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                activityService.createActivity(
                        tripId,
                        stopId,
                        activity,
                        email
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getActivities(
            @PathVariable Long tripId,
            @PathVariable Long stopId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                activityService.getActivities(
                        tripId,
                        stopId,
                        email
                )
        );
    }

    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long tripId,
            @PathVariable Long stopId,
            @PathVariable Long activityId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        activityService.deleteActivity(
                tripId,
                stopId,
                activityId,
                email
        );

        return ResponseEntity.noContent().build();
    }
}