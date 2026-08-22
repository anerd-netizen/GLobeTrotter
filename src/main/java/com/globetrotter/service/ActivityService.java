package com.globetrotter.service;

import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.model.Activity;
import com.globetrotter.model.Trip;
import com.globetrotter.model.TripStop;
import com.globetrotter.model.User;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.TripStopRepository;
import com.globetrotter.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final TripStopRepository tripStopRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public ActivityService(
            ActivityRepository activityRepository,
            TripStopRepository tripStopRepository,
            TripRepository tripRepository,
            UserRepository userRepository
    ) {
        this.activityRepository = activityRepository;
        this.tripStopRepository = tripStopRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public ActivityResponse createActivity(
            Long tripId,
            Long stopId,
            Activity activity,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripStop tripStop = tripStopRepository
                .findByIdAndTrip(stopId, trip)
                .orElseThrow(() -> new RuntimeException("Trip stop not found"));

        activity.setTripStop(tripStop);

        Activity saved = activityRepository.save(activity);

        return toResponse(saved);
    }

    public List<ActivityResponse> getActivities(
            Long tripId,
            Long stopId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripStop tripStop = tripStopRepository
                .findByIdAndTrip(stopId, trip)
                .orElseThrow(() -> new RuntimeException("Trip stop not found"));

        return activityRepository
                .findByTripStopOrderByActivityDateAsc(tripStop)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteActivity(
            Long tripId,
            Long stopId,
            Long activityId,
            String email
    ) {
        User user = getUser(email);

        Trip trip = tripRepository.findByIdAndUser(tripId, user)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripStop tripStop = tripStopRepository
                .findByIdAndTrip(stopId, trip)
                .orElseThrow(() -> new RuntimeException("Trip stop not found"));

        Activity activity = activityRepository
                .findByIdAndTripStop(activityId, tripStop)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        activityRepository.delete(activity);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ActivityResponse toResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getName(),
                activity.getDescription(),
                activity.getCost(),
                activity.getDurationMinutes(),
                activity.getActivityDate(),
                activity.getTripStop().getId()
        );
    }
}
